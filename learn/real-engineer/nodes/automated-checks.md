---
id: automated-checks
title: "把 coding standards 變成 automated checks"
subject: real-engineer
tier: 5
order: 11
status: draft
goal: "能把確定性規則從散文搬進 pre-commit 與 CI，並把檢查壓進三秒預算。"
digests:
  - 058 Making Bad Code (Nearly) Impossible.en.md
  - 059 Pruning CODING_STANDARDS.md.en.md
  - 060 Pruning CODING_STANDARDS.md Solution.en.md
  - 061 Our First Automated Checks.en.md
  - 062 Our First Automated Checks Solution.en.md
  - 063 Speeding Up Our Automated Checks.en.md
  - cohort-005-project.6.part.md
prerequisites:
  - learn/real-engineer/nodes/automated-review-and-retro.md
steps: []
created: 2026-11-16
updated: 2026-11-16
---

# 把 coding standards 變成 automated checks

## Lesson

在 deterministic 與 non-deterministic 之間，幾乎永遠選 deterministic：同一條規則寫在散文中要靠 agent 記得，寫成檢查則每次都一樣。這個 node 把 421 行的 `CODING_STANDARDS.md` 修剪成「刪掉或轉成檢查」兩條路，用 husky 與 lint-staged 做出第一個 pre-commit hook，再把它從十幾秒壓到三秒以內。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
