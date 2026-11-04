---
source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e
source_type: codebase
source_lines: 3679
language: TypeScript
file_count: 14
part: 1
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- `src/loop.mjs` — 整條驗證流程的心臟：快照 → 壓縮成「合法動作」候選 → 決策模型選一個 → 執行動作 → 由程式碼在每個快照上檢查斷言。它把「LLM 只做局部選擇、文字全部來自 spec、成敗由程式判定」寫成可執行的紀律，並用 outcome 分類（`DONE_VERIFIED`、`ABSENT_SEEN`、`MODEL_BLOCKED`、`LOOP`、`WEAK_ASSERTION` 等）把失敗原因變成可診斷的訊號。
- `src/snapshot.js` — 瀏覽器內的頁面快照器：走訪 light DOM、open shadow root 與同源 iframe，為每個可互動元素產生 role、accessible name、狀態與 `data-jev-node` 戳記，並辨識 popup、modal、hover/drag、native `<select>` 選項。它是「頁面有哪些合法動作」這件事的單一事實來源。
- `src/seen-text.js` — 「使用者實際看得到的文字」擷取器：排除隱藏、aria-hidden、透明、被裁切與表單控制值，處理 shadow slot 與 CSS `text-transform`。`expect` 用它而不是 `innerText`，避免選單選項或隱藏元素造成假通過。
- `src/secret.mjs` — 機密值判定與清洗：以 key/label 判斷 secret，區分強密碼與弱密碼（強弱決定能否模糊清洗），把值換成 `<password>` 之類的佔位符。目標是讓憑證永遠不進模型、trace 或產生的 spec。
- `src/redact.mjs` — 宣告式遮蔽：spec 可用 CSS selector 或 RegExp 指定「模型絕不能看到的頁面內容」，在建立 label、criterion、trace 之前就從來源切除。與 secret 清洗互補：一個管測試輸入，一個管頁面機密。
- `src/discover.mjs` — 不用模型的爬蟲：走訪頁面、記錄 links/forms/options，full 模式會送表單以發現結果頁，safe 模式只開選單不送出；輸出 `quicke2e.map.json` 供後續路由與 agent 理解 app。
- `src/discover-pattern.mjs` — URL 正規化：把數字、UUID、長混合 slug 換成 `:id`，讓同一種頁面收斂成一個 pattern，是地圖去重與路由的基礎。
- `src/route.mjs` — 地圖路由：先讓模型從地圖挑目標頁，必要時再挑具體實例，接著由程式用 BFS 找最短路徑並以 role+label 點擊前進。展示「模型只做語意選擇、導航由程式執行」的分工。
- `src/locate.mjs` — 產生 spec 前在活頁面上驗證 locator：候選依 role/name、容器 scoped、label/placeholder/testid、nth 依序嘗試，只有唯一命中且命中的就是即將操作的元素才採用。避免從 trace 猜 locator 造成重播失敗。
- `bin/quicke2e.mjs` — CLI：`discover`、`run`、`check` 三個命令；嚴格驗證 spec 欄位、啟動前檢查 engine key、執行 `WEAK_ASSERTION`/`ABSENT_ON_START` 前置檢查、輸出人類可讀與 `--json` 結果、彙總 exit code（0 全過、1 app/spec 失敗、2 用法或 key 錯、3 只有 engine 失敗）。
- `codegen/codegen.mjs` — 把「通過的探索紀錄」轉成純 Playwright spec：只用 getByRole/getByLabel/getByText，文字引用 `INPUTS` 或環境變數（secret 不落盤），斷言 1:1 對應原 flow，並附 sidecar 供日後重新探索。這是把昂貴的模型探索攤提成 CI 可重播資產的關鍵。
- `codegen/verify-locators.mjs` — 重播一次通過的 trace，逐步量測 exact/loose/text 哪個策略恰好命中一個元素，把結果折回 steps，讓 codegen 不再靠 `via` 猜 locator。
- `codegen/replay-or-heal.mjs` — drift 的處理準則：先重播 deterministic spec；失敗就用原始 goal 重新探索、重新產生並印出 locator diff；重探索也失敗才判定為真回歸。它誠實標示 Linux CI 沒有本地模型時只能重播與失敗。
- `skill/quicke2e/SKILL.md` — 給 coding agent 的操作手冊：先 discover 建地圖、讀原始碼找業務規則、依 happy/boundary/refusal/attack 四類發明案例、寫 goal+deterministic assertion 的 spec、跑完後依 outcome 判斷是 app bug 還是工具問題。

# L2 detail

- `#L1-L47` — `src/loop.mjs` — 全域常數與頁面指紋：`MIN_CONFIDENCE`（低於此的信心不執行）、`LOOP_LIMIT`、`MAX_FREE_WAITS`、`SLOW_MS`，以及 `neverMatcher`（大小寫無關的 glob/RegExp，會先移除 zero-width 字元）與 `pageSig`（URL + 所有動作 label/state 的滾動雜湊，用於偵測原地打轉）。
- `#L49-L75` — `src/loop.mjs` — engine 請求層：`RULES` 定義模型只看「這頁哪個操作能推進目標」；`withTimeout` 與 `post` 對 429/5xx/timeout 做指數退避重試，並把錯誤標記 `engine: true`，讓 engine 故障不會被誤報成 app 故障。
- `#L77-L317` — `src/loop.mjs` — `compact()`：把快照壓成模型可選的候選集。包含 spec key 與 label 的比對（精確 > 全詞 > 子字串，角色可補位）、只提供 spec 有值的欄位、抑制對純文字框的 CLICK、偵測 native select 與 autocomplete、hold back 尚未填完的表單 submit、`neverClick` 過濾、goal token 加權、`PRIORITY` 排序、`LETTER_CEILING` 截斷，以及 `render()` 讓同一批候選可被切成多輪（tournament）而不改變語意。
- `#L319-L378` — `src/loop.mjs` — 決策介面：`decisionState` 組成模型看到的 state（URL pattern、title、elements、values、最近 history），`decide`/`choose` 支援 `jev`、`vercel`、`local` 三種 engine，回傳統一格式的 choice/confidence/cost/truncated；模型回傳不在我們 criteria 裡的值時，呼叫端一律視為 BLOCKED。
- `#L380-L416` — `src/loop.mjs` — spec 值解析：`specValue`/`specKey` 確保輸入文字只來自 spec；`resolveKeys` 在 label 與 key 對不上時，讓模型從「未使用的 spec keys」中挑一個（或 NONE），但仍不讓模型生成文字，並排除 number/date/file 等不該塞自由文字的欄位。
- `#L418-L477` — `src/loop.mjs` — 等待與穩定：`norm` 是兩側共用的空白正規化；`READY` 判斷頁面是否已有控制項；`trackNetwork` 等 fetch/XHR 歸零；`settle` 等 DOM 安靜與動畫結束，避免抓到半渲染的表單而讓模型看到不同選項。
- `#L479-L608` — `src/loop.mjs` — 斷言層：`stateOk` 比對 `{role,name,value,checked,selected,expanded}`；`SEEN_RECORDER` 在頁面生命週期內記錄曾出現的可見文字（給 toast 類 `expectSeen`）；`absentSeen`/`explainGoal`/`checkGoal` 實作 `expectUrl`、`expect`、`expectSeen`、`expectAbsent`、`expectGone`、`expectState`，並在失敗時逐條回報哪個斷言沒成立。
- `#L610-L704` — `src/loop.mjs` — 動作執行：`byRole` 以 role/name 逐級解析（exact → 寬鬆 → text），且只接受唯一命中；`SET_SLIDER` 用方向鍵逼近 ARIA slider 值；`act`/`actOnce` 先找 `data-jev-node` 戳記，失敗再退回 role/text，處理 overlay、隱藏 checkbox 與 Escape 重試；`coverOf` 在點擊被遮住時讀出遮擋物的文字，讓失敗訊息能指名「cookie banner 擋住 Sign in」。
- `#L706-L934` — `src/loop.mjs` — `runOnce` 前半：啟動 browser/context、video 與 viewport、watchdog（頁面 script 卡死時關閉 context）、同源 5xx 攔截、auth 過期偵測（`AUTH_REQUIRED`）、map 路由（模型挑頁、程式走路徑）、`startCheck`（在第一個頁面載入內完成 WEAK_ASSERTION/ABSENT_ON_START，避免重複開頁）。
- `#L936-L1120` — `src/loop.mjs` — 主步驟迴圈：每步先 settle + snapshot、套用 redact、處理弱密碼回聲、檢查 `expectAbsent`/goal、必要时 `resolveKeys`、`compact`；候選過多時用 tournament 分組讓模型選、再從 winner 中決選；低信心動作（除了由 spec 指定的 TYPE_TEXT/SELECT）記為 BLOCKED；最後把 choice 解析成 op/target/action，並用 `pageSig` 與 (page, action) 配對偵測 LOOP。
- `#L1121-L1294` — `src/loop.mjs` — 動作分派與收尾：處理 CLOSE/DONE/BLOCKED 的語意（DONE 仍要 `checkGoal`，BLOCKED 只在頁面真的沒變時累計），TYPE_TEXT 含 file input 與 aria slider，SELECT 用 option label，HOVER/DRAG 用 Playwright 滑鼠，CLICK 有 neverClick 二次守衛、covered 判斷與 force fallback；最後以 `acted` 確保「沒有任何動作就不算 pass」（`WEAK_ASSERTION`）。
- `#L1296-L1409` — `src/loop.mjs` — 結果組裝：`explainGoal` 的逐條 assertions、`heldBack`/`loop`/`lowConfidence`/`failedActions`/`pageErrors`/`unkeyedFields`/`unmatchedOptions`/`networkErrors`/`emptyRequired` 等診斷欄位；對 finalUrl、step url、label、locator 做 secret 與 URL credential 清洗；把未被使用的 speculative 呼叫成本計入；匯出 `compact`、`choose`、`checkGoal`、`SNAPSHOT` 等供其他模組重用。
- `#L1-L56` — `src/snapshot.js` — 快照開頭與 `visible()`：處理 box 尺寸、opacity 0 的原生控制項、aria-hidden/hidden、`checkVisibility`、容器裁切與頁面座標，決定元素是否真的能被使用者操作。
- `#L57-L182` — `src/snapshot.js` — popup 偵測與 accessible name：辨識 body 層與 form 內的浮層、autocomplete listbox；`accName` 依 aria-label → aria-labelledby → label[for] → 包裹 label → input value → placeholder → 內容 → title → icon/位置/class 依序取名，並處理表格欄位標頭與鄰近說明文字。
- `#L184-L262` — `src/snapshot.js` — role 對照、可選元素清單與 form 歸屬：`roleOf` 把原生標籤映射到 ARIA role；`SEL` 列出要收集的控制項、pager、grid header/cell、contenteditable；`formOf`/`submits` 讓上層知道哪個按鈕會送出哪個表單。
- `#L263-L353` — `src/snapshot.js` — 動作收集：對每個可見元素產生 click/fill/select/state 動作，native `<select>` 每個 option 一個動作（避免被去重成 placeholder），隱藏 checkbox/radio 透過可見 label 代理，隱藏 file input 以鄰近文字命名，並把 popup 內的元素標成 popup。
- `#L355-L446` — `src/snapshot.js` — 補充動作與情境：hover（容器內有隱藏文字時）、drag（可拖來源與 drop zone 配對）、多選清單中已選 option 標記、同名按鈕加上卡片上下文（例如「Add to cart · Sauce Labs Backpack」）、open modal 時把背景動作標為 inert，最後回傳 url/title/text/actions。
- `#L1-L39` — `src/discover.mjs` — 爬蟲定義與 `PAGEINFO`：`DESTRUCTIVE`/`LOGOUT`/`FIELD_ROLES`/`LOCAL` 等分類；在 SNAPSHOT 之後讀 headings、links 與 forms（含 submit 與 required），把頁面結構化成可存檔的地圖節點。
- `#L41-L64` — `src/discover.mjs` — `defaultFor` 與 `snap`：full crawl 送表單時採固定、明顯假造的預設值（email、電話、數量、日期等），避免模型參與；`snap` 會 settle、取快照並套用 redact，確保寫到磁碟的地圖也不含宣告的機密。
- `#L66-L131` — `src/discover.mjs` — crawl 主體：非 localhost 的 full crawl 需 `allowRemote`；以 `pattern` 收斂頁面、`perPattern` 限制同型頁數量、`maxPages` 控制規模；redirect 會記成 edge 並重新入列，第一份同型頁才做 forms/probes。
- `#L132-L201` — `src/discover.mjs` — 連結、表單、combobox 與 probe：link 直接由 href 建 edge；safe 模式用文字與 URL 的破壞性動詞擋 GET 變更；表單記錄 fields/options/submit；combobox 開一次讀選項再 Escape；probe 只點非 link、非表單內的控制項，觀察是否導航或揭露新元素。
- `#L203-L254` — `src/discover.mjs` — full 模式送表單與輸出：用 spec inputs 或 `defaultFor` 填值、選第一個合理 option、按 submit，記錄導航結果或停留訊息；最後移除 node 暫存欄位，對整份 map 做 secret scrub 後回傳 `{version, base, pages, edges, ...}`。
- `#L1-L8` — `src/discover-pattern.mjs` — `pattern()`：把純數字、UUID 形式、12+ hex、16+ 字元且混合字母數字的 segment 換成 `:id`，其餘保留；這是頁面等價判斷與 route 目標選擇的基礎。
- `#L1-L30` — `src/route.mjs` — `describe`/`prefilter`：把每個頁面的 pattern、標題、表單與欄位壓成模型可讀的一行；頁面超過 48 個時用 goal 詞彙做廉價排序，避免超過 letter ceiling。
- `#L32-L59` — `src/route.mjs` — `pickTarget`：模型在 `STAY` 與 `PAGE:i` 間做 typed choice；若目標 pattern 含 `:id`，再用第二個 typed choice 從「連到該 pattern 的 link label」挑具體實例；起點 pattern 本身一律 STAY，避免把 `/orders/281` 路由到別人的 `/orders/301`。
- `#L61-L104` — `src/route.mjs` — `findRoute`/`walk`：對地圖 edges 做 BFS（submit edge 不拿來導航），再以 role+label 逐跳點擊；每跳只接受唯一匹配，neverClick 也套用，失敗就停止並回報 hops。
- `#L1-L44` — `src/locate.mjs` — 驗證式 locator 的概念與工具：從 `ariaSnapshot` 解析 role/name、處理價格後綴（只匹配穩定前綴）、用 `uniqueAndSame` 確認候選 locator 恰好命中同一個 element handle；註解本身記錄了「3/7、3/9 重播率」的實測動機。
- `#L46-L95` — `src/locate.mjs` — `verifiedLocator`：依序嘗試 role、容器 scoped role、label/placeholder/testid、無名 role、nth 位置，回傳可直接放進 spec 的 `page.*` 程式碼與策略名稱；找不到唯一且相同的元素就回 null，讓 codegen 知道這個步驟沒有可靠 locator。
- `#L1-L24` — `src/secret.mjs` — 機密樣式與強弱判定：`SECRET_SRC` 涵蓋 password/token/api key/card/OTP 等；`NOT_SECRET` 排除「name on card」這類非機密；`isStrong` 以長度、字元類別與長數字判斷能否安全地模糊清洗。
- `#L26-L59` — `src/secret.mjs` — 清洗 pattern 生成：對每個 secret 值產生整值、URL-encoded、form-encoded 與「字元間可插入分隔符」的 regex；強密碼加 8 字元前綴與卡號末四碼的遮蔽形式；弱密碼只在 spec 文字或已觀測到回聲時才清洗，避免把頁面上的「Password」「Admin」誤砍。
- `#L60-L97` — `src/secret.mjs` — 套用與 API：以 sentinel 避免替換字串被後續 pattern 二次匹配；`scrubText` 管頁面文字、`scrubSpecText` 管 goal 等 spec 文字、`scrub` 遞迴清洗整個 payload，`redactPatterns` 套用 spec 宣告的 RegExp。
- `#L1-L32` — `src/redact.mjs` — `textPatterns`：把 selector 抓到的文字轉成「字元間可有分隔符」的 regex；4 字元以下不追（避免「42」砍到價格），8 字元以上且混合字母數字時用子字串匹配，其餘用詞邊界。
- `#L34-L67` — `src/redact.mjs` — `buildRedactor`：在 document、open shadow root、同源 iframe 中找 selector 命中的元素，收集其文字與 `data-jev-node`，回傳 `{active, cut, url, isInside}`；selector 與 RegExp 分別處理元素文字與 URL。
- `#L69-L89` — `src/redact.mjs` — `redactSnapshot`/`parseRedactArg`：就地改寫快照的 title/text/action label/value，命中 selector 的元素直接改名為 `<redacted>`；CLI 的 `--redact` 以 `/pattern/flags` 解析成 RegExp，其餘視為 CSS selector。
- `#L1-L11` — `src/seen-text.js` — 檔案目的與注入方式：說明為何不用 `innerText`（關閉的 select 會貢獻所有 option、讀不到輸入值、進不了 shadow root/iframe），並定義要跳過的標籤集合。
- `#L12-L57` — `src/seen-text.js` — 可見性與行內排版：`shown` 排除 aria-hidden/hidden、opacity 0、font-size 0、被裁切或移出頁面的 box，但保留 `display:contents`；`inline` 決定相鄰文字是否要加空格；`transform` 反映 CSS `text-transform`。
- `#L58-L114` — `src/seen-text.js` — 文字級可見性與 walk：用 Range 的 client rects 判斷每個文字節點是否真的落在所有 clipping 祖先與頁面內；處理 fixed 子樹、透明度、clip-path、iframe、shadow slot；表單控制項不貢獻文字（submit/button/reset 的 value 例外），最後回傳正規化後的字串。
- `#L1-L20` — `bin/quicke2e.mjs` — CLI 基礎：啟用 V8 compile cache、動態載入 loop、`hideCreds`/`cleanLine` 清掉 URL 憑證與終端控制字元，`die` 統一錯誤出口。
- `#L22-L107` — `bin/quicke2e.mjs` — 命令與旗標表：每個命令有固定 flags，未知旗標直接報錯並用 Levenshtein 建議最接近的選項；支援 `--x=y`、重複旗標、`--help`、headed/headless 判斷。
- `#L108-L261` — `bin/quicke2e.mjs` — spec 驗證與前置檢查：`FIELDS` 白名單與 `specProblems` 檢查型別、未知欄位、`expectUrl` regex、`expectState` 布林、缺斷言等；`loadFlows` 載入 spec、解析 storageState、處理 `--only` 與重名；`preflightEngine` 在跑之前確認 key 與 local engine；`weak` 檢查斷言是否在起點就成立；`why` 把 record 轉成人類可讀的失敗原因。
- `#L263-L417` — `bin/quicke2e.mjs` — 三個命令的實作：`discover` 呼叫爬蟲、處理輸入/redact、0 頁時報 UNREACHABLE；`run`/`check` 逐 flow 做 weak/start check、`runOnce`、印 PASS/FAIL 與原因、`--emit` 呼叫 codegen 並提示環境變數、最後彙總成本與 exit code（3 代表只有 engine 失敗，CI 可重試）。
- `#L1-L46` — `codegen/codegen.mjs` — 設計原則與 `classify`：說明為何要產生 Playwright spec（本地模型 Apple Silicon 限定、CI 只能重播）；可機械丟棄的是 WAIT、DONE/BLOCKED、stale、noSpecValue、無 label 的步驟；重複的 CLICK 只標記為候選，交由重播驗證是否可刪。
- `#L47-L125` — `codegen/codegen.mjs` — locator 產生：`STRATEGY` 與 `strategyFor` 決定 exact/loose/text，`locator()` 優先使用執行期已驗證的 `s.locator.code`，其次處理含 secret 的 label（只匹配前綴）、價格後綴、exact/loose role 與 text fallback；註解說明為何 getByRole 優先於 getByLabel。
- `#L127-L196` — `codegen/codegen.mjs` — 動作與斷言：`actionLine` 把 CLOSE/TYPE_TEXT/SELECT/HOVER/DRAG/PRESS_ENTER/CLICK 轉成 Playwright 呼叫，secret key 以 `INPUTS.key` 或環境變數取值；`assertions` 1:1 映射 `expectUrl`、`expect`、`expectSeen`、`expectGone`、`expectAbsent`、`expectState`，並沿用執行期的 `seen-text` 與 timeout 量測。
- `#L199-L310` — `codegen/codegen.mjs` — `generate()`：只接受 passed run；輸出檔頭、`BASE`、`INPUTS`（secret 無預設值）、storageState、dialog handler、server error 收集、路由 hops，逐步輸出動作並在 URL 改變時加 `toHaveURL`；最後用探索時量到的最後一段時間決定斷言 timeout，並產生 sidecar（含 goal、斷言、locator 清單）供重新探索。
- `#L1-L22` — `codegen/verify-locators.mjs` — 動機：`via` 在 99.5% 的步驟都是 `node`，因此 trace 對 role locator 幾乎沒有證據；codegen 可以免費重跑，所以應該實際量測而不是猜。
- `#L24-L77` — `codegen/verify-locators.mjs` — `verifyLocators`/`applyStrategies`：重播流程，逐步計算 exact/loose/text 的命中數與 `ambiguous`，選最嚴格且唯一命中的策略並實際操作以推進頁面；`applyStrategies` 把量測結果寫回 steps 的 `locatorStrategy`。
- `#L1-L31` — `codegen/replay-or-heal.mjs` — 核心論證：accessible-name spec 遇到 rename 不會自動存活，fallback chain 只會帶來偶然救援與 `.first()` 綁錯控制項的風險；因此策略不是讓單一 spec 抵抗 drift，而是讓 drift 的恢復變便宜。
- `#L33-L93` — `codegen/replay-or-heal.mjs` — `replayOrHeal` 與 diff：先 `npx playwright test` 重播；失敗且有 `canHeal` 時讀 sidecar、刪除會覆蓋 base 的 `flow.base`、用原 goal 重新 `runOnce`；成功則重新 generate、寫回 spec/sidecar、印出位置對齊的 locator diff（`~` 代表 rename），再重播一次確認；重探索失敗則判定 `FAIL_REAL_REGRESSION`。
- `#L1-L12` — `skill/quicke2e/SKILL.md` — 分工宣言：大模型負責發明案例與寫 spec（離線一次）、Jev 負責在工具提供的選項中選動作（便宜、可重複）、程式碼負責判定成敗；三者不可混用。
- `#L13-L45` — `skill/quicke2e/SKILL.md` — 地圖與登入：先 `discover` 建 map，localhost 預設 full crawl、其他主機用 safe 或 `--i-own-this-data`；登入用 `storageState` 保存 session，每個角色一份，reset 後要重跑 login；提醒 cookie banner 與 sessionStorage 的限制。
- `#L47-L80` — `skill/quicke2e/SKILL.md` — 讀規則與發明案例：從 domain logic、validation schema、route handler、seed data、README 找出 `rule — file:line`；案例分 happy/boundary/refusal/attack，attack 要涵蓋濫用值、折扣碼濫用、他人資源 URL、crafted URL、已結束活動、重送流程、必填留空；每個 attack 同時斷言「拒絕文字」與「成功狀態不存在」，並標 `kind: "attack"`。
- `#L82-L162` — `skill/quicke2e/SKILL.md` — 寫 spec、檢查、報告：spec 欄位與斷言規則（斷言最後動作後的狀態、用 `expectState` 檢查控制項、delete 用 `expectGone`、refusal 用 `neverClick`、load attack 用 `control`）；`check` 先擋 WEAK_ASSERTION；執行後依 outcome 判斷 app bug 或工具問題，never edit spec to make it pass，最後可 `--emit` 產生 CI 用的 Playwright spec。
