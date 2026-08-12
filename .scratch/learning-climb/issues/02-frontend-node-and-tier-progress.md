# 前端進度 UI：node 完成標記 + tier 鎖定/頭目戰解鎖

Type: task
Status: done
Parent: `.scratch/learning-climb/spec.md`

## What to build

爬塔的兩種玩家面向：

**Node 概念級進度。** 在 node 檢視把讀過的 node 標為已完成，node chips 顯示完成記號，教學該 node 的 tile 也顯示完成記號；狀態寫進新 schema 的 `nodes`、跨 session 保留；重置可清 node 進度（與 path 進度分開或一起）。

**Tier 頭目戰門檻。** 未解鎖 tier 的 tile 顯示鎖定樣式（鎖 icon／暗化）且無法標記 path 完成，但仍可閱讀內容；tier 內全部 path 完成時出現「頭目戰」解鎖入口，學習者手動按下解鎖（`/quiz` 通過後由 skill 指示按）→ 寫進 `tiers`、跨 session 保留；Legend 增加「已解鎖／鎖定」圖例。`manualCompleted` 與解鎖判定接上 01 的新 schema 與 `tierIsUnlocked`。同一 tier 內多 path 仍可並行、跳學。

## Acceptance criteria

- [x] node 檢視可勾選完成，chips 與教學它的 tile 顯示完成記號
- [x] node 完成狀態跨 session 保留，且可重置（與 path 進度分開或一起）
- [x] 未解鎖 tier 的 tile 顯示鎖定樣式，無法標記 path 完成，但仍可閱讀內容與 node
- [x] tier 內全部 path 完成後出現「頭目戰」解鎖入口，按下後該 tier 解鎖、下一層不再鎖定
- [x] 解鎖狀態跨 session 保留；Legend 有「已解鎖／鎖定」圖例
- [x] 同一 tier 內多 path 仍可並行、跳學
- [x] `npm run dev` 人工驗證通過

## Reference files

- [x] `knowledge-map/src/App.tsx`
- [x] `knowledge-map/src/components/DetailPane.tsx`
- [x] `knowledge-map/src/components/Tile.tsx`
- [x] `knowledge-map/src/components/FloorLayer.tsx`
- [x] `knowledge-map/src/components/Legend.tsx`
- [x] `.scratch/learning-climb/spec.md` User Stories 1–5、9–13

## Blocked by

01 — 進度 schema 三層化 + 相容遷移 + tierIsUnlocked 純函式
