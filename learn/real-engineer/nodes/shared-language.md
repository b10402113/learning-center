---
id: shared-language
title: "共享詞彙與 GLOSSARY.md"
subject: real-engineer
tier: 1
order: 2
status: written
goal: "能為一個概念找出正確的字、寫進 glossary，並把程式碼、UI 與文案統一成同一套說法。"
digests:
  - 008 Domain Language.en.md
  - 009 Using Grill with Docs.en.md
  - 010 Using Grill with Docs Solution.en.md
  - 014 Pruning the Glossary.en.md
  - 015 Pruning the Glossary Solution.en.md
  - 018 Q&A _ Domain Language.en.md
  - Day 1, Afternoon _ Office Hours.en.md
  - index.md
  - cohort-005-project.1.part.md
  - cohort-005-project.2.part.md
  - cohort-005-project.3.part.md
  - cohort-005-project.4.part.md
  - cohort-005-project.5.part.md
  - cohort-005-project.6.part.md
prerequisites:
  - learn/real-engineer/nodes/brakes-and-accelerators.md
steps:
  - id: why-language-is-design
    author: "google/gemini-3.8-flash"
    title: "為什麼同一個概念有四個名字會變成程式裡的真 Bug？"
    purpose: "能說明同一個概念叫四個名字為什麼會變成真 bug，並指出 glossary 要拉齊的三個面。"
    sources:
      - "[[sources/real-engineer/20261116/course/008 Domain Language.en.txt#L1-L77]]"
  - id: find-the-right-word
    author: "google/gemini-3.8-flash"
    title: "用 grill-with-docs 與情境表釐清領域詞彙與功能邊界"
    purpose: "能用 grill-with-docs 加情境表，替一個功能挑出正確的詞並劃出它的邊界。"
    sources:
      - "[[sources/real-engineer/20261116/course/009 Using Grill with Docs.en.txt#L1-L23]]"
      - "[[sources/real-engineer/20261116/course/010 Using Grill with Docs Solution.en.txt#L1-L88]]"
      - "[[sources/real-engineer/20261116/supplement/index.html#L399-L403]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/courses.$slug.refund.ts#L1-L237]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/settings.tsx#L1-L286]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/courses.$slug.tsx#L1-L1235]]"
  - id: ship-the-word
    author: "google/gemini-3.8-flash"
    title: "從詞彙表到程式碼：讓系統語言與介面說同一句話"
    purpose: "能把 glossary 的詞落成狀態機、畫面文案、schema 與路由命名，讓程式碼與介面說同一句話。"
    sources:
      - "[[sources/real-engineer/20261116/course/010 Using Grill with Docs Solution.en.txt#L89-L189]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/db/schema.ts#L1-L370]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/drizzle/0009_clear_professor_monster.sql#L1-L13]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/courses.$slug.refund.ts#L1-L237]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/settings.tsx#L1-L286]]"
  - id: prune-the-glossary
    author: "google/gemini-3.8-flash"
    title: "用三條修剪規則替 Glossary 瘦身"
    purpose: "能用三條修剪規則砍掉實作細節與通用詞，把膨脹的 glossary 清回尖銳可重用。"
    sources:
      - "[[sources/real-engineer/20261116/course/014 Pruning the Glossary.en.txt#L1-L19]]"
      - "[[sources/real-engineer/20261116/course/015 Pruning the Glossary Solution.en.txt#L1-L129]]"
      - "[[sources/real-engineer/20261116/course/Day 1, Afternoon _ Office Hours.en.txt#L219-L300]]"
  - id: keep-the-language-alive
    author: "google/gemini-3.8-flash"
    title: "領域語言常見問題：何時拆出第二份術語表，以及人與 Agent 的分工"
    purpose: "能判斷何時該拆出第二份 glossary，並守住人擁有 glossary、agent 不自行發明術語的分工。"
    sources:
      - "[[sources/real-engineer/20261116/course/018 Q&A _ Domain Language.en.txt#L1-L97]]"
      - "[[sources/real-engineer/20261116/course/Day 1, Afternoon _ Office Hours.en.txt#L478-L505]]"
created: 2026-11-16
updated: 2026-11-16
---

# 共享詞彙與 GLOSSARY.md

## Lesson

agent 愛發明又壓縮又省 token 的名字，對讀者是災難；同一個概念在 UI、email、settings 與程式碼裡叫四個名字，最後會變成真正的 bug。這個 node 把「找出正確的字」當成一項可練習的技能：用 grill-with-docs 建立 glossary、用情境測試逼出詞的邊界，再回頭把程式碼與介面統一。

## Steps

1. [為什麼同一個概念有四個名字會變成程式裡的真 Bug？](shared-language/why-language-is-design.md)
2. [用 grill-with-docs 與情境表釐清領域詞彙與功能邊界](shared-language/find-the-right-word.md)
3. [從詞彙表到程式碼：讓系統語言與介面說同一句話](shared-language/ship-the-word.md)
4. [用三條修剪規則替 Glossary 瘦身](shared-language/prune-the-glossary.md)
5. [領域語言常見問題：何時拆出第二份術語表，以及人與 Agent 的分工](shared-language/keep-the-language-alive.md)
