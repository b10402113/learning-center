---
id: pdn-what-and-why
title: "電源傳輸網路（PDN）是什麼，為什麼要在乎"
subject: pi-pdn
tier: 1
order: 1
status: written
goal: "用 die 自己的 switching current 打在 PDN 阻抗上解釋 rail noise，並說出 PDN 的三個用途與 1 ps/mV 的 eye 代價。"
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
  - id: what-the-pdn-is
    title: "PDN 是什麼：從 VRM 到 die 的所有 interconnect"
    purpose: "能說出 PDN 涵蓋哪些 interconnect、它的三個用途，以及本書只處理供電這一項。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L840-L865]]"
  - id: noise-costs-eye-and-jitter
    title: "PDN noise 的代價：eye 收縮與 1 ps/mV 的 jitter"
    purpose: "能用 eye 收縮與 jitter 說明 rail noise 的後果，並以 1 ps/mV 估算時序預算還剩多少。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L866-L938]]"
  - id: noise-is-current-times-impedance
    title: "PDN ecology：transient current 打在阻抗上就是 noise"
    purpose: "能說明 VRM 再穩也擋不住 die 自己的 transient current，並用電流頻譜與阻抗峰的重疊定位 noise。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L957-L1023]]"
  - id: target-impedance-and-pdn-ratio
    title: "Target impedance 與 PDN ratio：working 不等於 robust"
    purpose: "能算出 Ztarget = ΔV/ΔI 的 50 mΩ，並用 PDN ratio 判斷一個設計的風險高低。"
    sources:
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L944-L956]]"
      - "[[sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L1024-L1183]]"
created: 2026-10-30
updated: 2026-10-30
---

# 電源傳輸網路（PDN）是什麼，為什麼要在乎

## Lesson

這個 node 把「power integrity」從一個模糊的傘狀名詞，收斂成一件具體的事：die 自己的 switching current 打在從 VRM 到 die 的整條阻抗上，產生的 Vdd core-rail noise。接著建立 Ztarget = ΔV/ΔI 與 PDN ratio 這兩個之後每個 node 都會回頭用的判準。

## Steps

1. [PDN 是什麼：從 VRM 到 die 的所有 interconnect](pdn-what-and-why/what-the-pdn-is.md)
2. [PDN noise 的代價：eye 收縮與 1 ps/mV 的 jitter](pdn-what-and-why/noise-costs-eye-and-jitter.md)
3. [PDN ecology：transient current 打在阻抗上就是 noise](pdn-what-and-why/noise-is-current-times-impedance.md)
4. [Target impedance 與 PDN ratio：working 不等於 robust](pdn-what-and-why/target-impedance-and-pdn-ratio.md)
