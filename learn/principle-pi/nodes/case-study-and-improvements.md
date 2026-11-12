---
id: case-study-and-improvements
title: "案例驗證：SCL 負載、時間域響應與改善"
subject: principle-pi
tier: 10
order: 29
status: draft
goal: "用時間域模擬驗證試算表預測，並用 OPD、電容值與上升時間改進。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.15.part.md
prerequisites:
  - learn/principle-pi/nodes/prc-spreadsheet.md
steps: []
created: 2026-11-11
updated: 2026-11-11
---

# 案例驗證：SCL 負載、時間域響應與改善

## Lesson

把電流源換成切換電容負載之後，試算表預測的 impulse、step 與共振響應才對得上時間域模擬。這一節沿著改善流程走一遍：先解安裝電感，再修 SMPS 模型、加 OPD、回頭檢討暫態電流假設，最後看 droop 怎麼下降。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
