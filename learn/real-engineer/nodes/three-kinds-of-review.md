---
id: three-kinds-of-review
title: "三道煞車與 PR 的呈現方式"
subject: real-engineer
tier: 3
order: 7
goal: "能說明 automated checks／automated review／human review 的分工，並用 PR skill 讓 diff 被快速讀懂與排序。"
digests:
  - 036 The Three Kinds Of Review.en.md
  - 037 The PR Skill.en.md
  - 038 Running The PR Skill.en.md
  - 039 Running The PR Skill Solution.en.md
prerequisites:
  - learn/real-engineer/nodes/brakes-and-accelerators.md
steps:
  - id: three-brakes-of-review
    author: "google/gemini-3.8-flash"
    title: "軟體工廠的三層審查：從成本看代碼品質的煞車機制"
    purpose: "能用成本說明 automated checks、automated review、human review 三層的分工與順序。"
    sources:
      - "[[sources/real-engineer/20261116/course/036 The Three Kinds Of Review.en.txt#L1-L37]]"
  - id: summary-explains-why
    author: "google/gemini-3.8-flash"
    title: "用 Show Me 風格的摘要，在看程式碼前先搞懂 PR 的「為什麼」"
    purpose: "能用 Show Me 風格的 Summary，讓 reviewer 在看 code 前就先懂 PR 的 why。"
    sources:
      - "[[sources/real-engineer/20261116/course/037 The PR Skill.en.txt#L1-L41]]"
  - id: evidence-before-and-after
    author: "google/gemini-3.8-flash"
    title: "在 PR 中提供硬證據：用 Before 與 After 證明改動有效"
    purpose: "能用 before／after 的硬證據證明改動有效，並分辨 S-tier 與 A-tier 證據。"
    sources:
      - "[[sources/real-engineer/20261116/course/037 The PR Skill.en.txt#L42-L59]]"
  - id: merge-danger-priority
    author: "google/gemini-3.8-flash"
    title: "用單雙向門與爆炸半徑決定 PR 審查深度"
    purpose: "能用 one-way／two-way door 加 blast radius，排出每個 PR 該審多深。"
    sources:
      - "[[sources/real-engineer/20261116/course/037 The PR Skill.en.txt#L60-L109]]"
  - id: run-the-pr-skill
    author: "google/gemini-3.8-flash"
    title: "執行 PR Skill：依 Diff 生成 Body 並分三段驗收"
    purpose: "能跑一次 PR skill：請 agent 依 diff 寫 body，再用三個段落驗收這份 body。"
    sources:
      - "[[sources/real-engineer/20261116/course/038 Running The PR Skill.en.txt#L1-L29]]"
      - "[[sources/real-engineer/20261116/course/039 Running The PR Skill Solution.en.txt#L1-L53]]"
status: written
created: 2026-11-16
updated: 2026-11-17
---

# 三道煞車與 PR 的呈現方式

## Lesson

品質是分層堆上來的：automated checks 花 CPU、automated review 花 token、human review 花你最貴的注意力。人審之前，PR 自己就要說得清楚——Summary 先講 why、Evidence 給 before/after、Merge Danger 用 one-way/two-way door 與 blast radius 決定該審多深。

## Steps

1. [軟體工廠的三層審查：從成本看代碼品質的煞車機制](three-kinds-of-review/three-brakes-of-review.md)
2. [用 Show Me 風格的摘要，在看程式碼前先搞懂 PR 的「為什麼」](three-kinds-of-review/summary-explains-why.md)
3. [在 PR 中提供硬證據：用 Before 與 After 證明改動有效](three-kinds-of-review/evidence-before-and-after.md)
4. [用單雙向門與爆炸半徑決定 PR 審查深度](three-kinds-of-review/merge-danger-priority.md)
5. [執行 PR Skill：依 Diff 生成 Body 並分三段驗收](three-kinds-of-review/run-the-pr-skill.md)
