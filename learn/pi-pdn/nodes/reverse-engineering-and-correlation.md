---
id: reverse-engineering-and-correlation
title: "從量測反推 PDN，並讓模擬對上量測"
subject: pi-pdn
tier: 7
order: 23
status: draft
goal: "用五個量測反推 ODC、loop L、Z0，並用 SCL 模型把 droop 與 resonance 對到量測 ±5% 內。"
digests:
  - pdn-principles.17.part.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# 從量測反推 PDN，並讓模擬對上量測

## Lesson

這一篇把整套方法收束成一個迴圈：電壓、漏電、幾個時脈下的電流、impulse response 與共振頻率五個量測，就能反推出 ODC、loop L 與 Z0。接著用 switched-capacitor load 模型跑 impulse／step／resonance，逐一隔離 q 的來源，並對照 PRC 的預測值。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
