# 05 — 視圖轉場與動畫：View Transitions + React Spring + Framer Motion

Type: task
Status: ready-for-agent
Parent: `.scratch/knowledge-nebula-enhancements/spec.md`

## What to build

把 v0.1 硬編的 CSS keyframes 升級為一致的轉場/動畫層：

- **View Transitions API**（`use-view-transitions` wrapper）：星雲↔塔圖視圖切換、DetailPane pane-forward/pane-back 導航。Nebula 是 canvas（無 DOM subtree）→ 容器整面 fade；Tower 與 chrome 做真正的 cross-fade/位移。`prefers-reduced-motion` 一律停用。
- **React Spring**：NodeDetailView 進度環的數值插值（strokeDasharray）。
- **Framer Motion**：chrome 微互動（TopBar、HoverCard、DetailPane 進出場），取代現有 CSS keyframes。
- **明確不做**：塔圖 tile 重排的 `layout` 動畫（React Flow viewport transform 衝突風險，列 backlog spike，見 spec Out of Scope）。

## Acceptance criteria

- [ ] 星雲↔塔圖視圖切換有 View Transition 轉場；Nebula 為容器 fade
- [ ] DetailPane 前進/後退有方向性轉場、關閉有淡出
- [ ] NodeDetailView 進度環以 React Spring 平滑動畫到完成比例
- [ ] TopBar/HoverCard/pane 進出場以 Framer Motion 呈現；既有 CSS keyframes 移除
- [ ] `prefers-reduced-motion` 啟用時所有轉場/動畫停用
- [ ] 塔圖 tile 重排不引入 `layout` 動畫
- [ ] `npm run dev` 人工驗證；`npm run typecheck` 綠

## Reference files

- [ ] `knowledge-map/src/components/ForceMap.tsx`、`RoadMap.tsx`（視圖切換觸發點）
- [ ] `knowledge-map/src/components/DetailPane.tsx`（pane 導航、NodeDetailView 進度環）
- [ ] `knowledge-map/src/app.css`（現有 pane keyframes，需移除）
- [ ] `knowledge-map/CONTEXT.md`（視圖切換、執行期依賴詞彙）

## Blocked by

None — can start immediately（純 client 側，與 01–04 並行）。
