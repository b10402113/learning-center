---
id: mlcc-value-strategy-fdtim-opd
title: "MLCC 選值：單值、三值、FDTIM 與 OPD"
subject: pi-pdn
tier: 5
order: 17
status: draft
goal: "判斷「加 10 µF」何時是錯的，並用 FDTIM、controlled-ESR 或 OPD 做出一條 1–200 MHz 的平阻抗。"
digests:
  - pdn-principles.13.part.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# MLCC 選值：單值、三值、FDTIM 與 OPD

## Lesson

「10 µF」「10 µF + 1 µF + 0.1 µF」這類配方是任意的：在不知道 ecology 的情況下，更多同值電容只是逼近 dead-short 極限，甚至會因為拿掉 ESR 阻尼而讓峰變高。這個 node 給出三條有理由的路：把單值 SRF 對到 Bandini 峰、用 FDTIM 選出一組平阻抗的值、或直接放 OPD／controlled-ESR 電容。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
