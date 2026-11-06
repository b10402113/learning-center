---
id: prompt-chaining-routing
title: Prompt chaining 與 routing
subject: ai-agent-workflows
tier: 3
order: 4
status: written
goal: 把可拆解的任務寫成 chain 或 routing 的程式碼，並在步驟之間放 gate。
digests:
  - 8-prompt-chaining.md
  - 9-prompt-chaining-example-workflow.md
  - 10-routing.md
  - practical-ai-agents-code-exercise-main.md
prerequisites:
  - learn/ai-agent-workflows/nodes/reasoning-llm-vs-agent.md
steps:
  - id: chaining-control-flow
    author: google/gemini-3.8-flash
    title: 工作流就是控制流
    purpose: 能說明 prompt chaining 是開發者寫死的控制流，並判斷什麼任務適合拆成 chain。
    sources:
      - >-
        [[sources/ai-agent-workflows/20261105/course/8-prompt-chaining.txt#L1-L51]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/8-prompt-chaining.txt#L65-L77]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/8-prompt-chaining.txt#L169-L209]]
    blocks:
      - workflow
      - control-ownership-spectrum
      - prompt-chaining
  - id: gate-and-code-chain
    author: google/gemini-3.8-flash
    title: 難的是讓程式碼流程跑起來
    purpose: 能把 chain 的兩步、JSON 中間輸出與 code gate 寫成可執行的程式碼。
    sources:
      - >-
        [[sources/ai-agent-workflows/20261105/course/9-prompt-chaining-example-workflow.txt#L13-L40]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/9-prompt-chaining-example-workflow.txt#L144-L178]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/9-prompt-chaining-example-workflow.txt#L258-L356]]
      - >-
        [[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerPromptChainWorkflow.js#L1-L104]]
    blocks:
      - prompt-chaining
  - id: routing-as-a-fork
    author: google/gemini-3.8-flash
    title: Routing 是分岔，不是序列
    purpose: 能說明 routing 是分類後只走一條預設路徑，並說出它與 sequence 的差別。
    sources:
      - '[[sources/ai-agent-workflows/20261105/course/10-routing.txt#L4-L31]]'
      - '[[sources/ai-agent-workflows/20261105/course/10-routing.txt#L32-L76]]'
    blocks:
      - routing
  - id: routing-in-code-and-cost
    author: google/gemini-3.8-flash
    title: LLM 分類，程式碼決定路徑
    purpose: >-
      能用 classifier、route table 與 fallback gate 寫出 routing，並解釋分流為何比單一大 prompt
      便宜。
    sources:
      - '[[sources/ai-agent-workflows/20261105/course/10-routing.txt#L77-L105]]'
      - '[[sources/ai-agent-workflows/20261105/course/10-routing.txt#L106-L153]]'
      - >-
        [[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerRoutingWorkflow.js#L1-L150]]
    blocks:
      - routing
      - monolithic-prompt
created: 2026-11-05
updated: 2026-11-05
---

# Prompt chaining 與 routing

## Lesson

Workflow 就是開發者寫好控制流的程式碼，LLM 只是其中一個盒子。這兩個 pattern 是最小的兩種箭頭：chain 把上一步的輸出餵給下一步，routing 則依分類結果只走一條路；兩者都能在步驟之間放一般的程式碼 gate。

## Steps

1. [工作流就是控制流](prompt-chaining-routing/chaining-control-flow.md)
2. [難的是讓程式碼流程跑起來](prompt-chaining-routing/gate-and-code-chain.md)
3. [Routing 是分岔，不是序列](prompt-chaining-routing/routing-as-a-fork.md)
4. [LLM 分類，程式碼決定路徑](prompt-chaining-routing/routing-in-code-and-cost.md)
