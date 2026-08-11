# 通關進度：點亮 + localStorage + 重置

Type: task
Status: ready-for-agent
Parent: `.scratch/knowledge-nebula/spec.md`

## What to build

爬塔的通關感：使用者可把一個 path 標記為完成，tile 便永久點亮；`content-written` 的 path 自動視為完成。進度存在 localStorage，重整或下次開啟都還在；提供重置按鈕清空使用者的手動進度。

## Acceptance criteria

- [ ] 可在面板（或 tile 的 hover 操作）把 path 標記為完成
- [ ] 標記後 tile 立即點亮，且狀態與 ghost/未完成樣式明顯區分
- [ ] `content-written` 的 path 自動顯示為完成
- [ ] 進度持久化在 localStorage，重整後仍保留
- [ ] 有重置按鈕，只清除使用者手動標記的進度（`content-written` 的自動完成不受影響）

## Reference files

- [ ] `.scratch/knowledge-nebula/spec.md`

## Blocked by

02 — DetailPane：path 詳情 + 教的/關聯 node chips
