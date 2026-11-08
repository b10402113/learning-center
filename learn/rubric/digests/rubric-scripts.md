---
source: sources/rubric/20261108/supplement/rubric-scripts
source_type: codebase
source_lines: 1735
language: Markdown
file_count: 13
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- **server（app/server.mjs）**：單檔 Node HTTP 伺服器，只綁 127.0.0.1:50011，提供首頁、`/s/<id>`、`GET /api/data`、`POST /api/state` 與 `/api/health`。無 npm 依賴、無金鑰；以 origin 檢查、1 MB 上限與 public 路徑圍籬保護本機寫入。
- **check（app/check.mjs）**：agent 每次寫檔後執行的資料檢查器，逐欄位印出 `PROBLEM` 或 `NOTE`，涵蓋 hooks、caption、icon、references、長破折號與 state.json 的 `rev`。`--server` 會順便確認伺服器是否在跑。
- **skill（skills/rubricscripts/）**：`/rubricscripts` 的主控 skill，含 YOUR DEFAULTS 與三條工作流：A 開 app、B 從想法或 shortlist 寫腳本、C 套用留言並把語氣心得教進 `/tone`。`references/data.md` 定資料形狀，`make-hooks-and-tone.md` 教使用者自建 `/hooks` 與 `/tone`。
- **public UI（app/public/）**：`index.html` 是卡片/列表首頁（搜尋、標籤、排序、拖曳順序），`script.html` 是單篇工作台（三個 hook 並排、caption、references、video 佔位）。`common.js` 提供 Store、主題與匯出留言文字；`app.css` 定深色優先的設計 token。
- **data（app/data/）**：`scripts.json` 由 agent 寫，內含三篇範例腳本；`state.json` 由 app 寫（`rev`、`order`、`note`、`tone`、`items`）；`shortlist.md` 是待寫靈感清單。核心腳本卡模型是「3 個 hook + caption + references」，review 後用「comments cart → 複製給 agent → 套用 → 教 /tone」形成閉環。

# L2 detail

- `#L3-L30` — `README.md` — 產品定位與安裝步驟：本機執行、Node 18+、把 skill 放進 skills 夾、設定 App folder、用健康檢查確認。學員可先建立「agent 寫檔、app 只當視窗」的架構心智模型。
- `#L65-L86` — `README.md` — 檔案職責表與安全模型：127.0.0.1、無 CORS、路徑不得逃出 public、1 MB 上限、icon SVG 淨化。這是理解本機 app 信任邊界的重點。
- `#L11-L56` — `skills/rubricscripts/SKILL.md` — YOUR DEFAULTS 與 Universal rules，再加 Workflow A/B/C：先找使用者的 `/hooks`、`/tone`、`/script`，不發明事實，三個 hook 必須不同，有未套用留言時不得改寫。呈現「使用者 skill 寫字、此 skill 歸檔」的分工。
- `#L58-L84` — `skills/rubricscripts/SKILL.md` — 單篇腳本的 drop-in JSON 範例與 icon 規則：48×48、1 到 4 個描邊圖形、`class="a"` 標橘色重點。直接對應 card model 的資料契約。
- `#L9-L57` — `skills/rubricscripts/references/data.md` — `scripts.json` 與 `state.json` 的完整欄位；comments 以 `region`、`hook`、`quote`、`note`、`applied` 定位，edits 與 refs 是手動修改與新增參考。這是 agent 解讀使用者工作的唯一規格。
- `#L59-L65` — `skills/rubricscripts/references/data.md` — app 的容錯整理（重複 id、caption 首行、缺 hook）與 stale tab 的 `rev` 樂觀鎖。說明為何每次寫 state.json 都要 `rev + 1`。
- `#L7-L23` — `skills/rubricscripts/references/make-hooks-and-tone.md` — 用 5 到 10 個自己的樣本建 `/tone`、10 到 20 個有效 hook 建 `/hooks`，再靠每次留言持續長大。這是 teach-my-tone 迴圈的前置條件。
- `#L18-L60` — `app/server.mjs` — 設定常數與 `loadScripts()`：即使 scripts.json 略有瑕疵也會修補並回報 problems（id 去重、hook 上限 5、caption 去關鍵字行）。展示「agent 寫、server 寬容讀」的設計。
- `#L84-L110` — `app/server.mjs` — 路由與防護：origin 不符回 403、狀態版本不符回 409 並附新狀態、public 路徑正規化後檢查前綴、1 MB body 截斷。是本機寫入安全與多分頁衝突處理的核心。
- `#L21-L68` — `app/check.mjs` — 逐腳本驗證 id、必填欄位、hooks 數量與 id 格式、caption、icon 白名單、references URL、channels、日期與長破折號；再檢查 state.json 的 `rev` 與孤兒項目，最後印 `OK n scripts, m hooks` 或逐行 PROBLEM 並 exit 1。
- `#L38-L99` — `app/public/common.js` — `Store`：一次載入 `/api/data`、本地 tidy、以 `rev` 存整個 state、409 時採磁碟新版本、focus 時 refresh。這是前端與 server 同步的唯一通道。
- `#L113-L142` — `app/public/common.js` — `exportText()` 產生 `# RUBRIC Scripts comments` 格式的 hand-off，內含 tone 指示、逐腳本留言、編輯與新增 references，並把長破折號換成 ` - `。
- `#L153-L273` — `app/public/index.html` — 首頁邏輯：搜尋 `/`、標籤 chips、`With comments`、五種排序、Cards/List、拖曳更新 My order、`New script` 對話框。對應「卡片是腳本入口」的資訊架構。
- `#L340-L382` — `app/public/script.html` — 留言定位：把文字正規化後用 `quote` 找回 range，再以 `mark.hl` 上色並顯示編號；編輯中或 pending 時的行為也在這裡。理解 highlight-to-comment 為何能在改字後仍盡量對得上。
- `#L476-L628` — `app/public/script.html` — hook 選擇與 1/2/3/h 快捷鍵、Edit/Done 的 contenteditable 編輯與 reset、選字浮出 Comment、收進右下 Comments cart、點 highlight 回跳、note 與 `tone` 開關、複製給 agent。是整個 review 迴圈的前端實作。
- `#L5-L17` — `app/public/app.css` — 深色與淺色 token：`--accent` 橘色只給主要動作、`--yellow` 給留言、四個 panel 各自灰階。說明視覺層如何用顏色分工。
- `#L1-L82` — `app/data/scripts.json` — 三篇範例腳本，示範 card model：`hooks` 陣列、預設 `hook`、`body`、AEO `caption`、`references`、`icon` SVG。是最好懂的資料範本。
- `#L1-L11` — `app/data/state.json` — 初始狀態：`rev: 0`、`order`、空 `note`、`tone: true`、空 `items`。顯示 app 寫入檔的起點。
- `#L1-L11` — `app/data/shortlist.md` — 靈感清單格式：`- [ ]` 開啟、`- [x] ... (written: id)` 完成。對應 Workflow B 的 shortlist 迴圈。
