---
id: make-retries-safe
title: "讓重試安全"
subject: background-agent
tier: 2
order: 13
status: draft
goal: "能用 derived action ID 與 expectedVersion，讓「效果已落地但回應遺失」的重試不重複執行。"
digests:
  - 23-safe-retries-with-derived-ids.md
  - lessons-05-safe-retries.md
  - server.md
  - service.md
prerequisites:
  - learn/background-agent/nodes/split-the-loop-into-steps.md
steps: []
created: 2026-11-05
updated: 2026-11-05
---

# 讓重試安全

## Lesson

「效果已落地，但回應在半路消失」是分散式系統的常態，重試不能靠猜。這個節點用 derived action ID 當幂等鍵、用 expectedVersion 當版本圍籬，讓同一個決策重播時只產生一次效果。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
