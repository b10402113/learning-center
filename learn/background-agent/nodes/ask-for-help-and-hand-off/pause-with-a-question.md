# Agent 需要資訊

既然求助是合法決策，接著要看 harness 怎麼把一個問題真正送到人面前。當 Agent 在自主執行過程中遇到缺少關鍵資訊或脈絡不足的狀況時，它不能盲目猜測，必須停下來向人類操作員求助。

在系統設計上，我們不需要替「提問」額外打造一套全新的非同步架構。「請求協助（help）」和「請求審批（approval）」的本質幾乎相同：兩者都需要建立一筆被持久化儲存的提案（proposal）、將工作流程暫停，並等待人類做出決定後再繼續執行。

### 統一處理審批與求助策略

在工作流程的決策循環中，我們可以把 `approval` 與 `help` 這兩種策略合併到同一個處理路徑。主要的差別只在於傳入提案的資料內容：一般操作的審批需要附帶預期的系統版本，而求助策略則只需要把 Agent 提出的問題作為輸入。

<!--image:1-->

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L141-L170 -->

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
        let check = 0
        while (proposal.status === 'pending') {
          check++
          await step.waitForEvent(`wait-for-human-${cycle}-${check}`, {
            event: 'agent/approval.decided',
            if: `async.data.proposalId == "${proposalId}"`,
            timeout: '10s',
          })
          proposal = await step.run(`reconcile-human-${cycle}-${check}`, () =>
            getProposal(proposalId),
          )
        }
```

工作流程建立提案後，會使用事件等待機制（例如監聽 `agent/approval.decided` 事件），直到操作員針對該提案做出回覆為止。

### 建立提案並切換執行狀態

當工作流程呼叫資料存取層的 `proposeAction` 時，底層同樣將這筆請求寫入 `approvals` 資料表，但會依據動作名稱（`action`）區分當前的運作狀態。

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

如果動作是 `request_help`，當前執行的狀態會被設為 `needs_help`，提示訊息顯示為等待回答；若是其他敏感操作，狀態則保持為 `needs_approval`。這能讓監控面板明確區分 Agent 現在是卡在權限審批，還是正在等待補充資訊。

<!--image:2-->

### 操作員收件匣與回覆機制

在前端的操作員收件匣（Operator Inbox）中，只要讀取同一份待處理清單，就能根據動作名稱顯示對應的提示文字。

<!-- source: sources/background-agent/20261105/web/src/App.tsx#L415-L421 -->

```tsx
                          <b>
                            {item.action === 'request_help'
                              ? 'Needs your answer'
                              : `Approve ${label(item.action)}?`}
                          </b>
                          <small>
                            Run {item.runId.slice(0, 8)} · {label(item.action)}
                          </small>
```

操作員看見提問並在介面上回答或做決定後，前端依然打向通用的決策端點：

<!--image:3-->

<!-- source: sources/background-agent/20261105/server/operator.ts#L40-L49 -->

```typescript
app.post('/api/approvals/decide', async (request, response) => {
  const input = z
    .object({
      approvalId: id,
      decision: z.enum(['approved', 'rejected']),
      reason: z.string().max(1000).optional(),
    })
    .parse(request.body)
  response.json(await decideProposal(input.approvalId, input.decision, input.reason))
})
```

這個端點呼叫 `decideProposal` 寫入決策並發出事件，工作流程便能解除 `needs_help` 的等待迴圈，帶著操作員提供的資訊繼續推進下一個執行循環。
