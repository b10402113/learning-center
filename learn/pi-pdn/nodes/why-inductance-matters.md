---
id: why-inductance-matters
title: "PDN 設計為什麼要在乎電感"
subject: pi-pdn
tier: 2
order: 4
status: draft
goal: "用「每安培圈出多少磁力線」說明電感是幾何量，並解釋它為何主導高頻阻抗、是最便宜的降 peak 槓桿。"
digests:
  - pdn-principles.5.part.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# PDN 設計為什麼要在乎電感

## Lesson

PDN 的阻抗在大部分頻段由電感主導，而電感是幾何量、不隨電流或介質改變，所以降低它是設計上最便宜的槓桿。這個 node 從磁力線與 Faraday's law 建立 V = L dI/dt，並說明 quasi-static 近似在什麼時候還成立。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
