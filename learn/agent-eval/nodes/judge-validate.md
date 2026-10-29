---
id: judge-validate
title: "Validate the judge: TPR, TNR, why precision/recall mislead"
subject: agent-eval
tier: 2
order: 3
status: written
goal: "Measure a judge's TPR/TNR on a labeled dev/test split and explain why those beat precision/recall for estimating a true pass rate."
prerequisites: []
steps:
  - id: judge-data-splits
    title: "Judge 當分類器：train/dev/test 切分與 leakage"
    purpose: "能切出互不重疊的 train/dev/test，並說明每組在 judge 開發中的角色與洩漏風險。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1445-L1454]]"
  - id: dev-refinement-loop
    title: "Dev set 修正迴圈：看 disagreement、改 prompt、何時停"
    purpose: "能在 dev set 上跑修正迴圈，用 false pass／false fail 改 prompt，並判斷何時該停。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1455-L1460]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1467-L1478]]"
  - id: tpr-tnr-not-precision-recall
    title: "TPR 與 TNR：為何不用 precision/recall 估真 pass rate"
    purpose: "能從 2×2 結果算出 TPR 與 TNR，並說明為何它們比 precision/recall 更直接對應真 pass rate 的偏差。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1461-L1466]]"
  - id: test-set-validation
    title: "Test set 驗證：凍結 judge，量 TPR/TNR 而非只看通過率"
    purpose: "能在凍結的 test set 上量出 TPR/TNR，並解釋直接數 judge 的 Pass 為何會得到有偏的通過率。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1483-L1487]]"
created: 2026-10-29
updated: 2026-10-29
---

# Validate the judge: TPR, TNR, why precision/recall mislead

## Lesson

A judge is only useful once you know how often it is right, and here you treat it like a classifier trained by prompt engineering: disjoint train/dev/test splits, balanced Pass/Fail examples, and a refinement loop that measures TPR and TNR. The key move is seeing why TPR/TNR — not precision/recall — are the two numbers that map directly onto over- and under-estimating the true pass rate.

## Steps

1. [Judge 當分類器：train/dev/test 切分與 leakage](judge-validate/judge-data-splits.md)
2. [Dev set 修正迴圈：看 disagreement、改 prompt、何時停](judge-validate/dev-refinement-loop.md)
3. [TPR 與 TNR：為何不用 precision/recall 估真 pass rate](judge-validate/tpr-tnr-not-precision-recall.md)
4. [Test set 驗證：凍結 judge，量 TPR/TNR 而非只看通過率](judge-validate/test-set-validation.md)
