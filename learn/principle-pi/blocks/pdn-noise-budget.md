---
id: pdn-noise-budget
title: PDN 雜訊預算
label: PDN 雜訊預算
subject: principle-pi
type: concept
status: draft
summary: 接收端 15% 總雜訊裕度平均分給反射、串音與 PDN 三源，得出 5% 的 PDN 雜訊上限。
aliases: []
prerequisites: []
related: []
sources:
  - >-
    [[sources/principle-pi/20261111/course/Principles of power integrity for PDN
    design -- simplified robust and cost effective design for high speed digital
    products.4.part.txt#L102-L186]]
  - >-
    [[sources/principle-pi/20261111/course/Principles of power integrity for PDN
    design -- simplified robust and cost effective design for high speed digital
    products.4.part.txt#L382-L419]]
created: '2026-11-23'
updated: 2026-11-23
author: google/gemini-3.8-flash
---

# PDN 雜訊預算

## 定義

PDN 雜訊預算，是指晶片電源分配網路（PDN，從供電模組到晶片內部的整條供電路徑）所能允許的最大電壓波動上限。

在一般的數位系統中，業界最常看到的規格是將電源電壓雜訊控制在標稱電壓的 ±5% 以內。

## 為什麼重要

當晶片運作時，電壓如果忽高忽低，信號品質就會變差。

電源雜訊會壓扁訊號的眼高、推散時脈邊緣，並直接轉變成時序抖動（Jitter）。在常見情況下，每 1 毫伏特（mV）的電壓雜訊，就可能換來 1 皮秒（ps）的抖動。如果電壓雜訊超出容許範圍，運算就會出錯，甚至導致系統無預警當機。

## 如何運作

這個 5% 的限制並非憑空捏造，而是從接收端的總雜訊承受力推算出來的：

1. **總裕度為 15%**：在典型的單端 CMOS 數位電路中，信號接收端能容忍的整體雜訊裕度，大約是信號擺幅的 15%。
2. **三分法則**：在沒有其他特殊分配條件時，工程師會把這 15% 雜訊預算平均分給三個主要的雜訊來源：
   - 反射雜訊（Reflection noise）：分走 5%
   - 串音（Crosstalk）：分走 5%
   - PDN 雜訊（PDN noise）：分走 5%
3. **高頻涵蓋範圍**：這項 5% 的限制不僅在低頻或直流（DC）有效，還必須一路涵蓋到信號的高頻上限，現代系統通常高達 5 GHz 到 10 GHz。

晶片運作時，邏輯閘切換會抽取暫態電流。這些電流流經整個 PDN 的阻抗輪廓時，兩者相乘就會在晶片焊墊上引發電壓雜訊。只要雜訊總量不超過這 5% 的預算，系統就能穩定運作。

## 例子

在同一塊電路板上，硬體完全沒變，系統卻可能因為軟體微碼（microcode）的改變而突然當機：

- **正常運作**：執行原本的微碼時，邏輯閘切換產生的電流頻譜峰值剛好避開了 PDN 的阻抗高峰。兩者相乘後的電壓雜訊壓在 5% 以內，系統運作正常。
- **異常當機**：演算法經過微調後，邏輯閘切換頻率改變，電流頻譜峰值剛好移動並撞上 PDN 的共振阻抗峰。電流與高阻抗相乘，產生衝破 5% 預算的巨大雜訊，導致運算瞬間出錯。

## 邊界與常見誤解

常見的誤解是「所有電路都能適用 5% 規格」。

實際上，並非所有電路都適用 5% 的標準。對雜訊極度敏感的電路，例如類比數位轉換器（ADC）或鎖相迴路（PLL），電源雜訊通常必須嚴格壓在 1% 以下。

另一個常見誤解是「只要挑選輸出夠穩的電壓調節模組（VRM），雜訊就不會超標」。VRM 只能負責低頻段的穩定。當晶片內部以極高速度抽載電流時，電流流經封裝、通孔、電容與板端走線等整個 PDN 生態系統的阻抗，依然會在晶粒端產生嚴重的壓降與電壓彈跳。

## 進階

為了將雜訊嚴格控制在 5% 預算內，工程師會計算出「目標阻抗」（Target Impedance）。目標阻抗是在最差暫態電流條件下，仍能將電壓雜訊壓在容許範圍內的最大阻抗限值。

在評估設計風險時，常使用「PDN 比率」（PDN Ratio），也就是實際阻抗峰值與目標阻抗的比值。若 PDN 比率大於 10，代表實際阻抗遠高於安全標準，屬於極高風險的設計，極易耗盡雜訊預算而導致系統故障。
