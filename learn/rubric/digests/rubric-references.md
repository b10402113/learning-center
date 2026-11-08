---
source: sources/rubric/20261108/supplement/rubric-references
source_type: codebase
source_lines: 1148
language: JavaScript
file_count: 7
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- **extension/** — Manifest V3 擴充功能，只申請 `activeTab` 與 `scripting`，主機權限限定本機 bridge（`127.0.0.1:5298`、`localhost:5298`）。popup.html／popup.js 是唯一介面，config.js 集中設定 bridge 位址與選用 token，字型與 icon 全部本地打包。
- **一鍵擷取流程** — 開啟 popup 就等於存檔：先 `chrome.tabs.captureVisibleTab` 抓可見範圍的 JPEG 截圖，再注入 `grabMeta` 取得標題、description、og 資訊、favicon、前 1,600 字與視窗尺寸，然後 `POST /api/capture`。之後標題／描述／標籤／註記的每次異動都以 250ms debounce 直接 `PATCH` 回寫。
- **server.js／磚牆** — 零依賴的本機 HTTP bridge，把截圖寫進 `data/shots/<id>.jpg|png`、紀錄寫進 `data/references.json`，每次異動都呼叫 `build()` 重繪 `data/index.html`。若設了 `AGENT_CMD`，存檔後在背景跑一次 agent，把一句白話描述與 1–3 個標籤補回紀錄（失敗則保留原頁描述並標記 `aiFailed`）。
- **build.js** — 把 references.json 內嵌成單一靜態 `index.html`：CSS columns 瀑布流卡片牆、搜尋與標籤篩選、明暗主題、點陣波浪背景。同一份檔案由 bridge 提供時是 live（可刪除、每 3 秒同步 `describing` 狀態），直接從磁碟開啟或靜態託管時則自動變唯讀。
- **設定與安全模型** — `env.local` 提供 `PORT`、`AGENT_CMD`、`AGENT_TIMEOUT_SECONDS`、`RUBRIC_TOKEN`；bridge 只綁 `127.0.0.1`、不送 CORS 標頭、驗證 Host 防 DNS rebinding、POST／PATCH 必須是 JSON、請求上限 12MB（存檔）與 1MB（其他）、只服務牆頁與 `shots/<id>.jpg|png`，且所有站台提供的文字輸出前都轉義。

# L2 detail

- `#L1-L143` — `README.md` — 專案總覽與操作手冊：一鍵存檔、磚牆用法、agent 一句話描述與標籤（固定 12 個標籤清單）、把 `data` 當 agent 參考庫、env 設定表、安全模型與 API 路由表；記錄每筆資料的欄位 `id, url, domain, title, description, rawDescription, tags, note, shot, favicon, w, h, created, updated, status`。
- `#L1-L364` — `server.js` — 本機 bridge 主體：`loadEnvFile` 讀 `env.local`、`load`／`persist` 原子寫入並觸發重建、`runAgent` 以 stdin 傳 prompt 並可 timeout、`describePrompt`／`parseBlurb` 產生與解析 JSON 描述、`originOk`／`tokenOk` 管制來源與權杖、`/api/capture`、`/api/refs` CRUD、`/shots` 靜態服務與 Host 白名單。
- `#L1-L352` — `build.js` — 匯出 `build`、`TAGS`、`DATA_DIR`；`template()` 產生完整 HTML，內含瀑布流 CSS、卡片渲染、晶片篩選、`sync()` live 模式與 `halftone` 空狀態點陣圖，資料以 `<script id="data" type="application/json">` 內嵌並轉義 `<`。
- `#L1-L10` — `extension/manifest.json` — MV3 宣告：`activeTab` + `scripting` 權限、`action.default_popup` 指向 popup.html、兩個 host_permissions 指向本機 bridge；版本 1.1.0。
- `#L1-L171` — `extension/popup.js` — popup 邏輯：`grabMeta`（在頁面內執行，取 og:title／description／site_name、favicon、innerText 前 1,600 字）、`api()` 封裝 fetch 與 token、`fill`／`save`（250ms debounce PATCH）、`poll`（每 1.5 秒追 `describing` 狀態）、`main()` 截圖→取 meta→POST 擷取→綁定輸入事件、`wallBtn` 先以 800ms timeout 探測 `/api/health` 再開牆。
- `#L1-L99` — `extension/popup.html` — popup 介面與樣式：本地 `@font-face`（Outfit、Doto）、360px 寬卡片、截圖預覽與 `dupe` 提示、標題／描述／標籤／註記欄位、thinking 動畫、agent 關閉與 AI 失敗提示、錯誤面板；最後載入 config.js 與 popup.js。
- `#L1-L9` — `extension/config.js` — 擴充功能設定物件 `RUBRIC_CONFIG`：`bridge` 預設 `http://127.0.0.1:5298`、`token` 留空；改 `PORT` 時須同步此處與 manifest 的 host_permissions。
