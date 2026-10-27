# 一個 turn 是什麼：while 迴圈與 maxSteps

到這裡，你的 harness 已經有 model、tools 和 system prompts，但 agent 還沒有真正開始執行。

接下來要看的 runtime，就是那個會不斷運轉的部分。這一節只回答兩個問題：一個 turn 到底是什麼？maxSteps 這個數字又是誰決定的？

## 一個 turn，就是「叫它做一件事」的一個來回

先講清楚名詞。在這份教材裡，step 和 turn 指的是同一件事：

你叫模型做一件事，模型完成後，你拿著結果再決定下一步。這樣一個來回，就是一個 turn。

<!--image:1-->

迴圈每轉一圈，harness 就會把目前的 messages 傳給 LLM provider，再透過 stream text 一個 token、一個 token 串流回來，讓前端即時顯示。

都 2026 年了，不要等整段內容算完，才「啵」地一次跳出來。

## while 迴圈：正常是 return，被打斷只有兩種可能

runtime 的核心就是一個 while 迴圈，而迴圈每跑一圈，就是一個 turn。

正常結束時，迴圈裡一定會有一個 return，程式就會從那裡離開。

反過來說，如果你是被「踢出」迴圈的，只有兩種可能——撞到 maxSteps，或是在中途發生其他錯誤。

這時候，harness 會發出一個 workflow failed 事件，訊息寫上 max steps，讓使用者知道發生了什麼事。

<!--image:2-->

<!-- derived -->
```js
const maxSteps = 10;

while (steps < maxSteps) {
  const result = await streamText({ model, tools, system, messages });

  if (done) return; // 任務完成：正常出口，永遠有這個 return
}

// 走到這裡只有兩種可能：撞到 maxSteps，或中途出錯
emit("workflow failed", "max steps");
```

實際執行時，你可以在 harness inspector 裡看到這些 emit。

連上 WebSocket、送出一句 hello，就會看到 workflow started、it's thinking，迴圈真的在跑了。

## maxSteps：harness 自己設的停損點

撰寫這個 runtime 時，第一個要設定的變數就是 maxSteps。

理由很簡單：不希望 runaway AI 一直執行下去，把資源消耗光，也讓帳單一路往上跑。示範裡設定的數字是 10，也就是最多執行 10 個 turn，超過就停下來。

重點是：這個上限是 harness 設的，不是模型設的。

模型不會自己喊停，它只負責產生這一圈的回應。要不要繼續、最多跑幾圈，以及碰到上限後要怎麼收尾，都是外層 while 迴圈的工作。

所以說 maxSteps 屬於 harness，講的就是這層分工。

<!--image:3-->

## 那為什麼不直接用 AI SDK 自己的 loop？

現場有人問：AI SDK 有 max retries 這個 prop，那它跟我們自己寫的 max steps，不是同一件事嗎？

可以說是同一類的控制，但一旦開啟那個 prop，就等於選擇使用 AI SDK 的迴圈。

幾乎每個 SDK 都已經幫你寫好 loop，確實比較省事；代價是 harness 就被綁在 SDK 的實作上。使用內建迴圈後，你也得改用它提供的 hooks，程式會越來越貼近 AI SDK。

示範裡寧可自己寫 while 迴圈，就是要讓 harness 保有更多控制權，尤其是能透過 WebSocket 自己發事件。

取捨很清楚：AI SDK 只拿來「對 LLM 發出一次呼叫」，其他事情都由我們自己處理。

這樣一來，哪天要更換 SDK 或改用另一種語言，harness 的骨架都不用跟著重寫，也不會被困在原本的 SDK 世界裡。

<!--image:4-->

迴圈的骨架有了。但每一圈都要把一份 `messages` 傳給模型。它長什麼樣子，就是下一節的主題。
