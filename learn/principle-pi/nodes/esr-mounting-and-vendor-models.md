---
id: esr-mounting-and-vendor-models
title: "ESR、mounting inductance 與 vendor 模型"
subject: principle-pi
tier: 3
order: 8
status: written
goal: "從 spec 估 ESR、拆解 via 與 trace 的 mounting L，並判斷 vendor S-parameter 模型可不可信。"
digests:
  - pdn-principles.8.part.md
  - pdn-principles.9.part.md
prerequisites: []
steps:
  - id: esr-two-loss-mechanisms
    title: "電容的 ESR 由兩個損耗機制組成"
    purpose: "解釋 ESR 為何是板極導體損與介電損的疊加，並說明它為什麼在 SRF 附近落到最低。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.8.part.txt#L697-L785]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.8.part.txt#L786-L848]]"
  - id: esr-and-q-from-capacitance
    title: "從規格表估算電容的 ESR"
    purpose: "從 datasheet 的標稱 C 估出 ESR 與 q，判斷阻尼夠不夠，不夠就改選 controlled-ESR 零件。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.8.part.txt#L849-L929]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.8.part.txt#L930-L1004]]"
  - id: mounting-inductance-budget
    title: "電容的安裝電感"
    purpose: "把 mounting loop 拆成 via pair、表面 trace 與電容本體三段，自己算出 0603 約 2 nH 的總量。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.8.part.txt#L1005-L1020]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.9.part.txt#L1-L32]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.9.part.txt#L33-L61]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.9.part.txt#L62-L130]]"
  - id: mounting-geometry-levers
    title: "降低電容 mounting 電感的五個設計旋鈕"
    purpose: "用短而寬的 trace、反向長寬比、X2Y 與多 via，把 mounting L 從 2 nH 壓到 0.5 nH 以下。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.9.part.txt#L131-L235]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.9.part.txt#L236-L302]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.9.part.txt#L1001-L1045]]"
  - id: vendor-model-trust
    title: "如何分析廠商提供的 S 參數模型"
    purpose: "判斷 vendor S-parameter 是 fixture 還是本體，並用 S11 自己萃出 C、ESL、ESR 驗證模型。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.9.part.txt#L303-L365]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.9.part.txt#L366-L420]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.9.part.txt#L421-L481]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.9.part.txt#L482-L544]]"
created: 2026-10-31
updated: 2026-11-03
---

# ESR、mounting inductance 與 vendor 模型

## Lesson

電容的 ESR 決定阻尼，mounting inductance 決定高頻還剩多少電容。這篇從 spec 估 ESR、拆解 via 與 trace 的迴路，最後教你判斷 vendor 的 S-parameter 模型能不能用。

## Steps

1. [電容的 ESR 由兩個損耗機制組成](esr-mounting-and-vendor-models/esr-two-loss-mechanisms.md)
2. [從規格表估算電容的 ESR](esr-mounting-and-vendor-models/esr-and-q-from-capacitance.md)
3. [電容的安裝電感](esr-mounting-and-vendor-models/mounting-inductance-budget.md)
4. [降低電容 mounting 電感的五個設計旋鈕](esr-mounting-and-vendor-models/mounting-geometry-levers.md)
5. [如何分析廠商提供的 S 參數模型](esr-mounting-and-vendor-models/vendor-model-trust.md)
