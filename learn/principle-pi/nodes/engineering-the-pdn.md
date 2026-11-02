---
id: engineering-the-pdn
title: "電源傳輸網路的工程設計"
subject: principle-pi
tier: 1
order: 1
status: written
goal: "用 die 的 switching current 打在 PDN 阻抗上解釋 rail noise，說出 5% budget 與 target impedance 的來源。"
digests:
  - pdn-principles.1.part.md
  - pdn-principles.2.part.md
prerequisites: []
steps:
  - id: pdn-scope-and-the-eye
    title: "什麼是電源傳輸網路（PDN），我為什麼該在乎？"
    purpose: "說出 PDN 從 VRM 到 die 的範圍與三種角色，並用電壓雜訊解釋 eye 為何垂直與水平同時關閉。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L442-L493]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L838-L898]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L899-L938]]"
  - id: noise-is-current-spectrum-times-impedance
    title: "「能用」還是「Robust」的 PDN 設計"
    purpose: "用「transient current 頻譜 × 阻抗曲線」解釋同一片板子為何換 microcode 就超標，並說明 boot 測試過了不代表 robust。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L542-L592]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L976-L1023]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1024-L1055]]"
  - id: from-noise-budget-to-target-impedance
    title: "Target impedance：保證性能的最大允許阻抗"
    purpose: "從 15% 雜訊預算推出 5%，再用 ΔV/Imax 算出 target impedance，並解釋高頻 knee 為何讓它上升。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L939-L975]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1056-L1104]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1105-L1140]]"
  - id: pdn-ratio-and-sculpting-the-profile
    title: "雕塑 PDN 阻抗曲線"
    purpose: "用 PDN ratio 判斷風險與成本，並把阻抗曲線的每個特徵對回 ecology 裡的元素。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1141-L1183]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1184-L1218]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1219-L1256]]"
created: 2026-10-31
updated: 2026-11-01
---

# 電源傳輸網路的工程設計

## Lesson

這一篇先把 PDN 的範圍畫出來：從 VRM 到 die 的每一段互連，以及它為什麼會讓 eye 閉上。接著把「可接受的 noise」換算成一條 target impedance，並說明 robust 設計為何不能靠事後測試補救。

## Steps

1. [什麼是電源傳輸網路（PDN），我為什麼該在乎？](engineering-the-pdn/pdn-scope-and-the-eye.md)
2. [「能用」還是「Robust」的 PDN 設計](engineering-the-pdn/noise-is-current-spectrum-times-impedance.md)
3. [Target impedance：保證性能的最大允許阻抗](engineering-the-pdn/from-noise-budget-to-target-impedance.md)
4. [雕塑 PDN 阻抗曲線](engineering-the-pdn/pdn-ratio-and-sculpting-the-profile.md)
