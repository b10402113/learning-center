---
id: opd-and-shared-rails
title: "On-package 去耦合與共用電源軌"
subject: principle-pi
tier: 8
order: 24
status: draft
goal: "評估 OPD 與其他晶片作為電容對峰值的影響，並守住阻尼。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.12.part.md
prerequisites:
  - learn/principle-pi/nodes/mlcc-values-and-fdtim.md
steps: []
created: 2026-11-11
updated: 2026-11-11
---

# On-package 去耦合與共用電源軌

## Lesson

封裝基板可以把安裝電感壓到 0.2 nH 以下，讓 OPD 把 Bandini Mountain 拆成兩個較低的峰，有時十顆就能取代數十顆板級 MLCC。這一節也看共用電源軌上的其他晶片：它們是低 ESL、低 ESR 的額外電容，可能壓低峰值，也可能把刻意做的阻尼短路掉。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
