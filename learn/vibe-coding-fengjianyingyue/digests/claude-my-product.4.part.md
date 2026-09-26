---
source: claude-my-product
source_type: codebase
source_lines: 3653
language: vue
file_count: 33
part: 4
status: absorbed
absorbed_at: 2026-09-26
created: 2026-09-26
updated: 2026-09-26
---

## Overview (L1)

Part 4 of the "claude-my-product" source: the uni-app cross-platform build of the 财务管家
personal-finance app. It re-implements the original single-page web app (see earlier parts)
as a Vue SFC mobile app that compiles to iOS, Android, and WeChat mini-program (mp-weixin)
from one codebase. Nine pages — index, add, statistics, history, settings, category, account,
login, register — sit on a single `uni.request` API layer (`js/api.js`) that talks to the same
JSON backend (`http://119.45.94.26:88`) the web app uses. Auth is token-in-localStorage
(`uni.getStorageSync('token')`) sent as `Authorization: Bearer`. The visual system (sakura-pink
`#FFB7C5` theme, income mint `#7DD3C0`, expense coral `#FFA09B`) is carried over verbatim into
uni-app pages and global styles. This is the "port the app to a cross-platform mobile build"
stage of a vibe-coding workflow: an existing product is re-skinned/re-hosted rather than
designed from scratch. Tests are Node-based structural checks, not runtime UI tests.

## Sections (L2)

### app-shell
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/App.vue]]
- Purpose: app entry and lifecycle shell. `onLaunch` acts as a client-side auth guard: if no token, `uni.reLaunch` to `/pages/login/login`; stores `globalData.API_BASE`.
- Key exports: default component with `onLaunch/onShow/onHide` + `globalData {userInfo, API_BASE}`.
- Dependencies: `uni.getStorageSync`/`uni.reLaunch`; no imports.
- Learner-relevant: shows global styles and CSS theme variables live in App.vue `page`/`:root`; the route guard runs before any page renders — the standard uni-app auth pattern.
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/main.js]]
- Purpose: dual-runtime bootstrap. `#ifndef VUE3` mounts with `new Vue({...App})`; `#ifdef VUE3` exports `createSSRApp(App)`.
- Key exports: `createApp()` (Vue3 path); imports `./uni.promisify.adaptor` (legacy path).
- Dependencies: vue, ./App, ./uni.promisify.adaptor.
- Learner-relevant: conditional compilation (`#ifdef`) is the core uni-app cross-platform primitive — same file, different emitted code per platform/runtime.

### config-routing
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/pages.json]]
- Purpose: declares all 9 page routes, titles, nav-bar color, global style, and a 4-item `tabBar`.
- Key exports: `pages[]`, `globalStyle`, `tabBar.list`, `condition`.
- Dependencies: referenced by the uni-app compiler.
- Learner-relevant: tabBar = index/统计(statistics)/明细(history)/设置(settings); login+register use `navigationStyle: custom` (no native bar). `condition` seeds a dev launch to login.
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/manifest.json]]
- Purpose: per-target packaging config — `app-plus` (5+ app) with Android/iOS options, `mp-weixin` appid `wx93f37f323cbc9f16`, other mini-program stubs; `vueVersion: 3`.
- Learner-relevant: one manifest expresses the same app for native app + WeChat mini-program; Android permission list is auto-included.
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/index.html]]
- Purpose: H5 host template; viewport meta with `viewport-fit=cover` for notch devices; mounts `#app` and `/main.js`.
- Learner-relevant: distinguishes the H5 build from native/mini-program builds of the same source.

### api-layer
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/js/api.js]]
- Purpose: single API service object wrapping `uni.request` in a Promise; injects token header; unwraps `res.data.success` → resolves `res.data.data`, else rejects `message`.
- Key exports: `API` (default). Methods: `login`, `register`, `verify`, `getUserInfo`, `updateUserInfo`, `getAccounts/addAccount/updateAccount/deleteAccount`, `getCategories/addCategory/updateCategory/deleteCategory`, `getHomeData`, `getStatistics`, `getTransactions`, `addTransaction`, `deleteTransaction`, `getAccountTypes`, `getCategoryTypes`.
- Dependencies: global `uni.request`, `uni.getStorageSync('token')`.
- Learner-relevant: `baseURL: 'http://119.45.94.26:88'` matches App.vue's `API_BASE`; the identical endpoint set is what the web app calls, so the port is a client swap, not a backend change. `getTransactions(page,pageSize,type,month)` is the only paginated/query-param endpoint.

### page-auth (login / register)
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/pages/login/login.vue]]
- Purpose: username/password form → `API.login`; on success persists `token` + `userInfo` (userId/username/nickname) and `uni.reLaunch` to index.
- Key exports: default Vue page (data: username/password/errorMessage/loading).
- Dependencies: `js/api.js`; register link via `uni.navigateTo`.
- Learner-relevant: client-side error text uses `errorMessage` state; `:loading` drives the button label.
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/pages/register/register.vue]]
- Purpose: registration form with confirm-password check → `API.register`; success toast then `uni.navigateBack` to login.
- Learner-relevant: shows form validation pattern and the login↔register navigation loop expected in the port.

### page-index
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/pages/index/index.vue]]
- Purpose: home dashboard. `onShow` calls `API.getHomeData()`; renders month income/expense/balance overview, top expense categories, recent transactions; FAB navigates to add.
- Key exports: default page; transforms backend fields (`category_name/category_icon/transaction_date`) into view models.
- Dependencies: `js/api.js`; `uni.navigateTo`.
- Learner-relevant: field-name mapping (`*_name` → camelCase) recurs across pages; `onShow` (not onLoad) re-fetches so data refreshes after adding a record.

### page-add
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/pages/add/add.vue]]
- Purpose: "记一笔" entry form: expense/income tabs, amount, category grid, account chips, remark, quick-amount chips; `API.addTransaction({type, category_id, account_id, amount, remark})`; on success `uni.switchTab` to index.
- Key exports: default page; `watch.type()` reloads categories when switching income/expense.
- Dependencies: `js/api.js`; `getCategories(type)`, `getAccounts`, `addTransaction`.
- Learner-relevant: mirrors the web app's core booking flow; note `switchTab` (not `navigateTo`) because index is a tabBar page.

### page-history
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/pages/history/history.vue]]
- Purpose: transaction list with type filter chips (all/expense/income), month-grouped `scroll-view`, infinite scroll (`@scrolltolower` → `loadMore`), detail modal, delete via `API.deleteTransaction`.
- Key exports: default page (filterType, page, pageSize=20, hasMore, groupedData/monthOrder).
- Dependencies: `js/api.js` `getTransactions(page,pageSize,type,month)`.
- Learner-relevant: only page using pagination + grouping; shows `scroll-view`/`scrolltolower` which is the mini-program-compatible list pattern.

### page-statistics
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/pages/statistics/statistics.vue]]
- Purpose: annual stats page — year picker, income/expense/balance overview, expense pie chart, income-vs-expense trend line; `API.getStatistics(year)` then `uni.createCanvasContext` draws both.
- Key exports: default page (years, categoryStats, monthlyData, colors[]); `drawPieChart`, `drawTrendChart`.
- Dependencies: `js/api.js`; uni canvas API.
- Learner-relevant: replaces the web app's Chart.js with manual canvas drawing — the port's biggest implementation divergence; `setTimeout(...,300)` lets layout settle before drawing.

### page-category
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/pages/category/category.vue]]
- Purpose: CRUD management of categories: expense/income tabs, list, edit/delete, add/edit modal (icon, name, type) via `getCategories/addCategory/updateCategory/deleteCategory`.
- Learner-relevant: modal-based editor pattern reused by account page; `onShow` reloads so edits persist visibly.

### page-account
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/pages/account/account.vue]]
- Purpose: account CRUD + total balance card (sums `account.balance`); add/edit/delete modal via `getAccounts/addAccount/updateAccount/deleteAccount`.
- Learner-relevant: same modal CRUD skeleton as category; initial-balance field only shown when creating.

### page-settings
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/pages/settings/settings.vue]]
- Purpose: user card (from stored `userInfo` + `API.getUserInfo` for `created_at`), menu links to category/account, logout (clears token+userInfo → `reLaunch` login), version text.
- Dependencies: `js/api.js`; `uni.navigateTo`, `uni.showModal`, `uni.removeStorageSync`.
- Learner-relevant: logout completes the auth lifecycle started in App.vue/onLaunch; FAB present on tab pages.

### static-assets
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/static/]]
- Purpose: tabBar icons (`home`, `chart`, `history`, `settings`, each with `-active` variant) and `logo.png`.
- Learner-relevant: asset naming must match `tabBar.list` `iconPath`/`selectedIconPath` in pages.json.

### tests
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/tests/test-uniapp.js]]
- Purpose: Node script asserting project structure, pages.json/manifest.json config, page files, API method presence, page-feature keywords, and mp-weixin canvas compatibility; writes an HTML report to `tests/reports/`.
- Key exports: none (standalone runner); uses `test(name, passed, message)` and exits non-zero on failure.
- Learner-relevant: these are structural/static checks (string search), not behavioral UI tests — the port is validated by presence and config, not by running pages.
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/tests/platform/platform.config.js]]
- Purpose: declares cross-platform test cases (PLAT-001..005) for canvas pie/line, scroll-view load, storage, and request, plus per-platform config (`mp-weixin`).
- Learner-relevant: enumerates the exact APIs most at risk when porting web→cross-platform.

### web-app-mirror
- Purpose: synthesis note — the uni-app build is a 1:1 feature mirror of the earlier single-page `财务管家.html` web app: same pink design tokens, same data model (transactions/accounts/categories), same backend endpoints via an API abstraction rather than localStorage, and Chart.js replaced by native canvas.
- Learner-relevant: the porting moves are: localStorage → `uni` storage + REST API; single HTML page → routed SFC pages + tabBar; Chart.js → `uni.createCanvasContext`; browser DOM → `view/text/scroll-view/canvas/picker` primitives.
