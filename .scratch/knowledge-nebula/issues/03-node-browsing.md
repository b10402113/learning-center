# 面板內 node 瀏覽 + wikilink 導航

Type: task
Status: ready-for-agent
Parent: `.scratch/knowledge-nebula/spec.md`

## What to build

在 DetailPane 內深入概念：點任一 node chip，面板原地滑動切換到該 node 的全文（依 node 模板的各節：Problem Statement、比喻、Connections、Questions…）。內容中的 `[[wikilinks]]` 解析成可點擊的內部導航，學習者可以順著連結在 node 與 path 之間穿梭，再回到原本的關卡，全程不離開地圖。

## Acceptance criteria

- [ ] 點 node chip，面板在同一位置滑動切換到該 node 的全文
- [ ] node 各節完整渲染（依 node 模板的標題結構）
- [ ] 內容中的 `[[learn/...]]` wikilinks 解析成可點擊的內部導航
- [ ] 可在 node 之間、node 與 path 之間往返導航，並能回到最初選取的 path
- [ ] 面板有返回/麵包屑讓使用者知道目前位置

## Reference files

- [ ] `.scratch/knowledge-nebula/spec.md`
- [ ] `learn/<subject>/nodes/` 任一已寫完的 node 檔（section 結構範例）

## Blocked by

02 — DetailPane：path 詳情 + 教的/關聯 node chips
