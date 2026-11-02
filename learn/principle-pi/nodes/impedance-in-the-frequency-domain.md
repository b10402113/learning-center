---
id: impedance-in-the-frequency-domain
title: "頻域中的阻抗"
subject: principle-pi
tier: 1
order: 2
status: written
goal: "把 PDN 看成 Z(f)，用 1 A 交流電流源模擬阻抗，並分清理想元件與真實元件。"
digests:
  - pdn-principles.3.part.md
prerequisites: []
steps:
  - id: impedance-is-the-design-metric
    title: "為什麼我們在乎阻抗？"
    purpose: "能用「電流頻譜 × Z(f)」說明阻抗為何是 PDN 的驗收指標。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1265-L1312]]"
  - id: z-as-a-function-of-frequency
    title: "每十倍頻 20 dB"
    purpose: "能用 1/(jωC) 與 jωL 算出 |Z| 的斜率與相位，並說明為何畫 log-log。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1313-L1421]]"
  - id: simulating-z-with-a-1a-source
    title: "用 SPICE 做阻抗分析器的秘密：一個 1 A 定電流源"
    purpose: "能用 1 A 交流電流源把節點電壓讀成阻抗，並由斜率反推相位。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1422-L1515]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1516-L1583]]"
  - id: real-components-vs-ideal-elements
    title: "實際元件與理想電路元素"
    purpose: "能分辨理想元件的值與阻抗，並用 series RLC 解釋實測 MLCC 曲線。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1584-L1687]]"
  - id: the-impedance-matrix
    title: "阻抗矩陣"
    purpose: "能用 self 與 transfer impedance 描述多埠網路，並說明 Z12 代表耦合而非電阻。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L2305-L2400]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L2401-L2500]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L2501-L2592]]"
created: 2026-10-31
updated: 2026-11-01
---

# 頻域中的阻抗

## Lesson

阻抗是整個 PDN 設計的共同語言。這一篇把 Z(f) 的定義、模擬方法與理想元件／真實元件的差別釘死，讓後面的每一個 peak 都有同一個座標系。

## Steps

1. [為什麼我們在乎阻抗？](impedance-in-the-frequency-domain/impedance-is-the-design-metric.md)
2. [每十倍頻 20 dB](impedance-in-the-frequency-domain/z-as-a-function-of-frequency.md)
3. [用 SPICE 做阻抗分析器的秘密：一個 1 A 定電流源](impedance-in-the-frequency-domain/simulating-z-with-a-1a-source.md)
4. [實際元件與理想電路元素](impedance-in-the-frequency-domain/real-components-vs-ideal-elements.md)
5. [阻抗矩陣](impedance-in-the-frequency-domain/the-impedance-matrix.md)
