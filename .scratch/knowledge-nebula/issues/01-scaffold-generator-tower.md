# 資料契約 + 生成器 + 鋸齒塔渲染（tracer bullet）

Type: task
Status: ready-for-agent
Parent: `.scratch/knowledge-nebula/spec.md`

## What to build

Standalone React app（`npm run dev` 即可跑、無後端）的第一條完整垂直切片：頂欄可切換 4 個 subject，每個 subject 以 SVG「鋸齒塔」渲染整張學習路線 — tier 樓層、path mini-boss tiles、spine 箭頭、狀態樣式。背後是資料管道：一支 Node 生成 script 把 `learn/*/` 的 markdown（frontmatter + wikilinks + tier/order）parse 成完整 `data.json`（含 tier/path/node/edge 全部欄位與預渲染 HTML），commit 進 repo；app 只消費這份靜態資料。chartr 視覺語言（oklch token、IBM Plex、dark-only、40px bar）在本 ticket 落地。

`data.json` 契約（延續 spec 的 type shape）必須一次到位：tiers（tier/title/pathIds）、paths（id/title/tier/order/duration/goal/status/taughtNodeIds/relatedNodeIds/contentHtml/fullArticleHtml/sources）、nodes 記錄 map（id/title/各節 HTML/Connections/sources，供 T3 消費）、edges（from/to/kind: spine|shared-concept|explicit）。後續 ticket 只消費不擴張契約。

## Acceptance criteria

- [ ] `npm run dev` 在 `knowledge-map/` 啟動 standalone app，無後端、無 CORS
- [ ] 頂欄（40px bar）可在全部 4 個 subject 間切換
- [ ] 每個 subject 渲染鋸齒塔：tier 樓層 + 標題、tile 依 `order` 左到右 + zig-zag 錯位、每層最後一個 path 有 boss 標記
- [ ] spine 實線箭頭沿全局順序蛇形穿行，tier 交界下墜到下一層
- [ ] `content-written` 的 tile 點亮、其餘 ghost；共享概念虛線與顯式 edge 輝光線的樣式在資料存在時可區分
- [ ] 生成 script 排除 ddia 的嵌套重複資料夾，並處理 skeleton path（`nodes: []`）與空 edges 資料夾
- [ ] 生成確定性：同一份 markdown 兩次執行產出相同 `data.json`；`data.json` commit 進 repo
- [ ] `npm test`（Vitest）通過生成器契約測試（唯一測試 seam）

## Reference files

- [ ] `.scratch/knowledge-nebula/spec.md`
- [ ] `chartr/web/src/app.css`（token 盤、`.cockpit-bar`、prose）
- [ ] `chartr/web/src/lib/starmap/theme.ts`（輝光色）
- [ ] `learn/*/ROADMAP.md` 與任一路徑檔的 frontmatter 範例

## Blocked by

None — can start immediately.
