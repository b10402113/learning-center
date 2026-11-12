---
id: mlcc-values-and-fdtim
title: "單值與三值 MLCC 選法以及 FDTIM"
subject: principle-pi
tier: 8
order: 23
status: draft
goal: "用 FDTIM 從 Bandini 的 Z0 與 q 反推電容數量與值，而不是憑慣例。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.12.part.md
prerequisites:
  - learn/principle-pi/nodes/cavity-vrm-and-bulk.md
steps: []
created: 2026-11-11
updated: 2026-11-11
---

# 單值與三值 MLCC 選法以及 FDTIM

## Lesson

「每 pin 一顆 10 µF、1 µF、0.1 µF」是慣例，不是推導；在相同 ESL 下三種值幾乎沒有差別。這一節用 Frequency Domain Target Impedance Method，從 Bandini 的特性阻抗與 q 回推需要的電容顆數與值，把板子做成一個接近 target 的電阻。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
