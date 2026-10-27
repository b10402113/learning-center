# 哪些動作不能重跑

想像一下：你的 agent 正在背景工作，寄出回信的瞬間卻當掉了。你重新啟動它，讓剛才的流程再跑一次。

聽起來很合理，但有些動作一旦重跑，就可能出問題。

## 有些動作做了就收不回來

信已經寄出去了，你沒辦法鑽進對方的信箱把信拿回來。

這種做了就無法恢復原狀的動作，就是 destructive actions（破壞性動作）。你必須確定它只發生一次，而不是重跑幾次就發生幾次。

<!--image:1-->

還有一個更基本的問題：agent 的訊息都放在記憶體裡，重啟後，它根本不知道剛才發生過什麼。

那是持久化的題目，之後再處理。這裡先專注在「重跑」這件事。

## runtime 沒變，變的是把結果存下來

agent 的 runtime 還是原本那個 while 迴圈：持續執行工具，直到沒有工具需要呼叫，最後產生一段回應。

這部分完全不用改。

我們只需要把那些「不希望再發生一次」的動作，各自包進一個 step（步驟），再把執行結果存進資料庫；這裡使用的是 Postgres。

結果存下來後，同一個 workflow 就不會再執行這些動作；即使因故必須重試，也會沿用已經儲存的結果。

這就是 durable execution（持久化執行）：重啟安全，重試也安全。

<!--image:2-->

## 三件必須 durable 的事

需要包進 step 的動作有三類，重跑的代價各不相同。

### emit

emit 是把事件送出去給外部使用，例如讓 UI 顯示進度。

如果重跑，同一個事件就會被送出兩次，畫面上也會出現重複事件。

### tool call

tool call 本身就是在對外部世界採取行動。

如果重跑 tool call，可能會再次執行破壞性動作，例如把同一封信再寄一次。

### LLM 呼叫（`streamText`）

`streamText` 是要求模型產生文字。每呼叫一次，都會花錢並消耗 token。

如果重跑，費用和 token 就會再被扣一次。

一句話記住三者的差別：tool call 出事在外部世界，`streamText` 出事在帳單，emit 出事在畫面上。

<!--image:3-->

## 工具改由自己呼叫

既然 tool call 需要自己控管，就不能讓 AI SDK 自動執行工具。

做法是移除每個工具的 `execute` 函式，讓 AI SDK 不再代為呼叫工具。接著自己寫一個 tool runner（工具執行器）：用一個 switch 判斷這次被要求的是哪個工具，再呼叫對應的函式。

<!-- derived -->
```js
function runTool(request) {
  switch (request.name) {
    case "sendReply":
      return sendReply(request.args);
    default:
      throw new Error(`unknown tool: ${request.name}`);
  }
}
```

這樣一來，工具什麼時候被呼叫、什麼時候該跳過（例如結果已經存起來時），都由自己掌握。

## 所以這一步做了什麼

單獨看每個改動，可能會覺得做了很多事；但合起來，其實只有一句話：

把那些「再發生一次就可能造成嚴重後果」的動作——tool call、`streamText`、emit——包進會把結果存進資料庫的 step。

把這些動作變成 durable，workflow 才能放心重試，agent 也才能安全重啟。

但「包進 step」到底切出什麼邊界？下一節再把 workflow 和 step 這兩個名詞分開。
