---
id: sculpting-the-impedance
title: "雕塑 PDN 阻抗曲線"
subject: principle-pi
tier: 1
order: 3
status: written
goal: "說出各元件各管哪段頻率，以及為什麼工作發生在它們的交界處。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.md
prerequisites:
  - learn/principle-pi/nodes/working-or-robust-pdn.md
steps:
  - id: impedance-profile-as-terrain
    author: "google/gemini-3.8-flash"
    title: "雕塑從 DC 到高頻的 PDN 阻抗地形"
    purpose: "能把 PDN 設計目標講成一段從 DC 到最高電流頻率的可雕塑阻抗地形。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L347-L356]]"
  - id: elements-and-their-curve-features
    author: "google/gemini-3.8-flash"
    title: "拆解 PDN 生態系：從 VRM 到晶片端的各元件與阻抗曲線對應"
    purpose: "能列出 PDN 生態系各元件，並指出每個元件負責阻抗曲線的哪一段特徵。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L357-L366]]"
  - id: interfaces-are-where-the-work-is
    author: "google/gemini-3.8-flash"
    title: "雕塑 PDN 阻抗曲線：為什麼工作量都在元件交界？"
    purpose: "能解釋為何 PDN 設計工作量集中在元件交界，並用成本與風險收束整條曲線。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L368-L380]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L404-L417]]"
created: 2026-11-11
updated: 2026-11-13
---

# 雕塑 PDN 阻抗曲線

## Lesson

從 on-die 電容一路到 VRM，每個元件各自擁有一段阻抗曲線，真正需要設計的是接手處的形狀。這一節建立「阻抗曲線是一塊可以被雕塑的地形」這個視角，後續章節都在補各個區域的物理。

## Steps

1. [雕塑從 DC 到高頻的 PDN 阻抗地形](sculpting-the-impedance/impedance-profile-as-terrain.md)
2. [拆解 PDN 生態系：從 VRM 到晶片端的各元件與阻抗曲線對應](sculpting-the-impedance/elements-and-their-curve-features.md)
3. [雕塑 PDN 阻抗曲線：為什麼工作量都在元件交界？](sculpting-the-impedance/interfaces-are-where-the-work-is.md)
