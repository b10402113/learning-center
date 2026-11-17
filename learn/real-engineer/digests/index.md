---
source: sources/real-engineer/20261116/supplement/index.html
source_type: text
source_lines: 1655
status: absorbed
absorbed_at: 2026-11-17
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 這是同一門課（Software Factories for Real Engineers，103 章、64 題 quiz）的**閱讀版**，把 105 支字幕整理成乾淨的書面散文，並補上字幕沒有的表格、程式碼區塊與截圖說明。可以拿它對照字幕：字幕是口語的推理過程，這裡是收斂後的書面版本。
- 八個部分依序是：`Before We Start`（心智模型與環境）、`Language`（GLOSSARY.md 與 ADR）、`Planning`（Wayfinder 的地圖、霧、frontier 與四種 ticket）、`Review`（三種煞車、PR skill、`/code-review`、retro）、`Codebase Design`（deep／shallow module、seam、locality、leverage）、`Feedback Loops`（把規則變成可執行的檢查、mutation testing、data sources）、`Software Factory Part One`（trust ladder、sandbox、GitHub Actions 上的第一個 implementer）、`Software Factory Part Two`（自己挑基礎設施、ratchet、rebase、slow-query monitor、workflow 設計）。
- 全課的論證順序是「先裝煞車、再踩油門」：第一部分先建立信任（review、語言、規劃、程式碼設計、自動檢查），第二部分才把工作丟給工廠平行跑。這順序本身就是課程的主張——沒有煞車的加速只是更快產出 slop。
- 每個 `## ` 小節尾端帶 `#` 錨點，章節之間有 `Previous`／`Next` 導覽；每章結尾可能有 quiz 標記，但答案不在此檔，靠瀏覽器 localStorage 保存作答進度。
- **引用注意**：這份檔案的分章是「一章一行」——103 章壓在 49 個超長行裡，最小引用單位是一個章節（單行可達 10 萬字元）。少數把長段落拆成 `<span class="ln">` 逐行的章節（例如 `#L399-L403` 的 `/grill-with-docs` 開場 prompt）才有可用的行級定位；其餘要引用具體段落、指令或程式碼，請改引 `course/` 下的字幕 `.txt`。

# L2 detail

- `#L1-L372` — 檔案前段：`<head>` 的樣式與主題、側邊導覽目錄（103 章與 quiz 標記）、搜尋框、localbar 與內容容器。沒有課程內容。
- `#L373-L386` — 目錄頁（masthead，宣稱 103 章／64 題／475 分鐘）＋ `Where We're Going`（承諾與問題、課程形狀、crash course、煞車與加速器、任何 agent 都行、你會得到什麼、真實工程原則）＋ `Which Model Should I Use?`（為什麼模型選擇在此重要、訂閱而非 API、該用哪個模型）＋ `Setting Up Your Agent`（任何跑在 terminal 的 agent、Opus 等級模型、小心全域設定、讓 agent 自己動手做）。
- `#L387-L396` — `Navigating The Discord`（公開頻道、crash course 與 cohort 頻道、取得解答、權限、moderator）＋ `Office Hours`（排程、選修、連結、在 Discord 提問與投票、急件）＋ `Repo Setup`（clone、fork、安裝依賴、之後需要的註冊、疑難排解）＋ `How To Take This Course`（`npm run reset` 會刪掉既有工作、用 `npm run cherry-pick` 保留、解衝突、pull upstream、reset 後 install／migrate／seed）＋ `Domain Language` 開頭（共享詞彙、語言不一致的代價、drift 也在程式碼裡）。
- `#L397-L398` — `Using Grill with Docs` 的練習說明（找到正確的詞、建立 `GLOSSARY.md`、統一程式碼、驗證 UI）。
- `#L399-L427` — `Using Grill with Docs Solution`：一個概念四個名字的完整處理流程（跑 `/grill-with-docs`、第一輪命名、第二輪情境測試「一個詞還是兩個詞」、退款生命週期、面向學習者的文案、改程式碼、剩下什麼）。
- `#L428-L460` — `ADRs`：為什麼程式碼記得住「做了什麼」卻記不住「否決了什麼」、ADR 的格式、為什麼 ADR 放在 `docs/adr` 頂層、ADR 與次級來源的差別。
- `#L461-L514` — `Writing an ADR` 練習＋解答：以「批准退款後 enrollment 與進度怎麼辦」為題，用既有 glossary 詞彙 grill 批准畫面，決定哪些決策值得寫成 ADR，實作 enrollment／purchase／進度／admin 兩種語意的釐清，產出四份 ADR。
- `#L515-L540` — `Pruning the Glossary` 練習＋解答：從臃腫的 glossary 剪回 domain 詞——逐題處理實作細節與一般程式詞、`slug`、過期的 watch 上限、`enrollment` 與「place on a course」、`Lapsed`、`learner` 還是 `student`（用出現次數決定）、標題，最後同步 ADR 與程式碼。
- `#L541-L564` — `Pruning ADRs` 練習＋解答：用三問判準逐份檢查 11 份 ADR，分辨 delete 與 deprecate，讓 agent 拿 ADR 對照程式碼找 drift，最後留下健康的幾份並記錄「被否掉的選項」。
- `#L565-L565` — `Q&A`（一份 glossary 夠不夠、何時更新、怎麼挑詞、是否先有 glossary、agent 能不能自己擁有 glossary、延伸閱讀）＋ `The Limits Of One Session`（單一 session 的極限、dumb zone、從 Shape Up 借 planning fidelity、agent 讓高 fidelity 規劃變可行、Wayfinder 登場）＋ `Charting The Way`（取得 skill、map 的開場、destination、map 的細節、fog of war、blocking 與 frontier、清霧、四種 ticket、怎麼呼叫 Wayfinder）。
- `#L566-L575` — `Chart The Map` 練習＋解答：兩條路徑、兩輪 grilling、抵達共識；示範怎麼把一個大功能畫成 map 並認出第一個 frontier。
- `#L576-L577` — `Grilling Ticket` 練習：研究結果回來後，怎麼從 ticket URL 開場、問到決策收斂、把 resolution 寫回並關票。
- `#L578-L579` — `Grilling Ticket 2` 練習：第二張 grilling ticket 的起始狀態。
- `#L580-L589` — `Grilling Ticket 2 Solution`（開始 session、決定要不要用 Knock、額外註冊、定價懸崖、感受霧、prototype 要證明什麼、備案、什麼要等 prototype、擴張地圖、學到什麼）＋ `Task Ticket` 練習＋解答（在 agent 外用 wizard、產出的 `.env`、驗證設定、把 resolution 記回 issue）＋ `Prototype Ticket` 練習＋解答（為什麼 prototyping 是 Wayfinder 最有趣的部分、認領 ticket 開 spike、第一份報告、跟 agent 要 wizard、分階段把 workflow 打出來）。
- `#L590-L590` — `Finish The Map` 練習（把剩下的 ticket 走完、清霧）＋ `Finish The Map Solution` 開頭＋ `Spec → Implement` 開頭（`/to-spec`、`/to-tickets`、`/implement-spec` 三步）。
- `#L591-L626` — `Spec → Implement Solution`：把清完霧的地圖寫成 spec、讀 spec、瀏覽器裡的 QA、前期規劃的好處。收斂成「規格 → 工單 → 平行實作 → 端到端驗證」的完整一次。
- `#L627-L654` — `Grill vs Wayfinder vs Ship First`（三個選項、決策樹、diff 很小嗎、先從 Grill with Docs 開始、什麼時候升級 Wayfinder、決策樹總結）＋ `The Three Kinds Of Review`（三道煞車、這一節要涵蓋什麼）＋ `The PR Skill`（改善人審的目標、agent 寫的 PR 描述很糟、show-me skill、改造成 PR body）。
- `#L655-L663` — `Running The PR Skill` 練習＋解答（怎麼排 PR 的優先序、one-way 與 two-way door、變更的 blast radius、優先序因專案而異、跟 agent 要 PR body、貼上提議的 body、讀 Summary）。
- `#L664-L669` — `The /code-review Skill`：為什麼不叫 implementer 第一次就做對、怎麼載入 review agent、`CODING_STANDARDS.md` 還是 `AGENTS.md`。
- `#L670-L673` — `Testing Out The Code Review Skill` 練習＋解答（standards 報告、對判斷題的指示、spec 報告、改了什麼、推修正、改寫 PR 描述、收尾）。
- `#L674-L721` — `Why Retro`（人審的第三個透鏡、審流程而不只是 diff、retro skill、retro 做什麼、怎麼找到 session、為什麼值得跑）＋ `Trying Out Retro` 練習＋解答（審 UI 標籤與測試設定、為什麼 retro 撐起人審）。
- `#L722-L760` — `Rescuing A Legacy Codebase`（codebase 就是 agent 的環境、複雜度與易於修改、tactical 與 strategic programming、你必須承擔 strategic 的責任）＋ `A Language For Good Codebases`（tautological test、leverage、locality、可以忘記實作、回到測試、讓壞測試變成不可能）。
- `#L761-L835` — `Searching For Shallow Modules` 練習＋解答（修 shallow module 的兩條路、寫 prompt、候選一：mega file、能通過 deletion test 的小模組、建議順序、為什麼有效）。
- `#L836-L878` — `Seams & Adapters`：seam 的定義、adapter 的定義、回到 agent 的提案、recap。
- `#L879-L920` — `Making Legacy Code Testable` 練習＋解答（為什麼這個 loader 難測、該瞄準的方向、寫 prompt、確認測試會失敗、為什麼這是贏）。
- `#L921-L923` — `Enforcing Module Boundaries` 練習：用自動化檢查把模組邊界釘住。
- `#L924-L979` — `Enforcing Module Boundaries Solution`（跑 setup skill、範例模組、收尾）。
- `#L980-L1053` — `/improve-codebase-architecture` skill（怎麼運作、練習）＋解答（用 prompt 跑、報告、候選一：把 per-course access 收成一個 deep module、候選二：分開「誰在問」與「他能做什麼」、候選三：命名並統一批價國家規則、候選四跳過、最上位的建議、探索候選一至三、為什麼共享語言重要）＋ `/implement-spec For Refactors`（接著上一課、Q1–Q8、Q9–Q14 的 Person／capabilities／術語、更新 glossary）。
- `#L1054-L1059` — `Making Bad Code (Nearly) Impossible`（一堆自動檢查、兩部分：自動檢查與資料來源、更好的回饋迴路、你會得到什麼）＋ `Pruning CODING_STANDARDS.md` 練習＋解答開頭。
- `#L1060-L1077` — `Pruning CODING_STANDARDS.md Solution`：六個發現（沒有護欄、約 30 條可變成 lint 規則、過期且互相矛盾、schema 規則可寫成一條 Vitest、流程規則不屬於 code review 檔案、no-op），什麼該留，把檔案砍短並存下 lint 規則，把 skill 當參考資料用，結果，lint 規則的要旨）＋ `Our First Automated Checks` 練習＋解答開頭。
- `#L1078-L1091` — `Our First Automated Checks Solution`（跑 prompt、agent 裝了什麼、`lint-staged` 設定、跳過 hook、收尾）＋ `Speeding Up Our Automated Checks`（為什麼速度重要、序列與平行、怎麼下 prompt、基準時間）。
- `#L1092-L1096` — `Writing A Custom Lint Rule` 練習：`sql.raw` 注入這類現成 linter 抓不到的問題，該自己寫規則。
- `#L1097-L1130` — `Writing A Custom Lint Rule Solution`（寫 prompt、agent 找到漏口並寫出規則、讀規則、自訂 lint 規則適合的時機）。
- `#L1131-L1141` — `Mutation Testing` 練習＋解答（對 diff 跑 mutation testing、讀 HTML 報告、把整個檔案變異、存活的 mutant、補上缺口、它新增的測試、mutation score 是資訊不是門檻、在哪裡跑）。
- `#L1142-L1149` — `Data Sources`（環境不只 codebase、agent 可能缺什麼、blind 與 data-rich、可以接上的資料來源、回饋迴路）＋ `Diagnosing Bugs` 練習＋解答開頭。
- `#L1150-L1156` — `Diagnosing Bugs Solution`（agent 伸手拿 Playwright、讀瀏覽器 console、回饋迴路、修正、讀數、為什麼能取得資料很重要）＋ `Verifying Frontend Apps`（這個 bug、agent 怎麼知道 agent-browser、練習）。
- `#L1157-L1174` — `Verifying Frontend Apps Solution`（看 agent 重現 bug、瀏覽器驗證會不會太貴、驗證值得更高成本、PR、before／after 證據、自己再確認一次、為什麼更豐富的證據重要）。
- `#L1175-L1181` — `Our Factory's Goal`（trust ladder、合併的五個步驟、human in the loop、把步驟翻成 AFK、自動合併部分 PR、software factory）＋ `Sandboxing The Factory` 開頭（agent 能跑在哪兩個地方、為什麼本機難擴、為什麼遠端好擴、協作）。
- `#L1182-L1207` — `Sandboxing The Factory` 續（挑遠端供應商、為什麼是 GitHub Actions、用 Sandcastle 跑 agent、本機與遠端並用）＋ `Setting Up Secrets And Permissions`（加上 factory workflow、為什麼需要 factory PAT）。
- `#L1208-L1343` — `Running Your Own Coding Agent`（setup 收尾、factory 在哪裡挑它的 agent、從這裡改用 cherry-pick、到這裡你應該有什麼）。
- `#L1344-L1352` — `Your First Implementer` 練習：按下按鈕、看它跑、workflow 檔長什麼樣。
- `#L1353-L1369` — `Your First Implementer Solution`（收尾）。
- `#L1370-L1413` — `Splitting Build From Review` 練習＋解答（貼上 label、workflow 檔、收尾）。
- `#L1414-L1423` — `Retro A Run` 練習＋解答開頭：對一次遠端執行跑 retro。
- `#L1424-L1425` — `Explore Before You Commit` 練習：commit 前先讓 agent 探索。
- `#L1426-L1443` — `Explore Before You Commit Solution`（在 Actions 找到那次執行、讀結果、下一步）。
- `#L1444-L1445` — `Chaining The Whole Factory` 練習＋解答開頭＋`What Infrastructure Do I Need?`（為什麼要離開 GitHub、本課計畫、ticket tracker、git host、runner、orchestrator、observability、哪些決策先做、作者自己的設定、這些零件怎麼接）＋`Choosing Your Infrastructure` 練習＋解答開頭＋`Whiteboard Your Own Tasks`（把 agent 留在白板外、設模板、hotkeys、讀圖、分支邏輯）＋`Improve Codebase Architecture` 練習＋解答開頭。
- `#L1446-L1454` — `Chaining The Whole Factory Solution`（手動串接、implement run、before／after 證據、review 落地、留給人的決策、為什麼這是高品質資產）＋`Choosing Your Infrastructure Solution` 續（把對話轉成 spec）＋`Improve Codebase Architecture Solution` 續（調數字、沒有人在環裡的版本、在 runner 裡實作的問題、比較兩個設計、帶走什麼）＋`The Ratchet`（為什麼要 ratchet、要補的缺口）。
- `#L1455-L1455` — `The Ratchet Solution` 開頭（從迴圈開始、找一個失敗並修掉、把數字調高、第二個觸發、兩種等級的 lint 規則）。
- `#L1456-L1655` — 收尾九章：`The Morning Rebase`（抓出過期的 PR、一個 runner 一個 PR、先試確定性的 rebase、衝突才開 agent、用 label 當第二個觸發、非happy path、加速或減速、讓 ticket tracker 與 git host 同步）＋`The Slow-Query Monitor`（為什麼推送警報是問題、把警報放進佇列、避免重複開票、觸發修復 runner、佇列可以是什麼、從 push 到 pull、依嚴重度過濾、整條迴圈、這個模式的其他用途）＋`Prototyping`（第三種裁決、提早 prototype、難的是迭代、prototype 存在後才貼評論、人的反應、人怎麼進場）＋`Implement Spec`（從被標記的 spec 開始、`/to-tickets` 迴圈、探索步驟、找出 frontier、設計一：每個 frontier 一個 runner、它的問題、設計二：每個 ticket 一個 runner）＋`Wrapping Up`（每一節如何餵養 software factory、告別）。
