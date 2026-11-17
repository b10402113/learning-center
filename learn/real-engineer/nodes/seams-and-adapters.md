---
id: seams-and-adapters
title: "seam、adapter 與讓 legacy 可測"
subject: real-engineer
tier: 4
order: 10
status: draft
goal: "能替難測的 legacy 找 seam、插 adapter，用自動檢查釘住模組邊界，並走完 refactor 的 spec 流程。"
digests:
  - 050 Seams & Adapters.en.md
  - 051 Making Legacy Code Testable.en.md
  - 052 Making Legacy Code Testable Solution.en.md
  - 053 Enforcing Module Boundaries.en.md
  - 054 Enforcing Module Boundaries Solution.en.md
  - 055 The improve-codebase-architecture Skill.en.md
  - 056 The improve-codebase-architecture Skill Solution.en.md
  - 057 implement-spec For Refactors.en.md
  - cohort-005-project.3.part.md
prerequisites:
  - learn/real-engineer/nodes/good-codebases.md
steps: []
created: 2026-11-16
updated: 2026-11-16
---

# seam、adapter 與讓 legacy 可測

## Lesson

legacy 不是壞掉的程式，而是沒有接縫的程式：seam 是你觀察與替換行為的邊界，adapter 是把外部世界擋在介面後面的那一層。找到接縫之後，測試才有可能、模組邊界才釘得住，而 `/improve-codebase-architecture` 與 refactor 的 spec 流程則示範怎麼把這些改動一次做完而不是零碎地修。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
