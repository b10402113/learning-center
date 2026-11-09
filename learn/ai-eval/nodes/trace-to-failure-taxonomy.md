---
id: trace-to-failure-taxonomy
title: "從 trace 到 failure taxonomy"
subject: ai-eval
tier: 1
order: 4
status: written
goal: "能為 agent 建立可追蹤的 run，讀完整 trace、標註 pass/fail，聚類成可數且可排序的 failure codes。"
digests:
  - lesson1.en.md
  - ByteByteGo_AI_Evals_Week1_SlideDeck.md
  - lesson2.en.md
  - week-01-assignments v1.md
prerequisites:
  - learn/ai-eval/nodes/six-quality-dimensions.md
  - learn/ai-eval/nodes/task-dataset-scorer.md
steps:
  - id: instrument-agent-runs
    author: "google/gemini-3.8-flash"
    title: "為 Agent 每次 Run 建立 Session、Turn 到 Span 的完整 Trace"
    purpose: "能為 agent 每次 run 建立含 session→turn→span 的 trace，讓失敗可被完整回放與檢查。"
    sources:
      - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L1301-L1400]]"
      - "[[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L531-L640]]"
      - "[[sources/ai-eval/20261108/supplement/lesson2.en.txt#L261-L360]]"
      - "[[sources/ai-eval/20261108/supplement/code/week-01-assignments v1.txt#L11-L24]]"
    blocks:
      - agent-trace
      - logs-vs-traces
  - id: annotate-trace-outcomes
    author: "google/gemini-3.8-flash"
    title: "讀懂一條 Trace：逐筆標註 Pass/Fail 與具體原因"
    purpose: "能從頭讀完一條 trace，逐筆標註 pass/fail 與簡短理由，而不是只看 log 或最終答案。"
    sources:
      - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L1401-L1500]]"
      - "[[sources/ai-eval/20261108/supplement/lesson2.en.txt#L171-L260]]"
      - "[[sources/ai-eval/20261108/supplement/code/week-01-assignments v1.txt#L20-L35]]"
    blocks:
      - error-analysis
  - id: cluster-failure-codes
    author: "google/gemini-3.8-flash"
    title: "從失敗 Trace 歸納出清楚可數的 Failure Code"
    purpose: "能把失敗 trace 聚類成名稱固定、二元、具體、可數的 failure codes。"
    sources:
      - "[[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L431-L530]]"
      - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L1501-L1600]]"
      - "[[sources/ai-eval/20261108/supplement/code/week-01-assignments v1.txt#L36-L52]]"
    blocks:
      - failure-taxonomy
  - id: prioritize-failure-taxonomy
    author: "google/gemini-3.8-flash"
    title: "用頻率與嚴重度排定修復順序：建立失敗分類法與回歸案例"
    purpose: "能用 frequency × severity 排出要修的 failure modes，並產出可交接的 taxonomy 與回歸案例。"
    sources:
      - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L1601-L1700]]"
      - "[[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L641-L720]]"
      - "[[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L721-L852]]"
      - "[[sources/ai-eval/20261108/supplement/code/week-01-assignments v1.txt#L53-L64]]"
    blocks:
      - frequency-severity-priority
      - failure-taxonomy
created: 2026-11-08
updated: 2026-11-08
---

# 從 trace 到 failure taxonomy

## Lesson

Week 1 的實作核心：把 Pronto agent 的每個 run 變成可讀的 trace，逐條標註 pass/fail，再把失敗聚類成命名、二元、具體、可數的 failure codes。方法順序是 trace → annotate → cluster → 用 frequency × severity 排序。最後產出的 taxonomy 決定下週第一個 judge 要量什麼。

## Steps

1. [為 Agent 每次 Run 建立 Session、Turn 到 Span 的完整 Trace](trace-to-failure-taxonomy/instrument-agent-runs.md)
2. [讀懂一條 Trace：逐筆標註 Pass/Fail 與具體原因](trace-to-failure-taxonomy/annotate-trace-outcomes.md)
3. [從失敗 Trace 歸納出清楚可數的 Failure Code](trace-to-failure-taxonomy/cluster-failure-codes.md)
4. [用頻率與嚴重度排定修復順序：建立失敗分類法與回歸案例](trace-to-failure-taxonomy/prioritize-failure-taxonomy.md)
