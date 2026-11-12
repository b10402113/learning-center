---
id: odc-package-and-bandini
title: "On-die 電容、封裝 PDN 與 Bandini Mountain"
subject: principle-pi
tier: 8
order: 21
status: draft
goal: "解釋 ODC 與封裝迴路電感如何形成整個 PDN 最高的並聯峰。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.md
prerequisites:
  - learn/principle-pi/nodes/pdn-from-chip-and-board.md
  - learn/principle-pi/nodes/cavity-modal-resonances.md
steps: []
created: 2026-11-11
updated: 2026-11-11
---

# On-die 電容、封裝 PDN 與 Bandini Mountain

## Lesson

PDN 是一個從 VRM 到 die pad 的生態系，各元素各管一段頻率，但真正決定雜訊的是交界處的並聯共振。這一節聚焦其中最高的那座 Bandini Mountain：on-die 電容與封裝迴路電感的並聯峰，以及它的頻率與阻尼極限。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
