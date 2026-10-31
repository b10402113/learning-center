---
id: mounting-inductance-and-vendor-models
title: "電容的 mounting inductance 與原廠 S-parameter 模型"
subject: pi-pdn
tier: 3
order: 9
status: written
goal: "把 2 nH 的 mounted L 拆成 trace/body/via/spreading，用五個槓桿壓到 sub-0.5 nH，並避開 vendor 檔案的陷阱。"
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
  - id: mounted-esl-decomposition
    title: "電容的 mounting inductance"
    purpose: "能把 2 nH 的 mounted L 拆成 via loop、body、trace 與 spreading，並算出各段貢獻。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L7885-L7937]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L7938-L7961]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L7962-L7990]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L7991-L8035]]"
  - id: five-knobs-and-low-esl-structures
    title: "降低 mounting inductance 的五個設計槓桿"
    purpose: "能用五個槓桿與 X2Y／via-in-pad 把 mounted L 從 2 nH 壓到 0.2 nH。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8036-L8051]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8052-L8108]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8109-L8136]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8137-L8202]]"
  - id: vendor-s-parameter-traps
    title: "使用原廠提供的 S-parameter 電容模型"
    purpose: "能認出 vendor S-parameter 的 fixture 歸屬、被修正或標錯的檔案，並判斷何時不能直接用。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8203-L8265]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8266-L8320]]"
  - id: rlc-extraction-recipe
    title: "如何分析原廠的 S-parameter 模型"
    purpose: "能把 S11 轉成 Z(f)，抽出 C、ESL、ESR，並說出扁平 ESR 擬合在高頻為何失真。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8321-L8382]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8383-L8444]]"
  - id: sub-nh-distributed-model
    title: "更高頻寬的電容模型"
    purpose: "能解釋 ESL 低於 1 nH 時的分散式傳輸線行為、quarter-wave 共振與探測位置的陷阱。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8445-L8520]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8521-L8557]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8558-L8604]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8605-L8671]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8672-L8740]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8741-L8781]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8782-L8818]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8819-L8838]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8839-L8900]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L8901-L8945]]"
created: 2026-10-30
updated: 2026-10-31
---

# 電容的 mounting inductance 與原廠 S-parameter 模型

## Lesson

決定電容成敗的不是容值，而是它被裝上去之後的 loop inductance；一個常規 0603 在 10 mil cavity 上大約就是 2 nH。這個 node 逐項拆解 surface trace、body、via 與 spreading 的貢獻，並說明 vendor S-parameter 檔案的 fixture 陷阱與如何抽出可用的 RLC。

## Steps

1. [電容的 mounting inductance](mounting-inductance-and-vendor-models/mounted-esl-decomposition.md)
2. [降低 mounting inductance 的五個設計槓桿](mounting-inductance-and-vendor-models/five-knobs-and-low-esl-structures.md)
3. [使用原廠提供的 S-parameter 電容模型](mounting-inductance-and-vendor-models/vendor-s-parameter-traps.md)
4. [如何分析原廠的 S-parameter 模型](mounting-inductance-and-vendor-models/rlc-extraction-recipe.md)
5. [更高頻寬的電容模型](mounting-inductance-and-vendor-models/sub-nh-distributed-model.md)
