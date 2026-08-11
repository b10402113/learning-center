# 整篇閱讀模式

Type: task
Status: ready-for-agent
Parent: `.scratch/knowledge-nebula/spec.md`

## What to build

需要專注時離開地圖：DetailPane 右上角「整篇閱讀」按鈕把該 path 展開成全屏的 markdown 排版文章（prose 樣式、含所有 section 與 sources），可隨時返回地圖並保持原本的選取與位置。

## Acceptance criteria

- [ ] DetailPane 提供「整篇閱讀」按鈕
- [ ] path 文章以全屏 prose 樣式展開（預渲染的 `fullArticleHtml`）
- [ ] 返回地圖後，原本選取的 tile 與面板狀態被保留
- [ ] 全屏模式下可滾動閱讀長文章

## Reference files

- [ ] `.scratch/knowledge-nebula/spec.md`
- [ ] `chartr/web/src/app.css` 的 `.prose` 排版

## Blocked by

02 — DetailPane：path 詳情 + 教的/關聯 node chips
