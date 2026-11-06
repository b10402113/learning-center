# 效果擁有者記得每個 actionId

知道重試可能重複副作用之後，接著要把防線放在真正擁有狀態變更的地方。當工作流程呼叫外部服務執行操作時，最棘手的狀況往往不是對方明確回傳錯誤，而是連線在半途斷線或回應遺失。工作流程引擎（例如 Inngest）只能在收到成功回應時記錄步驟進度；如果回應在網路上丟失，引擎根本無從得知外部服務到底有沒有完成變更。

這時工作流程會發起重試。但要是外部服務每次收到重試都重新執行一次操作，就會造成重複扣款、重複發貨等嚴重問題。要讓重試安全，真正掌握狀態變更的「效果擁有者」（如結帳服務）就必須自己維護帳本，記住每一個 `actionId` 與其執行結果。

### 用意圖識別，而非只看 HTTP 請求

一個常見的誤解是把 `actionId` 當成單次 HTTP 連線的識別碼。事實上，`actionId` 代表的是「單一操作意圖」（intent）。無論底層因為連線中斷重試了幾次 HTTP 請求，只要意圖相同，它們就應該攜帶同一個穩定不變的 `actionId`。

服務端在收到請求時，會先查閱內部帳本（例如記憶體內的 `outcomes` 映射表或資料庫）。如果發現這個 `actionId` 已經處理過，就必須進行兩件事：

<!--image:1-->

1. **參數一致**：直接重播先前儲存的結果，不再重新套用任何業務邏輯。
2. **參數不一致**：拒絕請求並回傳 409 Conflict。

<!-- source: sources/background-agent/20261105/service/checkout.ts#L123-L137 -->

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
```

這段邏輯先利用請求名稱與預期版本號計算出特徵值（fingerprint）。如果 `outcomes` 裡已經有相同的 `actionId`，只要特徵值相符，服務端就立即把先前記下的 `result` 吐回；若發現呼叫端用同一個 ID 卻送來不同參數，就直接判定為衝突並拒絕。

### 執行並記錄全新操作

只有在帳本查無此 `actionId` 時，服務端才會真正執行業務狀態變更，並在完成後把結果寫入帳本：

<!-- source: sources/background-agent/20261105/service/checkout.ts#L145-L170 -->

```typescript
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
```

無論是停用功能還是復原發布版本，在狀態更新完成後，程式碼都會以 `input.actionId` 為鍵，將特徵值與執行結果存入 `outcomes`。

<!--image:2-->

後續只要發生回應遺失，工作流程以相同 ID 重試時，服務端就能立刻自帳本重播剛才的執行結果，讓流程順利往下走。

### 呼叫端的持久化記錄

在呼叫端（例如 Agent 或工作流程協調層），同樣需要將每次確認成功的動作寫入資料庫，作為日後稽核與狀態同步的依據。

資料表定義通常直接將 `actionId` 設為主鍵（primary key）：

<!-- source: sources/background-agent/20261105/server/schema.ts#L63-L72 -->

```typescript
export const actions = pgTable('actions', {
  id: text('id').primaryKey(),
  environmentId: uuid('lab_id')
    .notNull()
    .references(() => environments.id),
  name: text('name').notNull(),
  input: jsonb('input').$type<Record<string, unknown>>().notNull(),
  result: jsonb('result').$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
```

當呼叫端成功從服務端取回記錄後，就可以將結果寫入資料庫：

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L156-L173 -->

```typescript
export async function recordToolAction(
  environmentId: string,
  runId: string,
  actionId: string,
  name: ActionName,
  input: Record<string, unknown>,
  result: Record<string, unknown>,
) {
  await db
    .insert(actions)
    .values({ id: actionId, environmentId, name, input, result })
    .onConflictDoNothing()
  await logAgentActivity(environmentId, runId, 'act', `${name.replaceAll('_', ' ')} returned`, {
    actionId,
    input,
    result,
  })
}
```

透過 `onConflictDoNothing()`，呼叫端能確保即使同一筆動作重複寫入，也不會引發主鍵衝突錯誤。服務端藉由帳本防止副作用重複發生，呼叫端則藉由同一個 ID 確保執行紀錄的唯一性，兩者配合才能保證重試過程的絕對安全。

<!--image:3-->
