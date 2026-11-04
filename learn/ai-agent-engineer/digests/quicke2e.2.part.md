---
source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e
source_type: codebase
source_lines: 5000
language: Python
file_count: 147
part: 2
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- `local-engine/` — 本地決策引擎。`server.py` 把頁面狀態、目標與候選操作組成一個結構化 prompt，只讀選項標籤下一個 token 的 logits，再對 offered options 做 softmax；它不能生成文字，也不能回傳沒被提供的選項。`test_server.py` 是不需下載模型的 prompt/readout 單元測試。學習者從這裡看懂「agent 的決策其實是有限選項分類」。
- `bench/` — 一場可重現的 page-representation bake-off。`lib/core.mjs` 是參數化的 `runOnce`，把 snapshot 與 action resolution 抽換掉；`approaches/` 放 A、A+、B、C 與 G 變體；`run-matrix.mjs` 跑 approach × stack × task × trial；`report.mjs` 出表；`snap-bench.mjs` 單獨量 snapshot 成本。重點不是哪個模型聰明，而是同一顆模型換了「頁面表示法」後成功率如何改變。
- `bench/stacks/` — 8 個測試床：vanilla、MUI、antd、Radix、Vue + Element Plus、Web Components（Shoelace/Lit）、same-origin iframe、legacy。`serve.mjs` 固定埠 5101–5108，`build.sh` 一次建好。它讓「元件庫與 DOM 結構」成為可控制的變因。
- `examples/` — 真實 app 的 e2e 範例。`ticketbay/flows.mjs` 是四條金流（折扣碼購票、退費成功、活動後退費被拒、plain checkout），`attacks.mjs` 是惡意使用者規格，`precheck.mjs` 證明每個斷言在起始頁為 false；`fixtures.spec.mjs` 是零外部 app 的入門 spec。
- `fixtures/` — 73 個手工 HTML，一個頁面至少對應一個「現場量到的缺陷」。`flows.mjs` 定義 fixture、期望與 grader；`serve.mjs` 注入 `data-truth` 記錄；`run.mjs` 跑回歸；`proxy.mjs` 攔截送給引擎的完整 payload。它是全 repo 最誠實的測試資產：不只知道「有沒有過」，還知道「有沒有打到正確元素」。
- `test/` — 無模型測試。`core.test.mjs` 覆蓋 snapshot、security、redact、codegen、CLI、attack 與 v0.3–v0.5 的 regression；`route.test.mjs` 用 stub engine 測 `--map` 路由。CI 在 Linux、沒有本地模型也能跑。
- `docs/bakeoff-2026-09-24.md` — 完整實驗報告：排名標準、8×3×5 矩陣、每個失敗的 step path、兩個關鍵 finding、proposed diff、成本與多次 re-run。最終結論是 ship A+G：120/120、median 約 1.8 秒、$0.000112/run、run loop 內沒有 LLM。

# L2 detail

- `#L1-L56` — `local-engine/README.md` — 兩個開源決策模型（Eikos-4B 預設、Shisa DE-1 快速）的記憶體、速度、fixture 成績與成本對照；也說明 prompt 形狀（system + 一個 JSON：evidence / criterion / lettered options）與 SemIf 出處。
- `#L1-L58` — `local-engine/server.py` — wire contract（`POST /` 收 state 與 `questions.action.criteria`）、`PROFILES`（MLX 與 llama.cpp 兩種 backend）、`SYSTEM`、`META`（WAIT/BLOCKED/NONE 的語意）與 A–Z/AA 標籤表；這是「模型只能從 offered set 選」的起點。
- `#L60-L110` — `local-engine/server.py` — `evidence()` 把頁面壓成短字串、`option_texts()` 組 criterion、`messages()` 產生訓練時的同型 prompt；`distribution()` 在選項超過 label 上限時分組、取每組前幾名進決賽，`softmax()` 把 logits 變成機率。理解長選項清單如何仍能做全局比較。
- `#L112-L193` — `local-engine/server.py` — `MLXBackend` 只取最後一個 token 上各 label 的 logits；`LlamaCppBackend` 啟動 llama-server、呼叫 `/apply-template` 與 `/completion`，從 `top_logprobs` 取標籤分數。兩者都把「讀 logits」收斂成 `read(msgs, labels)`，讓上層與模型無關。
- `#L196-L261` — `local-engine/server.py` — `decide()` 把 criteria 轉成 options、呼叫 `distribution()`、回傳 choice/confidence/probabilities；`H` 是單執行緒 HTTP handler；warmup 先跑一次，`GET /` 回報模型、尖峰記憶體與已服務決策數；SIGTERM/SIGINT 會清掉 llama-server，避免佔住 ~15 GB。
- `#L1-L60` — `local-engine/test_server.py` — 不需模型的測試：label 順序（A–Z 後 AA）、evidence 只保留頁面事實、messages 的 trained shape、meta option fallback，以及「20 個選項一次讀完、60 個選項分成 3 組加決賽」且機率總和為 1。
- `#L1-L4` — `local-engine/requirements.txt` — MLX 與 mlx-lm 版本鎖定；本地引擎只支援 Apple Silicon。
- `#L1-L43` — `bench/lib/core.mjs` — bake-off harness 的開頭：`httpStats` 與 `post()` 的 429/5xx 指數退避、`PRIORITY`（textbox/password/combobox 先於 button/tab/checkbox）、`keyFor`/`hasSpec` 的 label 子字串比對、`LETTER_CEILING = 52`。這些是 `src/loop.mjs` 共同層的參數化副本。
- `#L45-L105` — `bench/lib/core.mjs` — `compact()`：把 snapshot 的 action 去重成「一個 node 一組 ops」、依 goal 把 label token 全中的候選 rank 設 -1（`goalKeep`）、按 PRIORITY 排序、套 budget 與 letter ceiling、`selectFix` 時把 native `<select>` 的 placeholder 與已選值移除，並把選中狀態以不可選的 `combobox` 元素補回。這是整場實驗最關鍵的 shared layer。
- `#L107-L185` — `bench/lib/core.mjs` — `decide()` 的 wire shape（state + questions.action，jev 走 OpenRouter、local 走 `LOCAL_URL`）、`specValue`、`READY`、`settle()`（等 DOM 安靜與動畫結束）、`stateOk()` 與 `checkGoal()`（URL regex + 正規化文字 + expectState）。
- `#L187-L283` — `bench/lib/core.mjs` — `runFlow()` 主迴圈：snapshot、compact、decide、把 choice 解析成 op/target、TYPE_TEXT/CLICK/SELECT 執行、stale 處理、DONE/BLOCKED 重試、goal check、結果欄位；最後是 `actA`/`roleFallback`/`viaLabel` 的共用 action 解析鏈。
- `#L1-L18` — `bench/approaches/aplus-snapshot.js` — 八個編號改動的摘要：deep walk 進 open shadow root 與 same-origin iframe、root-scoped accname、per-document style、native `<select>` 每 option 一個 action、hidden checkbox 走可見 label、slot 文字、submit/button 命名、per-snapshot stamp generation。
- `#L20-L120` — `bench/approaches/aplus-snapshot.js` — `visible()`、popup 偵測、`flat()` 讀 slot 文字、`accName()`（aria-label → labelledby → label[for] → 包裹 label → input value → placeholder → 內容 → title → name/id）、`roleOf()` 與 `SEL` 清單。這裡解釋了為什麼 A+ 能看見 MUI/antd/Element Plus/Shoelace 的控制項。
- `#L122-L217` — `bench/approaches/aplus-snapshot.js` — TreeWalker 深走、stamp、對每個元素產生 fill/click/select/state action、native select 的 `selectNode/selectLabel/optionLabel`、hidden checkbox 的 label proxy、popup root 內額外 option、最後回傳 url/title/text/actions。
- `#L1-L11` — `bench/approaches/a.mjs` — baseline：直接 eval `src/snapshot.js`，action 用 `actA`；用來證明 harness 與 shipped `runOnce` 行為一致（A-h 與 A 逐格相同）。
- `#L1-L26` — `bench/approaches/aplus.mjs` — A+ 的 `actStamped`：先找 stamp 在哪個 frame，Playwright CSS 會穿 open shadow root；失敗再逐 frame 做 role fallback，checkbox/radio 走 `viaLabel`。
- `#L1-L93` — `bench/approaches/b-aria.mjs` — Playwright `ariaSnapshotJSON({mode:"ai"})` 轉 action 的規則：`ACTION_ROLES`、`ariaHidden` 子樹跳過、`generic[cursor=pointer]` 可點、native select 的 option 子節點、無 ref 的 checkbox 走 pointer 祖先、每個 textbox 一次 evaluate 補 input type 與 name；`actB` 用 `aria-ref=` 再退回 role chain。
- `#L1-L101` — `bench/approaches/c-cdp.mjs` — CDP `Accessibility.getFullAXTree` 逐 frame、DFS 排序、`prop()` 讀 disabled/checked/expanded、native select 的 option 映射、lazy act：只有被選中的 backendNodeId 才 `DOM.resolveNode` + stamp；也說明為什麼 antd 的 div option 在 AX tree 看不到。
- `#L1-L3` — `bench/approaches/aplus-g.mjs`、`b-g.mjs`、`c-g.mjs` — 三個 G 變體都只是 `{...base, goalKeep: true}`；G 不是新 representation，而是 `compact()` 裡的一行排名規則。
- `#L1-L20` — `bench/run-matrix.mjs` — 參數與 queue：approach/stack/task/trial、預設 `A,A-h,A+,B`、interleaved 順序（trial → stack → task → approach）讓 CPU 競爭平均分布、以 `approach|stack|task|trial` 續跑。
- `#L22-L70` — `bench/run-matrix.mjs` — 動態載入 approaches、pin/proposal/D/D2 的執行分支、A 的 429/5xx 重跑；以及每列輸出的欄位（pass、outcome、steps、wallMs、decideMs、snapMsMedian、cost、path）。`path` 把每步的 op/label/via/stale/rejected 串起來，是讀失敗原因的主要入口。
- `#L72-L89` — `bench/run-matrix.mjs` — 以 `CONC` 平行跑 queue、關閉 browser 與 servers、印出本次成本與 harness retry 次數。
- `#L1-L62` — `bench/headtohead.mjs` — Claude Code + Playwright MCP 與 quicke2e 的同一 TicketBay checkout 對照：共用 `reset.sh`、同一個 goal、同一條 SQL pass check（新 paid order、email/name/total）。`--arm claude` 用 `claude -p` 加 MCP config，`--arm jev` 用 `bin/quicke2e.mjs run`。
- `#L1-L42` — `bench/report.mjs` — 把 `matrix.jsonl` 聚合成 pass rate、T1+T2、passing 的 median steps/wall、snapshot median、總成本與 failure outcomes；最後印出每個 approach×stack×task 的失敗分類。
- `#L1-L17` — `bench/tasks.mjs` — 三個 canonical 任務。T1 登入；T2 建 Orion 專案、選最後一個 option Enterprise、勾 terms；T3 從 60 列中開第 57 列 Quentin Harlow。三個任務刻意壓在不同 representation 弱點上。
- `#L1-L29` — `bench/snap-bench.mjs` — 無模型、無併發的 snapshot 成本量測：每頁 warm-up 後量 20 次取 median，逐 stack × task 印出 action 數，最後給相對 A-h 的倍率。
- `#L1-L40` — `bench/demo-capture.mjs` — launch video 的參數與共用 pass check：兩個 arm 都用同一個 `book-with-code` 或 `buy-from-home`，可選 dark mode 與 viewport；`spreadCost()` 依 token 權重把總成本分攤到時間軸事件。
- `#L42-L80` — `bench/demo-capture.mjs` — `jevArm()`：跑 quicke2e 並取得影片、逐步事件、token 與成本；把 quicke2e 內部時鐘平移到 spawn clock，讓兩個 arm 可對齊。
- `#L82-L166` — `bench/demo-capture.mjs` — `claudeArm()`：自己啟動 Chromium 並開 CDP port，讓 Playwright MCP 連進來；解析 `claude --output-format stream-json` 的 tool_use/tool_result，補上 URL、程式碼與 token；最後關閉 context 取得影片。這解決了「MCP server 突然結束會吃掉影片最後幾秒」的問題。
- `#L1-L13` — `bench/demo-flows.mjs` — launch 任務：從首頁找 Midnight Arcade — Neon Tour、買 2 張、套 WELCOME10、€109.39，斷言 `?placed=1` 與 confirmation 文字。
- `#L1-L30` — `bench/verify-stacks.mjs` — 對每個 stack × task 先確認斷言在起始頁為 false，再用**手寫** Playwright solve（含 library-specific selector）確認可為 true；這是 24/24 的無模型 sanity check。
- `#L32-L64` — `bench/verify-stacks.mjs` — `SOLVE` 物件：T1 登入、T2 各 stack 的 plan 選法（antd/vue-ep/wc 走不同 selector）、T3 點 Quentin Harlow；逐格輸出 before/after 與錯誤。
- `#L1-L72` — `bench/stacks/serve.mjs` — 每個 stack 一個固定埠的靜態伺服器（5101–5108），未知路徑 fallback 到 `index.html`；`serveAll()` 回傳 `{bases, close}`，是 matrix 與 snap-bench 的共同入口。
- `#L1-L15` — `bench/stacks/shared/data.js` — 所有 stack 共用的 60 位 customer、`CUSTOMERS[56] = Quentin Harlow`、`PLANS`、`CREDS` 與 `successText()`；確保跨 stack 的資料與目標完全一致。
- `#L1-L8` — `bench/stacks/shared/router.js` — 無依賴的 pushState router：`nav()`、`onNav()`、`link()`；讓 SPA stack 有可測的導航但不引入 router 套件。
- `#L1-L8` — `bench/stacks/shared/useRoute.js` — React 的 `useRoute()` hook，訂閱 `router.js` 的 nav 事件並回傳 path/searchParams。
- `#L1-L42` — `bench/stacks/vanilla/app.js` — 純 HTML 的 login/home/form/success/customers 頁；native `<select>` 與 checkbox 是 T2 的關鍵，`/customers/:id` 用一般連結。
- `#L1-L44` — `bench/stacks/legacy/app.js` — layout table、裸 `<td>` label、`<input type=button>`、jQuery 風格；測 legacy 命名與不可操作結構。
- `#L1-L44` — `bench/stacks/iframe/app.js` — 表單與清單在 same-origin iframe 內，成功時導航 top window；測 snapshot/act 是否能進 frame。
- `#L1-L61` — `bench/stacks/mui/main.jsx` — MUI 版；checkbox 的真實 `<input>` 是 opacity:0，必須透過 label 操作；Select 走 MUI 的 combobox/listbox。
- `#L1-L53` — `bench/stacks/antd/main.jsx` — antd 版；`Select` 的可見 option 是 div，AX tree 的 `role=option` 是 0×0 mirror，這是 C 在 antd T2 失敗的原因。
- `#L1-L56` — `bench/stacks/radix/main.jsx` — Radix/shadcn 結構；dropdown 與 checkbox 走 ARIA，`role=option` 與 focus 行為較標準。
- `#L1-L67` — `bench/stacks/vue-ep/App.vue` — Vue 3 + Element Plus；`el-select` 的 input 在 opacity 0 wrapper 內，`.el-select__wrapper` 才是可點區域；checkbox 也需要 label。
- `#L1-L68` — `bench/stacks/wc/main.js` — Lit + Shoelace，所有控制項在 open shadow root；`sl-checkbox` 的 `<input>` 不可直接操作，必須點 label。
- `#L1-L8` — `bench/stacks/build.sh` — 對 8 個 stack 跑 `npm ci` 加 Vite build，輸出到 `dist/<stack>`。
- `#L1-L17` — `bench/stacks/vite.config.js` — 依 stack 設定 root、outDir 與 React/Vue plugin；讓每個 stack 可以獨立 build。
- `#L1-L26` — `bench/stacks/package.json` — 鎖定的 stack 依賴（React 19、MUI、antd、Radix、Vue、Element Plus、Lit、Shoelace）與 build script。
- `#L1-L1` — `bench/stacks/*/index.html`、`bench/stacks/vue-ep/main.js`、`bench/stacks/radix/style.css`、`bench/stacks/package-lock.json` — 各 stack 的掛載點、Vue 入口、Radix 樣式與依賴鎖檔；只負責把 app 掛到 `#root`/`#app`。
- `#L1-L120` — `bench/results/6c6a550.jsonl` — 最終 120 列矩陣原始資料（approach/stack/task/trial/pass/outcome/steps/wall/decide/snapshot/cost/path）；是回歸與再分析的基礎。
- `#L1-L281` — `bench/results/h2h-final.json` — Claude vs quicke2e 的摘要與逐次 run（pass、wallMs、cost、turns/steps 或 verdict）；`launch-task*.json` 是同類 launch 任務紀錄。
- `#L1-L19` — `examples/fixtures.spec.mjs` — 零外部 app 的三條入門 flow：login、選方案、toast。最快理解 spec 的 `start/inputs/goal/done/expectUrl/expect/expectSeen` 形狀。
- `#L1-L30` — `examples/ticketbay/flows.mjs` — 前半：資料契約（order 1/10、€75.17 退費、€0.00、€121.54/€109.39）與為什麼每個 assertion 在起始頁都 false；這是寫「不會空過」的 assertion 的範本。
- `#L32-L60` — `examples/ticketbay/flows.mjs` — 四條 flow：book-with-code、refund-in-window、refund-after-start、checkout-plain；`inputs` key 用 label 子字串比對，因此刻意避開 `tickets`。
- `#L1-L30` — `examples/ticketbay/attacks.mjs` — 惡意使用者規格：用 URL 開別人的 order、用 odd casing 套停用折扣碼；每條都用 `expect` 確認拒絕、`expectAbsent` 確認成功狀態沒出現。
- `#L1-L29` — `examples/ticketbay/precheck.mjs` — 用與 `checkGoal()` 相同的 predicate，在 reset 後載入每條 flow 的起始頁；任何一條為 TRUE 就代表這條 spec 是 WEAK。
- `#L1-L21` — `examples/ticketbay/sign-in.mjs` — 以 seed 帳號登入 TicketBay 並存 `storageState`，供需要登入的 spec 使用；密碼是公開 demo 密碼。
- `#L1-L17` — `examples/ticketbay/reset.sh` — 重跑 `db:seed` 後用 SQL 驗證 flows 依賴的 order 1/10、event 狀態、最大 id 沒漂移；漂移就拒絕繼續。
- `#L1-L60` — `examples/ticketbay/generated/checkout-plain.flow.json` 與 `checkout-plain.spec.ts` — 一次成功 run 經 codegen 產生的 Playwright spec 與 sidecar；展示「錄一次，變成 CI 可重播資產」。
- `#L1-L55` — `fixtures/README.md` — 為什麼是 73 個現場缺陷而不是 widget taxonomy；12 個 browser-agent repo 中 0 個 vendor 元件庫進測試床、7 個用小型手寫頁；`negative.html` 與 `login/login.mutated` 是最重要的兩組。
- `#L1-L60` — `fixtures/flows.mjs` — fixture 的 helper（`has`/`val`/`typedInto`/`clicked`/`opsAt`/`hatch`）與 grader 的共同契約：同時看 `rec`、`data-truth` log 與 proxy 記錄的 criteria，所以 verdict 不能只靠「倖存」過關。
- `#L62-L220` — `fixtures/flows.mjs` — budget/ranking 類 fixture：`table-pagination`（最後一列 link 被 drop）、`form-heavy`（link 促銷反而餓死表單）、`native-select`、`modal-long-list`、`menuitem-sidebar`、`ambiguous-collide`/`nomatch`、`aria-labelledby` 的 ZWSP false pass、`ordinal-carryover`。
- `#L222-L330` — `fixtures/flows.mjs` — `login-base`/`login-mutated` 的 rename 對照與 audit round 1：shadow form、iframe、label-shadow、late-enable、SPA big block、toast、long-thread、secret-field。
- `#L332-L470` — `fixtures/flows.mjs` — security/redact fixture：contenteditable、echo、title、URL path token、combobox、goal/done 洩漏、transform/truncate/whitespace、page-shown secret、GET 表單、card grouping、weak password、false positive 與 min-* 資料最小化。
- `#L472-L565` — `fixtures/flows.mjs` — 最後一輪：redact selector/anchor/click、shadow/iframe 內的 redaction、short-text 契約、attack cases（refused/leaked/server error）與兩個 probe（negative-control、select-innertext）。
- `#L1-L36` — `fixtures/serve.mjs` — 靜態伺服器與 `/truth.js` 注入：`data-truth` 元素的 click/change/input 會用 `sendBeacon` 送到 `/_truth`，讓 grader 能判斷「打到正確元素」而不只是「有沒有過」。
- `#L38-L72` — `fixtures/serve.mjs` — `/orders/:id` 的 map routing、`/_500` 錯誤頁、`startStatic()` 回傳的 `reset/truth/close`；最後處理 Windows 路徑與 symlink 的 file:// 判斷。
- `#L1-L60` — `fixtures/run.mjs` — 回歸 harness 的設定：`--pin` 先凍結 checkout（避免量測中被改）、`--engine` 可切 local/jev、hosted engine 用 fetch wrapper 記錄 payload、`startStatic` + `startProxy`、`LOCAL_URL` 必須在 import 前設好。
- `#L62-L150` — `fixtures/run.mjs` — 逐 fixture 跑 n 次、呼叫 `fx.grade({rec, truth, calls})`、印 right-element/verdict/steps、可存 baseline；最後比較 baseline，right-element 或 verdict 退步就 exit 1。另有 Chromium 被其他 agent 殺掉時自動重啟的保護。
- `#L1-L60` — `fixtures/proxy.mjs` — 攔截 local engine 的完整請求與回應：記錄 state.elements、criteria、criteriaText、choice、confidence、truncated；對 upstream 做 3 次重試，避免鄰居的 MLX 流量變成假 fixture 失敗。
- `#L1-L45` — `fixtures/why.mjs` — 單一 fixture 的除錯器：先單獨檢查 aria-label 的 ZWSP decoy 在起始頁是否已滿足 `checkGoal`，再逐步印出每個 step 的 URL、choice、confidence、op、label 與完整 option set。
- `#L1-L25` — `fixtures/inspect.mjs` — 對任一 checkout 的 snapshot 做 ad-hoc dump：action 總數、role/kind 分布、前 34 個 node、最後 4 個 node；用來判斷 representation 看見了什麼。
- `#L1-L29` — `fixtures/pages/negative.html` — 必鬚**不**被 offered 的 hidden、zero-size、opacity 0、offscreen 誘餌；`negative-control` probe 只允許一個 `Continue` action，任何 Decoy/Phantom/Ghost 洩漏都算失敗。
- `#L1-L23` — `fixtures/pages/select.html` — native `<select>` 與 checkbox；probe 驗證 `expect` 不該看見 option 文字、`expectState` 必須在選擇後由 false 變 true。
- `#L1-L20` — `fixtures/pages/table.html` 與 `table2.html` — 60 列、目標是最後一頁的 link，測 budget starvation；`table2.html` 是目的地。
- `#L1-L34` — `fixtures/pages/login.html` 與 `login.mutated.html` — id/testid 完全相同、label/按鈕/link 改名、aria-label 改一個、刪一個 list item；用 `data-truth` 證明 loop 打到正確元素而不是只活下來。
- `#L1-L26` — `fixtures/pages/aria-label.html` — 只有 `aria-labelledby` 的標籤與 zero-width space decoy；曾造成 verdict 3/3、right-element 0/3 的 false pass。
- `#L1-L22` — `fixtures/pages/shadow-form.html` — open shadow root 內的表單；測 deep walk 與 root-scoped name。
- `#L1-L11` — `fixtures/pages/iframe-form.html` 與 `iframe-inner.html` — same-origin iframe 表單；測 snapshot 與 act 是否能進 frame，成功會導航 top window。
- `#L1-L46` — `fixtures/pages/modal-list.html` — 60 個 option 的長 listbox；測「截斷清單吃掉 WAIT/DONE/BLOCKED escape hatch」。
- `#L1-L28` — `fixtures/pages/toast.html` — 成功訊息只存在 300 ms；只能用 `expectSeen` 斷言，用 `expect` 會變成 timing luck。
- `#L1-L74` — `fixtures/pages/long-thread.html` — 長頁面把 submit 按鈕擠出預算；測 button starvation。
- `#L1-L13` — `fixtures/pages/sec-shown.html` — 頁面本來就顯示的 recovery/backup code；用 `redact` 宣告哪些文字不能送給引擎。
- `#L1-L14` — `fixtures/pages/redact-selector.html` — `redact:['.backup-code']` 的 selector 契約，涵蓋 span in button、aria-labelledby、title 與 shadow root；title 需要另外用 regex 宣告。
- `#L1-L152` — `fixtures/pages/tourn-similar.html` — 150 個近相同 link，跨多個 heat；測 tournament 分組與決選是否還能把目標帶進 final。
- `#L1-L124` — `fixtures/pages/min-sku.html` — 120 列、goal 寫 `WX100187` 但頁面寫 `WX-100187`；測資料最小化下仍能靠正規化命中。
- `#L1-L1` — `fixtures/pages/` 其餘 56 頁 — 其他 field-found 與 audit 案例：dropdown、drag、hover、dialog、popup cover、slider、secret echo、weak password、false-pass 的 opacity/collapsed/offscreen/font-size 0 等；每一頁都對應 `fixtures/flows.mjs` 的一個 fixture/grader。
- `#L1-L120` — `test/core.test.mjs` — 無模型測試前半：snapshot 不 offer hidden decoy、native select 每 option、submit 表單歸屬、password 不進 payload、pattern 正規化、discover safe/full、route BFS、CLI WEAK_ASSERTION、codegen locator 與 secret 處理。
- `#L122-L300` — `test/core.test.mjs` — 安全與規格測試：compact 不含 text-field 內容或 secret、`redactGoal`、fuzzy scrub（改大小寫/截斷/空白/URL encode/card last-4）、spec key 含空白、CI 缺 secret 的行為、discover safe 不點 button/switch、weak secret 不誤砍頁面字。
- `#L302-L430` — `test/core.test.mjs` — v0.3/v0.4：`SEEN_TEXT` 只算視覺文字、declared redaction、fixture id 唯一、redact text cut 的 4 字元門檻、attack 的 `ABSENT_SEEN`、control page、5xx `SERVER_ERROR`、neverClick glob、heldBack、pageSig、CLI 錯誤訊息與 `--json` UNREACHABLE。
- `#L432-L523` — `test/core.test.mjs` — v0.4/v0.5 regression：context label（同名按鈕加卡片上下文）、verifiedLocator 的 scoped/spinbutton/長 link、codegen 的 storageState/expectSeen/expectState、AUTH_REQUIRED、ARIA slider 用方向鍵、icon-only 按鈕命名、CSS text-transform 的大小寫不敏感、display:contents 與 expectSeen 跳過 script/invisible。
- `#L1-L56` — `test/route.test.mjs` — 用一個 stub engine 回傳 PAGE:/URL:/Cancel order 的 choice，測 `--map`：具體 start page（`/orders/281`）不會被換成同 pattern 的另一個 instance，從 `/orders` 則會用 link label 路由到 `/orders/301`。
- `#L1-L120` — `docs/bakeoff-2026-09-24.md` — 問題、排名（hard-stack pass rate > 不用 LLM > 速度 > 成本）、Tier-2 stacks、三個任務、approach 表與 120 格矩陣；先讀這段拿到「ship A+G、baseline 35/120」的結論。
- `#L122-L230` — `docs/bakeoff-2026-09-24.md` — 逐類失敗的 step path：native select 沒有 dispatch、MUI/antd checkbox 不可見、shadow DOM 0 actions、iframe 只看見 nav、T3 row 57 被 budget drop；以及兩個關鍵 finding（移除已選 option 也移除證據、per-snapshot stamp 解掉 ordinal carryover）。
- `#L232-L330` — `docs/bakeoff-2026-09-24.md` — fixture suite 前後對照、proposed diff 的 `compact()`/`act()`/SELECT/state elements，與 A+ snapshot 的八個改動；這是把實驗結論落回程式碼的最小 patch。
- `#L332-L515` — `docs/bakeoff-2026-09-24.md` — prior art（mapwright、Stagehand、browser-use、Playwright MCP）、總成本、reproduce 指令，以及多次 re-run（discover、rc、tournament、final-skip、最終 README 數字）。展示「同分但更快/更便宜」如何被一輪一輪驗證。
- `#L1-L1` — `bench/pw-mcp.json`、`bench/.gitignore` — head-to-head 用的 Playwright MCP 設定（`--headless --isolated`）與 bench 產物忽略規則。
- `#L1-L1` — `docs/logo.svg`、`docs/logo-dark.svg`、`docs/demo.gif` — 品牌與 demo 資產；不影響執行，但 README 與 launch 影片會用到。
