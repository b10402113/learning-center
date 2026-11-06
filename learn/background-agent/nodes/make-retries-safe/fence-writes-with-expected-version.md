# 帶著觀察到的版本改狀態

穩定的 actionId 解決了「同一意圖」的辨識，接著要處理狀態本身被改動的競態。當自動化代理人（Agent）觀察到系統故障，決定執行修改狀態的動作時，最怕遇到的問題就是競態條件（Race Condition）。從代理人讀取狀態、向人類請求批准，到真正發出寫入請求，中間可能隔了幾秒甚至幾分鐘。如果在這段時間內系統狀態已經被手動修復或其他程序修改，直接覆蓋舊狀態就會造成非預期的後果。

要避免過期寫入，核心做法是讓每次修改動作都帶上當時觀察到的版本號（`expectedVersion`），並由目標服務在真正寫入前做最後把關。

### 在觀察快照中記錄版本

每一次觀察環境時，回傳的狀態快照都必須附帶一個整數版本號：

<!--image:1-->

<!-- source: sources/background-agent/20261105/server/observe.ts#L5-L9 -->

```typescript
const snapshotSchema = z.object({
  instanceId: z.string().uuid(),
  version: z.number().int(),
  state: z.record(z.string(), z.unknown()),
})
```

代理人的控制流程（Harness）會依據操作政策區分工具類別。純讀取的動作不需要受限於版本，但所有會變更系統狀態的寫入或核准動作，都必須綁定該次決策所依據的版本：

<!-- source: sources/background-agent/20261105/server/tool-policy.ts#L3-L15 -->

```typescript
// The harness reads policy metadata; it does not branch on checkout fault flags.
export const actionPolicy: Record<
  ActionName,
  'read' | 'write' | 'approval' | 'help' | 'terminal' | 'wait'
> = {
  inspect_logs: 'read',
  inspect_changes: 'read',
  disable_feature: 'write',
  rollback_release: 'approval',
  request_help: 'help',
  complete: 'terminal',
  wait: 'wait',
}
```

### 服務端的版本防護罩

單靠控制流程在發送請求前「再檢查一次」並不足夠，因為檢查完到請求送達服務之間依然存在時間差。真正的安全邊界必須建立在服務本身修改狀態的那一刻。

<!--image:2-->

以結帳服務為例，當收到修改狀態的動作時，服務會比對傳入的 `expectedVersion` 與當前記憶體內的 `version`。只要兩者不一致，就立刻拒絕寫入並回傳過期旗標：

<!-- source: sources/background-agent/20261105/service/checkout.ts#L138-L143 -->

```typescript
  if (
    (input.name === 'disable_feature' || input.name === 'rollback_release') &&
    input.expectedVersion !== version
  ) {
    return response.json({ stale: true, currentVersion: version })
  }
```

只有在版本吻合時，服務才會套用新狀態並推進版本號：

<!-- source: sources/background-agent/20261105/service/checkout.ts#L153-L168 -->

```typescript
    case 'disable_feature': {
      state = { ...state, featureEnabled: false }
      recordChange('Disabled checkout express feature')
      if (activeFault === 'feature') recover('feature disablement')
      else version++
      result = { featureEnabled: false, version }
      break
    }
    case 'rollback_release': {
      state = { ...state, release: 'v1-stable' }
      recordChange('Rolled checkout back to v1-stable')
      if (activeFault === 'release') recover('release rollback')
      else version++
      result = { release: state.release, version }
      break
    }
```

這道檢查也形成了重試時的安全屏障。即使網路逾時導致回應遺失，第二次重試如果帶的是原本的版本號，若前一次寫入其實已經成功推進版本，重試請求就會直接被服務視為過期寫入而拒絕，避免重複操作。

### 人工批准後必須重讀版本

需要人工審批的操作（例如復原發布版本）延遲更長。當人類點選同意時，系統可能早就產生變化。

因此，控制流程收到人類回應後，不能直接把指令送往服務，而要先重新讀取環境狀態。如果最新觀察到的版本與當初提案時記錄的版本不同，就直接將批准標記為過期並放棄執行：

<!--image:3-->

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L178-L185 -->

```typescript
        const fresh = await step.run(`recheck-approved-state-${cycle}`, () =>
          agentState(environmentId, runId),
        )
        if (fresh.world.version !== input.expectedVersion) {
          await step.run(`invalidate-approval-${cycle}`, () => staleProposal(proposalId))
          continue
        }
```

標記為過期的提案會被更新狀態並記錄在活動日誌中，確保審計軌跡清晰：

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L275-L288 -->

```typescript
export async function staleProposal(proposalId: string) {
  const proposal = await getProposal(proposalId)
  await db
    .update(approvals)
    .set({ status: 'stale', reason: 'State changed before this action ran', decidedAt: new Date() })
    .where(eq(approvals.id, proposalId))
  await logAgentActivity(
    proposal.environmentId,
    proposal.runId,
    'human',
    'Approved action became stale',
    { proposalId },
  )
}
```

### 在執行階段處理過期回應

在執行非讀取操作時，控制流程會將當時狀態的版本號傳入。即使通過了批准檢查，若在呼叫服務的瞬間剛好發生衝突，服務回傳了 `stale: true`，控制流程也能優雅處理：

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L187-L207 -->

```typescript
      const result = await step.run(`execute-action-${cycle}`, () =>
        executeAction(
          environmentId,
          runId,
          actionId,
          decision.action,
          policy === 'read' ? undefined : state.world.version,
        ),
      )
      if (result.stale === true) {
        await step.run(`stale-action-${cycle}`, () =>
          logAgentActivity(
            environmentId,
            runId,
            'act',
            'Action rejected because service state changed',
            result,
          ),
        )
        continue
      }
```

控制流程不會把這視為未知的執行錯誤而盲目重試，而是記錄狀態已變更的日誌，並結束當前回合，讓代理人在下一個循環根據最新現況重新觀察與決策。
