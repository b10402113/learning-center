# Spec — Step-DAG 遷移：step 成為地圖單位、step 完成度、step 閱讀面

Status: ready-for-agent
Feature: knowledge-map-step-dag
Created: 2026-08-17

> 前置：本 spec 建立在 `.scratch/unified-reading-surface/spec.md`（統一閱讀面）之上，只描述本 feature 新增/異動的範圍。領域詞彙依 `knowledge-map/CONTEXT.md`（新增「Step / 步驟」「Step 頁面」，進度改為 per-step）；架構決策依 `knowledge-map/docs/adr/`（ADR-0001 remark/rehype 管線、ADR-0002 純靜態、ADR-0003 統一閱讀面，新增 ADR-0004 step-DAG 視圖）。學習管線側的資料模型變更由 `.scratch/adaptive-learning-pipeline/spec.md`（ADR 0003–0005）定義，本 spec 只做其前端消費端。

## Problem Statement

學習管線已遷移到 step-DAG 模型（repo ADR 0003–0005）：node 不再是一篇文章，而是裝著 step-DAG（step ids + deps）與 main lesson 的容器；step 才是第一等文章檔（`nodes/<node-id>/<step-id>.mdx`），並宣告它教的 elements；element 是 keyword 字典頁；完成度只有 step 一種單位（`/tackle` 通過、mastery 達 `solid`）。

但 `knowledge-map` 前端還停在舊模型：地圖上的主節點是 node 卡、teach 連結靠 `node.taughtElementIds`（node frontmatter 已無 `elements`，此欄位現在是空的）、完成度靠 element checkbox 推導（ADR-0002 checklist 模型，已被 ADR-0005 取代）、step 檔案不在 MDX registry、也沒有 step 路由。重新生成後地圖會直接壞掉：`step-dep` 邊在 `EdgeKind` 沒有型別、`LINK_STYLES` 沒有對應樣式、teach 連結空掉、完成度退化。

學習者要的是：地圖反映真實課程結構——step 是可讀、可完成、可分享的最小單位；node 是 step 的容器；element 是被 step 教的字典頁。

## Solution

把前端對齊 step-DAG 模型，三條主線：

1. **資料契約**（seam 1）：`types.ts` 對齊 generator 已輸出的 `graph.json`——`SubjectGraph` 加 `steps`；`EdgeKind` 加 `step-dep`；element 加 `taughtBySteps` 與 `deprecated`；node 不再以 `taughtElementIds` 為 teach 來源。重新生成後地圖資料是 `quant-resource`（muscle-ladder 目錄已空）。
2. **完成度**（seam 3）：step 是唯一完成單位。generate 時讀 `learn/<subject>/mastery.md`，node 對應 strands 為 `solid` 的 step 種子為完成；`localStorage` 存手動覆寫的 step id 集合。node 完成 = 其 DAG 全部 step 完成。element checkbox 完成移除（ADR-0005）。mastery 是唯讀種子，不是 client-owned 狀態。
3. **視圖與閱讀**（seam 2）：星雲圖主節點是 step（帶所屬 node 標籤），小圓圈 element 照舊，連線只剩 `step-dep` 與 step→element teach 連結；Roadmap 每張 node 卡展開顯示 step-DAG（step 卡 + 依賴箭頭）與 node lesson 說明，element 標記靠向教它的 step；step 有獨立路由 `#/steps/<subject>/<node-id>/<step-id>` 與元素視窗 target；node 頁顯示 lesson 說明 + step-DAG；element 頁「taught by」改列 step（含所屬 node）。

`question` element type 移除（互動測驗退休，graded verification 只存在 `/tackle`）；舊式單文章 node（無 steps）不支援。

## User Stories

1. 作為學習者，我在星雲圖看到每個 step 是一個節點（帶所屬課程標籤）、概念小圓圈靠向教它的 step，所以我一眼看到課程的教學結構。
2. 作為學習者，我在星雲圖只看到 step 依賴線與 step→element 教學線，所以圖不會被舊的順序／共用／關係線塞滿。
3. 作為學習者，我在 Roadmap 點一張 node 卡會展開該 node 的 step-DAG（step 卡 + 依賴箭頭）與 lesson 說明，所以我看到「這堂課怎麼上」。
4. 作為學習者，我在 Roadmap 點展開後的 step 卡可以直接讀該 step 文章，所以課程容器與最小可讀單位都有入口。
5. 作為學習者，我貼上 `#/steps/<subject>/<node-id>/<step-id>` 會直接落地該 step 的獨立全頁，所以 step 可分享、可書籤、可進上一頁。
6. 作為學習者，我在 node 頁看到 lesson 說明 + 全部 step（依賴關係標明），點任一 step 讀它的文章，所以 node 頁是 step 的目錄。
7. 作為學習者，我在 element 頁看到「taught by」列的是 step（含所屬 node），所以我可以從概念下鑽回真正教它的最小單位。
8. 作為學習者，mastery 為 `solid` 的 step 在地圖上自動顯示完成，所以系統的判定直接反映在地圖上。
9. 作為學習者，我可以手動把某個 step 標成完成或取消，所以我對自己的進度保有控制。
10. 作為學習者，一個 node 的 DAG 內所有 step 都完成時，該 node 顯示完成，所以課程容器的完成度自動由 step 推導。
11. 作為開發者，`EdgeKind` / `SubjectGraph` / element 型別對齊 generator 輸出，所以重新生成後 typecheck 綠、地圖不壞。
12. 作為開發者，`completion.ts` / `progress.ts` 只處理 step id，所以完成度邏輯只有一份、可純函式測試。
13. 作為開發者，step 路由與來源解析維持純函式，所以 URL 行為可測、可確定性測試。
14. 作為開發者，`question` 元素不再有互動測驗渲染，所以已退休的驗證模型不會殘留在 UI。

## Implementation Decisions

- **資料契約（seam 1，已確認）**：`types.ts` 新增 `Step` 介面（`id` 為 node-qualified `nodeId/stepId`、`stepId`、`nodeId`、`title`、`order`、`deps`、`teaches`、`sources`）；`SubjectGraph` 加 `steps: Record<string, Step>`；`EdgeKind` 加 `"step-dep"`；`Element` 加 `taughtBySteps: string[]` 與 `deprecated: boolean`；`Node` 移除 `taughtElementIds` 作為 teach 來源。`generate-data.mjs` 已產出這些欄位（含 `deprecated`、`taughtBySteps`、`step-dep` 邊）；本 feature 不另改 generator 產出，只消費。
- **完成度（seam 3，已確認）**：`completion.ts` 改為 step-based——node 完成 = 其 `steps` DAG 內所有 step 完成。generate 時讀 `learn/<subject>/mastery.md`，把 node 對應 strand 為 `solid` 的 step 種子標完成；種子隨 `graph.json` 出貨（唯讀）。`progress.ts` 改存 step id 集合（`localStorage` key 沿用，值語意從 element id 改為 step id）。手動覆寫優於種子。元素完成標記移除。
- **星雲視圖（已確認，ADR-0004）**：`ForceMap` 圖節點改為 step（`p:<nodeId>/<stepId>`），元素圓圈保留（`n:<elementId>`）；teach 連結由 step `teaches` 產生；`step-dep` 邊從 node `steps` DAG 的 `deps` 產生並加入 `LINK_STYLES`；spine / shared-concept / explicit 邊不畫。節點標籤帶所屬 node 標題。
- **Roadmap 視圖（已確認，ADR-0004）**：tier 行與 node 卡保留；點選 node 卡展開其 step-DAG（step 卡 + 依賴箭頭）與 lesson 說明；element 標記靠向教它的 step。
- **閱讀與路由（seam 2，已確認）**：`lib/hashlink.ts` 的 `Route` 加 `{ kind: "step"; subject; nodeId; stepId }`；canonical hash `#/steps/<subject>/<node-id>/<step-id>`；`ReaderModalTarget` 加 step kind。`mdxRegistry.ts` glob 擴充至巢狀 step 檔（`nodes/<node-id>/<step-id>.mdx`）。
- **Element 頁（已確認）**：「taught by」由 `taughtByNodes` 改為 `taughtBySteps`（含所屬 node 標籤），`?from=` 來源解析維持（退回規則：`from` → 第一個教授 step 的 node → 無來源）。
- **退休（已確認）**：移除 `question` element 互動測驗渲染（`QuizBlock.tsx`）；`VideoEmbed` 保留（`video` type）。不支援舊式單文章 node（無 steps）。
- **不引入**：React Router（維持 hash 單頁）；不修改學習管線的 markdown 格式；不讓 `mastery.md` 成為 client-owned 狀態。

## Testing Decisions

- **好測試的定義**：只測外部行為與純函式——資料契約的型別/結構對齊、完成度推導的決定性輸出、URL 路由的 parse/build round-trip；不測視覺佈局。
- **測什麼**：`completion.ts`（step-based 完成推導：node 完成 ⟺ 全 step 完成；種子與手動覆寫交互）；`lib/hashlink.ts`（`#/steps/<subject>/<node-id>/<step-id>` 的 parse/build、round-trip、fallback）；`generate-data.mjs` 既有 `generator.test.ts` 確保 `quant-resource` 資料結構符合新型別（含 `steps`、`step-dep`、`taughtBySteps`、`deprecated`）。
- **模組**：`completion.ts`、`hashlink.ts`、`generator.test.ts`、`types.ts`（經由消費方編譯）。
- **不做單元測試**：星雲 step 節點與 Roadmap DAG 展開的視覺佈局、element 頁 taught-by 渲染、mdx registry 巢狀 glob——以 `npm run dev` 人工驗證（先例：unified-reading-surface 的佈局/視窗同樣人工驗證）。
- **回歸錨點**：既有 `hashlink.test.ts`、`completion.test.ts`、`progress.test.ts`、`mdx.test.tsx`、`generator.test.ts` 全數保持綠；`npm run typecheck` 與 `npm run build` 通過。

## Out of Scope

- 舊式單文章 node（無 steps）的相容渲染。
- `question` element 的互動測驗（退休，graded verification 只在 `/tackle`）。
- 在地圖上編輯課程內容（sources 保持 immutable，PRD §3）。
- 段落級 deep-link（沿襲 unified-reading-surface 決策）。
- 多 subject 同畫面、element-only 圖視圖（沿襲既有非目標）。
- 行動裝置優先設計（沿襲 PRD §3：desktop-oriented）。
- mastery 的動態同步（`mastery.md` 只在 generate 時種子化，非 runtime 狀態）。

## Further Notes

- 本 feature 的決策已落地於：`knowledge-map/CONTEXT.md`（Views 新增「Step 頁面」，星雲/Roadmap/node 頁改為 step 語彙，Progress 改為 per-step 完成、element 不再標完成，元素類型退休 `question`）、`knowledge-map/docs/adr/0004-step-dag-views.md`。
- 學習管線側對應變更由 `.scratch/adaptive-learning-pipeline/spec.md` + `docs/site-migration-memo.md` 記錄；generator 已產出 step 資料（commit `74b5eec`）。
- 施工順序建議：先對齊資料契約（types + generator round-trip 綠）→ 完成度純函式（seam 3）→ step 路由 + mdx registry（seam 2）→ 星雲 step 節點 → Roadmap DAG 展開 → element 頁 taught-by steps → 移除 question 渲染。
