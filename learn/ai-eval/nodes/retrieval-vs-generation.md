---
id: retrieval-vs-generation
title: "把 retrieval 與 generation 分開量"
subject: ai-eval
tier: 4
order: 13
status: draft
goal: "能用 context precision／recall 與 faithfulness／answer relevance 判斷壞在 retrieval 還是 generation。"
digests:
  - lesson7.en.md
  - AI_Evals_Week4_Deck.md
prerequisites:
  - learn/ai-eval/nodes/trustworthy-eval-datasets.md
  - learn/ai-eval/nodes/evaluator-types.md
steps: []
created: 2026-11-08
updated: 2026-11-08
---

# 把 retrieval 與 generation 分開量

## Lesson

一個 RAG 最終分數不能告訴你「retriever 抓錯證據」還是「generator 從對的證據答錯」。這條節點用四個 scorers 把兩半拆開：context precision／recall 量 retriever，faithfulness／answer relevance 量 generator。拆開之後才抓得到那個最陰險的案例：答案正確，但建立在錯的證據上。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
