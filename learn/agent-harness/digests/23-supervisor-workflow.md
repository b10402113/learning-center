---
source: sources/agent-harness/20260915/23-supervisor-workflow.txt
source_type: text
source_lines: 269
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- Supervisor 的職責是先判斷需不需要 investigators，並產生一份可執行的 plan。
- `generateObject` 提供 schema-backed structured output，適合把 LLM 輸出直接當成程式可消費的物件。
- Plan 是 first-class artifact，因此需要 Zod schema，並用 `z.infer` 取得對應的 TypeScript 型別。
- 現代模型的 structured output 多半在模型層完成，不再依賴舊式「要求 JSON、解析、失敗重試」的迴圈。
- `synthesize` 用 `generateText` 把各 investigator 的 findings 整理成一篇給客戶的回覆，並要求對缺失的調查誠實說明。
- Supervisor 是另一個 DBOS workflow，同樣有 workflow ID、事件與 step。
- `makePlan` 必須放進 step，確保每個 workflow instance 只規劃一次，且重啟後不會重做。

# L2 detail

- `#L1-L10` — 定義 supervisor 的工作：判斷是否需要 investigator，以及規劃整體任務。
- `#L11-L43` — 匯入 DBOS 與 `generateObject`；解釋 structured output 是 schema 保證的 JSON，並舉動態生成 UI 為例。
- `#L44-L72` — 建立 plan schema 作為 first-class artifact，並用 `z.infer` 從 schema 推導 TypeScript 型別。
- `#L73-L109` — 實作 `makePlan(task)`：以 `generateObject` 搭配 schema 產生計畫；對比舊式 JSON 解析與重試機制。
- `#L110-L137` — 補上 system 與 prompt、回傳 object；附帶討論 `generateObject` 已 deprecated、可改用 `generateText` 的 output 設定。
- `#L138-L181` — 實作 `synthesize(task, findings)`：用 `generateText` 綜合調查結果，以 support lead 身分回覆並承認缺失。
- `#L182-L218` — 新增 supervisor DBOS workflow：取得 workflow ID，emit 開始事件，事件一律包在 step 內。
- `#L219-L269` — 解釋 `makePlan` 為何必須是 step（只規劃一次、可持久化），emit plan created，並列出 plan 的 steps。
