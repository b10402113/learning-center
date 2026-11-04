---
id: legacy-testing
title: "Testing legacy apps"
subject: ai-agent-engineer
tier: 3
order: 15
status: written
goal: "用 seam、characterization、property 與 mutation 先做安全網，再重構沒有測試的 code。"
digests:
  - agentic-coding-handbook.3.part.md
  - skills.1.part.md
  - skills.2.part.md
prerequisites: []
steps:
  - id: unit-and-honest-doubles
    title: "測試 public API"
    purpose: "用「透過 public API 的單一業務行為」定義 legacy 的測試單元，並替每個依賴選誠實的 test double。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L570-L648]]"
  - id: seams-make-it-testable
    title: "Make it testable：替依賴裝上 seam，照 assess→propose→批准走"
    purpose: "用 seam 換掉資料庫、時鐘等依賴，並照 legacy-testing skill 的 assess→propose→批准流程開工。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L649-L672]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/legacy-testing/SKILL.md#L1-L55]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/legacy-testing/references/make-it-testable.md#L1-L14]]"
  - id: characterize-pin-current-behavior
    title: "Characterize：把今天的行為釘住"
    purpose: "用 characterization 與 approval test 釘住現行行為，把 suspected bug 標出來而不順手修。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L649-L672]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/legacy-testing/references/characterize.md#L1-L14]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/legacy-testing/references/approval-tests.md#L1-L15]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/legacy-testing/examples/ticketbay-fees.md#L1-L37]]"
  - id: cover-then-refactor
    title: "Cover the behavior：先補齊覆蓋，refactor last"
    purpose: "用 property、coverage 與 mutation 補齊行為覆蓋，安全網達標後才小步重構並刪 approval test。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L649-L672]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/legacy-testing/references/property-testing.md#L1-L57]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/legacy-testing/references/measure.md#L1-L16]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/legacy-testing/references/refactor.md#L1-L10]]"
created: 2026-11-03
updated: 2026-11-04
---

# Testing legacy apps

## Lesson

Legacy code 多半只是沒有測試，不是壞掉。先把依賴換成可注入的 seam，用 characterization test 釘住現況，再用 property 與 mutation 補行為覆蓋。安全網完成後才重構，重構後再刪掉過渡用的 approval test。

## Steps

1. [測試 public API](legacy-testing/unit-and-honest-doubles.md)
2. [Make it testable：替依賴裝上 seam，照 assess→propose→批准走](legacy-testing/seams-make-it-testable.md)
3. [Characterize：把今天的行為釘住](legacy-testing/characterize-pin-current-behavior.md)
4. [Cover the behavior：先補齊覆蓋，refactor last](legacy-testing/cover-then-refactor.md)
