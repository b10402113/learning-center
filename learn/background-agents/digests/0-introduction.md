---
source: sources/background-agents/20261027/0-introduction.md
source_type: text
source_lines: 70
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 開場 — Scott Moss 定義 background agent 是「harness + infrastructure + 傳統 agent」，能無限期執行、自我修復。
- 與 chat agent 的差異 — 不是對話，而是給目標、盯事件、照排程跑；何時找人由 harness 寫死（deterministic），不交給模型判斷。
- 示範成品 — 電商 checkout service 的 on-call triage agent，包含 activity 介面與需要人工的 inbox。
- 一輪 investigation — observe 世界狀態、跑 loop 決定下一步、harness 驗證並在必要時求助；等待期間仍持續接收事件。
- 課程定位 — 重點是 harness 與保護機制，而不是模型能力。

# L2 detail

- `#L1-L3` — 課程開場：講者 Scott Moss 與主題「不會死的 agent」。
- `#L4-L16` — background agent 與 ChatGPT/Claude 這類 conversational agent 的差別：給目標、盯事件、deterministic 地回頭找人；harness 的組成與無限執行特性。
- `#L17-L30` — 展示已完成版本：`npm run dev` 啟動 app 與 agent API，情境是電商 checkout service 的 on-call 助手，需要一個觀察與協作的介面。
- `#L31-L49` — 一輪 investigation 的流程：observe、多輪 loop、harness 的驗證機制，以及 inbox 的兩種用途（問問題、要核准）。
- `#L50-L70` — 實跑第三方依賴故障：agent 求助後仍持續監聽事件，最終比對回覆與 health recovered 事件收尾。
