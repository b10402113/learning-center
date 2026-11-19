---
id: training-vs-serving
title: "訓練與服務是兩個系統"
subject: grokking-ai
tier: 2
order: 7
status: draft
goal: "用「兩個系統共用一個模型」開場，說明兩邊的取捨、訓練管線四階段，以及 skew 與 rollback。"
digests:
  - "8. Training vs Serving.en.md"
prerequisites:
  - learn/grokking-ai/nodes/ml-system-planes.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 訓練與服務是兩個系統

## Lesson

最有用的開場句是「這是兩個系統共用一個模型」。訓練追求吞吐量，可以排隊、可以用 spot instance、失敗是軟的；服務追求延遲，必須隨時在線、失敗是硬的。把這兩個盒子分開畫，後面關於 skew、rollback 與版本的問題就有一半先被回答了。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
