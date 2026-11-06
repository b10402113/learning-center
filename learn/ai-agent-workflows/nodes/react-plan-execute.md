---
id: react-plan-execute
title: Single-agent 系統：ReAct 與 plan-and-execute
subject: ai-agent-workflows
tier: 4
order: 6
status: written
goal: 實作有停止條件的 ReAct 迴圈，並判斷何時改用 plan-and-execute。
digests:
  - 13-what-is-a-single-agent-system.md
  - 14-react.md
  - 15-plan-execute.md
  - practical-ai-agents-code-exercise-main.md
prerequisites:
  - learn/ai-agent-workflows/nodes/tools-mcp-skills.md
  - learn/ai-agent-workflows/nodes/rag-context-memory.md
  - learn/ai-agent-workflows/nodes/prompt-chaining-routing.md
steps:
  - id: single-agent-is-a-loop
    author: google/gemini-3.8-flash
    title: Agent 是迴圈，不是模型
    purpose: 能定義 single-agent 系統，並為它加上 max turns、token 或成本等停止條件。
    sources:
      - >-
        [[sources/ai-agent-workflows/20261105/course/13-what-is-a-single-agent-system.txt#L1-L13]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/13-what-is-a-single-agent-system.txt#L14-L34]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/13-what-is-a-single-agent-system.txt#L35-L66]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/13-what-is-a-single-agent-system.txt#L67-L77]]
    blocks:
      - agent-loop
      - single-agent-system
  - id: react-reason-act-observe
    author: google/gemini-3.8-flash
    title: 推理與行動
    purpose: 能說出 ReAct 的 thought／action／observation 迴圈，以及它為何不是 workflow。
    sources:
      - '[[sources/ai-agent-workflows/20261105/course/14-react.txt#L1-L25]]'
      - '[[sources/ai-agent-workflows/20261105/course/14-react.txt#L26-L45]]'
      - '[[sources/ai-agent-workflows/20261105/course/14-react.txt#L46-L92]]'
      - '[[sources/ai-agent-workflows/20261105/course/14-react.txt#L198-L227]]'
      - '[[sources/ai-agent-workflows/20261105/course/14-react.txt#L228-L254]]'
    blocks:
      - react
  - id: react-in-code
    author: google/gemini-3.8-flash
    title: 一個 LLM 在迴圈裡跑
    purpose: 能用 system prompt、工具表與 transcript 寫出有停止條件的 ReAct 執行迴圈。
    sources:
      - '[[sources/ai-agent-workflows/20261105/course/14-react.txt#L255-L308]]'
      - '[[sources/ai-agent-workflows/20261105/course/14-react.txt#L309-L354]]'
      - '[[sources/ai-agent-workflows/20261105/course/14-react.txt#L355-L394]]'
      - '[[sources/ai-agent-workflows/20261105/course/14-react.txt#L395-L434]]'
      - >-
        [[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/single-agents/careerReActAgent.js#L1-L146]]
    blocks:
      - react-system-prompt
  - id: plan-and-execute
    author: google/gemini-3.8-flash
    title: 先規劃，再執行
    purpose: 能實作一次規劃、固定執行的 agent，並依任務是否需要在途中改計畫選 ReAct 或 plan-and-execute。
    sources:
      - >-
        [[sources/ai-agent-workflows/20261105/course/15-plan-execute.txt#L1-L24]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/15-plan-execute.txt#L25-L58]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/15-plan-execute.txt#L59-L75]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/15-plan-execute.txt#L76-L126]]
      - >-
        [[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/single-agents/careerPlanAndExecuteAgent.js#L1-L145]]
      - >-
        [[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/single-agents/careerPlanAndExecuteAgent.js#L146-L207]]
    blocks:
      - plan-and-execute
created: 2026-11-05
updated: 2026-11-05
---

# Single-agent 系統：ReAct 與 plan-and-execute

## Lesson

當模型開始決定下一個動作，系統就從 workflow 變成 agent；而 agent 的核心是一個有停止條件的迴圈，不是模型本身。這四個 step 先定義 single-agent system，再拆開 ReAct 的迴圈機制與程式實作，最後對照一次規劃、固定執行的 plan-and-execute。

## Steps

1. [Agent 是迴圈，不是模型](react-plan-execute/single-agent-is-a-loop.md)
2. [推理與行動](react-plan-execute/react-reason-act-observe.md)
3. [一個 LLM 在迴圈裡跑](react-plan-execute/react-in-code.md)
4. [先規劃，再執行](react-plan-execute/plan-and-execute.md)
