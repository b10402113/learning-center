---
source: sources/background-agents/20261027/package.json
source_type: text
source_lines: 62
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 專案骨架 — ESM、private 的 `background-agents-workshop`，用 npm scripts 同時啟動 operator、web、inngest、checkout、agent 與 VitePress 文件站。
- 執行期依賴 — `ai` + `@ai-sdk/openai`、`inngest`、`drizzle-orm` + `postgres`、`express`、`react`、`zod`。
- 開發工具 — `tsx` 直跑 TypeScript、`drizzle-kit` 推 schema、`oxlint`／`oxfmt`、`vitepress`、`concurrently`、`typescript`。

# L2 detail

- `#L1-L4` — 套件名稱、private、`"type": "module"`。
- `#L5-L36` — scripts：`dev` 併跑 operator/web/inngest、`dev:checkout`（3004）、`dev:operator`（3001）、`dev:agent`（3002）、`dev:web`（5173）、`dev:inngest`（8288）、`docs`（5174）、`stop`、`notes:generate/check`、`lint`、`format`、`db:push`、`db:seed`、`preflight`、`typecheck`、`build`；每個 dev script 前都有 `check-ports`。
- `#L37-L50` — dependencies：AI SDK 與 OpenAI provider、Inngest 4.x、Drizzle ORM 0.45、Express 5、React 19、Zod 4。
- `#L51-L62` — devDependencies：型別套件、drizzle-kit、inngest-cli、oxfmt／oxlint、tsx、TypeScript 7、Vite 8、VitePress、concurrently。
