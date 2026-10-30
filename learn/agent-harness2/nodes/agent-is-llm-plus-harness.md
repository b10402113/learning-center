---
id: agent-is-llm-plus-harness
title: "Agent 是 LLM 加上 harness"
subject: agent-harness2
tier: 1
order: 1
status: written
goal: "用「LLM + harness」解釋為什麼同一個模型結果差很多，並指出本課要補的七個能力。"
prerequisites: []
steps:
  - id: no-harness-just-an-llm-call
    title: "沒有 harness，你只有一次 LLM 呼叫"
    purpose: "用「LLM + harness」定義 agent，並說明 memory、tools、long-running 為什麼都屬於 harness。"
    sources:
      - "[[sources/agent-harness2/20261029/1-what-is-an-agent-harness.txt#L1-L25]]"
      - "[[sources/agent-harness2/20261029/1-what-is-an-agent-harness.txt#L26-L40]]"
      - "[[sources/agent-harness2/20261029/1-what-is-an-agent-harness.txt#L41-L63]]"
      - "[[sources/agent-harness2/20261029/1-what-is-an-agent-harness.txt#L64-L80]]"
  - id: harness-wins-not-the-model
    title: "模型不是差異來源，harness 才是"
    purpose: "以 Claude Code 為例拆出 harness 的組成，並解釋為什麼較差模型配上較好 harness 也能勝出。"
    sources:
      - "[[sources/agent-harness2/20261029/1-what-is-an-agent-harness.txt#L81-L108]]"
      - "[[sources/agent-harness2/20261029/1-what-is-an-agent-harness.txt#L109-L141]]"
  - id: no-harness-no-production
    title: "沒有 harness，就上不了 production"
    purpose: "從 deep research 與自駕交易 agent 說明 durable execution、guardrails、approval 何時變成必需。"
    sources:
      - "[[sources/agent-harness2/20261029/1-what-is-an-agent-harness.txt#L41-L63]]"
      - "[[sources/agent-harness2/20261029/1-what-is-an-agent-harness.txt#L142-L196]]"
      - "[[sources/agent-harness2/20261029/1-what-is-an-agent-harness.txt#L197-L216]]"
  - id: seven-capabilities-seven-failures
    title: "七個能力，七種 production 故障"
    purpose: "說出七個能力各自修哪個 production 故障，並知道它們會陸續加進同一個 runtime。"
    sources:
      - "[[sources/agent-harness2/20261029/harness-engineering/README.md#L8-L19]]"
      - "[[sources/agent-harness2/20261029/0-introduction.txt#L46-L76]]"
      - "[[sources/agent-harness2/20261029/0-introduction.txt#L77-L151]]"
      - "[[sources/agent-harness2/20261029/0-introduction.txt#L176-L198]]"
      - "[[sources/agent-harness2/20261029/2-course-project-setup.txt#L73-L114]]"
      - "[[sources/agent-harness2/20261029/26-wrapping-up.txt#L120-L183]]"
created: 2026-10-29
updated: 2026-10-29
---

# Agent 是 LLM 加上 harness

## Lesson

先把 harness 的定義與邊界立起來：agent 是 LLM 加一層基礎設施，而這門課的工作區就是 `harness/` 裡的 runtime。看完你會知道後面要修的七個能力——durable execution、sandbox、memory、handoff、supervision、approval——各自對應哪個故障。

## Steps

1. [沒有 harness，你只有一次 LLM 呼叫](agent-is-llm-plus-harness/no-harness-just-an-llm-call.md)
2. [模型不是差異來源，harness 才是](agent-is-llm-plus-harness/harness-wins-not-the-model.md)
3. [沒有 harness，就上不了 production](agent-is-llm-plus-harness/no-harness-no-production.md)
4. [七個能力，七種 production 故障](agent-is-llm-plus-harness/seven-capabilities-seven-failures.md)
