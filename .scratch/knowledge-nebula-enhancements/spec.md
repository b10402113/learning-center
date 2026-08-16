# 知識星雲 v0.2 — 部落格 stack 借鏡（Rich Content / 搜尋 / 動畫 / 互動範例）

Status: ready-for-agent
Feature: knowledge-nebula-enhancements
Created: 2026-08-15

> 前置：本 spec 建立在 `.scratch/knowledge-nebula/spec.md`（v0.1）之上，只描述 v0.2 新增/異動的範圍。領域詞彙依 `knowledge-map/CONTEXT.md`；兩個架構決定已寫入 `knowledge-map/docs/adr/`（ADR-0001 remark/rehype 管線、ADR-0002 純靜態 + Sandbox 例外）。

## Problem Statement

v0.1 的地圖只會渲染純散文的課程內容：markdown 由手寫 regex 轉 HTML，遇到程式碼區塊、數學公式、互動範例就撐不住。同時，學習者面對 30+ 節課的 subject 沒有全文檢索能力，視圖切換與面板導航的動畫是硬編 CSS keyframes、平淡且無狀態連續性。

部落格已經踩過這些坑（Shiki、remark/rehype、互動 playground、View Transitions、動畫函式庫、Fuse.js 類搜尋、Feather 圖示），這份 spec 把「已被驗證的解法」借進 knowledge-map，但要守住 v0.1 的純靜態核心：不引入後端、資料永遠由 markdown 生成、地圖永不失真。

## Solution

課程內容升級為「富內容」：generate 階段以 remark/rehype 管線取代手寫 renderer，fenced code block 由 Shiki（GitHub Dark）建置期高亮、數學由 KaTeX 建置期渲染、輸出過 rehype-sanitize 白名單後進 `graph.json`，client 仍只吃預渲染 HTML（零 runtime markdown 引擎）。

互動範例用 ` ```sandpack ` code fence 在 lesson 內宣告，generator 抽出成 sandpack 設定進 `graph.json`，DetailPane 以 React.lazy 只在含範例的 lesson 載入 Sandpack（這是純靜態唯一的明示外部 runtime 例外，ADR-0002）。

全文搜尋：Fuse.js 的 index 在 generate 階段預建、隨 `graph.json` 出貨；⌘K 開啟搜尋面板，fuzzy 比對 node title/goal 與 lesson/element 全文，結果依 subject 分組，點選後 seat camera 並開 DetailPane。

動畫：視圖切換（星雲↔塔圖）與 DetailPane 導航用 View Transitions API（use-view-transitions wrapper）；React Spring 管數值插值（進度環），Framer Motion 管 chrome 微互動（TopBar、HoverCard、pane 進出場），取代現有 CSS keyframes；`useReducedMotion` 維持無障礙。

圖示：Feather 作為 `src/components/icons/` 手寫 inline SVG 的參考來源，不引入 runtime icon library。

拒絕導入：Linaria/Pigment CSS（Tailwind v4 已達 zero-runtime）、MongoDB（likes）、PartyKit（即時同步）、hosted Algolia（皆與純靜態衝突）。

## User Stories

1. 作為學習者，我讀含程式碼的 lesson 時能看到語法高亮，所以程式碼比純文字更好理解。
2. 作為學習者，我在 lesson/element 中能看到數學公式渲染，所以量化與演算法課程可讀。
3. 作為學習者，code block 即使未標語言也能正常顯示（不高亮但不崩潰），所以任何 fenced block 都可讀。
4. 作為學習者，lesson 裡的互動範例能在面板中直接執行/編輯（Sandpack），所以我可以動手學而不跳離地圖。
5. 作為學習者，離線或載入失敗時互動範例會顯示佔位提示而非白畫面，所以 app 其他部分不受影響。
6. 作為學習者，只有含互動範例的 lesson 才下載 Sandpack 的資源，所以普通 lesson 開啟依然快。
7. 作為學習者，我按 ⌘K 能開啟全文搜尋面板，所以我可以直接找到某段內容而不必逐 tile 翻。
8. 作為學習者，搜尋是模糊比對（fuzzy），所以記不清確切標題也能命中。
9. 作為學習者，搜尋結果依 subject 分組顯示，所以我知道命中內容屬於哪門課。
10. 作為學習者，我點搜尋結果會跳轉到該 lesson 並開起面板，所以搜尋與地圖導覽無縫銜接。
11. 作為學習者，搜尋涵蓋 node title/goal 與 lesson/element 全文，所以「記得片段」也能找到原文。
12. 作為學習者，我在星雲與塔圖之間切換時能看到順暢的視圖轉場，所以不會有硬切斷裂感。
13. 作為學習者，面板前進/後退導覽有方向性轉場，所以我知道自己在概念圖中的移動方向。
14. 作為學習者，關閉面板有淡出轉場，所以關閉動作有回饋。
15. 作為學習者，NodeDetailView 的進度環會平滑動畫到完成比例，所以進度變化有感知。
16. 作為學習者，我操作 TopBar/HoverCard/面板進出場時有細微動畫，所以介面有質感且狀態連續。
17. 作為學習者，我開啟「減少動態效果」時所有轉場與動畫都停用，所以無障礙需求被尊重。
18. 作為開發者，markdown 渲染改由 remark/rehype 管線處理，所以新增內容型態（code/math/interactive）不需在手寫 regex 上再補洞。
19. 作為開發者，渲染輸出過 rehype-sanitize 白名單，所以未來即使內容來源更複雜也有注入防護。
20. 作為開發者，Shiki/KaTeX 都在 generate 階段完成，所以 client bundle 零新增渲染成本。
21. 作為開發者，全文搜尋 index 是 build-time 預建、隨 `graph.json` 出貨，所以符合「資料永遠由 markdown 產生」的 principle。
22. 作為開發者，` ```sandpack ` code fence 由 generator 解析並抽出，所以互動範例與課程內容同源、不會手動維護兩份。
23. 作為開發者，生成仍是確定性的（同輸入同輸出），所以 generator 測試可靠。
24. 作為開發者，sandpack 設定缺損（缺 template/檔案）時 generator 降級跳過該範例而非報錯，所以任何 subject 都能生成成功。
25. 作為設計者，需要新圖示時以 Feather 為參考重製，所以圖示風格一致且不引入 runtime 依賴。

## Implementation Decisions

- **渲染管線（ADR-0001）**：`generate` 階段以 unified remark/rehype 管線取代手寫 regex renderer。產出仍是 build-time HTML 字串進 `graph.json`，DetailPane 照舊消費預渲染 HTML，client 不引入 runtime markdown 引擎。既有 `renderMarkdown` 的輸出語意（wikilink 結構、sources 段落、prepare/full-article 欄位）必須保持相容，wikilink 仍產 `.wikilink[data-target]`。
- **語法高亮**：Shiki，GitHub Dark theme，建置期跑（rehype plugin）。僅對帶 language tag 的 fence 高亮；未標語言者維持無高亮 `<pre><code>`。
- **數學**：KaTeX 建置期渲染（remark-math + rehype-katex）；KaTeX CSS 抽進 app 樣式，不需 runtime JS。
- **淨化**：rehype 輸出過 `rehype-sanitize` 白名單；白名單必須保留 `.wikilink[data-target]`、code/pre 與 class（Shiki/KaTeX 產出的 class）與 sandpack 相關區塊。
- **互動範例（ADR-0002）**：lesson 內 ` ```sandpack ` fenced block 宣告範例（內容為 sandpack 檔案的序列化設定）。generator 抽出成 subject 的 sandpack 設定、隨 `graph.json` 出貨。DetailPane 只在「該 lesson 含 sandpack 設定」時以 `React.lazy` + Suspense 載入 `@sandpack/react`，不進主 bundle。載入失敗/離線顯示佔位（non-goal：離線 snapshot 渲染，見 Out of Scope）。
- **全文搜尋**：`graph.json` 內新增 build-time 預建的 Fuse.js index（`Fuse.createIndex` 序列化），涵蓋 node title/goal 與 lesson/element 全文。⌘K 開啟搜尋面板（取代 v0.1 的「⌘K 聚焦 subject select」導航搜尋，見 CONTEXT.md）。結果依 subject 分組；點選結果 → seat camera + 開 DetailPane，行為與 deep-link 一致。Fuse threshold 等參數以「標題優先、全文其次」的體驗目標調校。
- **視圖轉場**：原生 View Transitions API（`use-view-transitions` wrapper）用於視圖切換與 pane 導航。Nebula 是 canvas，無 DOM subtree 可過渡——canvas 容器做整面 fade；Tower 與 chrome 做真正的 cross-fade/位移。`prefers-reduced-motion` 一律停用。
- **動畫分工**：React Spring → 數值插值（NodeDetailView 進度環 strokeDasharray、數字過場）；Framer Motion → chrome 微互動（TopBar、HoverCard、DetailPane 進出場，取代現有 CSS keyframes `pane-forward/pane-back/pane-fade`）。塔圖 tile 重排的 `layout` 動畫**不做**（React Flow viewport transform 有衝突風險，列 backlog spike）。
- **圖示**：Feather 為 `src/components/icons/` 手寫 inline SVG 的參考來源；維持 stroke = `currentColor` 與現有手寫 pattern，不引入 icon runtime 依賴。
- **資料契約擴展**（`graph.json`，來自 grilling 定案，非原型）：現有 subject 結構不變，node 欄位新增可選 `sandpack`（抽出後的互動範例設定）；subject 層級新增 `searchIndex`（Fuse.js 預建 index）。
- **拒絕**：Linaria/Pigment CSS（Tailwind v4 已 zero-runtime，不疊第二套樣式系統）、MongoDB（likes）、PartyKit（即時同步）、hosted Algolia（搜尋改本地 Fuse.js，純靜態相容）。MDX（`next-mdx-remote` 是 Next.js 專用）不引進——v0.2 只需 static markdown 管線，不需要 lesson 內嵌 React 元件。

## Testing Decisions

- **單一測試 seam（維持 v0.1）**：generator 純函式「markdown → `graph.json`」。這是全 feature 高決策密度、純 Node 無 DOM 的點；client 側（View Transitions、Motion/Spring、⌘K 面板、Sandpack 渲染）以 `npm run dev` 人工驗證，不寫單元測試。
- **測什麼**（Vitest + 純 Node，沿用 `.scratch/knowledge-nebula` 與 chartr/web 的測試先例）：
  - remark/rehype 管線產出：fence → 帶 Shiki class 的 `<pre><code>`；math → KaTeX HTML；wikilink 結構相容不破。
  - `rehype-sanitize` 白名單：`data-target` 與 Shiki/KaTeX class 被保留、script/event handler 被剝除。
  - ` ```sandpack ` code fence 抽出為 sandpack 設定；設定缺損時降級跳過。
  - Fuse.js index build-time 預建、序列化進輸出、且確定性（同輸入兩次 index 一致）。
  - 整體輸出確定性保持 byte-identical（既有 determinism 測試持續通過）。
  - 既有 generator 測試（frontmatter、markdown rendering、graph building、edge 推導、determinism）在管線替換後全數保持綠色——這是管線相容性的回歸錨點。
- **測試先例**：`knowledge-map/src/__tests__/generator.test.ts`（fixture subject 餵入生成函式）；chartr/web 的 Vitest 測試風格。

## Out of Scope

- MongoDB（likes）、PartyKit（即時同步）、hosted Algolia、任何自有後端（純靜態為定論，ADR-0002）。
- Linaria / Pigment CSS。
- MDX / lesson 內嵌任意 React 元件。
- 塔圖 tile 重排的 Framer Motion `layout` 動畫（React Flow 衝突風險，列 backlog spike）。
- Sandpack 離線 snapshot 渲染（offline 時只有佔位提示，見 Open Questions）。
- 搜尋 UI 的進階功能（subject 內過濾、歷史紀錄、鍵盤全導航）。
- 行動裝置優先設計、element-only 圖視圖、多 subject 同畫面（沿襲 v0.1）。
- 圖示自動化（不建立 icon pipeline；繼續手寫）。

## Further Notes

- 本 feature 的決策已落地於：`knowledge-map/CONTEXT.md`（領域詞彙）、`knowledge-map/docs/adr/0001-remark-rehype-pipeline.md`、`knowledge-map/docs/adr/0002-pure-static-sandpack-exception.md`、`knowledge-map/PRD.md`（v0.2：新增 G6、FR-11/12/13，修訂 §3/§9/§10，Appendix A 補 stack）。
- Open Questions（記錄於 PRD §10）：Sandpack 離線行為（佔位 vs 預渲染 snapshot）；Framer Motion `layout` 塔圖 tile 重排的可行性 spike；搜尋參數的實際調校值。
- 管線替換是 hard-to-reverse、影響全站輸出，施工順序建議：先換 remark/rehype 並保持既有 generator 測試全綠 → 再加 Shiki/KaTeX/sanitize → 再加 sandpack 抽出 → 再加 Fuse 索引 → 最後做 client 側（轉場/動畫/⌘K 面板/Sandpack 渲染）。
