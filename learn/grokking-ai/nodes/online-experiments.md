---
id: online-experiments
title: "線上實驗與 A/B 測試"
subject: grokking-ai
tier: 2
order: 15
status: draft
goal: "說明為何離線只是篩選，並講清 shadow→canary→A/B 的順序、護欄與讀數陷阱。"
digests:
  - "16. Online Experiments and AB Testing.en.md"
prerequisites:
  - learn/grokking-ai/nodes/offline-evaluation.md
  - learn/grokking-ai/nodes/monitoring-drift-retraining.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 線上實驗與 A/B 測試

## Lesson

離線 AUC 從 0.78 升到 0.80 不代表生意會變好。離線只問模型多貼合過去的點擊，生產問的是商業結果；中間還有 proxy、回饋迴路與「服務不是評分」三個落差。所以順序是離線閘門、shadow 模式、最後才是 A/B 測試。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
