---
source: sources/agentic-engineer/20261030/ai-course-demos/004-agent-context
source_type: codebase
source_lines: 214
language: TypeScript
file_count: 13
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- `AGENTS.md` — 五行專案上下文：stack 是 Next.js App Router + TypeScript；金額欄位一律用 `Cents` 後綴並存整數分（`totalCents`），不得存浮點美元；API 回應一律 snake_case。學習點：這是「只有人能提供、模型無法從程式碼推得」的規則，也正是 context engineering 的最小單位。
- `app/` — 刻意留白的畫面：`page.tsx` 只印 Hello world，`layout.tsx` 與 `globals.css` 是 create-next-app 預設。app 本身不提供任何線索，所以 agent 的行為完全由 `AGENTS.md` 與型別檔決定。
- `types/order.ts` — 七行的 `OrderStatus` 與 `Order` 介面：`customerName` 是 camelCase，且完全沒有金額欄位。這是拿來對照 `AGENTS.md` 的素材：agent 要在這裡新增 `totalCents` 時，必須同時套用命名與單位規則，而不是照著 `customerName` 的 camelCase 類推。
- `CLAUDE.md` — 0 bytes 的空檔。與 001／003 的 `@AGENTS.md` 不同，這裡沒有轉接，等於 Claude Code 讀不到規則；放進 repo 剛好可以對照「檔案存在」與「上下文真的被載入」是兩件事。
- 其餘設定（`package.json`、`tsconfig.json`、`next.config.ts`、eslint、postcss、`pnpm-workspace.yaml`、`README.md`）都是 create-next-app 預設，價值在於證明「雜訊越少，AGENTS.md 的訊號越強」。

# L2 detail

- `#L1-L26` — `package.json` — Next 16.2.11 + React 19.2.4，Tailwind v4；只有 dev/build/start/lint。專案名就叫 `004-agent-context`，沒有任何業務依賴——context 實驗不需要 runtime 支撐。
- `#L1-L34` — `tsconfig.json` — `strict: true`、`@/*` 別名、bundler resolution。strict 會檢查 `Order` 的欄位型別，但不會檢查「金額是不是用分」或「API key 是不是 snake_case」，這正是要寫進 AGENTS.md 的原因。
- `#L1-L7` — `next.config.ts` — 空白設定。
- `#L1-L18` — `eslint.config.mjs` — `core-web-vitals` 加 TypeScript 規則，忽略建置產物；沒有任何自訂規則去強制 `Cents` 命名。
- `#L1-L7` — `postcss.config.mjs` — 只掛 `@tailwindcss/postcss`。
- `#L1-L6` — `pnpm-workspace.yaml` — `allowBuilds` 與 `ignoredBuiltDependencies` 都列了 sharp、unrs-resolver，屬於安裝環境設定。
- `#L1-L33` — `app/layout.tsx` — root layout：Geist 字型變數、metadata 仍是預設的「Create Next App」，`min-h-full flex flex-col` 外框。
- `#L1-L26` — `app/globals.css` — Tailwind v4 的 `@import "tailwindcss"`、`@theme inline` 與明暗背景變數，與 001／003 逐字相同。
- `#L1-L9` — `app/page.tsx` — 九行的 Hello world，置中的灰字。它存在的意義是讓 repo 有東西跑，同時不給 agent 任何可模仿的既有慣例。
- `#L1-L7` — `types/order.ts` — `OrderStatus = "pending" | "fulfilled" | "cancelled"` 與 `Order { id, customerName, status }`。三個觀察點：status 用 union 而非 enum、欄位是 camelCase、沒有金額也沒有 `createdAt`。這是 agent 要延伸的起點，也是檢查它有沒有讀 AGENTS.md 的試紙。
- `#L1-L5` — `AGENTS.md` — 唯一的規則檔。三條規則各有性格：stack 是定位、`Cents` 是命名＋單位＋型別三合一的約定、snake_case 是跨語言邊界（TS camelCase → API snake_case）的約定。學習點：好的 context 條目短、可執行、且能明確判斷違反與否。
- `#L1-L36` — `README.md` — create-next-app 預設說明，完全沒有提到 AGENTS.md；也就是說這份 repo 的「真正文件」不是給人看的 README，而是給 agent 看的五行規則。
