---
id: the-world-and-the-goal
title: "Agent 眼中的世界與目標"
subject: background-agents
tier: 1
order: 2
status: confirmed
goal: "說出 agent 做決策時真正看到什麼（world state 快照、run state、execution history），以及目標是機械可驗證的 GoalCondition、動作目錄為什麼很小。"
digests:
  - 3-goal-and-harness-overview.md
  - 4-setting-up-the-workflow.md
  - 5-choosing-the-next-action.md
  - 7-loop-walkthrough.md
prerequisites: []
steps:
  - id: world-is-a-state-snapshot
    title: "世界是狀態快照：agent 看到的是服務狀態，不是對話紀錄"
    purpose: "能說出 background agent 的世界是被監控服務的狀態快照，並用截圖類比它如何被展示。"
    sources:
      - "[[sources/background-agents/20261027/3-goal-and-harness-overview.md#L7-L32]]"
  - id: three-inputs-to-a-decision
    title: "決策真正看到的三樣東西：world state、run state、execution history"
    purpose: "能說出每次決策由 world state、run state、execution history 支撐，且觀察由 harness 每輪自動餵入。"
    sources:
      - "[[sources/background-agents/20261027/3-goal-and-harness-overview.md#L33-L68]]"
      - "[[sources/background-agents/20261027/4-setting-up-the-workflow.md#L102-L111]]"
  - id: goal-is-a-mechanical-check
    title: "目標不是一句話，是機械可驗證的 GoalCondition"
    purpose: "能說出目標是 deterministic 的 goalSatisfied 檢查而非 LLM 主觀判斷，並知道何時才換成 LLM。"
    sources:
      - "[[sources/background-agents/20261027/4-setting-up-the-workflow.md#L118-L144]]"
      - "[[sources/background-agents/20261027/5-choosing-the-next-action.md#L61-L67]]"
      - "[[sources/background-agents/20261027/5-choosing-the-next-action.md#L81-L87]]"
      - "[[sources/background-agents/20261027/7-loop-walkthrough.md#L58-L76]]"
  - id: why-the-action-catalog-is-small
    title: "動作目錄為什麼很小：LLM 只選下一步，harness 把關"
    purpose: "能說出動作目錄小的原因：LLM 無狀態、只選下一步，危險動作由 harness 再驗證。"
    sources:
      - "[[sources/background-agents/20261027/3-goal-and-harness-overview.md#L33-L68]]"
      - "[[sources/background-agents/20261027/3-goal-and-harness-overview.md#L69-L87]]"
      - "[[sources/background-agents/20261027/5-choosing-the-next-action.md#L6-L14]]"
created: 2026-10-27
updated: 2026-10-31
---

# Agent 眼中的世界與目標

## Lesson

對背景 agent 而言，「世界」是被監控服務的狀態快照，不是一段聊天紀錄。目標是機械可驗證的 GoalCondition，動作目錄小到只有七個。這節把 observe-decide-act 的輸入與輸出釘死在程式契約上。

## Steps

1. [世界是狀態快照：agent 看到的是服務狀態，不是對話紀錄](the-world-and-the-goal/world-is-a-state-snapshot.md)
2. [決策真正看到的三樣東西：world state、run state、execution history](the-world-and-the-goal/three-inputs-to-a-decision.md)
3. [目標不是一句話，是機械可驗證的 GoalCondition](the-world-and-the-goal/goal-is-a-mechanical-check.md)
4. [動作目錄為什麼很小：LLM 只選下一步，harness 把關](the-world-and-the-goal/why-the-action-catalog-is-small.md)
