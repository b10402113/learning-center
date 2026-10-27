---
source: sources/background-agents/20261027/3-goal-and-harness-overview.md
source_type: text
source_lines: 87
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 本課目標 — checkout service 開出 incident 與 alert，harness 要能觀察到並依 observe-decide-act 行動。
- 「世界」的概念 — 對這個 agent 而言世界就是服務狀態；重點是把狀態快照下來餵給 agent（如 browser agent 的截圖與標註）。
- 觀察是寫死的 — world state 由程式碼在每次 loop 自動餵入，不是 agent 自己決定要不要看；world state、run state、execution history 三者也共同支撐決策。
- harness 層級的權限 — 動作由 harness 再驗證一次；rollback 等危險動作改由人在 inbox 執行，對照 Anthropic 的 model directed / predefined workflow / harness delegated 區分。
- 工具清單很小 — 查 log、查變更、停用功能、回復版本、等待、求助、完成，重點不在工具數量。

# L2 detail

- `#L1-L6` — 課程成果：讓 harness 觀察 checkout service 的 incident/alert 並觸發 observe-decide-act loop，作為後續所有內容的基礎。
- `#L7-L18` — 為何先談「世界」：理解世界的 agent 才有真正智慧；這裡的世界就是被監控服務的狀態。
- `#L19-L32` — 把世界展示給 agent：browser agent 與 computer use 的截圖與標註，對應到服務狀態快照（健康、200、近期 alert）。
- `#L33-L68` — harness 自動觀察並餵入狀態、動作可能是終止／等待／求助／調查；harness 再驗證動作（rollback 交給人）並區分 model directed、predefined workflows、harness delegated actions；定義 world state、run state、execution history。
- `#L69-L87` — 參考 ReAct 2022 論文，以及本課極小的工具清單（檢查 log／變更、停用功能、回復版本、等待、求助、完成）。
