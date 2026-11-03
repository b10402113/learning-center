---
id: real-capacitor-and-parallel-resonance
title: "真實電容的 series RLC 與 parallel resonance"
subject: principle-pi
tier: 3
order: 7
status: written
goal: "用 series RLC 描述 mounted MLCC，算出 PRF 與 peak impedance，並用值域重疊把峰壓低。"
digests:
  - pdn-principles.8.part.md
prerequisites: []
steps:
  - id: series-rlc-model
    title: "真實電容的等效電路模型"
    purpose: "用 series RLC 說明 mounted MLCC 在 Z(f) 上的谷，並指出 C、ESL、ESR 分別決定哪一段。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.8.part.txt#L4-L45]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.8.part.txt#L46-L105]]"
  - id: identical-caps-in-parallel
    title: "多顆同值電容並聯：阻抗縮小，SRF 與 q 不變"
    purpose: "算出 n 顆同值電容並聯的 Cn、Ln、Rn，並解釋為何 SRF 與 q 不變、阻抗降 n 倍。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.8.part.txt#L106-L174]]"
  - id: parallel-resonance-prf
    title: "兩顆不同電容之間的並聯共振頻率"
    purpose: "用 X1 = X2 推出 PRF，並在兩顆不同值電容的曲線上指出新長出來的那個峰。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.8.part.txt#L175-L269]]"
  - id: peak-impedance-and-value-overlap
    title: "PRF 處的峰值阻抗"
    purpose: "用 Zpeak 的三個槓桿與值域重疊（兩倍內、每 decade 三個值）把平行峰壓到 Ztarget 以下。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.8.part.txt#L270-L357]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.8.part.txt#L358-L435]]"
created: 2026-10-31
updated: 2026-11-03
---

# 真實電容的 series RLC 與 parallel resonance

## Lesson

真實電容只在低頻像電容，往上是 series RLC，兩顆不同值並聯還會長出一個新的峰。這篇把 SRF、PRF 與 peak impedance 的公式接到實際選值上。

## Steps

1. [真實電容的等效電路模型](real-capacitor-and-parallel-resonance/series-rlc-model.md)
2. [多顆同值電容並聯：阻抗縮小，SRF 與 q 不變](real-capacitor-and-parallel-resonance/identical-caps-in-parallel.md)
3. [兩顆不同電容之間的並聯共振頻率](real-capacitor-and-parallel-resonance/parallel-resonance-prf.md)
4. [PRF 處的峰值阻抗](real-capacitor-and-parallel-resonance/peak-impedance-and-value-overlap.md)
