---
id: from-imperative-to-declarative
title: "從指令到宣告式"
subject: kubernetes
tier: 3
order: 5
status: draft
goal: "把一個 imperative 指令變成進 git 的 manifest，說出 `create` 與 `apply` 的差別，以及為什麼 label/selector 是 Service 找到 Pod 的方式。"
digests:
  - 14-manifests.md
  - 15-deployment-manifest-labels.md
prerequisites: []
steps: []
created: 2026-10-31
updated: 2026-10-31
---

# 從指令到宣告式

## Lesson

從這裡開始東西要進 git。先看 manifest 的四個固定欄位，再把 deployment 寫成 YAML，理解 `create` 與 `apply` 的差別，以及 label/selector 怎麼把 Service 接到 Pod 上——這條線後面每一節都會再出現一次。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
