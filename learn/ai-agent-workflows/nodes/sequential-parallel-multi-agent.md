---
id: sequential-parallel-multi-agent
title: "Sequential 與 parallel multi-agent"
subject: ai-agent-workflows
tier: 5
order: 8
status: written
goal: "把單一 agent 組成 fixed pipeline 或 fan-out／merge，並說出交接物件與合併步驟的失敗模式。"
digests:
  - 19-sequential-agents.md
  - 20-sequential-agents-workflow-example.md
  - 21-multi-agent-parallelization.md
  - practical-ai-agents-code-exercise-main.md
prerequisites:
  - learn/ai-agent-workflows/nodes/react-plan-execute.md
steps:
  - id: sequential-agents-as-pipeline
    author: "google/gemini-3.8-flash"
    title: "Sequential：每一步都是一個完整 agent 的管線"
    purpose: "用「每一步都是完整 agent 的固定管線」解釋 sequential multi-agent，並說出它在 context、reliability、cost、latency 上的取捨。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L1-L13]]"
      - "[[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L14-L38]]"
      - "[[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L39-L55]]"
      - "[[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L56-L68]]"
      - "[[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L69-L94]]"
      - "[[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L95-L106]]"
      - "[[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L107-L131]]"
      - "[[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L132-L171]]"
      - "[[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L172-L190]]"
      - "[[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L191-L199]]"
      - "[[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L200-L220]]"
      - "[[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L221-L240]]"
  - id: sequential-pipeline-in-code
    author: "google/gemini-3.8-flash"
    title: "Sequential agents：用 plain code 跑固定順序的管線"
    purpose: "實作 fixed-order 管線：各自的 ReAct 迴圈、maxSteps 停止條件、handoff gate，以及只把交接物件傳給下一棒。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L1-L19]]"
      - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L20-L37]]"
      - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L38-L59]]"
      - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L60-L74]]"
      - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L75-L91]]"
      - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L92-L118]]"
      - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L119-L132]]"
      - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L133-L158]]"
      - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L159-L178]]"
      - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L179-L198]]"
      - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L199-L219]]"
      - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L220-L240]]"
      - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L241-L253]]"
      - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerSequentialMultiAgent.js#L1-L126]]"
      - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerSequentialMultiAgent.js#L127-L184]]"
  - id: parallel-fanout-and-voting
    author: "google/gemini-3.8-flash"
    title: "Parallelization：sectioning 與 voting 的 fan-out／merge"
    purpose: "把同一請求做成 sectioning 或 voting 的 fan-out／merge，並說出合併步驟的失敗模式與何時該拆掉這個模式。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt#L1-L18]]"
      - "[[sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt#L19-L40]]"
      - "[[sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt#L41-L51]]"
      - "[[sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt#L52-L84]]"
      - "[[sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt#L85-L131]]"
      - "[[sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt#L132-L171]]"
      - "[[sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt#L172-L198]]"
      - "[[sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt#L199-L229]]"
      - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerParallelMultiAgent.js#L1-L145]]"
      - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerParallelMultiAgent.js#L146-L260]]"
created: 2026-11-05
updated: 2026-11-05
---

# Sequential 與 parallel multi-agent

## Lesson

多個 agent 不是自動更好，而是用更多 context 與成本換 specialization。這三個 step 先看 sequential 把完整 agent 串成固定 pipeline，再看 parallel 把同一請求分給多個 agent 或做投票，重點都在交接物件、合併步驟與錯誤如何沿著管線放大。

## Steps

1. [Sequential：每一步都是一個完整 agent 的管線](sequential-parallel-multi-agent/sequential-agents-as-pipeline.md)
2. [Sequential agents：用 plain code 跑固定順序的管線](sequential-parallel-multi-agent/sequential-pipeline-in-code.md)
3. [Parallelization：sectioning 與 voting 的 fan-out／merge](sequential-parallel-multi-agent/parallel-fanout-and-voting.md)
