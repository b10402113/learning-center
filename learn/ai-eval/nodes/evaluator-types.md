---
id: evaluator-types
title: 四種 evaluator 類型
subject: ai-eval
tier: 2
order: 5
status: written
goal: >-
  能依 failure mode 選對 code／LLM judge／human／user feedback，並說出傳統 metrics 為何在 LLM
  輸出上失效。
digests:
  - lesson3.en.md
  - AI_Evals_InPractice_Week2_Deck.md
prerequisites:
  - learn/ai-eval/nodes/task-dataset-scorer.md
steps:
  - id: four-evaluator-types
    author: google/gemini-3.8-flash
    title: 依失敗模式挑選評測工具：從程式碼、LLM 裁判到使用者回饋
    purpose: >-
      能依 failure mode 在 code、LLM judge、human labels、user feedback 之間選對
      evaluator，並分辨顯性與隱性回饋。
    sources:
      - '[[sources/ai-eval/20261108/course/lesson3.en.txt#L441-L610]]'
      - >-
        [[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L121-L132]]
      - >-
        [[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L821-L848]]
    blocks:
      - evaluator-selection
      - explicit-vs-implicit-feedback
      - eval-metric-hierarchy
      - cost-tiered-eval-pipeline
  - id: traditional-metrics-fail
    author: google/gemini-3.8-flash
    title: 傳統指標為何在自由文本失靈？將評估指標放回三層架構
    purpose: 能說出 exact match、F1、BLEU/ROUGE、BERTScore 在自由文本上各自漏掉什麼，並把它們放回三層指標。
    sources:
      - '[[sources/ai-eval/20261108/course/lesson3.en.txt#L581-L603]]'
      - >-
        [[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L134-L181]]
    blocks:
      - evaluator-selection
      - traditional-metrics-limits
      - eval-metric-hierarchy
  - id: combine-evaluators-by-cost-and-runtime
    author: google/gemini-3.8-flash
    title: 組合程式碼檢查、LLM 裁判與真人複核：兼顧成本與即時限制的評估策略
    purpose: 能依成本與 runtime 限制組合 code check、judge 與人標，只在真正需要的地方保留真人複核。
    sources:
      - '[[sources/ai-eval/20261108/course/lesson3.en.txt#L611-L730]]'
    blocks:
      - evaluator-selection
      - explicit-vs-implicit-feedback
      - cost-tiered-eval-pipeline
created: 2026-11-08T00:00:00.000Z
updated: 2026-11-09T00:00:00.000Z
---

# 四種 evaluator 類型

## Lesson

Week 2 從「用什麼量」開始：規則明確就用 code，需要判斷就用 LLM judge，有 ground truth 就用人標，成果導向就看使用者回饋。這條節點也解釋 exact match、F1、BLEU/ROUGE、BERTScore 在自由文本上各自漏掉什麼，以及指標的三層（business outcome／agent quality／low-level retrieval）。選錯 evaluator，後面的驗證都白做。

## Steps

1. [依失敗模式挑選評測工具：從程式碼、LLM 裁判到使用者回饋](evaluator-types/four-evaluator-types.md)
2. [傳統指標為何在自由文本失靈？將評估指標放回三層架構](evaluator-types/traditional-metrics-fail.md)
3. [組合程式碼檢查、LLM 裁判與真人複核：兼顧成本與即時限制的評估策略](evaluator-types/combine-evaluators-by-cost-and-runtime.md)
