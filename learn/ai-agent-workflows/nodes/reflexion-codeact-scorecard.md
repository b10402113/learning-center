---
id: reflexion-codeact-scorecard
title: "Reflexion、CodeAct 與 single-agent 成績單"
subject: ai-agent-workflows
tier: 4
order: 7
status: written
goal: "用外部訊號替單一 agent 加上反思迴圈，並說明它相對 workflow 的代價。"
digests:
  - 7-planning-reflection.md
  - 16-reflexion-self-refining.md
  - 17-codeact.md
  - 18-single-agent-systems-scorecard.md
  - practical-ai-agents-code-exercise-main.md
prerequisites:
  - learn/ai-agent-workflows/nodes/react-plan-execute.md
steps:
  - id: reflection-with-a-real-signal
    author: "google/gemini-3.8-flash"
    title: "Reflection 要有真正的訊號告訴模型它錯了"
    purpose: "分辨 reflection 與 self-refine，並用外部訊號與停止條件設計可靠的重試迴圈。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L91-L113]]"
      - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L114-L144]]"
      - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L145-L179]]"
      - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L180-L219]]"
      - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L317-L351]]"
      - "[[sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt#L1-L7]]"
      - "[[sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt#L8-L17]]"
      - "[[sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt#L18-L27]]"
      - "[[sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt#L28-L48]]"
      - "[[sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt#L49-L64]]"
      - "[[sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt#L65-L89]]"
      - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerEvaluatorOptimizerWorkflow.js#L1-L155]]"
  - id: reflexion-memory-across-attempts
    author: "google/gemini-3.8-flash"
    title: "Reflexion：反思累積在記憶裡"
    purpose: "用 actor／evaluator／self-reflection 三實體與跨嘗試記憶，讓 agent 從同一任務的失敗中改進。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L220-L259]]"
      - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L260-L283]]"
      - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L284-L300]]"
      - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L301-L316]]"
      - "[[sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt#L90-L108]]"
      - "[[sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt#L109-L132]]"
      - "[[sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt#L133-L151]]"
  - id: codeact-actions-as-code
    author: "google/gemini-3.8-flash"
    title: "CodeAct：動作是可執行的程式碼，而不是 JSON"
    purpose: "把 JSON 工具呼叫改成沙箱內執行的程式碼，並說明它省下的回合與換來的風險。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/17-codeact.txt#L1-L8]]"
      - "[[sources/ai-agent-workflows/20261105/course/17-codeact.txt#L9-L27]]"
      - "[[sources/ai-agent-workflows/20261105/course/17-codeact.txt#L28-L48]]"
      - "[[sources/ai-agent-workflows/20261105/course/17-codeact.txt#L49-L70]]"
      - "[[sources/ai-agent-workflows/20261105/course/17-codeact.txt#L71-L93]]"
      - "[[sources/ai-agent-workflows/20261105/course/17-codeact.txt#L94-L116]]"
      - "[[sources/ai-agent-workflows/20261105/course/17-codeact.txt#L117-L127]]"
  - id: single-agent-scorecard
    author: "google/gemini-3.8-flash"
    title: "單一 Agent 計分卡：我們換到了適應力"
    purpose: "用 context、reliability、cost、adaptability 四欄說明單一 agent 相對 workflow 的代價與回報。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/18-single-agent-systems-scorecard.txt#L1-L7]]"
      - "[[sources/ai-agent-workflows/20261105/course/18-single-agent-systems-scorecard.txt#L8-L26]]"
      - "[[sources/ai-agent-workflows/20261105/course/18-single-agent-systems-scorecard.txt#L27-L52]]"
      - "[[sources/ai-agent-workflows/20261105/course/18-single-agent-systems-scorecard.txt#L53-L64]]"
      - "[[sources/ai-agent-workflows/20261105/course/18-single-agent-systems-scorecard.txt#L65-L71]]"
      - "[[sources/ai-agent-workflows/20261105/course/18-single-agent-systems-scorecard.txt#L72-L97]]"
      - "[[sources/ai-agent-workflows/20261105/course/18-single-agent-systems-scorecard.txt#L98-L112]]"
      - "[[sources/ai-agent-workflows/20261105/course/18-single-agent-systems-scorecard.txt#L113-L141]]"
created: 2026-11-05
updated: 2026-11-05
---

# Reflexion、CodeAct 與 single-agent 成績單

## Lesson

反思只有在有真實外部訊號時才可靠，而 CodeAct 把動作換成可執行的程式碼，兩者都在扩大單一 agent 的能力邊界。這些 step 用 planning／reflection 的理論打底，實作 Reflexion 與 CodeAct，最後用成績單說明單一 agent 相對 workflow 多換到了什麼、又付出了什麼。

## Steps

1. [Reflection 要有真正的訊號告訴模型它錯了](reflexion-codeact-scorecard/reflection-with-a-real-signal.md)
2. [Reflexion：反思累積在記憶裡](reflexion-codeact-scorecard/reflexion-memory-across-attempts.md)
3. [CodeAct：動作是可執行的程式碼，而不是 JSON](reflexion-codeact-scorecard/codeact-actions-as-code.md)
4. [單一 Agent 計分卡：我們換到了適應力](reflexion-codeact-scorecard/single-agent-scorecard.md)
