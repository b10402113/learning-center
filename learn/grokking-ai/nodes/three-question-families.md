---
id: three-question-families
title: "三種題型家族"
subject: grokking-ai
tier: 1
order: 2
status: written
goal: "用「模型輸出什麼」判斷預測型／生成型／代理型，並各說出該家族的設計重心與經典錯誤。"
digests:
  - "4. The Three Question Families.en.md"
prerequisites:
  - learn/grokking-ai/nodes/ai-interview-landscape.md
steps:
  - id: the-family-test
    author: "google/gemini-3.8-flash"
    title: "模型輸出什麼？用家族測試為任何 AI 設計題歸類"
    purpose: "用「模型輸出什麼」把任何 AI 設計題歸類，並說明為何模型種類不決定家族。"
    sources:
      - "[[sources/grokking-ai/20261119/course/4. The Three Question Families.en.txt#L1-L21]]"
  - id: predictive-family
    author: "google/gemini-3.8-flash"
    title: "預測型系統的四個評估重點，以及為何別叫 LLM 直接排序"
    purpose: "說出預測型系統的四個評分重點，並解釋為何叫 LLM 直接排序是經典錯誤。"
    sources:
      - "[[sources/grokking-ai/20261119/course/4. The Three Question Families.en.txt#L23-L53]]"
  - id: generative-family
    author: "google/gemini-3.8-flash"
    title: "圍繞基礎模型打造生成型系統：三項核心工作與自訂評估機制"
    purpose: "說明生成型系統圍繞基礎模型的三件工作，以及為什麼評估要自己設計。"
    sources:
      - "[[sources/grokking-ai/20261119/course/4. The Three Question Families.en.txt#L55-L78]]"
  - id: agentic-family
    author: "google/gemini-3.8-flash"
    title: "掌控代理迴圈：把控制寫進程式碼"
    purpose: "描述代理迴圈，並用工具介面、預算與核准閘把控制寫在程式碼裡。"
    sources:
      - "[[sources/grokking-ai/20261119/course/4. The Three Question Families.en.txt#L79-L110]]"
  - id: mixed-products-and-seams
    author: "google/gemini-3.8-flash"
    title: "拆解混合型系統架構：辨識三個家族、劃出接縫並鎖定深談重點"
    purpose: "面對混合型題目時點出每個家族與接縫，並確認要在哪裡深入。"
    sources:
      - "[[sources/grokking-ai/20261119/course/4. The Three Question Families.en.txt#L111-L153]]"
created: 2026-11-19
updated: 2026-11-19
---

# 三種題型家族

## Lesson

整個課程只有一個分類動作：問模型主要輸出什麼。輸出分數或標籤是預測型，輸出內容是生成型，輸出動作是代理型。這個判斷只有一句話，卻決定後面七十課要往哪個方向展開。

## Steps

1. [模型輸出什麼？用家族測試為任何 AI 設計題歸類](three-question-families/the-family-test.md)
2. [預測型系統的四個評估重點，以及為何別叫 LLM 直接排序](three-question-families/predictive-family.md)
3. [圍繞基礎模型打造生成型系統：三項核心工作與自訂評估機制](three-question-families/generative-family.md)
4. [掌控代理迴圈：把控制寫進程式碼](three-question-families/agentic-family.md)
5. [拆解混合型系統架構：辨識三個家族、劃出接縫並鎖定深談重點](three-question-families/mixed-products-and-seams.md)
