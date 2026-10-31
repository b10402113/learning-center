# 用 cancelOn 擋掉同一個 run ID

前面所有防線都建立在一個假設上：同一個 run ID 只會有一個 run 在執行。但這個假設不會自動成立。

## 兩個 run，一個 run ID

如果同一個 run ID 被啟動兩次，就會有兩個 workflow 同時執行，並操作同一份 state。

兩個 run 各自觀察、各自判斷，也可能因此得出不同結論、採取不同動作。這就是 race condition。

你不一定會馬上察覺。狀態看起來有在變，log 也有內容，但實際上是兩個 run 互相覆寫。

課程裡用共用一份 Google 文件來比喻：兩個人的游標停在同一行，同時打字，最後只剩下一堆亂碼。

所以，我們不能讓多個 run 使用同一個 run ID。必須在它們開始執行之前就加以阻擋。

## cancelOn 是門口的警衛

啟動 workflow 時，可以在參數中加入 `cancelOn`。它會接收一組 event 物件；如果符合指定條件，就不會執行這個 workflow。

我們要設定的條件是：事件類型為 `agent/run.canceled`，而且 payload 中的 `data.runId` 等於要啟動的 run ID。

條件符合時，就取消這次啟動，讓 workflow 根本不會開始執行。這代表某個地方已經偵測到這個 run ID 正在使用中。

<!--image:1-->

這項檢查會在 workflow 開始之前執行。它防止的是「第二個 run 加入」，而不是「第二個 step 重跑」。兩者並不相同：前者是兩個 workflow 爭用同一份 state，後者則是同一個 workflow 重播。

這也說明了為什麼前面提到的 key 和 version 還不夠。它們都假設只有一個 run 會寫入資料。若有兩個 run，各自帶著合法的 key 進來，key 只能判斷同一個 intent 是否已經執行過，無法限制有多少個 run 同時寫入同一份 state。

## 弄壞它：commit 之後丟失 ack

還有一種更細微的落差：effect 已經發生，但呼叫端並不知情。

服務的 handler 會在 mutation 之後，將結果存進 `outcomes`。接著，如果 `loseNextActionResponse` 已啟用，就會回傳 503。

<!-- source: sources/background-agents/20261027/service/checkout.ts#L170-L179 -->
```ts
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
```

這個開關可以透過啟動參數 `--lose-next-action-response` 啟用。

實際執行一次：服務帶著 `--lose-next-action-response` 啟動，agent 送出 `rollback_release`，收到的回應是 503。

但 `GET /state` 已經顯示 `release: 'v1-stable'`，版本也增加了。`GET /changes` 則多了一筆 rollback。

這就是 lost-ack：effect 已經 commit，但 ack 遺失了。呼叫端看到的是失敗，實際上操作已經成功。

<!--image:2-->

如果重試會怎樣？再次送出相同的 action ID。`outcomes` 裡已經有這筆記錄，而且 fingerprint 相同，因此服務會回放先前儲存的結果。第二次操作不會再次修改 state，也不會新增 change。

所以，「rollback 有沒有發生？」答案是有。503 只表示你沒有收到確認，不代表操作沒有執行。

這就是為什麼要相信下一次觀察，而不是上一次的 ack。`GET /state` 比 503 更接近事實。

到這裡，這個 node 的四個部分就齊全了：effect 的身分、intent 的新鮮度、run 的擁有權，以及對下一次觀察的信任。接下來要問的，不是如何重試，而是權限問題：誰有權決定讓 agent 動手？
