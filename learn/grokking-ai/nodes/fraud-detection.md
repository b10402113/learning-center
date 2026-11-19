---
id: fraud-detection
title: "設計詐騙偵測"
subject: grokking-ai
tier: 3
order: 19
status: draft
goal: "用成本不對稱設門檻，並處理對手、延遲標籤與被審查的資料。"
digests:
  - "23. Design Fraud Detection.en.md"
prerequisites:
  - learn/grokking-ai/nodes/offline-evaluation.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 設計詐騙偵測

## Lesson

詐騙偵測是「判斷題」：一筆付款、一個決定。它與其他判斷題最大的差別是有對手——有人正在研究你的模型並繞過它——以及兩種錯誤的代價相差十幾倍。0.2% 的發生率讓準確率變成一個沒有意義的數字，而標籤要等到幾週後的拒付才出現。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
