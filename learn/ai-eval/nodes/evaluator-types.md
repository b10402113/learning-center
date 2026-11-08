---
id: evaluator-types
title: "四種 evaluator 類型"
subject: ai-eval
tier: 2
order: 5
status: draft
goal: "能依 failure mode 選對 code／LLM judge／human／user feedback，並說出傳統 metrics 為何在 LLM 輸出上失效。"
digests:
  - lesson3.en.md
  - AI_Evals_InPractice_Week2_Deck.md
prerequisites:
  - learn/ai-eval/nodes/task-dataset-scorer.md
steps: []
created: 2026-11-08
updated: 2026-11-08
---

# 四種 evaluator 類型

## Lesson

Week 2 從「用什麼量」開始：規則明確就用 code，需要判斷就用 LLM judge，有 ground truth 就用人標，成果導向就看使用者回饋。這條節點也解釋 exact match、F1、BLEU/ROUGE、BERTScore 在自由文本上各自漏掉什麼，以及指標的三層（business outcome／agent quality／low-level retrieval）。選錯 evaluator，後面的驗證都白做。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
