# 知識星雲 v0.3 — checklist 完成模型 + 全面 MDX + 元素類型與前置

Status: ready-for-agent
Feature: mdx-checklist-completion
Created: 2026-08-15
Supersedes: `.scratch/learning-climb/` 的 gating 機制（頭目戰、tier 解鎖、progress.nodes/tiers）

## Problem Statement

知識星雲（`knowledge-map`，v0.2 承 `.scratch/learning-climb/`）目前是「爬塔 gating」模型：每個 tier 末尾有頭目戰、通過 `/quiz` skill 才解鎖下一層、progress 記 `nodes` 與 `tiers`、網站以塔圖為主。一輪 grilling（`CONTEXT.md` 與 `docs/adr/0001`、`0002` 已記錄）確認這套機制**不要了**：

- **完成模型錯位。** 學習者想要「讀 + 勾選」的無摩擦流程：element 手動完成、node 完成是推導值。但現在 node 完成靠手動標記、可獨立於 element 存在；還有 tier 解鎖門檻在把關。
- **互動不可得。** 內容在 `npm run generate` 時被手寫 renderer 序列化成 HTML 字串塞進 `graph.json`（`contentHtml`/`bodyHtml`/`fullArticleHtml`/`prepareHtml`），前端 `dangerouslySetInnerHTML`。互動元件（測驗、影片）進不了 bundle；測驗只能靠 app 外的 `/quiz` skill。
- **element 沒有類型。** 沒有 article / video / question 的分型，無法表達影片元素與互動測驗元素。
- **prerequisites 不完整。** 只有 element（且是從 Connections 反推的 `relatedElementIds`），沒有 node 級前置，也沒有依類型分色。

## Solution

把知識星雲改成**無門檻的 checklist 完成模型**，並把內容管線升級成**全面 MDX**，讓測驗與影片成為真正的互動元素：

1. **checklist 完成**。element 手動勾選完成；node 完成 = 清單內所有項目（taught elements + 最後一列的 main 文章）完成後自動推導，零 element 的 node 只要求 main 文章。`progress.nodes`、`progress.tiers`、tier 解鎖邏輯、頭目戰 UI 全部移除。完成與否不再有鎖定門檻——只有勾與不勾。
2. **全面 MDX**。node 與 element 檔案以 MDX 編寫，前端用 Vite + `@mdx-js/rollup` 直接 import `learn/` 底下的 `.mdx` 編譯成 React component。`graph.json` 縮小為純圖形結構（tier / id / order / edge / type / prerequisites），不再攜帶任何內容 HTML。接受 Obsidian 對這些檔案的渲染劣化（JSX 顯示為純文字）。
3. **元素類型**。element frontmatter 新增 `type: article | video | question`；node 文章維持特殊 `main`。`video` 由 URL 嵌入播放；`question` 渲染 app 內互動選擇題，答對才允許勾選完成（自測，非門檻）。
4. **prerequisites 雙型分色**。node frontmatter 新增 `prerequisites` 欄位，可指向 element 或 node；node 詳情視圖依類型分色顯示。
5. **視圖收斂**。網站以 Roadmap（ReactFlow）與星雲（ForceMap）兩視圖為主，塔圖（TowerMap）與相關鎖定／boss 渲染移除。

## User Stories

1. 作為學習者，我讀完一個 element 後手動把它勾成完成，所以我能用自己的節奏標記概念進度。
2. 作為學習者，當 node 清單內所有項目（含最後的 main 文章）都完成時，node 自動顯示完成，所以完成是閱讀全部內容的結果、不是我自己拍板。
3. 作為學習者，沒有 element 的 node（如尚未撰寫內容的 draft node）只要勾完 main 文章就算完成，所以完成語意不會因內容空白而失效或突然全自動完成。
4. 作為學習者，node 完成狀態由 element 完成推導、不需要另外勾 node，所以不會有「node 完成了但 element 沒學」的矛盾狀態。
5. 作為學習者，我的 element 完成狀態存在 localStorage 並跨 session 保留，所以重整或隔天回來不會失去概念級進度。
6. 作為學習者，我能重置進度，所以可以重新複習或重爬。
7. 作為學習者，我可以在 node 清單中看到每個 element 的 TYPE（article / video / question），所以我知道下一個項目是文章、影片還是測驗。
8. 作為學習者，影片 element 會直接在 app 內嵌入播放（來自 videoUrl），所以我不必離開地圖去別處看。
9. 作為學習者，question element 在 app 內顯示選擇題、我可以點選作答，所以測驗是真實的互動體驗而非貼文。
10. 作為學習者，question element 必須答對才能被勾選完成，所以「自認讀過」不能取代「答對驗證」。
11. 作為學習者，測驗題目與正確答案隨內容一起提供（無 gating），所以這是自測不是門檻，答錯就重看再答。
12. 作為學習者，node 詳情會列出 prerequisites，並用不同顏色區分「前置 element」與「前置 node」，所以我能一眼看出該補哪些前置知識、該先去哪個 node。
13. 作為學習者，node 的 prerequisites 可以由 generator 從 frontmatter 與 element Connections 推導，所以不需手動維護圖結構。
14. 作為學習者，我點 node 清單裡的 element 會展開該 element 的完整 MDX 內容（含互動元件），所以閱讀與互動在同一視圖內完成。
15. 作為學習者，node 與 element 內容以 MDX 呈現、可嵌互動元件，所以文章可以有超越純文字的表達力。
16. 作為學習者，網站提供 Roadmap 視圖（tier × node 的結構流）與星雲視圖（概念圖），所以我可以用兩種視覺角度看同一份課程。
17. 作為學習者，塔圖不再存在，所以我不會再看到鎖定樣式、頭目戰入口或解鎖按鈕等爬塔機制。
18. 作為開發者，`graph.json` 只攜帶圖形結構、不再攜帶內容 HTML，所以內容渲染的唯一來源是 MDX 檔、不會有兩份內容漂移。
19. 作為開發者，前端直接 import `learn/` 的 MDX 檔，所以新寫的 node/element 一產生就在 app 中出現、不需額外註冊。
20. 作為開發者，舊的 `knowledge-map:progress` 資料（只有 node ids 陣列）讀取時相容，所以升級不會毀掉既有進度紀錄。
21. 作為開發者，progress 中殘留的 nodes/tiers 欄位在升級後被忽略或遷移，所以舊資料不會造成錯誤的完成狀態。
22. 作為開發者，`/nodes` 與 `/edges` skill 產出的 node/element 檔案是 MDX 且包含 `type`/`prerequisites` frontmatter，所以 skill 輸出與網站管線契約一致。
23. 作為開發者，移除 TowerMap、tier 解鎖、boss 渲染與 `progress.nodes/tiers` 後，專案沒有死碼殘留，所以維護者不會困惑於兩套機制並存。

## Implementation Decisions

- **內容管線改道（ADR 0001）。** `scripts/generate-data.mjs` 停止渲染 markdown → HTML；`graph.json` 只輸出結構。前端新增 `@mdx-js/rollup`，按 id 直接 import `learn/<subject>/{nodes,elements}/<id>.mdx`（Vite `fs.allow` 需涵蓋 `learn/`）。渲染層以 component 取代 `dangerouslySetInnerHTML`。
- **graph.json 結構形狀（prototype 定案）。**
  ```ts
  type NodeData = {
    id; title; tier; order; duration; goal; status;
    taughtElementIds: string[];        // 既有 elements 陣列
    prerequisiteIds: string[];         // 新：element 或 node id
    relatedElementIds: string[];       // 既有：由 Connections 推導
    sources: string[];
  };
  type ElementData = {
    id; title; tier; order; type: "article" | "video" | "question";
    taughtByNodes: string[];
    prerequisiteIds: string[];
    connections: string[];
    sources: string[];
    videoUrl?: string;                 // type = video 時
  };
  ```
  刪除 `contentHtml`、`bodyHtml`、`fullArticleHtml`、`prepareHtml`、`hasPrepare`。
- **element 類型 frontmatter。** element 新增 `type`（缺省 `article`）；`video` 需要 `videoUrl`；`question` 需要結構化題目（`questions:` 區塊，含選項與正確答案索引）。正確答案隨內容進 bundle——這是自測元素，不是 gating，與 learning-climb「答案不進 bundle」的理由（防作弊解鎖）無關。
- **node prerequisites frontmatter。** node 新增 `prerequisites:` 清單，元素為 `learn/<subject>/elements/<id>` 或 `learn/<subject>/nodes/<id>` 的穩定 id。generator 解析後與 Connections 推導的 `relatedElementIds` 合併去重，並記錄來源（frontmatter 或推導）供分色。
- **完成推導（ADR 0002）。** `progress` 收斂為只有 element 完成集合：
  ```ts
  type SubjectProgress = { elements: string[] };
  function nodeItems(node): Item[]                 // taught elements + { kind: "main" }
  function isNodeComplete(node, manualElements): boolean
  // 空 elements 時 items = [main]；main 完成 = 有勾選（語意為「文章讀過」）
  ```
  相容規則：讀到舊形狀時取 `elements` 陣列，忽略 `nodes`/`tiers`。完成判定是純函式，無門檻、無鎖定。
- **移除。** TowerMap 元件、`tierIsUnlocked`/`tierBossState`/`TierBossState`、`progress.nodes`/`progress.tiers`、boss 與 Lock/Crown 圖示的圖面渲染、Legend 的鎖定圖例、DetailPane/NodeDetailView/RoadMap 的 boss/lock 分支。視圖切換收斂為 `nebula | roadmap`。
- **互動元件（白名單）。** `QuizBlock`（question element：選擇題、答對解鎖該項目的勾選）、`VideoEmbed`（video element：`videoUrl` iframe 嵌入）、`PrereqSection`（node 詳情的分色前置區塊）。node 文章為 `main` 型最後一列。
- **skill 契約更新。** `/nodes` 與 `/edges` 的格式範本改為輸出 MDX（`examples/NODE.mdx`、`examples/ELEMENT.mdx` 更新），並要求 `type`、`prerequisites`（node）與可選 `videoUrl`/`questions`（element）frontmatter。

## Testing Decisions

- **三條 seam（已與使用者確認）。**
  - **生成器 seam（既有，縮窄）**：`scripts/generate-data.mjs` 的結構輸出契約。測試：frontmatter 新欄位解析（`type`、`prerequisites`）、`videoUrl`/`questions` 條件欄位、prerequisites 與 Connections 合併去重與來源標記、確定性輸出、**斷言輸出不再含內容 HTML**（`contentHtml`/`bodyHtml` 等欄位不存在）。
  - **完成推導純函式 seam（既有）**：`isNodeComplete`/`nodeItems`。測試：全完成 → 完成；缺任一 element → 未完成；main 未勾 → 未完成；零 element → 只看 main；舊 progress 形狀相容與 nodes/tiers 忽略。
  - **MDX/元件渲染 seam（新）**：新增 vitest + jsdom + `@testing-library/react`。測試 fixture `.mdx`（含 `<QuizBlock>`/`<VideoEmbed>`）能編譯並渲染、question element 答錯時不能勾選／答對後可勾選、video element 渲染 `videoUrl` 嵌入、node 清單的 TYPE badge 與 prerequisites 分色（element vs node 顏色不同）。
- **好測試判準**：只測外部契約與行為（markdown/結構 → graph 形狀；element 完成集合 → node 完成布林；互動元件渲染與勾選門檻），不測內部實作。每個測試都覆蓋高風險點：舊資料升級不丟、確定性、內容與結構分離。
- **不測的**：skill 的對話流程（agent 行為）；MDX 在 Obsidian 的劣化渲染（已接受）；星雲圖 layout 的視覺結果（`npm run dev` 人工驗證）。

## Out of Scope

- 後端、帳號、跨裝置同步（維持純靜態 + localStorage）。
- 服務端判答或任何防作弊機制（question element 是自測）。
- 任意內文 JSX 的擴充元件生態（互動元件限定白名單；通用元件庫另議）。
- 從 UI 編輯課程內容（sources 不可變的原則不變）。
- 既有的 `knowledge-nebula` 非 gating 功能（深連結、full-read、camera、hover）不重寫，僅隨移除工作相容。
- Obsidian 渲染相容（已知劣化，接受）。
- codebase 來源、跨 subject 視圖、行動版重設計（皆非本次決策）。

## Further Notes

- 取代 `.scratch/learning-climb/` 的 gating 部分：progress schema 遷移方向與 learning-climb 相反（收斂而非擴展）；learning-climb 的 prepare 筆記、quiz skill 不在本 spec 範圍，另案處理。
- 決策紀錄：`CONTEXT.md`（Completion / Element type / Question element / Video element / Prerequisite / Lesson content / View）與 `docs/adr/0001-adopt-mdx-bundle-compiled.md`、`docs/adr/0002-drop-gating-checklist-completion.md`。
- `AGENTS.md` 需同步：element/node 格式範本加 `type` 與 `prerequisites`；網站部分改述為 Roadmap + 星雲兩視圖；移除 gating/boss 相關語彙。
- 建議後續 `/to-tickets` 順序：完成推導純函式與 progress 遷移 → 生成器縮窄（結構輸出 + 新欄位）→ 移除 TowerMap/gating 死碼 → MDX 管線與互動元件 → skill 格式與範本更新。
