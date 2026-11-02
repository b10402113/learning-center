---
id: estimating-loop-inductance
title: "估算 loop inductance：從圓導線到經驗法則"
subject: principle-pi
tier: 2
order: 6
status: confirmed
goal: "用圓迴路、寬導體、均勻傳輸線與 25 nH/inch 經驗法則估出板級 loop L，並從 S-parameter 萃取。"
digests:
  - pdn-principles.7.part.md
prerequisites: []
steps:
  - id: exact-round-conductor-geometries
    purpose: "用同軸、雙圓柱與圓柱對平面三條封閉式估出 via pair 與導線的 loop L，並指出長度才是主導變數。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6029-L6121]]"
  - id: from-round-loop-to-25nh-per-inch
    purpose: "用圓迴路公式算出板級 loop L，並解釋面積與 Dk 為何無關、25 nH/inch 從何而來。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6122-L6227]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6575-L6629]]"
  - id: sheet-inductance-of-wide-conductors
    purpose: "用「每個 square 都一樣」的 sheet inductance 估平面對與寬導體，並說出 10:1 的失效邊界。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6228-L6348]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6349-L6413]]"
  - id: uniform-line-z0-times-td
    purpose: "用 L = Z0·TD 與 8.3 nH/inch 估均勻傳輸線，並在窄長與寬扁之間選對近似法。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6414-L6496]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6497-L6574]]"
  - id: extracting-loop-l-from-s-parameters
    purpose: "從 shorted via pair 的 S11 算出 Zin 與 loop L，並用 λ/20 判斷結果可信到幾 GHz。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6630-L6755]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6756-L6816]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6817-L6862]]"
created: 2026-10-31
updated: 2026-11-01
---

# 估算 loop inductance：從圓導線到經驗法則

## Lesson

有了物理定義，下一步是估得出數字。這篇把圓導線、圓迴路、寬導體與均勻傳輸線的近似法收斂成幾條可背的經驗法則，並示範如何從 S-parameter 反推 loop L。

## Steps

1. [exact-round-conductor-geometries](estimating-loop-inductance/exact-round-conductor-geometries.md)
2. [from-round-loop-to-25nh-per-inch](estimating-loop-inductance/from-round-loop-to-25nh-per-inch.md)
3. [sheet-inductance-of-wide-conductors](estimating-loop-inductance/sheet-inductance-of-wide-conductors.md)
4. [uniform-line-z0-times-td](estimating-loop-inductance/uniform-line-z0-times-td.md)
5. [extracting-loop-l-from-s-parameters](estimating-loop-inductance/extracting-loop-l-from-s-parameters.md)
