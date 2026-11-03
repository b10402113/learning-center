---
id: measuring-low-impedance
title: "量測低阻抗與 fixture artifact"
subject: principle-pi
tier: 1
order: 4
status: confirmed
goal: "用 V/I、反射係數與 two-port S21 量低阻抗，並從曲線辨認 fixture 造成的假 R／假 L。"
digests:
  - pdn-principles.4.part.md
  - pdn-principles.5.part.md
prerequisites: []
steps:
  - id: why-measure-and-vi
    title: "為什麼要量測低阻抗？"
    purpose: "說明為何 PDN 量測要涵蓋 1 mΩ 到 GHz，並寫出 Z=V/I 的複數定義與它的頻率上限。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L1-L26]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L27-L67]]"
  - id: reflection-and-one-port-limits
    purpose: "用反射係數與 S11 反推 Zin，並說出 one-port 在 0.1 Ω、fixture 相位與接觸電阻上的三個極限。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L68-L106]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L107-L173]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L174-L231]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L232-L281]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L282-L374]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L375-L472]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L473-L557]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L558-L601]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L602-L628]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L629-L676]]"
  - id: kelvin-and-two-port-s21
    purpose: "用 Kelvin 四線與 two-port S21 把量測推到 mΩ，並把 S21 dB 換成 dBΩ 讀出阻抗。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L677-L758]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L759-L841]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L842-L888]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L889-L989]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L990-L1064]]"
  - id: fixture-phase-artifact
    purpose: "從曲線辨認 fixture 延遲把虛部轉成實部所造成的假 R 與假 L，並用二階模型分離 DUT。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L1065-L1088]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt#L1089-L1138]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L1-L14]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L15-L33]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L34-L63]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L64-L70]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L71-L98]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L99-L135]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L136-L170]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L171-L186]]"
  - id: real-duts-and-spatial-attenuation
    purpose: "用同一套 two-port 手法讀 MLCC 與 on-die C，並警覺 insertion loss 讓 Z 看起來偏低。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L187-L224]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L225-L256]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L257-L291]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L292-L331]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L332-L351]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L352-L387]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L388-L436]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L437-L462]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L463-L502]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L503-L518]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L519-L551]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L552-L590]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L591-L626]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L627-L664]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L665-L696]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L697-L725]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L726-L764]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L765-L794]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.5.part.txt#L795-L854]]"
created: 2026-10-31
updated: 2026-11-01
---

# 量測低阻抗與 fixture artifact

## Lesson

書裡反覆出現的警告是：你量到的低阻抗可能是 fixture 造的。這篇從 V/I、反射係數、VNA 到 two-port，說明每種量法能到多低、多高頻，以及什麼時候該懷疑自己的數據。

## Steps

1. [為什麼要量測低阻抗？](measuring-low-impedance/why-measure-and-vi.md)
2. [reflection-and-one-port-limits](measuring-low-impedance/reflection-and-one-port-limits.md)
3. [kelvin-and-two-port-s21](measuring-low-impedance/kelvin-and-two-port-s21.md)
4. [fixture-phase-artifact](measuring-low-impedance/fixture-phase-artifact.md)
5. [real-duts-and-spatial-attenuation](measuring-low-impedance/real-duts-and-spatial-attenuation.md)
