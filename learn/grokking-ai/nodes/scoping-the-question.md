---
id: scoping-the-question
title: 把模糊的 AI 設計題界定成可設計的範圍
subject: grokking-ai
tier: 1
order: 5
status: written
goal: 用五個動作把「長官想用 AI」變成一個有家族、有指標、有數字、有範圍的設計題。
digests:
  - 6. Capstone Scoping an AI Design Question.en.md
prerequisites:
  - learn/grokking-ai/nodes/seven-step-framework.md
steps:
  - id: the-three-gaps-and-two-signals
    author: google/gemini-3.8-flash
    title: 面對模糊的 AI 設計題：如何做好前 8 分鐘的 Scoping
    purpose: 說出題目刻意留空的功能、指標、家族，以及面試官評的廣度與決斷兩個訊號。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/6. Capstone Scoping an AI Design
        Question.en.txt#L1-L25]]
    blocks:
      - ai-system-families
      - scoping
  - id: show-the-menu-first
    author: google/gemini-3.8-flash
    title: 先端出選項菜單：AI 系統設計的第一步
    purpose: 用三十秒按家族列出一份外送場景的選項菜單，並說明太窄與讀太久各自扣什麼分。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/6. Capstone Scoping an AI Design
        Question.en.txt#L27-L36]]
    blocks:
      - ai-system-families
      - impact-and-tractability
  - id: pick-for-impact-and-tractability
    author: google/gemini-3.8-flash
    title: 評估影響力與可做性：在 AI 設計面試中果斷選題
    purpose: 用影響力與可做性三問選一個選項、替它辯護，並準備好第二順位讓面試官換題。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/6. Capstone Scoping an AI Design
        Question.en.txt#L37-L66]]
    blocks:
      - impact-and-tractability
      - scope-cut
  - id: name-the-family-and-design-centers
    author: google/gemini-3.8-flash
    title: 定義 AI 系統家族與三大設計重心
    purpose: 為選定系統命名家族與三個設計重心，並說出 prompt 與退款護欄為何是決策點。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/6. Capstone Scoping an AI Design
        Question.en.txt#L67-L88]]
    blocks:
      - ai-system-families
  - id: cut-scope-then-put-numbers-on-it
    author: google/gemini-3.8-flash
    title: 劃定 AI 系統範圍：大聲砍掉需求，用數字鎖定規格
    purpose: 說出這一版不做什麼，再用流量、解析率、延遲與成本把範圍變成可驗證的數字。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/6. Capstone Scoping an AI Design
        Question.en.txt#L89-L127]]
      - >-
        [[sources/grokking-ai/20261119/course/6. Capstone Scoping an AI Design
        Question.en.txt#L129-L147]]
    blocks:
      - scoping
      - scope-cut
      - back-of-envelope-estimation
created: 2026-11-19T00:00:00.000Z
updated: 2026-11-25T00:00:00.000Z
---

# 把模糊的 AI 設計題界定成可設計的範圍

## Lesson

最難的題目往往最短：「長官想用 AI，你會做什麼？」它刻意拿掉三個東西——功能、指標、家族。界定範圍就是在四十五分鐘的前八分鐘把這三個洞補起來，而面試官看的是兩件事：你看到幾種可能，以及你能不能選一個並替它辯護。

## Steps

1. [面對模糊的 AI 設計題：如何做好前 8 分鐘的 Scoping](scoping-the-question/the-three-gaps-and-two-signals.md)
2. [先端出選項菜單：AI 系統設計的第一步](scoping-the-question/show-the-menu-first.md)
3. [評估影響力與可做性：在 AI 設計面試中果斷選題](scoping-the-question/pick-for-impact-and-tractability.md)
4. [定義 AI 系統家族與三大設計重心](scoping-the-question/name-the-family-and-design-centers.md)
5. [劃定 AI 系統範圍：大聲砍掉需求，用數字鎖定規格](scoping-the-question/cut-scope-then-put-numbers-on-it.md)
