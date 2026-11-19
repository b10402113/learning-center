---
id: features-and-feature-stores
title: "特徵與特徵儲存"
subject: grokking-ai
tier: 2
order: 9
status: draft
goal: "從五種訊號源取特徵，說出批次／串流／請求時三條路徑與 point-in-time 正確性。"
digests:
  - "10. Features and Feature Stores.en.md"
prerequisites:
  - learn/grokking-ai/nodes/training-vs-serving.md
  - learn/grokking-ai/nodes/labels-and-training-data.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 特徵與特徵儲存

## Lesson

特徵是模型在預測當下能知道的值，而且絕不能包含標籤。實務上的難題不是「想到什麼特徵」，而是三件事：同一個特徵要從哪條路徑算（批次、串流或請求時）、離線與線上怎麼共用同一個定義、以及 join 的時候怎麼只用當時真的存在的值。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
