---
id: offline-evaluation
title: "離線評估：挑對指標"
subject: grokking-ai
tier: 2
order: 13
status: draft
goal: "依輸出形狀與 base rate 選指標，並區分「排序能力」與「校準」這兩件事。"
digests:
  - "14. Offline Evaluation Choosing the Metric.en.md"
prerequisites:
  - learn/grokking-ai/nodes/model-serving-and-rollout.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 離線評估：挑對指標

## Lesson

離線評估只有一個工作：決定哪些候選模型值得進入線上實驗，而不是決定哪一個上線。兩個事實就決定了該用哪個指標——輸出形狀（分類、排序或回歸）與 base rate。而在稀有事件上，排序能力與校準是兩件不同的事，不能只用一個數字交代。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
