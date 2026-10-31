---
id: observability-and-teardown
title: "Observability、Tearing It Down 與 Wrap-Up"
subject: kubernetes
tier: 4
order: 16
status: draft
goal: "先用 `kubectl top`/`events` 這種內建訊號看平台，再照順序拆掉 Argo CD、Gateway、cluster，並確認沒有孤兒資源繼續計費。"
digests:
  - 43-platform-observability.md
  - 44-deleting-cloud-resources.md
  - 45-wrapping-up.md
prerequisites: []
steps: []
created: 2026-10-31
updated: 2026-10-31
---

# Observability、Tearing It Down 與 Wrap-Up

## Lesson

最後一段不是新功能，是維運：先用內建的 `kubectl top`、`kubectl events` 看平台，真的不夠才上 Prometheus。拆的時候有順序——先刪 Application 再刪 Gateway，否則 self-heal 會把 ALB 重建回來——最後清算整門課學到的東西。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
