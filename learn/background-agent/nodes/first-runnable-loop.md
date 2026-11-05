---
id: first-runnable-loop
title: "第一個可跑的迴圈"
subject: background-agent
tier: 2
order: 7
status: confirmed
goal: "能實作 observe → 目標檢查 → chooseAction → 執行，並用決策上限收尾。"
digests:
  - 4-setting-up-the-workflow.md
  - 5-choosing-the-next-action.md
  - 6-custom-tool-loop.md
  - 7-loop-walkthrough.md
  - 8-running-the-background-agents.md
  - lessons-01-goal-and-harness.md
  - server.md
prerequisites:
  - learn/background-agent/nodes/give-the-agent-a-goal.md
  - learn/background-agent/nodes/the-authority-question.md
  - learn/background-agent/nodes/setup-three-processes.md
steps:
  - id: trigger-to-observation
    title: "事件是門鈴，不是世界狀態"
    purpose: "能從觸發事件取得 run，並在每輪重讀 checkout 的 /state 組出世界快照。"
    sources:
      - "[[sources/background-agent/20261105/4-setting-up-the-workflow.vtt#L692-L799]]"
      - "[[sources/background-agent/20261105/4-setting-up-the-workflow.vtt#L800-L939]]"
      - "[[sources/background-agent/20261105/4-setting-up-the-workflow.vtt#L940-L1147]]"
      - "[[sources/background-agent/20261105/7-loop-walkthrough.vtt#L30-L57]]"
      - "[[sources/background-agent/20261105/lessons/01-goal-and-harness/index.md#L6-L18]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L72-L85]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L63-L121]]"
      - "[[sources/background-agent/20261105/server/observe.ts#L1-L17]]"
  - id: check-the-goal-before-spending-tokens
    title: "不用 LLM 決定目標是否完成"
    purpose: "能用 goalSatisfied 對 world state 做確定性完成判定，達標就寫報告並結束 run。"
    sources:
      - "[[sources/background-agent/20261105/4-setting-up-the-workflow.vtt#L539-L637]]"
      - "[[sources/background-agent/20261105/4-setting-up-the-workflow.vtt#L940-L1147]]"
      - "[[sources/background-agent/20261105/4-setting-up-the-workflow.vtt#L1148-L1338]]"
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L524-L597]]"
      - "[[sources/background-agent/20261105/7-loop-walkthrough.vtt#L46-L57]]"
      - "[[sources/background-agent/20261105/7-loop-walkthrough.vtt#L412-L519]]"
      - "[[sources/background-agent/20261105/lessons/01-goal-and-harness/index.md#L6-L18]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L125-L137]]"
      - "[[sources/background-agent/20261105/server/environment.ts#L7-L13]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L87-L91]]"
  - id: ask-and-record-one-decision
    title: "這裡沒有 messages"
    purpose: "能用無狀態的 chooseAction 取得結構化決策，並記錄 iteration 與 decision 作為稽核軌跡。"
    sources:
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L46-L135]]"
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L136-L169]]"
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L170-L251]]"
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L252-L321]]"
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L322-L342]]"
      - "[[sources/background-agent/20261105/5-choosing-the-next-action.vtt#L343-L432]]"
      - "[[sources/background-agent/20261105/7-loop-walkthrough.vtt#L58-L112]]"
      - "[[sources/background-agent/20261105/lessons/01-goal-and-harness/index.md#L19-L24]]"
      - "[[sources/background-agent/20261105/server/agent-brain.ts#L8-L41]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L45-L55]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L139-L154]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L93-L97]]"
  - id: gate-and-execute-actions
    title: "迴圈由我控制"
    purpose: "能在執行前攔下特殊動作，並用 actionId 與 expectedVersion 安全地呼叫 service。"
    sources:
      - "[[sources/background-agent/20261105/6-custom-tool-loop.vtt#L1-L54]]"
      - "[[sources/background-agent/20261105/6-custom-tool-loop.vtt#L176-L210]]"
      - "[[sources/background-agent/20261105/6-custom-tool-loop.vtt#L211-L299]]"
      - "[[sources/background-agent/20261105/6-custom-tool-loop.vtt#L300-L399]]"
      - "[[sources/background-agent/20261105/6-custom-tool-loop.vtt#L400-L569]]"
      - "[[sources/background-agent/20261105/6-custom-tool-loop.vtt#L570-L694]]"
      - "[[sources/background-agent/20261105/6-custom-tool-loop.vtt#L695-L799]]"
      - "[[sources/background-agent/20261105/7-loop-walkthrough.vtt#L113-L246]]"
      - "[[sources/background-agent/20261105/server/tool-policy.ts#L1-L15]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L20-L56]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L141-L195]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L156-L173]]"
  - id: run-it-to-the-decision-limit
    title: "決策上限到了"
    purpose: "能從 dashboard 追蹤每輪觀察與決策，並說明決策上限如何收尾。"
    sources:
      - "[[sources/background-agent/20261105/6-custom-tool-loop.vtt#L800-L877]]"
      - "[[sources/background-agent/20261105/7-loop-walkthrough.vtt#L247-L411]]"
      - "[[sources/background-agent/20261105/7-loop-walkthrough.vtt#L520-L635]]"
      - "[[sources/background-agent/20261105/8-running-the-background-agents.vtt#L61-L111]]"
      - "[[sources/background-agent/20261105/8-running-the-background-agents.vtt#L112-L207]]"
      - "[[sources/background-agent/20261105/8-running-the-background-agents.vtt#L208-L285]]"
      - "[[sources/background-agent/20261105/8-running-the-background-agents.vtt#L286-L362]]"
      - "[[sources/background-agent/20261105/8-running-the-background-agents.vtt#L363-L526]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L196-L216]]"
      - "[[sources/background-agent/20261105/lessons/01-goal-and-harness/index.md#L115-L121]]"
created: 2026-11-05
updated: 2026-11-05
---

# 第一個可跑的迴圈

## Lesson

最小可用的代理就是一個有上限的迴圈：讀狀態、檢查目標、問模型下一步、執行或停下。這個節點把 Inngest function、確定性的完成判定、結構化決策與 action 執行接成一條線，並用儀表板確認它真的在跑。

## Steps

1. [事件是門鈴，不是世界狀態](first-runnable-loop/trigger-to-observation.md)
2. [不用 LLM 決定目標是否完成](first-runnable-loop/check-the-goal-before-spending-tokens.md)
3. [這裡沒有 messages](first-runnable-loop/ask-and-record-one-decision.md)
4. [迴圈由我控制](first-runnable-loop/gate-and-execute-actions.md)
5. [決策上限到了](first-runnable-loop/run-it-to-the-decision-limit.md)
