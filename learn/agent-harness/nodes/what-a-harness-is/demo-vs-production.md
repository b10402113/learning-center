# Demo agent 為什麼一進 production 就死

你可能有過這種經驗：一個晚上就把 agent demo 跑起來了。模型會叫工具、會回話，看起來什麼都能做。

但隔天想把它放進真實環境，問題就開始浮現：

- 跑到一半被重啟，怎麼辦？
- 它直接寄信給客戶，怎麼辦？
- 對話越來越長、帳單越來越貴，怎麼辦？

Demo agent 會死，不是因為 prompt 寫得不好，而是因為它本質上只是一個腳本。

## Demo agent 就是一個 while 迴圈

所謂 naive agent，也就是「天真的、沒有加任何保護的 agent」，其實就是一個中間塞著 LLM 的 while 迴圈：

<!-- source: sources/agent-harness/20260915/harness-engineering/lessons/01-intro-to-harness-engineering/index.md#L34-L58 -->
```ts
while (true) {
  const response = await model(messages);
  if (response.toolCall) {
    const result = await tools[response.toolCall.name](response.toolCall.args);
    messages.push(result);
    continue;
  }
  return response.text;
}
```

`messages` 是整段對話紀錄。每一輪先把 `messages` 傳給模型；如果模型要求呼叫工具，也就是發出「請幫我執行某個函式」的指令，程式就執行工具，把結果塞回 `messages`，然後再問模型一次。

等模型不再要求呼叫工具時，就回傳文字，結束迴圈。

整個流程就是：叫模型、可能叫工具、把結果塞回 `messages`，再叫一次模型。

這就是一個「裡面有 LLM 的腳本」。看起來沒什麼問題，但 production 的六個斷點，全都藏在這個迴圈裡。

<!--image:1-->

## 六個斷點

斷點總共有六個，先把重點講在前面：

- **行程一崩潰，狀態就沒了。** 記憶體裡的 `messages` 會消失。重啟後，模型對剛才做過的事一無所知；已經呼叫過的 LLM，也等於要再付一次錢。
- **工具什麼都能做。** 迴圈對 tool call 來者不拒，沒有執行邊界，等於把一個不安全的 runtime，也就是執行環境，交給模型。
- **上下文無限成長。** 上下文（context）就是模型讀到的全部內容，包含對話和工具結果。這些內容每一輪都變長，模型可能越來越差，帳單也越來越貴。
- **一個 agent 做所有事。** 什麼都做的結果，就是沒有專業分工，也沒有隔離。
- **子 agent 會失敗，也可能意見不合。** 發生這些情況時，沒有任何復原機制可以接手。
- **等人工核准會卡死整個 server。** 如果流程停在伺服器裡等待 approval，也就是人工核准，代表架構本身就有問題。

這六個斷點，就是 demo 與 production 之間的落差。其中三個最容易親眼看到：crash、不可逆的副作用，以及上下文成長。下面就把它們一個個弄壞給你看。

<!--image:2-->

## 把它弄壞給你看

**一、把它殺掉。**

任務送出去、程式正跑得起勁時，按下 Ctrl-C。記憶體裡的 `messages` 陣列就直接消失了。

重啟之後，agent 完全不知道剛才發生過什麼；已經寄出的 `sendReply` 也收不回來。狀態沒了，同一份工作重新跑一次，LLM 的費用也得再付一次。

<!--image:3-->

**二、它不經核准，就寄信給三個客戶。**

模型一要求執行 `sendReply`，工具就在那個瞬間被呼叫。放進真實系統裡，可能代表退款已經退了、訊息已經寄了、紀錄已經改了，而且無法復原。

工具一被叫用就立刻執行，寄出去的信收不回來。

<!--image:4-->

**三、給它 50 個項目。**

上下文視窗（context window）是模型一次能讀進去的內容長度上限。

任務一多，`messages` 陣列和 token 帳單就會一輪一輪變長，直到模型開始變笨，或直接撐爆上下文視窗。

<!--image:5-->

**四、一個 agent 同時做請款、bug 分派和業務。**

billing，也就是請款；bug triage，也就是分類與派工；sales，也就是業務——全部塞進同一個 agent 裡。

結果就是沒有專業分工，也沒有彼此隔離。

## 斷點不是 bug，而是腳本與 harness 的差別

這些問題沒有一個是 code 寫錯。

它們是腳本與 harness 之間的差別：腳本只負責把這一輪流程跑完；harness 則要回答，崩潰之後狀態去哪裡、工具的邊界在哪裡，以及上下文要怎麼控制成長。

這中間的落差，就是接下來要一層一層補起來的東西。

在 production 裡，這層外殼包含一個迴圈、工具、一份訊息紀錄，以及一條 event stream，也就是事件串流。這些正是 LangGraph、Mastra 和各家 agent SDK 交到你手上的東西。

今天你親手做了縮小版，之後就能拆開那些框架，看看它們底下到底在做什麼。
