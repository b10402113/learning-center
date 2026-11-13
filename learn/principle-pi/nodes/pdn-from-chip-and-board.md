---
id: pdn-from-chip-and-board
title: "從晶片或電路板看 PDN"
subject: principle-pi
tier: 2
order: 7
status: written
goal: "說明同一結構為何從板看是凹陷、從 die 看是峰值，並用阻抗矩陣描述多埠耦合。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.md
prerequisites:
  - learn/principle-pi/nodes/parallel-rlc-and-q.md
steps:
  - id: same-pdn-two-views
    author: "google/gemini-3.8-flash"
    title: "從板端與 Die 端看同一組 LC：串聯凹陷與並聯峰值"
    purpose: "說明同一組 L、C 從板看是串聯凹陷、從 die 看是並聯峰值，並用工作值算出兩側的極值。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L793-L830]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L831-L894]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L895-L931]]"
  - id: transient-ringing
    author: "google/gemini-3.8-flash"
    title: "暫態模擬與共振振鈴：為什麼改變電流上升時間只會影響振幅？"
    purpose: "用暫態模擬解釋共振振鈴，並說明振鈴頻率由電路決定、振幅才隨電流上升時間改變。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L932-L955]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L956-L1000]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L1001-L1040]]"
  - id: impedance-matrix
    author: "google/gemini-3.8-flash"
    title: "從自阻抗與轉移阻抗讀懂多埠阻抗矩陣"
    purpose: "用自阻抗與轉移阻抗讀懂多埠阻抗矩陣，並判斷兩埠是完全耦合、部分耦合或無耦合。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L1041-L1095]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L1096-L1124]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L1125-L1160]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L1161-L1221]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L1222-L1268]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L1269-L1328]]"
created: 2026-11-11
updated: 2026-11-13
---

# 從晶片或電路板看 PDN

## Lesson

同一組電感與電容，從電路板往封裝看是串聯、從 die 往外看是並聯，所以一個造成凹陷、一個造成峰值。這一節還用暫態響應補上頻域分析看不到的振鈴，並把阻抗推廣成多埠的阻抗矩陣。

## Steps

1. [從板端與 Die 端看同一組 LC：串聯凹陷與並聯峰值](pdn-from-chip-and-board/same-pdn-two-views.md)
2. [暫態模擬與共振振鈴：為什麼改變電流上升時間只會影響振幅？](pdn-from-chip-and-board/transient-ringing.md)
3. [從自阻抗與轉移阻抗讀懂多埠阻抗矩陣](pdn-from-chip-and-board/impedance-matrix.md)
