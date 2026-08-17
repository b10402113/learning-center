# Tickets: Step-DAG 遷移 — step 成為地圖單位、step 完成度、step 閱讀面

把 `knowledge-map` 前端對齊學習管線的 step-DAG 模型：step 成為地圖的最小單位（星雲節點、
Roadmap DAG、獨立路由）、完成度改為 per-step（mastery 種子 + 手動覆寫）、node 完成由 DAG
推導、element 頁 taught-by 改列 step、question 互動測驗退休。源自
`.scratch/knowledge-map-step-dag/spec.md`（ready-for-agent）。

資料契約已落地（commit `a08a81e`）：`types.ts` 對齊 generator 輸出（`Step`、`SubjectGraph.steps`、
`EdgeKind "step-dep"`、`Element.taughtBySteps`/`deprecated`），`generator.test.ts` 斷言新契約，
`graph.json` 重新生成為 quant-resource。以下票不再碰契約本身，只消費它。

Work the **frontier**：任何 blockers 都完成的票即可開始。票 1 無依賴；票 2 完成後，票 3、4、5
可並行。每張票以 `/implement` 單張推進，票間清空 context。

## 1. Step-based 完成度（seam 3）

**What to build:** 學習者的進度只剩「step」一種單位。generate 時 `generate-data.mjs` 讀
`learn/<subject>/mastery.md`，用 source-locator 交集把 strand 對映到 step：step 的 `teaches`
元素所引用（透過 `sources`）的 strands 全為 `solid` 時，該 step 種子標完成（種子隨
`graph.json` 出貨，唯讀；交集解析不出來就不種子化——目前 quant-resource 無 `solid` strand，
種子為空）。`completion.ts` 改為 step-based 純函式：node 完成 ⟺ 其 `steps` DAG 內全部 step
完成，完成 = 種子 ∪ 手動覆寫。`progress.ts` 改存 step id 集合（`localStorage` key 沿用，值語意
從 element id 改為 step id），手動覆寫優於種子。App 由 step 完成推導 completedSteps 與
completedNodes。element 完成標記全面移除：node checklist、element CompletionToggle、
`isCompletionLocked` / `quizSolved` gating 全部刪除（ADR-0005）。element 是 keyword，永不被標完成。

**Blocked by:** None — can start immediately.

- [x] `completion.ts`：`isStepComplete`（step 完成 = 種子 ∪ 手動集合）、`nodeCompletion`（node 完成 ⟺ 其 DAG 全 step 完成）、純函式、無 storage/DOM 存取；`completion.test.ts` 改為 step-based 推導測試（種子與手動覆寫交互、node 全完成才標完成、element id 不再參與）
- [x] `progress.ts`：`SubjectProgress` 由 `elements: string[]` 改為 step id 集合（命名可異動，語意為 step id）；`parseProgress` 相容既有 storage shape（含 legacy 遷移規則）；`progress.test.ts` 更新
- [x] `generate-data.mjs`：讀 `learn/<subject>/mastery.md`，以 source-locator 交集把 strand rating 對映到 step，`solid` 全覆蓋的 step 種子完成；種子欄位隨 `graph.json` 出貨（唯讀）；`types.ts` 對應新增種子欄位
- [x] `generator.test.ts`：fixture 加 mastery.md，斷言種子規則——無 mastery 檔 / 無交集 → 空種子；部分 strand `solid` → 僅對應 step 種子；全部 `solid` → 全 step 種子
- [x] App.tsx：由 `graph.steps` + `progress` 推導 completedSteps 與 completedNodes（node 完成由 DAG 推導）；移除 element 完成 toggle、quizSolved state、`isCompletionLocked` 使用
- [x] 移除 element 完成 UI：NodeDetailView checklist（`nodeItems` 依賴已空之 `taughtElementIds`）、ReaderPage element CompletionToggle 與 lock、元素完成 toast/標記
- [x] 回歸錨點：`hashlink.test.ts`、`mdx.test.tsx`、`generator.test.ts` 全數綠；`npm run typecheck` 與 `npm run build` 通過
- [x] 人工驗證（`npm run dev`）：node 全部 step 完成才顯示完成；手動 toggle step 即時反映並覆蓋種子；element 不再有任何完成標記

## 2. Step 路由 + registry + step 頁 + node 頁 step-DAG（seam 2）

**What to build:** step 成為可分享、可書籤、可返回的最小可讀單位。`#/steps/<subject>/<node-id>/<step-id>`
落地該 step 的獨立全頁（沿用三欄 docs 佈局），麵包屑返回所屬 node、prev/next 依該 node 的 step
DAG order。`lib/hashlink.ts` 的 `Route` 加 `{ kind: "step"; subject; nodeId; stepId }` 並提供
`buildStepHash`；`ReaderModalTarget` 加 step kind，元素視窗可承載 step 並「展開」成獨立頁。
`mdxRegistry.ts` glob 擴充至巢狀 step 檔（`nodes/<node-id>/<step-id>.mdx`）。node 頁由
「文章」改為「容器」：顯示 lesson 說明 + step-DAG（每個 step 標明 deps），點任一 step 讀它。
App 的 `resolveRoute` 分派 step 路由，壞掉的 deep-link 優雅退回地圖。

**Blocked by:** 票 1（Step-based 完成度）— 兩票皆重寫 `App.tsx`，序接避免衝突

- [ ] `hashlink.ts`：`Route` 加 step kind；`parseHash` 解析 `#/steps/<subject>/<node-id>/<step-id>`（decode、round-trip、malformed fallback 到 map）；`buildStepHash`；`hashlink.test.ts` 擴充 step 路由用例，既有用例保持綠
- [ ] `ReaderModalTarget` 加 `{ kind: "step"; subject; nodeId; stepId }`；App `expandReaderModal` / reader 導航支援 step target
- [ ] `mdxRegistry.ts` glob 巢狀 step 檔，新增 `getStepMdx(subject, nodeId, stepId)`；`mdx.test.tsx` 覆蓋巢狀 glob（人工驗證亦可，依既有先例）
- [ ] `ReaderPage` 加 `mode: "step"`：step 文章渲染、麵包屑「subject / node / step」返回所屬 node、prev/next 依該 node step DAG order（不存在端隱藏）、step 頁內 wikilink 攜帶 step 來源、focus 模式沿用
- [ ] `NodePage`：node 頁顯示 lesson 說明 + step-DAG（每 step 卡含 deps 標記），點 step 導航至該 step 頁；node 頁右側 TOC 由「教的元素」改為 step 清單
- [ ] App：`resolveRoute` 驗證 step 存在（subject + node + step 三者皆有效）才接受 step 路由，否則退回地圖；`hashchange` 在 step 路由與 map 間正確切換；貼 `#/steps/…` 直接落地該 step 頁
- [ ] 回歸錨點：既有全部測試綠；`npm run typecheck` 與 `npm run build` 通過
- [ ] 人工驗證（`npm run dev`）：step 頁面包屑回 node、node 頁 DAG 目錄、step deep-link 落地與退回、reader modal 承載 step 並展開

## 3. 星雲 step 節點

**What to build:** 星雲圖反映課程教學結構。`ForceMap` 的圖節點改為 step（`p:<nodeId>/<stepId>`，
標籤顯示 step 標題 + 所屬 node 標題），element 小圓圈保留（`n:<elementId>`）；連線只剩
`step-dep`（從 step `deps` 產生，`LINK_STYLES` 加 `step-dep` 樣式）與 step→element teach
連結（從 step `teaches` 產生）；spine / shared-concept / explicit 邊與 node 卡不再繪製。
點擊 step 節點開啟該 step 閱讀（經票 2 的 reader target 或獨立路由），hover 高亮其 step-dep
與 teach 鄰居；完成狀態（票 1 資料）渲染在 step 節點上。

**Blocked by:** 票 2（Step 路由 + 閱讀面）— step 節點點擊需經 step reader/路由落地

- [ ] `buildData`：節點由 node 卡改為 step（`p:<nodeId>/<stepId>`），element 圓圈照舊；teach 連結由 step `teaches` 產生；`step-dep` 邊由 step `deps` 產生並加入 `LINK_STYLES`（含 dash/顏色）；spine / shared / explicit 邊不畫
- [ ] 節點標籤：step 顯示標題並帶所屬 node 標籤（字型/尺寸沿用既有 canvas 樣式）；element 標籤照舊
- [ ] step 節點完成渲染：`completedSteps`（票 1 資料）的 step 以完成色渲染；element 圓圈不再以完成/未完成區分（element 永不標完成）
- [ ] 點擊 step 節點開啟 step 閱讀（reader modal，可展開為 `#/steps/…` 全頁）；hover 高亮 step-dep + teach 鄰居，非鄰居降透明度；`seatOnNode`/`focusRequest` 對 step id 生效
- [ ] `MapHandle` / 選中狀態（`selectedId`）語意改為 step id（`nodeId/stepId`），與 App 的 step 導航接軌
- [ ] 回歸錨點：既有測試綠；`npm run typecheck` 與 `npm run build` 通過
- [ ] 人工驗證（`npm run dev`）：quant-resource 星雲圖只畫 step 節點 + element 圓圈 + step-dep/teach 兩類線；點 step 讀文章

## 4. Roadmap DAG 展開

**What to build:** Roadmap 的 tier 行與 node 卡保留；點選 node 卡展開顯示該 node 的 step-DAG
（step 卡 + 依賴箭頭）與 node 的 lesson 說明，學習者一眼看到「這堂課怎麼上」。展開後的 step
卡可直接點開讀該 step 文章（經票 2 路由）。element 標記靠向教它的 step。node 完成（票 1 資料）
在卡上反映；`NodeDetailView` 面板依實際需要改寫或退休（其 checklist 語意已被票 1 移除）。

**Blocked by:** 票 2（Step 路由 + 閱讀面）— step 卡點擊需經 step 路由落地

- [ ] `RoadNode`：node 卡保留 tier/標題/完成狀態；點擊展開出 step-DAG——每 step 一張小卡（標題、完成狀態、deps 標記）+ 依賴箭頭（smoothstep 或等價），再次點擊收合
- [ ] 展開區顯示 node 的 lesson 說明（`goal` / lesson 摘要）；element 標記（如有）靠向教它的 step 而非 node
- [ ] 點擊展開後的 step 卡導航至該 step 閱讀（reader 或 `#/steps/…` 全頁）；node 卡點擊行為與展開共存（點卡展開、點 step 讀文章、再點卡收合）
- [ ] `NodeDetailView` 依實際需要改寫或退休：不再以 element checklist 為完成來源，其存在與否以展開行為取代為準
- [ ] `selectedId`/`focusRequest` 對 node 卡與 step 卡皆正確；`MapHandle` 語意與票 3 一致
- [ ] 回歸錨點：既有測試綠；`npm run typecheck` 與 `npm run build` 通過
- [ ] 人工驗證（`npm run dev`）：展開 quant-resource 每張 node 卡見 step-DAG 與 lesson；step 卡可讀文章；完成狀態正確反映

## 5. Element 頁 taught-by steps + question 退休

**What to build:** element 頁「taught by」改列真正教它的最小單位——step（含所屬 node 標籤），
點擊下鑽回 step 頁；`?from=` 來源解析維持（退回規則：`from` → 第一個教授 step 的 node → 無
來源）。`question` element 不再渲染互動測驗（`QuizBlock` 從文章元件移除，「N 題測驗」chip 移除，
`questions` 資料欄位保留於 graph 但不驅動 UI）；`deprecated` 的 question 元素照常渲染文章頁，
只是沒有測驗。`video` 保留。舊式單文章 node（無 steps）不支援。

**Blocked by:** 票 2（Step 路由 + 閱讀面）— `ReaderPage` 先落地 step mode，本票在其上改寫

- [ ] `ReaderPage` element 模式：「由哪堂課教授」改列 `taughtBySteps`（每項顯示 step 標題 + 所屬 node 標籤），點擊導航至該 step 頁（含 `from` 來源）；無 `taughtBySteps` 時該區塊省略
- [ ] `resolveElementSource` 退回規則更新：`from` 有效 → 用之；否則第一個教授 step 的 node；再無 → null；`hashlink.test.ts` 更新並保持綠
- [ ] 移除 `QuizBlock` 於 `mdxComponents` 的註冊與元素文章內的渲染（`elementMdxComponents` 不再注入 QuizBlock）；question 元素 meta chip「N 題測驗」移除；`question` 元素文章照常以純文章渲染
- [ ] `video` type 維持：VideoEmbed 保留；`deprecated` 元素照常渲染頁面
- [ ] 回歸錨點：既有測試綠（`mdx.test.tsx` 的 QuizBlock fixture 用例更新為無 quiz 渲染）；`npm run typecheck` 與 `npm run build` 通過
- [ ] 人工驗證（`npm run dev`）：quant-resource element 頁 taught-by 列 step 且可跳 step 頁；question 元素（若有）渲染為無測驗的純文章頁