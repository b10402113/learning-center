---
source: sources/rubric/20261108/supplement/rubric-agentic-os-v2
source_type: codebase
source_lines: 16936
language: JavaScript
file_count: 77
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- **伺服器與外殼**：`server.js` 是唯一的啟動點，用 Node 內建模組同時供應首頁、Second Brain 與所有 widget feed，並把 `engine/server.js` 當子程序拉起。`index.html` 用三個 iframe（首頁、brain、views）組成 shell，`copy.js` / `view-transitions.js` / `shell-extras.js` 負責縮放轉場、搜尋與 refresh。
- **首頁與 3D orb**：`os.html` 是單一可編輯的首頁檔，包含設計 token、widget 版面、Skills Deck、Routines、Micro Apps 與中央 orb。`assets/home-orb.js`、`home-orb-mini.js`、`puzzle-thinking.js`、`thinking-orbs.js`、`three.global.js` 一起畫出可旋轉、會思考、可縮放進 Second Brain 的 orb。
- **Second Brain 資料管線**：`engine/scan.js` 掃描 workspace，把檔案分成 ARMS 四層（Applications / Routines / Memory / Skills）與 department；`refresh/brain.mjs` 把掃描結果寫成 `brain/snapshot.js`、`_icons.js`、`home-orb-mini.js`；`refresh/run.mjs` 依序跑 brain 與 usage 兩步，全程不呼叫模型。
- **Second Brain 前端**：`brain/index.html` 是 skin（顏色、物理、標籤）與 HTML 外框，`brain/_core.js` 是共用引擎（資料載入、展開、三種 layout、相機、搜尋、viewer），`brain/port.js` + `port-gl.js` 畫 3D 與 2D，`timeline-layout.js` 畫時間軸，`offline.js` 讓整包可離線開檔。
- **Routines / Skills / Applications 分頁**：`views/index.html` 載入 `views.js`，Routines 交給 `calendar-board.js`（週曆、固定軌道、用量），Skills 與 Applications 交給 `usage-board.js`（環圈大小＝使用量），`hex-bg.js` 提供背景。
- **排程、用量與讀取器**：`refresh/lib/routines.cjs` 解析 cron / days+times 並算出本週 fire time；`refresh/lib/sources.cjs` 彙整 routines 檔與 agent scheduler 讀取器；`refresh/sources/claude-code.cjs` 讀 Claude Code 的 scheduled tasks 與 session log；`refresh/usage.mjs` 產出 skills/routines/apps 的 runs、tokens、API $。
- **設定即介面**：`os-config.json` 管 port、skills deck、runner、Micro Apps、email、clocks；`config/workspace.json` 指 workspace 與 skill/memory 目錄；`config/departments.json` 定義部門與四層顏色；`config/apps.json`、`agents.json`、`access-overrides.json` 描述外部連結與存取權。
- **文件與維運**：`README.md` 是總覽與安全模型，`BRAIN.md` 教設定 Second Brain，`WIRING.md` 教 runner / email / stats / Micro Apps，`ROUTINES.md`、`USAGE.md`、`OAUTH.md`、`RING.md`、`REDESIGN.md` 各管一個子系統；`skills/agenticos/SKILL.md` 是給 agent 的操作手冊；`tools/google-calendar.js` 是唯一的 Google OAuth 工具。
- **資料與產物**：`data/snapshot.js`、`data/arms-usage.js` 是 refresh 寫給頁面的唯讀資料；`snapshots/*.json(l)` 是 agent 寫入的 feeds；`artifacts/*.html + *.json` 是 ring 上的球，每個 HTML 配一個 sidecar 描述標題、icon 與 SVG glyph。

# L2 detail

- `#L1-L654` — `server.js` — OS 主伺服器：靜態頁面、`/api/*` feeds、`/local/*` brain 代理、`/api/run` 與 `/api/apply-comments` runner、calendar/email/stats/routines/artifacts 資料、安全檢查（Host/Origin/JSON/token）、首次啟動自動 refresh。學到「一個零依賴 Node 檔如何變成整個 OS 的骨幹」。
- `#L1-L16` — `index.html` — shell：三個 iframe（`os.html`、`brain/index.html`、`views/index.html`）、頂部控制列、view tabs、搜尋框、refresh 按鈕；CSP 只允許本機資源。
- `#L1-L47` — `copy.js` — shell 的縮放與轉場控制器：首頁 orb 與 brain 的 zoom 接合、view 切換、iframe 間 postMessage 協定、載入順序與 thinking 狀態。
- `#L1-L25` — `view-transitions.js` — 抓取兩個 iframe 的畫面與節點座標，畫出跨 view 的 morph 過場；`pointsOnly` 快路徑只交換節點位置。
- `#L1-L146` — `shell-extras.js` — shell 的檔案搜尋（`/local/search`）與 refresh 圖示（`/local/refresh`），搜尋結果可飛到 3D/2D/Timeline 的節點。
- `#L1-L3526` — `os.html` — 首頁單檔應用：`:root` 設計 token、`THEME`、hex 背景、orb 容器、widget 版面（title / skills deck / routines / Micro Apps / calendar / email / stats）、拖曳與編輯模式、ICS 像素 icon、tweak 面板、orb 與 ring 繪製。
- `#L1-L504` — `widgets.html` — widget library（`/widgets`）：每個 widget 的預覽、說明與「給 agent 的 prompt」，是首頁 widget 的型錄與安裝入口。
- `#L1-L45` — `copy.css` — shell 與 iframe 版面、控制列、tabs、dropdown、responsive 斷點；`#L1-L25` 另含 `copy.js` 的視覺狀態。
- `#L1-L27` — `os-config.json` — OS 設定中心：`port`/`brainPort`、`models`/`efforts`、`skills`、`runner.command`、`microApps`、`clocks`、`readers`、email 與分類 hints。
- `#L1-L14` — `config/workspace.json` — workspace 根目錄、routerDoc（AGENTS.md）、instructionDocs、skillDirs、memoryDir/memoryIndex、projectsDir、visibleRoots、maxFiles。
- `#L1-L19` — `config/departments.json` — 3–6 個 department 與四個 layer（A/R/M/S）的顏色、形狀、說明；`projectPrefixes`、`memoryKeywords`、`pathRules`、`default` 決定每個檔案落點。
- `#L1-L5` — `config/apps.json` — 真正的外部連結清單（MCP / CLI / API / app），含 `command`、`mcp`、品牌 icon path/svg；空陣列代表尚未接任何服務。
- `#L1-L4` — `config/agents.json` — 遠端 agent（`kind: vps`、`access: synced`）或 helper agent 的 skills/memory 節點清單。
- `#L1-L4` — `config/access-overrides.json` — 以路徑 prefix 覆寫 access（local / remote / both），讓敏感資料撿不到。
- `#L1-L18` — `refresh/run.mjs` — refresh 入口：依序 spawn `brain.mjs`、`usage.mjs`，任何一步失敗就停；是「按 refresh 圖示」的 CLI 版。
- `#L1-L150` — `refresh/brain.mjs` — Second Brain 資料建構器：掃描、skills 節點（資料夾或單一 .md）、routines、apps、AGENTS md 的編輯時間、markdown links、folder expansions、icons、homepage orb 顏色；寫入 `brain/`、`data/`、`assets/home-orb-mini.js`。
- `#L1-L129` — `refresh/usage.mjs` — 用量計算：讀 `snapshots/usage-log.jsonl`、`data/app-opens.jsonl` 與 agent session logs，算出 skills/routines/apps 的 7 天與 30 天 runs、tokens、API $；未量測的一律標 "not measured"。
- `#L1-L201` — `refresh/lib/routines.cjs` — routines 核心：接受 v2（cron 或 days+times）與 v1 列格式、cron 欄位解析、時區、`calendarData()` 產生本週 fire times、`todayRows()` 產生首頁 widget、routine icon 與 scheduleText。
- `#L1-L34` — `refresh/lib/sources.cjs` — routines 來源註冊表：永遠讀 `snapshots/routines.json`，再依 `readers` 開關呼叫各 agent scheduler reader；`allRoutines()` 是唯一出口。
- `#L1-L29` — `refresh/lib/apps.cjs` — Micro Apps 清單：內建 RUBRIC Recos（localhost:50013，fallback 到 Skool classroom），加上 `os-config.json` 的 `microApps`，驗證 id/url 並推導 port。
- `#L1-L215` — `refresh/sources/claude-code.cjs` — Claude Code 讀取器：`~/.claude/scheduled-tasks` + desktop `scheduled-tasks.json` 轉成 routines；session `.jsonl` 解析 skill 載入、scheduled-task、model 用量、tool/MCP 呼叫與 API 費率；同名 token 去重、只保留指令名與本機 port。
- `#L1-L307` — `engine/scan.js` — workspace 掃描器：排除 node_modules/.git/cache、symlink 只跟一次、讀 markdown links（mtime cache）、分類 `layerOf`/`deptOf`/`accessOf`、建立 graph（router、hub、file、dir、app、agent 節點與 route/spoke/wire/sync links）、`search()` 與 `expandDir()`。
- `#L1-L115` — `engine/server.js` — Second Brain 唯讀檔案服務：`/api/graph`、`/api/expand`、`/api/search`、`/api/file`、`/api/meta`、`/api/rescan`；只綁 127.0.0.1、檢查 Host、拒絕 secret 檔與 >500KB 檔、只寫 links cache。
- `#L1-L279` — `engine/brain.js` — 零 token 的記憶 recall/store CLI：index-first 讀 `MEMORY.md`、只開最相關檔案、回傳切片與 bytes/ms；`store()` 寫 convention-correct memory 檔並插入索引；`ask()` 只組 prompt 不呼叫模型。
- `#L1-L606` — `brain/index.html` — Second Brain skin 與外框：`skin` 物件（layer/dept 顏色、物理參數、themes、drawBackdrop/drawLink 等繪製覆寫）、載入順序、MENU/LEGEND fab、ring spin 與檔案標籤開關；是「同引擎換皮」的示範。
- `#L1-L1826` — `brain/_core.js` — brain-v2 共用引擎：載入 snapshot、展開/收合、link 聚合、force/rings/deck layout、相機與互動、搜尋、viewer drawer、panels、theme、tweak；定義 `window.BrainCore` 與 `S` 狀態。
- `#L1-L342` — `brain/port.js` — 3D 與 2D 渲染器：ARMS layer、node sprites、curved links、rings/force/hex/timeline 切換、hover/focus、fly-to、offline 與 WebGL layer 協調；`window.QuietPort` 供 shell 的 zoom 對接。
- `#L1-L154` — `brain/port-gl.js` — WebGL2 instanced sprite layer：把 ~1,750 次 drawImage 合成一次 instanced draw，保留 depth order；WebGL2 不可用時回退 2D。
- `#L1-L142` — `brain/_flows2.js` — `window.F2` 繪圖 helper：顏色轉換、glow sprite、node 形狀、line-art icon、Robo pixel sprite；所有 skin 共用的視覺語言。
- `#L1-L126` — `brain/timeline-layout.js` — Timeline 版面：以「每一天同一個 x」的共用日曆軸，把檔案與 routine 依 mtime 排入 lane，最近三個月、Older 區塊、today 線。
- `#L1-L36` — `brain/offline.js` — 離線/檔案模式：用 `QUIET_SNAPSHOT` 攔截 `/api/graph`、`/api/expand`、`/api/search`、`/api/file`，讓 brain 可直接開檔；http 下載入 expansions worker。
- `#L1-L23` — `brain/expansions-worker.js` — 把 ~2.6MB 的 folder expansions 放到 worker 解析，避免主執行緒卡頓；提供 expand 與 search 訊息介面。
- `#L1-L1` — `brain/map-layouts.js` — refresh 產生的 2D layout 座標快取；預設空物件，讓 layout 每次即時計算。
- `#L1-L1` — `brain/snapshot.js` — refresh 產生的唯讀 graph snapshot（`window.QUIET_SNAPSHOT`）：meta、departments、layers、nodes、links、mdLinks；空 workspace 時仍可畫出 hub。
- `#L1-L1` — `brain/snapshot-expansions.js` — 每個資料夾的子節點快取（`window.QUIET_EXPANSIONS`），供展開與搜尋使用。
- `#L1-L1` — `brain/_icons.js` — refresh 產生的 icon pack（`window.BRAIN_ICONS` / `BRAIN_ICON_PATHS`），包含 routine 與 app 的自動繪製 icon。
- `#L1-L3` — `views/index.html` — 分頁 iframe 的 HTML：載入 `data/snapshot.js`、d3、`arms-usage.js`、`calendar-board.js`、`usage-board.js`、`views.js`。
- `#L1-L97` — `views/views.js` — 分頁控制器：Routines / Skills / Apps 的 hash 路由、d3 zoom、sticky 週標頭、iframe 間 view/capture 訊息、`window.ViewsCopy` API。
- `#L1-L119` — `views/calendar-board.js` — Routines 週曆：每個 routine 固定 track、icon + rail 表示密集 fire、filter/sort、用量欄位（runs/tokens/API $）、hover popover 與 details。
- `#L1-L206` — `views/usage-board.js` — Skills 與 Applications 的環圈圖：d3.pack 依使用量決定大小，可切換 Most used / tokens per week / per run / API $、7/30 天、connector/tool/local；未量測顯示 "not measured"。
- `#L1-L24` — `views/hex-bg.js` — 分頁背景的 20px hex fade 圖案，和首頁 `drawHex()`、`brain/port.js` 同一套視覺。
- `#L1-L50` — `assets/os-data.js` — 首頁資料層：`/local/boot` 一次拿五個 feed、`copyStorage` 命名空間、iframe 暫停時排隊 requestAnimationFrame、離線時用 snapshot。
- `#L1-L2` — `assets/os-snapshot.js` — 離線首頁的 feed 快照（`window.OS_COPY_SNAPSHOT`）；預設空，提醒用 `node server.js` 取即時資料。
- `#L1-L720` — `assets/home-orb.js` — 首頁中央 orb：3D 粒子、halftone puzzle face、layer 配色與 ring 動態、hover/open/thinking 狀態；`window.__labOrb` 是外層可讀的控制介面。
- `#L1-L1` — `assets/home-orb-mini.js` — refresh 寫入的 orb 中心顏色與各 layer 大小（department 顏色、skills/routines/apps 半徑），讓首頁 orb 與 Second Brain 對齊。
- `#L1-L393` — `assets/thinking-orbs.js` — thinking-orbs v0.1.1 的 canvas frame painters（MIT），把 React 套件抽出成純 HTML 可用的「思考中」orb。
- `#L1-L860` — `assets/puzzle-thinking.js` — thinking-orbs 0.3.2 幾何引擎（MIT），提供 puzzle/rubik 風格的 3D 點陣與動畫，是首頁 orb 的另一個視覺來源。
- `#L1-L3840` — `assets/three.global.js` — 打包的 Three.js（vendor），供首頁 orb 與 WebGL 場景使用；不是本專案手寫程式。
- `#L1-L75` — `assets/ambient.js` — 全域動畫節流：互動時全速、閒置降到 30fps、一分鐘後暫停所有 rAF 與 CSS 動畫；所有頁面第一個載入。
- `#L1-L19` — `assets/token.js` — 選用共享 secret：把 `<meta name="rubric-token">` 的值加到每個同源 fetch 的 `x-rubric-token`，並傳給 iframe。
- `#L1-L1` — `data/snapshot.js` — refresh 產生的 Routines 分頁資料（`window.COPY_DATA`），server 也會即時產生同一形狀。
- `#L1-L1` — `data/arms-usage.js` — refresh 產生的用量資料（`window.ARMS_USAGE`）：totals、skills、routines、apps、local apps、measured 旗標與方法說明。
- `#L1-L15` — `snapshots/routines.example.json` — routines 檔範例：sources、cron、days+times、status ondemand 的完整形狀。
- `#L1-L3` — `snapshots/usage-log.example.jsonl` — usage log 範例：routine / skill / app 三種事件，含 tokens、cost、calls。
- `#L1-L132` — `tools/google-calendar.js` — Google Calendar OAuth 工具：一次性 `auth` 開瀏覽器存 token，`next` 輸出 upcoming events JSON；只用 `calendar.readonly`，redirect 固定在 localhost:3847。
- `#L1-L75` — `skills/agenticos/SKILL.md` — `/agenticos` skill：OS 各元件的所在檔案、refresh 順序、常見工作（加 app/card/routine/department）、檢查迴圈（重啟、headless、截圖、`/api/health`）與故障排除表。
- `#L1-L123` — `README.md` — 總覽：安裝、啟動、ring、Micro Apps、port、v1→v2 升級、folder map 與完整安全模型（127.0.0.1、Host/Origin、token、secret 檔、runner 白名單）。
- `#L1-L42` — `USAGE.md` — 用量來源與規則：agent session logs、`usage-log.jsonl`、Micro Apps opens；哪些量測、哪些顯示 "not measured"、API $ 的意義。
- `#L1-L35` — `RING.md` — ring 的行為與 agent 慣例：每個 `artifacts/*.html` 是一個球，sidecar 提供 title/icon/kind/note/svg；右鍵 OPEN/REMOVE、`_trash` 可還原、30 天弧線。
- `#L1-L114` — `BRAIN.md` — Second Brain 設定指南：ARMS 四層、`workspace.json` 各欄位、departments 規則順序、apps 清單、`node refresh/run.mjs`、各部分對應檔案、`engine/brain.js` recall/store/ask。
- `#L1-L84` — `WIRING.md` — runner 三種模板（stdin / `{prompt}` / `{skill}`）、skills deck 卡片、Apply all comments、email、stats、Micro Apps 與「保持 feeds 新鮮」的習慣。
- `#L1-L56` — `OAUTH.md` — 日曆 widget 的 Google OAuth 步驟（Cloud project、Calendar API、OAuth client、`googleapis`、`auth`/`next`）與常見錯誤。
- `#L1-L57` — `ROUTINES.md` — routines 的兩個來源（agent scheduler reader、`snapshots/routines.json`）、cron 與 days+times 格式、v1 相容列、用量與 freshness。
- `#L1-L37` — `REDESIGN.md` — 重新設計的原則：先改 `:root` token 與 JS `THEME`，再改 brain skin、字型、殘留色；強調「方向勝於裝飾、accent 是預算、muted text 決定成敗、保留骨架」。
- `#L1-L7` — `artifacts/sample-run-report.json` — ring sidecar 範例（skill run report）：title/icon/kind/created/note/svg 的標準形狀。
- `#L1-L8` — `artifacts/welcome-to-the-ring.json` — ring 導覽球的 sidecar，示範多形狀 SVG glyph。
- `#L1-L7` — `artifacts/sample-weekly-brief.json` — 週報球的 sidecar，示範 `kind: report` 與 report icon。
