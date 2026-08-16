# 02 — 元素視窗（ReaderModal）+ DetailPane 退休

Type: task
Status: ready-for-agent
Parent: `.scratch/unified-reading-surface/spec.md`

## What to build

學習者從地圖（星雲或 Roadmap）或清單彈窗點任何 node / element 時，先在暫態
**元素視窗**（overlay 內嵌共享文件頁元件）閱讀，不離開地圖；視窗內按「展開」跳到
獨立全頁、按「關閉」或 Esc 回到底層。清單彈窗保持在下層（巢狀堆疊），關閉視窗回到
清單原本位置；清單彈窗的 element / main / 先備列都開元素視窗而非跳側欄。點擊 node
開 node 視窗、點擊 element 開 element 視窗。DetailPane 右側邊欄自此退休，其閱讀
能力完全由共享文件頁 + 元素視窗取代。

## Acceptance criteria

- [ ] 星雲視圖點 node 開 node 元素視窗、點 element 圓點開 element 元素視窗（原 DetailPane 路徑移除）
- [ ] Roadmap 點 node 卡片仍開清單彈窗（行為不變）；清單彈窗的 element 列、main 列、先備列點擊後在清單上方開對應元素視窗（巢狀），關閉後回到清單原捲動位置
- [ ] 元素視窗內「展開」以 hash 導航到該內容的獨立全頁（node 或 element，element 帶來源 `?from`）並關閉視窗；「關閉」與 Esc 關閉視窗回底層
- [ ] 元素視窗聚焦模式不顯示（以展開/關閉取代）；完成標記、測驗 gating、video 播放、wikilink 在視窗內與全頁行為一致
- [ ] DetailPane 移除後無殘留呼叫點；`npm run typecheck` 與 `npm run build` 通過
- [ ] 人工驗證（`npm run dev`）：map ↔ 視窗 ↔ 全頁往返、清單→視窗→清單的巢狀往返、返回鍵

## Reference files

- [ ] `knowledge-map/src/App.tsx`（視窗暫態狀態、展開/關閉、巢狀管理）
- [ ] `knowledge-map/src/components/ReaderModal.tsx`（新增 overlay，host 共享文件頁元件）
- [ ] `knowledge-map/src/components/NodeDetailView.tsx`（清單彈窗列改開視窗）
- [ ] `knowledge-map/src/components/ForceMap.tsx`、`RoadMap.tsx`（node/element 點擊開視窗）
- [ ] `knowledge-map/src/components/DetailPane.tsx`（刪除；呼叫點收斂）
- [ ] `knowledge-map/src/components/ElementPage.tsx`、`NodePage.tsx`（`readerModal`/`standalone` 兩種呈現態）

## Blocked by

1（Node 課文全頁：共享文件頁 + 路由 + breadcrumb + 捲動）
