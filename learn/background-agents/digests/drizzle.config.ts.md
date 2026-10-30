---
source: sources/background-agents/20261027/drizzle.config.ts
source_type: text
source_lines: 15
status: skipped
skip_reason: "Repository scaffolding, not part of the course material."
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 資料庫工具設定 — drizzle-kit 以 `server/schema.ts` 為 schema、輸出 `./drizzle`、dialect 為 PostgreSQL。
- 連線來源 — 從 `.env` 讀 `DATABASE_URL`，缺少時直接拋錯，避免誤連。

# L2 detail

- `#L1-L6` — 載入 dotenv、定義 config、讀取並驗證 `DATABASE_URL`。
- `#L7-L15` — 匯出 drizzle 設定：schema 路徑、輸出目錄、postgresql dialect、dbCredentials。
