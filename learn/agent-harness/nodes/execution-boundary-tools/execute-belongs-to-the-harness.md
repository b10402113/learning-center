# 把 execute 拿回來：為什麼 harness 要自己執行

工具都寫好了，demo 也跑得通：agent 要求呼叫工具、拿回結果，再繼續往下走。

直到你想把這套東西做成 durable（持久）——即使做到一半機器重啟，或工作暫停後再回來，也能接著執行——才會發現不對勁：

工具做過的事情，在自己的程式裡竟然找不到紀錄。

問題多半出在工具上的 `execute` 函式，也就是工具裡「實際做事」的那一段。把它掛上去很方便，但同時也代表你把執行控制權交了出去。

## 先講工具本身很無聊

在這個 demo 裡，工具沒有什麼複雜功能。

它拿到 `item ID` 和 `category` 後，只回傳 `ok: true`，再把輸入原樣放回結果裡，讓 agent 知道「好，這件事有做到」。

<!-- derived -->
```ts
// demo 裡的工具不做實事，只要讓 agent 知道有做到
async function classifyReply({ itemId, category }) {
  return { ok: true, itemId, category }
}
```

這是刻意設計的。

這些工具沒有任何 agent 專屬邏輯。真正需要處理的，不是工具要做什麼，而是**誰來執行工具**。

## 掛上 execute，AI SDK 就自己跑了

工具上只要掛了 `execute`，AI SDK 看到 LLM 要求呼叫工具，就會自己把它跑掉。

<!--image:1-->

用起來很順，但它繞過了什麼，必須看清楚。

這次執行沒有落在你的 `step` 裡。`step` 指的是工作流程中一個有紀錄的步驟；實際執行反而發生在 AI SDK 自己的迴圈裡。

說白一點：AI SDK 幫你把 harness 的工作做掉了。

工具的副作用確實發生了，但你的 step 紀錄裡什麼都沒有。等到機器重啟、需要接著執行時，這段就像被挖掉一塊，憑空消失。

也不要想著把 `step ID`、`workflow ID` 塞進 `execute`，讓它知道自己該把紀錄放在哪裡。

這個念頭想過就好。每次呼叫都要多花一堆 token，沒有必要。

## 把 execute 拿回來的作法

作法很直接：工具上不留 `execute`，把執行權交回 `runTools`；而 `runTools` 自己跑在一個 step 裡。

<!--image:2-->

<!-- derived -->
```ts
// 工具定義只剩名字與輸入格式，沒有 execute
const tools = {
  classifyReply: { description: '幫回覆分類' },
}

// harness 自己挑工具、自己執行
async function runTools(call) {
  switch (call.name) {
    case 'classifyReply':
      return await classifyReply(call.input)
    default:
      return { ok: true }
  }
}

// runTools 本身做成 DBOS 的 step：有紀錄、durable、重啟接得回來
```

harness 裡只留一個 `runTools` 函式，用 `switch case` 挑出該執行的工具，再自行呼叫、取得結果。

當 AI SDK 看到 LLM 要求呼叫工具時，它只能把工具請求交出來，沒有權限直接執行。

而 `runTools` 本身則被做成 workflow 的一個 step。這個 demo 使用的是 DBOS step。

如此一來，工具執行就成了一個固定步驟：有紀錄、具備 durable 特性，而且每次執行方式都相同。即使機器重啟，也能接回這一段流程。

## 順便拿回來的：整個 loop

工具只是其中一塊。

`loop` 指的是這個循環：

> 模型要求呼叫工具 → 執行工具 → 回傳結果 → 模型再想一次

AI SDK 有 `max retries` 之類的參數。只要打開它，就等於使用 SDK 內建的迴圈。

幾乎每個 SDK 都替你寫好了這個圈圈，但這裡刻意自己實作，原因是要保留控制權。尤其當你需要透過 WebSocket 把進度推送出去時，更是如此。

如果使用 SDK 的內建迴圈，就得跟著使用它提供的 hooks，整套設計也會綁在 AI SDK 上。

目標其實很簡單：

**我只拿 AI SDK 去對 LLM 發一個請求，其他事情都不交給它做。**

agent 迴圈、工具執行、訊息推送，全都由 harness 自己負責。

<!--image:3-->

這樣一來，哪天想換 SDK、換語言，harness 這邊不用跟著重寫，也不會被困在某一家 SDK 的實作裡。

下次看到工具上掛著 `execute`，先問一句：

**這一行是誰呼叫的？**

如果答案不是你的 harness，那這段執行就沒有留下紀錄。
