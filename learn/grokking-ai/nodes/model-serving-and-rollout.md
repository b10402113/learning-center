---
id: model-serving-and-rollout
title: "模型服務的基本功"
subject: grokking-ai
tier: 2
order: 12
status: draft
goal: "說出延遲預算怎麼切、P99 怎麼看、rollout 階梯與 fallback 階梯怎麼設計。"
digests:
  - "13. Model Serving Basics.en.md"
prerequisites:
  - learn/grokking-ai/nodes/features-and-feature-stores.md
  - learn/grokking-ai/nodes/inference-modes.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 模型服務的基本功

## Lesson

存下來的模型不會回答任何人。服務是讓它對即時請求作答：無狀態的模型伺服器、切成階段的延遲預算、以 P99 而不是平均值驗收，以及一條每一個階梯都能停下來的上線階梯。伺服器數量往往由失敗而不是流量決定。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
