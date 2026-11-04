---
id: planes-as-cavities
title: "平面的關鍵角色：parallel-plate C 與 spreading inductance"
subject: principle-pi
tier: 4
order: 9
status: confirmed
goal: "算出 cavity 的低頻電容、sheet inductance 與兩點間的 spreading L，說明厚度為何是第一階變數。"
digests:
  - pdn-principles.10.part.md
  - pdn-principles.11.part.md
prerequisites: []
steps:
  - id: cavity-capacitance-and-three-regions
    purpose: "能算出 cavity 的低頻電容並用 0.16 pF/inch 修正 fringe，說明它在哪個頻段只是一個集總電容。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L1-L34]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L35-L96]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L97-L139]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L140-L217]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L218-L262]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L263-L312]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L313-L369]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L370-L457]]"
  - id: sheet-inductance-of-a-narrow-cavity
    purpose: "用 Lsq = µ0·h 與 square 數算出窄 cavity 的迴路電感，並說出均勻電流假設失效的條件。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L458-L546]]"
  - id: spreading-inductance-and-thickness
    purpose: "推出 spreading L = (µ0h/2π)ln(D/d)，並說明介質厚度為何是壓低 cavity 阻抗的第一階變數。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L547-L631]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L632-L704]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L705-L789]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L790-L908]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L909-L1008]]"
  - id: cavity-series-lc-resonance
    purpose: "算出 spreading L 與 cavity 電容的 series 共振頻率，並說明 fres 只由直徑決定而非厚度。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L1009-L1156]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L1157-L1227]]"
  - id: two-point-spreading-inductance
    purpose: "算出兩點間的 spreading L（≈54 pH/mil × h），並說明間距與接觸直徑為何只是對數級變數。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L1228-L1309]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.10.part.txt#L1310-L1331]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.txt#L1-L218]]"
created: 2026-10-31
updated: 2026-11-04
---

# 平面的關鍵角色：parallel-plate C 與 spreading inductance

## Lesson

平面不是「理想的地」，而是一個有電容、有電感、會共振的 cavity。這篇先算低頻的 parallel-plate 與 fringe 電容，再算窄 cavity 的 loop L 與寬 cavity 的 spreading L。

## Steps

1. [cavity-capacitance-and-three-regions](planes-as-cavities/cavity-capacitance-and-three-regions.md)
2. [sheet-inductance-of-a-narrow-cavity](planes-as-cavities/sheet-inductance-of-a-narrow-cavity.md)
3. [spreading-inductance-and-thickness](planes-as-cavities/spreading-inductance-and-thickness.md)
4. [cavity-series-lc-resonance](planes-as-cavities/cavity-series-lc-resonance.md)
5. [two-point-spreading-inductance](planes-as-cavities/two-point-spreading-inductance.md)
