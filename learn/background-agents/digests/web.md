---
source: sources/background-agents/20261027/web
source_type: codebase
source_lines: 1741
language: TypeScript (React) + CSS
file_count: 4
status: skipped
skip_reason: "not taught by any current node"
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- Operator 應用外殼（`index.html`、`src/main.tsx`、`src/App.tsx`）— Vite + React 單頁 app，掛載到 `#root`；沒有 react-router，改用 `window.history.pushState` 加 `popstate` 做三頁切換，每 1.5 秒輪詢 `/api/dashboard`。它把背景 agent 的內部狀態整理成 operator 可讀的三個工作區。
- Inbox：核准與求助（`src/App.tsx`）— 只列出 `status` 為 `pending`、且所屬 run 尚未 terminal 的 approvals；`request_help` 顯示 agent 的問題並要求必填回答，其餘動作顯示 `PROPOSED TOOL INPUT`，可 approve 或 deny 並附決策備註。
- Activity：等待狀態與事故台（`src/App.tsx`）— 左側是 run 清單（狀態點、goal、iteration、eventSequence），右側把 timeline 依 phase（start、observe、loop、predict、act、pause、resume、human、terminal、policy、event）畫成帶 icon 的活動流，顯示 `waitReason`、cancel run 與最終 report。
- Events：事件不是狀態（`src/App.tsx`）— 顯示 checkout 送來的 service events 與當前 state snapshot，並在頁面文案明講「agent 用 HTTP 讀現況，不信任 event payload」。
- 視覺系統（`src/styles.css`）— 深色 ops console：70px icon sidebar、topbar、Inbox 與 Activity 雙欄、Events 單欄；每個 phase 有專屬顏色變數，並在 900px 與 650px 兩個斷點收成單欄。

# L2 detail

- `#L1-L13` — web/index.html — Vite 進入點：`<div id="root">` 與 `<script type="module" src="/src/main.tsx">`，title 為 `Checkout Ops · Background Agents`，`theme-color: #09090b` 先定調深色營運介面。
- `#L14-L23` — web/src/main.tsx — React 掛載：`createRoot(document.getElementById('root')!)` 以 `React.StrictMode` 包住 `<App />` 並載入 `styles.css`；沒有其他 provider 或 router，說明這個 dashboard 刻意保持小。
- `#L24-L736` — web/src/App.tsx — 全部 UI 與資料流。型別 `ServiceEvent`、`Run`、`Approval`、`ActivityEntry`、`ServiceSnapshot`、`Dashboard` 描述 operator 需要的切片；`request<T>` 統一處理 fetch 與 operator API 錯誤（包含「先啟動 npm run dev:operator」提示）；`Link` 自製 SPA 導航，`NAV` 定義 Inbox / Activity / Events，`terminal()` 判定 completed、cancelled、failed、escalated、superseded。`ActivityFeed` 用 `PHASE_ICONS` 與 `activityDetail` 把每個 phase 翻成一句人話，`EventFeed` 用 `<details>` 展開 payload。`App` 每 1.5 秒 refresh：Inbox 過濾 pending 與 resolved 並送出 `/api/approvals/decide`，Activity 顯示 run 詳情、`Cancel run`、`run.report` 與持久化 activity，Events 顯示 service snapshot 與事件列表。學習重點：operator 只讀 dashboard API、只寫核准與取消，不直接碰資料庫。
- `#L737-L1741` — web/src/styles.css — 設計系統與版面：`:root` 深色主題與字型堆疊、`.app-shell` flex 外殼、`.sidebar`、`.topbar`、`.page-content`；Inbox 的 `.inbox-layout`、`.mailbox`、`.reading-pane`、`.reply-composer`；Activity 的 `.activity-layout`、`.run-list-item`、`.activity-entry.phase-*`（phase 顏色變數）與 timeline rail；Events 的 `.event-entry`；最後以 `@media` 在 900px 與 650px 把雙欄收成單欄。學習重點：pending、waiting、terminal 這些狀態在視覺上必須一眼可辨。
