---
id: give-the-agent-a-goal
title: "給代理一個目標"
subject: background-agent
tier: 2
order: 3
status: written
goal: "能建立 goal + harness 的 observe → decide → act 骨架，並用結構化輸出取得一次決策。"
digests:
  - 3-goal-and-harness-overview.md
  - 4-setting-up-the-workflow.md
  - 5-choosing-the-next-action.md
  - lessons-01-goal-and-harness.md
  - server.md
  - shared.md
prerequisites:
  - learn/background-agent/nodes/course-project-setup.md
steps:
  - id: goal-as-observed-state
    author: "google/gemini-3.8-flash"
    title: "以世界狀態定義目標：結合運行狀態與執行歷史引導 Agent 決策"
    purpose: "能把 goal 寫成 world state 的條件，並用 run state 與執行歷史決定下一步。"
    sources:
      - "[[sources/background-agent/20261109/course/3-goal-and-harness-overview.txt#L17-L53]]"
      - "[[sources/background-agent/20261109/course/3-goal-and-harness-overview.txt#L74-L80]]"
      - "[[sources/background-agent/20261109/course/3-goal-and-harness-overview.txt#L90-L95]]"
      - "[[sources/background-agent/20261109/supplement/lessons/01-goal-and-harness/index.md#L19-L24]]"
      - "[[sources/background-agent/20261109/supplement/shared/types.ts#L1-L13]]"
      - "[[sources/background-agent/20261109/supplement/server/environment.ts#L1-L37]]"
  - id: wire-the-event-trigger
    author: "google/gemini-3.8-flash"
    title: "建立事件觸發的 Inngest 背景 Agent 工作流程"
    purpose: "能建立 incident/opened 觸發的 Inngest function，並用單一 step 包住有上限的 observe → decide 迴圈。"
    sources:
      - "[[sources/background-agent/20261109/course/4-setting-up-the-workflow.txt#L38-L69]]"
      - "[[sources/background-agent/20261109/course/4-setting-up-the-workflow.txt#L85-L177]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L58-L92]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-data.ts#L10-L14]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-data.ts#L63-L121]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-data.ts#L125-L137]]"
  - id: ask-for-one-decision
    author: "google/gemini-3.8-flash"
    title: "用結構化輸出做單步決策：記錄 Action、Reason 與 Iteration"
    purpose: "能用 schema 約束的結構化輸出取得一次決策，並把 action、reason 與 iteration 寫進紀錄。"
    sources:
      - "[[sources/background-agent/20261109/course/5-choosing-the-next-action.txt#L1-L62]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-brain.ts#L1-L41]]"
      - "[[sources/background-agent/20261109/supplement/shared/types.ts#L1-L13]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L93-L97]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-data.ts#L139-L154]]"
  - id: harness-owns-done-and-authority
    author: "google/gemini-3.8-flash"
    title: "掌控 Agent 的骨架：為什麼完成判定與行為策略都屬於 Harness"
    purpose: "能說明完成判定與 action policy 都由 harness 決定，模型只是被呼叫一次的推理函式。"
    sources:
      - "[[sources/background-agent/20261109/course/4-setting-up-the-workflow.txt#L178-L205]]"
      - "[[sources/background-agent/20261109/course/5-choosing-the-next-action.txt#L63-L110]]"
      - "[[sources/background-agent/20261109/supplement/server/tool-policy.ts#L1-L15]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-data.ts#L125-L137]]"
created: 2026-11-09
updated: 2026-11-08
---

# 給代理一個目標

## Lesson

背景代理的第一版不是更聰明的模型，而是一個由 harness 擁有的 bounded loop：先觀察目前世界，確定性檢查目標，再讓模型從小型 action catalog 選一個下一步。這個節點建立 goal、state、decision 與完成判定的邊界，讓模型只負責推理，不負責授權。

## Steps

1. [以世界狀態定義目標：結合運行狀態與執行歷史引導 Agent 決策](give-the-agent-a-goal/goal-as-observed-state.md)
2. [建立事件觸發的 Inngest 背景 Agent 工作流程](give-the-agent-a-goal/wire-the-event-trigger.md)
3. [用結構化輸出做單步決策：記錄 Action、Reason 與 Iteration](give-the-agent-a-goal/ask-for-one-decision.md)
4. [掌控 Agent 的骨架：為什麼完成判定與行為策略都屬於 Harness](give-the-agent-a-goal/harness-owns-done-and-authority.md)
