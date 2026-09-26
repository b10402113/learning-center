---
source: claude-my-product
source_type: codebase
source_lines: 2675
language: mixed
file_count: 8
part: 5
status: absorbed
absorbed_at: 2026-09-26
created: 2026-09-26
updated: 2026-09-26
---

## Overview (L1)

Part 5 covers the **"test and deliver" stage** of the AI-built product "财务管家" (Finance Butler). It holds three per-client test plans (backend API, frontend web, UniApp cross-platform), three generated HTML test reports, a test-harness configuration README, and the delivery-stage product manual (产品说明书).

The testing approach is **per-project, layered by client technology**. Backend uses unit / API / integration / security / performance layers. Frontend uses UI / functional / integration / E2E / browser-compatibility layers and explicitly declares unit tests "not applicable" (plain HTML). UniApp adds platform-compatibility testing across iOS / Android / WeChat mini-program.

All three reports claim **100% pass**: backend 21/21, frontend 76/76, UniApp 60/60. The backend report contains real runtime assertions (tokens, IDs, HTTP 401/500, "SQL injection 已防护"), while the frontend and UniApp reports are largely **static presence checks** (file exists, DOCTYPE/head/body present, CSS/script references, `.vue` files, API-method names).

The product manual is the customer-facing delivery doc: positioning, per-client feature catalog, step-by-step user guide, architecture diagram, stack table, 7 DB tables, user + admin API surface, FAQ, support contact.

Risk signals in the AI-generated code/docs: static-presence assertions inflate "100% pass"; port/architecture facts drift across docs (backend plan says 3001; manual says API 3000/3001, admin 3002); boundary-value cases (negative/zero amount, bad paging, invalid dates) recur and are the reliable way to validate AI-written input checking; cross-platform / cross-browser variance is the top declared risk, since AI code is typically exercised on one runtime only.

## Sections (L2)

### 008-plans-backend
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/008.项目测试（测试工程师）/测试计划/backend测试计划.md]]
- Purpose: Test plan for the Node.js / Express REST API (port 3001, MySQL + mysql2, JWT, bcryptjs, xlsx exporter) located at `003.前端代码（前端工程师）/backend`.
- Key claims:
  - 31 API cases (API-001..031) across auth (`/api/register|login|verify`), user, accounts (GET/POST/PUT/DELETE), categories, transactions (with paging, type/month filters, missing-params), `/api/home`, `/api/statistics`, `/api/export`.
  - 6 security cases (SEC-001..006): SQL injection, XSS, unauthorized access (expect 401), privilege escalation to another user's data, token forgery, brute-force login.
  - 8 boundary cases (BT-001..008): empty / negative / non-numeric amount, negative paging, out-of-range paging, invalid date format, over-long string, special characters.
  - 3 performance cases (PT-001..003): 100 concurrent requests, 1000-row query under 3s, large Excel export.
  - Five-layer scheme: UT (utils, formatting, bcrypt) → API (request/response, params, errors) → IT (multi-endpoint flows, DB consistency) → Security → Performance.
  - High-risk table: JWT validation, password hashing, SQL injection, Excel memory blowup, connection-pool exhaustion. Medium: number/string coercion, date/timezone.
  - Release checklist: all auth + CRUD endpoints OK, statistics correct, security + concurrency pass, no console errors, DB connection OK.
- Learner-relevant: Canonical example of turning a source-read backend into a layered, risk-first plan; the risk table is the transferable artifact.

### 008-plans-frontend
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/008.项目测试（测试工程师）/测试计划/frontend测试计划.md]]
- Purpose: Test plan for the single-page HTML/CSS/JS web app (`frontend/`, Tailwind CDN, Chart.js, localStorage, no build, no backend).
- Key claims:
  - Explicitly declares **unit tests "not applicable"** for a pure-HTML project; layers become UI, functional, integration, E2E.
  - 8 UI cases (UI-001..008) for page styling and a 480px mobile breakpoint.
  - 25 functional cases (FT-001..025): register/login/logout, add expense/income, category+account select, category/account CRUD, dashboard loading, top-5 categories, recent records, year switch, pie + line chart, filters, pagination, Excel export, delete transaction.
  - 9 boundary cases (BT-001..009): empty username/password, wrong password, invalid amount, no category, first-run empty storage, large-data rendering, special chars, over-long remark.
  - 6 browser-compat cases (CT-001..006): login page and charts on Chrome / Safari / Edge.
  - Risk table: Excel export and Chart.js cross-browser rendering (high), localStorage format drift (medium), file-path routing (low).
  - Env: Chrome/Safari/Edge latest, iPhone 12 Pro + Android emulators; tools manual + DevTools / Safari Web Inspector.
- Learner-relevant: Shows the honest "what can't be unit-tested" boundary and why frontend risk concentrates on rendering and storage.

### 008-plans-uniapp
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/008.项目测试（测试工程师）/测试计划/uniapp测试计划.md]]
- Purpose: Test plan for the Vue3 UniApp app (`007.跨端APP应用（移动端开发工程师）/uniapp-project`) targeting iOS / Android / WeChat mini-program, built with HBuilderX.
- Key claims:
  - 13 UI cases, 39 functional cases (FT-001..039: login/register, add-record type tabs/amount/category/account/remark/quick-amount/save, statistics year switch + income/expense/balance + pie/line data, history filters/load-more/month grouping/detail modal/delete, settings entries, category + account CRUD).
  - 9 boundary cases (BT-001..009): empty/zero amount, no category, no account, empty username/password, empty states, network-error prompt.
  - 15 platform-compat cases (CT-001..015): canvas pie/line, pull-up load, storage read/write, network request per iOS / Android / WeChat.
  - Platform-difference matrix marks WeChat canvas pie/line and上拉加载 as ⚠️ needing compatibility handling.
  - High risks: canvas API divergence, scroll-view event differences, camelCase↔snake_case field mapping. Medium: login-state persistence, network timeout, route params.
  - Env: iPhone 14 / iOS 16+, Android 12 / API 31+, WeChat DevTools base library 2.25+. Per-platform release checklists; WeChat requires passing review + canvas + load-more.
- Learner-relevant: Best example of compatibility testing driven by a platform-variance matrix rather than by code structure.

### 008-reports
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/008.项目测试（测试工程师）/测试报告/backend核心业务测试报告.html]], [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/008.项目测试（测试工程师）/测试报告/frontend测试报告.html]], [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/008.项目测试（测试工程师）/测试报告/uniapp测试报告.html]]
- Purpose: Three self-contained HTML reports (styled summary counters + per-test pass/fail list) generated 2026/5/18 (backend 13:48, frontend 13:53, uniapp 13:54).
- Key claims:
  - Backend: 21 total / 21 pass / 0 fail / 100%. Real evidence in messages — register, login token `eyJhbGci...`, token verify, user info, 3 accounts, add account ID 60, update, 0 categories, add category ID 181, add transaction ID 54, list, filter, home "收入 0 / 支出 100", statistics, delete txn/account/category, unauthorized 401, SQL injection "已防护", invalid token 500.
  - Frontend: 76 total / 76 pass / 0 fail. Assertions are mostly **static**: 9 page files exist, each page has DOCTYPE/HTML/HEAD/BODY/Title, login/register/dashboard element checks, filters, list, paging, settings entries, and CSS + script reference presence for each page.
  - UniApp: 60 total / 60 pass / 0 fail. Assertions: project files exist (App.vue, main.js, manifest.json, pages.json, index.html, js/api.js), pages.json/manifest.json/tabBar keys present, 9 page `.vue` files exist, 9 API methods (baseURL, login, register, getTransactions, addTransaction, getCategories, getAccounts, getHomeData, getStatistics, Token auth) present.
- Learner-relevant: A concrete demonstration that "100% pass" can be inflated by static presence checks — contrast the backend's real assertions with the frontend/UniApp ones.

### 008-harness
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/008.项目测试（测试工程师）/测试工程配置/README.md]]
- Purpose: Documents the test directory layout and run commands for all three clients.
- Key claims:
  - Backend `tests/{unit,api,security,performance}` with `package-test.json`; files `unit/utils.test.js`, `api/auth.test.js`, `api/accounts.test.js`, `security/security.test.js`, `performance/performance.test.js`.
  - Frontend `tests/{unit,integration,e2e,reports}` with Playwright `e2e/pages.test.js` and a shared `test-runner.js`.
  - UniApp `tests/{unit,integration,platform,reports}` with `platform/platform.config.js` defining per-platform differences and test focus.
  - Run commands: `npm test`, `npm run test:api`, `npm run test:security`, `npm test --suite=platform`, `npm test --report`.
  - Reports output to `008.项目测试（测试工程师）/测试报告/`; rules: tests isolated from business code, frontend E2E needs backend running, performance tests optional, UniApp platform tests manual-first.
- Learner-relevant: The harness is deliberately isolated from production source — a reusable pattern for testing AI-generated code without touching it.

### 009-product-manual
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/009.交付与上线（交付经理和运维人员）/产品说明书.md]]
- Purpose: Customer-facing product manual / delivery document (V1.0, May 2026). Defines "delivery" here as a human-readable manual plus declared architecture.
- Key claims:
  - Three clients: user web (port 3000), admin console (port 3002), mobile app (UniApp, no port).
  - Full feature catalog: user dashboard (income/expense/balance/top categories/recent), quick-entry (type, amount, category, account, date, remark), transaction list (filter/edit/delete), statistics (year, totals, pie, line), category management (system categories undeletable; presets: 餐饮/交通/购物/娱乐/住房/医疗/通讯/服饰/人情/其他 income: 工资/兼职/奖金/礼金/其他), account management, settings (nickname/avatar/theme/logout).
  - Admin features: data overview, user management, transaction management, category management, account-type management.
  - Step-by-step user operating guide (register, first entry, daily use, statistics, export, add category/account).
  - Architecture diagram: web/UniApp → Express API → MySQL; stack table (HTML+Tailwind+JS; UniApp+Vue3; Node+Express; MySQL; JWT; bcrypt).
  - 7 DB tables: users, ledgers, accounts, account_types, categories, transactions, admins.
  - User + admin API surface; FAQ (no password recovery in V1, deleting a txn refunds account balance, data stored server-side in MySQL, multi-device sync via same account).
- Learner-relevant: Shows what the delivery stage actually produced (manual + declared architecture, no deployment/ops runbooks); a template for documenting an AI-built system.
