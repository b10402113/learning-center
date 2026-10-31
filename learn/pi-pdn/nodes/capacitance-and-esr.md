---
id: capacitance-and-esr
title: "多少電容才夠，ESR 從哪裡來"
subject: pi-pdn
tier: 3
order: 8
status: written
goal: "從 Ztarget 與 VRM 頻率反推容值，並用 ESR 估計式與 controlled-ESR 的 q 值選零件。"
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
  - id: capacitance-from-target-impedance
    title: "多少電容才夠？"
    purpose: "從 Ztarget 與 VRM 上限頻率反推 bulk 容值，並用 I·Δt/ΔV 在時間域驗證同一個答案。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L7460-L7576]]"
  - id: real-capacitance-dielectric-and-bias
    title: "兩片導體，夾一層介電質"
    purpose: "用 Dk、面積與厚度估出板級電容，並說明 Class 1/2 與 voltage bias 如何讓標稱值失真。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L7316-L7378]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L7379-L7459]]"
  - id: esr-loss-mechanisms
    title: "ESR 是兩種損失加起來"
    purpose: "把 ESR 拆成 dielectric loss 與 current crowding，說明它為何隨頻率上升且零件間差三倍。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L7577-L7728]]"
  - id: esr-estimate-and-q
    title: "從規格表估 ESR"
    purpose: "用 ESR ≈ 0.32·C^-k 與 0.20·C^-k 估 ESR，並用 q = √(L/C)/ESR 判斷並聯後的阻尼。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L7729-L7809]]"
  - id: controlled-esr
    title: "Controlled-ESR 電容"
    purpose: "用 controlled-ESR 的 100 mΩ–1.2 Ω 與 q 2–4 壓平行共振峰，而不是追求單顆最低阻抗。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L7810-L7884]]"
created: 2026-10-30
updated: 2026-10-31
---

# 多少電容才夠，ESR 從哪裡來

## Lesson

容值不是「越大越好」，而是要在 VRM 放棄的頻段把阻抗壓在 target 以下，frequency domain 與 time domain 兩種推法給出同一個答案。這個 node 也把 ESR 從規格表上的單一數字，拆成 dielectric loss、current crowding 與 controlled-ESR 三種設計變數。

## Steps

1. [多少電容才夠？](capacitance-and-esr/capacitance-from-target-impedance.md)
2. [兩片導體，夾一層介電質](capacitance-and-esr/real-capacitance-dielectric-and-bias.md)
3. [ESR 是兩種損失加起來](capacitance-and-esr/esr-loss-mechanisms.md)
4. [從規格表估 ESR](capacitance-and-esr/esr-estimate-and-q.md)
5. [Controlled-ESR 電容](capacitance-and-esr/controlled-esr.md)
