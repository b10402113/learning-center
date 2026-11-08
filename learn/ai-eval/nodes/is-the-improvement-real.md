---
id: is-the-improvement-real
title: "判斷進步是不是真的"
subject: ai-eval
tier: 4
order: 14
status: draft
goal: "能用 paired test 與 bootstrap confidence interval 判斷一次進步是真的還是噪音。"
digests:
  - lesson7.en.md
  - AI_Evals_Week4_Deck.md
prerequisites:
  - learn/ai-eval/nodes/trustworthy-eval-datasets.md
steps: []
created: 2026-11-08
updated: 2026-11-08
---

# 判斷進步是不是真的

## Lesson

小樣本上的幾分進步通常是噪音：paired test 在同樣的案例上比兩個版本，bootstrap confidence interval 告訴你這個差距合不合理。這條節點也講兩個實務陷阱：樣本量要從效果回推，以及「試很多版本再挑最好的」會讓你 ship 到運氣。判讀的單位是「分數 + n + 95% 區間」，不是單一個數字。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
