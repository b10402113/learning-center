# stale result 代表什麼

key 對上了，不代表這件事現在還該做。Agent 會先觀察世界，再決定採取什麼動作；兩者之間存在時間差。

## 觀察和動手之間的空窗

Agent 的 loop 分成 observe、decide、act。它讀取 `state.world.version`，看到版本 1，並根據版本 1 的狀態做出決定。

算出決定之後，Agent 才送出 action。這段期間，可能有其他 run 或操作，也可能有一次 deploy 改變了世界。

如果直接套用 action，就等於把它套用在「版本 1 的世界」；但此時世界可能已經變成版本 2。這正是 `expectedVersion` 要處理的時間差。

## handler 裡的比對

<!-- source: sources/background-agents/20261027/service/checkout.ts#L138-L143 -->
```ts
  if (
    (input.name === 'disable_feature' || input.name === 'rollback_release') &&
    input.expectedVersion !== version
  ) {
    return response.json({ stale: true, currentVersion: version })
  }
```

`expectedVersion` 代表呼叫端在說：「我以為自己是在這個版本上動手。」

read policy 不需要傳入版本。`inspect_logs`、`inspect_changes` 不會改變任何內容，因此傳 `undefined`。mutation 則傳 `state.world.version`。

handler 只會對兩個 action 做版本比對：`disable_feature` 和 `rollback_release`。如果版本不符，就回傳 `{ stale: true, currentVersion: version }`，不執行 mutation。

舉個具體例子：agent 讀到版本 1，決定 `disable_feature`，並帶上 `expectedVersion: 1`。送出 action 時，服務端的版本已經是版本 2。回應是 `{ stale: true, currentVersion: 2 }`，feature 不會被關閉。

<!--image:1-->

這裡的 stale 有一個明確來源：版本不符。課程裡也會把它解讀為「這件事之前做過了，所以這是舊的」。這兩種說法要分開看：一種談的是版本比對，另一種談的是結果是否新鮮。

無論是哪一種情況，stale 都代表結果已經過時。不要把它當成目前的 state 來推理。

還有一種 stale 並非由版本造成。workflow 執行到一半時，你部署了新版本，而那個 action 已經不存在。服務會回報無法執行，因為該 action 在 workflow 開始後已被移除。

這種情況沒有標準答案。先把它記錄在 log 裡。假設部署前有 30 個 workflow 正在執行，部署後就檢查這 30 個 workflow 的 log，看看是否有 stale action，再決定如何處理。

log 裡記下 `decision.thought`、`decision.action`、expected version；phase 設為 act，訊息寫成 `action rejected because service state changed`，最後再附上結果。

## 兩種失敗，兩道閘門

現在把兩道防線放在一起看。

key 處理的是「同一個 intent 被送出兩次」。fingerprint 相同，就回放結果；不同，就回傳 409。它不管世界有沒有改變。

<!--image:2-->

version 處理的是「intent 是根據舊世界算出來的」。版本不符，就回傳 stale，不套用 action。它不管這次呼叫是不是重播。

反過來也一樣：key 無法判斷一個 intent 是否已經過期；version 無法判斷一個 intent 是否是同一件事的第二次呼叫。少了其中一道防線，就會有一種失敗無法被攔下。

所以 expectedVersion 是最後一道柵欄。即使前面的身分都對得上，還是得確認現在的世界是否符合預期。

key 的身分判定和 version 的新鮮度判定，都建立在兩個假設上：同一個 run ID 只對應一個 run，而且呼叫端看得到結果。
