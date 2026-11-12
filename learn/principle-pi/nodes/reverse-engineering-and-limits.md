---
id: reverse-engineering-and-limits
title: "從量測反推 PDN、風險與成本取捨"
subject: principle-pi
tier: 10
order: 30
status: draft
goal: "用量測波形反推 PDN 參數，並說出效能、成本與風險的最後取捨。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.15.part.md
prerequisites:
  - learn/principle-pi/nodes/case-study-and-improvements.md
steps: []
created: 2026-11-11
updated: 2026-11-11
---

# 從量測反推 PDN、風險與成本取捨

## Lesson

阻抗、電流與電壓三者可以互相推導，所以幾條示波器波形就能反推出一整套 PDN 參數。這一節用 FPGA 實測資料做模擬與量測的關聯，最後把旅程收在十條 bottom line：峰值管理、三種電流波形、試算表的精度，以及什麼時候該接受殘餘風險。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
