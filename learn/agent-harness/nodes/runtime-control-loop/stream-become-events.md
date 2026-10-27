# 把 stream part 翻成 UI 事件

上一節把 `messages` 組好、送出去之後，agent 迴圈就算真的跑起來了。這時你會遇到一個很實際的問題：`streamText` 已經把 token 一個個送回來，畫面卻完全沒有反應。

這不一定是模型壞掉。問題在於，這些流進來的資料還沒被翻成 UI 看得懂的語言。

這一節要做的事很單純：判斷每個 part 的類型，再把四種 part 各自翻成對應的事件。

## 進來的不是句子，而是四種 part

API（這裡指 OpenAI API 相容的 API）開始串流時，送回來的是一連串不同類型的 chunk。

你可以先把它們想成四種：

- **text delta**：一個 token，代表模型正在產生文字
- **tool call**：模型想呼叫工具
- **tool result**：工具執行完成後回傳的結果
- **error**：流程中發生錯誤

這四種 part 出現時，處理方式都不一樣。

text delta 要把文字逐段顯示出來；tool call 和 error 則要在 UI 上顯示各自對應的內容。因此，不能把整包資料原封不動丟給前端，得先翻譯過。

## stream 是 iterable，用 switch 對應事件

`streamText` 不用直接 await。它回傳的是可以持續讀取的 stream。

想拿完整結果，才用 `generateText` 加上 `await`。

這個 stream 可以迭代（iterable），所以你能一個接一個處理 `fullStream` 上的每個 `part`。每個 part 都帶著自己的 `type`。

判斷類型最直接的方式就是用 `switch`：

<!-- derived -->
```ts
for await (const part of result.fullStream) {
  switch (part.type) {
    case "text_delta":
      // 模型正在生字：把這個 token 丟出去
      emit("model_delta", workflowId, part.text);
      break;
    case "tool_call":
      // 模型想呼叫工具
      emit("tool_call", workflowId, part);
      break;
    case "tool_result":
      // 工具跑完了
      emit("tool_result", workflowId, part);
      break;
    case "error":
      // 出錯了
      emit("error", workflowId, part);
      break;
  }
}
```

最容易處理的是 text delta。

看到它就代表模型正在產生文字，而且只是這串回應裡的一小段。這時呼叫 `emit` 把它轉送出去。

`emit` 接收三個參數：

1. 事件 type，也就是事先定好的一組事件類型，其中一個叫 model delta
2. workflow ID
3. 實際的文字內容，也就是 `part.text`

剩下三種 part 也是同樣的模式，只是各自用不同的 case：

- 對應的事件 type 不同
- workflow ID 相同
- 傳出的內容各自不同

程式跑起來後，你會看到文字逐段冒出來；工具被呼叫時，UI 顯示對應區塊；發生錯誤時，畫面顯示錯誤訊息。

四種 part 對應四個事件，UI 收到什麼，就知道該畫什麼。

<!--image:1-->

## 事件怎麼送到前端，不是重點

這裡的 `emit` 是透過 WebSocket，把這條資料流轉成另一條流送出去。

但整段其實都屬於 transport layer，也就是跟平台關係很深的傳送層細節。你不一定要用 WebSocket，也可以讓前端輪詢（polling）events 資料庫，或用第三方提供的 WebSocket 服務。

不要把注意力卡在這裡。

真正重要的是：呼叫 LLM 時傳入 model、messages 和 tools，然後找一個方法，讓關心這個流程的人，也就是 client，能持續收到更新。

至於資料要怎麼送，是你的架構決定的。課堂上的寫法只是其中一種。

<!--image:2-->

## 流結束後，才把結果放進 messages

事件要在 stream 進行時即時送出去，但 `messages` 陣列不能用同樣的方式處理。

半成品不能直接塞進對話歷史。得等整個 stream 結束、拿到完整結果，才能把訊息放進 `messages`：

<!-- derived -->
```ts
messages.push(...(await result).messages);
```

這一行同時做了三件事：

1. 用 `await` 等待 stream 執行完畢
2. 取回 `result.messages` 這個陣列
3. 用 spread 把陣列中的訊息一條一條加入 `messages`

前面的 `for await` 處理的是「正在發生的事」，這一行處理的是「流程結束後留下的結果」。

兩件事分開做，UI 才能即時更新，對話歷史也不會混入還沒完成的訊息。

<!--image:3-->

四種 part 之中，tool call 最容易被誤會成「模型已經把工具跑完了」。它其實只是個請求——下一節回來拆這件事。
