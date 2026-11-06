---
id: parallelization-workflows-scorecard
title: "Parallelization 與其他 workflows：workflows 成績單"
subject: ai-agent-workflows
tier: 3
order: 5
status: written
goal: "選出正確的 workflow 形狀（sectioning／voting／evaluator-optimizer／orchestrator-workers），並用三欄成績單說明選擇。"
digests:
  - 11-parallelization-other-workflows.md
  - 12-workflows-scorecard.md
  - practical-ai-agents-code-exercise-main.md
prerequisites:
  - learn/ai-agent-workflows/nodes/prompt-chaining-routing.md
steps:
  - id: parallelization-and-fixed-workflows
    author: "google/gemini-3.8-flash"
    title: "在固定結構裡選分支，不等於決定結構本身"
    purpose: "用 sectioning、voting、evaluator-optimizer、orchestrator-workers 排出固定 workflow，並說出箭頭由誰決定。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L1-L18]]"
      - "[[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L19-L32]]"
      - "[[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L33-L54]]"
      - "[[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L55-L69]]"
      - "[[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L70-L85]]"
      - "[[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L86-L129]]"
      - "[[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L130-L163]]"
      - "[[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L164-L210]]"
      - "[[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L211-L269]]"
      - "[[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L270-L302]]"
      - "[[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L303-L342]]"
      - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerParallelWorkflow.js#L1-L154]]"
      - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerEvaluatorOptimizerWorkflow.js#L1-L155]]"
      - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerOrchestratorWorkersWorkflow.js#L1-L177]]"
  - id: workflows-scorecard
    author: "google/gemini-3.8-flash"
    title: "成績單：context 有界、可靠度高、成本可控"
    purpose: "用 context、reliability、cost 三欄成績單選出 workflow 形狀，並在失敗時決定回錯或收尾。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt#L1-L16]]"
      - "[[sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt#L17-L40]]"
      - "[[sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt#L41-L73]]"
      - "[[sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt#L74-L105]]"
      - "[[sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt#L106-L132]]"
      - "[[sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt#L133-L150]]"
      - "[[sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt#L151-L174]]"
      - "[[sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt#L175-L192]]"
      - "[[sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt#L193-L218]]"
created: 2026-11-05
updated: 2026-11-05
---

# Parallelization 與其他 workflows：workflows 成績單

## Lesson

平行化、evaluator-optimizer 與 orchestrator-workers 把多個 LLM 呼叫排成固定圖形，仍然由開發者決定箭頭。這兩個 step 一方面補齊 workflow 的形狀，一方面用 context、reliability、cost 三欄成績單說明每個形狀什麼時候划算。

## Steps

1. [在固定結構裡選分支，不等於決定結構本身](parallelization-workflows-scorecard/parallelization-and-fixed-workflows.md)
2. [成績單：context 有界、可靠度高、成本可控](parallelization-workflows-scorecard/workflows-scorecard.md)
