---
id: return-plane-transitions
title: "訊號換 return plane 時，如何馴服 SI 問題"
subject: principle-pi
tier: 5
order: 11
status: confirmed
goal: "解釋 via 換層如何激發 cavity wave，並用 via 數與間距滿足 plane-bounce 判準。"
digests:
  - pdn-principles.12.part.md
prerequisites: []
steps:
  - id: return-current-through-the-cavity
    title: "掉下來不是問題，落地才是問題"
    purpose: "能說明平面 DC 電壓不影響 Z0，雜訊來自換層時 return current 必須穿過 cavity 阻抗。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.12.part.txt#L5-L43]]"
  - id: cavity-peaks-are-si-not-pi
    title: "為什麼峰值阻抗值得在意"
    purpose: "能算出 200 ps 邊緣的 6 mA return current 造成多少 victim 雜訊，並說明這為何是 SI 而非 PI 問題。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.12.part.txt#L44-L177]]"
  - id: thin-dielectric-lowers-impedance-and-damps
    title: "以更低阻抗與更高阻尼降低 cavity 雜訊"
    purpose: "能說明薄介質同時降 cavity 阻抗並提高阻尼，且不該用厚 h 去換高 Dk。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.12.part.txt#L178-L302]]"
  - id: shorting-via-count-and-spacing
    title: "用 shorting via 抑制 cavity 共振"
    purpose: "能用 fres = 1/(2π√(Lvia/n·Ccavity)) 與 s ≤ 3·RT[ns] 算出要幾顆 shorting via、間距多少。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.12.part.txt#L303-L358]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.12.part.txt#L359-L540]]"
  - id: same-voltage-returns-and-mini-coax
    purpose: "能說明 shorting via 為何要求所有 return plane 同電壓，並用每顆訊號 via 配一顆 return via 做出 mini-coax。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.12.part.txt#L541-L664]]"
created: 2026-10-31
updated: 2026-11-03
---

# 訊號換 return plane 時，如何馴服 SI 問題

## Lesson

訊號換層時，return current 必須在兩個平面之間找路，這條路就是 cavity。這篇解釋 noise 怎麼被激發、為什麼是長距離耦合，以及 thin dielectric 為何同時降阻抗又提高阻尼。

## Steps

1. [掉下來不是問題，落地才是問題](return-plane-transitions/return-current-through-the-cavity.md)
2. [為什麼峰值阻抗值得在意](return-plane-transitions/cavity-peaks-are-si-not-pi.md)
3. [以更低阻抗與更高阻尼降低 cavity 雜訊](return-plane-transitions/thin-dielectric-lowers-impedance-and-damps.md)
4. [用 shorting via 抑制 cavity 共振](return-plane-transitions/shorting-via-count-and-spacing.md)
5. [same-voltage-returns-and-mini-coax](return-plane-transitions/same-voltage-returns-and-mini-coax.md)
