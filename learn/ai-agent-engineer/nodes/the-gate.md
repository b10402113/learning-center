---
id: the-gate
title: "The gate"
subject: ai-agent-engineer
tier: 3
order: 16
status: written
goal: "用六條 CI lane 與 branch protection 讓每個 PR 被同一套檢查擋住，並補上 agent code 的 guardrail。"
digests:
  - agentic-coding-handbook.3.part.md
  - ticket-bay.1.part.md
  - ticket-bay.2.part.md
  - ticket-bay.3.part.md
  - ticket-bay.4.part.md
prerequisites: []
steps:
  - id: why-agents-need-a-gate
    title: "The gate"
    purpose: "說出代理與人都會讓測試失守的原因，以及為什麼 gate 必須在每個 PR 用同一套檢查並設成 required。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L238-L264]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L673-L696]]"
  - id: six-parallel-lanes
    title: "六個 job 平行跑，紅燈點名是哪條 lane"
    purpose: "讀懂 TicketBay gate.yml 六條平行 lane 的分工、速度取捨與 secret scan 紀律。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L673-L696]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/package.json#L1-L69]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/vitest.config.ts#L1-L44]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/vitest.unit.config.ts#L1-L12]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/playwright.config.ts#L1-L30]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/stryker.config.json#L1-L29]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/README.md#L1-L168]]"
  - id: mutation-gate-discipline
    title: "只在改動的 code 上把關"
    purpose: "解釋 mutation lane 為什麼只跑改動行、門檻設 100%，以及 agent 不得自行判定 equivalent mutant 的責任邊界。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L396-L433]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/scripts/mutate-changed.mjs#L1-L74]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/AGENTS.md#L1-L13]]"
  - id: agent-code-gates
    title: "給 agent code 的更多 gate"
    purpose: "為 agent 產出的 code 挑選 lint、architecture test、type guardrail、supply-chain 與 migration 檢查。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L697-L743]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/tsconfig.json#L1-L21]]"
created: 2026-11-03
updated: 2026-11-04
---

# The gate

## Lesson

Agent 可能跳過或謊報測試，人也會忘記跑；gate 讓每個 PR 用同一套檢查，並設成 required。TicketBay 的 gate 有六條平行 lane，從 fast tests 到 mutation 與 secret scan。針對 agent code，再加 lint、architecture test、型別護欄、contract test 與 migration linter。

## Steps

1. [The gate](the-gate/why-agents-need-a-gate.md)
2. [六個 job 平行跑，紅燈點名是哪條 lane](the-gate/six-parallel-lanes.md)
3. [只在改動的 code 上把關](the-gate/mutation-gate-discipline.md)
4. [給 agent code 的更多 gate](the-gate/agent-code-gates.md)
