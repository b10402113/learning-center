---
id: gitops-with-argo-cd
title: "用 Argo CD 做 GitOps"
subject: kubernetes
tier: 4
order: 12
status: draft
goal: "讓 git 成為 desired state，用 Argo CD 的 Application 自動 sync 與 self-heal，並說出「部署」變成「同步」之後差在哪。"
digests:
  - 33-gitops-with-argo-cd.md
  - 34-synchronizing-manifests.md
prerequisites: []
steps: []
created: 2026-10-31
updated: 2026-10-31
---

# 用 Argo CD 做 GitOps

## Lesson

到這裡部署還是人手 `apply`。Argo CD 把 git 當成 desired state：Application 指向 repo 的某個路徑，自動 sync 並 self-heal，叢集被手改也會被拉回來。部署變成同步，這是後面 EKS 那一段的前提。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
