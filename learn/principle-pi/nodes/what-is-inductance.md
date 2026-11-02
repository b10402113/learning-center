---
id: what-is-inductance
title: "電感是什麼：磁場、能量與 loop／partial 電感"
subject: principle-pi
tier: 2
order: 5
status: confirmed
goal: "用 L = ψ/I 與 U = ½LI² 說明電感只由幾何決定，並把它拆成內外電感與 partial self／mutual。"
digests:
  - pdn-principles.6.part.md
  - pdn-principles.7.part.md
prerequisites: []
steps:
  - id: inductance-is-rings-per-amp
    purpose: "用 L = ψ/I 說明電感是每安培圈出的磁力線，並指出它只由幾何決定。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4677-L4727]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4818-L4867]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4868-L4963]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4964-L5073]]"
  - id: field-density-and-stored-energy
    purpose: "分清 B 是磁通密度而非磁力線數，並用 U = ½LI² 把電感讀成儲能效率。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5330-L5451]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5452-L5594]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5595-L5715]]"
  - id: faraday-and-frequency
    purpose: "用 V = L dI/dt 與 Z = jωL 解釋 L 不隨頻率變、阻抗才變，並判斷何時可視為 lumped。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5074-L5174]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5175-L5263]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5264-L5329]]"
  - id: internal-external-and-skin-depth
    purpose: "分辨內電感與外電感，用 skin depth 說明高頻時 L 為何只剩幾何項。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5716-L5800]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5801-L5858]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5859-L5926]]"
  - id: partial-self-and-mutual
    purpose: "把 loop L 拆成 partial self 與 mutual，並用 L_loop = 2(L_self − M) 導出三條設計槓桿。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5927-L6028]]"
created: 2026-10-31
updated: 2026-11-01
---

# 電感是什麼：磁場、能量與 loop／partial 電感

## Lesson

電感不是課本上的符號，而是「每安培圈出多少磁力線」。這篇用 B 場、能量與 Maxwell 把 L = ψ/I 講成幾何問題，再拆成內外電感與 partial／mutual，為後面的估算鋪路。

## Steps

1. [inductance-is-rings-per-amp](what-is-inductance/inductance-is-rings-per-amp.md)
2. [field-density-and-stored-energy](what-is-inductance/field-density-and-stored-energy.md)
3. [faraday-and-frequency](what-is-inductance/faraday-and-frequency.md)
4. [internal-external-and-skin-depth](what-is-inductance/internal-external-and-skin-depth.md)
5. [partial-self-and-mutual](what-is-inductance/partial-self-and-mutual.md)
