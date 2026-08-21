# Deploy Knowledge Nebula to GitHub Pages

## Problem Statement

Knowledge Nebula（知識星雲）是一個純靜態的 React SPA，用來視覺化個人學習課程。目前它只存在於 `enhance-karpathy-note` repo 的 `knowledge-map/` 子目錄中，沒有任何部署機制。使用者無法透過 URL 分享或存取這個網站。

目標是把 knowledge-map 拆成獨立 repo，部署到 GitHub Pages，讓任何人都能透過 `https://b10402113.github.io/knowledge-map/` 存取。

## Solution

1. 建立新的 GitHub repo `b10402113/knowledge-map`（public）
2. 把 `knowledge-map/` 的內容遷移進去（排除 `node_modules/`、`dist/`、parent repo 的引用）
3. 修改 `vite.config.ts`：加 `base: "/knowledge-map/"`，清掉所有 parent repo 引用（`repoRoot`、`@learn` alias、`server.fs.allow`），保留 `react/jsx-runtime` alias
4. 設定 GitHub Actions workflow：push to main 時自動 build & deploy
5. `graph.json` 預先產生，直接 commit 進 `src/data/`（CI 不跑 generate，只跑 vite build）
6. `dist/` 保持 gitignored，由 CI build 產出

部署後網址：`https://b10402113.github.io/knowledge-map/`

## User Stories

1. 作為一個學習者，我想要透過公開網址存取知識星雲，這樣我可以隨時在任何裝置上查看我的課程地圖
2. 作為一個學習者，我想要把網址分享給朋友，讓他們看到我的學習進度和課程結構
3. 作為一個學習者，我想要在更新課程後，網站能自動反映最新的內容，這樣我不用手動重新部署
4. 作為一個學習者，我想要網站在 push to main 後自動部署，這樣我只需 git push 就能更新網站
5. 作為一個學習者，我希望部署過程中不需要 commit dist/ 到 repo，讓 repo 保持乾淨
6. 作為一個訪客，我想要透過 deep link 直接跳到特定的 node 或 step 頁面，不需要從首頁開始找
7. 作為一個訪客，我想要在手機上至少能閱讀課程內容，即使地圖視圖不完全適合小螢幕
8. 作為一個訪客，我想要看到完整的星雲和路線圖兩個視圖，並能在之間切換
9. 作為一個訪客，我想要使用 ⌘K 搜尋功能快速找到特定的課程或概念
10. 作為一個學習者，我希望 graph.json 是預先產生的，CI build 時不需要讀外部的 learn/ 目錄
11. 作為一個學習者，我希望能保留 hash-based 路由，這樣深層連結能正常運作
12. 作為一個學習者，我希望進度資料仍然存在 localStorage 中，不受部署方式影響

## Implementation Decisions

### Repo 遷移

- 建立新 GitHub repo `b10402113/knowledge-map`，visibility 設為 public
- 從 `enhance-karpathy-note/knowledge-map/` 複製所有檔案到新 repo
- 排除：`node_modules/`、`dist/`、`.DS_Store`
- 保留：`src/`、`scripts/`（如果需要本地 generate）、`package.json`、`package-lock.json`、`tsconfig.json`、`vite.config.ts`、`vitest.config.ts`、`CONTEXT.md`、`PRD.md`、`design-system/`、`src/data/graph.json`（預先產生）

### Vite 設定變更

- 加入 `base: "/knowledge-map/"`，讓所有資產使用相對於 repo 名稱的路徑
- 移除 `repoRoot`（不再需要指向 parent repo）
- 移除 `@learn` alias（graph.json 已預先產生，build 時不讀 `../learn/`）
- 移除 `server.fs.allow: [repoRoot]`（不再需要允許 parent 目錄存取）
- 保留 `react/jsx-runtime` alias（Vite bare import resolution 需要）

### graph.json 策略

- 在本地執行 `npm run generate` 產生 `src/data/graph.json`
- 將 graph.json commit 進 repo
- CI 流程不執行 generate，只執行 `vite build`
- 每次課程更新後，本地重新跑 generate 並 commit 新的 graph.json

### GitHub Actions 部署

- 使用 GitHub Actions workflow 觸發 deploy
- 觸發條件：push to main branch
- 流程：checkout → setup node → npm ci → npm run build → 上傳 dist/ 為 artifact → 使用 `actions/deploy-pages` 部署
- 不使用 gh-pages branch，直接用 Pages 的 artifact 部署方式

## Testing Decisions

- 現有 vitest 測試（`src/__tests__/`）覆蓋 hash routing、progress、completion、MDX rendering
- 部署後的 smoke test：確認首頁載入、星雲/路線圖切換、deep link 到特定 node
- `vite build` 在 CI 中會驗證 TypeScript 和 build 產出
- 不需要額外的部署測試——GitHub Actions 的 deploy-pages 是標準流程

## Out of Scope

- 不改動任何應用程式邏輯或 UI
- 不重新設計 mobile layout（保持現有的 desktop-oriented design with graceful fallback）
- 不加入 PWA 支援（offline、service worker）
- 不加入 CNAME 或自訂域名
- 不在 CI 中執行 `npm run generate`（graph.json 預先產生 commit 進 repo）
- 不改動 `graph.json` 的資料結構或產生流程
- 不加入自動化內容審查或 redaction pipeline

## Further Notes

- 此部署方案是針對 GitHub Pages 的免費個人部署。如果未來需要自訂域名、SSL、或其他功能，可以遷移到 Cloudflare Pages 或 Vercel
- knowledge-map 未來可能從 enhance-karpathy-note 完全分離，不再引用 parent repo 的任何資源
- graph.json 的產生流程（`scripts/generate-data.mjs`）可以考慮在未來版本中搬到 knowledge-map repo 內部，實現完全自治
