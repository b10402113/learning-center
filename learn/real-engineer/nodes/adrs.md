---
id: adrs
title: "ADR：記下你否決掉的選項"
subject: real-engineer
tier: 1
order: 3
status: written
goal: "能用「難以回頭、無脈絡會意外、是真取捨」三問判斷該不該寫 ADR，並修剪過期的那一份。"
digests:
  - 011 ADRs _ Domain Language.en.md
  - 012 Writing an ADR.en.md
  - 013 Writing an ADR Solution.en.md
  - 016 Pruning ADRs.en.md
  - 017 Pruning ADRs Solution.en.md
  - cohort-005-project.1.part.md
  - cohort-005-project.2.part.md
  - cohort-005-project.3.part.md
  - cohort-005-project.4.part.md
  - cohort-005-project.5.part.md
prerequisites:
  - learn/real-engineer/nodes/shared-language.md
steps:
  - id: why-adr-not-code
    author: "google/gemini-3.8-flash"
    title: "為什麼需要架構決策紀錄（ADR）？"
    purpose: "能用「答案留著、算式被擦掉」說明 ADR 為何存在，並把它定位成 docs/adr 裡的 secondary source。"
    sources:
      - "[[sources/real-engineer/20261116/course/011 ADRs _ Domain Language.en.txt#L1-L19]]"
      - "[[sources/real-engineer/20261116/course/011 ADRs _ Domain Language.en.txt#L58-L83]]"
  - id: three-question-test
    author: "google/gemini-3.8-flash"
    title: "三道檢驗題，判斷決策該不該寫進 ADR"
    purpose: "能用難以回頭、無脈絡會意外、真取捨三問，判斷一個決策值不值得寫 ADR。"
    sources:
      - "[[sources/real-engineer/20261116/course/011 ADRs _ Domain Language.en.txt#L20-L57]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/courses.$slug.tsx#L370-L495]]"
  - id: refund-case-decisions
    author: "google/gemini-3.8-flash"
    title: "退款功能設計：從對齊名詞到抓出架構決策"
    purpose: "能從退款案例抓出真正要定的決策，並分清哪些只是 glossary 的用詞問題。"
    sources:
      - "[[sources/real-engineer/20261116/course/012 Writing an ADR.en.txt#L1-L21]]"
      - "[[sources/real-engineer/20261116/course/013 Writing an ADR Solution.en.txt#L1-L127]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/db/schema.ts#L1-L370]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/courses.$slug.purchase.tsx#L1-L624]]"
  - id: write-the-adr
    author: "google/gemini-3.8-flash"
    title: "把架構決策寫成極簡 ADR：用三行記錄結論與被否決的方案"
    purpose: "能把一個決策寫成三句話的 ADR，並用 considered options 記下被否決的做法。"
    sources:
      - "[[sources/real-engineer/20261116/course/013 Writing an ADR Solution.en.txt#L157-L189]]"
  - id: prune-the-pile
    author: "google/gemini-3.8-flash"
    title: "修剪 ADR 堆：用三問檢驗與替換過期決策"
    purpose: "能用同一套三問修剪 ADR 堆，刪掉不值留的，並把被推翻的決策寫進新 ADR。"
    sources:
      - "[[sources/real-engineer/20261116/course/016 Pruning ADRs.en.txt#L1-L19]]"
      - "[[sources/real-engineer/20261116/course/017 Pruning ADRs Solution.en.txt#L1-L89]]"
created: 2026-11-16
updated: 2026-11-16
---

# ADR：記下你否決掉的選項

## Lesson

程式碼只留得下「最後長成什麼」，留不下「你決定不做什麼」——那些才是 agent 最容易重新發明、也最容易走偏的地方。ADR 用一到三句話把一次真取捨釘在 `docs/adr/`，而判準只有三個：難以回頭、沒有脈絡會讓人意外、而且真的是取捨。寫得少、寫得準，比寫得多重要。

## Steps

1. [為什麼需要架構決策紀錄（ADR）？](adrs/why-adr-not-code.md)
2. [三道檢驗題，判斷決策該不該寫進 ADR](adrs/three-question-test.md)
3. [退款功能設計：從對齊名詞到抓出架構決策](adrs/refund-case-decisions.md)
4. [把架構決策寫成極簡 ADR：用三行記錄結論與被否決的方案](adrs/write-the-adr.md)
5. [修剪 ADR 堆：用三問檢驗與替換過期決策](adrs/prune-the-pile.md)
