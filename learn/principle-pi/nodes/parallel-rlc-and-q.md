---
id: parallel-rlc-and-q
title: "並聯 RLC、共振與 q 值"
subject: principle-pi
tier: 2
order: 6
status: written
goal: "從並聯 RLC 的峰值推出共振頻率、特性阻抗、q 與峰值阻抗。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.md
prerequisites:
  - learn/principle-pi/nodes/series-rlc.md
steps:
  - id: parallel-resonance-peak
    author: "google/gemini-3.8-flash"
    title: "並聯 RLC 電路的阻抗行為與並聯諧振頻率計算"
    purpose: "能說明並聯 RLC 為何在 DC 與高頻短路，並用 PRF 公式算出峰值頻率。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L514-L559]]"
  - id: four-figures-of-merit
    author: "google/gemini-3.8-flash"
    title: "並聯 RLC 電路的共振頻率、特性阻抗與峰值阻抗"
    purpose: "能算出並聯 RLC 的共振頻率與特性阻抗 Z0，並指出電阻決定峰值高度。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L560-L605]]"
  - id: q-factor-and-peak-height
    author: "google/gemini-3.8-flash"
    title: "從特性阻抗與 q-factor 掌握諧振峰形狀與阻抗峰值"
    purpose: "能用 q = Z0/R 與半功率頻寬判斷峰有多尖，並算出峰值阻抗。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L606-L721]]"
  - id: estimate-any-rlc-first
    author: "google/gemini-3.8-flash"
    title: "分析 RLC 電路的四項品質指標：從鉭質到 MLCC 電容的實務估算"
    purpose: "能在分析任何 RLC 前先估出四項品質指標，並用三顆實際電容驗算。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L722-L792]]"
created: 2026-11-11
updated: 2026-11-13
---

# 並聯 RLC、共振與 q 值

## Lesson

PDN 阻抗曲線上的每一個峰幾乎都是並聯共振，而峰高可以寫成特性阻抗乘上 q。這一節把四個品質指標——共振頻率、Z0、q、峰值——變成拿到任何 RLC 都先估一輪的反射動作。

## Steps

1. [並聯 RLC 電路的阻抗行為與並聯諧振頻率計算](parallel-rlc-and-q/parallel-resonance-peak.md)
2. [並聯 RLC 電路的共振頻率、特性阻抗與峰值阻抗](parallel-rlc-and-q/four-figures-of-merit.md)
3. [從特性阻抗與 q-factor 掌握諧振峰形狀與阻抗峰值](parallel-rlc-and-q/q-factor-and-peak-height.md)
4. [分析 RLC 電路的四項品質指標：從鉭質到 MLCC 電容的實務估算](parallel-rlc-and-q/estimate-any-rlc-first.md)
