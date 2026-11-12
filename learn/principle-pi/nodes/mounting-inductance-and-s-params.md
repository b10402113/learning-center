---
id: mounting-inductance-and-s-params
title: "安裝電感、vendor S 參數與高頻模型"
subject: principle-pi
tier: 5
order: 16
status: draft
goal: "判斷安裝電感的來源，並從 vendor S 參數萃取 C、ESL 與 ESR。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.8.part.md
prerequisites:
  - learn/principle-pi/nodes/capacitance-esr-and-controlled-esr.md
steps: []
created: 2026-11-11
updated: 2026-11-11
---

# 安裝電感、vendor S 參數與高頻模型

## Lesson

電容的 ESL 有一半以上來自你怎麼把它裝上去，而不是元件本身。這一節比較 via-in-pad、背面安裝與 reverse-aspect-ratio 的差異，並示範如何從 vendor 提供的 S 參數反推 C、ESL 與 ESR，以及何時要改用傳輸線模型。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
