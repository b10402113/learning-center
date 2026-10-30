---
source: sources/agentic-engineer/20261030/ai-course-demos/003-mcp-server
source_type: codebase
source_lines: 987
language: TypeScript
file_count: 16
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- `prisma/` + `prisma.config.ts` — Prisma 7 的資料層設定：`schema.prisma` 只宣告 provider 與 output，連線字串搬進 `prisma.config.ts` 的 `datasource.url`，並用 `dotenv/config` 載入。教學點：這個 demo 讓 agent 產生整個專案，設定檔的「放哪裡」本身就是 agent 最容易沿用舊訓練資料而出錯的地方。
- `app/` — 一個 server component 首頁（`Promise.all` 同時抓 users 與 posts、`include.author` 做關聯）加一支 `/api/users` 的 GET／POST route。是 MCP server 之後要包裝成工具的那層資料操作介面。
- `lib/prisma.ts` — 全域 `PrismaClient` singleton，用 `PrismaPg` driver adapter 與 `globalForPrisma` 避免 dev HMR 期間耗盡連線池；import 路徑是 `../app/generated/prisma/client`（少了 `/client` 就 module not found）。
- `scripts/test-database.ts` — 用一支可執行腳本取代測試框架：建一個 demo user、列出所有 user、失敗就 `process.exit(1)`，讓 agent 能自己驗證資料庫真的通了。
- `prompt.md` — 577 行的 agent 規則檔（Cursor 格式 frontmatter `description`／`alwaysApply`），同時列出「絕對不要產生的寫法」與「只能產生的寫法」，外加 15 條自我檢查與後果對照表。是全 repo 最值得教的檔案：它把「版本遷移知識」寫成可驗證的 prompt，而不是散文。
- `AGENTS.md` / `CLAUDE.md` — 兩行的專案層設定：AGENTS.md 要求先讀 `node_modules/next/dist/docs/`，CLAUDE.md 用 `@AGENTS.md` 匯入。與 `prompt.md` 形成「短專案規則 + 長任務規則」兩層。

# L2 detail

- `#L1-L33` — `package.json` — Next 16.2.10、React 19.2.4、Prisma 7.8 系列（`prisma`、`@prisma/client`、`@prisma/adapter-pg`）、`dotenv`、`tsx`；script 有 `db:test`（跑 `scripts/test-database.ts`）與 `db:studio`。注意沒有任何 MCP SDK 依賴：MCP 的價值在「把這層資料操作暴露成工具」，而不是這個 app 自己跑 server。
- `#L1-L34` — `tsconfig.json` — 標準 Next 設定：`strict`、`@/*` 別名、bundler resolution。注意 `lib/prisma.ts` 用的是相對路徑而非別名，因為它要 import 到 gitignore 的 generated client。
- `#L1-L7` — `next.config.ts` — 空白設定，沒有任何 webpack 或 serverExternalPackages 調整。
- `#L1-L18` — `eslint.config.mjs` — `core-web-vitals` 加 TypeScript 規則，忽略 build 產物。
- `#L1-L7` — `postcss.config.mjs` — 只掛 `@tailwindcss/postcss`。
- `#L1-L14` — `prisma.config.ts` — Prisma 7 的新設定入口：頂端 `import "dotenv/config"`、`schema: "prisma/schema.prisma"`、`migrations.path`、`datasource.url: process.env["DATABASE_URL"]`。沒有任何 `engine` 屬性——舊版寫法會直接壞掉，這正是 `prompt.md` 反覆警告的點。
- `#L1-L33` — `prisma/schema.prisma` — `generator client { provider = "prisma-client" output = "../app/generated/prisma" }`，`datasource db` 只有 `provider = "postgresql"`，沒有 `url`；兩個 model：`User`（email unique、`posts Post[]`）與 `Post`（`author` 關聯、`authorId`、`published` 預設 false）。是理解「client 生成到哪裡、為什麼 import 要加 `/client`」的源頭。
- `#L1-L33` — `app/layout.tsx` — root layout：Geist 字型變數、metadata 仍是 create-next-app 預設值，`min-h-full flex flex-col` 外框。
- `#L1-L26` — `app/globals.css` — Tailwind v4 的 `@import` 加 `@theme inline` 與明暗背景變數，與其他兩個 demo 完全相同。
- `#L1-L117` — `app/page.tsx` — server component：`Promise.all` 並行抓 `user.findMany`（createdAt 遞減）與 `post.findMany`（含 `author` 的 id/name/email select），整段包在 try/catch，錯誤訊息直接提示「Make sure your DATABASE_URL is configured」。UI 分成 users 清單與 posts 卡片，`published` 用綠色／黃色徽章區分。學習點：agent 寫資料存取時，錯誤處理與空狀態是規格的一部分。
- `#L1-L28` — `app/api/users/route.ts` — `GET` 回 `prisma.user.findMany()`，`POST` 從 `request.json()` 取 `email`、`name` 建 user 並回 201；兩者都 try/catch 並在失敗時回 500 JSON。這是「之後要包成 MCP tool」最直觀的候選介面：一組有明確輸入輸出的資料操作。
- `#L1-L18` — `lib/prisma.ts` — singleton 模式：`new PrismaPg({ connectionString: process.env.DATABASE_URL! })`、`globalForPrisma.prisma || new PrismaClient({ adapter })`、非 production 才把 instance 掛回 global。三個決策一次到位：adapter 而非 accelerate、global 快取避免 HMR 洩漏連線、自訂 output 路徑。
- `#L1-L33` — `scripts/test-database.ts` — 可執行的冒煙測試：`import "dotenv/config"` → 建 `demo@example.com` → `findMany` 列出 → 成功印 🎉、失敗 `process.exit(1)`。它存在的理由是讓 agent 有辦法在沒有人類點瀏覽器的情況下確認「環境變數、client 生成、連線」三件事同時成立。
- `#L1-L5` — `AGENTS.md` — 5 行的 `nextjs-agent-rules`：這個 Next.js 有 breaking changes，寫程式前先讀 `node_modules/next/dist/docs/`，並注意 deprecation。與 `prompt.md` 互補：一邊防止 agent 憑記憶寫 Next，一邊防止憑記憶寫 Prisma。
- `#L1-L1` — `CLAUDE.md` — 單行 `@AGENTS.md`，把 Claude 的進入點轉接到同一份規則，避免兩份指令不同步。
- `#L1-L577` — `prompt.md` — 整份 agent 規則檔。結構值得拆開看：開頭 frontmatter 給 Cursor 用（`description`、`alwaysApply: false`）；再來是 Prisma 7 的變更摘要（移除 `engine`、`url` 搬離 schema、改用 `@prisma/adapter-pg`）；接著是「🚨 NEVER GENERATE」的錯誤／正確對照（`prisma-client-js`、`@prisma/client` 匯入、缺 `/client`、`accelerateUrl`、schema 內的 `url`、`engine`、`prisma+postgres://` URL）；然後 15 條 ABSOLUTE REQUIREMENTS、版本下限（Node 20.19、TS 5.4）、正確的安裝與 `prisma init --output` 流程、完整程式碼範本（config、schema、client、test script、API route、server component）、15 項 AI 自我驗證清單、錯誤寫法的後果表、常用指令與 curl 測試。學習點：把「模型訓練資料過時」變成負面範例＋可勾選的驗證步驟，比單純描述正確做法有效。
- `#L1-L36` — `README.md` — create-next-app 預設說明，沒有補充 Prisma 步驟；真正的操作順序在 `prompt.md` 的 COMPLETE SETUP WORKFLOW。
