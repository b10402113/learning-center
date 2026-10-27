---
id: run-lifecycle
title: "Run 的生命週期與資料模型"
subject: background-agents
tier: 2
order: 4
status: draft
goal: "說出 run 是什麼、eventSequence 的角色、schema 核心表，以及 business state 與 workflow state 的區別。"
prerequisites: []
steps: []
created: 2026-10-27
updated: 2026-10-27
---

# Run 的生命週期與資料模型

## Lesson

run 是「agent 被一個事件喚醒的一次執行」，不等於一次調查。business state 與 workflow state 分屬 Postgres 與 Inngest。看懂 schema 的核心表與 eventSequence，才知道斷掉之後狀態去哪裡。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
