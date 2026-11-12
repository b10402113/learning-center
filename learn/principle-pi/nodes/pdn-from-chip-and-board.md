---
id: pdn-from-chip-and-board
title: "從晶片或電路板看 PDN"
subject: principle-pi
tier: 2
order: 7
status: draft
goal: "說明同一結構為何從板看是凹陷、從 die 看是峰值，並用阻抗矩陣描述多埠耦合。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.md
prerequisites:
  - learn/principle-pi/nodes/parallel-rlc-and-q.md
steps: []
created: 2026-11-11
updated: 2026-11-11
---

# 從晶片或電路板看 PDN

## Lesson

同一組電感與電容，從電路板往封裝看是串聯、從 die 往外看是並聯，所以一個造成凹陷、一個造成峰值。這一節還用暫態響應補上頻域分析看不到的振鈴，並把阻抗推廣成多埠的阻抗矩陣。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
