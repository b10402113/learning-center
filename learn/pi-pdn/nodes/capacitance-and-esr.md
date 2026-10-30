---
id: capacitance-and-esr
title: "多少電容才夠，ESR 從哪裡來"
subject: pi-pdn
tier: 3
order: 8
status: draft
goal: "從 Ztarget 與 VRM 頻率反推容值，並用 ESR 估計式與 controlled-ESR 的 q 值選零件。"
digests:
  - pdn-principles.7.part.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# 多少電容才夠，ESR 從哪裡來

## Lesson

容值不是「越大越好」，而是要在 VRM 放棄的頻段把阻抗壓在 target 以下，frequency domain 與 time domain 兩種推法給出同一個答案。這個 node 也把 ESR 從規格表上的單一數字，拆成 dielectric loss、current crowding 與 controlled-ESR 三種設計變數。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
