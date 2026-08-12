# 進度 schema 三層化 + 相容遷移 + tierIsUnlocked 純函式

Type: task
Status: ready-for-agent
Parent: `.scratch/learning-climb/spec.md`

## What to build

爬塔的進度資料地基：`progress` 從「每 subject 一個 string[]」升級為 `{ paths, nodes, tiers }` 三層。舊的「array per subject」localStorage 資料自動遷移為 `paths`（`nodes`/`tiers` 補空），既有 path 完成紀錄不丟失；寫回一律新形狀，儲存鍵沿用 `knowledge-map:progress`。同時把 tier 解鎖的「通過判定」抽成純函式 `tierIsUnlocked(graph, tier, progress, opts)`（放 selectors 層）：前一層已解鎖、且 paths 涵蓋前一層所有 path（或「達標即可」配置）、且（可配置）nodes 涵蓋該層主要 node。

App 端維持現有 paths-only 行為，typecheck 與既有測試保持綠——這張只做地基與測試 seam，前端 UI（node 勾選、鎖定渲染）在 02 做。

## Acceptance criteria

- [ ] 新 schema 讀寫：`progress[subject] = { paths, nodes, tiers }`，三層皆可獨立存取
- [ ] 舊資料相容：讀到舊「array per subject」形狀時視為 `paths`、補空 `nodes`/`tiers`，原有 path 完成紀錄不丟失
- [ ] `tierIsUnlocked` 純函式：覆蓋「前一層已解鎖」「前一層 path 涵蓋」「可配置的 node 涵蓋」
- [ ] 儲存鍵名 `knowledge-map:progress` 不變，寫回一律新形狀
- [ ] Vitest 測試通過；App typecheck 保持綠（paths-only 行為不變）

## Reference files

- [ ] `knowledge-map/src/lib/progress.ts`
- [ ] `knowledge-map/src/lib/selectors.ts`
- [ ] `knowledge-map/src/App.tsx`（最小接線，保持綠即可）
- [ ] `.scratch/learning-climb/spec.md` Implementation Decisions

## Blocked by

None — can start immediately.
