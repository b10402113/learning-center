# 03 — 收尾：hover 定位 + 頁內連結行為 + 殘留入口

Type: task
Status: ready-for-agent
Parent: `.scratch/unified-reading-surface/spec.md`

## What to build

視覺與交互收尾：hover 卡片改顯示在鼠標右下方、不再遮擋中心；共享文件頁內的連結行為
按目前所在態正確分流——元素視窗內點連結切換視窗內容、獨立全頁內點連結直接導航到目標
全頁；逐一檢查並補齊任何殘留的 node / element 點擊入口（chips、wikilink、breadcrumb、
由哪堂課教授卡片），並完成 map ↔ 視窗 ↔ 全頁的完整人工回歸驗證。

## Acceptance criteria

- [ ] hover 卡片（星雲與 Roadmap 共用）顯示於鼠標右下方偏移，不遮擋中心；滑出後消失；Radix tooltip（按鈕提示）維持不變
- [ ] 元素視窗內點左欄課程 / 右欄元素 / wikilink / 教授卡片 → 切換視窗內容（node↔element 皆可）
- [ ] 獨立全頁內點同樣連結 → 直接導航到目標全頁（不開視窗）；element 目標帶來源 `?from` 使 breadcrumb 可跳回
- [ ] 全站掃一遍點擊入口：無遺漏的 node/element 點擊仍走舊路徑（側欄、直接跳頁不一致）
- [ ] 人工回歸（`npm run dev`）：roadmap/星雲 hover、視窗內走跳、全頁內走跳、清單→視窗→全頁→清單完整往返、`prefers-reduced-motion` 下無動畫
- [ ] `npm run typecheck` 與 `npm run build` 通過

## Reference files

- [ ] `knowledge-map/src/components/HoverCard.tsx`（定位調整，鼠標右下方）
- [ ] `knowledge-map/src/components/ElementPage.tsx`、`NodePage.tsx`（視窗/全頁兩態的連結分流）
- [ ] `knowledge-map/src/App.tsx`（視窗狀態與導航一致性）
- [ ] `knowledge-map/src/lib/wikilink.ts`（wikilink 目標解析在兩種態的行為）

## Blocked by

2（元素視窗 + DetailPane 退休）
