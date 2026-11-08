---
source: sources/rubric/20261108/supplement/rubric-links
source_type: codebase
source_lines: 927
language: JSON
file_count: 7
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- **server（零依賴 HTTP 伺服器）** — 用 `node:http` 起一個只綁 `127.0.0.1` 的唯讀 server，提供 `/` 與 `GET /api/links` 兩個路由，直接讀本機 `data/links.json`，不寫任何檔案。刻意自己寫 `.env` 解析、零 npm 依賴，並以可選 `RUBRIC_TOKEN` header 當共享密鑰。
- **UI（單頁儀表板）** — 一個 `index.html`，黑底深色介面，抓 `/api/links` 後把 categories 渲染成卡片區塊，每個 link 一列（icon、title、url、description），另附空狀態與錯誤狀態。沒有框架、沒有 build step。
- **data model（links.json）** — 兩層結構：`categories[]` 內含 `links[]`，每個 link 有 `title`、`url`、`description`、`icon`（inline SVG 元素的字串）。agent 直接編輯這個檔案就是唯一設定方式。
- **integration（integrate.js）** — 冪等的 scaffold 修補器：偵測同層 `scaffold/`，備份後把「掃 manifest、spawn 子 server、反向代理、動態注入 tab/panel」三段 patch 插入 scaffold 的 `server.js` 與 `index.html`，用版本化 marker 註解避免重複套用。
- **manifest（manifest.json）** — 對外模板的自我描述：`name`、`label`、`port`、`apiPrefixes`、`panelSelector`、`stripSelectors`。scaffold 掃到它就會自動掛成原生 tab；`integrate.js` 只需被任一模板跑過一次，之後所有帶 manifest 的模板都自動出現。
- **agent 工作流（README 的 Intent Guide）** — agent 掃描工作區（CLAUDE.md、`.env`、config、package.json、docker-compose、文件）找出使用者常逛的 URL，分組成 category，經使用者確認後寫入 `data/links.json`；使用者永遠不用手改 JSON。

# L2 detail

- `#L1-L129` — `README.md` — 專案主文件。Intent Guide 定義 agent 的四步流程（掃描 → 建議 → 確認 → 寫 `links.json`）；另含 Install Prompt、Quick Start（`node server.js`，port 5050）、`links.json` schema 範例、SVG icon 規範（24×24、stroke、無 fill）、功能清單、API 表、環境變數、安全模型（loopback、無 CORS、唯讀、無外連）、版本與 CC BY 4.0 授權，以及與 Rubric Scaffold 整合的四步說明。
- `#L1-L79` — `server.js` — 零依賴伺服器。重點區段：Node 18+ 檢查（L6-L11）、手寫 `.env` 載入器（L13-L29）、`PORT`/`HOST`/MIME 設定（L31-L38）、請求處理與可選 token 驗證（L40-L67）、`EADDRINUSE` 錯誤處理（L69-L75）、`listen` 只綁 `127.0.0.1`（L77-L79）。學到的概念是「唯讀 API + 單一資料檔」的最小後端。
- `#L1-L96` — `index.html` — head 與全部 CSS：`<style>` 內的設計 token（純黑背景、`#50e3c2` accent、Outfit 字型）、RUBRIC brand block、`.placeholder-section` 卡片、`.link-item` hover 動畫、`.empty-state`。展示單檔前端如何用 CSS 變數建立一致視覺。
- `#L97-L120` — `index.html` — body 結構：brand block（logo SVG、tagline、RoboLabs / RoboNuggets 署名）、`h2` Links 標題與說明、空容器 `#links-container`。是 scaffold 注入時 `panelSelector` 會抓取的區塊。
- `#L122-L170` — `index.html` — 前端 JS：包裝 `window.fetch` 在 `/api/` 請求自動加上 `x-rubric-token`（L122-L136）、`loadLinks()` 抓 `/api/links` 並渲染 categories/links、空狀態與錯誤處理（L138-L165）、`esc()` HTML 跳脫（L167）、啟動呼叫（L169）。重點是資料驅動渲染加上 XSS 防護。
- `#L1-L94` — `data/links.json` — 範例資料，示範完整資料模型：四個 category（Dashboards、Documentation、Platforms、Resources），共 11 個 link，每個都有 `title`/`url`/`description`/`icon`。`icon` 是可直接插入 `<svg viewBox="0 0 24 24">` 的 stroke 元素字串，是「資料即 UI 資產」的範例。
- `#L1-L431` — `integrate.js` — 冪等 scaffold 修補器。重點區段：參數解析與 `scaffold/` 定位（L21-L34）、`PATCH_VERSION` 版本策略（L36-L42）、`SERVER_TOP_PATCH`（manifest 掃描、spawn 子 server、`__extProxy`）字串（L44-L114）、`SERVER_PROXY_PATCH`（API/asset 反向代理與 `/api/external`）字串（L119-L147）、`INDEX_FN_PATCH`（`loadExternalTemplates` 與 `scopeCss`）字串（L152-L311）、舊版 patch 移除邏輯（L313-L346）、`patchFile` 錨點插入與備份（L348-L398）、實際套用清單（L400-L429）。核心概念是「用 marker 註解做可重複、可升級的原始碼 patch」。
- `#L1-L14` — `package.json` — 套件 metadata：`type: module`、`start: node server.js`、`engines.node >= 18`、無 dependencies。示範用 ES modules 寫零依賴 Node 服務的最小 package 定義。
- `#L1-L8` — `manifest.json` — 模板契約：`name: links`、`label`、`port: 5058`、`apiPrefixes: ["/api/links"]`、`panelSelector: ".placeholder-tab"`、`stripSelectors: [".gen-rubric-brand"]`（注入 scaffold 時移除 standalone 模式的品牌區塊）。這是「模板宣告自己是什麼」的單一入口。
