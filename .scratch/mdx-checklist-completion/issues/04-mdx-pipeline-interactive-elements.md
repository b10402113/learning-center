# MDX 管線 + 互動元件 + generator HTML 收縮

Type: task
Status: ready-for-agent
Parent: `.scratch/mdx-checklist-completion/spec.md`

## What to build

把內容管線改成**全面 MDX**，讓測驗與影片成為真正可互動的元素，同時把 `graph.json` 收斂成純圖形結構：

- **MDX 編譯管線。** 前端新增 Vite `@mdx-js/rollup`，直接 import `learn/` 底下的 `.mdx` 編譯成 React component；`fs.allow` 涵蓋 `learn/`。node 與 element 檔案以 MDX 編寫（接受 Obsidian 渲染劣化）。node 文章為 `main` 型、清單最後一列。
- **互動元件（白名單）。** `QuizBlock`（question element：app 內選擇題，答對才允許勾選完成，自測非門檻）、`VideoEmbed`（video element：由 `videoUrl` iframe 嵌入）、`PrereqSection`（node 詳情的分色前置區塊：element vs node 顏色不同）。
- **TYPE badge。** node 清單顯示每個 element 的 TYPE（article / video / question）。
- **收縮。** `generate-data.mjs` 停止渲染 markdown → HTML；`graph.json` 刪除 `contentHtml`/`bodyHtml`/`fullArticleHtml`/`prepareHtml`/`hasPrepare`，只留結構。渲染層以 component 取代 `dangerouslySetInnerHTML`。
- **新測試 seam。** 新增 vitest + jsdom + `@testing-library/react`：fixture `.mdx` 含 `<QuizBlock>`/`<VideoEmbed>` 能編譯並渲染、question 答錯不能勾選／答對可勾選、video 渲染 `videoUrl` 嵌入、TYPE badge 與 prerequisites 分色（element vs node 顏色不同）。生成器 seam 斷言輸出不再含內容 HTML。
- **前端型別收斂**至新版 `Node`/`Element`（無 HTML 欄位）。

## Acceptance criteria

- [ ] Vite 可直接 import `learn/<subject>/{nodes,elements}/<id>.mdx` 並編譯成 component
- [ ] 既有 node/element 內容以 MDX 呈現，互動元件（QuizBlock / VideoEmbed）在 app 內可互動
- [ ] question element 在 app 內顯示選擇題，答對才允許勾選完成；video element 由 `videoUrl` 嵌入播放
- [ ] node 詳情列出 prerequisites 並依 element / node 分色；node 清單顯示 TYPE badge
- [ ] `graph.json` 不再含 `contentHtml`/`bodyHtml`/`fullArticleHtml`/`prepareHtml`/`hasPrepare`；`dangerouslySetInnerHTML` 移除
- [ ] 生成器 seam 測試斷言輸出不再含內容 HTML；新增 MDX/元件渲染 seam 測試通過
- [ ] `npm run typecheck`、`npm run test` 綠；`npm run dev` 人工驗證互動元件與兩視圖

## Reference files

- [ ] `knowledge-map/vite.config.ts`、`knowledge-map/vitest.config.ts`、`knowledge-map/package.json`
- [ ] `scripts/generate-data.mjs`、`scripts/generate-data.d.mts`
- [ ] `knowledge-map/src/lib/types.ts`、`knowledge-map/src/App.tsx`
- [ ] `knowledge-map/src/components/DetailPane.tsx`、`NodeDetailView.tsx`（含 PrereqSection、TYPE badge）
- [ ] `knowledge-map/src/__tests__/generator.test.ts`（新增斷言）
- [ ] `.scratch/mdx-checklist-completion/spec.md` Implementation Decisions（內容管線改道、互動元件白名單、Testing Decisions MDX seam）

## Blocked by

02 — Checklist 完成模型：progress 遷移 + 移除 gating（塔圖／鎖定／boss）
03 — Generator：結構化輸出 + type/prerequisites/videoUrl/questions（expand，暫留 HTML）
