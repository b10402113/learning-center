---
id: what-a-harness-is
title: "Harness 是一個系統，不是一個迴圈"
subject: agent-harness
tier: 1
order: 1
status: written
goal: "用控制面、狀態面、執行面、context 面拆開 agent 系統，並說出 demo 與 production 的差異。"
prerequisites: []
steps:
  - id: harness-is-the-product
    title: "Harness 才是產品：LLM 之外的基礎設施"
    purpose: "能用「LLM + harness」解釋 agent，並說出 memory、tools、long-running 為什麼屬於 harness。"
    sources:
      - "[[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#L7-L25]]"
      - "[[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#L26-L58]]"
      - "[[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#L109-L127]]"
      - "[[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#L197-L216]]"
  - id: demo-vs-production
    title: "Demo agent 為什麼一進 production 就死"
    purpose: "能指出 naive while 迴圈在 crash、不可逆副作用、上下文成長上的六個斷點。"
    sources:
      - "[[sources/agent-harness/20260915/harness-engineering/lessons/01-intro-to-harness-engineering/index.md#L34-L58]]"
      - "[[sources/agent-harness/20260915/harness-engineering/lessons/01-intro-to-harness-engineering/index.md#L291-L311]]"
created: 2026-10-22
updated: 2026-10-24
---

# Harness 是一個系統，不是一個迴圈

## Lesson

Agent 不是一個模型呼叫，而是一個由控制面、狀態面、執行面與 context 面組成的系統。先分清楚 LLM 與 harness 的邊界，再用 naive 迴圈看見 production 會在哪裡斷掉；後面每個節點就對應其中一個平面。

## Steps

1. [Harness 才是產品：LLM 之外的基礎設施](what-a-harness-is/harness-is-the-product.md)
2. [Demo agent 為什麼一進 production 就死](what-a-harness-is/demo-vs-production.md)
