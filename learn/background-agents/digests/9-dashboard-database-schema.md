---
source: sources/background-agents/20261027/9-dashboard-database-schema.md
source_type: text
source_lines: 78
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- **Inngest dev server 與 dashboard** — 示範用 dashboard（127.0.0.1:8288/runs）觀察 run、step、event，並從中觸發、mock 輸入、重跑與停止 function。
- **資料庫 schema 意外地簡單** — 只有 `events`、`actions`、`runs` 三張表，內容多為 Postgres 裡的 JSON blob；`runs` 是最關鍵的一張。
- **run 的定義與邊界** — run 是「agent 被某個 event 叫醒」，與「一次調查」不等價；是否開新 run 由 harness 決定。
- **真正的難題在 harness** — 人類守門、基礎設施層暫停、state 變更、可觀測範圍與成本護欄，都與 LLM 好壞無關。
- **state 全序列化與可攜性** — 完整 snapshot 讓新 run 能精準接續舊狀態；Inngest 也支援 cron 排程。

# L2 detail

- `#L1-L5` — 要求學習者自己重走一次 agent 迴圈，確認 state、工具選擇與順序的思考框架。
- `#L6-L10` — 介紹 Inngest 內建 dev server 與 dashboard，並更正 dashboard 位址為 127.0.0.1:8288/runs。
- `#L11-L19` — 目前只有一個 function、一個 step，dashboard 可見 run 失敗但資訊有限。
- `#L20-L26` — dashboard 可直接觸發 function、mock 輸入、重跑、停止，並檢視與送出 events。
- `#L27-L35` — 資料庫 schema：`events`（資料加 run ID）、`actions`（名稱與參數的 JSON blob）、`runs` 最重要。
- `#L36-L41` — run 是 agent 被 event 喚醒的一次執行，可新開或附加到既有 run。
- `#L42-L46` — 以 SEV-0/SEV-1 上游分類為例，說明何時該開新 run；此決策與 LLM 無關。
- `#L47-L56` — durable execution 下 harness 該想清楚的五件事：人類守門、基礎設施暫停、state 變更、隱藏資訊、成本護欄。
- `#L57-L61` — 暫停與恢復需要完整 snapshot，使新 run 能虛擬上等同舊 run 並精準接續。
- `#L62-L66` — 把所有東西序列化進 state，讓「新 run 或舊 run」都簡化成同一個狀態機問題。
- `#L67-L69` — 觀察迴圈跑到第 8 次後停止，作為後續除錯的切入點。
- `#L70-L74` — `chooseAction` 只給目標與當前 state、沒給歷史，因此 agent 沒有因重複失敗而放棄。
- `#L75-L78` — 回答提問：Inngest 支援 cron 排程，可依天、小時、年、月、週延後執行。
