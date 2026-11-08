---
source: sources/rubric/20261108/supplement/rubric-carousels
source_type: codebase
source_lines: 3827
language: JavaScript
file_count: 19
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- `server.mjs`：Node 內建模組寫成的單檔伺服器，只聽 `127.0.0.1`，把 `carousels/` 下每個含 `deck.js` + `index.html` 的資料夾視為一則 carousel，讀 `export/manifest.json`、`review.json`、`status.json` 後回傳摘要。它只寫 `review.json`、首頁排序 `_home.json` 與按「Refresh snapshots」時的 `export/`，不發文也不設 keyword DM；`status.json` 只是顯示用。
- `home.html`：首頁一則 carousel 一張卡，顯示封面、Instagram 狀態（draft/ready/scheduled/live）、keyword、未處理留言與核准數；hover 封面可逐卡翻閱，支援搜尋、狀態 filter、三種排序與拖曳排序（`PUT /api/home-order`）。資料全部來自 `/api/carousels`，每次回到頁面重載。
- `index.html`（review page）：一列一則 carousel，卡片橫向排列；點卡片會在該座標釘一則留言，full view 可放大、用方向鍵翻卡、`a` 核准、選封面、拖曳改順序。`saveReview` 用 `version` 做樂觀鎖，409 時載入另一分頁的較新版本；購物車與留言最後都寫回各 carousel 的 `review.json`。
- `template/index.html` + `template/deck.js`：卡片引擎與資料契約。`deck.js` 只設 `window.DECK`（page、handle、keyword、caption、covers、cards、scenes），引擎把 540×675 的 canvas 畫成 `32bit` 或 `dot` 兩種風格，並在 `?solo=N&still=1` 模式輸出單卡給快照器。每則 carousel 保留自己的一份引擎，所以新引擎不會改到舊卡。
- `features/`：四個無依賴前端模組。`agent-cart` 把單卡或整則 carousel 加入購物車、逐項備註、輸出「Copy for my agent」；`click-comment` 管理釘點、座標、applied 狀態與匯出文字；`sidebar-nav` 提供章節/卡片導覽（`b`）；`apply-comments` 是模型 × effort 選擇器，呼叫本機 Agentic OS，沒回應就改為複製。全部讀頁面 CSS 變數，可從 `file://` 或 http 執行。
- `tools/export-cards.mjs` + `tools/check.mjs`：exporter 用 Playwright 開單卡頁，輸出 1080×1350 的 `card-NN.png`、432×540 的 `thumb-NN.jpg`、每個封面選項的縮圖，並寫 `export/manifest.json`；`check.mjs` 唯讀驗證資料夾格式（slug、引擎標記、cards ≤ 10、正好一張 cover、scene 與檔案存在、manifest 對齊、review/status 合法）。
- `carousels/tidy-desk/`：七卡範例（封面、五個整理技巧、save card），`deck.js` 把文案與 scene 畫法集中在一個檔；`export/manifest.json` 是 app 實際讀的快照索引，`review.json` 是 version 0 的空審查，`status.json` 為 draft。三層資料（deck → manifest → review/status）可直接對照。

# L2 detail

- `#L5-L63` — `README.md` — 產品定位與能力清單：card-by-card 審查、釘留言、核准、選封面、購物車、Copy/Apply all comments；第 9 行明講「never posts to Instagram and never sets up keyword DMs」，`keyword`、`caption`、`status.json` 只供顯示。學習點：工具的責任邊界寫在第一天，不是事後補。
- `#L65-L190` — `README.md` — carousel 資料夾格式：`deck.js` 欄位、scene 繪圖 API 與顏色、`export/manifest.json`、`review.json`（version/cover/order/approved/comments/target/x/y）、`status.json`。學習點：整個系統的 schema 都在這一節，新增欄位只能 optional。
- `#L192-L198` — `README.md` — 給 agent 的審查操作準則：讀 `review.json`、保留已核准卡、只改 `deck.js` 或封面、改完重跑 exporter 與 check、不要改 `review.json`、不要動 app 檔案。學習點：agent 的寫入範圍被限制在單一 carousel 資料夾。
- `#L200-L246` — `README.md` — 快照需求（Playwright 可選、`NODE_PATH` 重用）、四個環境設定，以及完整安全模型：localhost-only、無 CORS、DNS rebinding host 檢查、JSON-only、可選 token、1 MB 上限、只服務兩個頁面與 carousel 內檔案、寫入白名單、唯一的對外呼叫是 Apply。學習點：本機工具的安全是逐條可驗證的句子。
- `#L5-L13` — `CUSTOMIZE.md` — 指出 `server.mjs` 的四段結構（CONFIG、carousels、snapshots、routes）、兩個頁面的腳本分區，以及不能破壞的不變量：review version、四個 JSON 形狀、深/淺色切換、安全模型每句話。學習點：改外觀前先知道哪些契約不能動。
- `#L25-L51` — `CUSTOMIZE.md` — 改卡片尺寸（4:5 → 1:1 要同步改五處）、新增 `alt` 欄位（deck → exporter → index → README）、新增狀態（server `STATUSES` → home `STATE`/filter/顏色 → check → README）。學習點：一個欄位穿過四個檔案，這就是這套工具的耦合代價。
- `#L33-L47` — `server.mjs` — CONFIG 是唯一命名資料夾、port、Agentic OS 位址的地方：port 參數 > `CAROUSELS_PORT`，`host` 固定 `127.0.0.1`，carousels/features/assets/exporter 路徑與 1 MB body 上限。學習點：把環境差異集中在一個 block，複製一份就能改 port。
- `#L69-L98` — `server.mjs` — carousel 探索與摘要：`runs()` 跳過 `_`/`.` 開頭且要求 `deck.js` + `index.html`；`readReview` 補空殼；`statusOf` 只接受四個狀態與 http(s) URL；`summary` 合併 manifest、keyword（含 caption 反推）、review、建立時間、`updated` 與 `stale`（deck 比 manifest 新）。學習點：server 不解讀 deck，只信 exporter 產出的 manifest。
- `#L100-L151` — `server.mjs` — 快照工作與檔案安全：每個 slug 同時只跑一個 exporter job，失敗時保留最後 2 行錯誤；`inside()` 用 `path.resolve` + 資料夾邊界前綴擋 traversal；`body()` 邊讀邊計量，超過 1 MB 回 413 並排空；`page()` 把可選 token 注入頁面。學習點：路徑與 body 的邊界要在進入路由前處理。
- `#L153-L220` — `server.mjs` — 路由層：Host 只接受 localhost/127.0.0.1；`/api/` 檢查 Origin 同源同 port、`x-rubric-token`、PUT/POST 必須 JSON；`/api/carousels` 回摘要；`/api/home-order` 用 atomic write；`/c/<slug>/...` 只服務該 carousel；`/api/review` 的 PUT 以 version 比對，舊版本回 409；`/api/export` 啟動或查詢 job。學習點：一個 60 行的路由表就表達了整個 app 的權限模型。
- `#L170-L196` — `index.html` — review 存檔：`saveReview` 300ms debounce、同一 carousel 一次只有一個 inflight 請求、409 時把伺服器版本套回並重繪，回傳的 promise 讓 Apply 可以在標記 applied 後才重載。學習點：兩個分頁同時編輯時，用版本號而不是 last-write-wins。
- `#L198-L240` — `index.html` — 列與卡：`render()` 產生每則 carousel 的 header（cards/videos/comments/approved/cover/stale）、封面選擇列與橫向 strip；`tile()` 產生縮圖、影片預覽層、cover/num badge、Full view 與 +Cart 按鈕，並把 `{id,title,lines}` 塞進購物車 item。學習點：cart 的資料在 DOM 產生時就決定，之後不再回頭查。
- `#L242-L316` — `index.html` — 影片預覽與 full view：IntersectionObserver 只讓可見卡播放、`setPreview` 同步 localStorage 與大圖；`openView` 用 iframe 載入 `index.html?solo=N`，側欄提供 Approve、封面選擇、整卡筆記與釘點列表；`approve`/`step` 改 review 或換卡。學習點：大圖不是重新實作卡片，而是重用引擎的 solo 模式。
- `#L318-L389` — `index.html` — 給 agent 的匯出與事件：`carouselHead` 組出標題、資料夾、review 路徑、封面、已核准卡與新順序；`carouselText` 再接留言；事件委派處理開圖、選封面、Copy/Export、核准、拖曳排序；`runExport` POST 後每 2 秒輪詢 job。學習點：匯出文字是 agent 的介面，格式比 UI 更重要。
- `#L391-L442` — `index.html` — 四個 feature 的接線：`RoboCart.init` 用 `enrich` 在複製時補上該卡/carousel 的即時留言；`RoboComments.init` 的 `store.load/save` 把留言拆回各 carousel 的 `review.json`；`RoboApply.init` 傳入 `file`（單則 deck 或 carousels 資料夾）與 `notes`（只改 carousel、不改 app）；`load()` 首次抓 info 與清單。學習點：通用 feature 透過 store adapter 接上領域資料。
- `#L116-L162` — `home.html` — 首頁狀態與卡片：`STATE` 對照四種 Instagram 狀態、`stateLine` 決定 live/scheduled 是否顯示時間、`card()` 產生封面、cards/videos/keyword、open comments 與 approved 數、Instagram/Storyboard 連結；沒有 manifest 時顯示「No snapshots yet」。學習點：首頁只做總覽，不承擔編輯。
- `#L164-L248` — `home.html` — 排序、hover 翻卡與拖曳：`sorted()` 支援 My order/Last edited/Created；hover 依滑鼠 x 位置換 `thumb` 並預載；拖曳時即時插入最近的卡，放開後把可見順序接上被 filter 掉的 slug，再 `PUT /api/home-order`。學習點：拖曳排序要處理「畫面只顯示部分項目」的缺口。
- `#L232-L309` — `template/index.html` — 繪圖層：W/H 540×675、`C` 調色盤、`HEX`、`AGENTS` sprite、`GLYPH` 像素字、`box/circ/ln/poly/win/sh*/lg/rgr/pxText` 與 `REAL_BOX`，最後把 `DECK.scenes` 疊在 `blank`/`real` 上。學習點：deck 作者只用這組 helper 就能畫卡，引擎不需 per-topic 分支。
- `#L311-L392` — `template/index.html` — 兩種渲染器：`quant32` 用亮度 + 4×4 Bayer dither 把畫布壓成 32-bit 色盤，`renderPixel` 取樣後輸出像素格，`renderDots` 把亮度變成半徑不一的點陣，`drawSprites` 另外畫 sprite 與影子；暗卡會翻轉 ink/cream。學習點：同一張 canvas 可以低成本產生兩種視覺風格。
- `#L394-L502` — `template/index.html` — 卡片狀態與元素：URL 的 `style/items/theme/cover/solo/still` 決定狀態，`isGen/isReal/darkOf/kindOf` 推導卡片類型；`baseCard/titleHTML` 建 DOM，`setMedia` 放圖片或影片到 `realBox`，`draw` 呼叫 scene 後渲染，`refresh` 套用所有狀態，`fitTitles` 用 `cqw` 自動縮小過長封面標題。學習點：封面與內頁的差異只是 class 與少量規則。
- `#L504-L587` — `template/index.html` — 組裝與 solo 模式：`build()` 建手機 mock、storyboard、封面選項、dots 與控制列；`applyState` 重繪全部卡；`go/syncIndex/tick` 處理滑動、計數與動畫 fps；`buildSolo(i)` 清空 body、只留一張卡、設 `data-ready="1"` 給 exporter 與 app 大圖。學習點：快照器不需要模擬點擊，直接開單卡頁即可。
- `#L5-L70` — `template/deck.js` — starter deck 的完整註解：所有 card 欄位（cover/num/name/h/p/scene/style/dark/kind/anim/imgs/labels/item/realClip…）、scene 的 `(t, api)` 契約與 helper 清單；示範 `spark`、`stack`、`wave` 三個 scene。學習點：這是新 carousel 唯一需要改的檔。
- `#L1-L20` — `features/agent-cart.js` — 購物車契約：`RoboCart.init` 選項（mount、hotkey、enrich）、`data-cart-add`/`data-cart-item` 標記、item 形狀 `{id,title,lines,note}`，以及輸出格式「N picks, in my order」＋每項的 From/備註。學習點：cart 是為 agent 設計的文字介面，不是購物 UI。
- `#L155-L196` — `features/agent-cart.js` — `text()` 依序輸出 header、intro、每項 title、`lines`、`enrich` 即時補的欄位與 `My note`；`copy/download` 提供剪貼簿與 `.md` 兩條路；公開 API 有 add/remove/toggle/has/items/clear/open/close/text/copy/refresh。學習點：`enrich` 讓 cart 在複製當下才抓最新留言，避免過期資料。
- `#L1-L25` — `features/click-comment.js` — 留言契約：任何 `[data-comment-id]` 都能當目標，`always:true` 讓每次點擊都開留言框；comment 形狀含 `target/label/x/y/text/created/status/appliedNote`，`x/y=null` 代表整張卡的筆記；`applied` 的 pin 變綠並排除在匯出外。學習點：座標以百分比儲存，縮圖與大圖可共用同一份留言。
- `#L72-L93` — `features/click-comment.js` — 儲存層：`saveNow` 若有 `cfg.store.save` 就交給外部（本 app 寫回 review.json），否則存 localStorage；`persist` 250ms debounce；`markApplied` 一次寫入 `status/appliedAt/appliedNote` 並立刻儲存，因為 Apply 成功後頁面會重載。學習點：把持久化抽成 adapter，同一個 feature 就能同時服務檔案型與 localStorage 型 app。
- `#L146-L245` — `features/click-comment.js` — 互動與匯出：`newBox/editBox` 定位留言框、Enter 儲存、Esc 取消；`render` 重畫所有 pin（小卡用 `small`）；`text()` 只輸出未 applied 的留言，釘點寫「pin at X% across, Y% down」，整卡筆記寫「Note:」。學習點：留言的「已套用」狀態同時影響畫面、計數與 agent 匯出。
- `#L82-L136` — `features/sidebar-nav.js` — 導覽核心：`IntersectionObserver` 以 `intersectionRatio` 選出目前章節，點擊後保留 active 避免短頁面跳動；`render` 產生編號列、sub line、橘色 badge 與展開的子項；`go/goChild` 平滑捲動並 flash；`open` 記住開關狀態。學習點：sidebar 是對 DOM 的漸進增強，不需要頁面配合路由。
- `#L84-L105` — `features/apply-comments.js` — Apply 的輸入：`openComments()` 收集 RoboComments（與 RoboHighlight）未 applied 的留言，`commentText` 串成文字，`handoffText` 加上「要改的檔案/資料夾」與「怎麼建置」的 notes。學習點：送往 agent 的內容同時包含變更意圖與檔案邊界。
- `#L167-L225` — `features/apply-comments.js` — 執行流程：POST `text/plain`（避免 preflight）到 Agentic OS 的 `/api/apply-comments`，帶 page/file/notes/title/comments/model/effort；成功後記住 job、輪詢 `/api/run-status`，完成時把送出的留言 `markApplied` 再重載；若 fetch 失敗則複製 handoff 文字。學習點：外部 agent 不可用時，功能要優雅降級成「複製給你的 agent」。
- `#L240-L312` — `features/apply-comments.js` — dock 與初始化：`adopt()` 把 Comments/Cart 按鈕收進右下角同一列，Apply 保持角落；`init` 預設 `api=http://localhost:50000`、`hotkey=a`、key 依 pathname 區分，並在重載後用 localStorage 找回進行中的 run。學習點：UI 的按鈕所有權與執行狀態都要能跨重載延續。
- `#L1-L99` — `tools/export-cards.mjs` — 快照器：先找 `playwright` 再找 `playwright-core`（可用已安裝 Chrome/Edge），用 `new Function('window', deck.js)` 讀 `window.DECK`，逐卡開 `solo=i&still=1` 截圖，`--thumbs-only` 跳過大圖；最後寫 `manifest.json`，內含 card 檔名、thumb、cover 縮圖、`media`（影片預覽框百分比）與 `exportedAt`。學習點：快照格式由 exporter 決定，app 只讀 manifest。
- `#L1-L56` — `tools/check.mjs` — 唯讀格式檢查：slug 規則、`index.html` 是否含 `ENGINE:` 標記、deck.js 能否載入、cards ≤ 10、正好一張 cover、scene 名稱存在、每卡有 name/h、封面圖與 media 檔案存在、manifest 卡數與檔案對齊、deck 是否比快照新、review.json 與 status.json 合法。學習點：把「資料夾格式」變成可重跑的 PASS/WARN/FAIL。
- `#L3-L103` — `carousels/tidy-desk/deck.js` — 範例 deck：`page/lede/handle/keyword/caption/coverDefault/covers`，七張卡（cover、五個 tips、save card）與 `desk/tray/cables/pens/clock/notes/save` 七個 scene；`save` scene 用 `t` 與 `api.sprite` 示範動畫與 sprite。學習點：一個真實 carousel 的完整內容可以只有一個 104 行的檔。
- `#L1-L121` — `carousels/tidy-desk/export/manifest.json` — app 讀的快照索引：`title/lede/caption/keyword`、`coverKey/coverIndex`、`covers[]`（drawn、sun）、`cards[]`（i/num/name/title/cover/dark/kind/style/clip/media/file/thumb）與 `exportedAt`。學習點：manifest 是 deck 的扁平化投影，card index 就是 review 的 target 編號。
- `#L1-L7` — `carousels/tidy-desk/review.json` — 審查檔的起始形狀：`version:0`、`cover:null`、`order:null`、`approved:{}`、`comments:[]`。學習點：app 第一次存檔會把 version 加到 1，之後所有寫入都靠這個號碼偵測衝突。
- `#L1-L3` — `carousels/tidy-desk/status.json` — 最小狀態檔 `{"status":"draft"}`；狀態只影響首頁顯示，沒有任何發文副作用。學習點：把「流程狀態」與「平台動作」分開，工具就不會偷偷替使用者發布。
- `#L1-L14` — `env.example` — 四個可選設定：`CAROUSELS_PORT`、`CAROUSELS_DIR`、`CAROUSELS_OS_ADDRESS`、`RUBRIC_TOKEN`，並註明真實環境變數優先於 `env.local`。學習點：所有可調參數都有預設值，不設定也能跑。
