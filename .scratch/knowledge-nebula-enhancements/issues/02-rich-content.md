# 02 — 富內容渲染：Shiki + KaTeX + rehype-sanitize

Type: task
Status: ready-for-agent
Parent: `.scratch/knowledge-nebula-enhancements/spec.md`

## What to build

在 remark/rehype 管線上加入三件事，讓課程內容支援 code 與 math：

- **Shiki 語法高亮**（GitHub Dark theme，建置期）：帶 language tag 的 fenced code block 產出高亮 HTML；未標語言者維持無高亮 `<pre><code>`，不誤判。
- **KaTeX 數學渲染**（remark-math + rehype-katex，建置期）：math fence 產出 KaTeX HTML；KaTeX CSS 抽進 app 樣式，不需 runtime JS。
- **rehype-sanitize 白名單**：管線輸出過淨化，白名單必須保留 `.wikilink[data-target]`、code/pre 與 Shiki/KaTeX 產出的 class、sandpack 相關區塊（為 ticket 03 鋪路）。

前端無需改邏輯即看得到高亮與公式（DetailPane 已渲染 HTML）。

## Acceptance criteria

- [ ] 帶 language tag 的 code fence 產出 Shiki 高亮 HTML（含正確 class/theme）
- [ ] 未標語言 code fence 維持無高亮 `<pre><code>`，不崩潰
- [ ] math fence 產出 KaTeX HTML；KaTeX CSS 進 app 樣式
- [ ] rehype-sanitize 白名單：`data-target` 與 Shiki/KaTeX class 被保留、script/event handler 被剝除（有測試斷言）
- [ ] 既有 generator 測試持續全綠；確定性保持

## Reference files

- [ ] `scripts/generate-data.mjs`（rehype 管線設定）
- [ ] `knowledge-map/src/__tests__/generator.test.ts`（新增 sanitize/高亮斷言）
- [ ] `knowledge-map/CONTEXT.md`（渲染管線、建置期工具詞彙）
- [ ] `knowledge-map/docs/adr/0001-remark-rehype-pipeline.md`

## Blocked by

01 — 渲染管線替換：remark/rehype 取代手寫 renderer
