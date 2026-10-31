---
id: measuring-low-impedance
title: "量低阻抗：VNA、two-port 與 fixture 陷阱"
subject: pi-pdn
tier: 7
order: 21
status: draft
goal: "用 Z = 25 Ω × S21 量 sub-mΩ 阻抗，並認出 phase delay、contact resistance、spatial attenuation 三個 fixture artifact。"
digests:
  - pdn-principles.3.part.md
  - pdn-principles.4.part.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# 量低阻抗：VNA、two-port 與 fixture 陷阱

## Lesson

量 milliohm 阻抗的難處不在儀器，而在反射訊號的 S/N、fixture 的相位延遲與接觸電阻；one-port VNA 大約在 0.1 Ω 就到底了。這個 node 建立 Z = 25 Ω × S21 的 two-port 方法，並用銅迴路、via、MLCC 與 on-die 電容四個實例，示範哪些曲線特徵是 fixture artifact、不是待測物。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
