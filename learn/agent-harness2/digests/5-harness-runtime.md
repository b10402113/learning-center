---
source: sources/agent-harness2/20261029/5-harness-runtime.txt
source_type: text
source_lines: 476
supplements:
  - harness-engineering.1.part.md#L1-L231
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- Runtime 是 harness 的核心：用 `streamText` 呼叫 LLM、組 messages、跑 step 迴圈，並把過程轉成事件。
- `maxSteps = 10` 是防失控的護欄，一個 step 等於一次「要求工具 → 執行 → 再思考」的回合。
- LLM 不會自己執行 tool；harness 收到 tool call 後負責對應執行，並用同一組 `toolCallId` 把結果回饋給模型。
- 每個串流 chunk 型別（text delta、tool call、tool result、error）都對應一個 emitted event，讓 UI 能即時顯示。
- emit 只是把事件送到 client，transport（WebSocket、polling 等）不是重點；重點是讓關注非同步 workflow 的 client 持續更新。
- Tool request 事件要帶 name 與 arguments，才能支撐 human-in-the-loop 的審批畫面。

# L2 detail

- `#L1-L9` — 進入 runtime；目前 harness 只有三個實際上不做事、只會被 inspector 看到的 emit，準備開始實作。
- `#L10-L39` — 匯入 `streamText`、TypeScript 型別、model、tools 與 system prompt；選擇串流是為了讓 UI 逐 token 顯示，而不是等全部載完才彈出。
- `#L40-L53` — 宣告 `maxSteps`（10）避免 runaway agent 燒錢；step 定義為一輪「我做一件事、你執行、我再想」的循環。
- `#L54-L63` — `runAgent` 先建立 workflowId 並 emit `workflow started`，保留原本的起始事件。
- `#L64-L118` — 組 `ModelMessage[]`：第一則固定是 system prompt，第二則是 user 傳來的訊息；順帶說明 system、user、assistant、tool 四種 role。
- `#L119-L149` — 以 `step = 0`、`while (step < maxSteps)` 進入迴圈；呼叫 `streamText` 但不 await，因為回傳的是可訂閱的 stream，並帶入 model、messages、tools。
- `#L150-L185` — 用 `for await` 迭代 `fullStream`，以 `switch (part.type)` 分流 API 送來的 chunk：text delta、tool call、tool result、error。
- `#L186-L254` — text delta 代表模型正在生成文字；透過 emit 把 Node stream 轉成 WebSocket 事件。強調 transport 層可替換（polling、第三方 WebSocket），唯一重要的是讓 client 掌握非同步進度。
- `#L255-L265` — emit `model delta`，帶 workflowId 與 `part.text`，讓 UI 逐段顯示模型輸出；處理完即 break。
- `#L266-L325` — tool call 代表模型要求 harness 代為執行工具；模型只有工具名稱、description 與參數，實際執行在我們伺服器；也區分 provider 內建工具與 client-side 工具。
- `#L326-L344` — 必須 emit `tool request`，UI 才能顯示工具區塊、輸入、結果與狀態；不 emit 前端就完全不知道發生什麼事。
- `#L345-L378` — `toolRequest` 事件帶 workflowId、toolCallId、工具名稱；回傳結果時必須沿用同一個 `toolCallId`，否則多數 LLM 會無法對應而故障。
- `#L379-L419` — 事件要帶 arguments，讓審批畫面能顯示即將送出的內容；用 send reply 與銀行轉帳為例，說明不顯示細節就無法要求使用者批准。
- `#L420-L431` — 工具執行完後 emit `tool completed`，帶 workflowId、toolCallId 與 `part.output`，形成完整的工具生命週期事件。
- `#L432-L458` — error 分支 emit `workflow failed`，帶 workflowId 與錯誤訊息，並用 `String()` 強制轉字串以確保型別安全。
- `#L459-L476` — 事件處理完 return；重申真正重要的是呼叫 LLM 與處理串流，若不串流整段程式都能刪掉，但沒有串流的 AI 產品沒人會用。
