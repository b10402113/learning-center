---
id: judge-ops
title: "Judge at scale: bias, stochasticity, group-wise metrics"
subject: agent-eval
tier: 2
order: 5
status: written
goal: "Harden a judge against position/verbosity/self-enhancement bias and run it 3–5× for stability; add Success@k / Precision@k / Recall@k for multi-output cases."
prerequisites: []
steps:
  - id: bias-controls
    title: "三種偏誤的控制：pairwise 換位、長度中立、換 judge 模型"
    purpose: "能為 position、verbosity、self-enhancement 各設計一個控制手段，並說明它擋掉哪種誤判。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1349-L1359]]"
  - id: label-stability
    title: "重跑 3–5 次：label 穩定才算 judge 有把握"
    purpose: "能在 temperature > 0 下重跑 3–5 次，用 reasoning 變動與 label 翻動判斷 judge 是否不確定。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1671-L1677]]"
  - id: drift-realignment
    title: "Judge 會過期：資料漂移、模型升級與重新對齊"
    purpose: "能說明何時該重跑對齊與 TPR/TNR，並把 judge 版本和模型版本一起管住。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1479-L1482]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1671-L1677]]"
  - id: group-wise-metrics
    title: "一題多輸出：Success@k、Precision@k、Recall@k"
    purpose: "能對一題多候選算出 Success@k、Precision@k、Recall@k，並說出三者各自回答什麼問題。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1645-L1654]]"
  - id: output-diversity
    title: "多輸出不能都一樣：cosine 相似度與平均成對相似度"
    purpose: "能用 embedding cosine 與平均成對相似度衡量多輸出重複程度，並選對要比較的 pair。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1655-L1670]]"
created: 2026-10-29
updated: 2026-10-29
---

# Judge at scale: bias, stochasticity, group-wise metrics

## Lesson

This closes the judge thread by making it dependable in production: mitigating the three known biases, checking label stability across repeated runs at temperature > 0, and moving beyond a single output to group-wise metrics like Success@k and Precision@k. It is where a validated judge turns into an operational one you can trust on every trace.

## Steps

1. [三種偏誤的控制：pairwise 換位、長度中立、換 judge 模型](judge-ops/bias-controls.md)
2. [重跑 3–5 次：label 穩定才算 judge 有把握](judge-ops/label-stability.md)
3. [Judge 會過期：資料漂移、模型升級與重新對齊](judge-ops/drift-realignment.md)
4. [一題多輸出：Success@k、Precision@k、Recall@k](judge-ops/group-wise-metrics.md)
5. [多輸出不能都一樣：cosine 相似度與平均成對相似度](judge-ops/output-diversity.md)
