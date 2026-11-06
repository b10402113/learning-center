# 資料庫才是唯一真相來源

確認批准是 harness 的政策之後，接著要讓這個政策在多步驟流程中真的可運作。當背景代理人（Agent）決定執行敏感動作時，流程往往無法直接往下走，而必須停下來等待人工審批。這類審批是非同步的，管理人員可能在一分鐘後點擊核准，也可能過了一星期才打開收件匣處理。

這段時間差帶來了一個關鍵問題：當人終於點下核准時，系統該如何確認這個動作所依據的環境狀態依然有效？

### 記錄動作與狀態版本

處理審批的第一步，是把代理人打算執行的動作記錄在自己的應用程式資料庫中，而不是只依賴工作流程引擎的內部記憶體。將應用程式邏輯存入資料庫，不僅能在使用者按下按鈕時精確還原動作，也方便在儀表板統一列出所有待審批項目。

審批資料表需要記錄動作名稱、參數，以及建立當下的狀態資訊：

<!--image:1-->

<!-- source: sources/background-agent/20261105/server/schema.ts#L92-L108 -->

```typescript
export const approvals = pgTable('approvals', {
  id: uuid('id').primaryKey(),
  environmentId: uuid('lab_id')
    .notNull()
    .references(() => environments.id),
  runId: uuid('run_id')
    .notNull()
    .references(() => runs.id),
  actionId: text('action_id').notNull(),
  action: text('action').notNull(),
  input: jsonb('input').$type<Record<string, unknown>>().notNull(),
  status: text('status').notNull(),
  reason: text('reason'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  decidedAt: timestamp('decided_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
```

在送出審批時，環境可能持續在變動。如果審批送出時系統處於狀態 A，一週後審批通過時系統已經變成狀態 B，直接執行原先的動作很可能會產生非預期的後果。

為了識別這種過期提案（stale proposal），我們不需要每次都把整包環境快照塞進資料庫，只要在環境狀態變更時遞增版本號，並在提案的 `input` 帶入當下的版本號 `expectedVersion`：

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L175-L212 -->

```typescript
export async function proposeAction(
  environmentId: string,
  runId: string,
  actionId: string,
  action: ActionName,
  input: Record<string, unknown>,
) {
  const [proposal] = await db
    .insert(approvals)
    .values({
      id: randomUUID(),
      environmentId,
      runId,
      actionId,
      action,
      input,
      status: 'pending',
      expiresAt: new Date(Date.now() + 10 * 60_000),
    })
    .returning()
  await setRun(
    runId,
    action === 'request_help' ? 'needs_help' : 'needs_approval',
    action === 'request_help'
      ? 'Waiting for an answer'
      : `Waiting for ${action.replaceAll('_', ' ')} approval`,
  )
  await logAgentActivity(
    environmentId,
    runId,
    'human',
    action === 'request_help'
      ? 'Asked a human for help'
      : `Requested approval for ${action.replaceAll('_', ' ')}`,
    { proposalId: proposal.id, ...input },
  )
  return proposal
}
```

### 為什麼不直接沿用變數？

在工作流程程式碼中，最直覺的寫法往往是建立提案後，直接把該物件傳遞給後續的邏輯使用。但在非同步工作流程中，這樣做會踩進隱藏的陷阱：

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L141-L158 -->

```typescript
      const actionId = `${runId}:${cycle}:${decision.action}`
      const policy = actionPolicy[decision.action]
      if (policy === 'approval' || policy === 'help') {
        const input =
          policy === 'help'
            ? { question: decision.detail }
            : { expectedVersion: state.world.version }
        const proposalId = await step.run(`propose-action-${cycle}`, async () => {
          const proposal = await proposeAction(
            environmentId,
            runId,
            actionId,
            decision.action,
            input,
          )
          return proposal.id
        })
        let proposal = await step.run(`read-human-${cycle}`, () => getProposal(proposalId))
```

在上述工作流程中，建立提案的步驟只回傳了 `proposal.id`，緊接著的下一步卻重新呼叫 `getProposal(proposalId)` 從資料庫把資料讀出來。

<!--image:2-->

這樣看似多此一舉的設計，是為了避免使用過期的區域變數。工作流程在步驟之間可能中斷、重試，服務也可能在兩個步驟之間重啟；更重要的是，外部人員隨時可能透過介面介入處理或修改資料。

如果直接沿用記憶體裡的變數，流程拿到的就是舊時空下的快取複本。只在第一步回傳 ID、下一步立刻重新向資料庫查詢，才能保證後續邏輯拿到的永遠是通過資料庫交易約束後的最新狀態。讓資料庫成為唯一的真相來源，系統才不會在多步驟與長時間等待的非同步流程中迷失。
