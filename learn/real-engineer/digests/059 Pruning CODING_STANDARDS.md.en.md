---
source: sources/real-engineer/20261116/course/059 Pruning CODING_STANDARDS.md.en.txt
source_type: text
source_lines: 19
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L25
---

# L1 overview

- AI 時代的通則：在 deterministic 與 non-deterministic 之間，幾乎永遠選 deterministic。
- automated review 是非確定性的（它就是一個 agent，只有機率上會抓到問題），automated checks 則每次行為完全一致。
- 用 agent 時最需要的是可預測性，所以要把 coding standards 盡量轉成 automated checks。
- 練習起點：reset 到一個 bloated 的 `CODING_STANDARDS.md`，共 421 行。
- 檔案裡混進了「sediment」——同事陸續加進來、需要修剪的沉積物。
- 每條規則只有兩種處理方式：刪掉，或轉成 automated check。
- 用現成的 retro skill 做這件事，不引入新 skill；本輪只要產出檢查的想法，先不實作。

# L2 detail

- `#L1-L5` — 建立 deterministic 優先的原則：automated review 是機率性的 agent，automated checks 每次都一樣；agent 工作最需要可預測性，因此要把 coding standards 轉成檢查，並 reset 到 seed 好的 bloated 版本。
- `#L6-L11` — 該版本膨脹到 421 行；提醒 implement 過載、code review 過輕，但仍要減輕 review 壓力；大檔案常有 sediment，處理方式只有刪除或轉成 automated check。
- `#L12-L19` — 不用新 skill，直接跑 agent + retro，明確要求「把這些 standards 轉成 automated checks 或刪掉」；retro 平常是做 session 回顧，這裡不掃歷史 session、只用它的內建規則挑毛病，所以要在 prompt 先講明；本課目標是更小的檔案加上一組檢查想法，先不要實作。
