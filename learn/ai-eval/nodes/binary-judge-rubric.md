---
id: binary-judge-rubric
title: "寫出 binary judge rubric"
subject: ai-eval
tier: 2
order: 6
status: draft
goal: "能用五個元素寫出單一判準、輸出格式固定的 binary judge prompt。"
digests:
  - lesson3.en.md
  - AI_Evals_InPractice_Week2_Deck.md
  - Week-2-Assignment-1-Step-by-Step-Walkthrough.md
prerequisites:
  - learn/ai-eval/nodes/evaluator-types.md
steps: []
created: 2026-11-08
updated: 2026-11-08
---

# 寫出 binary judge rubric

## Lesson

一個可靠的 judge 靠的不是更長的 prompt，而是五個元素：auditor 角色、一個 binary 問題、明確的 PASS/FAIL 定義、邊界例子、固定輸出格式。這條節點解釋為什麼 binary 比 1–5 分量表可靠，以及為什麼一個 judge 只量一個判準。實作上會用 Week 2 的 assignment 把 failure code 翻成 rubric。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
