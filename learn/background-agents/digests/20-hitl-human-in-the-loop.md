---
source: sources/background-agents/20261027/20-hitl-human-in-the-loop.md
source_type: text
source_lines: 84
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- HITL 的定義與邊界 — 這裡談的不是強化學習的人類回饋，而是 agent 正想做某件事時被人類判斷擋住；chat agent 的「先問再執行」只是回一個請求，不是把迴圈暫停。
- 批准資訊留在 harness — agent 不該知道自己需要批准，否則會為了避開等待而改變決策；批准是 harness 的確定性邏輯，不需要 eval。
- 背景 agent 的介面是收件匣 — 沒有聊天歷史，agent 需要人時往 inbox 丟一件事，人清掉它就解除封鎖；要的是續跑原迴圈，不是開新一輪。
- approval 不是萬靈丹 — 先擋住會改變狀態的寫入，再去風險化；若每個寫入都要按批准，就失去背景 agent 的意義。

# L2 detail

- `#L1-L9` — 第四課開場：人類終於進入迴圈，澄清此處 HITL 指的是 agent 行動被人類判斷擋住，而非訓練階段的人類回饋。
- `#L10-L22` — HITL 並非背景 agent 專有，chat agent 也有；差別在背景 agent 直接暫停迴圈，而 coding agent 只是回一個批准請求且綁在本機。
- `#L23-L32` — 核心設計：不讓 agent 知道某 action 需要批准，避免它推理出「等太久所以換做法」，把這項資訊留在 harness。
- `#L33-L37` — 要求恢復原本的迴圈續跑，而不是把「我需要幫忙」變成一輪新的對話或新 workflow。
- `#L38-L48` — 背景 agent 的最佳介面是 inbox 而非 chat；描述一個跨供應商共用的全球收件匣願景。
- `#L49-L57` — 收件匣任務有兩種：agent 自己決定求助，以及 harness 硬寫的批准要求；兩者分別對應 LLM 判斷與確定性邏輯。
- `#L58-L67` — 參考資源：Ingest 的 HITL 文件與 Slack 做法、OpenAI 指南、AI delegation 論文、Agent Dojo 研究環境。
- `#L68-L72` — 以 `rollback release` 作為第一個需批准的 action；policy 不對 agent 曝光，agent 只看得到 action 名稱。
- `#L73-L84` — approval 不能防止讀到不可信 log 後的錯誤提案；策略是先擋寫入、再縮小爆炸半徑或灰度發布，避免退化成手動按批准的 chat agent。
