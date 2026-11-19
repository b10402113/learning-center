---
id: monitoring-drift-retraining
title: "監控、漂移與重訓"
subject: grokking-ai
tier: 2
order: 14
status: draft
goal: "分開資料漂移與概念漂移，並用四層監控與三種重訓節奏回應。"
digests:
  - "15. Monitoring, Drift, and Retraining.en.md"
prerequisites:
  - learn/grokking-ai/nodes/offline-evaluation.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 監控、漂移與重訓

## Lesson

漂移是模型品質隨著世界改變而衰減，而且它不會發出任何錯誤。資料漂移是輸入分布移動，概念漂移是輸入與結果的關係改變，兩者需要不同的回應。四層監控由快到真，但只有需要標籤的那一層直接量到品質。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
