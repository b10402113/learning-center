---
id: why-ai-products-need-evals
title: AI 產品為什麼需要 eval
subject: ai-eval
tier: 1
order: 1
status: written
goal: 能解釋 deterministic QA 為何在 AI 產品上失效，並用 eval 回答「該發生什麼、不能發生什麼、能不能 ship」。
digests:
  - lesson1.en.md
  - ByteByteGo_AI_Evals_Week1_SlideDeck.md
  - README.md
prerequisites: []
steps:
  - id: deterministic-qa-breaks
    author: google/gemini-3.8-flash
    title: 為什麼傳統測試在 AI 產品上會失效？從比對結果走向成功率評估
    purpose: 能說明 `output == expected` 為何在 AI 產品上失效，並把品質改成多次執行的成功率。
    sources:
      - '[[sources/ai-eval/20261108/course/lesson1.en.txt#L281-L348]]'
      - '[[sources/ai-eval/20261108/course/lesson1.en.txt#L409-L480]]'
      - >-
        [[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L121-L152]]
      - '[[sources/ai-eval/20261108/supplement/code/README.html#L23-L31]]'
    blocks:
      - success-rate-evaluation
      - eval-driven-development
  - id: benchmarks-are-not-product-evals
    author: google/gemini-3.8-flash
    title: 為什麼排行榜上的模型高分，無法預測你的真實工作流？
    purpose: 能區分公開 model benchmark 與產品 eval，並說明 leaderboard 分數為何不能預測你的工作流。
    sources:
      - '[[sources/ai-eval/20261108/course/lesson1.en.txt#L349-L407]]'
      - >-
        [[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L153-L170]]
    blocks:
      - benchmark-vs-product-eval
  - id: write-the-eval-before-the-product
    author: google/gemini-3.8-flash
    title: 用評測規格寫出 AI 產品的 PRD：拆解成果、體驗、軌跡與治理
    purpose: 能在動工前寫出 outcome、experience、trajectory、governance 的 eval 規格，並拿它當 PRD。
    sources:
      - '[[sources/ai-eval/20261108/course/lesson1.en.txt#L921-L1000]]'
      - '[[sources/ai-eval/20261108/course/lesson1.en.txt#L1001-L1100]]'
    blocks:
      - eval-spec-dimensions
      - eval-driven-development
  - id: evals-answer-can-we-ship
    author: google/gemini-3.8-flash
    title: AI 評估不只看 Benchmark：用五個問題、可逆性與爆炸半徑決定能否上線
    purpose: 能用五個問題與可逆性、blast radius 回答「現在能不能 ship」，而不是只看 benchmark。
    sources:
      - '[[sources/ai-eval/20261108/course/lesson1.en.txt#L1701-L1851]]'
      - >-
        [[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L129-L141]]
    blocks:
      - benchmark-vs-product-eval
      - reversibility-and-blast-radius
created: 2026-11-08T00:00:00.000Z
updated: 2026-11-08T00:00:00.000Z
---

# AI 產品為什麼需要 eval

## Lesson

Week 1 先建立整門課的前提：AI 產品的輸出是一個分布，不是一個正解，所以傳統 CI 的 `output == expected` 會失效。這條節點把「為什麼現在要做 eval」講清楚，包括跳過 eval 的真實事故、公開 benchmark 與產品 eval 的差別，以及 eval 要回答的五個問題。後面所有節點都建立在這個前提上。

## Steps

1. [為什麼傳統測試在 AI 產品上會失效？從比對結果走向成功率評估](why-ai-products-need-evals/deterministic-qa-breaks.md)
2. [為什麼排行榜上的模型高分，無法預測你的真實工作流？](why-ai-products-need-evals/benchmarks-are-not-product-evals.md)
3. [用評測規格寫出 AI 產品的 PRD：拆解成果、體驗、軌跡與治理](why-ai-products-need-evals/write-the-eval-before-the-product.md)
4. [AI 評估不只看 Benchmark：用五個問題、可逆性與爆炸半徑決定能否上線](why-ai-products-need-evals/evals-answer-can-we-ship.md)
