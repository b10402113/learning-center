---
id: rlc-resonance-and-two-views
title: "串並聯 RLC 的共振特性，與晶片／板子兩個視角"
subject: pi-pdn
tier: 1
order: 3
status: written
goal: "對任何阻抗峰說出 fres、Z0、q、Zmax，並解釋同一結構為何從 die 看是峰、從 board 看是谷。"
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
  - id: resonant-properties-of-rlc
    title: "Series 與 parallel RLC 的共振特性"
    purpose: "對任何阻抗說出 fres、Z0、q 與 Zmax，並用 peak ≈ Z0 × q 估出峰高、用 q ≈ 1 決定阻尼。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1825-L1985]]"
  - id: real-capacitor-rlc-examples
    title: "RLC 電路與真實電容的例子"
    purpose: "用 tantalum、1206 10 µF 與 0402 1 nF 三個例子比較 q 值，說明低 ESR 為何讓共振更窄更高。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1986-L2056]]"
  - id: pdn-viewed-by-chip-or-board
    title: "從晶片看、從板子看的 PDN"
    purpose: "解釋同一組 package lead L 加 on-die C 為何從 die 看是 parallel peak、從 board 看是 series dip。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L2057-L2195]]"
created: 2026-10-30
updated: 2026-10-30
---

# 串並聯 RLC 的共振特性，與晶片／板子兩個視角

## Lesson

四個數字——fres、Z0 = √(L/C)、q = Z0/R、Zmin 或 Zmax——就能描述任何 RLC，而峰高約為 Z0 × q。這個 node 也處理最容易搞混的一件事：同一組 package lead inductance 加 on-die capacitance，從 die 看是 parallel peak，從 board 看是 series dip。

## Steps

1. [Series 與 parallel RLC 的共振特性](rlc-resonance-and-two-views/resonant-properties-of-rlc.md)
2. [RLC 電路與真實電容的例子](rlc-resonance-and-two-views/real-capacitor-rlc-examples.md)
3. [從晶片看、從板子看的 PDN](rlc-resonance-and-two-views/pdn-viewed-by-chip-or-board.md)
