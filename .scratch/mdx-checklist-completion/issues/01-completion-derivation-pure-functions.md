# Completion 純函式：nodeItems / isNodeComplete（檢查清單契約）

Type: task
Status: ready-for-agent
Parent: `.scratch/mdx-checklist-completion/spec.md`

## What to build

知識星雲 v0.3 的完成模型地基：兩個**純函式**把「node 完成 = 清單內所有項目皆完成」的推導規則定成可測試契約，node 完成不再需要手動標記。

- `nodeItems(node)` — 傳回該 node 的檢查清單項目：taught elements 依序 + 最後一列 `{ kind: "main" }`。零 element 的 node 只回傳 main 一項。
- `isNodeComplete(node, manualElements)` — 當清單內所有項目（element 或 main）都在手動完成集合時回 `true`。main 的完成語意是「文章讀過」，以有勾選表示。

main 項目的完成 id 用 node 本身的 id（與 element id 無碰撞疑慮，因 id 空間不同）；確切編碼是實作細節，只要契約不變即可。此 ticket 只新增函式與測試，不改 schema、不動前端——既有 typecheck 與測試保持綠。

## Acceptance criteria

- [ ] `nodeItems(node)` 回傳 taught elements（依 `taughtElementIds` 順序）+ 最後的 main 項目
- [ ] `nodeItems` 對零 element 的 node 只回傳 main
- [ ] `isNodeComplete` 全部項目完成 → true；缺任一 element → false；main 未勾 → false
- [ ] 零 element 的 node 只要求 main 完成
- [ ] 純函式為新增模組，`npm run typecheck` 與既有 vitest 測試保持綠

## Reference files

- [ ] `knowledge-map/src/lib/progress.ts`
- [ ] `.scratch/mdx-checklist-completion/spec.md` Implementation Decisions（完成推導、ADR 0002）

## Blocked by

None — can start immediately.
