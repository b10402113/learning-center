---
id: the-map
title: "The map：七層地圖"
subject: ai-agent-engineer
tier: 1
order: 2
status: written
goal: "用 model、prompt、context、harness、memory、loop、boundary 七層定位失敗，說出拿掉一層會怎麼壞。"
digests:
  - agentic-coding-handbook.1.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/course-orientation.md"
steps:
  - id: same-model-different-harness
    author: "gpt-6-luna"
    title: "差別在 harness"
    purpose: "用 Terminal Bench 換 harness 的結果說明模型不是全部，並指出失敗通常落在哪六層。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L208-L245]]"
  - id: seven-layers-and-goals
    author: "gpt-6-luna"
    title: "Agent 的七層地圖與每層的職責"
    purpose: "說出七層各自是什麼、各自要把哪一件事弄對，不看筆記也能排出順序。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L246-L307]]"
  - id: one-run-one-session-one-goal
    author: "gpt-6-luna"
    title: "Agent = model + harness"
    purpose: "用 agent = model + harness 解釋一次 run 之內與之後各自留下什麼，並說出環境與 boundary 的關係。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L309-L313]]"
  - id: locate-the-broken-layer
    author: "gpt-6-luna"
    title: "先找出壞掉的那一層"
    purpose: "從症狀反推壞在哪一層，並說明為什麼往 harness、loop 修會複利。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L314-L351]]"
created: 2026-11-03
updated: 2026-11-04
---

# The map：七層地圖

## Lesson

同一個模型換掉 harness，Terminal Bench 名次就從三十名外進到前五，這是整門課的起點。七層不是功能清單，而是除錯順序：先定位壞在哪一層，再修那一層。之後每個模組都會回到這張地圖。

## Steps

1. [差別在 harness](the-map/same-model-different-harness.md)
2. [Agent 的七層地圖與每層的職責](the-map/seven-layers-and-goals.md)
3. [Agent = model + harness](the-map/one-run-one-session-one-goal.md)
4. [先找出壞掉的那一層](the-map/locate-the-broken-layer.md)
