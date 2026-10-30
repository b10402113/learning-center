---
id: inductance-from-geometry
title: "從幾何估算迴路電感：圓迴路、sheet inductance 與經驗法則"
subject: pi-pdn
tier: 2
order: 6
status: draft
goal: "用 25 nH/inch、8.3 nH/inch、32 pH/mil×h 估出板子與封裝的迴路電感。"
digests:
  - pdn-principles.6.part.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# 從幾何估算迴路電感：圓迴路、sheet inductance 與經驗法則

## Lesson

這一篇把電感從公式變成可上手的估算：窄導線加遠方迴流約 25 nH/inch、FR4 裡任何 50 Ω 線約 8.3 nH/inch、plane pair 每平方 32 pH/mil × h。也會用 3D solver 的 S-parameter 反抽 loop L，作為之後量測與模擬對照的橋樑。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
