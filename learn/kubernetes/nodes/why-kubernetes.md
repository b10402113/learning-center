---
id: why-kubernetes
title: "Why Kubernetes：心智模型"
subject: kubernetes
tier: 1
order: 1
status: draft
goal: "說出這門課要做的三件事（POC、Stable、Production），並用 desired state 對 actual state 的 reconcile loop 解釋 Kubernetes 到底在做什麼。"
digests:
  - 0-introduction.md
  - 1-the-kubernetes-loop.md
  - 2-local-vs-cloud-clusters.md
prerequisites: []
steps: []
created: 2026-10-31
updated: 2026-10-31
---

# Why Kubernetes：心智模型

## Lesson

課程先花一整段講「為什麼」，而不是急著打指令：先看同一個 app 要經歷的三個場景，再用巡航控制與廚房出餐解釋 reconciliation loop。懂了 loop，後面每個物件都只是「它在 reconcile 什麼」。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
