---
source: sources/agentic-engineer/20261030/skills/skills
source_type: codebase
source_lines: 5510
language: Markdown
file_count: 71
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- `scope` — 把產品想法變成 `docs/scope/` 裡可持續更新的粗粒度計畫；一個指令依上下文推斷 plan／replan／add，用決策面板問產品與切片問題，產出「At a glance 表＋各階段 feature 區塊＋Done when 種子」。課程在動手寫程式前用它決定「做什麼、先後順序、每個 feature 要多重」。
- `architect` — 把一個 load-bearing 技術決策談成 `docs/specs/` 的 build spec；四種模式 FEATURE／ARCHITECTURE／ENHANCEMENT／CROSS-CUTTING，流程是推斷框架→分階段設計訪談→自己寫 spec→自我檢查與跨模型複核。課程在 `/develop` 說「這裡需要一個決策」時回到它，先決策再實作。
- `develop` — 依 spec 與 `AGENTS.md` 把功能蓋出來；Step 0 的 spec gate 用「每個值是否有具名來源」的輸入覆蓋測試擋下偷偷發明的決策，允許記一筆 `Assumed` spec 先建後補。產物是程式碼、migration 與 scope 進度；課程在 spec 核准後用它，是唯一的寫程式階段。
- `test` — 針對「已改未 commit」的檔案寫測試；先從 git 界定範圍、逐檔分類（logic／component／page／api／cli），讀或建立 `test-preferences.json`，再把測試追溯到 spec 的 `AC-N`。產物是測試檔而非應用程式碼；課程在 Beta／GA 的實作後用它把行為鎖住。
- `check` — 合併前的閘門，兩個模式不可混用：`verify` 真的把 app 跑起來、對照 spec 的驗收準則與每個表面，`review` 換一個不同模型做資深 code review。產物是逐條 AC 的 PASS/FAIL 與 `docs/reviews/` 的嚴重度排序發現；課程在 `/develop` 後 verify、PR 前 review。
- `debug` — 把 bug 當案件偵辦：reproduce → localize → 一次一個可證偽假設 → 最小修正 → 驗證，拒絕先補症狀。產物是根因修正與一個回歸測試；課程在測試紅燈或行為錯誤時用它，不擴張功能也不順手重構。
- `audit` — 建立所有後續 skill 都會讀的 `AGENTS.md` 專案上下文；分 greenfield、whole-repo、area、gap-fill 四條路，`AGENTS.md` 是正本、`CLAUDE.md` 只是指標。產物是根目錄與必要巢狀區的上下文檔；課程在 scaffold 後、需要慣例與工具決策時用它。
- `document` — 從真實 commit 與 diff 寫 `pr`／`changelog`／`release-note`／`postmortem` 四種對人文件，不憑想像補時間線或原因。產物是 PR 文字、`CHANGELOG.md`、`docs/releases/`、`docs/postmortems/`；課程在 PR 前與發版時用它。
- `sync` — 變更完成、接近 merge 時把 durable knowledge 對齊 repo 現況：手術式更新 `AGENTS.md`、reconcile scope 勾選與 spec 的 `Status` 行，並把不能自己改的 stale spec、未 ratified 的 `Assumed`、curated 衝突 flag 出來。課程用它收尾，讓下一個 session 讀檔就能續作。

# L2 detail

- `#L1-L96` — `scope/SKILL.md` — 定義 living scope：一個指令推斷 plan／replan／add，scope 形狀是精簡 At a glance 表加依 phase 分組的 feature 區塊；每個 feature 有 intent、一行 `Done when:`（驗收準則種子）與 checkbox 步驟，spec 捕獲後才長出 Build／Verify／Test 形狀。核心可重用概念是 workflow tier（Prototype／Alpha／Beta／GA）只決定 `/develop` 之後的檢查尾巴與誰能把 feature 標 `done`，以及「絕不選工具」這條所有權邊界。
- `#L1-L120` — `scope/modes/plan.md` — 完整 plan 流程：先分類 greenfield／brownfield／monorepo 並只讀一條 route 檔；用逐维生成（非固定腳本）的決策面板問產品、能力、cross-cutting 與 go-to-market；再選 build approach 並讀該 persona；foundations first；切成小 feature 並判斷 `Needs spec?`（invent test）；最後建議 workflow depth、寫 scope、跑 references consent。
- `#L1-L20` — `scope/modes/plan-greenfield.md` — 「foundations first」排序的具體清單：standards、stack＋scaffold（一列，不是兩列）、`/audit` 擷取慣例後 `/develop tooling` 安裝、資料模型（絕不省略）、design system、walking skeleton，最後才是 feature slices；並警告「每個能力都當完整 feature 再加 Slice 標籤」並沒有真的套用所選 approach。
- `#L1-L11` — `scope/modes/plan-brownfield.md` — 在既有程式碼上規劃下一刀：從 `AGENTS.md` 與輕量掃描把已存在的功能誠實登記為 `existing`（完成）或 `in-progress`（半成品），絕不把半成品蓋成 existing；再規劃新 slice，重跑時以所有狀態為去重基準並把 drift 補登記。
- `#L1-L8` — `scope/modes/plan-monorepo.md` — monorepo 的 scope 佈局：每個 workspace 一份 `docs/scope/<workspace>/`，repo-wide 決策放 `_root`，頂層 `index.md` 一行一 workspace 加 rollup；跨 workspace 的功能要嘛放 `_root` 要嘛拆成協調的多個 feature。
- `#L1-L13` — `scope/modes/replan.md` — 「living rhythm」：每次功能或階段落地後跑，核對已 ship 的標 `done`（要從 code／spec 驗證，不蓋章）、把 build 期間冒出的 follow-up 登記成新列、重新排序、排出下一個 slice，並把 `Assumed` spec 當決策債持續 surface。
- `#L1-L12` — `scope/modes/add.md` — 只加一個 ad hoc feature 的輕量路徑：先讀 scope 去重，只問 intent、tier、placement 與 per-feature approach，並用 invent test 決定 `Needs spec?`（provider／資料模型／cross-cutting pattern／整頁設計／非平凡行為都算 yes），最後 append 一列與一個入口 checkbox。
- `#L1-L34` — `scope/approaches/tracer-bullet.md` — Tracer Bullet persona：先用一條穿過每一層的真實細線證明整合可行，第一個 slice 就是 walking skeleton（不另做用完即丟的 skeleton），之後每次只加粗其中一段；全程用真 auth、真 schema、真 UI，只砍廣度。這是 production 專案的預設切片方式。
- `#L1-L33` — `scope/approaches/skateboard.md` — Skateboard persona：先做出「真人明天就會用」的最小可用完整產品，必要時連結構（teams、roles）都砍，之後每個 release 都還能 ship、只是更有用；與 Tracer Bullet 的差別是它不為了證明整合而保留完整結構。
- `#L1-L33` — `scope/approaches/facade.md` — Facade persona：先用假資料把全部關鍵畫面做得可點、可導覽（prototype grade，明講不 production complete），之後逐屏把真 auth／DB／讀寫接到已存在的介面後面；第一個交付物廣但不真，與 Tracer Bullet（窄但全真）、Skateboard（小但全真）形成三角對照。
- `#L1-L31` — `scope/approaches/journey.md` — Journey persona：一次只完成一條使用者旅程，包含所有 edge／empty／error／confirmation 狀態與 polish，下一條旅程之前不存在；切片單位是「一個完整體驗」，不是「一層接好」或「一屏接真資料」。
- `#L1-L148` — `scope/scope-template.md` — scope 的格式契約與生命週期圖：At a glance 表加 phase 區塊、每個事實只出現一次、heading 只帶有意義的標籤；feature 從 `planned` 的單一決策 box，長成 `Design it` 打勾＋`Build it` 加 2–5 個里程碑 rollup＋依 tier 的 Verify／Test／Review／Document box。反覆強調原子建置任務留在 spec 的 `## Build plan`，scope 只放里程碑，next step 永遠是第一個未勾的 box。
- `#L1-L7` — `scope/agents/openai.yaml` — Codex 介面卡：只提供 agent picker 的 `display_name`／`short_description`／`default_prompt`，真正指令在 `../SKILL.md`；屬於打包細節，不含流程知識。
- `#L1-L206` — `architect/SKILL.md` — `/architect` 的編排層：四種模式與 create／update／supersede／ratify 四種操作；spec 狀態有兩種行為（連到 scope feature 就鏡射 feature 生命週期，standalone 決策則由工程師確認即 `Accepted`），`Assumed` 只能由它清除；子代理一律唯讀（scout 讀碼、researcher 查網路、跨模型複核），主執行緒自己寫 spec；create／supersede 前必須先讀 design-conversation 才是硬閘門。
- `#L1-L85` — `architect/agent-modes/feature.md` — FEATURE 模式的設計步驟：選擇性讀取整合點、依序推導真實使用者問題、資料模型與狀態機、consistency、最小 API surface、failure modes、security、config；附帶可重用的後端專家規則（idempotency 從第一天做起、列表一律分頁、soft delete 通常錯、衍生值不預存、金流／權限／醫療要 audit log、公開端點限流、secret 不進 DB）。
- `#L1-L73` — `architect/agent-modes/architecture.md` — ARCHITECTURE 模式：先選架構模式（小團隊 monolith、中規模 layered monolith、大型才 2–3 個服務、資料重先決定 batch vs stream）再逐層選型；類別（category）是耐久建議、產品名要即時查證；專家意見是 monolith first、關聯式資料庫為預設、serverless 有硬限制、多區域等 PMF 之後再說、ORM 管 CRUD／複雜查詢寫 SQL。輸出是 decision-only 的 `## Proposed stack`，不含 scaffold 步驟。
- `#L1-L45` — `architect/agent-modes/enhancement.md` — ENHANCEMENT 模式：先讀現況並誠實診斷（實際怎麼運作、根因、既有約束），再比較 fix in place／strangler／直接替換；可重用規則是「先量測再優化」、strangler 幾乎總是 production 遷移正解、cache 要先回答快取什麼／何時失效／過期怎麼辦、feature flag 是重大變更的部署機制、live migration 的安全順序（可空欄位→雙寫→回填→加約束→移除舊欄）。
- `#L1-L65` — `architect/agent-modes/cross-cutting.md` — CROSS-CUTTING 模式：抽樣 4–6 個代表性檔案辨識 2–3 種並存寫法，定義一個可星期一早上無歧義套用的標準：canonical pattern、明確列出被取代的寫法、最強的可行強制機制（lint > 編譯期型別 > PR checklist > 口頭慣例）、例外、rollout；輸出 `## Standard definition`。
- `#L1-L279` — `architect/spec-template.md` — spec 的完整章節模板與寫作規則，也是「build spec vs decision record」的分野：`## Requirements` 的 `AC-N` 是 `/develop` 建置與 `/check verify` 檢查的契約，`## Feature design` 含 data model、state transitions、API table、**Value sourcing**（每個 AC 需要的值都要有具名來源）、invariants、security、config、critical test scenarios；`## Build plan` 每個任務標註滿足哪個 AC，形成雙向追溯。decision record（Context／Options／Rationale／References）在 directory spec 移到 `rationale.md`，讓 build 不必載入理由。另含 status 值表與 umbrella 子 spec 規則。
- `#L1-L245` — `architect/agent-prompt.md` — 寫 spec 時的人格與全模式規則：Staff/Principal 的取捨哲學（simple beats clever、boring technology、design for failure、三個時間尺度）；Step 0 套用社群 skill 的權威慣例並填 `Implementation skills` 指標；Step 0b 永遠先挑戰前提，附一張「已知失敗模式」表（過早 microservices、關聯資料用 NoSQL、big bang rewrite、未量測先優化、GraphQL 當預設、stateful 用 serverless、自造 auth、org isolation 事後補）；價值來源、AC spine、decision-only spec、引用等級、報告格式。
- `#L1-L140` — `architect/internal/design-conversation.md` — 設計訪談的協定，是整個系統最核心的可重用流程知識：Scope validation 先偵測「已經建好、只是要記錄」與「產品級想法 vs 單一決策」，產品級先挑一個基礎決策；Framing 用推斷而非 interrogation；staged conversation 依 (a) 需求→推導 AC、(b) 資料模型（強制 ASK→組裝→SHOW→確認→迭代）、(c) stack 與工具逐層走並做 references consent、(d) API surface 並關閉 value sourcing 迴圈、(e) 授權、(f) 邊界案例；最後有 completeness gate，任何 load-bearing 維度未問就不准寫 spec。
- `#L1-L90` — `architect/internal/after-subagent.md` — spec 寫完後的完成流程：先確認檔案真的存在、逐節自我檢查（缺漏以 `⚠️ Incomplete` 標示）；再依 workflow tier 建議跨模型複核（GA/Beta 強烈建議 Another model），跨模型只讀、只回 critique，發現 decision-completeness gap 時列出建議解法讓工程師選，不自動改決策；確認後依 spec 種類 ratify 狀態，並把 build 里程碑 rollup 寫回 scope、最後給一段白話總結。
- `#L1-L58` — `architect/internal/tool-discovery.md` — Agent Skill／MCP 發現的同意閘門：**問是強制、搜尋不是**，四選一（幫我找／我自己指定／不用並記錄拒絕／晚點再說），只有第一個選項能觸發搜尋；同意後把整組工具交給背景唯讀 researcher 子代理批次搜尋，主執行緒繼續訪談，最後在 main thread 分組 offer、安裝後把指標寫進 spec 與 `AGENTS.md`。同意先於搜尋與「拒絕要記住、不再騷擾」是可移植的人機互動模式。
- `#L1-L7` — `architect/agents/openai.yaml` — Codex 介面卡（顯示名稱、短描述、預設提示），指令仍在 `SKILL.md`；打包細節。
- `#L1-L144` — `develop/SKILL.md` — builder 的編排層：Step 0 spec gate 用機械式的 input coverage 測試（列出這次建置必須產出／計算／顯示的每個值，逐一確認 spec 有具名來源；沒有來源就是 owed decision），並提供三選一（先 architect／判定不需要／先建但寫一筆 `Assumed` spec）；明訂 `/develop` 只擁有程式碼與極窄的 scope 觸碰，不寫 spec 內容、不裁決決策；另有 freshness／協作警告與 git integration 讀取。
- `#L1-L128` — `develop/flow/build.md` — gate 通過後的 Steps 1–4：分類 UI／Logical／both；只讀 spec 的 build sections（跳過 rationale）、最近的 `AGENTS.md`、`design.md` 與 build approach；做章節齊備與 input coverage 兩段完整性檢查，缺 load-bearing 欄位就回頭補 spec 並先持久化答案；可把讀碼外包給 scout；resume 時從第一個未勾任務接續；建置一律在主執行緒 inline，替換舊碼要刪乾淨並證明無人引用；最後只在真的落地時勾任務、產生 `verify.md` 步驟並詢問是否存檔。
- `#L1-L34` — `develop/flow/git.md` — 只有在 `AGENTS.md` 的 `## Git` 寫 `integration: on` 時才啟用：預設從 default branch 開 `feat/<slug>`、每個里程碑 green 後 offer commit、訊息是一行 Conventional Commit 加 `Co-Authored-By`，理由留在 spec／PR 而非 commit body，且永不 push（push 與 PR 是 `/document` 的事）。
- `#L1-L140` — `develop/ui-guide.md` — UI track 的「完成定義」：先設計完整表面再整合進程式庫；列出會直接判定 NOT done 的 disqualifiers（空頁上一個置中表單、大片死區、未 styling 的原生元件、只有預設樣式、缺 empty/loading/error、孤立控制項）；依 spec 記錄的設計來源路由到 Figma／截圖／既有 design system／自行生成，並要求先偵測平台、styling、theme、navigation、icon 系統再用其慣用法建置。
- `#L1-L86` — `develop/logical-guide.md` — 後端 track 的階段：ground in spec（含 `AC-N` 與 build approach）→ data layer（migration 一定要真的套用並確認 schema 上線，不能只看檔案）→ core logic（狀態機、idempotency、邊界驗證、既有錯誤樣式）→ API（授權而非只認證、列表分頁、一致錯誤形狀、公開端點限流）→ integration（secret 從環境來、webhook 驗簽與冪等、structured／audit log）→ 移除被取代的舊碼 → 正確性與安全總檢查。
- `#L1-L79` — `develop/checklist.md` — UI 無障礙與 token 紀律的 pass/fail 閘門：可無指標操作、focus 可見且 3:1、語意結構、label 與 accessible name、name/role/state、色彩對比（4.5:1／3:1）、modal focus 進出、token 不得出現原始色值或重複尺寸、響應式與 loading/error/empty 狀態；required 項目全過才算 skill 完成。
- `#L1-L23` — `develop/ui/existing.md` — 已有設計系統的路徑：`design.md` 是指向（character、build mandate、composition 規則），專案 styling/theme 系統裡的 token 值才是唯一真相；新頁面仍要是完整專業表面，缺 token 時用最接近的既有 token 衍生而不是硬寫，衝突要列出讓工程師決定。
- `#L1-L131` — `develop/ui/generate.md` — 從零生成設計系統的路徑：先找參考（網站／design.md URL／描述風格／直接建議），再**推導而非背誦** token：一個 accent、六階中性色梯、逐對計算 WCAG 對比（accent 上的文字最常失敗，明暗分開驗）、模組化字級、4/8 間距、三段 radius 與 motion；token 寫進專案樣式系統，`design.md` 只寫藝術方向與 build mandate，不複製 token 值。
- `#L1-L41` — `develop/ui/image.md` — 截圖來源路徑：多張圖先判斷是不同寬度（響應式斷點）、不同狀態（default/hover/error）或明暗兩版，再從主圖精確抽取顏色、字型、間距、幾何、動態與明暗模式；值是 hex 不是近似，token 進樣式系統、character 進 `design.md`，與既有 token 衝突要先停下讓工程師選 update／extend／skip。
- `#L1-L173` — `develop/ui/implementation.md` — 實作階段與資產策略：專有字型替代表與載入方式；需要圖像時先找專案資產，缺了要問（工程師補檔／placeholder 服務／本地漸層）且不可硬寫壞路徑；Facade 早期用集中管理的 typed mock，標記 `PLACEHOLDER`；Phase 0 先把整個畫面組成寫下來（品牌、真 copy、各頁型該有的佈局），Phase 1 語意結構、Phase 2 token、Phase 3 響應式、Phase 4 狀態與動態、Phase 5 無障礙、Phase 6 依 disqualifiers 自審並實際 render 檢查。
- `#L1-L11` — `develop/ui/mcp.md` — 設計 MCP 來源：把 Figma／設計工具的 token、間距、元件、frame 與資產參照拉進 `design.md`，記錄用了哪個檔與 frame；沒連 MCP 就明講並要求連接或換來源，不得默默改成生成設計。
- `#L1-L7` — `develop/agents/openai.yaml` — Codex 介面卡；打包細節。
- `#L1-L216` — `test/SKILL.md` — 測試產生的編排層：範圍由 git 工作樹定義（tracked＋untracked，濾掉測試／config／lock／build／styling／docs），逐檔分類並對應策略（logic 單元、component render+interact、page E2E、api 整合、cli 呼叫）；`test-preferences.json` 分 framework 形與 gate 形（`tool: null` + `gate` 代表刻意不用 runner，不准再問）；每次必問「寫完要不要跑」；寫測試時把可自動化的 `AC-N` 鎖進測試並標記，不可自動化的列入 `NOT_COVERED`。
- `#L1-L97` — `test/modes/setup.md` — 首次執行（無 preferences）的設定：偵測 lockfile／語言／既有 runner，先問「這個專案是不是刻意沒有 test runner」，尊重 `AGENTS.md`／spec 的 no-runner 慣例並存成 gate 形；再依語言問 framework、page/flow 變更才問 E2E、component 才問 Testing Library；最後寫 `test-preferences.json`，兩種形狀都必須同時有 `tool` 與 `gate` 鍵。
- `#L1-L196` — `test/writing-guide.md` — 測試寫作規則手冊：不得改應用程式碼讓測試通過、既有測試只能 extend 不能覆蓋、config 除非無法執行才建最小檔；逐類別策略、覆蓋優先序（happy→edge→error→state→a11y）、專家規則（測試名是句子、一個概念、AAA、測公開介面、只在系統邊界 mock、決定性）；各框架工具細節；只重跑失敗檔並區分「測試寫錯」與「程式真的錯」，後者保留紅燈進 `BUGS_FOUND`。
- `#L1-L62` — `test/agent-prompt.md` — 寫入時的模板：把工具、安裝狀態、testDir、filePattern、package root、run command、是否跑、已分類範圍、專案上下文與 spec／design 指標以 ALL_CAPS placeholder 注入，要求主執行緒自己讀 `writing-guide.md` 並照其格式輸出報告。
- `#L1-L7` — `test/agents/openai.yaml` — Codex 介面卡；打包細節。
- `#L1-L52` — `check/SKILL.md` — 兩個模式的閘門與路由：`verify` 是 runtime proof（跑真 app、對照 spec 的每個 AC 與表面），`review` 是換模型的資深閱讀；沒帶模式字就必須印出 verify／review／both 面板並停下等待，不准猜、不准預設，也不准在一次執行混用兩種模式。
- `#L1-L173` — `check/modes/verify.md` — 執行時證明的完整協定：feature 模式與 refactor 模式（後者用 git worktree 抓 before/after 並逐表面 diff）；載入 `verify.md` 或 spec 的 `AC-N` 契約；用 build approach 校準「這個 slice 允許假到什麼程度」；建立 evidence ledger（URL＋截圖、request＋status、指令＋exit code、live schema 查詢）；Step 4b 把每個 AC 判為 met／specced but missing／built but not applied／blocked；Step 4c 是證據閘門——沒有可引用的證據就不能給 ✅，沒真的啟動 app 就不能給 PASS，工具不可用是 blocked 不是 pass。
- `#L1-L146` — `check/modes/review.md` — 跨模型 code review 的機制：不靠自我 introspection，先從 durable config 偵測作者模型並用一個問題確認；再映射到不同家族的 reviewer（opus↔sonnet、fable→opus、haiku→sonnet），絕不用 haiku 做 review、絕不用同家族；界定 diff 範圍（branch vs base 或 uncommitted）、準備專案上下文與 test signal 三態，最後把 `review-agent-prompt.md` 與 `review-guide.md` 的絕對路徑交給子代理，自己只轉述摘要並勾 `Review it`。
- `#L1-L133` — `check/review-guide.md` — reviewer 的評分規準：依序檢查正確性、安全、錯誤處理與韌性、效能與規模、API 契約、可維護性、慣例與決策遵循、測試充分度；測試充分度依 `configured`／`none-by-design`／`none-yet` 三態判斷（刻意無 runner 的專案不得催測試）；嚴重度 Blocker／Major／Minor／Nit 對應 merge 影響與 verdict；最後給 findings 檔與回傳摘要的確切格式。
- `#L1-L57` — `check/review-agent-prompt.md` — reviewer 子代理的精簡 spawn 模板：注入 rubric 路徑、diff 模式與指令、`AGENTS.md` 全文、相關 spec 路徑、test signal 與輸出路徑；要求先跑 diff、再讀完整變更檔（只看 hunk 會看不到決定正確性的周邊程式），只寫 findings 檔不碰程式碼。
- `#L1-L7` — `check/agents/openai.yaml` — Codex 介面卡；打包細節。
- `#L1-L100` — `debug/SKILL.md` — 根因調查迴圈：Step 0 先釘住 observed／expected／repro，不能重現就不能除錯；Step 1 取得決定性重現（間歇性要找讓它變確定的因素）；Step 2 bisect 程式路徑、歷史與實際值；Step 3 一次只提一個可證偽的根因假設（症狀不是原因）；Step 4 用最小實驗確認或丟棄；Step 5 只做針對根因的最小修正；Step 6 重跑重現、跑周邊測試、加回歸測試、grep 同根因的兄弟；若發現是決策缺陷則指向 `/architect` 而非硬補。
- `#L1-L7` — `debug/agents/openai.yaml` — Codex 介面卡；打包細節。
- `#L1-L108` — `audit/SKILL.md` — 上下文引導者的編排層：`AGENTS.md` 是工具無關的正本、`CLAUDE.md` 只是以 `@AGENTS.md` import 的一行指標；pre-flight 收集 context 檔狀態、真實原始碼數、manifest 與 commit 深度、monorepo 訊號與 `WORKFLOW_SETUP`（剛 scaffold、已有 stack spec 但尚無 root AGENTS.md 仍算 greenfield）；依訊號路由 Phase 0 問清楚／1 greenfield／2 whole-repo／3 area／4 gap-fill；寫入永遠由主執行緒自己做，scout 只負責大型掃描。
- `#L1-L24` — `audit/modes/greenfield.md` — greenfield 的提問與擷取：先讀真實 scaffold 再客製問題，問架構風格（四種 preset 路徑）、型別嚴格度、模組結構、額外標準，以及工具鏈（lint/format、pre-commit、testing gate、CI、git integration 與 branch/commit 粒度）；`/audit` 只記錄不安裝，安裝是後續 `/develop tooling`；git integration 開啟且尚未是 repo 時要 `git init`。
- `#L1-L5` — `audit/modes/whole-repo.md` — 已成立但無 `AGENTS.md` 的 repo：主執行緒掃描後自己寫 root 與判斷過的巢狀文件，大型 repo 可把讀碼外包給唯讀 scout；同時跑 tool-skills sweep。檔案很短，重點是「主執行緒寫、scout 只讀」與「只為真正有獨立慣例的區域建巢狀檔」。
- `#L1-L19` — `audit/modes/area.md` — 單一區域掃描：先驗證路徑存在、root 不存在就先跑 whole-repo、檢查 `<area>/AGENTS.md` 是否存在；寫完後處理 `ROOT_GAPS`，用 Add now／Show diff／Skip 三選一，套用時逐行 verbatim 不改寫。
- `#L1-L12` — `audit/modes/gapfill.md` — root 已存在時的保守補洞：掃描後只提四類發現——root 缺的全域事實（`ROOT_GAPS`，需同意）、未文件化的區域（可直接建巢狀檔）、既有巢狀檔的補充（`PROPOSED_ADDITIONS`，不自己改）、文件與程式碼矛盾的 `CONTRADICTIONS`（只 surface 讓人決定）。
- `#L1-L39` — `audit/modes/tool-skills.md` — 對「已安裝的 stack」做 Agent Skill／MCP 掃描：同樣先問後搜的四選一同意閘門；同意後背景 researcher 批次偵測、上限 5 次搜尋／8 頁、30 天 cache、跳過已安裝與已拒絕；offer 時技能與 MCP 分開、绝不自動安裝，最後把 installed／declined／MCP 寫進對應層級的 `AGENTS.md`。
- `#L1-L15` — `audit/patterns/clean-architecture.md` — Clean Architecture preset：domain／application／infrastructure／presentation 四層、依賴只能由外往內、use case 是薄協調者、框架與 ORM 不得進 domain/application、跨邊界用 DTO、domain 與 application 以單元測試且不 mock infrastructure。
- `#L1-L16` — `audit/patterns/domain-driven.md` — DDD preset：bounded context 各自擁有模型、aggregate 是一致性邊界且跨 context 只引用 root ID、domain event 是過去式不變事實、ubiquitous language 進到程式命名、value object 不可變且建構時驗證、repository 介面在 domain、anti-corruption layer 隔離外部系統。
- `#L1-L16` — `audit/patterns/functional.md` — Functional/Immutable preset：預設純函式、資料不可變、副作用推到邊緣、組合優於繼承、模組層只有常數、用 map/filter/reduce、避免 null 改用 Option/Maybe 或明確 union、預期失敗用 Result/Either 而非例外、純函式測試不需 mock。
- `#L1-L17` — `audit/patterns/solid-oop.md` — SOLID + OOP preset：單一職責、開閉、Liskov、介面隔離、依賴反轉與 composition root 建構子注入；不用 service locator／global registry、類別盡量 200 行內、超過一層繼承就改組合、類別按行為命名、測試以建構子注入 fake。
- `#L1-L378` — `audit/agent-prompt.md` — `AGENTS.md` 的寫作指南與模板：四個 phase 的逐步指令、root 與巢狀模板、`PROPOSED_ADDITIONS` diff 格式；核心可重用機制是 **mirrored root fields**（`## Stack` 鏡射架構 spec、`## Build approach` 鏡射 scope header，永不發明值，衝突只 flag 不選邊）與 **provenance stamp**（`_Drafted by /audit…_` 讓後續 run 分辨工具草稿與人工 curated 內容）；root 必須 ≤60 行、絕不覆寫既有檔、絕不建立 spec。
- `#L1-L7` — `audit/agents/openai.yaml` — Codex 介面卡；打包細節。
- `#L1-L121` — `document/SKILL.md` — 四種對人文件的編排：`pr`（branch commits＋diff vs base→reviewers，聊天輸出，必要時 `gh pr create/edit`）、`changelog`（merged change→developers，append 到 `CHANGELOG.md`）、`release-note`（tag range→end users，`docs/releases/<v>.md`）、`postmortem`（incident facts→team，`docs/postmortems/`）。原則是「從紀錄寫、為讀者寫」，每個句子都要能追到真實 commit／diff／工程師提供的事實；`pr` 的 gh 動作只在有 gh 且有 remote、且 PR 已存在時用 edit，任何 push／開 PR 都要先確認。
- `#L1-L43` — `document/templates/pr.md` — PR 模板：一行 imperative 標題 ≤72 字，body 依 What／Why／Changes（按意圖分組而非 commit dump）／How to test（從真實測試或行為推導，不發明）／Risk & rollout／Notes for reviewers；若 review 有已知殘餘風險要寫進 Risk。
- `#L1-L54` — `document/templates/changelog.md` — changelog 模板：先讀既有 `CHANGELOG.md` 並**沿用它既有的格式**，只有全新建立才用 Keep a Changelog 標頭；分類固定 Added／Changed／Deprecated／Removed／Fixed／Security，只留有空項目的類別；寫讀者視角、冪等（等價條目已存在就不重複加）。
- `#L1-L41` — `document/templates/release-note.md` — release note 模板：受眾是終端使用者，把技術變更翻成「現在可以做什麼」；Highlights→Improvements→Fixes，breaking changes 必須獨立且誠實標示，不埋、不用內部術語或檔名。
- `#L1-L58` — `document/templates/postmortem.md` — blameless postmortem 模板：severity／duration（含時區）／user impact／status 表，Summary 3–5 句，Timeline 只放帶時間戳的事實（分析留在 Root cause／Contributing factors），action items 必須具體可指派並標 Prevent／Detect／Mitigate；未知的就寫 Unknown，不編時間線或原因。
- `#L1-L57` — `document/agent-prompt.md` — 寫入時的規則：以 diff 為真相（commit message 與 diff 衝突時 diff 勝）、每個聲明都要指得出變更、不發明 timeline／cause／release 效益、不得在文件中重現 secret（只寫「輪替了憑證」並 flag）、changelog 必須冪等；文件結構完全照所選模板。
- `#L1-L7` — `document/agents/openai.yaml` — Codex 介面卡；打包細節。
- `#L1-L146` — `sync/SKILL.md` — 收尾維護的編排與 **Boundaries 表**：`/sync` 可維護既有 `AGENTS.md`、reconcile root 的 `## Build approach` 單行、為本次淨新增的區域建巢狀檔並加 root 指標、只改 spec 的 `Status` 行、依證據勾 scope 子任務；不可建立／重構 root（屬 `/audit`）、不可改 spec 內容（屬 `/architect`）、不可清 `Assumed`（只能 flag 決策債）、不可改寫 curated 段落。分界線是「context 而非政策」：只有在 diff 看見整個區域時才建文件。
- `#L1-L211` — `sync/agent-prompt.md` — 維護規則的權威版本：預設什麼都不做（`NOTHING_TO_SYNC` 是正常好結果）；只做 surgical、additive、durable 的 `AGENTS.md` 編輯；mirrored root fields 缺失才補、衝突只 flag；`Stack`／`Build approach` 各有檔外單一真相；只為 A（新增）狀態的區域建巢狀 `AGENTS.md`＋`CLAUDE.md` 指標；刪除後清 orphan；只 reconcile 有連 scope feature 的 spec `Status`；stale spec 只有在能指出被違反的具體決策時才 flag；scope 只改該 workspace 的檔案、只勾有明確證據的子任務、從不降級工程師已標 `done` 的 feature。
- `#L1-L7` — `sync/agents/openai.yaml` — Codex 介面卡；打包細節。
