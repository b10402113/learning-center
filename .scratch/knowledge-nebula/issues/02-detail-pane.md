# DetailPane：path 詳情 + 教的/關聯 node chips

Type: task
Status: ready-for-agent
Parent: `.scratch/knowledge-nebula/spec.md`

## What to build

點擊塔上的 mini-boss tile，在半透明 backdrop-blur 的 DetailPane 中檢視該 path 的詳情：Lesson 內容、它「教的 node」與「關聯的 node」chips、sources。面板疊在地圖上（復刻 chartr DetailPane：border-left 接縫、地圖在後方隱約可見），不離開地圖即可理解一個關卡教什麼、跟星雲的哪部分接壤。hover tile 顯示 tooltip（標題、狀態、學習目標）。

## Acceptance criteria

- [ ] 點擊 tile 在半透明模糊 DetailPane 中顯示該 path 的 Lesson 內容
- [ ] 面板顯示 path 標題、goal、duration、sources
- [ ] 面板列出 `taughtNodeIds` chips（教的 node）
- [ ] 面板列出 `relatedNodeIds` chips（關聯的 node，由 Connections 雙向 / 前置知識 / 顯式 edge 推導）
- [ ] hover tile 顯示 tooltip：標題、狀態、學習目標
- [ ] 可經由 Esc、點擊空白處、或關閉按鈕關閉面板

## Reference files

- [ ] `.scratch/knowledge-nebula/spec.md`
- [ ] `chartr/web/src/lib/DetailPane.svelte`（面板樣式語言）

## Blocked by

01 — 資料契約 + 生成器 + 鋸齒塔渲染（tracer bullet）
