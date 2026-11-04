---
source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt
source_type: text
source_lines: 764
part: 3
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- Sub-agent 的視窗模型 — 子代理在自己的 context window 裡讀取，只有摘要回到主代理；它從乾淨的視窗開始，看不到主對話、已讀檔案或已載入的 skill，只拿到一則委派訊息。
- Few for building, many for reading — 兩個同時改同一份 code 的子代理互相看不到對方的改動，會產生 rename 衝突與不一致的錯誤處理；讀取型任務不會衝突，可平行。要平行建置就各自開 git worktree（`claude --worktree` 或 `isolation: worktree`），事後像 PR 一樣合併。
- Less is more — 十個代理不會讓結果好十倍：每個子代理都要重讀已知內容、摘要會遺失細節、主代理要花自己的視窗拆分與合併，成本變三到十倍而品質常常沒變好。原則：先從單一代理開始，只在「以讀取、審查、驗證為主」的工作加子代理。
- Lesson 2.5 Hooks — AGENTS.md 的規則只是文字，模型沒有義務遵守（研究顯示一條簡單規則的遵循率約三分之二，改動既有 code 時不到一半）。Hook 是 harness 在固定時點（session 開始、執行指令前、編輯檔案後、宣告完成時）自動執行的腳本，分「阻擋」與「告知」兩類；阻擋不讓代理崩潰，而是回傳原因讓它改走別條路（`exit 2` + stderr 即理由）。
- Rules or hooks — `settings.json` 的 permission rules 只對單一工具與樣式做 yes/no；hook 對每一次呼叫執行你的程式，因此能涵蓋所有觸達該檔案的工具（例如 deny 讀 `.env` 擋不住 shell 的 `cat .env`）。
- 前五個該建的 hook — 阻擋危險指令、擋住 secrets、測試 gate（agent 說完成時跑測試，紅燈就阻擋並把失敗輸出放回 context）、每次編輯後跑 type check 只回報該檔錯誤、session 開始載入 git status 與決策檔；課程套件在 `m2/five-hooks/`，另有保護測試設定與完成通知兩個加分 hook。
- The audit — 逐行檢查 AGENTS.md：這行是否指向一個「事件」？是事件就變成 hook；是判斷（如金額用整數分）就留在文件；兩者都不是（如「寫乾淨的 code」）就刪掉。
- Routing and recovery — harness 的第四部分：每次呼叫選模型、失敗時復原（fallback 鏈、重試、簡單工作換便宜模型），第 8 章實作。
- Chapter 3 Verification Engineering — code review 回答三問：能不能用、是否做對的東西、是否做對；本章處理第一問。三種「測試通過卻在說謊」：測試沒驗行為（mutation testing 抓）、重要案例缺漏（property testing 抓）、各部件都過但整合壞掉（end-to-end 抓）。
- Lesson 3.2 Mutation testing — coverage 只算被執行到的行，不代表有斷言（TicketBay 退款模組刪光斷言仍 100%）。Mutation testing 逐一對 code 做小改動（mutant），測試失敗即 killed、全過即 survived；四類 mutator：operator、conditional、statement、value。工具：Stryker、Pitest、mutmut、cargo-mutants；mutation score = killed / 全部。葉子塗抹醬的比喻：coverage 是麵包被塗滿的比例，mutation score 才是塗了什麼。
- Lesson 3.2 實務 — mutation-testing skill 會安裝工具、找出缺漏測試、用一句話解釋每個存活 mutant、補測試後重跑確認。規則：只 gate 改動的行、從無聲 bug 代價最高的 code 開始、不 gate 全 repo 分數、不讓代理自行判定 equivalent mutant。equivalent mutant（改動對所有輸入結果相同，如 `> 100` 與 `>= 100` 都被 cap 在 100）要用註解標明排除。
- Lesson 3.3 Property testing — example test 一人一例、無法覆蓋輸入組合，而代理寫的一萬個測試又難維護且吃 context。property test 四步：定義性質、工具產生大量輸入組合、逐一執行、驗證性質；失敗時 shrink 到最小可重現輸入。性質如對稱性、非負性、一致性；API 性質：任何請求都不得 500 且必為 JSON。程式庫：fast-check、Hypothesis、jqwik、FsCheck、proptest。它是 unit test 之上的額外層，適合有規則的領域（金錢、四捨五入、解析、狀態），glue code 效益低。
- Lesson 3.4 End-to-end testing — Playwright 用真瀏覽器走關鍵流程（訂票、付款、退款），斷言使用者可觀察的行為而非資料庫或內部狀態，數量少、每個 PR 都跑。Testcontainers 用 Docker 起拋棄式資料庫／broker／瀏覽器，映射隨機埠、等待就緒、結束即刪，真實資料庫比 mock 更能拒絕代理的錯誤假設。
- Decision LLM 與 QuickE2E — 一般 LLM 代理在瀏覽器測試每步都要數秒與 token，腳本測試又怕 UI 改動。decision LLM（如 Jev）只從選項中做選擇、給分數或信心值，不生成文字，快約百倍、便宜約三百倍。QuickE2E（`dmoka/quicke2e`）以 decision LLM 走合法動作清單達成目標：測試檔宣告目標與可輸入值、開啟頁面列動作、LLM 選一步、程式驗證結果；skill 會為每個流程寫 happy path、邊界、規則破壞、攻擊四類案例，通過後可產出 Playwright 測試；付費走 OpenRouter、成本低於十分之一美分，Apple Silicon 可本機免費跑。發現的問題仍需人工判斷是否真是 bug。
- Lesson 3.5 Testing legacy apps — legacy code 是沒有測試的 code，多半只是未測而非壞。單元是「透過 public API 觀察到的單一業務行為」，不是方法或類別；測試要公開 API、斷言結果、不測私有 helper、不 mock 自己的模組（只 mock 不屬於你的外部系統）。
- 五種 test double — dummy（佔位無行為）、stub（回傳固定值）、spy（記錄呼叫供事後斷言）、mock（預錄期望、驗證外向互動）、fake（輕量可運作實作，如 in-memory repository）。代理預設什麼都用 mock；在 codebase 留一個手寫 fake 並在 prompt 指向它，代理模仿既有樣式比遵守通則可靠。
- Legacy 四步 — 1) 讓它可測：用 seam 換掉資料庫、API、佇列、時鐘等依賴，快或業務邏輯依賴的依賴保持真實；2) 理解它：characterization test 釘住現行行為（先寫預期失敗的斷言、跑、再改成實際結果），大輸出用 approval test；3) 覆蓋行為：property test 補輸入、coverage 找沒跑到的行、mutation 找沒驗的行為；4) 最後重構，之後刪掉 approval test。課程示範 payout report 由 85 升到 91 分、79 個測試在重構後全綠。
- Lesson 3.6 The gate — 代理可能跳過或謊報測試，人也會忘；gate 在每個 PR 用同樣方式跑所有檢查並設為 required，GitHub 便會擋下紅燈合併（包括代理開的 PR）。TicketBay 用一個 `.github/workflows/gate.yml` 六條平行 lane：fast tests、整合測試（真 Postgres）、瀏覽器流程、API properties、mutation testing、gitleaks secret scan；前後約兩分半，再開 branch protection。mutation 只跑 PR 改動的行；secret scan 掃全部 git 歷史，找到就撤銷並換新 key。
- More gates for agent code — 六類 CI 檢查專抓代理留下的模式：把重複的 review 意見變成 lint 規則（ESLint、SonarQube、Semgrep、CodeQL）；architecture test（如 ArchUnitNET）檢查命名、擺放與依賴方向；type-system guardrails（`strict`、`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`、禁 `any` 與 `@ts-ignore`，並用 discriminated union 取代 boolean flag 以避免不可能狀態）；contract test 守住系統邊界；supply-chain guardrails（audit、Renovate、lockfile 紀律，加上套件年齡門檻，三天是實用預設）；migration linter（Squawk、strong_migrations）擋住會鎖大表的 migration。
- TDD with an agent — 紅綠重構三角色拆分：你寫或核准失敗的測試（測試即規格，用可執行形式定義 done），代理只寫讓測試通過的最小 production code，最後一起在有測試保護下重構。常見的反向流程（代理先寫 code 再補測試）會讓測試源自實作而非意圖，把 bug 一起鎖進去。修 bug 也先寫紅燈測試（bug-triage skill、TicketBay debug runbook），修好後測試留在套件裡防回歸。

# L2 detail

- `#L1-L3` — 子代理視窗的延續說明：只有摘要回到主代理，子代理從乾淨視窗開始，看不到主對話、已讀檔案或已載入 skill，只拿到一則委派訊息。
- `#L4-L10` — 章節頁碼與圖說：子代理在自己的視窗讀取，只有摘要回來。
- `#L11-L31` — Few for building, many for reading：兩個改同一份 code 的子代理互不相見，會 rename 衝突與不一致的錯誤處理，因此 code 只給一個代理改；讀取型代理不衝突可平行（研究功能、找出改動觸點、用乾淨視窗審 diff）。要平行建置則各開 git worktree（`claude --worktree`、`isolation: worktree`），各自分支、事後像 PR 合併。
- `#L32-L55` — Less is more：十個代理讓成本變三到十倍而結果常沒更好，因為重讀、摘要失真、主代理花視窗拆分與合併；Anthropic 觀察到複雜多代理設定不比一個好 prompt 的單代理好。何時加子代理的判準，以及課程示範（五個子代理平行研究 2FA，各讀約 171,000 tokens，主代理訊息約 31,000 tokens）。
- `#L56-L65` — Lesson 2.5 開場：AGENTS.md 規則只是文字、無強制力；研究顯示一條「每個函式開頭加一行註解」的規則在既有 code 上遵循率不到一半，於是「完成前跑全部測試」常變成只跑鄰近測試就回報全綠。
- `#L66-L103` — Hook 的定義與兩種用途：harness 在固定時點自動執行的腳本，分「阻擋」（gate，擋指令或擋完成）與「告知」（檢查剛寫的檔案、記錄指令、session 開始載入 context）。阻擋不讓代理崩潰而是回傳理由，範例 `protect-secrets.sh` 用 `exit 2` 與 stderr 訊息引導改讀 `.env.example`。並比較 permission rules（單一工具 yes/no）與 hook（每次呼叫跑你的程式、涵蓋所有工具）。
- `#L104-L164` — 前五個 hook 表格：擋危險指令（`rm -rf`、force push、drop database）、擋 secrets、測試 gate（紅燈阻擋並把失敗輸出放回 context，綠燈不花 context）、編輯後 type check 只回報該檔錯誤、session 開始載入 git status／近期 commit／決策檔；課程套件 `m2/five-hooks/` 另有保護測試設定與完成通知兩個加分 hook，整個 `.claude` 資料夾可直接複製。
- `#L165-L204` — `settings.json` 的 `Stop` hook 設定與 `test-gate.sh` 實作：以 `npm run test:unit` 為預設、`MAX_ROUNDS=3` 為迴圈保護，紅燈時用 jq 輸出 `{decision:"block", reason:...}`，超過三輪才放行並提醒你自己看測試。
- `#L205-L237` — The audit：逐行問 AGENTS.md 是否指向事件；「完成後跑測試」「不要讀 .env」是事件→變 hook，「金額用整數分」是判斷→留文件，「寫乾淨 code」兩者皆非→刪除。接著簡述 harness 第四部分 routing and recovery（fallback 鏈、重試、簡單工作換便宜模型，第 8 章實作）。
- `#L238-L264` — Chapter 3 開場：Verification Engineering，用 mutation、property、end-to-end 與 gate 證明代理的 code 可用；並界定 code review 三問中本章只回答「能不能用」，另外兩問留給第 4 章。
- `#L265-L318` — Lesson 3.1：測試通過仍可能說謊的三種方式與對應檢查——只驗有回傳不驗正確（mutation testing）、重要案例缺漏（property testing）、各部件皆綠但整合壞掉（end-to-end）。結論：再聰明的模型也得靠你寫進 repo 的測試來證明，因為它不知道你的測試指令、測試資料與 app 中 done 的定義。
- `#L319-L395` — Lesson 3.2 前半：coverage 誤用（只算執行行數，不算有無斷言）、mutant 與 killed/survived 的流程、`canDrinkAlcohol` 缺少 18 歲案例的示範、四類 mutator（operator、conditional、statement、value）、各語言工具、Stryker 指令與報告欄位、mutation score 定義與麵包塗醬比喻。
- `#L396-L433` — Lesson 3.2 後半：mutation-testing skill 的四件事與優先順序（金錢、權限、資料寫入），課程示範六個存活 mutant 中只有一個能改動 payout；四條規則（只 gate 改動行、從代價高處開始、不 gate 全 repo 分數、equivalent mutant 須先問人）；equivalent mutant 的成因與 `// Stryker disable next-line` 排除格式，以及太多 equivalent mutant 時縮小範圍的取捨。
- `#L434-L504` — Lesson 3.3：example test 的侷限與代理大量寫測試的維護／context 成本；property test 四步與 shrink；最短距離函式以對稱性、非負性、一致性三個性質取代五十萬對輸入；TicketBay 的 API 性質（永不 500、必為 JSON、錯誤格式）與 fast-check 程式碼；示範在第 52 個請求後失敗並縮到含 null byte 的 event id；各語言程式庫與適用／不適用場景。
- `#L505-L535` — Lesson 3.4 前半：Playwright 只寫關鍵流程、斷言使用者可觀察結果、安裝與執行指令；Testcontainers 啟動拋棄式 Postgres 的程式碼、隨機埠與清理機制、真實資料庫勝過會配合錯誤假設的 mock。
- `#L536-L569` — Decision LLM 與 QuickE2E：decision LLM 只輸出選擇／分數／信心值，速度快百倍、成本低三百倍；QuickE2E 的四步動作迴圈、四類案例（happy path、邊界、規則破壞、攻擊）、相對 Claude Code 瀏覽器工具的效能與成本、付費與本機選項，以及「每個發現都要自己確認是否為 bug」與雙折扣碼導致 500 的示範。
- `#L570-L599` — Lesson 3.5 前半：legacy code 即無測試的 code 且改動有風險，代理常寫出耦合結構的壞測試；定義「單元＝透過 public API 暴露的單一可觀察業務行為」；四條測試規則（測公開 API 行為、斷言結果、不測私有 helper、不 mock 自家模組）。
- `#L600-L648` — 五種 test double 對照表（dummy、stub、spy、mock、fake）與各自適用場景，重點是代理預設全用 mock；建議在 codebase 保留一個手寫 fake 並在 prompt 中指向它，因為代理模仿既有樣式比遵守通則可靠。
- `#L649-L672` — Legacy 測試四步（可測化與 seam、characterization／approval test 理解現況、property＋coverage＋mutation 覆蓋行為、最後重構並刪 approval test）；TicketBay payout report 的案例（保留真資料庫、時鐘與 email 開 seam、mutation 85→91、79 測試全綠）與 legacy-testing skill 的用法（提計畫、經核准後執行、你驗收測試與分數）。
- `#L673-L696` — Lesson 3.6：gate 的必要性（代理會跳過或謊報、人會忘），`gate.yml` 六條平行 lane 與 branch protection；mutation 只跑改動行、secret scan 掃全歷史並在洩漏時撤銷換 key、整體約兩分半。
- `#L697-L743` — More gates：六類針對代理 code 的 CI 檢查——重複 review 意見轉 lint 規則（ESLint／SonarQube／Semgrep／CodeQL）、architecture test（ArchUnitNET）、type-system guardrails（tsconfig 三個旗標、ESLint 禁 `any` 與 `@ts-ignore`、以 discriminated union 取代 boolean flag）、contract test、supply-chain guardrails（audit／Renovate／lockfile／三天套件年齡門檻）、migration linter（Squawk、strong_migrations）。
- `#L744-L764` — TDD with an agent：紅綠重構三角色拆分，你負責失敗測試（即可執行規格），代理只寫最小 production code，再一起重構；批評「先寫 code 再補測試」會讓測試源自實作而鎖住 bug；修 bug 也先以紅燈測試重現（bug-triage skill、TicketBay debug runbook），修好後測試留作回歸保護。
