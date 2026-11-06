---
id: reasoning-llm-vs-agent
title: "Reasoning LLM 與 agent：誰來畫箭頭"
subject: ai-agent-workflows
tier: 1
order: 1
status: written
goal: "用盒子與箭頭說明 LLM、workflow、agent 的差別，並說出控制權與可靠度、成本的取捨。"
digests:
  - 0-introduction.md
  - 1-reasoning-llms-vs-agents.md
prerequisites: []
steps:
  - id: boxes-arrows-control
    author: "google/gemini-3.8-flash"
    title: "用盒子與箭頭思考 agent"
    purpose: "用盒子與箭頭說明 workflow 與 agent 的控制權差異，並用 context、reliability、cost 權衡決定何時不用 agent。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/0-introduction.txt#L23-L43]]"
      - "[[sources/ai-agent-workflows/20261105/course/0-introduction.txt#L44-L67]]"
      - "[[sources/ai-agent-workflows/20261105/course/0-introduction.txt#L161-L201]]"
      - "[[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L1-L20]]"
      - "[[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L21-L57]]"
      - "[[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L58-L68]]"
      - "[[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L69-L95]]"
      - "[[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L96-L111]]"
  - id: reasoning-llm-as-component
    author: "google/gemini-3.8-flash"
    title: "LLM 只是 agent 的零件"
    purpose: "把 reasoning LLM 放回 agent 的零件位置，說明 thinking 是推理摘要，而 LLM 本身只把文字轉成文字。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/0-introduction.txt#L272-L295]]"
      - "[[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L112-L142]]"
      - "[[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L143-L175]]"
      - "[[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L176-L199]]"
      - "[[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L200-L246]]"
created: 2026-11-05
updated: 2026-11-05
---

# Reasoning LLM 與 agent：誰來畫箭頭

## Lesson

這兩個 step 先建立整門課的座標系：每個步驟是一個盒子，每條控制流是一條箭頭，而差別在於箭頭由誰畫。先看「什麼時候不該用 agent」，再把 reasoning LLM 放回 agent 的零件位置，後面所有 pattern 都沿著這個控制權光譜排列。

## Steps

1. [用盒子與箭頭思考 agent](reasoning-llm-vs-agent/boxes-arrows-control.md)
2. [LLM 只是 agent 的零件](reasoning-llm-vs-agent/reasoning-llm-as-component.md)
