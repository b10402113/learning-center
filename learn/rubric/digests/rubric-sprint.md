---
source: sources/rubric/20261108/supplement/rubric-sprint
source_type: codebase
source_lines: 2243
language: JSON
file_count: 10
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- **Server（`server.js`）** — 零依賴 Node.js HTTP 伺服器，只綁定 `127.0.0.1`，用同一支 POST 端點以 `_action` 分派 create / update / delete / add_note。啟動時自行解析 `.env`，讀寫 `config.json` 與 `data/backlog.json`，並把樣本資料的 `$CURRENT` / `$NEXT` / `$PREV` 佔位符換成當週 ISO 週次標籤。靜態檔案服務有 path traversal 防護，選配 `RUBRIC_TOKEN` 作為共享密鑰。
- **Sprint board（`index.html` 的 Sprint 區）** — 依 ISO 週次把任務分成 `Wk{n}`，四欄 kanban（Todo / In Progress / Review / Done）以拖放改狀態，放開即呼叫 API 寫回。提供上一週／下一週／Today 導覽、倒數天數、加總進度條、每欄計數，以及 Default / Epic / Priority / ID 四種排序。`index.html` 是自帶 CSS 與 JS 的單檔 UI，沒有建置步驟。
- **Backlog table（`index.html` 的 Backlog 區）** — 同一批任務的表格視圖，提供 Epic / Status / Assignee / Priority / Sprint 下拉篩選、跨 task/id/project 的文字搜尋、點欄頭排序。儲存格可原地編輯：列舉欄位換成 `<select>`，文字欄位換成 `<input>`，blur 或 Enter 即送出更新。另有「+ New」modal 與逐列刪除。
- **Data model（`config.json` + `data/backlog.json`）** — 一個 `backlog.json` 同時餵養 kanban 與表格，沒有第二份任務清單。任務核心欄位是 `status`（Todo / In Progress / Review / Done）、`priority`（High / Mid / Low）、`effort`（S / M / L），外加 `epic`、`theme`、`project`、`sprint`、`quarter`、`tags`、`notes` 與時間戳。`config.json` 定義 epic→前綴字母、狀態、優先級、工作量與 assignee 清單，是 UI 下拉選單與 ID 產生的唯一來源。
- **Integration（`integrate.js` + `manifest.json`）** — 把此模板掛進 Rubric Scaffold 成為原生 tab，而不是 iframe。`integrate.js` 以版本化 marker 冪等修補 scaffold 的 `server.js` 與 `index.html`：掃描 sibling 目錄的 `manifest.json`、spawn 子程序、反向代理 API 與 assets、動態注入 panel 與 scoped CSS。`manifest.json` 宣告 port、API 前綴、兩個 tab（Sprint / Backlog）、要剝除的品牌區塊與要搬到 body 的 modal/toast。
- **Icons（`icons.html`）** — 獨立的像素風機器人圖示參考頁，用 8×8 位元圖陣列產生鏡像對稱的 SVG hop 動畫，點擊可複製名稱。它不是任務系統的執行路徑，而是 RUBRIC 品牌素材與 tiny SVG 產生技巧的展示。

# L2 detail

- `#L1-L103` — `README.md` — 寫給 AI agent 的安裝與使用指南：Sprint 與 Backlog 共用一份 `data/backlog.json`，說明兩視圖行為、agent 建票時應預設 `sprint: "Wk{n}"`（或 `$CURRENT`）與 `Todo` / `Mid` / `M`。學習重點是「agent-facing README」如何把安裝決策寫成可執行步驟。
- `#L21-L260` — `server.js` — 零依賴伺服器主體。`currentSprintLabel()` 用「週一為一週起點」的 ISO 週算法；`resolveSprintPlaceholders()` 讓樣本資料跟著日曆跑；`readBody()` 有 1MB 上限與 413；POST 分支以 `_action` 分派 CRUD，建立時同步 `meta.counters` 與現有最大 ID 避免重複；更新只允許白名單欄位，`status: "Done"` 會補 `completed` 日期；結尾是 MIME 對照與 path traversal 檢查。這是「單檔後端 + JSON 檔即資料庫」的完整範例。
- `#L237-L884` — `index.html` — 自包含 UI。HTML 先定義 Sprint 四欄與 Backlog 表格／modal，`<script>` 內用單一 `allTasks` 陣列與 `config` 物件做狀態；`getSprintForOffset()` 與伺服器端週次算法對齊；`renderSprint()` 分欄、算進度條、綁 dragstart；drop 時 `apiUpdate(taskId, {status})` 並同步本地陣列；`renderBacklog()` 做篩選、排序與組字串；`startInlineEdit()` 依 `BL_ENUMS` 決定下拉或文字輸入；事件委派處理編輯與刪除；`init()` 依序 fetchConfig → buildEnums → fetchTasks → render。學習重點是「伺服器為真相、本地陣列為快取」與不需框架的狀態同步。
- `#L36-L429` — `integrate.js` — Scaffold 整合器。`PATCH_VERSION` 與 `RUBRIC_EXT_PATCH_*` marker 讓修補可重跑且能升級；`SERVER_TOP_PATCH` 掃描 sibling 的 `manifest.json`、spawn 每個模板並在離開時 kill；`__extProxy()` 轉發 API 與 assets；`SERVER_PROXY_PATCH` 掛在請求處理器內並提供 `/api/external` 清單；`INDEX_FN_PATCH` 的 `loadExternalTemplates()` 抓一次 HTML、剝除 `stripSelectors`、用 `scopeCss()` 把外部樣式限定在 `[data-ext]` 下、把 `auxSelectors`（modal/toast）搬到 body，最後才執行 script；`removeOldPatchBlock()` / `patchFile()` 是版本化、冪等的檔案修補機制。學習重點是「以 marker 做 idempotent patch」與「無 iframe 的微前端注入」。
- `#L1-L123` — `data/backlog.json` — 全部任務的儲存檔。`meta` 保存 `version`、每個 epic 前綴的 `counters` 與 `lastUpdated`；`tasks` 陣列每筆包含 `id`（前綴-四位數）、`epic`、`theme`、`project`、`task`、`description`、`status`、`assignee`、`priority`、`effort`、`quarter`、`tags`、`notes`、`sprint`、`created`、`updated`、`completed`。樣本以 `$CURRENT` / `$NEXT` 標記，展示佔位符解法。
- `#L1-L13` — `config.json` — 執行期設定的唯一來源：`brandName`、`sprintCadence`、`epics`（名稱→單字母前綴）、`statuses`、`priorities`、`efforts`、`assignees`。UI 的下拉選項與伺服器的 ID 前綴都從這裡讀，因此改設定就能改工作流，不必改程式。
- `#L1-L11` — `manifest.json` — Scaffold 外部模板契約：`name`、`port`（5060）、`apiPrefixes`（`/api/sprint`）、`tabs`（Sprint / Backlog 各自 `panelSelector`）、`stripSelectors`（移除 `.gen-rubric-brand`）、`auxSelectors`（搬移 `#new-task-modal`、`#toast`）。這是「模板如何被宿主發現並掛載」的宣告式介面。
- `#L1-L12` — `package.json` — npm 中介資料：`name`、`version`、`main: server.js`、`start` / `dev` 都指向 `node server.js`。沒有任何 dependencies，具體證明整包是零安裝即可跑的設計。
- `#L48-L180` — `icons.html` — 像素機器人圖示產生器。`robo` 是主視覺，`D` 是 8×8 位元圖陣列；`makeHopSvg()` 把每個亮點同時畫在原位置與鏡像位置，分成身體與腳兩層，並用 CSS keyframes 做出 hop 動畫與地面陰影；`copyName()` 用 Clipboard API 複製名稱。學習重點是用極少量資料與 SVG/CSS 產生具品牌感的動態圖示。
- `#L1-L74` — `.claude/skills/sprint-backlog/SKILL.md` — agent 設定技能：如何定義 epic 與前綴、設定 assignee、用 curl 建立／更新任務、週次節奏、`meta.counters` 的自增同步、資料格式摘要與啟動指令。可對照 README 看出「同一套安裝知識」如何被壓縮成 agent 可直接執行的 skill。
