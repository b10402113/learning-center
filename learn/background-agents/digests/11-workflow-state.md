---
source: sources/background-agents/20261027/11-workflow-state.md
source_type: text
source_lines: 77
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- **兩種 state 必須分清楚** — 一種是業務資料（如 Postgres 裡的 `incidents`），另一種是 workflow 的執行進度。
- **checkpoint 由 Inngest 代管** — 每個 step 的 return 值被存成 checkpoint；business logic 仍得自己寫進資料庫。
- **長時間 workflow 的版本遷移** — 部署新程式碼時要處理正在跑的 run，可用 versioning 或直接停止，如同資料庫 migration。
- **改寫 Lesson 2：抽出 `executeAction`** — 把呼叫服務 API、記錄 log、處理 stale 與錯誤的邏輯集中成 helper。

# L2 detail

- `#L1-L10` — 區分 checkout 業務 state（Postgres）與 workflow state（哪些 step 已完成），後者由 Inngest 負責。
- `#L11-L20` — 每個完成 step 都會留下 checkpoint；Inngest 只存 step 的 return 值，不存 business logic，因此 action 需自行記錄。
- `#L21-L30` — 更新 workflow 時要考慮正在跑的 run；可並行新舊版本，或以 migration 的成本角度決定是否中止。
- `#L31-L38` — 切到 `lesson-2` 分支，準備把單一 step 的 loop 改寫成多個 step。
- `#L39-L47` — 新增 import（`logAgentActivity`、`actionPolicy`、`ActionName`）並規劃 `executeAction` helper 與執行前 logging。
- `#L48-L77` — `executeAction` 的參數（`environmentId`、`runId`、`actionId`、`name`、選填 `expectedVersion`）、組 input、呼叫 `/operations`、處理 stale 與錯誤記錄。
