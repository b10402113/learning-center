---
source: sources/background-agents/20261027/2-course-project-setup.md
source_type: text
source_lines: 122
status: skipped
skip_reason: "The source lesson is not covered by the current node partition."
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 環境初始化 — 切到 lesson one，`npm install`、複製 `.env.example`，並準備 Neon 免費 Postgres 的 connection string。
- 模型金鑰 — 需要 OpenAI API key（或改用 Claude 等，透過 AI SDK 換模型名稱即可），儲值最低金額、用 GPT-4o 等級模型即可。
- 資料庫與檢查 — `npm run db:push`、`npm run preflight`、`npm run db:seed` 三步驟驗證環境。
- 三個服務 — `dev:agent` 是空殼 API endpoint、`dev` 跑 web app 與 Inngest、`dev:checkout` 是模擬服務，三個終端機分別啟動。
- 故障參數與分支 — 後續測試用 fault type、alerts 數量、interval、self recover；進度落後可切 lesson branch 或叫 coding agent 補。

# L2 detail

- `#L1-L4` — 第一課環境設定：`npm install`、複製 `.env.example` 成 `.env`。
- `#L5-L14` — 用 neon.new 取得免費 Postgres connection string，未 claim 約 72 小時失效；也可改用自己的本機 Postgres。
- `#L15-L29` — OpenAI API key 申請、建立 secret key 與儲值；說明可改用 Claude API，只需換模型名稱。
- `#L30-L62` — `npm run db:push` 推 schema、`npm run preflight` 檢查 Node.js／schema／key、`npm run db:seed` 塞初始資料。
- `#L63-L94` — 三個要啟動的服務：`npm run dev:agent`（Agent API，用 Inngest 接收事件）、`npm run dev`（web app + Inngest）、`npm run dev:checkout`（模擬 checkout service）。
- `#L95-L107` — 測試用故障參數：fault type、alerts 數量、interval、self recover，用來製造不同 incident 情境。
- `#L108-L122` — 分支策略：解答放在 lesson two，可沿用自己程式碼、切換 branch，或請 coding agent 對照筆記補進度。
