---
id: what-a-harness-is
title: "Agent Harness：LLM 之外的那些東西"
subject: agent-harness
tier: 1
order: 1
status: written
goal: "建立 agent = LLM + harness 的心智模型，並能用一個 naive 迴圈解釋為什麼 demo 能跑、production 會死。"
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
updated: 2026-10-22
---

# Agent Harness：LLM 之外的那些東西

## Lesson

這門課不教你做某個垂直 agent，而是造那個能跑任何 agent 的 runtime。先分清楚 LLM 與 harness 的邊界，再看一個「能跑」的 demo 如何在 production 斷掉。

## Steps

1. [Harness 才是產品：LLM 之外的基礎設施](what-a-harness-is/harness-is-the-product.md)
2. [Demo agent 為什麼一進 production 就死](what-a-harness-is/demo-vs-production.md)
