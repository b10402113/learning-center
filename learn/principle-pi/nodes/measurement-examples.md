---
id: measurement-examples
title: "量測實例：導線迴路、via、MLCC 與 on-die 電容"
subject: principle-pi
tier: 3
order: 10
status: draft
goal: "把 fixture 時延與損耗納入模型，從實測反推 R、L、ESR 與 on-die 電容。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.md
prerequisites:
  - learn/principle-pi/nodes/two-port-low-impedance.md
steps: []
created: 2026-11-11
updated: 2026-11-11
---

# 量測實例：導線迴路、via、MLCC 與 on-die 電容

## Lesson

同一條導線迴路用單埠量看起來電阻會隨頻率上升，用雙埠加 fixture 模型才發現那只是時延造成的假象。這一節用 via、實裝 MLCC 與 on-die 電容量測，示範如何把 fixture 一併放進模型再萃取參數。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
