---
id: measurement-examples
title: "量測實例：導線迴路、via、MLCC 與 on-die 電容"
subject: principle-pi
tier: 3
order: 10
status: written
goal: "把 fixture 時延與損耗納入模型，從實測反推 R、L、ESR 與 on-die 電容。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.md
prerequisites:
  - learn/principle-pi/nodes/two-port-low-impedance.md
steps:
  - id: loop-fixture-artifacts
    author: "google/gemini-3.8-flash"
    title: "雙埠阻抗量測中的治具效應：拆解相位偏移帶來的假電阻"
    purpose: "解釋雙埠迴路為何 S11 失效、S21 乾淨，並用 R、L、Z0、TD 模型把 fixture 相位造成的假電阻拆開。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.txt#L990-L1208]]"
  - id: via-extraction
    author: "google/gemini-3.8-flash"
    title: "萃取貫孔的 R 與 L：雙埠量測模型與幾何估算驗證"
    purpose: "用同一套模型萃取 via 的 R 與 L，並用幾何估算檢查 0.7 mΩ 與 0.28 nH 是否合理。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.txt#L1209-L1324]]"
  - id: mounted-mlcc-esr-esl
    author: "google/gemini-3.8-flash"
    title: "從 X2Y 測試治具的 S21 萃取實裝 MLCC 的 ESR 與 ESL：為何安裝方式主導電感"
    purpose: "從 X2Y fixture 的 S21 反推實裝 MLCC 的 ESR 與 ESL，並說明安裝方式為何主導 ESL。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.txt#L1325-L1489]]"
  - id: on-die-capacitance
    author: "google/gemini-3.8-flash"
    title: "在 C4 Bump 上量測 On-Die 電容與串聯 RLC 擬合"
    purpose: "在 C4 bump 上量 on-die 電容，並用串聯 RLC 擬合出 81.5 nF、2 pH 與 70 mΩ。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.txt#L1490-L1646]]"
  - id: package-probing-and-pitfalls
    author: "google/gemini-3.8-flash"
    title: "封裝 PDN 的雙埠量測：探測邊界、轉移阻抗與治具效應解讀"
    purpose: "說明封裝探測的邊界、轉移阻抗造成的假低阻抗，以及雙埠量測必須連 fixture 一起解讀。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.6.part.txt#L1647-L1993]]"
created: 2026-11-11
updated: 2026-11-23
---

# 量測實例：導線迴路、via、MLCC 與 on-die 電容

## Lesson

同一條導線迴路用單埠量看起來電阻會隨頻率上升，用雙埠加 fixture 模型才發現那只是時延造成的假象。這一節用 via、實裝 MLCC 與 on-die 電容量測，示範如何把 fixture 一併放進模型再萃取參數。

## Steps

1. [雙埠阻抗量測中的治具效應：拆解相位偏移帶來的假電阻](measurement-examples/loop-fixture-artifacts.md)
2. [萃取貫孔的 R 與 L：雙埠量測模型與幾何估算驗證](measurement-examples/via-extraction.md)
3. [從 X2Y 測試治具的 S21 萃取實裝 MLCC 的 ESR 與 ESL：為何安裝方式主導電感](measurement-examples/mounted-mlcc-esr-esl.md)
4. [在 C4 Bump 上量測 On-Die 電容與串聯 RLC 擬合](measurement-examples/on-die-capacitance.md)
5. [封裝 PDN 的雙埠量測：探測邊界、轉移阻抗與治具效應解讀](measurement-examples/package-probing-and-pitfalls.md)
