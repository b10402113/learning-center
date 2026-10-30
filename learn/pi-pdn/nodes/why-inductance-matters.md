---
id: why-inductance-matters
title: "PDN 設計為什麼要在乎電感"
subject: pi-pdn
tier: 2
order: 4
status: written
goal: "用「每安培圈出多少磁力線」說明電感是幾何量，並解釋它為何主導高頻阻抗、是最便宜的降 peak 槓桿。"
digests:
  - pdn-principles.1.part.md
  - pdn-principles.2.part.md
  - pdn-principles.3.part.md
  - pdn-principles.4.part.md
  - pdn-principles.5.part.md
  - pdn-principles.6.part.md
  - pdn-principles.7.part.md
  - pdn-principles.8.part.md
  - pdn-principles.9.part.md
  - pdn-principles.10.part.md
  - pdn-principles.11.part.md
  - pdn-principles.12.part.md
  - pdn-principles.13.part.md
  - pdn-principles.14.part.md
  - pdn-principles.15.part.md
  - pdn-principles.16.part.md
  - pdn-principles.17.part.md
prerequisites: []
steps:
  - id: lower-inductance-is-the-cheapest-lever
    title: "降低電感是平衡效能與成本的關鍵"
    purpose: "指出 Z(f) 上每個峰各由哪段電感造成，並說明降電感為何是最便宜的降阻抗槓桿。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4677-L4727]]"
  - id: inductance-is-flux-per-amp
    title: "電感是什麼：磁場與電感的基本原理"
    purpose: "用「每安培圈出多少磁力線」定義 loop inductance，並說出長度、截面、signal-return 間距三個幾何槓桿。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4728-L5073]]"
  - id: impedance-of-an-inductor
    title: "電感的阻抗"
    purpose: "用 Faraday's law 得到 V = L dI/dt 與 Z = jωL，說明 L 幾乎不隨頻率變而阻抗持續上升。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5074-L5174]]"
  - id: the-quasi-static-approximation
    title: "電感的 quasi-static 近似"
    purpose: "用 λ/20 判斷何時可把結構當成 lumped L，並說出多大的板子必須改用全波模型。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5175-L5329]]"
  - id: energy-in-the-magnetic-field
    title: "電感與磁場中的能量"
    purpose: "用 B²/2µ0 說明能量存在磁力線壓縮，並從 U = ½LI² 推出加寬、縮短、拉近 return path 的設計規則。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5330-L5594]]"
created: 2026-10-30
updated: 2026-10-30
---

# PDN 設計為什麼要在乎電感

## Lesson

PDN 的阻抗在大部分頻段由電感主導，而電感是幾何量、不隨電流或介質改變，所以降低它是設計上最便宜的槓桿。這個 node 從磁力線與 Faraday's law 建立 V = L dI/dt，並說明 quasi-static 近似在什麼時候還成立。

## Steps

1. [降低電感是平衡效能與成本的關鍵](why-inductance-matters/lower-inductance-is-the-cheapest-lever.md)
2. [電感是什麼：磁場與電感的基本原理](why-inductance-matters/inductance-is-flux-per-amp.md)
3. [電感的阻抗](why-inductance-matters/impedance-of-an-inductor.md)
4. [電感的 quasi-static 近似](why-inductance-matters/the-quasi-static-approximation.md)
5. [電感與磁場中的能量](why-inductance-matters/energy-in-the-magnetic-field.md)
