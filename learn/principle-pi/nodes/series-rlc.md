---
id: series-rlc
title: "真實元件與串聯 RLC"
subject: principle-pi
tier: 2
order: 5
status: written
goal: "用串聯 RLC 的三個區段解釋電容的實際阻抗曲線與自共振頻率。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.md
prerequisites:
  - learn/principle-pi/nodes/why-impedance.md
steps:
  - id: ideal-vs-real-elements
    author: "google/gemini-3.8-flash"
    title: "理想元件與真實電容的差別：為什麼 0603 MLCC 只在 3 MHz 以下像電容？"
    purpose: "能分辨模擬的理想元件與量到的真實電容，並指出 0603 MLCC 只在 3 MHz 以下還像理想電容。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L320-L344]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L345-L372]]"
  - id: series-rlc-model
    author: "google/gemini-3.8-flash"
    title: "用串聯 RLC 模型精準掌握 0603 MLCC 的實測阻抗"
    purpose: "能用一組 R、C、L 組成串聯 RLC，把 0603 MLCC 的實測阻抗從 3 MHz 一路追到 200 MHz。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L373-L402]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L403-L423]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L424-L459]]"
  - id: three-regions-and-srf
    author: "google/gemini-3.8-flash"
    title: "解讀串聯 RLC 阻抗曲線與計算自共振頻率"
    purpose: "能從電容、電阻、電感三區段讀出串聯 RLC 曲線，並用 1/(2π√(LC)) 算出 159 MHz 的自共振頻率。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L460-L471]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L472-L498]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L499-L513]]"
created: 2026-11-11
updated: 2026-11-13
---

# 真實元件與串聯 RLC

## Lesson

理想元件只存在於模擬器裡；一顆實裝 MLCC 的阻抗要一路追到自共振頻率之後才開始上升。這一節用串聯 RLC 的電容、電阻、電感三個區段，把「量到的曲線」與「模型」接起來。

## Steps

1. [理想元件與真實電容的差別：為什麼 0603 MLCC 只在 3 MHz 以下像電容？](series-rlc/ideal-vs-real-elements.md)
2. [用串聯 RLC 模型精準掌握 0603 MLCC 的實測阻抗](series-rlc/series-rlc-model.md)
3. [解讀串聯 RLC 阻抗曲線與計算自共振頻率](series-rlc/three-regions-and-srf.md)
