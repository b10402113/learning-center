# Generator：結構化輸出 + type/prerequisites/videoUrl/questions（expand，暫留 HTML）

Type: task
Status: ready-for-agent
Parent: `.scratch/mdx-checklist-completion/spec.md`

## What to build

`scripts/generate-data.mjs` 從「輸出內容 HTML」改為「結構優先」的第一步（expand 階段）：在 `graph.json` 新增 v0.3 的結構欄位，但**暫保留** `contentHtml`/`bodyHtml`/`fullArticleHtml`/`prepareHtml` 等既有欄位，前端維持可渲染、測試保持綠。收縮（移除 HTML）由 T4 完成。

- **Element type。** element frontmatter 解析 `type`（缺省 `article`）；`video` 需附 `videoUrl`；`question` 需附結構化 `questions`（含選項與正確答案索引）。`videoUrl`/`questions` 為條件欄位，只有對應 type 才存在。
- **Prerequisites 雙型。** node frontmatter 新增 `prerequisites` 清單（指向 element 或 node 的穩定 id）。generator 解析後與 Connections 推導的 `relatedElementIds` 合併去重，並記錄來源（frontmatter 或推導）供前端分色。node 與 element 都輸出 `prerequisiteIds`。
- **型別契約同步。** `scripts/generate-data.d.mts` 與 `knowledge-map/src/lib/types.ts` 更新為新版 `NodeData`/`ElementData` 形狀（新增 `type`、`prerequisiteIds`、`videoUrl?`、`questions?`，保留既有欄位）。
- **輸出確定性**維持，前端不破。

## Acceptance criteria

- [ ] element `type` 缺省 `article`；`video` 輸出 `videoUrl`、`question` 輸出結構化 `questions`（含正確答案索引）
- [ ] node `prerequisites` 與 Connections 推導合併去重，輸出 `prerequisiteIds` 並記錄來源
- [ ] node 與 element 皆輸出 `prerequisiteIds`（node 指向 element 或 node，element 指向 element）
- [ ] `generate-data.d.mts` 與 `src/lib/types.ts` 同步新形狀
- [ ] 既有欄位（`contentHtml` 等）暫保留，前端與 generator 測試保持綠；確定性輸出不變
- [ ] 重新執行 `npm run generate` 產出含新欄位的 `graph.json`

## Reference files

- [ ] `scripts/generate-data.mjs`
- [ ] `scripts/generate-data.d.mts`
- [ ] `knowledge-map/src/lib/types.ts`
- [ ] `knowledge-map/src/__tests__/generator.test.ts`
- [ ] `.scratch/mdx-checklist-completion/spec.md` Implementation Decisions（graph.json 結構形狀）

## Blocked by

None — can start immediately.
