---
id: what-is-a-background-agent
title: "Background agent 是什麼：LLM + harness + durable runtime"
subject: background-agents
tier: 1
order: 1
status: written
goal: "能用「LLM + harness + durable runtime」解釋 background agent，說出它和 chat agent 的差別，以及為什麼「需不需要核准」不能交給 LLM。"
prerequisites: []
steps:
  - id: from-chat-to-background-agent
    title: "從 chat agent 到 background agent：不是對話，是給目標盯事件"
    purpose: "能說出 background agent 與 chat agent 的差別：它給目標、盯事件、照排程跑，而不是等人打字。"
    sources:
      - "[[sources/background-agents/20261027/0-introduction.md#L4-L16]]"
      - "[[sources/background-agents/20261027/1-background-agents.md#L1-L36]]"
  - id: llm-harness-durable-runtime
    title: "三個組成：LLM + harness + durable runtime"
    purpose: "能用「LLM + harness + durable runtime」拆解一個 background agent，並說出 durable 為何是「關掉還會活著」。"
    sources:
      - "[[sources/background-agents/20261027/4-setting-up-the-workflow.md#L13-L28]]"
      - "[[sources/background-agents/20261027/1-background-agents.md#L37-L46]]"
      - "[[sources/background-agents/20261027/0-introduction.md#L4-L16]]"
  - id: approval-is-not-llm
    title: "為什麼「需不需要核准」不能交給 LLM"
    purpose: "能解釋為何「需不需要核准」不能交給 LLM，並把模糊判斷與確定性阻擋切開。"
    sources:
      - "[[sources/background-agents/20261027/1-background-agents.md#L61-L77]]"
      - "[[sources/background-agents/20261027/0-introduction.md#L31-L49]]"
      - "[[sources/background-agents/20261027/3-goal-and-harness-overview.md#L33-L68]]"
  - id: observe-decide-act-loop
    title: "Harness 的核心：observe-decide-act 迴圈"
    purpose: "能畫出 observe-decide-act 迴圈，說出它不做 tool calling、可以停下來等待的差別。"
    sources:
      - "[[sources/background-agents/20261027/1-background-agents.md#L78-L102]]"
      - "[[sources/background-agents/20261027/3-goal-and-harness-overview.md#L69-L87]]"
created: 2026-10-27
updated: 2026-10-27
---

# Background agent 是什麼：LLM + harness + durable runtime

## Lesson

Background agent 不是一段對話，而是「給目標、盯事件、自己跑」的程式：它 = LLM + harness + durable runtime。先建立這個心智模型，並把「需不需要核准」這類判斷切成 LLM 的模糊推理與 harness 的確定性阻擋，後面每個機制都是這條界線在某個環節的具體化。

## Steps

1. [從 chat agent 到 background agent：不是對話，是給目標盯事件](what-is-a-background-agent/from-chat-to-background-agent.md)
2. [三個組成：LLM + harness + durable runtime](what-is-a-background-agent/llm-harness-durable-runtime.md)
3. [為什麼「需不需要核准」不能交給 LLM](what-is-a-background-agent/approval-is-not-llm.md)
4. [Harness 的核心：observe-decide-act 迴圈](what-is-a-background-agent/observe-decide-act-loop.md)
