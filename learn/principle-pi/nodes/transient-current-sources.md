---
id: transient-current-sources
title: "暫態電流的來源與估計方法"
subject: principle-pi
tier: 9
order: 25
status: draft
goal: "從時鐘邊緣電荷推導 PDN 電流，並用最大電流的 50% 設定 worst case。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.13.part.md
prerequisites:
  - learn/principle-pi/nodes/working-or-robust-pdn.md
  - learn/principle-pi/nodes/odc-package-and-bandini.md
steps: []
created: 2026-11-11
updated: 2026-11-11
---

# 暫態電流的來源與估計方法

## Lesson

沒有暫態電流，阻抗規格就沒有意義；但供應商通常只給最大電流。這一節從 CMOS 閘極的時鐘邊緣電荷推導真正的 PDN 電流波形，並說明為什麼最大電流的 50% 是一個可辯護的 worst case 起點。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
