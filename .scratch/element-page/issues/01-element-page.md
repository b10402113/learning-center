# 01 — Element 獨立頁面：路由 + 頁面 + 聚焦模式

Type: task
Status: ready-for-agent
Parent: `.scratch/element-page/spec.md`

## What to build

把 element 從 DetailPane 窄面板升級為獨立頁面（設計 A 文件型佈局），以 hash 路徑 `#/elements/<subject>/<slug>` 編址，並提供一鍵聚焦內容的聚焦模式：

- **路由**：擴充 `lib/hashlink.ts`——`parseHash` 回傳 map/element 判別聯集，新增 `buildElementHash`。`App.tsx` 依 hash 分派渲染 `<ElementPage>` 或地圖。
- **ElementPage**：左側課程導覽（tiers → nodes + 元素清單）、麵包屑、文章頭部（type/tier/order/教授 node/目標）、中央文章（`getElementMdx` + `elementMdxComponents`，含 QuizBlock/VideoEmbed）、右側 scroll-spy 錨點目錄 + 完成標記卡、頁尾 prev/next 導航。
- **自動跳轉**：凡目標為 element 的點擊（DetailPane chips、NodeDetailView 元素列、星雲/Roadmap element 節點、⌘K 搜尋結果、文章內 element wikilink）一律跳轉至 element 頁面。
- **聚焦模式**：暫態 state 隱藏左導覽/右目錄/麵包屑/頁尾，只留居中文章；Esc 離開；不寫入 URL。
- **進度**：沿用 `progress.ts`/`completion.ts`/`CompletionToggle`；question 元素答對測驗才解鎖標記。

## Acceptance criteria

- [ ] `#/elements/muscle-ladder/goal-hierarchy` 直接落地該元素頁面（貼 deep-link）
- [ ] 地圖任何位置的 element 點擊自動跳轉到該元素頁面
- [ ] 文章本體以 MDX 渲染，question 的 QuizBlock、video 的 VideoEmbed 正常互動
- [ ] 左導覽點 node 回到地圖並選中；點 element 跳轉到其頁面
- [ ] 右側目錄從文章 h2 生成，捲動 scroll-spy 高亮、點擊平滑捲動
- [ ] 完成標記與地圖進度同步；question 元素維持「答對才可標記」gating
- [ ] 頁尾 prev/next 依 subject 內 order 正確顯示、兩端缺省時隱藏
- [ ] 聚焦模式隱藏所有 chrome、Esc 離開、`prefers-reduced-motion` 無動畫
- [ ] 無效 subject/slug deep-link 優雅退回地圖（不白屏）
- [ ] `npm run typecheck` 綠；`npm test` 綠（含新增 hashlink 測試與既有全數回歸）
- [ ] `npm run dev` 人工驗證 map ↔ element 頁往返、返回鍵、⌘K 跳轉

## Reference files

- [ ] `knowledge-map/src/lib/hashlink.ts`（路由擴充；`__tests__/hashlink.test.ts` 對應測試）
- [ ] `knowledge-map/src/App.tsx`（路由分派、element 點擊跳轉）
- [ ] `knowledge-map/src/components/DetailPane.tsx`（element chips 改跳頁）、`NodeDetailView.tsx`、`ForceMap.tsx`、`RoadMap.tsx`（element 節點點擊）
- [ ] `knowledge-map/src/components/ElementPage.tsx`（新元件）
- [ ] `knowledge-map/src/lib/mdxRegistry.ts`、`mdxComponents.tsx`（文章渲染重用）
- [ ] `knowledge-map/src/lib/completion.ts`、`progress.ts`（完成 gating）
- [ ] `.scratch/element-page-designs/element-a-docs.html`（視覺基準）

## Blocked by

None — 可立即開始（路由純函式可先獨立完成；視覺與互動於 `npm run dev` 驗證）。
