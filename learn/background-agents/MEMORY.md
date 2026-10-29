---
subject: background-agents
language: en
created: 2026-10-27
updated: 2026-10-27
---

# MEMORY — background-agents

## Goal

能從零建出一個可運作的背景 agent harness：事件觸發開 run、觀察現況、選動作、需要時暫停等待、被人工或事件喚醒後接回、安全重試、最後自我驗證完成；並且能指著每個 step 說出「這裡斷掉之後，狀態去哪裡」。

以課程的 incident-response agent 為載體，最後能把同一套模式換成自己的場景。

## Why

已經有 agent-harness 的心智模型，缺的是把它落到可跑的程式：真實事件流、durable runtime、Postgres、人工收件匣。想要一個「關掉還會活著」的 agent，之後能複製到自己的背景工作流程，而不是再做一个 chat demo。

## Prior experience

- 會 TypeScript／Node.js，讀得懂 Express 與 React；基本 SQL 與 Postgres 概念。
- 沒碰過 Inngest 或其他 durable runtime（Temporal、DBOS、Workflows）。
- 沒用過 Vercel AI SDK 的 structured output；LLM API 只到「會呼叫」的程度。
- 分散式概念（checkpoint、replay、idempotent、at-least-once）是初學，需要對照日常經驗建立。
- 走過 `agent-harness` 的系統觀：控制面、狀態面、執行面、context 面、approval 面。

## Anchors

- 「重新整理或重送表單就多一筆訂單」→ idempotency 與 action ID。
- 「PR 要人 approve 才能 merge」→ human-in-the-loop 的 approval gate。
- 「服務重啟，記憶體裡的狀態消失」→ business state 與 workflow checkpoint 的差別。
- 「通知寄兩次」→ at-least-once、event 去重與穩定 event ID。
- 「監控 alert 跳出來，但點進去發現狀況已經變了」→ event 是門鈴，不是狀態快照；決策前必須重新觀察。
- 用過 Claude Code 之類的工具，但沒想過它外面那層 harness 是誰寫的。

## Habits & constraints

- 每次 45–60 分鐘，一週 2–3 次。
- 願意開 Neon 免費 Postgres 與使用現有 LLM API key；可同時開三個 terminal。
- 一次一小段，能跑起來比讀完更重要。
- 學新 API 時接受先照抄可運作版本，再回頭拆解。

## Knowledge type

mixed，但**程序性主導**：Inngest API、schema、指令這類事實只學到能跑；重心是工程判斷 —— 何時拆 step、什麼該留在 workflow、哪裡要人工閘門、重試安全怎麼保證。

## How to teach me

- 先看失敗長什麼樣子，再學對應的機制；不要先背定義。
- 每個抽象立刻綁到一個檔案、一個函式或一次錯誤訊息。
- 每一段都要有「你現在去跑會看到什麼」的具體指令或程式碼。
- **每個節點都要有一個「弄壞它」的步驟**（停 agent、送競態事件、決策期間改 state、丟 response）；沒有 break-it 的節點視為沒寫完。
- 不喜歡：名詞堆疊、沒有前因後果的機制清單、被要求先學完理論再動手。
