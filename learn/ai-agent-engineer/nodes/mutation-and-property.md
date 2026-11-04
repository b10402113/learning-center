---
id: mutation-and-property
title: "Mutation testing 與 property testing"
subject: ai-agent-engineer
tier: 3
order: 13
status: written
goal: "用 mutant 抓沒被斷言的行為、用 property 抓缺漏的輸入組合，並知道 equivalent mutant 怎麼處理。"
digests:
  - agentic-coding-handbook.3.part.md
  - skills.1.part.md
  - skills.2.part.md
  - ticket-bay.1.part.md
  - ticket-bay.2.part.md
  - ticket-bay.3.part.md
  - ticket-bay.4.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/tests-that-lie.md"
created: 2026-11-03
updated: 2026-11-04
steps:
  - id: coverage-lies-mutation-answers
    title: "Code coverage 不是品質指標"
    purpose: "說出 coverage 為什麼只量被執行、不量被斷言，並用 mutant／killed／survived 與 mutation score 量測被檢查的行為。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L265-L318]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L319-L395]]"
  - id: run-scoped-mutation-and-kill
    title: "第一次跑，只挑一個 module"
    purpose: "在單一 module 上跑 mutation tool、逐句解釋 survivor 代表的謊、寫殺掉它的測試，並看懂只 gate 改動行的 CI lane。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L396-L433]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/mutation-testing/SKILL.md#L1-L189]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/scripts/mutate-changed.mjs#L1-L74]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/stryker.config.json#L1-L29]]"
  - id: handle-equivalent-mutants
    title: "一份 claim，一個全新的 judge"
    purpose: "判斷什麼是 equivalent mutant，並守住 fresh judge 與人類批准的處理規則，不讓 agent 自行標記排除。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/mutation-testing/SKILL.md#L1-L189]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/mutation-testing/references/judge.md#L1-L76]]"
  - id: write-property-tests
    title: "你寫幾條 property，讓工具生成例子"
    purpose: "用 property test 四步（定義性質、生成輸入、執行、shrink）補上輸入組合的缺漏，並在 API 與領域層各寫一條性質。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L434-L504]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/tests/domain/refund.property.test.ts#L1-L880]]"
---

# Mutation testing 與 property testing

## Lesson

Coverage 只算被執行到的行，不代表有斷言；mutation score 才是被檢查的行為比例。Property testing 用生成器取代手寫範例，失敗時 shrink 到最小可重現輸入。兩者都不是取代單元測試，而是補上單元測試看不到的盲點。

## Steps

1. [Code coverage 不是品質指標](mutation-and-property/coverage-lies-mutation-answers.md)
2. [第一次跑，只挑一個 module](mutation-and-property/run-scoped-mutation-and-kill.md)
3. [一份 claim，一個全新的 judge](mutation-and-property/handle-equivalent-mutants.md)
4. [你寫幾條 property，讓工具生成例子](mutation-and-property/write-property-tests.md)
