---
id: inductance-approximations
title: "迴路電感的解析近似與經驗法則"
subject: principle-pi
tier: 4
order: 13
status: draft
goal: "用 25 nH/inch、片電感與 L = Z0·TD 快速估算常見幾何。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.7.part.md
prerequisites:
  - learn/principle-pi/nodes/loop-and-partial-inductance.md
steps: []
created: 2026-11-11
updated: 2026-11-11
---

# 迴路電感的解析近似與經驗法則

## Lesson

只有同軸、雙圓桿與圓桿對平面三種幾何有精確解，其餘都得靠近似。這一節整理片電感、平行板、均勻傳輸線與「細線對遠回路取 25 nH/inch」等隨手可用的估算，並示範如何從 3D 求解器的 S 參數反推電感。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
