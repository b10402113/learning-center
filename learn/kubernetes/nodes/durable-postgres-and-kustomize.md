---
id: durable-postgres-and-kustomize
title: "Durable Postgres 與 Kustomize"
subject: kubernetes
tier: 3
order: 9
status: draft
goal: "用 CloudNativePG 的 `Cluster` 換掉臨時 Postgres 並證明資料會活下來，再用 Kustomize 把 manifest 收成一個 base，清算 Stable 還缺什麼。"
digests:
  - 25-installing-the-cloudnativepg-operator.md
  - 26-durable-postgres-with-cloudnativepg.md
  - 27-organizing-manifests-with-kustomize.md
  - 28-stable-phase-review.md
prerequisites: []
steps: []
created: 2026-10-31
updated: 2026-10-31
---

# Durable Postgres 與 Kustomize

## Lesson

operator 是「把維運知識寫成一個 control loop」：CRD 讓 API server 認識新的 kind，operator 負責 reconcile 它，CloudNativePG 用一個 `Cluster` 就把資料庫的 Pod、PVC、Service、Secret 一起管掉。最後把一堆 `apply -f` 收成 `k8s/base`，並用 stable review 列出 Day 2 的待辦。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
