---
id: planes-as-cavities
title: "平面就是 cavity：低頻電容、迴路電感與 spreading inductance"
subject: pi-pdn
tier: 4
order: 10
status: draft
goal: "用 1 nF/in²/mil、Lsq = 32 pH/mil×h、Lspread ∝ ln(R2/R1) 算出一個 cavity 的 C 與 L。"
digests:
  - pdn-principles.9.part.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# 平面就是 cavity：低頻電容、迴路電感與 spreading inductance

## Lesson

任何相鄰的 power/ground 平面都是一個把場關在裡面的 cavity，它的阻抗分成低頻電容、中頻電感、高頻 modal 三段。這個 node 只處理前兩段：parallel-plate 與 fringe 電容、長窄 cavity 的 sheet inductance，以及寬 cavity 裡電流徑向擴散造成的 spreading inductance。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
