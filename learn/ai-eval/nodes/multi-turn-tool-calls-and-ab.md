---
id: multi-turn-tool-calls-and-ab
title: "多輪對話、tool call 與 A/B"
subject: ai-eval
tier: 2
order: 8
status: written
goal: "能評分多輪對話與 tool call，並用 per-metric delta 做一次誠實的 A/B ship/no-ship 決策。"
digests:
  - lesson3.en.md
  - AI_Evals_InPractice_Week2_Deck.md
prerequisites:
  - learn/ai-eval/nodes/validate-the-judge.md
steps:
  - id: evaluate-conversations-not-turns
    author: "google/gemini-3.8-flash"
    title: "從單輪到會話層：用三大指標評估多輪對話"
    purpose: "能在會話層用 context retention、state accuracy 與 coherence 評分多輪對話，而不是只看單輪。"
    sources:
      - "[[sources/ai-eval/20261108/course/lesson3.en.txt#L121-L280]]"
      - "[[sources/ai-eval/20261108/course/lesson3.en.txt#L1161-L1330]]"
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L461-L583]]"
  - id: score-tool-calls-three-layers
    author: "google/gemini-3.8-flash"
    title: "評估 Tool Call 的三層結構與路徑選擇"
    purpose: "能分 schema、arguments、semantics 三層評分 tool call，並指出合法 JSON 也可能意圖錯誤。"
    sources:
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L461-L583]]"
      - "[[sources/ai-eval/20261108/course/lesson3.en.txt#L1501-L1680]]"
  - id: run-a-b-and-read-per-metric-deltas
    author: "google/gemini-3.8-flash"
    title: "用離線 A/B 評估做安全的發布決策"
    purpose: "能只改一個變數跑同一組案例，逐指標讀 delta 後做出 ship／no-ship 決策。"
    sources:
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L584-L700]]"
      - "[[sources/ai-eval/20261108/course/lesson3.en.txt#L1501-L1680]]"
      - "[[sources/ai-eval/20261108/course/lesson3.en.txt#L1681-L1830]]"
created: 2026-11-08
updated: 2026-11-09
---

# 多輪對話、tool call 與 A/B

## Lesson

真實 agent 不是單輪 QA：會話層要量 context retention、state accuracy 與 coherence，tool call 要分 schema、arguments、semantics 三層，合法的 JSON 也可能意圖錯誤。這條節點最後把 A/B 講清楚：一次只改一個變數、跑同一組案例、逐指標讀 delta，而不是看一個混合總分就決定 ship。這正是 Week 2 assignment 的收尾。

## Steps

1. [從單輪到會話層：用三大指標評估多輪對話](multi-turn-tool-calls-and-ab/evaluate-conversations-not-turns.md)
2. [評估 Tool Call 的三層結構與路徑選擇](multi-turn-tool-calls-and-ab/score-tool-calls-three-layers.md)
3. [用離線 A/B 評估做安全的發布決策](multi-turn-tool-calls-and-ab/run-a-b-and-read-per-metric-deltas.md)
