---
id: inductance-from-geometry
title: "從幾何估算迴路電感：圓迴路、sheet inductance 與經驗法則"
subject: pi-pdn
tier: 2
order: 6
status: written
goal: "用 25 nH/inch、8.3 nH/inch、32 pH/mil×h 估出板子與封裝的迴路電感。"
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
  - id: exact-round-geometries
    title: "均勻圓導體：只有三種幾何能精確算迴路電感"
    purpose: "寫出 coax、雙圓桿、圓桿對平面三種精確解，並用 twin-rod 公式估出 via pair 的 1.3 nH。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6029-L6121]]"
  - id: round-loop-approximation
    title: "圓迴路的迴路電感近似：每吋周長 25 nH"
    purpose: "用 a·ln(a/WR) 解釋圓迴路為何隨半徑乘 log 成長，並記住 25 nH/inch 的周長法則。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6122-L6227]]"
  - id: sheet-inductance
    title: "寬導體靠近時：sheet inductance 與數方格"
    purpose: "用 Lsq = µ0·h 與數方格估 plane pair 的迴路電感，並說出平行板近似何時失效。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6228-L6413]]"
  - id: transmission-line-approximation
    title: "均勻傳輸線近似與 25 nH/inch 經驗法則"
    purpose: "用 L = Z0 × TD 推出 50 Ω FR4 線的 8.3 nH/inch，並用 25 nH/inch 快速估窄導體。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6414-L6574]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6575-L6629]]"
  - id: s-parameter-extraction
    title: "用 3D solver 的 S-parameter 反抽迴路電感"
    purpose: "把 port 2 短路、由 S11 轉 Zin，用 Im(Z)/ω 反抽 loop L 並判斷準靜態極限。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L6630-L6816]]"
created: 2026-10-30
updated: 2026-10-30
---

# 從幾何估算迴路電感：圓迴路、sheet inductance 與經驗法則

## Lesson

這一篇把電感從公式變成可上手的估算：窄導線加遠方迴流約 25 nH/inch、FR4 裡任何 50 Ω 線約 8.3 nH/inch、plane pair 每平方 32 pH/mil × h。也會用 3D solver 的 S-parameter 反抽 loop L，作為之後量測與模擬對照的橋樑。

## Steps

1. [均勻圓導體：只有三種幾何能精確算迴路電感](inductance-from-geometry/exact-round-geometries.md)
2. [圓迴路的迴路電感近似：每吋周長 25 nH](inductance-from-geometry/round-loop-approximation.md)
3. [寬導體靠近時：sheet inductance 與數方格](inductance-from-geometry/sheet-inductance.md)
4. [均勻傳輸線近似與 25 nH/inch 經驗法則](inductance-from-geometry/transmission-line-approximation.md)
5. [用 3D solver 的 S-parameter 反抽迴路電感](inductance-from-geometry/s-parameter-extraction.md)
