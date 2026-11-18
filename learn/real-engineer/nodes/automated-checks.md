---
id: automated-checks
title: "把 coding standards 變成 automated checks"
subject: real-engineer
tier: 5
order: 11
status: written
goal: "能把確定性規則從散文搬進 pre-commit 與 CI，並把檢查壓進三秒預算。"
digests:
  - 058 Making Bad Code (Nearly) Impossible.en.md
  - 059 Pruning CODING_STANDARDS.md.en.md
  - 060 Pruning CODING_STANDARDS.md Solution.en.md
  - 061 Our First Automated Checks.en.md
  - 062 Our First Automated Checks Solution.en.md
  - 063 Speeding Up Our Automated Checks.en.md
  - cohort-005-project.1.part.md
  - cohort-005-project.2.part.md
  - cohort-005-project.3.part.md
  - cohort-005-project.4.part.md
  - cohort-005-project.5.part.md
  - cohort-005-project.6.part.md
prerequisites:
  - learn/real-engineer/nodes/automated-review-and-retro.md
steps:
  - id: deterministic-beats-probabilistic
    author: "google/gemini-3.8-flash"
    title: "軟體工廠的三層煞車：為什麼要把 automated checks 擺在最前面"
    purpose: "能說明為何該優先選 deterministic，並把 automated checks 定位在三層煞車的第三層。"
    sources:
      - "[[sources/real-engineer/20261116/course/058 Making Bad Code (Nearly) Impossible.en.txt#L1-L17]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/CODING_STANDARDS.md#L1-L25]]"
  - id: prune-or-automate-each-rule
    author: "google/gemini-3.8-flash"
    title: "修剪 Coding Standards：將規範轉為自動化檢查與精簡原則"
    purpose: "能把每條 coding standard 判成刪掉或轉成檢查，並認出該寫成 Vitest 的 schema 規則。"
    sources:
      - "[[sources/real-engineer/20261116/course/059 Pruning CODING_STANDARDS.md.en.txt#L1-L19]]"
      - "[[sources/real-engineer/20261116/course/060 Pruning CODING_STANDARDS.md Solution.en.txt#L1-L81]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/CODING_STANDARDS.md#L1-L25]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/lib/ppp.test.ts#L1-L214]]"
  - id: first-hook-on-commit
    author: "google/gemini-3.8-flash"
    title: "用 husky 與 lint-staged 在 commit 時批次檢查 staged 檔案"
    purpose: "能用 husky 與 lint-staged 在 commit 時批次檢查 staged 檔案，並知道 hook 可被繞過。"
    sources:
      - "[[sources/real-engineer/20261116/course/061 Our First Automated Checks.en.txt#L1-L63]]"
      - "[[sources/real-engineer/20261116/course/062 Our First Automated Checks Solution.en.txt#L1-L125]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/CODING_STANDARDS.md#L1-L25]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/instructor.$courseId.tsx#L1-L2264]]"
  - id: three-second-budget
    author: "google/gemini-3.8-flash"
    title: "將 pre-commit 壓進三秒：工具替換、平行化與增量快取"
    purpose: "能把 pre-commit 壓進三秒：換快工具、平行化、加增量快取，並把慢的測試移到 CI。"
    sources:
      - "[[sources/real-engineer/20261116/course/063 Speeding Up Our Automated Checks.en.txt#L1-L99]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/AGENTS.md#L1-L19]]"
created: 2026-11-16
updated: 2026-11-18
---

# 把 coding standards 變成 automated checks

## Lesson

在 deterministic 與 non-deterministic 之間，幾乎永遠選 deterministic：同一條規則寫在散文中要靠 agent 記得，寫成檢查則每次都一樣。這個 node 把 421 行的 `CODING_STANDARDS.md` 修剪成「刪掉或轉成檢查」兩條路，用 husky 與 lint-staged 做出第一個 pre-commit hook，再把它從十幾秒壓到三秒以內。

## Steps

1. [軟體工廠的三層煞車：為什麼要把 automated checks 擺在最前面](automated-checks/deterministic-beats-probabilistic.md)
2. [修剪 Coding Standards：將規範轉為自動化檢查與精簡原則](automated-checks/prune-or-automate-each-rule.md)
3. [用 husky 與 lint-staged 在 commit 時批次檢查 staged 檔案](automated-checks/first-hook-on-commit.md)
4. [將 pre-commit 壓進三秒：工具替換、平行化與增量快取](automated-checks/three-second-budget.md)
