# Element 獨立頁面 — /elements/<slug>（含聚焦模式）

Status: ready-for-agent
Feature: element-page
Created: 2026-08-16

> 前置：本 spec 建立在 `.scratch/knowledge-nebula-enhancements/spec.md`（v0.2）之上，只描述本 feature 新增/異動的範圍。領域詞彙依 `knowledge-map/CONTEXT.md`；既有架構決定依 `knowledge-map/docs/adr/`（ADR-0001 remark/rehype 管線、ADR-0002 純靜態 + Sandpack 例外）。
> 設計定案：`.scratch/element-page-designs/element-a-docs.html`（文件型 Docs 佈局）+ 聚焦模式。未定案方案（B–E）保留於同資料夾供日後參考。

## Problem Statement

目前 element（概念頁）只能在地圖的右側 DetailPane 內以窄面板閱讀：資訊密度被 `26rem` 寬的 pane 壓縮，長文需要反覆開啟「整篇閱讀」；沒有獨立的 URL，無法把單一概念頁分享給訪客；element 之間與 node 之間的跳轉埋在面板 breadcrumb 裡，缺乏「這是一個完整頁面」的閱讀體驗。

學習者想把單一概念當成一篇可收藏、可分享、可沉浸閱讀的文章，而不是地圖上的一顆小圓點。設計 A（文件型：左課程導覽 + 中央文章 + 右錨點目錄）已獲選；此外需要**聚焦模式**，一鍵收起所有 chrome，讓用戶完全專注於內容。

## Solution

新增一條獨立的 element 頁面，以 hash 路徑 `#/elements/<subject>/<slug>` 編址（純靜態約束下無法用真實路徑，見 Implementation Decisions）。在地圖任何位置點擊 element（DetailPane 的教/關聯 chips、NodeDetailView 的元素列、星雲與 Roadmap 的 element 節點、⌘K 搜尋結果、文章內 wikilink）都會**自動跳轉**到該 element 的獨立頁面；訪客貼上 deep-link 則直接落地該頁面。

頁面採用設計 A 的文件型佈局：

- **頂欄**：沿用 TopBar（subject 切換器、視圖切換、⌘K 搜尋）。在 element 頁面，視圖切換維持可回到地圖。
- **左側導覽**：該 subject 的課程結構（tiers → node 列表）與元素清單；點 node 回到地圖並選中該 node，點 element 跳轉到該 element 頁面；目前 element 以粉紅亮點標示。
- **麵包屑**：`subject / 元素 / 目前元素標題`。
- **文章頭部**：type badge（article/video/question）、tier・order、日期、由哪堂課教授、學習目標。
- **中央文章**：以 `getElementMdx` + `elementMdxComponents` 渲染（沿用 v0.2 的 MDX 管線與互動元件：question 元素的 QuizBlock、video 元素的 VideoEmbed、wikilink 原地導航）。
- **右側錨點目錄**：從渲染後文章收集 `h2` 標題即時生成，scroll-spy 高亮目前段落；含「標記元素完成」進度卡。
- **頁尾導航**：上一個 / 下一個元素（依 subject 內 order 排序）。
- **聚焦模式**：一鍵收起左導覽、右目錄、麵包屑與頁尾，只留居中文章（約 42rem 行寬）；Esc 離開。此為暫態狀態，不寫入 URL（同 DetailPane full-read 先例）。

進度與完成度整合沿用既有機制：`lib/progress.ts` + `lib/completion.ts`，question 元素維持「先答對測驗才能標記完成」的 gating。

## User Stories

1. 作為學習者，我在地圖任何位置點擊一個 element 時會自動跳到它的獨立頁面，所以我可以沉浸式閱讀完整概念而不被面板束縛。
2. 作為訪客，我收到一個 `#/elements/<subject>/<slug>` deep-link 時會直接落地該 element 頁面，所以分享單一概念無需任何設定。
3. 作為學習者，我在 element 頁面看到左側該 subject 的課程結構（tiers → nodes）與元素清單，所以我知道這個概念在課程中的位置。
4. 作為學習者，我點左側導覽的某個 node 時會回到地圖並選中該 node，所以我可以從概念切回它所屬的課程單元。
5. 作為學習者，我點左側導覽或頁內連結的另一個 element 時會跳轉到該 element 的頁面，所以概念之間可以自由走跳。
6. 作為學習者，我可以在 element 頁面閱讀完整文章（問題陳述、為何重要、如何運作、白話、類比、實際運用、先備知識、連結、來源、測驗），所以內容不再被窄面板截斷。
7. 作為學習者，我看到文章頭部有 type badge、tier・order、日期與「由哪堂課教授」，所以我能快速判斷這個概念的類型與位置。
8. 作為學習者，question 元素的測驗可以在頁面內直接作答，答對全部題目後才能標記完成，所以自我驗證與進度記錄一致。
9. 作為學習者，video 元素的影片可以在頁面內直接播放，所以影音內容與文字在同一頁完成。
10. 作為學習者，我在右側目錄看到文章的段落錨點，點擊可平滑捲動，所以我可以在長文中快速定位。
11. 作為學習者，捲動文章時右側目錄會同步高亮目前段落，所以我知道自己在文章的哪個區段。
12. 作為學習者，我可以在右側目錄標記元素完成，完成狀態與地圖同步，所以進度只記一次。
13. 作為學習者，我開啟聚焦模式後左導覽、右目錄、麵包屑與頁尾全部收起，只剩居中文章，所以我可以完全專注於內容。
14. 作為學習者，我在聚焦模式按 Esc 會回到完整頁面佈局，所以專注與導覽可以快速切換。
15. 作為學習者，我按「回到地圖」或瀏覽器返回鍵時會回到之前的地圖位置，所以進出頁面無縫銜接。
16. 作為學習者，我在 ⌘K 搜尋結果點某個 element 時會跳到該 element 頁面，所以搜尋與閱讀路徑一致。
17. 作為學習者，我在文章內點 element wikilink 時會跳轉到該 element 的獨立頁面，所以文章內概念跳轉與地圖點擊行為一致。
18. 作為學習者，我貼上一個 subject 不存在或 slug 錯誤的 deep-link 時會優雅退回地圖，不會白屏或報錯。
19. 作為學習者，我在頁尾看到上一個 / 下一個元素，所以我可以按課程順序連續閱讀。
20. 作為學習者，我開啟「減少動態效果」時聚焦模式的進出與目錄捲動不做動畫，所以無障礙需求被尊重。
21. 作為開發者，element 頁面以 `parseHash`/`buildHash` 純函式路由，所以 URL 行為可測、可單元測試。
22. 作為開發者，頁面重用 `getElementMdx` + `elementMdxComponents`，所以 content rendering 不會與 DetailPane 或 full-read 分叉。
23. 作為開發者，完成標記重用 `progress.ts`/`completion.ts`，所以進度邏輯只有一份。
24. 作為設計者，佈局沿用現有暗色 developer-docs 語彙（近黑中性 + 品牌粉紅 #ff0071 + 髮絲線邊框 + IBM Plex），所以視覺不引進新風格。

## Implementation Decisions

- **路由編碼（已確認）**：新路由以 hash 路徑表達：`#/elements/<subject>/<slug>`。純靜態 + 可開本地檔案 + 無伺服器 fallback 的約束下，真實路徑不可行；hash 路徑讀起來像路徑、可直接分享、與既有 `#s=..&p=..` deep-link 並存。slug 為 element id，subject 限定以避免跨 subject 撞名。
- **`lib/hashlink.ts` 擴充**：`parseHash` 回傳改為可區分兩種路由的判別聯集；新增 `buildElementHash(subject, elementId)`。類型形狀（本決策的核心契約）：
  ```ts
  export type Route =
    | { kind: "map"; subject: string | null; nodeId: string | null }
    | { kind: "element"; subject: string; elementId: string };
  export function parseHash(hash: string): Route;
  export function buildHash(subject: string, nodeId: string | null): string;   // 既有，維持
  export function buildElementHash(subject: string, elementId: string): string; // 新增
  ```
- **App 層路由分派**：`App.tsx` 依 hash 解析結果分派——`element` 路由渲染 `<ElementPage>`（取代地圖視圖），`map` 路由照舊。`hashchange` listener 同步處理兩種路由；元素不存在時退回該 subject 的地圖視圖（沿用既有 `resolveHash` fallback 精神）。
- **`<ElementPage>` 新元件**（`src/components/ElementPage.tsx`）：負責左導覽、麵包屑、文章頭部、中央文章、右側目錄、頁尾導航與聚焦模式的組裝。文章本體用 `getElementMdx(graph.subject, element.id)` + `elementMdxComponents(element, onQuizSolved)` 渲染。
- **Element 點擊改為頁面導航**：DetailPane 的教/關聯 chips、NodeDetailView 元素列、星雲/Roadmap 的 element 節點、⌘K 搜尋結果、文章內 element wikilink——凡目標是 element 者，一律改為設定 hash 至 element 路由（自動跳轉）。DetailPane 保留 node 閱讀與其 element chips 作為頁面連結；不再需要於 pane 內 push element view。
- **右側目錄（scroll-spy）**：於 render 後以 ref 收集文章內 `h2`，即時生成錨點列表；以 `IntersectionObserver` 高亮目前段落，點擊以 `scrollIntoView` 捲動。不做 build-time 標題 id，不改 generator seam；段落級 deep-link（`#section`）列為 backlog。
- **聚焦模式**：`ElementPage` 的暫態 state（true/false）；開啟時隱藏左導覽、右目錄、麵包屑、頁尾導航，文章居中等寬；Esc 關閉；切換按鈕置於頂欄右側與右目錄進度卡附近。不寫入 URL（同 DetailPane full-read 先例）。
- **頁尾 prev/next**：依該 subject 內 element 的 `order` 排序（跨 tier 無妨），取前後元素；不存在時隱藏對應端。
- **進度整合**：完成開關沿用 `CompletionToggle` + `isCompletionLocked`，進度寫入 `localStorage`（`knowledge-map:progress`），與地圖共享同一份記錄。question 元素答對才解鎖標記。
- **不引入**：React Router（此 app 為 hash 單頁，無需路由函式庫）；不修改 generator 產出的 `graph.json` 內容契約（element 頁面的內容仍由 client 編譯 MDX 渲染）。

## Testing Decisions

- **單一測試 seam（已確認）**：`lib/hashlink.ts` 的路由純函式。這是最高的純函式點，無 DOM、可確定性測試；既有 `hashlink.test.ts` 即為此 seam 的先例。
- **測什麼**（Vitest，沿用 `hashlink.test.ts` 風格）：
  - `parseHash` 解析 `#/elements/<subject>/<slug>` 回傳 `{ kind: "element", subject, elementId }`。
  - `parseHash` 仍正確解析既有 `#s=..&p=..` map 路由（回歸）。
  - `buildElementHash` 產出 canonical 字串並可 round-trip 過 `parseHash`。
  - 無 hash、空 hash、不認識的 prefix 一律回傳 map 路由（fallback 安全）。
  - subject/slug 含需 URL-encode 字元時能正確 round-trip。
- **不做單元測試**（依 v0.2 先例）：ElementPage 佈局、scroll-spy 目錄、聚焦模式、MDX 渲染、QuizBlock/VideoEmbed 互動——以 `npm run dev` 人工驗證。
- **回歸錨點**：既有 `hashlink.test.ts`、`completion.test.ts`、`progress.test.ts`、`mdx.test.tsx`、`generator.test.ts` 全數保持綠。

## Out of Scope

- 真實路徑 `/elements/<slug>`（需伺服器 SPA fallback，與純靜態/開本地檔案衝突，已確認 hash 路徑）。
- 段落級 deep-link（`#/elements/<s>/<id>#section`）——scroll-spy 目錄先做，錨點 URL 列 backlog。
- 聚焦模式寫入 URL / 可分享的專注狀態。
- Element 內容改由 generator 寫進 `graph.json`（維持 client 編譯 MDX，ADR-0001）。
- 行動裝置優先的 element 頁面設計（沿襲 PRD §3：desktop-oriented + graceful fallback）。
- element-only 圖視圖、多 subject 同畫面（沿襲既有非目標）。
- 從 UI 編輯課程內容（sources 保持 immutable）。
- 未定案方案 B–E 的視覺（保留於 `.scratch/element-page-designs/`，日後可另開 spec 採用）。

## Further Notes

- 本 feature 的決策已落地於：`knowledge-map/CONTEXT.md`（領域詞彙，新增「Element 頁面」路由詞彙）、`knowledge-map/PRD.md`（新增對應 FR 與 G2「Read in place」的延伸：element 頁面 + 聚焦模式，deep-link 由 node 延伸至 element）。
- 施工順序建議：先擴充 `lib/hashlink.ts` + 測試（純函式、可獨立完成）→ 再建 `<ElementPage>` 靜態佈局（以單一元素餵入）→ 再串 App 路由分派與各點擊入口的跳轉 → 最後加 scroll-spy 目錄與聚焦模式。
- 當 element 頁面上線後，「點 element 跳頁」取代 DetailPane 內 element view；這會改變 DetailPane 的 breadcrumb 行為，需人工驗證 map ↔ element 頁面的往返體驗。
