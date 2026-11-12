---
id: target-q-and-robust-strategy
title: "目標阻抗、Q 值、rogue wave 與穩健策略"
subject: principle-pi
tier: 9
order: 27
status: draft
goal: "分辨 fully 與 marginally robust，並用單一主峰與低 Q 對抗 rogue wave。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.13.part.md
prerequisites:
  - learn/principle-pi/nodes/three-current-waveforms.md
steps: []
created: 2026-11-11
updated: 2026-11-11
---

# 目標阻抗、Q 值、rogue wave 與穩健策略

## Lesson

當好幾個高度相近的高 Q 峰同時存在，一段精心排序的電流可以把它們的能量疊起來，做出遠低於任何單峰預測的 rogue wave。由於無法控制客戶的微碼，這一節把策略收斂到兩個可控制項：單一主峰與低 Q，並用 fully 與 marginally robust 區分風險等級。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
