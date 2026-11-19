---
id: inference-modes
title: "批次推論與線上推論"
subject: grokking-ai
tier: 2
order: 10
status: draft
goal: "用「預測是否需要請求當下的資訊」選推論模式、更新節奏與預算浪費的修法。"
digests:
  - "11. Batch vs Online Inference.en.md"
prerequisites:
  - learn/grokking-ai/nodes/features-and-feature-stores.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 批次推論與線上推論

## Lesson

選擇推論模式的問題只有一個：這個預測需不需要只有請求當下才存在的資訊。批次預先算好、查表一秒內回應；線上在使用者等待時算，換來新鮮度。中間還有一個常被忽略的選項——先預算再即時重排。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
