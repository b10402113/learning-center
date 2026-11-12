---
id: cavity-vrm-and-bulk
title: "腔體、VRM 與 bulk 電容的角色"
subject: principle-pi
tier: 8
order: 22
status: draft
goal: "說明 cavity 尺寸為何幾乎無關，以及 VRM 迴路與 bulk 電容如何決定低頻。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.md
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.12.part.md
prerequisites:
  - learn/principle-pi/nodes/odc-package-and-bandini.md
steps: []
created: 2026-11-11
updated: 2026-11-11
---

# 腔體、VRM 與 bulk 電容的角色

## Lesson

從 die pad 看，同一組電容放在 1 吋或 10 吋的腔體上幾乎沒有差別，真正重要的是電容到封裝的擴散電感。這一節把腔體簡化成集總電容，再往低頻接到 VRM 的串聯 RL 與必要的 bulk 電容。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
