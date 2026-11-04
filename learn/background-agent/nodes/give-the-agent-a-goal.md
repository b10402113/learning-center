---
id: give-the-agent-a-goal
title: "給代理一個目標"
subject: background-agent
tier: 1
order: 2
status: written
goal: "能畫出 observe → decide → act 迴圈，並指出 harness 擁有工具目錄、決策上限與完成判定。"
digests:
  - 3-goal-and-harness-overview.md
  - 5-choosing-the-next-action.md
  - lessons-01-goal-and-harness.md
  - server.md
prerequisites:
  - learn/background-agent/nodes/build-agents-that-never-sleep.md
steps:
  - id: the-loop-is-observe-decide-act
    author: "google/gemini-3.8-flash"
    title: "觀察 → 決定 → 行動：把觀察內建在 harness"
    purpose: "能畫出 observe → decide → act 迴圈，並說明觀察為何由 harness 每輪重讀，而不是模型自己選。"
    sources:
      - "[[sources/background-agent/20261105/3-goal-and-harness-overview.vtt#L1-L44]]"
      - "[[sources/background-agent/20261105/3-goal-and-harness-overview.vtt#L217-L340]]"
      - "[[sources/background-agent/20261105/lessons/01-goal-and-harness/index.md#L6-L18]]"
  - id: four-states-and-a-tiny-toolbox
    author: "google/gemini-3.8-flash"
    title: "四種不同的資訊，一份很小的工具清單"
    purpose: "能區分 world、run、execution、event 四種資訊，並說出代理可選的極小工具目錄。"
    sources:
      - "[[sources/background-agent/20261105/3-goal-and-harness-overview.vtt#L501-L560]]"
      - "[[sources/background-agent/20261105/3-goal-and-harness-overview.vtt#L621-L657]]"
      - "[[sources/background-agent/20261105/lessons/01-goal-and-harness/index.md#L19-L24]]"
      - "[[sources/background-agent/20261105/server/tool-policy.ts#L1-L15]]"
  - id: the-model-makes-one-stateless-decision
    author: "google/gemini-3.8-flash"
    title: "一次性的呼叫，無狀態的決策"
    purpose: "能說明 chooseAction 是無狀態的單次結構化輸出，並解釋 action、reason、detail 與決策紀錄的作用。"
    sources:
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L1-L45]]"
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L46-L135]]"
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L136-L169]]"
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L170-L251]]"
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L252-L321]]"
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L322-L432]]"
      - "[[sources/background-agent/20261105/server/agent-brain.ts#L8-L41]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L139-L154]]"
  - id: the-goal-check-stays-deterministic
    author: "google/gemini-3.8-flash"
    title: "目標達標與否，交給確定性檢查"
    purpose: "能說明完成判定是 harness 的確定性檢查，並在模型宣告完成時先檢查 goalCondition 少了什麼。"
    sources:
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L524-L597]]"
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L826-L936]]"
      - "[[sources/background-agent/20261105/lessons/01-goal-and-harness/index.md#L6-L18]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L87-L139]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L125-L137]]"
      - "[[sources/background-agent/20261105/server/environment.ts#L7-L13]]"
  - id: the-harness-caps-the-loop
    author: "google/gemini-3.8-flash"
    title: "決策上限與 terminal 狀態：讓迴圈停下來"
    purpose: "能說明決策上限與 terminal 狀態如何讓迴圈停下來，而不是讓模型自己決定何時結束。"
    sources:
      - "[[sources/background-agent/20261105/3-goal-and-harness-overview.vtt#L1-L44]]"
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L433-L523]]"
      - "[[sources/background-agent/20261105/lessons/01-goal-and-harness/index.md#L35-L114]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L58-L86]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L214-L214]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L16-L43]]"
created: 2026-11-05
updated: 2026-11-04
---

# 給代理一個目標

## Lesson

代理不是一直被餵 prompt，而是反覆觀察世界、選一個動作、交給 harness 驗證後執行。這個節點把 observe → decide → act 迴圈、四種資訊（world／run／history／event）與極小的 action catalog 一次講清楚。

## Steps

1. [觀察 → 決定 → 行動：把觀察內建在 harness](give-the-agent-a-goal/the-loop-is-observe-decide-act.md)
2. [四種不同的資訊，一份很小的工具清單](give-the-agent-a-goal/four-states-and-a-tiny-toolbox.md)
3. [一次性的呼叫，無狀態的決策](give-the-agent-a-goal/the-model-makes-one-stateless-decision.md)
4. [目標達標與否，交給確定性檢查](give-the-agent-a-goal/the-goal-check-stays-deterministic.md)
5. [決策上限與 terminal 狀態：讓迴圈停下來](give-the-agent-a-goal/the-harness-caps-the-loop.md)
