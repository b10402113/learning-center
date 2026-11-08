---
source: sources/rubric/20261108/supplement/rubric-recos
source_type: codebase
source_lines: 2064
language: JavaScript
file_count: 13
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- **Server（`server.mjs`）**：Node 內建模組寫成的單檔 HTTP 服務，只綁 `127.0.0.1`。頂部 `CONFIG` 集中管理 port、資料夾、Agentic OS 位址與選用 token；下方路由負責首頁、`/recos.js`、`/features/`、`/assets/` 與 `/api/skip|done|comments|state`。寫入一律要求 JSON、上限 1 MB、以原子寫入更新 `state.json`。
- **檢查（`check.mjs`）**：先用 `vm` 沙箱執行 `recos.js`，驗證 `window.RECOS` 的 ARMS 結構、id 規則、`pri`/`effort`/`saves` 等級與 `savesNote` 依賴；再在備用 port 與暫存資料夾啟動一次伺服器，實測 skip/done/comments、路徑穿越、非 JSON 寫入與 Host 檢查。`--data` 只檢查資料檔，是 `/recos` 寫檔後的自檢關卡。
- **Skill（`skills/recos/`）**：`SKILL.md` 定義每次執行的五條鐵則（只看不動、先用手上記憶、每個建議都要有證據、保留 id、不夾帶機密）與七步流程；`references/audit.md` 把稽核拆成 ARMS 四大面向加「重複工作流」，並列出弱建議的排除條件。
- **UI（`index.html`）**：CSS 變數同時管 dark/light 主題與 A/R/M/S 四色；頁面本體只有 header、ARMS 側欄、Priority 區、篩選列與分組容器。行內腳本把 `window.RECOS` 渲染成卡片或列表，處理 Priority 排序、Area/Effort/Priority/Token Savings 篩選、Skip/Done 與快捷鍵。
- **Features（`features/`）**：四支零依賴 IIFE 各自封裝一種互動。`agent-cart.js` 是可排序、可加註記的購物車並輸出固定格式訊息；`highlight-comment.js` 用 CSS Custom Highlight API 做選取留言；`apply-comments.js` 是模型×努力度選擇器，透過 Agentic OS 套用留言；`home-link.js` 只負責回首頁按鈕。
- **資料與狀態（`data/`）**：`recos.js` 是 `/recos` 唯一會寫的檔案，檔頭註解即完整 schema，`items[]` 每筆帶 `letter`、`pri`、`rank`、`effort`、`saves`/`savesNote`、`touches`、`benefit`、`action`、`source`、`svg`。`state.json` 只由 App 寫入，保存 `skipped`、`done`、`comments`，因此重寫 `recos.js` 也不會弄丟使用者的選擇。

# L2 detail

- `#L19-L136` — `server.mjs` — `CONFIG`（port/host/dataDir/agenticOs/token）、`mark()` 與 `readState`/`saveState` 的選擇狀態模型、`inside()` 路徑防護、`okHost()` 反 DNS rebinding，以及 `/api/skip`、`/api/done`、`/api/comments` 路由。重點概念：狀態與內容分離，App 只寫 `state.json`。
- `#L20-L94` — `check.mjs` — `checkRecos()` 在 `vm` 沙箱讀 `window.RECOS`，逐項檢查 id 格式與唯一性、`letter` 只能是 A/R/M/S、`pri`/`effort` 等級、high 必帶 `rank`、`saves` 必帶 `savesNote`、`touches` 至多 3 個、以及禁用 em dash。之後啟動暫存伺服器測所有路由（含 413/415/403 與無 CORS 標頭）。
- `#L10-L69` — `skills/recos/SKILL.md` — `/recos` 的操作合約：五條規則、七步進度清單、每筆建議的欄位寫法（title 動詞開頭、benefit 先講獲得再給證據、action 用第一人稱）、以及每週自動更新的提議方式。核心概念：稽核唯讀，只寫 `data/recos.js`。
- `#L1-L76` — `skills/recos/references/audit.md` — ARMS 稽核細則：Memory（重複糾正、常駐檔過長、重複事實）、Skills（重疊、超過 500 行、描述觸發不到、無人使用）、Apps（未使用連接器、常崩、重複工具）、Routines（連續失敗、模型過大、輸出無人看），以及「重複工作流」與弱建議黑名單。每個發現都要求「看到什麼／改變什麼／使用者得到什麼」。
- `#L1-L48` — `data/recos.js` — 檔頭是完整的資料契約與範例；`window.RECOS = { built, footer, letters, items }` 出貨時為空殼。關鍵概念：id 一旦發布就不再變動，skip/done 才能跨刷新存活；`saves` 只標在「完成後每次執行都省 token」的建議上。
- `#L1-L5` — `data/state.json` — 初始形狀 `{ skipped: {}, done: {}, comments: [] }`。`skipped`/`done` 是以 id 為鍵的時間戳物件，`comments` 是留言陣列；此檔只由伺服器寫入。
- `#L13-L33` — `features/home-link.js` — `window.RoboHome.init({ mount, href, title })`：把「← Home」注入指定容器，沒有 mount 就固定在右上角。重點概念：小功能單檔、無依賴、可從 `file://` 與 http 運作。
- `#L155-L196` — `features/agent-cart.js` — `text()` 產生固定 paste-back 格式（header、intro、編號項目、From、各欄位、My note），`copy()`/`download()` 輸出，公開 API 為 `add/remove/toggle/has/items/clear/open/close/text/copy/refresh`。購物車以 localStorage 保存，並用 `enrich` 在複製當下補上即時欄位。
- `#L154-L302` — `features/apply-comments.js` — 「Apply all comments」流程：`openComments()` 收集未套用留言、`start()` 以 `text/plain` POST 到 `cfg.api + '/api/apply-comments'` 避開 CORS preflight、`watch()` 輪詢 `/api/run-status`、`finish()` 標記留言為 applied 後重整。Agentic OS 沒開時 `copyForAgent()` 退化成複製留言，這是整個功能的依賴邊界。
- `#L84-L198` — `features/highlight-comment.js` — 用 `findRange()` 以 `quote` + `nth` 重建文字範圍，`paint()` 透過 `CSS.highlights` 上色（不改寫 DOM），`renderPanel()` 分開未套用與已套用留言，`exportText()` 產生匯出文字。核心概念：留言以「引文＋第幾次出現」定位，重載後仍能找回原位。
- `#L287-L613` — `index.html` — 行內腳本：`cardHtml()` 組卡片（benefit/action、Effort/Priority/Token Savings 三顆 pill、`touches` 氣泡、Add to cart/Done/Skip）、`renderRail()` 建 ARMS 導覽、`apply()` 做五種篩選、`render()` 依 `state.skipped` 過濾後分組、`skip()`/`done()` 呼叫 API 並提供 7 秒 Undo。啟動時載入 `state.json`、初始化購物車與留言，並在 `agenticOs` 有值時才啟用 Apply。
- `#L1-L150` — `README.md` — 安裝與啟動（Node 18+、`node server.mjs`、預設 50013）、Agentic OS 為選用、`recos.js` 形狀、安全模型（僅本機、無 CORS、Host 檢查、JSON 寫入、1 MB 上限、路徑限制、選用 token）與資料夾地圖。
- `#L5-L33` — `CUSTOMIZE.md` — 改 port、換 ARMS 顏色、改 Apply 目標或隱藏、加篩選、加欄位的落點，以及不可破壞的相容規則（id 不變、只加可選欄位、`esc()`/`cleanSvg()` 不可拿掉、400px 可用、深淺色切換）。
