---
id: mounting-inductance-and-vendor-models
title: "電容的 mounting inductance 與原廠 S-parameter 模型"
subject: pi-pdn
tier: 3
order: 9
status: draft
goal: "把 2 nH 的 mounted L 拆成 trace/body/via/spreading，用五個槓桿壓到 sub-0.5 nH，並避開 vendor 檔案的陷阱。"
digests:
  - pdn-principles.8.part.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# 電容的 mounting inductance 與原廠 S-parameter 模型

## Lesson

決定電容成敗的不是容值，而是它被裝上去之後的 loop inductance；一個常規 0603 在 10 mil cavity 上大約就是 2 nH。這個 node 逐項拆解 surface trace、body、via 與 spreading 的貢獻，並說明 vendor S-parameter 檔案的 fixture 陷阱與如何抽出可用的 RLC。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
