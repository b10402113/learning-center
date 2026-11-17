---
id: seams-and-adapters
title: "seam、adapter 與讓 legacy 可測"
subject: real-engineer
tier: 4
order: 10
status: written
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
  - cohort-005-project.1.part.md
  - cohort-005-project.2.part.md
  - cohort-005-project.3.part.md
  - cohort-005-project.4.part.md
  - cohort-005-project.5.part.md
  - cohort-005-project.6.part.md
prerequisites:
  - learn/real-engineer/nodes/good-codebases.md
steps:
  - id: seam-and-adapter
    author: "google/gemini-3.8-flash"
    title: "用 Seam 與 Adapter 拆解難以測試的程式碼"
    purpose: "能用 seam 與 adapter 指出 daysSince 與 access.server.ts 該在哪裡切一刀，讓行為可以被替換。"
    sources:
      - "[[sources/real-engineer/20261116/course/050 Seams & Adapters.en.txt#L1-L71]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/lib/utils.ts#L18-L21]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/lib/access.server.ts#L1-L38]]"
  - id: make-the-loader-testable
    author: "google/gemini-3.8-flash"
    title: "重構 300 行的遺留 Loader：抽取深層模組、注入依賴與變異測試驗證"
    purpose: "能把 300 行 loader 縮成一個 deep module，注入 database 與 now，並用植入 bug 驗證測試。"
    sources:
      - "[[sources/real-engineer/20261116/course/051 Making Legacy Code Testable.en.txt#L1-L19]]"
      - "[[sources/real-engineer/20261116/course/052 Making Legacy Code Testable Solution.en.txt#L1-L61]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/instructor.analytics.tsx#L797-L860]]"
  - id: enforce-module-boundaries
    author: "google/gemini-3.8-flash"
    title: "用 Dependency Cruiser 守住模組邊界：讓 Deep Module 永遠保持深模組"
    purpose: "能用 dependency cruiser 讓 deep module 維持深，連 module 自己的測試也只能從 entry point import。"
    sources:
      - "[[sources/real-engineer/20261116/course/053 Enforcing Module Boundaries.en.txt#L1-L49]]"
      - "[[sources/real-engineer/20261116/course/054 Enforcing Module Boundaries Solution.en.txt#L1-L93]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/CODING_STANDARDS.md#L1-L25]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/AGENTS.md#L1-L19]]"
  - id: scan-with-improve-codebase-architecture
    author: "google/gemini-3.8-flash"
    title: "用 improve-codebase-architecture 找出模組深化候選"
    purpose: "能用 improve-codebase-architecture 掃出 deepening 候選，讀懂報告的三個提案並決定做哪幾個。"
    sources:
      - "[[sources/real-engineer/20261116/course/055 The improve-codebase-architecture Skill.en.txt#L1-L43]]"
      - "[[sources/real-engineer/20261116/course/056 The improve-codebase-architecture Skill Solution.en.txt#L1-L77]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/lib/access.server.ts#L1-L202]]"
  - id: refactor-through-spec
    author: "google/gemini-3.8-flash"
    title: "從 Grilling、Spec 到 Implement Spec：完整走完一次架構重構"
    purpose: "能把 refactor 走完 grilling、spec、tickets 到 implement spec，得到一個介面被強制的 module。"
    sources:
      - "[[sources/real-engineer/20261116/course/057 implement-spec For Refactors.en.txt#L1-L171]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/lib/ppp.ts#L1-L125]]"
created: 2026-11-16
updated: 2026-11-17
---

# seam、adapter 與讓 legacy 可測

## Lesson

legacy 不是壞掉的程式，而是沒有接縫的程式：seam 是你觀察與替換行為的邊界，adapter 是把外部世界擋在介面後面的那一層。找到接縫之後，測試才有可能、模組邊界才釘得住，而 `/improve-codebase-architecture` 與 refactor 的 spec 流程則示範怎麼把這些改動一次做完而不是零碎地修。

## Steps

1. [用 Seam 與 Adapter 拆解難以測試的程式碼](seams-and-adapters/seam-and-adapter.md)
2. [重構 300 行的遺留 Loader：抽取深層模組、注入依賴與變異測試驗證](seams-and-adapters/make-the-loader-testable.md)
3. [用 Dependency Cruiser 守住模組邊界：讓 Deep Module 永遠保持深模組](seams-and-adapters/enforce-module-boundaries.md)
4. [用 improve-codebase-architecture 找出模組深化候選](seams-and-adapters/scan-with-improve-codebase-architecture.md)
5. [從 Grilling、Spec 到 Implement Spec：完整走完一次架構重構](seams-and-adapters/refactor-through-spec.md)
