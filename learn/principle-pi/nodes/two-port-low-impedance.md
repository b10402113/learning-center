---
id: two-port-low-impedance
title: "單埠極限、四點 Kelvin 與雙埠低阻抗"
subject: principle-pi
tier: 3
order: 9
status: draft
goal: "解釋為何單埠在 0.1 Ω 以下失效，並用雙埠 Kelvin 取得 Z ≈ 25 Ω × S21。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.md
prerequisites:
  - learn/principle-pi/nodes/measuring-impedance.md
steps: []
created: 2026-11-11
updated: 2026-11-11
---

# 單埠極限、四點 Kelvin 與雙埠低阻抗

## Lesson

當阻抗掉到 0.1 Ω 以下，S11 幾乎貼在 −1，單埠量測就失去解析度。這一節把 Kelvin 分離電流與感測引線的老方法搬到高頻，得到一條 Z ≈ 25 Ω × S21 的實用公式，也提醒它何時會失效。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
