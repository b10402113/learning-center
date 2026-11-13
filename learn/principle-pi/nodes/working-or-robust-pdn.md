---
id: working-or-robust-pdn
title: "「能動」的 PDN 與「穩健」的 PDN"
subject: principle-pi
tier: 1
order: 2
status: written
goal: "用 target impedance 與 PDN ratio 判斷設計風險，而不是只看能不能跑。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.md
prerequisites:
  - learn/principle-pi/nodes/what-is-a-pdn.md
steps:
  - id: works-is-not-robust
    author: "google/gemini-3.8-flash"
    title: "能開機不等於穩健：微碼與軟體如何改變電流頻譜並影響 PDN 設計"
    purpose: "說明為何通過開機或測試程式不代表穩健，並指出微碼如何改變電流頻譜。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L163-L213]]"
  - id: target-impedance
    author: "google/gemini-3.8-flash"
    title: "目標阻抗的計算與適用邊界"
    purpose: "能用 ΔVnoise 除以最大暫態電流算出 target impedance，並知道它的適用邊界。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L214-L245]]"
  - id: fully-robust-profile
    author: "google/gemini-3.8-flash"
    title: "從全頻段壓制到高頻放寬：PDN 目標阻抗設計"
    purpose: "能畫出全頻段低於 target 的阻抗曲線，並解釋電流滾降為何讓高頻 target 放寬。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L246-L303]]"
  - id: pdn-ratio-and-cost
    author: "google/gemini-3.8-flash"
    title: "以 PDN Ratio 評估電源設計風險與餘裕拿捏"
    purpose: "能用 PDN ratio 分級風險，並依產品類型決定該買多少餘裕。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L304-L346]]"
created: 2026-11-11
updated: 2026-11-13
---

# 「能動」的 PDN 與「穩健」的 PDN

## Lesson

把雜訊預算換成可計算的 target impedance，再用 PDN ratio 把「實際峰值」與「目標」放在同一個尺度上比較。這條線把測試台上能跑與真正穩健之間的差距，變成一組可以取捨的成本與風險。

## Steps

1. [能開機不等於穩健：微碼與軟體如何改變電流頻譜並影響 PDN 設計](working-or-robust-pdn/works-is-not-robust.md)
2. [目標阻抗的計算與適用邊界](working-or-robust-pdn/target-impedance.md)
3. [從全頻段壓制到高頻放寬：PDN 目標阻抗設計](working-or-robust-pdn/fully-robust-profile.md)
4. [以 PDN Ratio 評估電源設計風險與餘裕拿捏](working-or-robust-pdn/pdn-ratio-and-cost.md)
