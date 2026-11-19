---
id: chaining-the-factory
title: "把 build 與 review 拆開，串起整條工廠"
subject: real-engineer
tier: 6
order: 14
status: written
goal: "能用 review label 接第二段流程、對遠端 run 做 retro，串成 explore → implement → review。"
digests:
  - 081 Retro A Run.en.md
  - 082 Retro A Run Solution.en.md
  - 083 Explore Before You Commit.en.md
  - 084 Explore Before You Commit Solution.en.md
  - 085 Chaining The Whole Factory.en.md
  - 086 Chaining The Whole Factory Solution.en.md
  - cohort-005-project.1.part.md
  - cohort-005-project.2.part.md
  - cohort-005-project.3.part.md
  - cohort-005-project.4.part.md
  - cohort-005-project.5.part.md
  - cohort-005-project.6.part.md
prerequisites:
  - learn/real-engineer/nodes/trust-ladder-and-sandbox.md
steps:
  - id: retro-a-remote-run
    author: "google/gemini-3.8-flash"
    title: "對遠端 Review Run 做 Retro：把混亂訊號淬鍊成工廠規則"
    purpose: "能對一次遠端 review run 做 retro，把重複、消極與互相打架的訊號變成具體的系統規則。"
    sources:
      - "[[sources/real-engineer/20261116/course/081 Retro A Run.en.txt#L1-L29]]"
      - "[[sources/real-engineer/20261116/course/082 Retro A Run Solution.en.txt#L1-L165]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/AGENTS.md#L1-L19]]"
  - id: explore-before-implement
    author: "google/gemini-3.8-flash"
    title: "在實作前用 Explore 驗證外部回饋"
    purpose: "能在實作前用 explore 驗證外部回饋的 claim、找出程式碼位置並查重，再決定是否核准。"
    sources:
      - "[[sources/real-engineer/20261116/course/083 Explore Before You Commit.en.txt#L1-L81]]"
      - "[[sources/real-engineer/20261116/course/084 Explore Before You Commit Solution.en.txt#L1-L121]]"
  - id: chain-explore-to-implement
    author: "google/gemini-3.8-flash"
    title: "串接軟體工廠：用三種判定讓 Explore 自動分派任務"
    purpose: "能替 explore 加上 easy call、needs a human、blocked 三種 verdict，讓它自己把可做的票交給 implementer。"
    sources:
      - "[[sources/real-engineer/20261116/course/085 Chaining The Whole Factory.en.txt#L1-L41]]"
  - id: run-and-review-the-whole-chain
    author: "google/gemini-3.8-flash"
    title: "串接整條軟體工廠管線：從 Explore、Implement 到 Review 的自動化與驗收"
    purpose: "能說明 implement 自動貼上 review label 後，整條 explore → implement → review 鏈怎麼跑與驗收。"
    sources:
      - "[[sources/real-engineer/20261116/course/085 Chaining The Whole Factory.en.txt#L42-L53]]"
      - "[[sources/real-engineer/20261116/course/086 Chaining The Whole Factory Solution.en.txt#L1-L85]]"
created: 2026-11-16
updated: 2026-11-19
---

# 把 build 與 review 拆開，串起整條工廠

## Lesson

一個 implementer 只是一段流程，工廠是流程串起來之後才出現的：draft PR 貼上 review label 接上第二段，外部回饋先經過 explore 驗證再決定要不要實作，而每一段 run 都能拿來做 retro。等 explore 能自己判斷 easy call、implement 自動請求 review，整條鏈就從「填一張表」開始跑。

## Steps

1. [對遠端 Review Run 做 Retro：把混亂訊號淬鍊成工廠規則](chaining-the-factory/retro-a-remote-run.md)
2. [在實作前用 Explore 驗證外部回饋](chaining-the-factory/explore-before-implement.md)
3. [串接軟體工廠：用三種判定讓 Explore 自動分派任務](chaining-the-factory/chain-explore-to-implement.md)
4. [串接整條軟體工廠管線：從 Explore、Implement 到 Review 的自動化與驗收](chaining-the-factory/run-and-review-the-whole-chain.md)
