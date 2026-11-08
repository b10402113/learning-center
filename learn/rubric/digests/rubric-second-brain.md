---
source: sources/rubric/20261108/supplement/rubric-second-brain
source_type: codebase
source_lines: 3964
language: JavaScript
file_count: 17
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- `server.js` — 零依賴的本機 HTTP 伺服器（預設 5210）。啟動後在 `setImmediate` 裡跑一次完整掃描，先把 socket 綁好再吃重工作，之後用 `/api/graph`、`/api/expand`、`/api/search`、`/api/file`、`/api/open`、`/api/rescan`、`/api/tweak`、`/api/bake` 服務前端。所有檔案存取都經過 `safeResolve` 的 root 前綴檢查，靜態檔也限制在 `public/` 內。
- `scan.js` — 工作區掃描器，也是整個系統的資料來源。它遞迴走檔案、套用 ARMS 分類（Applications / Routines / Memory / Skills）、用 `departments.json` 的 prefix / path / keyword 規則分派部門、用 `workspace.json` 的 `sharedPrefixes` 算 access，並抽出 Markdown 的 wiki link 與相對連結。輸出是一份「目前可見」的圖（節點 + 結構邊 + md 邊）加上 `expandDir` / `search` 兩個 API。
- `brain.js`（brain/graph）— 零 LLM 呼叫的檢索與儲存引擎：`recall` 只讀 `MEMORY.md` 一個索引檔，對指標行（精確詞 +3、前綴 +1）、檔名（+4 / +1）與 `routing` 主題詞（+4）評分，只打開贏家並切出相關段落，還會沿著指標再跳一層；`store` 一次寫好記憶檔與索引行；`ask` 只組一段單輪 prompt 並丟到剪貼簿。核心觀念是「把檢索移到模型外面」，因此成本可用讀取 bytes 與毫秒計量，而不是 token。
- `config/` — 七個 JSON 把「引擎」與「這個工作區長什麼樣」切開：`workspace.json` 定位 root、memory、skills、projects、可見根目錄與 routing；`departments.json` 定義部門與四層 ARMS；`apps.json` 只收真的外部連線（MCP / CLI / API）；`routines.json` 收排程；`agents.json` 描述 VPS 或受限 agent；`access-overrides.json` 與 `tweaks.json` 是覆寫與 UI 隱藏/改名。正常安裝不該改引擎程式。
- `public/` 前端 — `index.html` 是「最終版」skin：一個 `skin` 物件宣告主題、物理預設值、節點造型與繪圖函式，`BrainCore.boot(skin)` 接手。`_core.js` 是 chassis（狀態、聚合、五種佈局、相機、互動、搜尋、檢視器、面板、主題），`_flows2.js` 提供顏色、快取光暈、形狀、像素 sprite 與線稿圖示，`_icons.js` 是品牌填色與手繪 stroke 圖示包。視覺地圖的價值在於：檔案是節點、Markdown 連結是邊，每次載入都從磁碟重建，所以圖不會過期。
- `snippets/claude-md.md` — 可選的 CLAUDE.md 接線片段：把「查已存事實」導到 `brain.js recall` 優先，把 `store` 設成存事實的預設路徑。只有在使用者採用「一則事實一個檔 + 一份索引」的記憶慣例時才安裝。

# L2 detail

- `#L1-L153` — `README.md` — 安裝與定位文件：三步（Scan / Confirm / Launch）、每個 config 欄位怎麼找、icon 原則、`brain.js` 三個命令與量測數字、Jay 的 ARMS 參考設定、四個研究來源（Karpathy LLM-wiki、qmd、gbrain、graphify）與刻意不做的選擇（不建向量庫、不抽 LLM 實體圖）。學習點：這個系統的邊界是「檔案優先 + 索引 + 確定性檢索」，不是通用 RAG。
- `#L1-L207` — `server.js` — 伺服器入口與 API 合約。重點在 L30-L50 的掃描生命週期（`scanPromise`、30 秒 fresh 判斷）、L65-L70 的 `safeResolve`（拒絕 `\0` 與逃出 ROOT）、L88-L101 的 `/api/graph` 回傳 `meta / departments / layers / nodes / links / mdLinks`、L119-L127 的 `/api/file`（只送白名單文字副檔名、>500KB 拒絕）、L140-L152 的 tweak 寫入、L160-L169 的 bake 快照。學習點：一個唯讀掃描器加上幾個小 API，就能支撐整個視覺化。
- `#L31-L42` — `scan.js` — `loadConfig()` 把六個 JSON 讀進來，並把 `projectPrefixes` 依長度由長到短排序，讓 `J-0002` 赢過 `J-`；access overrides 同樣 longest-prefix-first。學習點：規則式分類的成敗常在優先序，而不是規則數量。
- `#L46-L79` — `scan.js` — 分類核心：`SECRET_RE` / `isSecret`（`.env`、`.pem`、`.key`、`secrets`、`credential`、`token.json`）、`accessOf`（secret → `claude`、override → 指定值、`sharedPrefixes` → `both`）、`layerOf`（skillDirs → `S`，其餘 `M`）、`deptOf`（projects 前綴 → memory 關鍵字 → pathRules → default）。學習點：secret 的判斷必須在 access 之前，否則同步範圍會把秘密算進去。
- `#L82-L126` — `scan.js` — `walk()`：一次 `readdirSync` 建出 `files[]` 與 `dirs` Map，排除 `node_modules`、`.git`、虛擬環境、建置產物等，並用「最深優先」回捲檔案數 / bytes / md 數。學習點：先建完整模型再派生圖，比在遞迴中邊走邊畫好除錯。
- `#L129-L189` — `scan.js` — `extractLinks()`：以 mtime 快取每個 md 的連結，支援 `[[wiki]]`（用 basename 解析、`pickClosest` 取同目錄優先）與 `](x.md|pdf|html)` 相對路徑，跳過外部 URL、`mailto`、逃出 root 的路徑。學習點：連結快取讓「每次載入重建圖」仍然便宜。
- `#L196-L316` — `scan.js` — `buildGraph()`：先放 `CLAUDE.md` router 節點，再放部門 hub 與 layer hub，接著只把 `SPINE`（`visibleRoots`）的直接子項展開、其餘資料夾折成一個可展開的 `dir` 節點；app / routine / agent 是虛擬節點，`route`、`spoke`、`wire`、`sync` 四種邊分開畫。agent 若 `access: synced` 會依 `sharedPrefixes` 算出各部門 reach 與被排除的 secret 數。學習點：router → 部門 hub → 檔案的三層，就是「CLAUDE.md 是總路由器、部門是分區路由器」的具體資料結構。
- `#L322-L400` — `scan.js` — 公開 API：`runScan()` 串起 config、walk、links、graph 並寫回 links 快取，回傳 `meta`（檔案數、md 連結數、可見節點、掃描毫秒）；`expandDir()` 只回傳某一層的子項供 lazy expand；`search()` 用檔名完全符合 100 / 前綴 80 / 包含 60 / 路徑 30 評分並依深度略減。學習點：搜尋與圖是同一份模型上的兩種視圖。
- `#L39-L160` — `brain.js` — `recall()` 的完整評分與切片流程：索引 hop（只讀 hub）、檔名掃描（不讀內容）、root doc hints、去重取 top-k、標題命中優先否則取關鍵詞密集行前後窗口、最後沿 slice 中出現的 `.md` 再跳一層。回傳 `hits / bytes / ms / found`，成本可觀測。學習點：確定性檢索的關鍵不是演算法多聰明，而是「只讀一份索引 + 明確的評分規則」。
- `#L163-L220` — `brain.js` — `store()`：依 `--type` 決定檔名前綴（`feedback_` / `project_` / `user_` / `reference_`），寫出含 `name / description / metadata.type` 的 frontmatter，並把索引行插進對應段落（不是盲加在檔尾）；寫入前用 regex 把 token 形狀的字串替換成 `<redacted>`。`--sandbox` 導向 `.cache/sandbox-memory/`。學習點：儲存格式與索引位置本身就是約定，必須由工具保證。
- `#L224-L242` — `brain.js` — `buildAsk()` 把問題與 recall 證據（上限 9000 字元）組成「只依證據回答、引用該行、說出來源檔」的單輪 prompt；`copyToClipboard()` 跨平台嘗試 `clip` / `pbcopy` / `xclip` / `xsel`。學習點：「一個 turn 回答」是省 token 的結構性手段，不是模型能力。
- `#L246-L277` — `brain.js` — CLI 分派：`recall` 印出每個 hit 與 bytes/ms 統計，`store` 印出檔案與索引行，`ask` 印出 prompt 並標示是否已進剪貼簿；沒有命令時印 usage。學習點：工具對 agent 友善的形式是「一個命令、結構化輸出、附成本」。
- `#L1-L34` — `config/workspace.json` — 工作區座標：`root` 相對於這個 repo、`memoryDir` / `memoryIndex`、`skillDirs`、`projectsDir`、`sharedPrefixes`、`visibleRoots`，以及 `routing`（哪份 root doc 擁有 goal / rule / workspace / map 這類主題詞）。學習點：`routing` 是 `recall` 唯一的領域知識，改它就能改變檢索走向。
- `#L1-L62` — `config/departments.json` — 四個範例部門（work / content / personal / operations）與四層 ARMS：Applications（hex）、Routines（ringdot）、Memory（chip）、Skills（diamond），各有 color、icon、blurb；`projectPrefixes` / `pathRules` / `memoryKeywords` 留空待安裝者填，`default` 是 catch-all。學習點：部門是「內容分區」，ARMS 層是「能力型態」，兩者是正交的兩個維度。
- `#L1-L34` — `config/apps.json` — 只放真實外部連線的範例：GitHub CLI、Gmail MCP、Telegram MCP，欄位有 `kind`（cli / mcp）、`access`、`status`、`desc`、`links`、`iconSlug`。檔頭明講「本機 runtime 不算」。學習點：這份清單就是 agent 的實際外部觸及面。
- `#L1-L22` — `config/routines.json` — 排程清單範例：`daily-log`（local、每日 21:00）與 `newsletter`（skill、每週）。學習點：routine 不是程式，而是「誰在什麼時間、用什麼 runner、能不能碰到 shared 資源」的宣告。
- `#L1-L3` — `config/agents.json` — 空陣列加註解：VPS agent 用 `kind: "vps"` + `access: "synced"`（reach 由 sharedPrefixes 計算），受限 agent 給明確 skills / memory 授權清單。學習點：agent 的可見範圍應該是算出來的，不是手寫的。
- `#L1-L4` — `config/access-overrides.json` — 空 overrides 陣列，供 per-prefix access 覆寫。搭配 `accessOf` 的 longest-prefix 排序使用。學習點：例外要集中在一處，否則權限會散落在程式裡。
- `#L1-L4` — `config/tweaks.json` — `hidden` 與 `edits`，由 UI 的 Edit / Remove 寫入，`buildGraph` 在最後一步過濾與改名。學習點：UI 的「整理」動作只改配置，不動磁碟上的檔案。
- `#L1-L1798` — `public/_core.js` — 前端 chassis，`window.BrainCore` 回傳 `boot / S / expandDir / collapseDir / jumpTo / openViewer / apiOpen / toast / flyToNode / select`。關鍵區段：L39-L63 `boot`（localStorage 還原、`/api/graph?fresh=1`）、L114-L192 `reaggregate`（把 md 邊聚合到可見代表節點、folder view 換 hub）、L311-L545 佈局與 rings 幾何（部門扇區依 `sqrt(檔案數)` 配寬）、L548-L736 d3 force / circle / hex / deck（每個常數幾乎都有一個 slider）、L739-L787 `radiusOf` / `colorOf` / `pass`（部門、層、access 三重過濾）、L790-L809 focus、L819-L906 相機與滑鼠互動、L932-L1069 render loop（dense 模式批次畫邊與節點）、L1138-L1229 詳情卡、L1232-L1286 側邊檢視器（md 用 marked、相對連結可跳圖）、L1289-L1517 面板與 bake。學習點：把「資料」、「佈局」、「繪圖」分層，skin 才能只換像素。
- `#L1-L583` — `public/index.html` — 最終版 skin 與頁面組裝：L63-L125 宣告 `skin`（`tightClusters`、`clusterLayers`、`hubOrbit`、`freeDrop`、`onlyAgents`、主題色、初始 `st`）、L128-L152 六角背景、L155-L203 霧與 ARMS 導引環、L206-L236 依連結種類上色與曲線、L239-L269 comet 粒子、L272-L473 各型節點（router 太陽、agent 衛星、hub、app 六角、routine 軌道、skill 星、dir 行星、file 光球）、L486-L511 標籤、L515-L520 啟動、L522-L581 MENU / LEGEND 浮動按鈕與 ring-spin 滑桿。學習點：這個檔案是「同一個引擎、兩種外觀」的具體示範——skin 只實作繪圖函式與預設值。
- `#L1-L144` — `public/_flows2.js` — `window.F2` 繪圖工具：hex 正規化 / 轉 rgba / 混色、依 link index 決定穩定曲度的 `bowOf` / `linkCtrl` / `linkPoint`、快取的光暈與球體 sprite（避免每帧建 gradient）、`rrect / diamond / hex / folderShape`、8x8 像素 sprite（robo / hermes / carla / xavier）、`icon()` 線稿（build / pen / people / coin / data / pulse / book / clock / api / lock）。學習點：把每帧成本壓下來的手段是「快取 + 確定性」，不是更快的硬體。
- `#L1-L46` — `public/_icons.js` — 兩個圖示包：`BRAIN_ICONS`（48x48 stroke `#888`，繪製時改色）與 `BRAIN_ICON_PATHS`（24x24 simple-icons 單一路徑填色），品牌圖示直接內嵌、執行期不碰 CDN。學習點：icon 是節點的可讀性介面，風格規則（2–5 個元素、24px 可辨）比數量重要。
- `#L1-L23` — `snippets/claude-md.md` — 兩段可貼進 CLAUDE.md 的規則：查已存事實時第一個工具呼叫就是 `brain.js recall`，答完要引用檔名；存事實預設用 `store --type ... --name ...`，只有需要 Why / How-to-apply 等結構時才手寫。學習點：要讓 agent 穩定使用工具，必須把「優先順序」寫進它每次都會讀到的路由文件。
