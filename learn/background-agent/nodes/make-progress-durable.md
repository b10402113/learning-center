---
id: make-progress-durable
title: "讓進度可持久"
subject: background-agent
tier: 2
order: 8
status: draft
goal: "能解釋 replay 為何跳過已完成 step，並說明 workflow body 必須確定性、step 必須幂等。"
digests:
  - 10-durable-execution.md
  - 11-workflow-state.md
  - lessons-02-durable-execution.md
prerequisites:
  - learn/background-agent/nodes/two-clocks-two-stores.md
  - learn/background-agent/nodes/first-runnable-loop.md
steps: []
created: 2026-11-05
updated: 2026-11-05
---

# 讓進度可持久

## Lesson

只要整個迴圈包在一個 step 裡，程序一死就得從頭再來，模型呼叫與副作用都會重複。這個節點說明 step 是記憶化的單位、replay 不是恢復堆疊，以及 workflow body 的確定性與 step 的幂等性為何是耐久執行的兩個前提。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
