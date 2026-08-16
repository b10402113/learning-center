# Spec — 統一閱讀面：共享文件頁 + 元素視窗 + 獨立全頁

Status: ready-for-agent
Feature: unified-reading-surface
Created: 2026-08-16

> 前置：本 spec 建立在 `.scratch/element-page/spec.md`（element 獨立頁面）之上，只描述本 feature 新增/異動的範圍。領域詞彙依 `knowledge-map/CONTEXT.md`（新增「Node 頁面 / Element 頁面 / 元素視窗」）；架構決策依 `knowledge-map/docs/adr/`（ADR-0001 remark/rehype 管線、ADR-0002 純靜態 + Sandpack 例外，新增 ADR-0003 統一閱讀面）。

## Problem Statement

node 的課文與 element 的概念頁目前散落在三種閱讀表面：DetailPane 右側邊欄（星雲點擊、清單彈窗的 main 列）、NodeDetailView 清單彈窗、element 的獨立全頁。邊欄只有 26rem 寬，長文被壓縮，且點清單彈窗的 main 列會跳出側欄——學習者不喜歡這個側欄，它擋住地圖、打斷瀏覽脈絡。element 頁本身的佈局也不對：左欄同時塞課程與元素清單，右欄只有 TOC 與進度，element 索引應該在右側進度下方；element 頁的 breadcrumb 無法跳回教授它的課文。此外 element 頁長文無法向下捲動，hover 卡片正對鼠標中心遮擋視線。

學習者要的是：從地圖任何位置點內容，先以**元素視窗**（overlay）快速閱讀、不離開地圖；想沉浸時再「展開」到**獨立全頁**；課文與概念共用同一套文件型版面；隨時可從 element 跳回教授它的課文。

## Solution

閱讀面統一為一個共享的三欄文件頁元件（左課程導覽 + 中央文章 + 右 TOC→進度→清單），node 課文與 element 概念都用它；DetailPane 右側邊欄退休。閱讀有兩個呈現態：

- **元素視窗（Reader modal）**：從地圖（星雲 / Roadmap）、清單彈窗的列（element / main / 先備）、chips、wikilink、⌘K 搜尋進入時，同一個文件頁元件渲染在暫態 overlay 中，帶「展開」與「關閉」；清單彈窗保持在下方（巢狀堆疊），關閉元素視窗回到清單或地圖。此為暫態狀態，不寫入 URL。
- **獨立全頁（standalone）**：元素視窗按「展開」，或貼上 deep-link，導航到 `#/nodes/<subject>/<node-id>` 或 `#/elements/<subject>/<element-id>?from=<node-id>`。全頁內點任何連結（左欄課程、右欄清單、breadcrumb、wikilink、由哪堂課教授）**直接導航**到目標全頁，不再開視窗。

element 頁的 `?from=<node-id>` 記錄學習者從哪堂課過來，breadcrumb 因此可隨時跳回該課文；無來源時退回第一個教授它的 node，再無則顯示 `subject / 元素 / <title>`。右欄依頁型顯示：element 頁 = 本頁 TOC → 進度卡 → subject 元素索引；node 頁 = 本頁 TOC → 進度卡 → 該 node 教的與關聯元素。hover 卡片改置鼠標右下方；修復長文捲動。

## User Stories

1. 作為學習者，我在地圖（星雲或 Roadmap）點任何 node 或 element 時會先開**元素視窗**（共享文件頁）閱讀，所以我不用離開地圖就能快速看內容。
2. 作為學習者，我在清單彈窗點 element 列時，元素視窗會疊在清單彈窗之上；關閉後回到清單原本的捲動位置，所以我可以在清單內逐一檢視而不迷失。
3. 作為學習者，我在清單彈窗點 main 列時，課文以元素視窗展示而非跳出側欄，所以我不用再被側欄打斷。
4. 作為學習者，我在元素視窗按「展開」會跳到該內容的獨立全頁，所以需要沉浸閱讀時我有完整版面與可分享網址。
5. 作為訪客，我貼上 `#/nodes/<subject>/<id>` 或 `#/elements/<subject>/<id>?from=<node>` deep-link 時直接落地獨立全頁，所以分享課文與概念都無需設定。
6. 作為學習者，我在獨立全頁內點左欄課程的某個 node 時會直接跳到該課文的全頁，所以我可以從概念切回它所屬的課程單元。
7. 作為學習者，我在獨立全頁內點右欄或文章內的 element 連結時會直接跳到該 element 全頁，所以全頁內走跳不會被視窗中斷。
8. 作為學習者，我在 element 頁看到左欄只列課程節點、不再混入元素清單，所以課程結構更清晰。
9. 作為學習者，我在 element 頁右欄看到「本頁 TOC → 進度 → 元素清單」，所以我可以在右側依課程順序連續閱讀概念，並在同一欄看到完成進度。
10. 作為學習者，我在 node 頁右欄看到「本頁 TOC → 進度 → 該 node 教的/關聯的元素」，所以我閱讀課文時一眼看到相關概念。
11. 作為學習者，我在 node 頁右欄點一個元素時會跳轉到該 element 的內容（視窗或全頁依目前所在態），所以課文與概念之間可以自由走跳。
12. 作為學習者，我從某堂課進到 element 頁時，breadcrumb 顯示 `subject / 該課文 / element 標題`，點課文段隨時跳回那堂課，所以我不會在概念裡迷路。
13. 作為學習者，我直接深鏈進 element 頁（無來源）時，breadcrumb 顯示第一個教授它的課文；沒有任何課教授它時顯示 `subject / 元素 / 標題`，所以 breadcrumb 永遠有意義。
14. 作為學習者，我在 node 頁看到 `subject / 該課文` breadcrumb，點 subject 回到地圖，所以課文頁也有回家路徑。
15. 作為學習者，我在 node 全頁與 element 全頁看到一致的左課程導覽、中央文章、右欄版面，所以課文與概念讀起來是同一個系統。
16. 作為學習者，我 hover 地圖卡片時 hover 卡片出現在鼠標右下方、不再遮擋中心，所以我不會被擋住視線。
17. 作為學習者，我在 element 頁（與 node 頁）可以把長文一直向下捲動到底，所以內容不再被裁切。
18. 作為學習者，我在元素視窗按 Esc 或「關閉」會回到地圖／清單彈窗，所以視窗不會卡住。
19. 作為學習者，我在獨立全頁按「聚焦」進入聚焦模式只留居中文章，Esc 離開；此模式保留於全頁，視窗內以「展開/關閉」取代，所以兩種閱讀態各有恰當的沉浸選項。
20. 作為學習者，我在元素視窗與全頁都能標記 element 完成、question 元素先答對測驗才可標記，進度與地圖共享同一份記錄，所以進度只記一次。
21. 作為學習者，我在 ⌘K 搜尋結果點 node 或 element 時，先在視窗閱讀、可再展開，與地圖點擊行為一致。
22. 作為開發者，路由契約（map / node / element + `?from`）維持純函式，所以 URL 行為可測、可確定性測試。
23. 作為開發者，node 全頁與 element 全頁共用同一文件頁元件與版面樣式，所以兩者永遠一致、不會分叉。
24. 作為開發者，完成標記與進度沿用既有 `progress.ts`/`completion.ts`，所以進度邏輯只有一份。
25. 作為設計者，版面沿用現有暗色 developer-docs 語彙（近黑中性 + 品牌粉紅 + 髮絲線邊框 + IBM Plex），所以視覺不引進新風格。

## Implementation Decisions

- **共享文件頁元件（已確認）**：node 課文與 element 概念由同一三欄文件頁元件渲染——左課程導覽、中央文章、右欄。元件提供兩種呈現態：`standalone`（獨立全頁 route）與 `readerModal`（元素視窗 overlay）。`readerModal` 態額外顯示「展開」與「關閉」；聚焦模式（聚焦）只在 `standalone` 態提供。中央文章：node 用 `getNodeMdx` + `nodeMdxComponents`，element 用 `getElementMdx` + `elementMdxComponents`；頁頭擁有標題，文章內 `h1` 隱藏（沿用既有先例）。
- **元素視窗（ReaderModal，已確認）**：暫態 overlay 內嵌共享文件頁元件。地圖 / 清單彈窗列 / chips / wikilink / ⌘K 搜尋進入時開啟；「展開」以 `location.hash` 導航到獨立全頁 route 並關閉視窗；「關閉」與 Esc 關閉並回到底層（清單彈窗或地圖）。視窗不寫入 URL。巢狀：清單彈窗 → 元素視窗疊在上層，關閉回清單。獨立全頁內點連結直接導航、不再開視窗。
- **路由契約（seam，已確認）**：`lib/hashlink.ts` 擴充——element 路由帶 `?from=<node-id>` 來源；`#/nodes/<subject>/<id>` node 路由由 App 正式處理（目前解析得到 node kind 但未分派）。`parseHash` 回傳型狀（核心契約，自 ADR-0003 與本 spec 決策）：
  ```ts
  export type Route =
    | { kind: "map"; subject: string | null; nodeId: string | null }
    | { kind: "node"; subject: string; nodeId: string }
    | { kind: "element"; subject: string; elementId: string; from: string | null };
  ```
- **來源解析純函式（已確認）**：breadcrumb 的「來源課文」解析為純函式——優先 `?from`（須為真實存在的 node），其次該 element 第一個教授它的 node，再無則無來源（breadcrumb 退回 `subject / 元素 / title`）。此函式與路由契約同 seam。
- **左欄課程導覽（已確認）**：課程結構（tiers → node 列表）保留；element 頁左欄的元素清單移除，改放右欄進度卡下方。點左欄 node → 依目前態：視窗內切換視窗內容、全頁內直接導航 node 全頁。
- **右欄（已確認）**：element 頁 = 本頁 TOC（scroll-spy 保留）→ 進度卡 → subject 元素索引；node 頁 = 本頁 TOC → 進度卡（node 檢查清單完成度）→ 該 node 教的元素 → 關聯元素。點右欄元素 → 依目前態開視窗或直接導航。
- **Breadcrumb（已確認）**：node 頁 `subject / <node 標題>`；element 頁 `subject / <node 標題> / <element 標題>`（node 段來自來源解析）。點 subject → 地圖；點 node 段 → node 全頁／視窗。
- **DetailPane 退休（已確認，ADR-0003）**：刪除 DetailPane；其 element chips、breadcrumb 堆疊、整篇閱讀能力由共享文件頁 + 元素視窗取代。
- **清單彈窗保留（已確認）**：NodeDetailView 檢查清單彈窗行為不變；其 element / main / 先備列改為開元素視窗（巢狀疊於清單上），不再切換到 DetailPane。
- **Hover 卡片（已確認）**：HoverCard 改置於鼠標**右下方**偏移（不再居中於鼠標上方遮擋）；兩視圖共用同一元件。Radix Tooltip（按鈕提示）保留。
- **捲動修復（已確認）**：文件頁 grid 容器設定行高受約束（`grid-template-rows: minmax(0, 1fr)`），使中央欄的滾動容器在 `body { overflow: hidden }` 下真正可捲；元素視窗 host 同樣給予有界高度。
- **TopBar**：視圖切換從獨立全頁回到地圖的行為保留。
- **不引入**：React Router（維持 hash 單頁）；不修改 generator 產出的 `graph.json` 內容契約。

## Testing Decisions

- **好測試的定義**：只測外部行為（URL 解析/建構契約與來源解析的決定性輸出），不測實作細節。
- **測什麼**：`lib/hashlink.ts` 路由純函式——`parseHash` 解析 `#/nodes/<subject>/<id>` 回傳 node kind、`#/elements/<subject>/<id>?from=<node>` 回傳 element kind 與 `from`；無 `from` / 空 hash / 不認識 prefix 的回退；`buildElementHash` 與 `buildNodeHash` 產出 canonical 字串並可 round-trip；含需 URL-encode 字元時正確 round-trip。來源解析純函式——`from` 無效/不存在時退回第一個教授 node、無教授 node 時回退無來源。
- **模組**：`lib/hashlink.ts`（新增測試於既有 `hashlink.test.ts`，單一 seam）。
- **不做單元測試**：共享文件頁佈局、元素視窗 overlay/巢狀、breadcrumb 渲染、hover 定位、捲動行為——以 `npm run dev` 人工驗證（先例：element-page 的佈局/scroll-spy/聚焦模式同樣人工驗證）。
- **回歸錨點**：既有 `hashlink.test.ts`、`completion.test.ts`、`progress.test.ts`、`mdx.test.tsx`、`generator.test.ts` 全數保持綠；`npm run typecheck` 綠。

## Out of Scope

- 段落級 deep-link（`#/nodes/<s>/<id>#section`）——scroll-spy 目錄先做，錨點 URL 列 backlog（沿用 element-page 決策）。
- 元素視窗的 URL / 可分享狀態（視窗是暫態；分享走獨立全頁）。
- 聚焦模式寫入 URL。
- Element 內容改由 generator 寫進 `graph.json`（維持 client 編譯 MDX，ADR-0001）。
- 行動裝置優先設計（沿襲 PRD §3：desktop-oriented + graceful fallback）。
- element-only 圖視圖、多 subject 同畫面（沿襲既有非目標）。
- 從 UI 編輯課程內容（sources 保持 immutable）。

## Further Notes

- 本 feature 的決策已落地於：`knowledge-map/CONTEXT.md`（Views 新增「Node 頁面 / Element 頁面 / 元素視窗」，並移除視圖切換對 DetailPane 的提及）、`knowledge-map/docs/adr/0003-unified-reading-surface.md`（統一閱讀面）。
- 施工順序建議：先擴充 `lib/hashlink.ts` + 測試（純函式、可獨立完成）→ 建共享文件頁（NodePage + ElementPage 收斂）→ 建元素視窗 overlay 並接各點擊入口 → App 分派 node route 與視窗狀態 → breadcrumb/`?from=` 串接 → hover 定位與捲動修復。
- 既有 `.scratch/element-page/` 的 element 頁（設計 A 文件型佈局）是共享文件頁的基礎：本 spec 在其上改左欄/右欄組成、加 node 頁與視窗態。
- ⌘K 全文搜尋 palette 目前不存在於程式碼庫；本 spec 敘述其與視窗的行為，實際落地時其 node/element 結果須用 `buildNodeHash` / `buildElementHash` 開視窗。
