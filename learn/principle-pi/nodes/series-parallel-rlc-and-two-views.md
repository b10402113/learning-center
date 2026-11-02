---
id: series-parallel-rlc-and-two-views
title: "Series／parallel RLC 與晶片／板子兩個視角"
subject: principle-pi
tier: 1
order: 3
status: written
goal: "對任何阻抗峰說出 fres、Z0、q，並解釋同一結構為何從 die 看是峰、從 board 看是谷。"
digests:
  - pdn-principles.3.part.md
prerequisites: []
steps:
  - id: series-rlc-dip
    title: "串聯 RLC 電路：低頻只由電容決定，高頻只由電感決定"
    purpose: "從 Z(f) 的谷反推 series RLC 的 fres 與 Z0，並說出哪個元件決定低頻與高頻兩端。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1688-L1777]]"
  - id: parallel-rlc-peak
    title: "阻抗曲線上的峰，幾乎都是並聯 RLC 電路"
    purpose: "從 Z(f) 的峰反推 parallel RLC 的 PRF，並解釋為何阻抗曲線上的峰幾乎都是 parallel RLC。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1778-L1824]]"
  - id: q-and-figures-of-merit
    title: "每個 RLC 電路都有四個重要的 figures of merit"
    purpose: "算出 fres、Z0、q 與 Zmin／Zmax，並用 q 判斷阻尼要加到多少。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1825-L1935]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1936-L1985]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1986-L2056]]"
  - id: die-vs-board-two-views
    title: "從板子看是谷，從 die 看是峰"
    purpose: "用同一組 L、C、R 解釋 board 看到谷、die 看到峰，並把兩個 R 合成 R_eq。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L2057-L2157]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L2158-L2195]]"
  - id: ringing-fingerprints-the-peak
    title: "Ringing 電壓雜訊是阻抗峰的跡象"
    purpose: "用上升時間與 ringing 週期判斷電流會激發哪個峰，並說明振幅與頻率各由誰決定。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L2196-L2260]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L2261-L2304]]"
created: 2026-10-31
updated: 2026-11-01
---

# Series／parallel RLC 與晶片／板子兩個視角

## Lesson

同一組 L、C、R 從 board 看是 series 的谷，從 die 看是 parallel 的峰。這篇把 fres、Z0、q 與暫態 droop 接起來，建立「看到曲線就能反推元素」的習慣。

## Steps

1. [串聯 RLC 電路：低頻只由電容決定，高頻只由電感決定](series-parallel-rlc-and-two-views/series-rlc-dip.md)
2. [阻抗曲線上的峰，幾乎都是並聯 RLC 電路](series-parallel-rlc-and-two-views/parallel-rlc-peak.md)
3. [每個 RLC 電路都有四個重要的 figures of merit](series-parallel-rlc-and-two-views/q-and-figures-of-merit.md)
4. [從板子看是谷，從 die 看是峰](series-parallel-rlc-and-two-views/die-vs-board-two-views.md)
5. [Ringing 電壓雜訊是阻抗峰的跡象](series-parallel-rlc-and-two-views/ringing-fingerprints-the-peak.md)
