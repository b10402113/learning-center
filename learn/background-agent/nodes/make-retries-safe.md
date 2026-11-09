---
id: make-retries-safe
title: "讓重試安全"
subject: background-agent
tier: 3
order: 10
status: draft
goal: "能用 derived action ID、expectedVersion 與 cancelOn，讓遺失回應的重試不重複執行效果。"
digests:
  - 23-safe-retries-with-derived-ids.md
  - lessons-05-safe-retries.md
  - server.md
  - service.md
  - shared.md
prerequisites:
  - learn/background-agent/nodes/test-human-in-the-loop.md
steps: []
created: 2026-11-09
updated: 2026-11-09
---

# 讓重試安全

## Lesson

重試真正危險的地方，是效果已經落地但回應遺失：代理看到 503，卻無法判斷要不要再做一次。這個節點用 run + cycle + action 推導穩定的 action ID，讓 checkout service 記得同一個 intent 的結果，並用 expectedVersion 與 cancelOn 把重複執行與重複 run 擋在外面。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
