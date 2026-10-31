---
id: disruption-and-least-privilege
title: "PodDisruptionBudgets、Node Drains 與 RBAC"
subject: kubernetes
tier: 4
order: 11
status: draft
goal: "在主動維護（drain）時保住可用 replica 的下限，並把 Pod 的權限收斂到「只能讀自己 namespace 的 ConfigMap」。"
digests:
  - 31-poddisruptionbudgets-node-drains.md
  - 32-rbac-least-privilege.md
prerequisites: []
steps: []
created: 2026-10-31
updated: 2026-10-31
---

# PodDisruptionBudgets、Node Drains 與 RBAC

## Lesson

主動維護（drain）與意外掛掉不同：PDB 給出可用 replica 的下限，讓 eviction 被拒絕而不是一次全部消失。RBAC 則回答「這個 Pod 能在叢集裡做什麼」，預設自動掛上的 service account token 是需要收掉的風險。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
