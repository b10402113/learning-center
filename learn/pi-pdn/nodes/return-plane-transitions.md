---
id: return-plane-transitions
title: "訊號換 return plane 時，cavity noise 怎麼來"
subject: pi-pdn
tier: 4
order: 13
status: draft
goal: "解釋 return current 換層如何把 via 電流變成平面間電壓波，並估出 victim via 上的 mV。"
digests:
  - pdn-principles.11.part.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# 訊號換 return plane 時，cavity noise 怎麼來

## Lesson

當 signal via 從一層換到另一層，它的 return current 必須在兩個平面之間跳，cavity 阻抗就把這個電流轉成平面間的電壓波，耦合進同一 cavity 裡的每一根 via。這是 SI 與 EMC 問題，不是 PI 問題，而且影響是長距離的。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
