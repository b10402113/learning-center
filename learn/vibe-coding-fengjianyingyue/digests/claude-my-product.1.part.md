---
source: claude-my-product
source_type: codebase
source_lines: 17972
language: mixed
file_count: 27
part: 1
status: absorbed
absorbed_at: 2026-09-26
created: 2026-09-26
updated: 2026-09-26
---

# claude-my-product — Part 1 (PRD + UI prototype + agent config)

## Overview (L1)

This cluster is the "define the product, then configure the AI coding agent" stage of a vibe-coding workflow for a personal-finance web app named **财务管家 (Finance Steward)**. It holds three PRD markdown files (product manager), a folder of AI-generated UI prototypes (designer), and the two root agent-config files plus a skills lockfile.

- **PRD docs** — a V1.0 product spec, a V1.0.1 increment adding auth, and a separate admin-backend PRD. These fix scope, features, data model, and success metrics.
- **UI prototypes** — an exported `Google Stitch` bundle (`stitch_prd_app_generator.zip`) of six screens (`dashboard`, `add_record`, `transaction_history`, `statistics`, `register_a`, `settings` plus `a`), each as `code.html` + `screen.png`, and a `financial_manager_system/DESIGN.md` design-token system. Tailwind CDN + Plus Jakarta Sans.
- **Agent config** — `AGENTS.md` and `CLAUDE.md` are byte-for-byte mirrors that brief the coding agent (Codex / Claude Code) on project structure, tech stack, design system, and data model.
- **`1比1原型copy2code/`** — the same Stitch HTML output copied 1:1 into numbered files, used as the "prototype-copy-to-code" reference.

## Sections (L2)

### prd-v1
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/001.产品PRD（产品经理）/财务管家PRD-V1.0.md#prd-v1]]
- Purpose: The baseline product requirements doc (V1.0, 2026-04-22, status 初稿待评审) for a lightweight personal/family finance tool.
- Key claims: Core value = record a transaction in ≤3s, see monthly income/expense/balance, share a ledger. Priority order is 个人 (18-35) > 家庭/情侣 > 小微企业. P0 features: quick bookkeeping (3 steps), edit/delete, default categories, monthly report, category pie chart. P1: date picker, notes, multi-account, custom categories, trend line, Excel export. P2: multi-ledger. Defines 10 expense categories (餐饮/交通/购物/娱乐/住房/医疗/通讯/服饰/人情/其他) and 5 income (工资/兼职/奖金/礼金/其他), and 5 account types (现金/银行卡/微信支付/支付宝/银行账户). Full color palette + font sizes, ASCII wireframe, version plan V1.0/V1.1/V2.0, KPI table (DAU 500+, <500ms save, >99% success).
- Learner-relevant: Shows how a PRD becomes the spec the agent consumes. Note the complete category/account enumerations and the color hex table — these are the source of truth copied into AGENTS.md and DESIGN.md later.

### prd-v1.0.1
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/001.产品PRD（产品经理）/财务管家PRD-V1.0.1.md]]
- Purpose: Increment over V1.0 adding username/password auth.
- Key claims: New §3.0 auth: register (username 3-20 chars, password 6-20), login, logout, per-user data isolation; P0. Adds login/register page wireframes and a password-encryption risk row. Security §4.3 changed from localStorage-only to encrypted local storage and localStorage isolation per user. Everything else (features, categories, palette) is carried over unchanged.
- Learner-relevant: A clean example of iterative PRD versioning — compare diffs to V1.0 to see what a feature addition touches. Auth still runs on localStorage, not a server, in the PRD's own scope.

### admin-prd
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/001.产品PRD（产品经理）/财务管家后台管理系统PRD.md]]
- Purpose: Spec for a separate admin back office that reads (never mutates) the app's data.
- Key claims: Hard constraints — may create exactly one new table `admins`, must not alter existing schema. Documents the existing data model as tables: `users`, `ledgers`, `accounts`, `account_types`, `categories`, `category_types`, `transactions`, `admins`. Lists existing `/api/*` endpoints (register/login/verify/user/accounts/categories/transactions/home/statistics/export/account-types/category-types). Adds admin-only endpoints under `/api/admin/*` for login, users, transactions, statistics (overview/trend/ranking), categories, account-types. `admins` schema given (id, username UNIQUE, password VARCHAR(255), nickname, created_at); BCrypt, pagination 20/page, read-only. Explicitly rejects export (否) and scheduled jobs (否); §8 says the `admins` table was already created.
- Learner-relevant: Strong example of scoping by constraint ("do not touch the schema, add one table"). The table + endpoint inventory is the canonical data model for the whole project and matches the AGENTS.md transaction/account shapes.

### ui-prototypes
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/002.产品UI原型（美术设计）/UI原型/]]
- Purpose: AI-generated high-fidelity screens, one folder per page, each with `code.html` (Tailwind markup) and `screen.png` (render).
- Key claims: Pages = `a` (onboarding/entry, 180 lines), `dashboard` (334), `add_record` (360), `transaction_history` (367), `statistics` (366), `settings` (317), `register_a` (202). The sibling `stitch_prd_app_generator.zip` (1.8M, dated 04-29-2026) contains the identical folder tree, evidencing generation by **Google Stitch** from the PRD. HTML titles are Chinese: "财务管家 - 财务管理仪表板", "注册账号 - 财务管家", "财务管家 - 财务管理仪表板" etc. All use `<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries">` and a `tailwind.config` block that re-declares the `financial_manager_system` tokens (fonts, colors). Settings screen references app persistence (`financeData`/localStorage theme).
- Learner-relevant: The path from text PRD → Stitch prompt → exportable HTML. Note Stitch outputs static screens, not a working app; later stages turn them into functional code.

### design-system
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/002.产品UI原型（美术设计）/UI原型/financial_manager_system/DESIGN.md]]
- Purpose: The design-token + style contract extracted from the prototype, named "Financial Manager System".
- Key claims: YAML frontmatter defines full Material-style tokens — `primary #864e5a`, `primary-container #ffb7c5` (Sakura Pink), `secondary #655781` (Lavender), surfaces in Cream White `#fbf9f8`, error `#ba1a1a`; typography all `Plus Jakarta Sans` with `h1` 32px/700 down to `price-display` 28px/700; radius scale 4px→pill; 4px spacing unit, 20px margin, 16px gutter. Prose sections: brand = "Gentle Financial Steward" (Soft Minimalism + Modern Corporate), Sakura & Lavender gradient for primary actions, tonal layering + ambient lavender-tinted shadows, glassmorphism nav, pill-shaped Add-Transaction. Component rules for buttons/cards/inputs/lists/chips/progress bars.
- Learner-relevant: The design system is a machine-readable artifact an AI agent can implement directly — this is what makes generated UI consistent. Contrasts with the PRD palette table (same hex values, now formalized as tokens).

### copy2code
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/002.产品UI原型（美术设计）/1比1原型copy2code/]]
- Purpose: Numbered `1.html`–`4.html` copies of the Stitch HTML, a 1:1 "prototype → code" handoff set.
- Key claims: Byte-compatible with the UI原型 Stitch files: `1.html` (180) = `a/code.html`, `2.html` (202) = `register_a`, `3.html` (334) = `dashboard`, `4.html` (367) = `transaction_history`. Filenames anonymize pages into order.
- Learner-relevant: Shows the common practice of keeping a frozen 1:1 reference of generated screens before an agent rewrites them into the real app.

### agent-config
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/AGENTS.md]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/CLAUDE.md]]
- Purpose: Repo instructions for the AI coding agent — `AGENTS.md` addresses Codex, `CLAUDE.md` addresses Claude Code; content is identical.
- Key claims: Declares a single-page HTML app (`财务管家.html`, ~48KB) with no build system; run by opening in a browser or `npx serve .` / `python -m http.server 8000`. Tech stack: vanilla HTML/CSS/JS, Chart.js via CDN, Google Fonts (Noto Sans SC, ZCOOL KuaiLe, DM Sans), localStorage persistence under key `financeData`, CSS custom properties, `prefers-color-scheme` dark mode, mobile-first max-width 480px. Restates the design palette and, importantly, the **data model**: transaction `{id, type:'expense'|'income', category, amount, account, remark, date}` and account `{id, name, type, icon(emoji), balance}`.
- Learner-relevant: This is the core lesson of the cluster: a good agent config states stack, commands, structure, conventions, and the data model so the agent can act without re-deriving them. Note the PRD describes a multi-table backend while AGENTS.md locks V1 to one localStorage HTML file — the config pins the actual implementation target.

### skills-lock
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/skills-lock.json]]
- Purpose: A lockfile pinning third-party agent skills by source + content hash.
- Key claims: `version: 1`, four skills — `find-skills` (vercel-labs/skills), `html-ppt` (lewislulu/html-ppt-skill), `skill-vetter` (useai-pro/openclaw-skills-security), `wechat-article-writer` (iamzhihuix/happy-claude-skills) — each with `sourceType: github`, `skillPath`, and a `computedHash`.
- Learner-relevant: Shows skills as versioned, integrity-checked dependencies of an agent setup, not just prompt text.
