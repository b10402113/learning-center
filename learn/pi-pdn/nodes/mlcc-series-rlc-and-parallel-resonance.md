---
id: mlcc-series-rlc-and-parallel-resonance
title: "實用 MLCC：series RLC、並聯與兩顆電容之間的 PRF"
subject: pi-pdn
tier: 3
order: 7
status: written
goal: "用三元件 RLC 解釋 MLCC 的谷與峰，並說明兩顆不同容值為何在中間生出一個 parallel peak。"
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
  - id: series-rlc-model-of-a-cap
    title: "一顆 MLCC，就三個理想元件"
    purpose: "用 ideal 1/ωC 與 mounted ESL 在 1 MHz 以上把一顆 MLCC 化成一組 series RLC，並指出谷底就是 ESR。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6881-L6925]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6926-L6985]]"
  - id: identical-caps-in-parallel
    title: "n 顆相同電容：整條曲線往下搬"
    purpose: "說明 n 顆相同電容並聯如何把 C 乘 n、L 與 R 除以 n，而 SRF 與 q 不變。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6986-L7054]]"
  - id: parallel-resonance-between-two-caps
    title: "兩個 SRF 之間的那個峰"
    purpose: "用 X1 = X2 推出兩顆不同容值電容之間的 PRF，並解釋峰兩側的低頻 C 和與高頻 L 並聯。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L7055-L7149]]"
  - id: damping-the-parallel-peak
    title: "壓低 parallel peak 的三個旋鈕"
    purpose: "說出容值比、mounting ESL、ESR 三個旋鈕如何壓低 parallel peak，並判斷哪個最有效。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L7150-L7315]]"
created: 2026-10-30
updated: 2026-10-31
---

# 實用 MLCC：series RLC、並聯與兩顆電容之間的 PRF

## Lesson

一顆真實 MLCC 在實用頻段內就是 series RLC：低頻由 C 決定、高頻由 ESL 決定、SRF 處最低是 ESR。這個 node 的轉折點是「兩顆不同容值的電容並聯會生出 parallel peak」，這也是之後所有 MLCC 選值爭論的根源。

## Steps

1. [一顆 MLCC，就三個理想元件](mlcc-series-rlc-and-parallel-resonance/series-rlc-model-of-a-cap.md)
2. [n 顆相同電容：整條曲線往下搬](mlcc-series-rlc-and-parallel-resonance/identical-caps-in-parallel.md)
3. [兩個 SRF 之間的那個峰](mlcc-series-rlc-and-parallel-resonance/parallel-resonance-between-two-caps.md)
4. [壓低 parallel peak 的三個旋鈕](mlcc-series-rlc-and-parallel-resonance/damping-the-parallel-peak.md)
