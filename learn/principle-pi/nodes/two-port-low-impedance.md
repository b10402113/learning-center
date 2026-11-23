---
id: two-port-low-impedance
title: "單埠極限、四點 Kelvin 與雙埠低阻抗"
subject: principle-pi
tier: 3
order: 9
status: written
goal: "解釋為何單埠在 0.1 Ω 以下失效，並用雙埠 Kelvin 取得 Z ≈ 25 Ω × S21。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.md
prerequisites:
  - learn/principle-pi/nodes/measuring-impedance.md
steps:
  - id: one-port-ceiling
    author: "google/gemini-3.8-flash"
    title: "單埠 VNA 量測低阻抗的物理極限：訊雜比、治具相位與探針接觸地板"
    purpose: "說明為何 |S11| 在 0.1 Ω 以下失去解析度，並指出 fixture 相位與探針接觸把單埠地板壓在 0.05 Ω、0.1 nH。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.txt#L558-L620]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.txt#L621-L676]]"
  - id: four-point-kelvin
    author: "google/gemini-3.8-flash"
    title: "為什麼量小電阻不能只用兩條線：接觸電阻與四線 Kelvin 量測法"
    purpose: "用接觸電阻的收縮效應解釋兩線量測為何失準，並說明四線 Kelvin 如何排除感測引線的接觸阻抗。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.txt#L677-L758]]"
  - id: two-port-kelvin
    author: "google/gemini-3.8-flash"
    title: "雙埠低阻抗量測原理：從電流分工到 S21 退化為 Z/25 Ω 的推導"
    purpose: "說明雙埠如何分工攜帶電流與感測電壓，並推導低阻抗下 S21 退化成 Z/25 Ω 的原因。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.txt#L759-L830]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.txt#L897-L950]]"
  - id: s21-to-impedance
    author: "google/gemini-3.8-flash"
    title: "將 S21 換算為阻抗與 dBΩ：一階近似極限與雜訊地板解析"
    purpose: "把 S21 換算成阻抗與 dBΩ，並說出 Z ≈ 25 Ω × S21 何時失效、雜訊地板在哪。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.txt#L831-L896]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.txt#L951-L989]]"
created: 2026-11-11
updated: 2026-11-23
---

# 單埠極限、四點 Kelvin 與雙埠低阻抗

## Lesson

當阻抗掉到 0.1 Ω 以下，S11 幾乎貼在 −1，單埠量測就失去解析度。這一節把 Kelvin 分離電流與感測引線的老方法搬到高頻，得到一條 Z ≈ 25 Ω × S21 的實用公式，也提醒它何時會失效。

## Steps

1. [單埠 VNA 量測低阻抗的物理極限：訊雜比、治具相位與探針接觸地板](two-port-low-impedance/one-port-ceiling.md)
2. [為什麼量小電阻不能只用兩條線：接觸電阻與四線 Kelvin 量測法](two-port-low-impedance/four-point-kelvin.md)
3. [雙埠低阻抗量測原理：從電流分工到 S21 退化為 Z/25 Ω 的推導](two-port-low-impedance/two-port-kelvin.md)
4. [將 S21 換算為阻抗與 dBΩ：一階近似極限與雜訊地板解析](two-port-low-impedance/s21-to-impedance.md)
