# Checklist 完成模型：progress 遷移 + 移除 gating（塔圖／鎖定／boss）

Type: task
Status: ready-for-agent
Parent: `.scratch/mdx-checklist-completion/spec.md`

## What to build

把知識星雲從「爬塔 gating」切成「無門檻 checklist 完成」，並清掉整套爬塔機制與死碼：

- **Progress schema 收斂。** `SubjectProgress` 只剩 `{ elements: string[] }`。`parseProgress` 讀到舊形狀（三欄物件或純陣列）時取 `elements` 陣列、忽略 `nodes`/`tiers`；寫回一律新形狀。node 完成改由 `isNodeComplete` 推導，App 不再手動標 node。
- **移除 gating 邏輯。** 刪除 `tierIsUnlocked`、`tierBossState`、`TierBossState`、`chartedCount`、`firstUnchartedInSpine`、`UnlockOptions`；移除 `progress.nodes`/`progress.tiers`、tier 解鎖按鈕、鎖定/頭目戰 UI 分支。
- **移除塔圖與視圖收斂。** 刪除 `TowerMap` 元件（含 FloorLayer/Tile 的 boss/lock 渲染）；視圖切換收斂為 `nebula | roadmap`，TopBar 只剩兩種視圖。
- **完成語意調整。** node 完成 = 推導值，無法獨立於 element 存在；零 element 的 node 勾完 main 即完成。重置進度只清 elements。舊資料殘留的 nodes/tiers 不會造成錯誤的完成狀態。

## Acceptance criteria

- [ ] `SubjectProgress` 只剩 `elements`，舊三欄形狀讀取時自動遷移（取 elements、忽略 nodes/tiers），既有完成紀錄不丟
- [ ] node 完成為推導值：清單全完成即完成，不另存 node 完成狀態
- [ ] 塔圖、鎖定樣式、頭目戰入口、解鎖按鈕、Lock/Crown 圖面渲染全部移除
- [ ] 視圖切換只餘 `nebula | roadmap`；重置進度可清 element 完成
- [ ] gating 相關 selector、boss 狀態、progress.nodes/tiers 無殘留引用（專案無死碼）
- [ ] `npm run typecheck`、`npm run test` 綠；既有 gating 測試改寫或移除

## Reference files

- [ ] `knowledge-map/src/lib/progress.ts`
- [ ] `knowledge-map/src/lib/selectors.ts`
- [ ] `knowledge-map/src/lib/types.ts`
- [ ] `knowledge-map/src/App.tsx`
- [ ] `knowledge-map/src/components/TowerMap.tsx`、`FloorLayer.tsx`、`Tile.tsx`、`DetailPane.tsx`、`NodeDetailView.tsx`、`RoadMap.tsx`、`RoadNode.tsx`、`ForceMap.tsx`、`Legend.tsx`、`TopBar.tsx`、`MapControls.tsx`
- [ ] `knowledge-map/src/__tests__/progress.test.ts`
- [ ] `.scratch/mdx-checklist-completion/spec.md` Implementation Decisions（移除、完成推導、ADR 0002）

## Blocked by

01 — Completion 純函式：nodeItems / isNodeComplete（檢查清單契約）
