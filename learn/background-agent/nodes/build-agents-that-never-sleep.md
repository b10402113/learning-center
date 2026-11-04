---
id: build-agents-that-never-sleep
title: "打造不會睡的 AI 代理"
subject: background-agent
tier: 1
order: 1
status: written
goal: "能用 standing goal、durability 與 operator inbox 說明背景代理和聊天代理的差別。"
digests:
  - 0-introduction.md
  - 1-background-agents.md
  - lessons-index.md
  - course.yaml.md
  - README.md
prerequisites: []
steps:
  - id: chat-agent-vs-background-agent
    author: "google/gemini-3.8-flash"
    title: "背景代理是另一種代理"
    purpose: "能用事件觸發、standing goal 與 fire-and-forget 說明背景代理和聊天代理的差別。"
    sources:
      - "[[sources/background-agent/20261105/0-introduction.vtt#L1-L118]]"
      - "[[sources/background-agent/20261105/1-background-agents.vtt#L149-L286]]"
      - "[[sources/background-agent/20261105/1-background-agents.vtt#L458-L580]]"
      - "[[sources/background-agent/20261105/course.yaml#L3-L12]]"
  - id: goal-not-prompt
    author: "google/gemini-3.8-flash"
    title: "它拿到的是目標，不是任務"
    purpose: "能說明背景代理的目標是持續維持的狀態，並用 durability 解釋它為何能等待與恢復。"
    sources:
      - "[[sources/background-agent/20261105/1-background-agents.vtt#L287-L457]]"
      - "[[sources/background-agent/20261105/1-background-agents.vtt#L863-L948]]"
      - "[[sources/background-agent/20261105/lessons/index.md#L1-L9]]"
  - id: observe-decide-act-harness
    author: "google/gemini-3.8-flash"
    title: "觀察、決定、行動的迴圈"
    purpose: "能畫出 observe → decide → act 迴圈，並指出 harness 而非模型持有工具與完成判定。"
    sources:
      - "[[sources/background-agent/20261105/0-introduction.vtt#L183-L315]]"
      - "[[sources/background-agent/20261105/1-background-agents.vtt#L736-L862]]"
      - "[[sources/background-agent/20261105/README.md#L4-L16]]"
      - "[[sources/background-agent/20261105/lessons/index.md#L10-L24]]"
  - id: authority-and-operator-inbox
    author: "google/gemini-3.8-flash"
    title: "誰有權做什麼？"
    purpose: "能區分模型、harness 與人類的權威，並說明 operator inbox 何時出現。"
    sources:
      - "[[sources/background-agent/20261105/0-introduction.vtt#L316-L400]]"
      - "[[sources/background-agent/20261105/0-introduction.vtt#L471-L533]]"
      - "[[sources/background-agent/20261105/1-background-agents.vtt#L581-L735]]"
      - "[[sources/background-agent/20261105/course.yaml#L13-L24]]"
  - id: waiting-and-the-incident-demo
    author: "google/gemini-3.8-flash"
    title: "我看了最新的狀態"
    purpose: "能用 dependency 故障示範說明等待中事件仍會到達，且恢復必須重讀世界狀態。"
    sources:
      - "[[sources/background-agent/20261105/0-introduction.vtt#L401-L470]]"
      - "[[sources/background-agent/20261105/0-introduction.vtt#L534-L578]]"
      - "[[sources/background-agent/20261105/README.md#L70-L84]]"
created: 2026-11-05
updated: 2026-11-04
---

# 打造不會睡的 AI 代理

## Lesson

聊天代理是一次問答，背景代理則是一個會自己活下去的目標。這個節點先建立「standing goal + durability」的心智模型，再說明為什麼這種代理需要 harness、事件，以及一個只在使用者需要判斷時才出現的收件匣。

## Steps

1. [背景代理是另一種代理](build-agents-that-never-sleep/chat-agent-vs-background-agent.md)
2. [它拿到的是目標，不是任務](build-agents-that-never-sleep/goal-not-prompt.md)
3. [觀察、決定、行動的迴圈](build-agents-that-never-sleep/observe-decide-act-harness.md)
4. [誰有權做什麼？](build-agents-that-never-sleep/authority-and-operator-inbox.md)
5. [我看了最新的狀態](build-agents-that-never-sleep/waiting-and-the-incident-demo.md)
