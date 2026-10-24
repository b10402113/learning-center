---
source: sources/agent-harness/20260915/26-wrapping-up.txt
source_type: text
source_lines: 277
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- 課程補充 production 可用的 hosted sandbox 資源，作為執行不可信程式碼的基礎設施。
- 這些 harness 技術屬於 bleeding edge，多數日常開發者並不熟悉，練習與實作是主要學習方式。
- 一旦知道系統該長什麼樣，就比較能判斷 LLM 產出的東西是否在 hallucinate。
- 最小可用的 chat agent stack：tool calling、持久化 memory、memory compression；durable execution 是下一步。
- 長時距的 infinite／background agent 不是拿來聊天，而是接收任務或事件後長時間在背景工作。
- 這類 agent 以 durable execution 為基礎，不需要 messages API，改用 inbox 模式與人類互動。
- 真正困難的不是做出來，而是持續以 evals 評估、約束並維持品質。

# L2 detail

- `#L1-L12` — 補充 sandboxing：提供 hosted sandbox 資源清單，供 production 使用。
- `#L13-L58` — 強調課程內容屬於前沿技術；學習來自大量實作與讀研究論文，並把這些工具放進口袋搭配 evals。
- `#L59-L79` — 這類知識的稀有性，以及理解 harness 後辨識 hallucination 的能力。
- `#L80-L129` — harness 還有更多垂直領域的變化；以 browser agent、語音操作 Mac 的 computer-use agent 說明為學習而做的專案。
- `#L130-L189` — 回答最小 stack：tool calling、持久化 memory、compression；再下一步是跨 client 的 durable execution。
- `#L190-L248` — 定義 infinite／background agents：任務或事件驅動、長時間執行、durable execution 是基礎、不需要對話訊息。
- `#L249-L277` — 以 inbox 模式說明人類如何介入；評估與約束才是難點，最後結語與聯絡方式。
