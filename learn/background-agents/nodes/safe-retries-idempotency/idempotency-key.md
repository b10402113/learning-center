# 讓重試變安全：先講 idempotency

runtime 會再次呼叫。要讓第二次呼叫不會造成額外影響，關鍵在於使用穩定的識別碼。

## key 保護的是什麼

前面提到的重試，會再次送出同一個 mutation。如果呼叫帶有固定的 idempotency key，服務就有機會辨認出這是重試。

穩定的 action ID 能讓結果不確定的 tool call 安全重試，而不會重複產生效果。這就是 idempotency；action ID 就是那個 idempotency key。

「結果不確定」是關鍵。呼叫送出後若發生 timeout，你無法確定對方是否已經執行。這時重試是必要的；沒有 key，重試就像一場賭博。

從呼叫端來看，行為沒有改變：它仍然送出請求，也仍然取得狀態。差別在於，同一個 run 永遠使用同一個 key。

## 不含參數的 key 不算完整的 key

服務收到請求後，會先計算 fingerprint。在這個 handler 中，fingerprint 是 `name` 加上 `expectedVersion` 的 JSON 字串。

<!-- source: sources/background-agents/20261027/service/checkout.ts#L123-L137 -->
```ts
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

接著，服務會用 action ID 查詢是否已有儲存的結果。如果有，就比對 fingerprint。

如果 fingerprint 相同，服務會回傳已儲存的結果；如果不同，就回傳 409，訊息是 `Action ID reused with different arguments`。

為什麼要這樣做？因為 action ID 只是一個字串。同一個 ID 可能對應完全不同的工作。如果服務只檢查 ID，就可能把 rollback 的結果回傳給 disable 請求。

舉例來說，同一個 `actionId`，第一次送出 `rollback_release`，第二次送出 `disable_feature`。由於 fingerprint 不同，服務會回傳 409；這次 mutation 不會執行。

如果是真正的重試，也就是 ID、name 和 expectedVersion 都相同，服務就會回放已儲存的結果。版本不會再次遞增，change 記錄也不會多出一筆。

expectedVersion 也包含在 fingerprint 中。因此，同一件事若使用不同的版本預期送出，也會被視為不同的工作。

key 的契約是：一個 ID 只代表一個 intent，而參數是 intent 的一部分。

<!--image:1-->

## 重播路徑：回放結果或回傳 409

把 handler 的執行路徑畫出來，只有兩條分支會遇到已存在的 key。

第一條：fingerprint 相同，回傳已儲存的 result。第二條：fingerprint 不同，回傳 409。這兩條分支都不會執行 mutation。

<!--image:2-->

`outcomes.set` 位於 mutation 之後、回傳之前。因此，服務能回放結果，就表示這次 mutation 確實執行過，而且結果也已經儲存。

<!-- source: sources/background-agents/20261027/service/checkout.ts#L170 -->
```ts
  outcomes.set(input.actionId, { fingerprint, result })
```

呼叫端仍然會呼叫 action，也仍然會取得狀態。這就是 idempotency 的作用：呼叫可以重試，但效果只會發生一次。

409 尤其要看清楚：它代表這次請求沒有執行。該 ID 底下已經有一次不同的操作，且其結果已經儲存。使用同一個 ID 再次送出請求，只會再次收到相同的 409。

只要服務收到穩定的 key，重試就是安全的；但 workflow 還沒有把 key 傳給服務。
