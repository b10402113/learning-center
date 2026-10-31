---
id: environment-overlays
title: "Environment Overlays 與 EKS 上的 GitOps"
subject: kubernetes
tier: 4
order: 15
status: draft
goal: "用 overlays 讓同一份 base 同時服務 kind 與 EKS，只改 class、replica、hostname，並讓 EKS 上的 Argo CD 同步自己的 overlay。"
digests:
  - 41-environment-overlays-with-kustomize.md
  - 42-gitops-on-eks.md
prerequisites: []
steps: []
created: 2026-10-31
updated: 2026-10-31
---

# Environment Overlays 與 EKS 上的 GitOps

## Lesson

同一份 base，兩個環境。`overlays/kind` 與 `overlays/eks` 只 patch class、replica、hostname，diff 證明其他東西一個 byte 都沒動。EKS 上再跑一次 Argo CD，同步的是自己的 overlay，sealed secret 也必須用該叢集的 key 重封。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
