# 學習爬塔（Learning Climb）— tier 驗證、node 進度、預習筆記、codebase 來源

Status: ready-for-agent
Feature: learning-climb
Created: 2026-08-12

## Problem Statement

學習者有一張「知識星雲」塔地圖（`knowledge-map`，v0.1）：每個 subject 的 tier 是樓層、path 是 tile、progress 只記「整條 path 通關」。但這張地圖目前只是**瀏覽與手動點亮的看板**，不是一個可以爬的塔：

- **沒有關卡感。** 學完一個 tier 的全部 path 後，沒有「頭目戰」驗證這層真的懂了；學習者可以直接點進下一層，沒有遊戲的推進感與成癮性（殺戮尖塔 Slay the Spire 的爬塔體驗）。
- **進度顆粒度太粗。** 只能標記整條 path 完成，不能把 node（可複用的關鍵概念）標成已完成；學過的關鍵字與還沒複習的關鍵字無法一眼分辨。
- **沒有預習緩衝。** 每條 path 的 `Prerequisites` 是 node 層面的零散提醒，沒有一篇「開始前先建立初步概念」的預習筆記；直接讀長文章容易認知負荷過載。
- **材料種類受限。** 目前 `sources/` 只支援 PDF（`pdftotext`）與字幕檔（`tune/` 的 srt/txt/vtt）。學習者想學習一個開源 repo（整個 CodeBase）時無路可走。
- **驗證工具錯位。** 現有 `/grilling` 是「設計決策訪談」（拷問你的計畫），不是「出題考你、判答、通關」的知識驗證工具。

學習者想要的不是更漂亮的看板，而是一個**有回饋迴圈的爬塔遊戲**：每一層的大關卡學完 → 打頭目戰（AI 出題、判答）→ 正確才解鎖下一層。同時保留自由選擇權：同一層有多條 path、可並行、可跳著學，但跨 tier 的推進由驗證把關。

## Solution

在既有 `knowledge-map` 之上疊加一層「爬塔迴圈」，並在 agent 側補上三個新能力（skill + 資料格式）：

1. **Node 進度。** progress 從「path ids 集合」擴展成「path 完成 + node 完成 + tier 解鎖」三個層級。學習者可以把讀過的 node chip 標成已完成；node 完成度同時是 tier 解鎖的門檻條件之一（可配置）。
2. **Tier 頭目戰（boss gate）。** 每個 tier 末尾新增一道驗證門：學習者看完該 tier 全部 path 後，呼叫 `quiz` skill（`/grilling` 的知識驗證變體）進行選擇題／簡答題測驗，AI 在 agent 側判答；全部通過後，skill 指示學習者在 app 內把該 tier 標為解鎖，下一層才解鎖。App 內不判答（零後端、正確答案不進 bundle），只記錄解鎖狀態。
3. **預習筆記（prepare note）。** 每條 path 新增一篇可選的 `prepare` 筆記：比 Lesson 更短（3–5 分鐘可讀）、只建立「讀文章前該有的初步概念」，降低認知負荷。生成器把它帶進 `graph.json`，app 在 DetailPane 中顯示「先預習 → 再讀 Lesson」。
4. **CodeBase 來源。** `sources/<subject>/` 支援整個資料夾作為一種 source 類型（`source_type: codebase`）：digest 不是 pdftotext，而是結構化掃描（模組圖、entry points、關鍵檔案 + 摘要），仍遵循 source-reading 的「不可變來源 → digest」兩層契約。
5. **quiz skill。** 新 skill `/quiz <subject>[/<tier>]`：讀該 tier 的 path/nodes/edges 與 digest，出選擇題＋簡答題，學習者作答，AI 判答並逐題給解釋；全對（或達門檻）才告訴學習者「可以在 app 中解鎖 tier X」。不做決策樹，只做知識驗證。
6. **自由選擇保留。** tier 內多 path、可並行、可跳學的行為不變；`quiz` 的範圍可以是單一 tier，學習者隨時可打未鎖定的頭目。

App 端仍是純靜態、`localStorage` 進度、hash deep-link；新增的資料（node 完成、tier 解鎖、prepare 筆記）都從 markdown 或 progress 派生，地圖永不 drift。

## User Stories

1. 作為學習者，我能把讀過的一個 node 標記為已完成，所以我可以追蹤每個關鍵概念的複習狀態，而不只是整條 path 的通關。
2. 作為學習者，node 完成後在塔的相關 tile（與 node chips）上會顯示完成記號，所以我可以一眼看出這個概念在哪些關卡出現過、有沒有學過。
3. 作為學習者，我的 node 完成狀態存在 localStorage 並跨 session 保留，所以我不會因為重整而失去概念級進度。
4. 作為學習者，我能重置 node 進度（與 path 進度分開或一起），所以我可以重爬或重新複習。
5. 作為學習者，學完一個 tier 的全部 path 後，我看到該 tier 出現一個「頭目戰」入口，所以我知道這層學完了、可以驗證。
6. 作為學習者，我呼叫 `/quiz <subject>/<tier>` 會拿到一組針對該 tier 的選擇題與簡答題，所以我能被驗證是否真的理解這層。
7. 作為學習者，我答題後 AI 會判對錯並對每一題給出解釋，所以我錯在哪、為什麼對都清楚。
8. 作為學習者，全部題目通過後 skill 會指示我在 app 中解鎖該 tier，所以解鎖動作是「驗證成功」的結果，不是我自己拍的。
9. 作為學習者，沒有通過驗證時，下一個 tier 的 tile 保持鎖定（無法標記完成、顯示鎖定樣式），所以爬塔推進有真實門檻。
10. 作為學習者，tier 未解鎖時我仍然可以**閱讀**下一層的內容與 node，只是不能標記完成，所以「自由探索」與「正式推進」是分開的兩件事。
11. 作為學習者，tier 解鎖狀態存在 localStorage 並跨 session 保留，所以我不會每次回來都要重打頭目。
12. 作為學習者，同一 tier 內的多條 path 仍然可並行、可跳學、可依自己的順序讀，所以 tier 內自由度不變。
13. 作為學習者，我可以只對未鎖定 tier 打頭目戰，所以我可以按自己的節奏一層層爬。
14. 作為學習者，每條 path 讀文章前可以看到一篇簡短的「預習」筆記，所以我能先建立初步概念、降低認知負荷，再讀 10–15 分鐘的 Lesson。
15. 作為學習者，預習筆記與 Lesson 在同一 DetailPane 中先後呈現（先預習、再展開 Lesson），所以我不必離開地圖去別處找預習材料。
16. 作為學習者，當 path 沒有預習筆記時，該區塊顯示為可選或隱藏，所以不是每關都被迫多讀一篇。
17. 作為學習者，我可以在 `sources/<subject>/` 放入一個整個 CodeBase（資料夾）當作學習材料，所以我能學一個真實開源專案的架構與模式。
18. 作為學習者，codebase 來源會被消化成結構化 digest（模組圖、關鍵檔案、摘要），所以 `/learn-init`、`/roadmap`、`/nodes` 可以用與 PDF 相同的方式消費它。
19. 作為學習者，codebase digest 仍遵循 source-reading 的兩層契約與 hash 生命週期，所以來源不可變、digest 穩定可重用。
20. 作為學習者，含 codebase 來源的 subject 其 path 計數基準線合理（不以檔案行數當唯一 metric），所以 roadmap 不會把一個 repo 切出荒唐的 path 數。
21. 作為學習者，`/quiz` 的出題範圍是該 tier 的 path、其 nodes、相關 edges 與 digest 章節，所以考題永遠可追溯到來源。
22. 作為學習者，`/quiz` 的題目型態包含選擇題與簡答題，所以我不是只做選擇題猜答，也要能簡答說明。
23. 作為學習者，`/quiz` 可以在出題前先問我要選擇題／簡答題／混合、要幾題，所以我能控制驗證的深度。
24. 作為學習者，未通過的題目可以重新嘗試或重抽該題，所以失敗不是終點、是複習的起點。
25. 作為學習者，quiz 判答依據是該 subject 的 digest 與 node 內容（agent 側，不進前端 bundle），所以正確答案不會洩漏在靜態站中。
26. 作為開發者，progress 的新 schema 能相容既有 localStorage 資料（path 完成紀錄不丟失），所以升級不會毀掉既有進度。
27. 作為開發者，tier 解鎖的「通過判定」邏輯是純函式（輸入完成集合 → 輸出哪些 tier 已解鎖），所以可以單元測試。
28. 作為開發者，生成器能把 prepare 筆記帶進 `graph.json` 的 path 記錄，所以 app 不必自行猜測預習內容在哪。
29. 作為開發者，生成器對沒有 prepare 筆記的 path 輸出可選空值，所以任何既有 subject 不需改動也能正常渲染。
30. 作為開發者，quiz skill 是 `/grilling` 的知識驗證變體（共用「逐題、來回、判答」節奏，但不出決策樹），所以學習者學到的是同一套互動語言。
31. 作為開發者，`npm run generate` 對 codebase 來源有確定性輸出（相同來源 → 相同 digest 摘要 hash 與路徑清單），所以可測試。
32. 作為學習者，整個爬塔迴圈（path 閱讀 → node 標完成 → tier 頭目戰 → 解鎖下一層）在既有 `knowledge-map` 視覺語言中完成，所以體驗一致、不需學新介面。
33. 作為開發者，本 feature 不引入後端、不把答案或金鑰放進前端，所以 v0.1 的「純靜態、零後端」約束維持不破。

## Implementation Decisions

- **進度 schema 擴展（prototype 先行的型別）**。progress 從 `{ [subject]: string[] }` 擴為三層：
  ```ts
  type ProgressRecord = {
    [subject]: string;
    paths: string[];      // 既有 path ids
    nodes: string[];      // 新：已完成 node ids
    tiers: string[];      // 新：已解鎖 tier 編號（"1"、"2"…）
  };
  ```
  相容規則：讀到舊的「array per subject」形狀時，把它當作 `paths` 並補空 `nodes`/`tiers`；寫回時一律寫新形狀。儲存鍵沿用 `knowledge-map:progress`。
- **tier 解鎖的純函式判定**（放在 `selectors` 層）：`tierIsUnlocked(graph, tier, progress)` = 前一層已解鎖，且 `paths` 涵蓋前一層所有 path（或配置為「達標即可」），且（可配置）`nodes` 涵蓋該層主要 node。鎖定是「不能標記完成」而非「不能閱讀」。
- **boss gate 的呈現**：`knowledge-map` 的 `Tile`/`FloorLayer` 加入鎖定樣式（鎖 icon／暗化），解鎖後才可被 `manualCompleted`；`Legend` 增加「已解鎖／鎖定」圖例。不新增路由。
- **quiz skill（新 skill）**：`/quiz <subject>[/<tier>]`。共用 `docs/reference/grilling` 的逐題節奏，但替換「設計決策樹」為「知識驗證」：出題（選擇＋簡答，先問型態/題數）→ 作答 → 判答＋逐題解釋 → 達門檻即指示「在 app 中把 tier N 標為解鎖」。讀取範圍：該 tier 的 path 文章、其 `nodes` 陣列的 node 全文、相關 edges、與對應 digest L2。出題每題附 `[[sources/...]]` 溯源。不寫入任何檔案（無需持久化考卷）。
- **prepare 筆記（新 artifact）**：`learn/<subject>/prepares/<path-id>.md`，frontmatter 含 `path: <subject>/<path-id>`、`tier`、`duration`（3–5 分鐘）、`sources`、`created`/`updated`。正文為一頁「讀文章前的初步概念」：2–4 個 key idea 的白話預告、要留意的術語清單（gloss）、與此 path 相關的既有概念連結。`/nodes` 在寫 Lesson 前自動檢查並寫出 prepare 筆記（可選）；`/roadmap` 的 skeleton 不建立它。
- **生成器擴展**（`scripts/generate-data.mjs`）：掃描 `learn/<subject>/prepares/`，把 `prepareHtml`（與 `hasPrepare` 旗標）寫進 `PathNode`；缺省為 null。掃描 `sources/<subject>/` 時區分單檔與資料夾：資料夾視為 `source_type: codebase`。
- **codebase digest（source-reading 擴展）**：`digests/<source-stem>.md` 支援 codebase 型來源 — L1 為「架構總覽」（entry point、核心目錄、模組圖），L2 為「關鍵檔案 + 摘要 + 檔案 locator」。sub-agent 掃描時只讀該資料夾、只寫 digests。大小閾值改用「檔案數 × 平均大小」而非 pdftotext 行數。path 計數基準線對 codebase 來源改用結構化 metric（模組數／檔案數）而不硬套 `lines/1100`。
- **不進前端的東西**：quiz 題目與正確答案永遠不在 `graph.json`、不在 bundle；App 只持有「已解鎖」與「node 完成」狀態。tier 解鎖動作由學習者手動按下（skill 指示），不自動寫入（Agent 無法可靠寫 localStorage）。

## Testing Decisions

- **單一主測試 seam**：沿用 `knowledge-map` 生成器 seam（`scripts/generate-data.mjs` 的 markdown → `graph.json` 契約），用 fixture markdown 斷言：prepare 筆記被帶進 `PathNode`（含缺省 null）、codebase 來源被正確分類與 digest、確定性輸出。先例：`knowledge-map/src/__tests__/generator.test.ts`。
- **第二個 seam（新，最低必要）**：progress 相容與 tier 解鎖判定是純函式（無 DOM、無 localStorage），抽成 `src/lib/progress.ts` / `selectors.ts` 的純函式並以 Vitest 測試：舊資料遷移、三層讀寫、`tierIsUnlocked` 的門檻邏輯（path 涵蓋、node 涵蓋、前一層解鎖）。
- **不測的**：quiz skill 的對話流程（agent 行為，靠真人練習驗證）；app 的鎖定渲染與 node 勾選（`npm run dev` 人工驗證）。維持「越多 seam 越差，理想 1–2 個」的原則。
- **好測試的判準**：只測外部行為與契約（輸入 markdown/progress → 輸出 graph/progress 的形狀與解鎖結果），不測內部實作細節；每個測試都給出「舊資料升級不丟」與「確定性」這兩個高風險點。

## Out of Scope

- App 內自動判答或答案進 bundle（維持零後端；判答在 agent 側）。
- 服務端／帳號／跨裝置同步。
- quiz 考卷的持久化檔案（每次出題即時生成，不落盤）。
- 修改既有 `/grilling`（本 feature 新增變體，不改決策樹行為）。
- 行動版重新設計；觸控手勢不超過既有 pan/zoom。
- codebase 的語意檢索／embedding（只做結構化 digest）。
- 改寫既有 subject 的任何 path/node/edge（prepare 與 digest 為增量新增）。

## Further Notes

- 承載於既有 `knowledge-map` v0.1（`PRD.md`、`.scratch/knowledge-nebula/`）；本 feature 是它的 v0.2 遊戲迴圈，不是新產品。
- `AGENTS.md` 需同步新增：`learn/<subject>/prepares/` 資料夾、`source_type: codebase`、`/quiz` skill 條目，與 lint 檢查項（prepare 引用是否存在、tier 解鎖資料的進度 schema 相容）。
- 現有 4 個 subject 均無 prepare 筆記與 codebase 來源，所以本 spec 的所有新資料在既有 subject 上都是「可選、缺省不壞」。
- 後續 `/to-tickets` 建議 tracer-bullet 順序：progress schema 遷移與 `tierIsUnlocked` 純函式 → 生成器 prepare/codebase → 前端鎖定與 node 勾選 → `/quiz` skill → `AGENTS.md`/lint 更新。
