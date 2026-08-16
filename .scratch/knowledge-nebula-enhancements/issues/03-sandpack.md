# 03 — 互動範例：` ```sandpack ` 抽出 + lazy 載入 Sandpack

Type: task
Status: ready-for-agent
Parent: `.scratch/knowledge-nebula-enhancements/spec.md`

## What to build

讓 lesson 可以宣告可執行的互動範例：

- **Generator**：解析 lesson 中的 ` ```sandpack ` fenced block，抽出成該 node 的可選 `sandpack` 設定進 `graph.json`；設定缺損（缺 template/檔案）時降級跳過該範例而非報錯。sandpack 相關 HTML 不在 sanitize 白名單中被剝除。
- **Client**：DetailPane 只在「該 lesson 含 sandpack 設定」時以 `React.lazy` + Suspense 載入 `@sandpack/react`，不進主 bundle；載入失敗/離線顯示佔位提示而非白畫面。

這是純靜態唯一的明示外部 runtime 例外（ADR-0002）。

## Acceptance criteria

- [ ] ` ```sandpack ` code fence 被 generator 解析、抽出為該 node 的 `sandpack` 設定
- [ ] sandpack 設定缺損時該範例被降級跳過、生成仍成功、輸出確定
- [ ] 含範例的 lesson：DetailPane 顯示可互動的 Sandpack playground
- [ ] 不含範例的 lesson：主 bundle 不載入 `@sandpack/react`（lazy，驗證 chunk 分離）
- [ ] 載入失敗/離線時顯示佔位提示，app 其餘功能不受影響
- [ ] 既有 generator 測試全綠；新增 sandpack 抽出與降級斷言

## Reference files

- [ ] `scripts/generate-data.mjs`（sandpack fence 解析）
- [ ] `knowledge-map/src/components/DetailPane.tsx`（lazy 載入 + 佔位）
- [ ] `knowledge-map/CONTEXT.md`（互動範例、Sandpack 例外詞彙）
- [ ] `knowledge-map/docs/adr/0002-pure-static-sandpack-exception.md`

## Blocked by

01 — 渲染管線替換：remark/rehype 取代手寫 renderer
02 — 富內容渲染：Shiki + KaTeX + rehype-sanitize（sanitize 白名單需保留 sandpack 區塊）
