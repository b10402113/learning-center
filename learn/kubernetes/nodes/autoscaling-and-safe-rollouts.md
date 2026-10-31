---
id: autoscaling-and-safe-rollouts
title: "HPA 自動擴縮與安全上線"
subject: kubernetes
tier: 4
order: 10
status: draft
goal: "用 CPU target 驅動 replica 數量，並用 readiness 當護欄做出「壞掉的版本進不了流量」的 rolling update 與 rollback。"
digests:
  - 29-autoscaling-with-hpa.md
  - 30-safe-rollouts-rollbacks.md
prerequisites: []
steps: []
created: 2026-10-31
updated: 2026-10-31
---

# HPA 自動擴縮與安全上線

## Lesson

先讓 replica 數量跟著 CPU 走，再處理「新版本怎麼進去」。readiness 是護欄：壞掉的 image 永遠進不了流量，rollback 只是把上一版 manifest 拿回來——這也是 Stable 清單上缺的兩項。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
