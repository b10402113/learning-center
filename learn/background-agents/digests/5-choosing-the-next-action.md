---
source: sources/background-agents/20261027/5-choosing-the-next-action.md
source_type: text
source_lines: 114
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 決策呼叫 — 目標未達成時把 goal 與 state 丟給 `chooseAction` 讓 LLM 選動作；LLM 只負責思考並選下一步，真正複雜度在 harness 與狀態設計。
- Structured outputs — 用 schema 約束回傳 `action`、`reason`、`detail` 的 JSON，模型保證形狀正確；每次呼叫都是不帶 messages 的單次請求。
- 留痕與護欄 — `setIteration`、`recordDecision` 記錄每一輪與決策，因為背景執行沒有聊天紀錄可回溯。
- 狀態即商業邏輯 — 「好的世界」長什麼樣由開發者定義（JSON、截圖、座標皆可），並要定出修改契約。
- 何時用 LLM — 只在無法確定性推理時才交給 LLM，並對它寫 evals；Jamba 類模型只適合動作與參數已確定的情境。

# L2 detail

- `#L1-L5` — 目標未滿足時呼叫 `chooseAction`，把 goal 與 state 交給 LLM 選動作；提示可先讀其 system prompt。
- `#L6-L14` — LLM 在此系統中角色最小：只思考、選下一步、退場；不追蹤 messages，因此完全 stateless。
- `#L15-L19` — AI engineering 的觀察：LLM 呼叫最簡單，難的是 harness 与 LLM 的對接方式。
- `#L20-L34` — structured outputs 說明：以 schema 要求 `action`／`reason`／`detail`，前沿模型保證輸出形狀正確。
- `#L35-L39` — 實際餵給模型的三樣東西：system prompt 角色設定、goal、目前的 state；回傳一個 decision 物件。
- `#L40-L45` — 用 `setIteration` 更新迴圈次數，再用 `recordDecision` 儲存決策，供 dashboard 與 audit log 使用。
- `#L46-L53` — 背景執行必須逐步留痕：沒有聊天紀錄，只能靠記錄決策、動作與核准者來回溯與改進。
- `#L54-L60` — 把 LLM 視為一個 reasoning function，與其他 deterministic 函式並列，而非什麼都交給它。
- `#L61-L67` — 「檢查目標」也可用 LLM，但本課用 deterministic 的 `goalSatisfied` 比對 state 與 goal condition（如 `rollbackRelease` 為 true）。
- `#L68-L80` — 「好的狀態」是商業邏輯：browser agent 是截圖加 DOM、computer use 是座標、遊戲 agent 是玩家資料；還要定義 state 的修改契約。
- `#L81-L87` — 需要推理時才把目標檢查交給 LLM，並針對該呼叫寫 evals，挑對地方使用。
- `#L88-L95` — 完成 `recordDecision` 的欄位，並檢查 terminal decision：是否為 wait 或 complete。
- `#L96-L102` — LLM 說「完成」是有價值的訊號：要驗證它對不對，並追查 `goalSatisfied` 與 `chooseAction` 指令之間的落差。
- `#L103-L114` — Jamba 提問：動作集合有限時適合，但它不產生 arguments；不是 drop-in replacement，需 evals 才能決定是否值得改架構。
