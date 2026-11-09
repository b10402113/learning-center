---
id: build-agents-that-never-sleep
title: "打造不會睡的 AI 代理"
subject: background-agent
tier: 1
order: 1
status: written
goal: "能用 standing goal、lifecycle、harness 與 inbox 說明背景代理和聊天代理的差別，並說出課程要蓋什麼。"
digests:
  - 0-introduction.md
  - 1-background-agents.md
  - lessons-index.md
  - notes-course-plan.md
  - course.yaml.md
prerequisites: []
steps:
  - id: background-agent-vs-chat-agent
    author: "google/gemini-3.8-flash"
    title: "背景代理與聊天代理有何不同？從持續目標、事件觸發與耐久性看起"
    purpose: "能用 standing goal、事件觸發與耐久性說明背景代理和聊天代理的差別。"
    sources:
      - "[[sources/background-agent/20261109/course/1-background-agents.txt#L1-L9]]"
      - "[[sources/background-agent/20261109/course/1-background-agents.txt#L10-L22]]"
      - "[[sources/background-agent/20261109/course/1-background-agents.txt#L23-L31]]"
      - "[[sources/background-agent/20261109/course/1-background-agents.txt#L32-L41]]"
      - "[[sources/background-agent/20261109/course/1-background-agents.txt#L42-L57]]"
      - "[[sources/background-agent/20261109/course/1-background-agents.txt#L58-L67]]"
      - "[[sources/background-agent/20261109/course/1-background-agents.txt#L68-L77]]"
  - id: authority-and-the-harness
    author: "google/gemini-3.8-flash"
    title: "為什麼 Approval 與停止條件必須由 Harness 決定，而不是交給模型？"
    purpose: "能說明為什麼 approval 與停止條件要交給 harness 決定，而不是交給模型。"
    sources:
      - "[[sources/background-agent/20261109/course/1-background-agents.txt#L96-L111]]"
      - "[[sources/background-agent/20261109/course/1-background-agents.txt#L112-L129]]"
      - "[[sources/background-agent/20261109/course/1-background-agents.txt#L130-L145]]"
  - id: incident-lifecycle-and-inbox
    author: "google/gemini-3.8-flash"
    title: "從一次結帳事故看背景代理人的運作週期"
    purpose: "能用一次 checkout 事故說明 run 的開場、事件加入、inbox 求助與恢復收尾。"
    sources:
      - "[[sources/background-agent/20261109/course/0-introduction.txt#L20-L30]]"
      - "[[sources/background-agent/20261109/course/0-introduction.txt#L31-L43]]"
      - "[[sources/background-agent/20261109/course/0-introduction.txt#L44-L55]]"
      - "[[sources/background-agent/20261109/course/0-introduction.txt#L56-L61]]"
      - "[[sources/background-agent/20261109/course/0-introduction.txt#L62-L70]]"
      - "[[sources/background-agent/20261109/course/0-introduction.txt#L71-L83]]"
      - "[[sources/background-agent/20261109/supplement/lessons/index.md#L1-L9]]"
      - "[[sources/background-agent/20261109/supplement/notes/course-plan.md#L6-L7]]"
  - id: what-the-course-builds
    author: "google/gemini-3.8-flash"
    title: "打造 Background Agent：Observe-Decide-Act 迴圈與六項 Harness 能力"
    purpose: "能說出課程要蓋的 observe-decide-act 迴圈與六個 harness 能力。"
    sources:
      - "[[sources/background-agent/20261109/course/0-introduction.txt#L14-L19]]"
      - "[[sources/background-agent/20261109/course/0-introduction.txt#L84-L85]]"
      - "[[sources/background-agent/20261109/supplement/lessons/index.md#L10-L24]]"
      - "[[sources/background-agent/20261109/supplement/notes/course-plan.md#L1-L3]]"
      - "[[sources/background-agent/20261109/supplement/notes/course-plan.md#L8-L11]]"
      - "[[sources/background-agent/20261109/supplement/course.yaml#L13-L24]]"
      - "[[sources/background-agent/20261109/supplement/course.yaml#L25-L31]]"
created: 2026-11-09
updated: 2026-11-08
---

# 打造不會睡的 AI 代理

## Lesson

這門課把「背景代理」當成一種生命周期，而不是一個聊天介面：它帶著 standing goal 自己醒來、觀察世界、採取行動，必要時透過 inbox 找人。這個節點先建立 harness、authority、durability 與事件的基本詞彙，讓後面每一段程式碼都有同一個心智模型可以掛靠。

## Steps

1. [背景代理與聊天代理有何不同？從持續目標、事件觸發與耐久性看起](build-agents-that-never-sleep/background-agent-vs-chat-agent.md)
2. [為什麼 Approval 與停止條件必須由 Harness 決定，而不是交給模型？](build-agents-that-never-sleep/authority-and-the-harness.md)
3. [從一次結帳事故看背景代理人的運作週期](build-agents-that-never-sleep/incident-lifecycle-and-inbox.md)
4. [打造 Background Agent：Observe-Decide-Act 迴圈與六項 Harness 能力](build-agents-that-never-sleep/what-the-course-builds.md)
