---
id: loop-and-partial-inductance
title: "迴路電感與部分電感、自感與互感"
subject: pi-pdn
tier: 2
order: 5
status: written
goal: "把 loop L 拆成 partial self/mutual 逐段設計，並說明 skin depth 為何讓內電感消失。"
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
  - id: maxwell-and-loop-inductance
    title: "Maxwell 方程式與迴路電感"
    purpose: "用閉合迴路的 B 表面積分定義 loop L，並說出為何開路片段沒有唯一電感。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5595-L5715]]"
  - id: partial-self-and-mutual-inductance
    title: "部分自感與部分互感：逐段設計迴路電感"
    purpose: "把 loop L = 2(Lself − M) 拆成逐段項，並用縮短、加寬、拉近 return path 三個槓桿降低它。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5927-L6028]]"
  - id: internal-external-inductance-and-skin-depth
    title: "內電感、外電感與 skin depth"
    purpose: "用 skin depth 說明內電感為何在高頻消失，只剩幾何決定的外電感主導。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L5716-L5926]]"
created: 2026-10-30
updated: 2026-10-30
---

# 迴路電感與部分電感、自感與互感

## Lesson

只有閉合迴路才讓電感有明確定義，但工程上需要逐段設計，於是把 loop L 拆成 partial self 與 partial mutual。這個 node 也用 skin depth 解釋為什麼內電感在高頻消失、只剩幾何決定的外電感。

## Steps

1. [Maxwell 方程式與迴路電感](loop-and-partial-inductance/maxwell-and-loop-inductance.md)
2. [部分自感與部分互感：逐段設計迴路電感](loop-and-partial-inductance/partial-self-and-mutual-inductance.md)
3. [內電感、外電感與 skin depth](loop-and-partial-inductance/internal-external-inductance-and-skin-depth.md)
