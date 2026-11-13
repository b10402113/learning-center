---
id: why-impedance
title: "為何阻抗是 PDN 的核心指標"
subject: principle-pi
tier: 2
order: 4
status: written
goal: "在頻域用 V/I 與 jω 描述阻抗，並用 1 A AC 源模擬阻抗。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.md
prerequisites:
  - learn/principle-pi/nodes/sculpting-the-impedance.md
steps:
  - id: impedance-is-the-surrogate
    author: "google/gemini-3.8-flash"
    title: "為什麼阻抗曲線是 PDN 設計穩健性的替代指標"
    purpose: "能說明為何電流頻譜無法窮舉時，阻抗曲線可以當成 PDN 設計穩健性的替代指標。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L1-L47]]"
  - id: v-over-i-in-two-domains
    author: "google/gemini-3.8-flash"
    title: "阻抗在時域與頻域的定義，以及頻域化簡為 jω 的原因"
    purpose: "能說明阻抗在時域與頻域都是 V/I，以及為何只有頻域會簡化成 jω 的形式。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L48-L157]]"
  - id: one-amp-ac-source
    author: "google/gemini-3.8-flash"
    title: "用 1 A 交流源與 1 GΩ 電阻在 SPICE 中模擬網路阻抗"
    purpose: "能用 1 A 交流源加上 1 GΩ 直流回路，把任何線性網路的阻抗模擬成電壓。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L158-L245]]"
  - id: reading-the-log-log-curve
    author: "google/gemini-3.8-flash"
    title: "從對數阻抗圖的斜率看懂電路行為與相位"
    purpose: "能從對數阻抗圖的斜率讀出電容或電感行為，並由斜率反推相位。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L246-L319]]"
created: 2026-11-11
updated: 2026-11-13
---

# 為何阻抗是 PDN 的核心指標

## Lesson

阻抗在時域與頻域都只是 V/I，但只有在頻域才會簡化成 jω 的形式，這是整本書都用對數阻抗圖說話的原因。這一節也說明如何用一個 1 A 交流源把任何線性網路的阻抗直接量成電壓。

## Steps

1. [為什麼阻抗曲線是 PDN 設計穩健性的替代指標](why-impedance/impedance-is-the-surrogate.md)
2. [阻抗在時域與頻域的定義，以及頻域化簡為 jω 的原因](why-impedance/v-over-i-in-two-domains.md)
3. [用 1 A 交流源與 1 GΩ 電阻在 SPICE 中模擬網路阻抗](why-impedance/one-amp-ac-source.md)
4. [從對數阻抗圖的斜率看懂電路行為與相位](why-impedance/reading-the-log-log-curve.md)
