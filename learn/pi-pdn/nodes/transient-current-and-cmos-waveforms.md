---
id: transient-current-and-cmos-waveforms
title: "Transient current 與 CMOS 的電流波形"
subject: pi-pdn
tier: 6
order: 18
status: draft
goal: "從 clock-edge charge 推出 impulse/step/resonance 三種波形，並解釋 droop 的因是 ODC 放電、不是 di/dt。"
digests:
  - pdn-principles.14.part.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# Transient current 與 CMOS 的電流波形

## Lesson

沒有 transient current 就寫不出 PDN 規格；當 vendor 只給最大電流時，50% 是工作上的估計值。這個 node 從 CMOS inverter 建出 die 的電流模型，並修正一個常見的因果顛倒：真正造成 droop 的是 on-die 電容放電（v/L 才是後續拉電流的力量），不是 di/dt。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
