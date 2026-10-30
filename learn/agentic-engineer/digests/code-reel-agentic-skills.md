---
source: sources/agentic-engineer/20261030/reel-agentic_engineering/.claude
source_type: codebase
source_lines: 9229
language: Markdown
file_count: 44
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- **`/develop`** — 把已決定的設計（ADR + `AGENTS.md`）變成可執行程式碼，分 UI 與 logical 兩條軌道。流程是 ADR 閘門（會逼你發明未決事項就退回 `/architect`）→ 分類軌道 → 讀規格 → 分階段實作 → 回報並推進 roadmap 狀態。可重用原則：先確認「這是實作還是決策」，把發明決策的成本擋在寫程式之前。

- **`/test`** — 為尚未 commit 的變更自動選測試策略並寫出測試套件。迴圈是 git 取得變更範圍 → 依檔名分類（logic/component/page/api/cli）→ 首次詢問框架並存 `test-preferences.json` → 派 subagent 寫測試 → 可選跑綠。可重用原則：範圍由工作區決定、策略由檔案類型決定，測試要鎖住行為而非衝覆蓋率。

- **`/verify`** — 真的把 app 跑起來、操作變更流程、看可觀察結果，補上「測試綠不等於功能可用」的缺口。流程是選模式（feature 或 refactor 前後 diff）→ 載入 ADR 驗收條件 → 決定啟動方式 → 執行並觀察 → 逐條 AC 判定 met/missing/not-applied。可重用原則：驗收要看證據（截圖、回應、log），不是看 checkmark。

- **`/review`** — 以「不同於作者的模型」做資深 code review，輸出嚴重度排序的 findings。流程是確認作者模型 → 選對照模型 → 界定 diff → 注入 rubric → subagent 寫 `docs/reviews/` → 彙報 verdict。可重用原則：審查者不能共用作者的盲點，獨立視角比更多規則更有效。

- **`/debug`** — 用可證偽的單一假設迴圈找根因並做最小修正。流程是捕捉症狀 → 穩定重現 → 二分定位 → 一次一個假設 → 實驗驗證 → 修根因 → 回歸測試與找同類 bug。可重用原則：無法重現就不能說修好；一次只改一件事，讓每個結果都有意義。

- **`/audit`** — 建立專案給後續所有 skill 讀的 AI 上下文（`AGENTS.md` 根與巢狀、`CLAUDE.md` 只當指標）。依綠地/棕地/部分文件/單一區域分五個 phase，掃描或詢問後寫入，永不覆寫既有內容。可重用原則：先有可信的專案記憶，後面的每個代理才不會各自幻想慣例。

- **`/architect`** — 以 Staff/Principal 工程師角色做決策訪談，寫出可直接施工的 ADR。流程是文件化既有決策或產品級議題拆解 → 推斷 framing → 逐階段提问（需求、資料模型、stack、API、權限、失敗模式）→ 派生 AC 與 build plan → subagent 寫 `docs/adr/`。可重用原則：一次只問一個維度、建議而非中性選單，ADR 是規格不是心得。

- **`/document`** — 從真實 commit/diff 產生 PR 描述、changelog、release note 或事故 postmortem。流程是判定文件型別 → 收集 git 證據與 ADR 脈絡 → 用對應模板派 subagent 起草 → 回報全文或檔案路徑。可重用原則：對外文字要對讀者說話，而且每句都要能追溯到實際發生的事。

- **`/sync`** — 變更完成後把持久知識同步回現實：維護 `AGENTS.md`、必要時為全新區域建巢狀文件、校正 ADR 狀態行與 roadmap 勾選。流程是界定 source diff → 找上下文檔與 ADR → subagent 做保守、外科式編輯 → 列出所有改動供覆核。可重用原則：預設什麼都不做；只有命令、慣例、限制、依賴或結構真的變了才寫。

- **`/roadmap`** — 把產品想法變成粗略、可持續更新的功能路線圖，隨交付節奏持續對帳。單一指令自動推斷 plan/replan/add，訪談商業、產品、上市面向，排出 foundation-first 的功能順序、權重與是否需要 ADR。可重用原則：路線圖只播種「做什麼」，不決定工具與設計；維持粗略才不會腐壞。

- **`/status`** — 唯讀的「你在這裡」簡報：git 狀態、roadmap 進度、ADR 狀態、續作點、協作風險與下一步建議。流程是讀 git → 解析 roadmap → 列 ADR → 檢查落後/他人施工/狀態漂移 → 輸出單一最合理指令。可重用原則：跨 session 與團隊協作靠持久證據，不靠上一輪對話的記憶。

- **`/harden`** — 用系統級視角壓力測試變更在生產環境的失敗模式，產出可排序、可驗證的 hardening checklist。流程是界定變更 → 收集 ADR/review/test 訊號 → subagent 依威脅分類法分析 → 寫 `docs/hardening/` 並給 risk posture。可重用原則：測試證明正常情況可用，harden 專找併發、規模、部分失敗、惡意輸入與時間造成的破口。

# L2 detail

- `#L1-L253` — `skills/develop/SKILL.md` — 建造者：ADR 閘門用「是否必須發明未決事項」判斷，會把 auth provider、頁面設計系統、功能行為等退回 `/architect`；兩條軌道（UI → `ui-guide.md`、logical → `logical-guide.md`），可同時使用；只擁有 app code 與 roadmap 狀態/勾選/pointer，會同步 ADR 的 Status 行但不改 ADR 內容；拒絕在沒有專案骨架時 scaffold（scaffold 子任務例外），也拒絕替你做決策。

- `#L1-L202` — `skills/test/SKILL.md` — 測試工程師：範圍自動取未 commit 的 git 變更並過濾設定/樣式/文件；主執行緒只做分類與指標收集，不讀大檔；分類表 logic/component/page-flow/api-server/cli 決定策略；首次跑詢問框架、安裝確認並寫 `test-preferences.json`；>15 檔有大型 diff 保護，monorepo 按 package root 分派；有 ADR 時把耐久 AC 鎖成測試並標 `AC-N`，不可自動化的記入 NOT_COVERED 交給 `/verify`。

- `#L203-L404` — `skills/test/SKILL.md` — 後半是偏好載入、安裝檢查、無變更時的 fallback 詢問、subagent prompt 組裝（注入完整 `writing-guide.md`，因 subagent 無法解析 skill 相對路徑）與兩種回報格式（跑/不跑）；明確拒絕改 application code 讓測試變綠，抓到的真 bug 要領先回報。

- `#L1-L171` — `skills/verify/SKILL.md` — 驗收工程師：feature mode 對照預期，refactor/regression mode 用 worktree 抓 before/after 並要求 byte-identical；Step 0b 載入 ADR 的 AC 與 specced surfaces，Step 4b 給 met/specced-but-missing/specced-but-not-applied/blocked 四態，任一缺失即 FAIL；Step 0c 依 build approach 校準「這一刀允許假什麼」；不寫程式，壞了指向 `/debug`。

- `#L1-L167` — `skills/review/SKILL.md` — 資深審查者：核心不變量是 reviewer 必須與 author 不同模型家族（opus↔sonnet，haiku 不審查），先偵測再確認作者模型；只收檔名與 base ref，subagent 自己跑 diff；rubric 與 test signal（configured/none-by-design/none-yet）注入 prompt；輸出 `docs/reviews/<date>-<branch>.md` 與 verdict；只讀不改碼，高風險變更建議換 provider 再審。

- `#L1-L101` — `skills/debug/SKILL.md` — 調查員：先固定 observed/expected/repro，再取得確定性重現；用 code path 與 git bisect 定位；一次一個可證偽假設，測試後才修；最小根因修正、跑回歸、grep 同類 bug；若根因是決策錯誤而非實作錯誤，指出應回 `/architect`；不做功能、不順手重構。

- `#L1-L259` — `skills/audit/SKILL.md` — 上下文啟動器：`AGENTS.md` 為 canonical、`CLAUDE.md` 只放 `@AGENTS.md` 指標；pre-flight 用 source 數、manifest、git 歷史與 monorepo 訊號選 phase（0 詢問、1 綠地問標準、2 全庫掃描、3 單區、4 gap-fill）；綠地順序是 roadmap → architect 選 stack → scaffold → audit；絕不覆寫既有文件，矛盾只回報不自動修；monorepo 先给每個 workspace 輕量 stub，按需深化。

- `#L1-L390` — `skills/architect/SKILL.md` — 決策架構師：四模式 FEATURE/ARCHITECTURE/ENHANCEMENT/CROSS-CUTTING；先做「已建置」與「產品級 vs 單一決策」檢查；framing 用推斷、設計輸入用詢問，嚴格一維度一問、建議一個選項、禁止打包整包 accept-or-change；資料模型必經 ASK→assemble→SHOW→confirm；ADR 形狀單檔或 umbrella（child + research，`## Structure` 讓每個檔案可被追溯）；狀態分 feature-linked（鏡射建置生命週期）與 standalone（ratify 即 Accepted）。

- `#L1-L125` — `skills/document/SKILL.md` — 技術寫手：四種文件 pr/changelog/release-note/postmortem，各有來源、讀者與輸出位置；主執行緒只收 git 與 ADR 路徑，subagent 讀 diff；pr 有三個 gh 檢查（安裝、remote、已存在）決定 chat-only/create/edit；postmortem 需向工程師問事故事實，禁止編造時間線；不會 commit、push 或 merge。

- `#L1-L152` — `skills/sync/SKILL.md` — 知識維護者：用 `--name-status` 區分新增/修改/刪除以判斷 net-new area 與 orphan 清理；只從 source 檔同步，文件/test/config 不當變更來源；可建立「本次才出現的整個區域」的巢狀文件，既有區域只 flag 給 `/audit`；可校正 ADR 的 Status 行與 roadmap 勾選（依 repo 證據），但不改 ADR 內容、不新增/重排功能；預設 NOTHING_TO_SYNC 是正常成功。

- `#L1-L272` — `skills/roadmap/SKILL.md` — 資深產品工程師：依現況推斷 plan/replan/add，不需子指令；訪談分三輪（MVP/商業、能力清單、橫切與 GTM），每個選擇都是 2–4 選項且恰好一個 recommended；選 build approach（Tracer Bullet/Skateboard/Facade/Journey）寫進 header 並傳播給下游；foundations-first（標準偏好、stack+scaffold、audit+tooling、資料模型、設計系統、walking skeleton）；每功能只給 intent、Done when、weight、Needs ADR 與一個入口 checkbox，build tasks 留給 ADR 派生；絕不選工具。

- `#L1-L116` — `skills/status/SKILL.md` — 唯讀簡報：讀 branch、dirty tree、ahead/behind、近期 commit；解析所有 roadmap（monorepo 分 workspace）算 planned/in-progress/done/existing/dropped 與續作點；列 ADR 狀態並偵測 ADR↔feature 漂移、dropped 功能 ADR、孤兒 ADR、未計畫程式碼；用團隊自己的 build approach/phase 語言描述進度；只報告，不動手。

- `#L1-L113` — `skills/harden/SKILL.md` — 系統級 principal engineer：界定變更後，把完整 `harden-guide.md` 注入 subagent；test signal 三態避免對 none-by-design 專案喊「缺測試」；輸出 `docs/hardening/<date>-<branch>.md`，risk posture 為 Ship as-is/Harden before merge/Do not ship；預設只診斷與列清單、不給 Edit，只有工程師指定單項才修並重述殘餘風險。

- `#L1-L250` — `skills/architect/agent-prompt.md` — 架構 subagent 的人格與前期規則：Staff/Principal 語氣（簡單勝聰明、無聊技術是優點、設計失敗路徑、三個時間尺度、營運現實）；明文禁止無建議的選單、因流行選技術、為想像規模設計、說「it depends」而不給答案；Step 0 先把專案 `AGENTS.md` 指到的社群 skill 知識載入，Step 0b 一律先挑戰前提（問題是否問對、是否已有決策、是否產品級）。

- `#L251-L609` — `skills/architect/agent-prompt.md` — 四種模式的施工指令：FEATURE 產出 `## Feature design`，ARCHITECTURE 產出 `## Proposed stack`，ENHANCEMENT 產出 `## Migration plan`（含回滾），CROSS-CUTTING 產出 `## Standard definition` 與強制方式；共同專家規則要求每個 AC 可觀察、build task 對應 AC、migration 為 task 1、不得空白維度；結尾固定 `/architect complete` 回報格式，主模型只注入當前模式區塊以省 context。

- `#L1-L388` — `skills/audit/agent-prompt.md` — 審計 subagent 模板：重申 AGENTS.md canonical/CLAUDE.md 指標/絕不覆寫/legacy 遷移；要求把 root `## Stack` 對齊架構 ADR、`## Build approach` 對齊 roadmap header，缺漏或矛盾要分別進 ROOT_GAPS/CONTRADICTIONS；定義各 phase 的掃描深度、巢狀文件判斷、root pointer 寫法與回報格式。

- `#L1-L56` — `skills/document/agent-prompt.md` — 精簡寫手模板：要求完全照傳入模板結構、以 diff 為事實來源（commit 訊息只是線索）、只讀相關 ADR；四種輸出目標的寫入規則（PR 文字永遠回傳、changelog 先匹配既有格式、release note 與 postmortem 寫固定路徑）；禁止行銷式空話與虛構功能。

- `#L1-L57` — `skills/harden/agent-prompt.md` —  hardening subagent 模板：內嵌完整 rubric；定位為「已經被 3am 叫醒過」的系統工程師，只找生產失敗模式不做功能驗收；無 Edit 工具，輸出只能是 checklist；要求每個項目有具體情境、影響半徑、緩解方式與驗證訊號。

- `#L1-L55` — `skills/review/agent-prompt.md` — 審查 subagent 模板：內嵌 `review-guide.md`，強調「你沒寫這段碼」的新鮮視角；只讀與寫 findings、沒有 Edit；注入 `AGENTS.md` 慣例、近期 ADR 與 test signal，讓它知道該不該把缺測試列為 finding。

- `#L1-L181` — `skills/sync/agent-prompt.md` — 同步 subagent 的權威規則：預設什麼都不做，若只是在 narrate 本次變更就是 churn；只能編輯既有 AGENTS.md、只能為 net-new area 建新檔（含 CLAUDE.md 指標）；ADR 只准改 Status 行；定義 roadmap 子任務對帳的證據來源、orphan 清理、idempotency 與衝突回報。

- `#L1-L60` — `skills/test/agent-prompt.md` — 測試 subagent 模板：內嵌 `writing-guide.md`；注入工具、安裝狀態、test dir/pattern、package root、run command、是否跑測試，以及每個檔案的 class 標籤；明確範圍固定為清單內檔案，越界即錯。

- `#L1-L264` — `skills/architect/adr-template.md` — ADR 骨架與欄位指引：Summary（20 秒可讀）、Context（只談問題不談選項）、Requirements（user stories + 可獨立檢查的 AC-N 合約）、Options（最多四個，pros/cons）、Decision、Rationale、模式專屬設計段、Consequences、Follow-up、References；同時是主模型的檔名、狀態值與 umbrella/child 結構指引，施工時只內嵌 `=== ADR TEMPLATE START/END ===` 之間的內容。

- `#L1-L63` — `skills/architect/questions/architecture.md` — ARCHITECTURE 模式的 fallback 第一輪問題：產品型態（web app/API/mobile/data pipeline）四選一，附帶每種的責任邊界與主要風險，讓主模型在主題太空泛時仍有結構化起點。

- `#L1-L63` — `skills/architect/questions/cross-cutting.md` — CROSS-CUTTING 模式 fallback：先問標準治理什麼（錯誤處理、日誌可觀測性、認證授權、程式結構命名），再據此收斂到單一可強制執行的團隊標準。

- `#L1-L63` — `skills/architect/questions/enhancement.md` — ENHANCEMENT 模式 fallback：先診斷現況病灶（擴展性、效能資源、可維護性、缺少能力），避免把「缺功能」誤當「舊設計壞掉」。

- `#L1-L65` — `skills/architect/questions/feature.md` — FEATURE 模式 fallback：先問功能替使用者解決什麼核心問題（降低摩擦、解鎖新能力、取代 workaround、提升可靠度），再把答案長成資料模型與驗收條件。

- `#L1-L15` — `skills/audit/patterns/clean-architecture.md` — Clean Architecture 慣例卡：domain/application/infrastructure/presentation 四層、依賴只能向內、use case 薄協調、domain 零框架依賴、跨邊界用 DTO、測試分層策略；供綠地 audit 以選項卡形式讓工程師挑架構風格。

- `#L1-L16` — `skills/audit/patterns/domain-driven.md` — DDD 慣例卡：bounded context、aggregate 一致性邊界、領域事件、ubiquitous language、value object、repository 介面由 domain 定義、anti-corruption layer 與 context map。

- `#L1-L16` — `skills/audit/patterns/functional.md` — Functional/Immutable 慣例卡：純函式預設、不可變資料、副作用推邊緣、組合優於繼承、避免共享可變狀態、用 Result/Option 取代例外與 null、測試因此不需要 mock。

- `#L1-L17` — `skills/audit/patterns/solid-oop.md` — SOLID + OOP 慣例卡：五大原則的可操作版本、建構子注入、禁止 service locator、類別 <200 行、組合優於深繼承、以行為命名、測試用 fake/stub 注入。

- `#L1-L95` — `skills/develop/checklist.md` — UI 無障礙與 token 檢查表：鍵盤巡覽、焦點可見性、語意 HTML、label/accessible name、ARIA 僅在原生語意不足時使用、色彩對比等 required 與 best-effort 項目；Phase 5 的完成閘門。

- `#L1-L99` — `skills/develop/logical-guide.md` — logical build 軌道：以 ADR 為規格、`AGENTS.md` 為慣例、鄰近程式為風格；Phase 1 ground（含發現 ADR 錯誤要停下回 architect）→ 2 data layer（migration 必須真的跑並確認 schema）→ 3 core logic（狀態機、idempotency、邊界驗證）→ 4 API（授權不只認證、列表必分頁、限流）→ 5 integration/config（secret 不進碼、webhook 驗簽與冪等）→ 6 cleanup。

- `#L1-L325` — `skills/develop/ui-guide.md` — UI build 軌道前半：三種入口（既有 `design.md`、截圖、都沒有）與 ADR 已決定設計系統時不得重問；brownfield 先擷取既有視覺語言；design.md 驗證、token 同步、堆疊與樣式庫偵測；Path A 從圖片像素級擷取 token；Path B 提供 5 個精選模板（Nike/PostHog/Raycast/Stripe/Supabase）或自訂風格並產出 `design.md`。

- `#L326-L646` — `skills/develop/ui-guide.md` — UI 軌道後半：字型安裝、資產解析（含無圖時的 placeholder 策略）、Facade 模式的假資料規則、五個實作 phase（語意結構 → token 套用 → 響應式 → 狀態與動效 → web 標準與無障礙）、完成回報格式；強調 UI 要服務專案選定的 build approach，Facade 不是預設。

- `#L1-L260` — `skills/develop/templates/nike.md` — Nike 設計系統模板的 token 段：frontmatter 色彩（黑白灰 + sale/success/info 語意色與分類點綴）與完整 token 命名，作為 `design.md` 的可複製起點。

- `#L261-L617` — `skills/develop/templates/nike.md` — 模板的敘事與施工規則：攝影優先、極端字體對比、8px 網格、元件規格（按鈕、表單、卡片、導覽、簽名元件）、do/don't；教模型如何把一個品牌的視覺語言拆成可執行 token 與元件決策。

- `#L1-L356` — `skills/develop/templates/posthog.md` — PostHog 模板 token 段：奶油色 canvas、橄欖灰文字、單一黃橘 CTA、卡通刺蝟插畫語彙；展示「開發者工具也能溫暖、有插畫」的設計方向。

- `#L357-L734` — `skills/develop/templates/posthog.md` — PostHog 模板施工規則：色彩語意、IBM Plex 字階、4–6px 圓角、卡片/程式碼/側欄/頁尾元件、插畫使用時機與 do/don't。

- `#L1-L329` — `skills/develop/templates/raycast.md` — Raycast 模板 token 段：近黑 canvas、單白 CTA、Inter ss03、細 1px 邊界與少量飽和分類色；示範「產品截圖即行銷頁」的暗色系統。

- `#L330-L716` — `skills/develop/templates/raycast.md` — Raycast 模板施工規則：表面階梯、紅色漸層 hero、command-palette 卡片、按鈕/輸入/導覽/頁尾元件與 do/don't。

- `#L1-L245` — `skills/develop/templates/stripe.md` — Stripe 風格模板 token 段：深海軍藍 ink、電光靛 primary、漸層 mesh、Sohne 細字重與 tabular numerals；示範金融基礎設施品牌的克制與可信感。

- `#L246-L517` — `skills/develop/templates/stripe.md` — Stripe 模板施工規則：漸層大氣層、卡片近白表面、儀表板反轉為暗色 shell、按鈕/表單/導覽/簽名元件與 do/don't。

- `#L1-L225` — `skills/develop/templates/supabase.md` — Supabase 風格模板 token 段：白與近黑、單一翡翠綠 CTA、humanist sans display、密度高的產品 UI 拼貼；示範「安靜的技術感」。

- `#L226-L493` — `skills/develop/templates/supabase.md` — Supabase 模板施工規則：綠作為唯一色彩事件、表面與邊界階梯、按鈕/卡片/表單/導覽/簽名元件、響應式行為與 do/don't。

- `#L1-L54` — `skills/document/templates/changelog.md` — Changelog 模板：優先沿用既有 `CHANGELOG.md` 格式，不存在才用 Keep a Changelog + SemVer 標頭；用 Edit 插入 unreleased 頂部、禁止重寫舊条目、要求冪等避免重複條目。

- `#L1-L58` — `skills/document/templates/postmortem.md` — 無責備事故報告模板：severity/duration/user impact 表、摘要、時間線、根因與 contributing factors、偵測與回應、做對了什麼、action items；只寫工程師提供的事實，不編造。

- `#L1-L43` — `skills/document/templates/pr.md` — PR 模板：標題 imperative ≤72 字並遵循專案 commit 慣例；body 為 What/Why（連 ADR 或 ticket）/Changes/Test plan/Risk；gh 動作僅限 `GH_ACTION` 指定的那一個。

- `#L1-L41` — `skills/document/templates/release-note.md` — Release note 模板：以終端使用者為讀者，把技術變更翻成「你現在可以做什麼」；Highlights/Improvements/Fixes 分層，語氣避免內部術語。

- `#L1-L149` — `skills/harden/harden-guide.md` — 生產失敗模式分類法：併發與競態、規模與效能、資源耗盡、網路與部分失敗、時間與狀態、惡意輸入與安全、資料完整性、可觀測性；嚴重度（must-fix/should-harden/watch）與整體 posture；每個項目必須有具體情境、影響、緩解與「用什麼驗證」，並定義 checklist 檔與回傳摘要格式。

- `#L1-L133` — `skills/review/review-guide.md` — 審查 rubric：依序看正確性、安全、錯誤處理與韌性、效能規模、API 合約、可維護性、慣例與 ADR 遵從、測試充足度；嚴重度 Blocker/Major/Minor/Nit 與合併影響；test signal 三態決定是否把缺測試列為 finding；findings 必須 file:line、有理由、可行動。

- `#L1-L121` — `skills/roadmap/roadmap-template.md` — 路線圖實際形狀：兩部分（At a glance 表 + 按 phase 分組的功能段），每個事實只出現一次、不寫 n/a；功能段是 heading + intent + 單行 Done when + checkbox tasks + 指標行；含單檔、epic-split、brownfield 登錄、foundation 範例與完成回報 block。

- `#L1-L202` — `skills/test/writing-guide.md` — 測試撰寫規則：不得改 application code；既有測試只延伸不覆蓋；config 只在必要時最小新增；安全敏感檔案預設加未授權/過期/洩漏案例；各 class 的策略（logic 純單元、component 以使用者可見行為斷言、page 用 E2E、api 整合、cli 程序呼叫）；覆蓋優先序 happy path → edge → error；迭代到綠並在報告區分測試錯與真 bug。
