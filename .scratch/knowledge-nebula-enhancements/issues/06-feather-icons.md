# 06 — 圖示：Feather 作為手寫 inline SVG 的參考來源

Type: task
Status: ready-for-agent
Parent: `.scratch/knowledge-nebula-enhancements/spec.md`

## What to build

建立圖示慣例：需要新圖示時以 Feather Icons 為參考來源，重製成 `src/components/icons/` 的手寫 inline SVG（stroke = `currentColor`），不引入 icon runtime 依賴。若 v0.2 需要新圖示（例如全文搜尋、視圖切換、播放等語意），以 Feather 為來源補進現有 11 個圖示集。

## Acceptance criteria

- [ ] v0.2 新增的圖示皆以 Feather 為參考、維持手寫 inline SVG pattern（stroke = `currentColor`）
- [ ] 未引入任何 icon runtime 依賴
- [ ] 圖示風格與既有 11 個一致（大小、stroke width、圓角節點）

## Reference files

- [ ] `knowledge-map/src/components/icons/`（既有 11 個手寫圖示）
- [ ] `knowledge-map/CONTEXT.md`（素材來源詞彙）

## Blocked by

None — can start immediately.
