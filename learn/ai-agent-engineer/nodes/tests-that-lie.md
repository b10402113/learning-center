---
id: tests-that-lie
title: "Three ways passing tests can lie"
subject: ai-agent-engineer
tier: 3
order: 12
status: written
goal: "說出三種假綠——測試沒驗行為、案例缺漏、整合壞掉——與各自由哪種測試抓。"
digests:
  - agentic-coding-handbook.3.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/course-orientation.md"
steps:
  - id: tests-pass-is-not-proof
    title: "三種測試全綠卻在說謊的方式"
    purpose: "說出三種「測試全綠卻在說謊」的長相，並把每一種對應到會抓它的測試類型。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L238-L318]]"
  - id: lie-1-tests-never-asserted
    title: "Mutants：被殺死，或存活"
    purpose: "用 coverage 為什麼不夠與 mutant 的 killed/survived，判斷一段測試有沒有真的驗行為。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L319-L395]]"
  - id: lie-2-missing-input-cases
    title: "大多數測試都是 example test"
    purpose: "用 example test 的缺漏與 property test 的性質，找出沒被任何案例覆蓋到的輸入組合。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L434-L504]]"
  - id: lie-3-parts-green-integration-broken
    title: "單元與整合測試全綠、mutation score 很高，頁面還是一片空白"
    purpose: "用 Playwright 與 Testcontainers 解釋為什麼各部件都綠、整合仍會壞，以及 E2E 該斷言什麼。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L505-L535]]"
created: 2026-11-03
updated: 2026-11-04
---

# Three ways passing tests can lie

## Lesson

測試通過只代表它跑完了，不代表它檢查了行為。Mutation testing 抓沒被斷言的行為，property testing 抓缺漏的輸入組合，end-to-end testing 抓各部件都過但整合壞掉。先知道測試怎麼騙人，後面的工具才有位置。

## Steps

1. [三種測試全綠卻在說謊的方式](tests-that-lie/tests-pass-is-not-proof.md)
2. [Mutants：被殺死，或存活](tests-that-lie/lie-1-tests-never-asserted.md)
3. [大多數測試都是 example test](tests-that-lie/lie-2-missing-input-cases.md)
4. [單元與整合測試全綠、mutation score 很高，頁面還是一片空白](tests-that-lie/lie-3-parts-green-integration-broken.md)
