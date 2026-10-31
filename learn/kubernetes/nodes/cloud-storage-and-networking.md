---
id: cloud-storage-and-networking
title: "Cluster Storage、Cloud Networking 與 Exposing"
subject: kubernetes
tier: 4
order: 14
status: draft
goal: "把本機的 local-path 換成 gp3 EBS，把 NGINX Gateway 換成 AWS Load Balancer Controller，讓同一份 Gateway/HTTPRoute 變成真的 ALB。"
digests:
  - 38-cluster-storage-ebs-csi.md
  - 39-cloud-networking.md
  - 40-exposing-the-cluster.md
prerequisites: []
steps: []
created: 2026-10-31
updated: 2026-10-31
---

# Cluster Storage、Cloud Networking 與 Exposing

## Lesson

同樣的 PVC 與 Gateway，換了 provisioner 就是不同東西：local-path 變 gp3 EBS，NGINX 變 ALB。這節把 storage class、IAM/OIDC、Load Balancer Controller 一次接起來，也撞到第一個「本機可以、雲上不行」的欄位。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
