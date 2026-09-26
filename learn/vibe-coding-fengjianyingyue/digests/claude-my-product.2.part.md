---
source: claude-my-product
source_type: codebase
source_lines: 7108
language: javascript
file_count: 31
part: 2
status: absorbed
absorbed_at: 2026-09-26
created: 2026-09-26
updated: 2026-09-26
---

# claude-my-product — Part 2 (full-stack code + database)

## Overview (L1)

This cluster is the "turn prototypes into working full-stack code" stage of the vibe-coding workflow for **财务管家 (Finance Steward)**. It holds three cooperating modules.

- **Frontend** (`frontend/`) — a framework-free multi-page app: nine self-contained HTML pages (auth, dashboard, record, statistics, history, settings, account, category) plus `index.html` entry. Each page carries its own inline `<script>` and loads Tailwind CDN, Chart.js 4.4.1, Plus Jakarta Sans and Material Symbols from CDNs. A small shared layer under `js/` (core utilities in `app.js`, two nav components) and design tokens under `styles/`.
- **Backend** (`backend/`) — a single-file Node/Express + MySQL REST API (`server.js`, 971 lines) using `mysql2/promise`, `bcryptjs` for password hashing, `jsonwebtoken` for auth, `cors` and `dotenv`. Serves `/api/*` endpoints that every page calls with a Bearer token.
- **Database** (`004.…/finance_manager.sql`) — the MySQL 8 schema the backend queries: 8 tables, 2 views, 2 stored procedures, 1 balance trigger, and seed data for account/category types plus a demo user.

The frontend no longer uses the localStorage-only design in `app.js`; pages now persist through the REST API and keep only the JWT + display fields in `localStorage`.

## Sections (L2)

### fe-architecture
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/README.md]]
- Purpose: Documents the multi-page static frontend and its page-jump map (login/register → dashboard; dashboard + → add_record; settings → logout).
- Key claims: No build step, no framework; Tailwind + Material Symbols + Plus Jakarta Sans; `index.html` is a function navigation page. `package.json` is a test-only manifest (`vitest`, `@playwright/test`, `allure`).
- Dependencies: Tailwind CDN, Chart.js CDN, Google Fonts.
- Learner-relevant: The prototype's six Stitch screens became nine real pages; every page hard-codes `const API_BASE = 'http://localhost:3001/api'`, stores `token` in localStorage, and navigates with `window.location.href`.

### fe-app-core
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/js/app.js]]
- Purpose: Shared core utilities, exposed as `window.App`.
- Key exports: `Router` (`pages` map, `navigate`, `getCurrentPage`), `Storage` (per-user keys `finance_data_<user>_<key>`, `isLoggedIn`, session clear), `Auth` (weak bit-hash, `register`/`login`/`logout`/`checkAuth`), `Model` (`defaultAccounts` cash/wechat/alipay, `loadData`/`saveData`), `Utils` (`formatMoney`, `formatDate`, `generateId`, `showToast`, `getCurrentMonthRange`, `calculateSummary`, `aggregateByCategory`), plus `navigateTo`.
- Learner-relevant: This is the earlier localStorage-only architecture; real pages bypass it and call the API, so `app.js` is largely legacy. Its `Auth.hash` is explicitly not production-grade.

### fe-components
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/js/components/bottom-nav.js]]
- Purpose: Shared bottom navigation widgets.
- Key exports: `BottomNav` (5 items: 首页/统计/center add /明细/设置, renders Tailwind nav with gradient FAB) and `Navigation` (pages list, `init`/`render`/`navigate`/`highlightCurrentPage`).
- Learner-relevant: Nav is implemented twice (`bottom-nav.js` + `navigation.js`) and also inlined in each page's HTML — an example of duplication an agent can consolidate.

### fe-design-system
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/styles/design-tokens.js]]
- Purpose: JS design tokens + global CSS + the prototype style contract.
- Key exports: `design-tokens.js` (colors `primary-dark #FF8FA3`, `primary-light #FFB7C5`, income `#7DD3C0`, expense `#FFA09B`, accent `#C9B8E8`; typography/spacing/radius/shadow scales; `categoryIcons` and `accountTypes` maps). `main.css` (Tailwind `@layer components/utilities`, toast styles, `.dark`), `DESIGN.md` (YAML token frontmatter + "Gentle Financial Steward" brand prose).
- Dependencies: Tailwind tokens mirror `DESIGN.md`.
- Learner-relevant: Tokens are the machine-readable bridge between the prototype and generated UI.

### fe-auth-pages
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/pages/login.html]]
- Purpose: Login and register UI (also `register.html`).
- Key exports: `checkLogin` (redirect to dashboard if token exists), `validate`, `handleLogin` → `POST /api/login`; register page `handleRegister` → `POST /api/register`. On success store `token/userId/username/nickname/theme` and redirect.
- Learner-relevant: First real API calls; token header `Authorization: Bearer <token>` used everywhere after.

### fe-dashboard
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/pages/dashboard.html]]
- Purpose: Home overview page.
- Key exports: `checkLogin`, `loadHomeData` → `GET /api/home` (Bearer); fills income/expense/balance cards, renders top-3 expense categories and 3 recent transactions from JSON, formats amounts; FAB links to `add_record.html`.
- Learner-relevant: Shows server-driven rendering: static placeholders are overwritten by DOM `innerHTML` from API data.

### fe-add-record
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/pages/add_record.html]]
- Purpose: Create-transaction form (the core action).
- Key exports: `switchType(expense|income)`, `loadCategories` → `GET /api/categories?type=…`, `loadAccounts` → `GET /api/accounts`, `renderCategories`/`renderAccounts`/`selectCategory`/`selectAccount`, `saveTransaction` → `POST /api/transactions`.
- Learner-relevant: Cleanest page to trace form → API body mapping (`type, category_id, account_id, amount, remark, date`).

### fe-statistics
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/pages/statistics.html]]
- Purpose: Yearly analytics with charts.
- Key exports: `loadStatistics` → `GET /api/statistics?year=`, `updateExpenseChart` (Chart.js doughnut), `updateTrendChart` (line), `exportData` → `GET /api/export?year=` then client-side CSV/Excel via `xlsx` data.
- Dependencies: Chart.js 4.4.1 CDN.
- Learner-relevant: Frontend consumes pre-aggregated API data; charts are built from `categoryStats` and 12-month `monthlyData`.

### fe-transaction-history
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/pages/transaction_history.html]]
- Purpose: Paginated transaction list with filters.
- Key exports: `filterByType`, `loadTransactions` → `GET /api/transactions?page&pageSize&type`, `renderTransactions`, `loadMoreTransactions`, `setupInfiniteScroll`.
- Learner-relevant: Server pagination shape `{transactions, pagination:{page,pageSize,total,totalPages,hasMore}}`.

### fe-settings
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/pages/settings.html]]
- Purpose: User profile, avatar, theme, entry points to account/category management.
- Key exports: `loadUserInfo` → `GET /api/user`, `handleLogout` (clears `token/userId/username/nickname/theme`, → login); avatar file read as data URL into `localStorage.user_avatar`.
- Learner-relevant: Shows read-side of the user resource and local session teardown.

### fe-account-management
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/pages/account.html]]
- Purpose: CRUD UI for accounts.
- Key exports: `loadAccounts` → `GET /api/accounts`, `saveAccount` → `POST /api/accounts` or `PUT /api/accounts/:id`, `deleteAccount` → `DELETE /api/accounts/:id`; emoji picker + modal (`showAddModal`/`editAccount`/`closeModal`).
- Learner-relevant: Canonical REST CRUD pattern reused by the category page; uses `PUT`/`DELETE` methods.

### fe-category-management
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/pages/category.html]]
- Purpose: CRUD UI for expense/income categories with tabs.
- Key exports: `loadCategories` → `GET /api/categories?type=expense|income`, `switchTab`, `saveCategory` → `POST/PUT /api/categories(/:id)`, `deleteCategory` → `DELETE`; emoji picker; system categories (`is_system`) cannot be deleted.
- Learner-relevant: Demonstrates user-vs-system category distinction surfaced from the DB.

### be-server
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/backend/server.js]]
- Purpose: The whole REST API in one Express file (972 lines).
- Routes: `GET /`; auth `POST /api/register`, `POST /api/login`, `GET /api/verify`; user `GET|PUT /api/user`; accounts `GET|POST /api/accounts`, `PUT|DELETE /api/accounts/:id`; categories `GET|POST /api/categories`, `PUT|DELETE /api/categories/:id`; transactions `POST /api/transactions`, `GET /api/transactions` (paged/filtered), `DELETE /api/transactions/:id`; stats `GET /api/home`, `GET /api/statistics`, `GET /api/export`; lookups `GET /api/account-types`, `GET /api/category-types`.
- Key exports: `app` (module.exports); helpers `testConnection`, `getUserIdFromToken`.
- Dependencies: express, mysql2/promise, cors, bcryptjs, jsonwebtoken, dotenv (`backend/package.json`); `.env` sets PORT 3001 + DB creds + JWT_SECRET.
- Learner-relevant: Standard response envelope `{success, message, data}`. Registration atomically seeds a default ledger and cash/wechat/alipay accounts. Security note: most SQL uses `pool.execute` placeholders, but `GET /api/transactions` interpolates `userId/type/month` directly into the WHERE string — a genuine injection risk the test suite checks.

### be-data-layer
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/backend/server.js]]
- Purpose: DB access pattern.
- Key claims: `mysql.createPool` (10 connections, localhost:3306, db `finance_manager`); `getUserIdFromToken` verifies the Bearer JWT (`7d` expiry) and returns `decoded.userId`; every protected route derives user scope from that id. Aggregation queries join `transactions → category_types` and group by `transactions → categories`, matching the SQL views.
- Learner-relevant: Shows the minimal data layer an agent writes when it skips ORMs.

### be-tests
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/backend/tests/test-core-business.js]]
- Purpose: Automated verification at three levels.
- Key exports: `test-core-business.js` — a 21-step supertest E2E flow (register→login→verify→user→account CRUD→category→transaction→home/statistics→delete, plus security cases) writing an HTML report. `tests/api/auth.test.js`, `tests/api/accounts.test.js` (Jest-style API tests), `tests/security/security.test.js` (401 / SQL-injection / invalid token), `tests/unit/utils.test.js` (imports a non-existent `./utils`, so it cannot run) and `tests/test-runner.js`.
- Dependencies: `supertest`; `package-test.json` declares `jest` + `allure`.
- Learner-relevant: Shows AI-generated projects often ship a test suite that is aspirational — some tests never run.

### db-schema
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/004.数据库脚本（数据库管理员DBA）/finance_manager.sql]]
- Purpose: MySQL 8 schema for `finance_manager`.
- Key claims: 8 tables. `users` (username UNIQUE, password, nickname, avatar_url, theme); `ledgers` (user_id → users CASCADE, is_default); `account_types` (name/icon/color); `accounts` (ledger_id+user_id+type_id, initial_balance/current_balance DECIMAL(15,2), sort_order); `category_types` (expense/income); `categories` (user_id NULL = system, type_id, is_system, sort_order); `transactions` (ledger_id, user_id, account_id, category_id, type_id, amount DECIMAL(15,2), remark, transaction_date DATE) with indexes on every FK + date; `budgets` (category_id NULL = total, period monthly/weekly/yearly, start/end date).
- Learner-relevant: The relational backbone; `type_id` is denormalized onto both `categories` and `transactions`, and FKs cascade user/ledger deletes.

### db-views-procs
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/004.数据库脚本（数据库管理员DBA）/finance_manager.sql]]
- Purpose: Server-side reporting and balance automation.
- Key exports: views `v_monthly_summary` (monthly income/expense totals + counts per ledger/user) and `v_category_summary` (monthly expense per category); procedures `sp_get_account_balance`, `sp_update_account_balance` (recompute `current_balance = initial_balance + income − expense`); trigger `tr_after_transaction` (calls the update proc after each insert).
- Learner-relevant: The backend's `/api/home` and `/api/statistics` reimplement these aggregations in JS instead of using the views; the trigger keeps balances in sync at the DB layer.

### db-seed
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/004.数据库脚本（数据库管理员DBA）/finance_manager.sql]]
- Purpose: Default reference data + demo rows.
- Key claims: 5 account types (现金/银行卡/微信支付/支付宝/银行账户); 2 category types (`expense`, `income`); 10 system expense categories (餐饮/交通/购物/娱乐/住房/医疗/通讯/服饰/人情/其他) and 5 income (工资/兼职/奖金/礼金/其他), all `user_id = NULL`, `is_system = 1`; demo user `test`, one default ledger, three accounts, and five transactions (dates 2026-03/04).
- Learner-relevant: These seeded `id`s (type_id 1 = expense, 2 = income) are what the JS queries compare against (`ct.name = 'expense'`), tying the schema to the API logic.
