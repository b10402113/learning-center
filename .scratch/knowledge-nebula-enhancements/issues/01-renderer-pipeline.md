# 01 — 渲染管線替換：remark/rehype 取代手寫 renderer

Type: task
Status: ready-for-agent
Parent: `.scratch/knowledge-nebula-enhancements/spec.md`

## What to build

把 `generate-data.mjs` 的手寫 regex/string markdown renderer 換成 unified remark/rehype 管線，作為後續富內容（Shiki/KaTeX/sandpack/searchIndex）的基礎。輸出仍是 build-time HTML 字串進 `graph.json`，client 零改動（DetailPane 照舊消費預渲染 HTML）。既有輸出語意必須保持相容：wikilink 產 `.wikilink[data-target]`、`sources/` 目標產 inert `<span class="source-ref">`、prepare/full-article/sources 段落欄位不變。此 ticket 只換管線、不引進任何新內容型態。已有 generator 測試（frontmatter、renderMarkdown、graph building、edge 推導、determinism）必須全數保持綠色，作為相容性回歸錨點。

## Acceptance criteria

- [ ] `renderMarkdown` 改由 remark/rehype 管線產出，輸出 HTML 與既有語意相容（wikilink `data-target`、sources-ref、code/pre、heading/list/blockquote）
- [ ] `graph.json` 各欄位（`contentHtml`/`fullArticleHtml`/`prepareHtml`/`bodyHtml`）仍為 build-time HTML 字串；client 不需改動
- [ ] 既有 generator 測試全綠（無需改測試預期，若有語意差異需先對齊 spec）
- [ ] 生成確定性保持：同一份 markdown 兩次執行 byte-identical

## Reference files

- [ ] `scripts/generate-data.mjs`（`renderMarkdown` 與相關 render 函式）
- [ ] `knowledge-map/src/__tests__/generator.test.ts`
- [ ] `knowledge-map/CONTEXT.md`（渲染管線詞彙）
- [ ] `knowledge-map/docs/adr/0001-remark-rehype-pipeline.md`

## Blocked by

None — can start immediately.
