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
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L2663-L2688]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L2689-L2729]]"
  - id: reflection-and-one-port-limits
    purpose: "用反射係數與 S11 反推 Zin，並說出 one-port 在 0.1 Ω、fixture 相位與接觸電阻上的三個極限。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L2730-L2768]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L2769-L2835]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L2836-L2893]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L2894-L2943]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L2944-L3036]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3037-L3134]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3135-L3219]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3220-L3263]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3264-L3290]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3291-L3338]]"
  - id: kelvin-and-two-port-s21
    purpose: "用 Kelvin 四線與 two-port S21 把量測推到 mΩ，並把 S21 dB 換成 dBΩ 讀出阻抗。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3339-L3420]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3421-L3503]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3504-L3550]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3551-L3651]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3652-L3726]]"
  - id: fixture-phase-artifact
    purpose: "從曲線辨認 fixture 延遲把虛部轉成實部所造成的假 R 與假 L，並用二階模型分離 DUT。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3727-L3750]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3751-L3800]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3801-L3814]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3815-L3833]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3834-L3863]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3864-L3870]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3871-L3898]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3899-L3935]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3936-L3970]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3971-L3986]]"
  - id: real-duts-and-spatial-attenuation
    purpose: "用同一套 two-port 手法讀 MLCC 與 on-die C，並警覺 insertion loss 讓 Z 看起來偏低。"
    sources:
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L3987-L4024]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4025-L4056]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4057-L4091]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4092-L4131]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4132-L4151]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4152-L4187]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4188-L4236]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4237-L4262]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4263-L4302]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4303-L4318]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4319-L4351]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4352-L4390]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4391-L4426]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4427-L4464]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4465-L4496]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4497-L4525]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4526-L4564]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4565-L4594]]"
      - "[[sources/principle-pi/20261031/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt#L4595-L4654]]"
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
