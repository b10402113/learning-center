---
id: cavity-resonance-and-capacitor-interaction
title: "電容與 cavity 的互動，及 cavity modal resonance"
subject: principle-pi
tier: 4
order: 10
status: confirmed
goal: "算出 cavity 自共振與電容–cavity 平行峰，並說明 modal resonance 何時與 die 電源無關。"
digests:
  - pdn-principles.11.part.md
prerequisites: []
steps:
  - id: cap-cavity-parallel-peak
    purpose: "能用 L_mount 與 C_cavity 算出電容–cavity 平行峰，並說出 ~10 MHz 與 ~100 MHz 兩個谷各由誰造成。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.txt#L219-L287]]"
  - id: when-cap-location-matters
    purpose: "能用 L_spread 與 L_mount 的比較判斷電容位置重不重要，並用 h ≈ 10 mil 的門檻說明 cavity 何時透明。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.txt#L288-L362]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.txt#L363-L465]]"
  - id: saturating-the-spreading-inductance
    purpose: "能用環模型算出 spreading inductance 的飽和值，並說出多放電容為何買不到更低的 L。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.txt#L466-L541]]"
  - id: modal-resonances-as-a-transmission-line
    purpose: "能用 f_n = n·v/(2Len) 算出模態頻率，並說明頻率內在、峰高只由損耗與阻抗失配決定。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.txt#L542-L662]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.txt#L663-L714]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.txt#L715-L791]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.txt#L792-L937]]"
  - id: two-dimensional-modes-and-transfer-impedance
    purpose: "能用 f_mn 算出方形 cavity 的模態，並用激發點與 transfer impedance 判斷哪些峰與 die 電源無關。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.txt#L938-L1030]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.txt#L1031-L1108]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.txt#L1109-L1221]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.txt#L1222-L1336]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.txt#L1337-L1367]]"
created: 2026-10-31
updated: 2026-11-04
---

# 電容與 cavity 的互動，及 cavity modal resonance

## Lesson

電容擺在 cavity 上會改變共振，cavity 自己也有 modal resonance。這篇區分「對 die 電源重要」與「只對 SI／EMC 重要」的峰，並說明 spreading inductance 何時飽和。

## Steps

1. [cap-cavity-parallel-peak](cavity-resonance-and-capacitor-interaction/cap-cavity-parallel-peak.md)
2. [when-cap-location-matters](cavity-resonance-and-capacitor-interaction/when-cap-location-matters.md)
3. [saturating-the-spreading-inductance](cavity-resonance-and-capacitor-interaction/saturating-the-spreading-inductance.md)
4. [modal-resonances-as-a-transmission-line](cavity-resonance-and-capacitor-interaction/modal-resonances-as-a-transmission-line.md)
5. [two-dimensional-modes-and-transfer-impedance](cavity-resonance-and-capacitor-interaction/two-dimensional-modes-and-transfer-impedance.md)
