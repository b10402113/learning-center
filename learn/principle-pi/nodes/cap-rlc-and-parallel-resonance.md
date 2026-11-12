---
id: cap-rlc-and-parallel-resonance
title: "電容的 RLC 模型與並聯共振"
subject: principle-pi
tier: 5
order: 14
status: draft
goal: "用三元件 RLC 描述實裝 MLCC，並預測兩顆電容之間的並聯峰。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.8.part.md
prerequisites:
  - learn/principle-pi/nodes/series-rlc.md
  - learn/principle-pi/nodes/parallel-rlc-and-q.md
steps: []
created: 2026-11-11
updated: 2026-11-11
---

# 電容的 RLC 模型與並聯共振

## Lesson

一顆實裝 MLCC 用 C、ESL、ESR 三個元素就能描述得相當準，而兩顆自共振頻率不同的電容會在中間生出一個並聯峰。這個峰是整個 PDN 最關鍵的特徵，也是後面所有選值策略的對象。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
