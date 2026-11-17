---
source: sources/real-engineer/20261116/course/012 Writing an ADR.en.txt
source_type: text
source_lines: 21
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.1.part.md#L1-L1235
---

# L1 overview

- 現況：Liam 的 `refund request` 是 `open`，但應用根本還沒有「核准後真的發出退款」的功能。
- 核心難題：一旦退款成立，learner 在 Introduction to TypeScript 的進度怎麼辦——整筆刪掉？保留？保留幾天？兩種選擇都有代價。
- 因為牽涉到使用者的錢，這正是適合寫成 ADR 的決策。
- 練習目標：grill 出 refund approval 畫面，並刻意使用既有 `GLOSSARY.md` 的詞彙。
- 副產品：有 glossary 之後，prompt 本身會更精準。

# L2 detail

- `#L1-L8` — 回到 Cadence：Liam 的 `refund request` 是 open，但完全沒有能把它變成 issued 的功能；還沒建這個功能。
- `#L9-L12` — 核心難題：若 Liam 在 Introduction to TypeScript 已有進度，退款後要整筆刪掉 DB 紀錄、保留、還是保留若干天？兩種做法都有成本，加上涉及金錢，因此很適合當 ADR 題目。
- `#L13-L21` — 這次練習要用 glossary 裡既有的語言來下 prompt，因為共用詞彙讓 prompt 更精準。三個任務：grill 出 refund approval 畫面、沿用既有 `GLOSSARY.md` 詞彙、判斷是否需要建立 ADR。
