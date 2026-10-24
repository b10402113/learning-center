---
id: agent-routing-handoff
title: "Routing：Agent 是資料，handoff 是控制轉移"
subject: agent-harness
tier: 3
order: 8
status: draft
goal: "把 agent 定義成 name + prompt + tools，並在 runtime 攔截 handoff 完成換手。"
prerequisites: []
steps: []
created: 2026-10-24
updated: 2026-10-24
---

# Routing：Agent 是資料，handoff 是控制轉移

## Lesson

Agent 不是另一套 runtime，而是一組 name、system prompt 與工具子集的資料。Handoff 則是 harness 層級的控制轉移：runtime 攔到 handoff tool call，換掉 currentAgent，把同一段對話交給更適合的專家。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
