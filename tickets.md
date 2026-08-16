# Tickets: Element 獨立頁面（含聚焦模式）

把 element 概念頁從地圖右側窄面板提升為可分享、可沉浸閱讀的獨立文件頁，hash 路徑
`#/elements/<subject>/<slug>`，含文件型佈局、scroll-spy 錨點目錄與聚焦模式。
源自 `.scratch/element-page/spec.md`（ready-for-agent）。

Work the **frontier**：任何 blockers 都完成的票即可開始。票 1 無依賴；票 2、3 完成後，
票 2 與票 3 可並行。

## 1. Element 獨立頁面 + 路由契約

**What to build:** 學習者/訪客貼上 `#/elements/<subject>/<slug>` deep-link 會直接落地該 element
的完整文件頁，而非地圖上的小圓點——左側課程結構（tiers → nodes + 元素清單，目前元素粉紅標示）、
麵包屑、文章頭部（type badge、tier・order、由哪堂課教授）、中央文章（含 question 測驗、video
播放、wikilink 原地導航）、依 subject order 的頁尾 prev/next。完成標記沿用既有 gated
CompletionToggle，與地圖共享同一份 localStorage 進度；question 元素先答對測驗才能標記。
不存在的 element 或錯誤 deep-link 優雅退回地圖，不白屏。

本票同時是路由純函式的契約建立：`parseHash` 回傳改為可區分 map/element 兩種路由的判別聯集，
新增 `buildElementHash`，既有 `buildHash` 維持；App 依解析結果分派——element 路由渲染
ElementPage（保留 TopBar 與視圖切換，可回到地圖）、map 路由照舊，`hashchange` 同步處理兩者。
這是唯一單測 seam，純函式、可確定性測試。

**Blocked by:** None — can start immediately.

- [ ] `parseHash` 解析 `#/elements/<subject>/<slug>` 回傳 `{ kind: "element", subject, elementId }`；解析既有 `#s=..&p=..` 仍回傳 map 路由；無 hash / 空 hash / 不認識 prefix 一律 fallback 到 map；subject/slug 含需 URL-encode 字元時 `buildElementHash` → `parseHash` 正確 round-trip
- [ ] 既有 `hashlink.test.ts`、`completion.test.ts`、`progress.test.ts`、`mdx.test.tsx`、`generator.test.ts` 全數保持綠；`npm run typecheck` 與 `npm run build` 通過
- [ ] 以單一 element 餵入 ElementPage 即可渲染完整文件頁：左導覽目前元素高亮、點左導覽 node 回到地圖並選中該 node、點左導覽 element 跳轉該 element 頁
- [ ] 中央文章以既有 MDX 管線渲染；question 元素頁內作答、答對解鎖完成標記；video 元素頁內播放；完成狀態與地圖同步（localStorage 同一份）
- [ ] 文章頭部顯示 type badge、tier・order、「由哪堂課教授」；goals/日期欄位若無可用資料則優雅省略（依實際 element 資料欄位判定，不放佔位假資料）
- [ ] 頁尾 prev/next 依 subject 內 element order 排序，不存在的一端隱藏
- [ ] 貼 `#/elements/<subject>/<slug>` 落地該頁；改貼不存在的 subject/slug 退回該 subject 地圖視圖；`hashchange`（瀏覽器返回/前進）在兩種路由間正確切換；既有 `#s=..&p=..` deep-link 行為回歸不變；視圖切換從 element 頁回到地圖
- [ ] 人工驗證（`npm run dev`）：文件型佈局、左導覽跳轉、測驗 gating、prev/next

## 2. Element 點擊入口改為頁面導航

**What to build:** 學習者在地圖任何位置點擊一個 element 都會自動跳到它的獨立頁面——DetailPane
的教/關聯 chips、NodeDetailView 的元素列、星雲視圖的 element 節點、文章內 element wikilink，
一律改為設定 hash 至 element 路由。DetailPane 不再於 pane 內 push element view，其 breadcrumb
收斂為 node 閱讀 + element chips 作為頁面連結。按「回到地圖」或瀏覽器返回鍵回到先前地圖位置，
map ↔ element 頁往返無縫。

**Blocked by:** 票 1（Element 獨立頁面 + 路由契約）

- [ ] DetailPane 教/關聯元素 chips 點擊後跳轉至該 element 頁面，而非在面板內開啟 element view
- [ ] NodeDetailView 元素列點擊後跳轉至該 element 頁面
- [ ] 星雲視圖的 element 節點點擊後跳轉至該 element 頁面（沿用選中即置中行為）
- [ ] 文章內 element wikilink 點擊後跳轉至該 element 頁面，與地圖點擊行為一致；node wikilink 維持既有行為
- [ ] DetailPane 移除 pane 內 element 堆疊檢視：breadcrumb 不再含 element 層級，不再有「從 pane 讀 element」路徑
- [ ] 人工驗證 map ↔ element 頁往返：跳頁、視圖切換回地圖、瀏覽器返回鍵都回到先前地圖位置
- [ ] 註記（不需實作）：⌘K 全文搜尋 palette 目前不存在於程式碼庫；日後落地時其 element 結果須用 `buildElementHash` 跳轉至 element 頁

## 3. 閱讀體驗：scroll-spy 錨點目錄 + 聚焦模式

**What to build:** 學習者在 element 頁面右側看到文章段落錨點目錄——render 後收集文章 `h2`
即時生成，`IntersectionObserver` 同步高亮目前段落，點擊平滑捲動；目錄內含「標記元素完成」
進度卡（沿用 gated CompletionToggle，進度與地圖同步）。開啟聚焦模式後左導覽、右目錄、麵包屑、
頁尾全部收起，只留居中文章（約 42rem 行寬），Esc 離開；切換按鈕置於頂欄右側與目錄進度卡附近；
此為暫態狀態，不寫入 URL。開啟「減少動態效果」時聚焦模式的進出與目錄捲動不做動畫。

**Blocked by:** 票 1（Element 獨立頁面 + 路由契約）

- [ ] 文章 render 後右側即時生成 h2 錨點列表；點擊以 `scrollIntoView` 捲動；捲動時以 `IntersectionObserver` 高亮目前段落
- [ ] 目錄內進度卡：question 元素先答對測驗才能標記完成；完成狀態與地圖同步
- [ ] 聚焦模式一鍵收起左導覽、右目錄、麵包屑、頁尾，文章居中約 42rem 行寬；Esc 離開恢復完整佈局；狀態不寫入 URL
- [ ] 聚焦模式切換鈕在頂欄右側與目錄進度卡附近皆可操作
- [ ] `prefers-reduced-motion` 啟用時聚焦模式進出與目錄捲動不帶動畫
- [ ] 人工驗證（`npm run dev`）：長文定位、段落高亮、進度一處記、沉浸閱讀與 Esc 恢復
