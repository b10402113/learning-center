# 過期的寫入會拿到 stale

讀懂狀態只是前半段，真正會改變世界的是寫入。當自動化程式或操作代理人對線上服務執行修復指令時，最怕遇到兩種意外：一是發送請求後網路逾時，重試時不小心把同一個變更執行了兩次；二是操作當下依賴的系統狀態已經改變，把剛生效的新設定覆蓋回舊狀態。

在 checkout 服務的設計中，修改狀態的操作（例如 `disable_feature` 與 `rollback_release`）透過兩個核心機制來防範這類問題：用 `actionId` 避免重複執行，並用 `expectedVersion` 擋下過期的寫入。

系統支援的操作類型定義在共享型別中：

<!-- source: sources/background-agent/20261105/shared/types.ts#L1-L10 -->

```typescript
export const ACTIONS = [
  'inspect_logs',
  'inspect_changes',
  'disable_feature',
  'rollback_release',
  'request_help',
  'complete',
  'wait',
] as const
export type ActionName = (typeof ACTIONS)[number]
```

### 狀態追蹤與記憶結果

為了避免同一個請求因為重試而重複觸發副作用，checkout 服務在記憶體中維護了 `outcomes` 紀錄：

<!-- source: sources/background-agent/20261105/service/checkout.ts#L50-L57 -->

```typescript
const logs: Array<{ at: string; level: string; message: string }> = []
const changes: Array<{ at: string; message: string }> = []
const outcomes = new Map<string, { fingerprint: string; result: Record<string, unknown> }>()
const pendingEvents = new Map<
  string,
  { id: string; serviceId: string; instanceId: string; type: string; data: Record<string, unknown> }
>()
let delivering = false
```

每當一個操作成功執行，服務就會把該次操作的參數特徵（fingerprint）與執行結果（result）存進 `outcomes`。當客戶端因為網路中斷或逾時而使用相同的 `actionId` 重新發送請求時，服務能直接回傳先前記下的結果，而不會重新執行變更。

### 如何檢查重複與過期寫入

在處理 `/operations` 路由時，服務會依序進行兩道檢查：

<!--image:1-->

<!-- source: sources/background-agent/20261105/service/checkout.ts#L123-L181 -->

```typescript
app.post('/operations', (request, response) => {
  const input = z
    .object({
      actionId: z.string().min(1),
      name: z.enum(['inspect_logs', 'inspect_changes', 'disable_feature', 'rollback_release']),
      expectedVersion: z.number().int().optional(),
    })
    .parse(request.body)
  const fingerprint = JSON.stringify({ name: input.name, expectedVersion: input.expectedVersion })
  const prior = outcomes.get(input.actionId)
  if (prior) {
    if (prior.fingerprint !== fingerprint)
      return response.status(409).json({ error: 'Action ID reused with different arguments' })
    return response.json(prior.result)
  }
  if (
    (input.name === 'disable_feature' || input.name === 'rollback_release') &&
    input.expectedVersion !== version
  ) {
    return response.json({ stale: true, currentVersion: version })
  }

  let result: Record<string, unknown>
  switch (input.name) {
    case 'inspect_logs':
      result = { logs: logs.slice(-12) }
      break
    case 'inspect_changes':
      result = { changes: changes.slice(-12) }
      break
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
  }
  outcomes.set(input.actionId, { fingerprint, result })
  if (
    loseNextActionResponse &&
    (input.name === 'disable_feature' || input.name === 'rollback_release')
  ) {
    loseNextActionResponse = false
    return response
      .status(503)
      .json({ error: 'Simulated acknowledgement lost after the operation committed' })
  }
  return response.json(result)
})
```

#### 第一道防線：用 actionId 檢查重複與衝突

收到請求後，服務會先根據 `name` 和 `expectedVersion` 算出參數的特徵字串（fingerprint），並在 `outcomes` 查找這個 `actionId`：

<!--image:2-->

1. **完全重複的重試**：如果找到舊紀錄且 fingerprint 相同，代表這是先前請求的重試。服務直接回傳當時快取的 `prior.result`，不會再次變更狀態。
2. **衝突的重複使用**：如果找到舊紀錄但 fingerprint 不同，代表客戶端拿了同一個 `actionId` 去做別的事。服務立刻回傳 HTTP 409，拒絕執行。

#### 第二道防線：用 expectedVersion 阻擋過期寫入

對於唯讀操作（如 `inspect_logs` 與 `inspect_changes`），系統不需要檢查版本號。但對於會改變系統狀態的寫入操作（`disable_feature` 和 `rollback_release`），服務會比對請求中的 `expectedVersion` 與目前服務內部的 `version`。

如果客戶端送來的 `expectedVersion` 不等於目前的 `version`，代表客戶端是根據過期的系統狀態做出決策。此時服務不會執行變更，而是直接回傳：

<!--image:3-->

<!-- derived -->

```json
{
  "stale": true,
  "currentVersion": 2
}
```

拿到 `stale: true` 的客戶端就能得知自己的判斷基礎已經過期，必須重新讀取目前的服務狀態與版本號，再決定下一步動作。

只有在 `actionId` 尚未執行過，且 `expectedVersion` 完全吻合當前版本時，checkout 服務才會真正修改狀態、更新版本號，並把結果寫入 `outcomes` 完成提交。即使連線在提交後意外中斷（例如模擬中的 503 錯誤），後續重試也能憑著相同的 `actionId` 安全拿到已完成的結果。
