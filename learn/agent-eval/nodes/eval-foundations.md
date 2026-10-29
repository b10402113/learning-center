---
id: eval-foundations
title: "Eval foundations: three gulfs & the lifecycle"
subject: agent-eval
tier: 1
order: 1
status: written
goal: "Explain why LLM outputs break normal software testing, and place any eval task on the Three Gulfs / Analyze–Measure–Improve map."
prerequisites: []
steps:
  - id: why-testing-breaks
    title: "為什麼 LLM 讓傳統軟體測試失效：Air Canada 與四種 eval 用法"
    purpose: "能說明 LLM 輸出為何讓傳統軟體測試失效，並區分 prelaunch evaluation 與 production monitoring 各抓什麼錯。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L140-L168]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L169-L181]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L253-L254]]"
  - id: three-gulfs
    title: "Three Gulfs：comprehension、specification、generalization 各在哪裡斷掉"
    purpose: "能判斷一個失敗屬於 comprehension、specification 還是 generalization，並說出各要怎麼補。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L182-L190]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L191-L215]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L216-L223]]"
  - id: analyze-measure-improve
    title: "Analyze–Measure–Improve：把 gulf 變成可重複的診斷迴圈"
    purpose: "能把任一 eval 任務放進 Analyze–Measure–Improve 迴圈，並說出每步的產出與對應的 gulf。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L224-L252]]"
  - id: absolute-vs-comparative
    title: "Absolute vs comparative：reference-based、reference-free、pairwise 與 leaderboard"
    purpose: "能依「夠不夠好能上線」或「哪個更好」選 absolute（reference-based/free）或 comparative evaluation。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L696-L714]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L255-L268]]"
created: 2026-10-29
updated: 2026-10-29
---

# Eval foundations: three gulfs & the lifecycle

## Lesson

Before touching a tool, this node builds the shared map: why LLM applications resist traditional testing, and how the Three Gulfs and the Analyze–Measure–Improve lifecycle organize everything that follows. It also separates durable principles from fast-moving technique, so later threads hang off a frame you can reason with rather than a pile of metrics.

## Steps

1. [為什麼 LLM 讓傳統軟體測試失效：Air Canada 與四種 eval 用法](eval-foundations/why-testing-breaks.md)
2. [Three Gulfs：comprehension、specification、generalization 各在哪裡斷掉](eval-foundations/three-gulfs.md)
3. [Analyze–Measure–Improve：把 gulf 變成可重複的診斷迴圈](eval-foundations/analyze-measure-improve.md)
4. [Absolute vs comparative：reference-based、reference-free、pairwise 與 leaderboard](eval-foundations/absolute-vs-comparative.md)
