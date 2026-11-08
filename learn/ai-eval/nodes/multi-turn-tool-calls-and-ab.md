---
id: multi-turn-tool-calls-and-ab
title: "多輪對話、tool call 與 A/B"
subject: ai-eval
tier: 2
order: 8
status: draft
goal: "能評分多輪對話與 tool call，並用 per-metric delta 做一次誠實的 A/B ship/no-ship 決策。"
digests:
  - lesson3.en.md
  - AI_Evals_InPractice_Week2_Deck.md
prerequisites:
  - learn/ai-eval/nodes/validate-the-judge.md
steps: []
created: 2026-11-08
updated: 2026-11-08
---

# 多輪對話、tool call 與 A/B

## Lesson

真實 agent 不是單輪 QA：會話層要量 context retention、state accuracy 與 coherence，tool call 要分 schema、arguments、semantics 三層，合法的 JSON 也可能意圖錯誤。這條節點最後把 A/B 講清楚：一次只改一個變數、跑同一組案例、逐指標讀 delta，而不是看一個混合總分就決定 ship。這正是 Week 2 assignment 的收尾。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
