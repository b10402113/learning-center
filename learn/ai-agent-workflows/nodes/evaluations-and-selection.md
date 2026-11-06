---
id: evaluations-and-selection
title: "Evaluations 與選型"
subject: ai-agent-workflows
tier: 6
order: 10
status: written
goal: "為自己的場景設計最小 eval，並用 pass@k／pass^k 與成績單選出最簡單可用的系統。"
digests:
  - 27-evaluations.md
  - 28-wrapping-up.md
  - ai-agent-workflows-slides.md
prerequisites:
  - learn/ai-agent-workflows/nodes/reflexion-codeact-scorecard.md
  - learn/ai-agent-workflows/nodes/dynamic-orchestration.md
steps:
  - id: benchmarks-hide-cost-context
    author: "google/gemini-3.8-flash"
    title: "Metrics：pass@k 與 pass^k"
    purpose: "用 pass@k 與 pass^k 說明 benchmark 只看得到可靠性，並判斷哪個指標符合產品需求。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L16-L73]]"
      - "[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L74-L160]]"
      - "[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L161-L183]]"
      - "[[sources/ai-agent-workflows/20261105/supplement/ai-agent-workflows-slides.txt#L383-L406]]"
    blocks:
      - three-column-scorecard
      - benchmark-leaderboard
      - single-run-benchmark
      - pass-at-k
      - pass-hat-k
  - id: build-your-own-eval
    author: "google/gemini-3.8-flash"
    title: "建立自己的 eval"
    purpose: "從手動測試長出 20–50 題最小 eval，並避開 trajectory 與 LLM-as-judge 的偏誤。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L184-L260]]"
      - "[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L261-L359]]"
      - "[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L360-L463]]"
      - "[[sources/ai-agent-workflows/20261105/supplement/ai-agent-workflows-slides.txt#L407-L417]]"
    blocks:
      - custom-eval-set
      - trajectory-evaluation
      - eval-harness
      - eval-hacking
      - llm-as-a-judge
      - judge-bias
  - id: choose-the-simplest-system
    author: "google/gemini-3.8-flash"
    title: "挑最簡單、做得到的那個系統"
    purpose: "用三欄成績單比較候選系統，從 deterministic code 開始一次只加一個 LLM。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/28-wrapping-up.txt#L92-L127]]"
      - "[[sources/ai-agent-workflows/20261105/course/28-wrapping-up.txt#L128-L211]]"
      - "[[sources/ai-agent-workflows/20261105/course/28-wrapping-up.txt#L212-L281]]"
      - "[[sources/ai-agent-workflows/20261105/course/28-wrapping-up.txt#L282-L331]]"
      - "[[sources/ai-agent-workflows/20261105/supplement/ai-agent-workflows-slides.txt#L418-L430]]"
    blocks:
      - architecture-spectrum
      - deterministic-baseline
      - incremental-escalation
      - path-knowledge-heuristic
      - three-column-scorecard
      - feedback-vs-handoff
created: 2026-11-05
updated: 2026-11-05
---

# Evaluations 與選型

## Lesson

Benchmark 只看得到 reliability，看不到 cost 與 context；真正能幫你選型的是自己從手動測試長出來的小型 eval。這三個 step 先講 pass@k 與 pass^k 的差別、trajectory 檢查與 LLM-as-judge 的偏誤，最後把整門課收成「從最左邊的 deterministic code 開始，一次只加一個 LLM」。

## Steps

1. [Metrics：pass@k 與 pass^k](evaluations-and-selection/benchmarks-hide-cost-context.md)
2. [建立自己的 eval](evaluations-and-selection/build-your-own-eval.md)
3. [挑最簡單、做得到的那個系統](evaluations-and-selection/choose-the-simplest-system.md)
