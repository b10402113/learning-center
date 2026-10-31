---
id: run-lifecycle
title: "Run 的生命週期與資料模型"
subject: background-agents
tier: 2
order: 4
status: written
goal: "說出 run 是什麼、eventSequence 的角色、schema 核心表，以及 business state 與 workflow state 的區別。"
digests:
  - 11-workflow-state.md
  - 16-when-to-wait-for-input.md
  - 18-waiting-loop.md
  - 4-setting-up-the-workflow.md
  - 9-dashboard-database-schema.md
prerequisites: []
steps:
  - id: run-is-a-wake-up
    title: "run 是什麼？"
    purpose: "能說出 run 是 agent 被一個 event 叫醒的一次執行，與一次調查不等價，開新或接續由 harness 決定。"
    sources:
      - "[[sources/background-agents/20261027/9-dashboard-database-schema.md#L36-L46]]"
      - "[[sources/background-agents/20261027/4-setting-up-the-workflow.md#L102-L111]]"
  - id: business-vs-workflow-state
    title: "兩種 state，要分清楚"
    purpose: "能區分 business state 與 workflow state：業務資料自己寫進 Postgres，step 進度由 Inngest 存 checkpoint。"
    sources:
      - "[[sources/background-agents/20261027/11-workflow-state.md#L1-L10]]"
      - "[[sources/background-agents/20261027/11-workflow-state.md#L11-L20]]"
  - id: schema-core-tables
    title: "資料庫 schema：簡單到會讓你意外"
    purpose: "能說出 schema 核心表 events、actions、runs 各存什麼，以及為什麼 runs 是最關鍵的一張。"
    sources:
      - "[[sources/background-agents/20261027/9-dashboard-database-schema.md#L27-L35]]"
      - "[[sources/background-agents/20261027/9-dashboard-database-schema.md#L57-L66]]"
  - id: event-sequence-wake-signal
    title: "有新事件就跳出等待"
    purpose: "能說出 eventSequence 是 run 上遞增的計數器，並用它判斷醒來後是否有新事件。"
    sources:
      - "[[sources/background-agents/20261027/16-when-to-wait-for-input.md#L20-L27]]"
      - "[[sources/background-agents/20261027/18-waiting-loop.md#L25-L29]]"
created: 2026-10-27
updated: 2026-10-31
---

# Run 的生命週期與資料模型

## Lesson

run 是「agent 被一個事件喚醒的一次執行」，不等於一次調查。business state 與 workflow state 分屬 Postgres 與 Inngest。看懂 schema 的核心表與 eventSequence，才知道斷掉之後狀態去哪裡。

## Steps

1. [run 是什麼？](run-lifecycle/run-is-a-wake-up.md)
2. [兩種 state，要分清楚](run-lifecycle/business-vs-workflow-state.md)
3. [資料庫 schema：簡單到會讓你意外](run-lifecycle/schema-core-tables.md)
4. [有新事件就跳出等待](run-lifecycle/event-sequence-wake-signal.md)
