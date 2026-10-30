---
id: prc-spreadsheet-design-flow
title: "用 PRC 算表走一遍設計流程"
subject: pi-pdn
tier: 7
order: 22
status: draft
goal: "從 dI 與 Vdd 填到 PRC lines 1–60，得到三個峰的 fres/Z0/q 與三種波形的電壓響應。"
digests:
  - pdn-principles.16.part.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# 用 PRC 算表走一遍設計流程

## Lesson

PDN Resonance Calculator 是一張線性化算表，把三個相隔約一個十年的峰各用一組 RLC 表示，讓你在畫任何圖之前就先得到 fres、Zpeak、PDN ratio、Z0、q。這個 node 逐段走過 lines 1–60：輸入電壓電流與 Ztarget、clock-edge 電荷與 on-die 參數、從幾何抽 mounting L 與 R、到三個 loop 的效能指標與阻尼。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
