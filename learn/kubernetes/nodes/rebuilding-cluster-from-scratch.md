---
id: rebuilding-cluster-from-scratch
title: "從零重建 Stable 叢集"
subject: kubernetes
tier: 3
order: 8
status: draft
goal: "不靠任何舊資源，只用 manifest 把 namespace、設定、probe、Gateway 重建一次，並在重建過程中看懂每個欄位為什麼在那裡。"
digests:
  - 20-migrating-to-manifests.md
  - 21-health-checks.md
  - 22-service-configmap-secret.md
  - 23-configuring-the-gateway-api.md
  - 24-patching-the-control-plane.md
prerequisites: []
steps: []
created: 2026-10-31
updated: 2026-10-31
---

# 從零重建 Stable 叢集

## Lesson

這是 Stable 階段的重頭戲：把 POC 剩下的東西全部改寫成 manifest，再從零重建一次。過程中補上 probe 真正生效、namespace 搬家、Gateway 設定，以及把 gateway 釘到 control plane 的 patch。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
