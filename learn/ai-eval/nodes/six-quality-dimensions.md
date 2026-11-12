---
id: six-quality-dimensions
title: AI 產品品質的六個維度
subject: ai-eval
tier: 1
order: 2
status: written
goal: >-
  能用 model quality、product behavior、safety、reliability、cost、latency 評估一個 AI
  產品，而不是只看 accuracy。
digests:
  - lesson1.en.md
  - ByteByteGo_AI_Evals_Week1_SlideDeck.md
prerequisites:
  - learn/ai-eval/nodes/why-ai-products-need-evals.md
steps:
  - id: model-quality-vs-product-behavior
    author: google/gemini-3.8-flash
    title: 答對了卻答錯問題：區分模型品質與產品行為
    purpose: 能區分 model quality 與 product behavior，並用「答對了卻答錯問題」說明兩者不能互相取代。
    sources:
      - >-
        [[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L321-L430]]
      - >-
        [[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L641-L720]]
    blocks:
      - six-quality-dimensions
      - model-quality-vs-product-behavior
  - id: safety-reliability-cost-latency
    author: google/gemini-3.8-flash
    title: 評估 AI 不能只看準確度：Safety、Reliability、Cost 與 Latency 的度量重點
    purpose: 能說明 safety、reliability、cost、latency 各量什麼，並各指出一個只看 accuracy 會漏掉的失敗。
    sources:
      - '[[sources/ai-eval/20261108/course/lesson1.en.txt#L791-L920]]'
      - >-
        [[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L321-L430]]
    blocks:
      - six-quality-dimensions
  - id: ai-metrics-vs-business-metrics
    author: google/gemini-3.8-flash
    title: 評估 AI 產品成效：搞懂 AI 指標與業務指標的差別
    purpose: 能把品質指標分成 AI metrics 與 business/user metrics，並說出兩者各自回答什麼問題。
    sources:
      - '[[sources/ai-eval/20261108/course/lesson1.en.txt#L791-L920]]'
      - '[[sources/ai-eval/20261108/course/lesson1.en.txt#L921-L1000]]'
      - >-
        [[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L321-L430]]
    blocks:
      - ai-metrics-vs-business-metrics
  - id: contextual-thresholds-and-accuracy-trap
    author: google/gemini-3.8-flash
    title: 儀表板全綠卻客訴翻倍？評估門檻設定與單一準確率的盲點
    purpose: 能依用途設定不同門檻，並用「92% 全綠但客訴翻倍」說明單一 accuracy 指標的盲點。
    sources:
      - '[[sources/ai-eval/20261108/course/lesson1.en.txt#L1601-L1700]]'
      - >-
        [[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L721-L852]]
    blocks:
      - six-quality-dimensions
      - ai-metrics-vs-business-metrics
      - model-quality-vs-product-behavior
      - contextual-eval-thresholds
created: 2026-11-08T00:00:00.000Z
updated: 2026-11-08T00:00:00.000Z
---

# AI 產品品質的六個維度

## Lesson

「品質」不是一個分數：model quality、product behavior、safety、reliability、cost、latency 各自對應不同的失敗與不同的量法。這條節點也把指標分成 AI metrics 與 business/user metrics，並說明門檻為什麼是情境相關的（內部 Q&A 與法務用途不是同一條線）。每一步都要能指著一個真實決策說「這個維度沒量到會怎樣」。

## Steps

1. [答對了卻答錯問題：區分模型品質與產品行為](six-quality-dimensions/model-quality-vs-product-behavior.md)
2. [評估 AI 不能只看準確度：Safety、Reliability、Cost 與 Latency 的度量重點](six-quality-dimensions/safety-reliability-cost-latency.md)
3. [評估 AI 產品成效：搞懂 AI 指標與業務指標的差別](six-quality-dimensions/ai-metrics-vs-business-metrics.md)
4. [儀表板全綠卻客訴翻倍？評估門檻設定與單一準確率的盲點](six-quality-dimensions/contextual-thresholds-and-accuracy-trap.md)
