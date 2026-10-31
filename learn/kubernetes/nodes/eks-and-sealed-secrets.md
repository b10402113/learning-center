---
id: eks-and-sealed-secrets
title: "Going to the Cloud：EKS 叢集與 Sealed Secrets"
subject: kubernetes
tier: 4
order: 13
status: draft
goal: "用 eksctl 建出受管叢集、切 context 進去，並用 SealedSecret 讓密碼可以安全進 git。"
digests:
  - 35-create-a-cluster-on-eks.md
  - 36-sealed-secrets.md
  - 37-exploring-the-eks-cluster.md
prerequisites: []
steps: []
created: 2026-10-31
updated: 2026-10-31
---

# Going to the Cloud：EKS 叢集與 Sealed Secrets

## Lesson

換到雲上。eksctl 用一份 config 建出受管 control plane + EC2 worker，成本與邊界跟 kind 完全不同（你碰不到 control plane，而且按小時計費）。Sealed Secrets 讓密碼可以進 git，因為解密金鑰只在叢集裡。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
