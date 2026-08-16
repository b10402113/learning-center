# 04 — 全文搜尋：build-time Fuse index + ⌘K 面板

Type: task
Status: ready-for-agent
Parent: `.scratch/knowledge-nebula-enhancements/spec.md`

## What to build

讓學習者可以全文檢索課程內容：

- **Generator**：對 node title/goal 與 lesson/element 全文預建 Fuse.js index，序列化進 `graph.json` 的 `searchIndex`（build-time，client 零建置成本；符合「資料永遠由 markdown 產生」principle）。
- **Client**：⌘K 開啟全文搜尋面板（取代 v0.1 的「⌘K 聚焦 subject select」導航搜尋）。fuzzy 比對，結果依 subject 分組；點選結果 → seat camera + 開 DetailPane，行為與 deep-link 一致。

## Acceptance criteria

- [ ] `graph.json` 含 build-time 預建的 `searchIndex`（Fuse.js 序列化），且確定性（同輸入兩次一致）
- [ ] ⌘K 開啟全文搜尋面板；fuzzy 命中「記不清確切標題」的內容
- [ ] 搜尋涵蓋 node title/goal 與 lesson/element 全文
- [ ] 結果依 subject 分組；點選結果 seat camera 並開 DetailPane
- [ ] 既有 generator 測試全綠；新增 searchIndex 斷言（存在、內容涵蓋、確定性）
- [ ] `npm run dev` 人工驗證 ⌘K 面板、無障礙（Esc 關閉、focus ring）

## Reference files

- [ ] `scripts/generate-data.mjs`（Fuse index 建置）
- [ ] `knowledge-map/src/lib/hashlink.ts`（deep-link 行為對齊）
- [ ] `knowledge-map/src/components/TopBar.tsx`（⌘K 快捷鍵現況）
- [ ] `knowledge-map/CONTEXT.md`（全文搜尋 vs 導航搜尋詞彙）

## Blocked by

01 — 渲染管線替換：remark/rehype 取代手寫 renderer（索引建置掛在 generator seam 上）
