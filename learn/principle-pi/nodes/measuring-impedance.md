---
id: measuring-impedance
title: 用 V/I 與反射法量測阻抗
subject: principle-pi
tier: 3
order: 8
status: written
goal: 用 VNA 的 S11 與 50 Ω 校正把反射係數換成元件阻抗。
digests:
  - >-
    Principles of power integrity for PDN design -- simplified robust and cost
    effective design for high speed digital products.6.part.md
prerequisites:
  - learn/principle-pi/nodes/why-impedance.md
steps:
  - id: why-measure-low-impedance
    author: google/gemini-3.8-flash
    title: 為什麼要量測低阻抗？從量測的三大目的到 V/I 定義的頻率極限
    purpose: 能說出量測阻抗的三個目的，並解釋 V/I 定義為何在 100 MHz 以上開始不划算。
    sources:
      - >-
        [[sources/principle-pi/20261111/course/Principles of power integrity for
        PDN design -- simplified robust and cost effective design for high speed
        digital products.6.part.txt#L1-L66]]
    blocks:
      - vi-impedance-definition
  - id: impedance-from-reflection
    author: google/gemini-3.8-flash
    title: 從信號反射推導待測物阻抗：反射係數在時域與頻域的物理意義
    purpose: 能從反射係數把入射與反射電壓換成待測物阻抗，並說明此定義為何在頻域仍成立。
    sources:
      - >-
        [[sources/principle-pi/20261111/course/Principles of power integrity for
        PDN design -- simplified robust and cost effective design for high speed
        digital products.6.part.txt#L67-L130]]
      - >-
        [[sources/principle-pi/20261111/course/Principles of power integrity for
        PDN design -- simplified robust and cost effective design for high speed
        digital products.6.part.txt#L131-L180]]
      - >-
        [[sources/principle-pi/20261111/course/Principles of power integrity for
        PDN design -- simplified robust and cost effective design for high speed
        digital products.6.part.txt#L181-L231]]
    blocks:
      - reflection-coefficient
      - vector-network-analyzer
  - id: vna-and-s11
    author: google/gemini-3.8-flash
    title: 用 VNA 與 S11 量測阻抗：從 50 Ω 校正、分離波形到阻抗轉換
    purpose: 能說明 VNA 如何用 50 Ω 校正與 S11 分離入射、反射波，並換出待測物阻抗。
    sources:
      - >-
        [[sources/principle-pi/20261111/course/Principles of power integrity for
        PDN design -- simplified robust and cost effective design for high speed
        digital products.6.part.txt#L232-L298]]
      - >-
        [[sources/principle-pi/20261111/course/Principles of power integrity for
        PDN design -- simplified robust and cost effective design for high speed
        digital products.6.part.txt#L299-L374]]
    blocks:
      - vi-impedance-definition
      - reflection-coefficient
      - s-parameter
      - vector-network-analyzer
  - id: dip-leads-first-conversion
    author: google/gemini-3.8-flash
    title: 從 DIP 接腳的 S11 換算阻抗：為什麼關鍵資訊全在相位裡？
    purpose: 能把 DIP 接腳的 S11 逐頻換成阻抗，並說明為何阻抗資訊幾乎全在 S11 的相位裡。
    sources:
      - >-
        [[sources/principle-pi/20261111/course/Principles of power integrity for
        PDN design -- simplified robust and cost effective design for high speed
        digital products.6.part.txt#L375-L430]]
      - >-
        [[sources/principle-pi/20261111/course/Principles of power integrity for
        PDN design -- simplified robust and cost effective design for high speed
        digital products.6.part.txt#L431-L472]]
    blocks:
      - reflection-coefficient
      - s-parameter
      - vector-network-analyzer
      - measurement-based-modeling
  - id: wire-loop-one-port
    author: google/gemini-3.8-flash
    title: 以單埠 VNA 量測 1 吋銅迴路阻抗：預期 R+L 行為與反推參數
    purpose: 能預期 1 吋銅迴路在 400 MHz 以下的 R+L 行為，並從實測反推 R 與 L。
    sources:
      - >-
        [[sources/principle-pi/20261111/course/Principles of power integrity for
        PDN design -- simplified robust and cost effective design for high speed
        digital products.6.part.txt#L473-L557]]
    blocks:
      - reflection-coefficient
      - s-parameter
      - vector-network-analyzer
      - measurement-based-modeling
created: 2026-11-11T00:00:00.000Z
updated: 2026-11-23T00:00:00.000Z
---

# 用 V/I 與反射法量測阻抗

## Lesson

量測阻抗有兩條定義：直接量 V 與 I，或量反射波的比例；前者在 100 MHz 以上開始不划算。這一節從 VNA 如何分離入射與反射說起，把 S11 換成待測物的阻抗。

## Steps

1. [為什麼要量測低阻抗？從量測的三大目的到 V/I 定義的頻率極限](measuring-impedance/why-measure-low-impedance.md)
2. [從信號反射推導待測物阻抗：反射係數在時域與頻域的物理意義](measuring-impedance/impedance-from-reflection.md)
3. [用 VNA 與 S11 量測阻抗：從 50 Ω 校正、分離波形到阻抗轉換](measuring-impedance/vna-and-s11.md)
4. [從 DIP 接腳的 S11 換算阻抗：為什麼關鍵資訊全在相位裡？](measuring-impedance/dip-leads-first-conversion.md)
5. [以單埠 VNA 量測 1 吋銅迴路阻抗：預期 R+L 行為與反推參數](measuring-impedance/wire-loop-one-port.md)
