---
id: prototyping-and-implement-spec
title: "prototyping、implement spec 與收尾"
subject: real-engineer
tier: 7
order: 17
status: written
goal: "能把 prototype 接進工廠迭代迴圈、用 orchestrator 跑完整份 spec，並說出每一章如何餵養工廠。"
digests:
  - 099 Prototyping.en.md
  - 100 Prototyping Solution.en.md
  - 101 Implement Spec.en.md
  - 102 Implement Spec Solution.en.md
  - 103 Wrapping Up.en.md
  - Day 1, Morning _ Office Hours.en.md
  - cohort-005-project.1.part.md
  - cohort-005-project.2.part.md
  - cohort-005-project.3.part.md
  - cohort-005-project.4.part.md
  - cohort-005-project.5.part.md
  - cohort-005-project.6.part.md
prerequisites:
  - learn/real-engineer/nodes/spec-to-implement.md
  - learn/real-engineer/nodes/chaining-the-factory.md
  - learn/real-engineer/nodes/choosing-infrastructure.md
steps:
  - id: prototype-as-third-verdict
    author: "google/gemini-3.8-flash"
    title: "Feature Request 的第三條分支：為什麼要把 Prototype 早早部署上線？"
    purpose: "能在 feature request 的三條分支中認出「需要看到」那條，並說出 prototype 為何要早早部署上線。"
    sources:
      - "[[sources/real-engineer/20261116/course/099 Prototyping.en.txt#L1-L14]]"
      - "[[sources/real-engineer/20261116/course/100 Prototyping Solution.en.txt#L1-L14]]"
      - "[[sources/real-engineer/20261116/course/Day 1, Morning _ Office Hours.en.txt#L83-L106]]"
  - id: prototype-iteration-loop
    author: "google/gemini-3.8-flash"
    title: "設計 Prototype 迭代迴圈：讓留言串成為 Agent 的對話歷史"
    purpose: "能設計 prototype 迭代迴圈：留言串就是對話歷史，orchestrator 分辨建立與更新，並補上人類觸發入口。"
    sources:
      - "[[sources/real-engineer/20261116/course/099 Prototyping.en.txt#L15-L29]]"
      - "[[sources/real-engineer/20261116/course/100 Prototyping Solution.en.txt#L15-L31]]"
      - "[[sources/real-engineer/20261116/course/100 Prototyping Solution.en.txt#L32-L43]]"
      - "[[sources/real-engineer/20261116/course/100 Prototyping Solution.en.txt#L44-L73]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/docs/agents/issue-tracker.md#L5-L14]]"
  - id: implement-spec-orchestrator
    author: "google/gemini-3.8-flash"
    title: "把 Implement Spec 寫成 Orchestrator：自動開票、共享探索筆記與平行 Runner 設計"
    purpose: "能把 implement spec 寫成 orchestrator：自動開票、共享探索筆記、確定性算 frontier，再選平行設計。"
    sources:
      - "[[sources/real-engineer/20261116/course/101 Implement Spec.en.txt#L1-L10]]"
      - "[[sources/real-engineer/20261116/course/101 Implement Spec.en.txt#L11-L23]]"
      - "[[sources/real-engineer/20261116/course/101 Implement Spec.en.txt#L24-L25]]"
      - "[[sources/real-engineer/20261116/course/102 Implement Spec Solution.en.txt#L1-L16]]"
      - "[[sources/real-engineer/20261116/course/102 Implement Spec Solution.en.txt#L17-L30]]"
      - "[[sources/real-engineer/20261116/course/102 Implement Spec Solution.en.txt#L31-L39]]"
      - "[[sources/real-engineer/20261116/course/102 Implement Spec Solution.en.txt#L40-L56]]"
      - "[[sources/real-engineer/20261116/course/102 Implement Spec Solution.en.txt#L57-L76]]"
      - "[[sources/real-engineer/20261116/course/102 Implement Spec Solution.en.txt#L77-L93]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/docs/agents/issue-tracker.md#L36-L45]]"
  - id: every-chapter-feeds-the-factory
    author: "google/gemini-3.8-flash"
    title: "先裝煞車再踩油門：串起軟體工廠的完整拼圖"
    purpose: "能說出每個章節如何餵養工廠，並用「先裝煞車、再踩油門」把全課串成一條主線。"
    sources:
      - "[[sources/real-engineer/20261116/course/103 Wrapping Up.en.txt#L1-L10]]"
      - "[[sources/real-engineer/20261116/course/103 Wrapping Up.en.txt#L11-L20]]"
      - "[[sources/real-engineer/20261116/course/103 Wrapping Up.en.txt#L21-L24]]"
      - "[[sources/real-engineer/20261116/course/103 Wrapping Up.en.txt#L25-L34]]"
      - "[[sources/real-engineer/20261116/course/103 Wrapping Up.en.txt#L35-L41]]"
      - "[[sources/real-engineer/20261116/course/103 Wrapping Up.en.txt#L42-L51]]"
created: 2026-11-16
updated: 2026-11-19
---

# prototyping、implement spec 與收尾

## Lesson

工廠出貨功能的最後兩塊：prototype 讓非技術人員用看的就能決定方向，而難的不是生成，是把 ticket 上的留言序列接成迭代迴圈；implement spec 則把整份 spec 的 task graph 攤成 frontier，用一台 runner 一張票的方式平行堆進 integration branch。收尾時回頭看，每一章都在餵養同一條產線——煞車決定你踩油門的勇氣。

## Steps

1. [Feature Request 的第三條分支：為什麼要把 Prototype 早早部署上線？](prototyping-and-implement-spec/prototype-as-third-verdict.md)
2. [設計 Prototype 迭代迴圈：讓留言串成為 Agent 的對話歷史](prototyping-and-implement-spec/prototype-iteration-loop.md)
3. [把 Implement Spec 寫成 Orchestrator：自動開票、共享探索筆記與平行 Runner 設計](prototyping-and-implement-spec/implement-spec-orchestrator.md)
4. [先裝煞車再踩油門：串起軟體工廠的完整拼圖](prototyping-and-implement-spec/every-chapter-feeds-the-factory.md)
