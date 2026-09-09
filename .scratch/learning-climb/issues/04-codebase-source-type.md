# CodeBase 來源：source-reading 擴展 + digest + 生成器分類

Type: task
Status: ready-for-agent
Parent: `.scratch/learning-climb/spec.md`

## What to build

`learn/<subject>/` 的資料來源支援整個 CodeBase。`sources/<subject>/` 放入一個資料夾時視為單一來源，分類為 `source_type: codebase`——不再只有 PDF（pdftotext）與字幕檔。

source-reading 協定擴展：codebase digest 的 L1 為「架構總覽」（entry point、核心目錄、模組圖），L2 為「關鍵檔案 + 摘要 + 檔案 locator」；仍遵循「不可變來源 → digest」兩層契約與 `status` 生命週期（`pending` → `absorbed`）。大小閾值改用「檔案數 × 平均大小」而非 pdftotext 行數。path 計數基準線對 codebase 來源改用結構化 metric（模組數／檔案數），不硬套 `lines/1100`。

生成器掃描 `sources/<subject>/` 時區分單檔與資料夾：資料夾視為 `source_type: codebase`，且輸出確定（相同來源 → 相同分類結果）。`/learn-init`、`/roadmap` 透過更新後的 source-reading 協定以與 PDF 相同方式消費 codebase digest。

## Acceptance criteria

- [ ] `sources/<subject>/` 資料夾被視為 `source_type: codebase`
- [ ] codebase digest 格式（L1 架構總覽、L2 關鍵檔案 + locator）與 `status` 生命週期
- [ ] codebase 來源的大小閾值與 path 計數基準線改用結構化 metric
- [ ] 生成器確定性輸出分類（相同來源 → 相同結果）
- [ ] 生成器 fixture 測試覆蓋分類與確定性

## Reference files

- [ ] `docs/reference/source-reading.md`
- [ ] `scripts/generate-data.mjs`
- [ ] `.opencode/skills/learn-init/SKILL.md`
- [ ] `.opencode/skills/roadmap/SKILL.md`
- [ ] `knowledge-map/src/__tests__/generator.test.ts`
- [ ] `.scratch/learning-climb/spec.md` Implementation Decisions（codebase digest）

## Blocked by

None — can start immediately.
