---
id: what-is-a-pdn
title: "什麼是電源傳遞網路（PDN），為何該在意"
subject: principle-pi
tier: 1
order: 1
status: written
goal: "說出 PDN 的範圍、三項職責，以及電壓雜訊如何吃掉眼高與抖動。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.2.part.md
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.md
prerequisites: []
steps:
  - id: what-the-pdn-covers
    author: "google/gemini-3.8-flash"
    title: "認識電源分配網路的範圍與三大核心職責"
    purpose: "能界定 PDN 從 VRM 到 die 的實體範圍，並說出供電、訊號回路與 EMI 三項職責。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L1-L28]]"
  - id: noise-to-eye-height-and-jitter
    author: "google/gemini-3.8-flash"
    title: "電源雜訊如何吃掉眼圖裕度：從 125 mV 垂直壓縮到 1 ps/mV 邊緣抖動"
    purpose: "能用眼高垂直壓縮與邊緣推成抖動，解釋 125 mV 雜訊與 1 ps/mV 如何吃掉裕度。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L29-L101]]"
  - id: five-percent-budget-and-ecology
    author: "google/gemini-3.8-flash"
    title: "從 15% 雜訊裕度到阻抗頻譜：PDN 電壓雜訊的估算與成因"
    purpose: "能從 15% 接收端裕度推出 5% 的 PDN 限額，並用阻抗乘上電流頻譜解釋雜訊來源。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L102-L186]]"
  - id: book-map-and-methodology
    author: "google/gemini-3.8-flash"
    title: "穩健 PDN 設計的四要素方法與十章全景"
    purpose: "能說出本書的四要素設計方法，並把十章骨架對應到後續節點。"
    sources:
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.2.part.txt#L101-L151]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.2.part.txt#L248-L337]]"
      - "[[sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L382-L419]]"
created: 2026-11-11
updated: 2026-11-11
---

# 什麼是電源傳遞網路（PDN），為何該在意

## Lesson

先界定 PDN 的實體範圍與它在供電之外的三項職責，再用實測數字說明電壓雜訊如何同時壓縮眼高、推移邊緣而形成抖動。這一節也交代本書的方法論與十個章節的骨架，作為後續所有節點的地圖。

## Steps

1. [認識電源分配網路的範圍與三大核心職責](what-is-a-pdn/what-the-pdn-covers.md)
2. [電源雜訊如何吃掉眼圖裕度：從 125 mV 垂直壓縮到 1 ps/mV 邊緣抖動](what-is-a-pdn/noise-to-eye-height-and-jitter.md)
3. [從 15% 雜訊裕度到阻抗頻譜：PDN 電壓雜訊的估算與成因](what-is-a-pdn/five-percent-budget-and-ecology.md)
4. [穩健 PDN 設計的四要素方法與十章全景](what-is-a-pdn/book-map-and-methodology.md)
