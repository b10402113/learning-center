---
id: impedance-fundamentals
title: "PDN 設計的阻抗基本原理"
subject: pi-pdn
tier: 1
order: 2
status: written
goal: "能把 PDN 看成 Z(f)、用 1 A 電流源模擬阻抗，並分出演算 series RLC 的谷與 parallel RLC 的峰。"
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
  - id: why-impedance-matters
    title: "為什麼要在乎阻抗？"
    purpose: "用「電流頻譜 × 阻抗」解釋 rail noise，並說明阻抗曲線為何能取代未知的電流頻譜成為驗收標準"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1265-L1312]]"
  - id: impedance-in-the-frequency-domain
    title: "頻率域的阻抗"
    purpose: "寫出電容 1/(jωC) 與電感 jωL，並在 log-log 圖上讀出 −20 與 +20 dB/decade 的斜率"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1313-L1421]]"
  - id: calculating-or-simulating-impedance
    title: "計算或模擬阻抗"
    purpose: "用 1 A AC 電流源架出 impedance analyzer，讓模擬的輸出電壓直接讀成歐姆"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1422-L1583]]"
  - id: real-components-vs-ideal-elements
    title: "真實元件與理想元件"
    purpose: "說明真實電容為何要加寄生元件，並用 series RLC 的 R、C、L 三個數字對上量測曲線"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1584-L1687]]"
  - id: series-dip-and-parallel-peak
    title: "串聯 RLC 的谷與並聯 RLC 的峰"
    purpose: "從阻抗曲線認出 series RLC 的谷與 parallel RLC 的峰，並說出各自由哪個元素主導"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1688-L1777]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1778-L1824]]"
created: 2026-10-30
updated: 2026-10-30
---

# PDN 設計的阻抗基本原理

## Lesson

在不知道電流頻譜的情況下，阻抗曲線就是替代的驗收標準。這個 node 建立頻率域的阻抗語言：電容是 1/(jωC)、電感是 jωL、log-log 圖上 ±20 dB/decade，並用 1 A AC 電流源讓輸出電壓直接讀成歐姆。

## Steps

1. [為什麼要在乎阻抗？](impedance-fundamentals/why-impedance-matters.md)
2. [頻率域的阻抗](impedance-fundamentals/impedance-in-the-frequency-domain.md)
3. [計算或模擬阻抗](impedance-fundamentals/calculating-or-simulating-impedance.md)
4. [真實元件與理想元件](impedance-fundamentals/real-components-vs-ideal-elements.md)
5. [串聯 RLC 的谷與並聯 RLC 的峰](impedance-fundamentals/series-dip-and-parallel-peak.md)
