---
id: two-clocks-two-stores
title: "兩個時鐘、兩個存放區"
subject: background-agent
tier: 1
order: 5
status: written
goal: "能分清 world state、run state、execution history，以及 Postgres 與 Inngest 各存什麼。"
digests:
  - 9-dashboard-database-schema.md
  - 11-workflow-state.md
  - lessons-02-durable-execution.md
  - server.md
prerequisites:
  - learn/background-agent/nodes/give-the-agent-a-goal.md
steps:
  - id: two-clocks
    author: "google/gemini-3.8-flash"
    title: "Replay 不是接回一個掛起的堆疊"
    purpose: "能分辨世界的現在與這次 run 的進度，並解釋 replay 為何是重跑而不是接續的堆疊。"
    sources:
      - "[[sources/background-agent/20261105/lessons/02-durable-execution/index.md#L6-L20]]"
      - "[[sources/background-agent/20261105/lessons/02-durable-execution/index.md#L21-L30]]"
      - "[[sources/background-agent/20261105/9-dashboard-database-schema.vtt#L488-L574]]"
  - id: three-kinds-of-state
    author: "google/gemini-3.8-flash"
    title: "現在為真的事，和這次 run 已經做過的事"
    purpose: "能區分 world state、run state 與 execution history，並指出三者各自從哪裡讀出。"
    sources:
      - "[[sources/background-agent/20261105/lessons/02-durable-execution/index.md#L21-L30]]"
      - "[[sources/background-agent/20261105/11-workflow-state.vtt#L1-L117]]"
      - "[[sources/background-agent/20261105/9-dashboard-database-schema.vtt#L168-L232]]"
      - "[[sources/background-agent/20261105/server/schema.ts#L1-L120]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L1-L288]]"
  - id: postgres-and-inngest
    author: "google/gemini-3.8-flash"
    title: "我們只存跟業務邏輯有關的東西"
    purpose: "能說明 Postgres 存業務狀態與歷史、Inngest 存 step 結果，以及為何 checkpoint 不必自己寫。"
    sources:
      - "[[sources/background-agent/20261105/11-workflow-state.vtt#L1-L117]]"
      - "[[sources/background-agent/20261105/lessons/02-durable-execution/index.md#L6-L20]]"
      - "[[sources/background-agent/20261105/9-dashboard-database-schema.vtt#L74-L167]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L1-L216]]"
      - "[[sources/background-agent/20261105/server/agent-log.ts#L1-L41]]"
  - id: a-run-is-one-wake-up
    author: "google/gemini-3.8-flash"
    title: "一次 Run 就是被一個事件叫醒"
    purpose: "能說明 run 是事件喚醒的單位，並解釋長跑中的 run 為何會擋住程式碼部署。"
    sources:
      - "[[sources/background-agent/20261105/9-dashboard-database-schema.vtt#L233-L338]]"
      - "[[sources/background-agent/20261105/9-dashboard-database-schema.vtt#L339-L441]]"
      - "[[sources/background-agent/20261105/11-workflow-state.vtt#L118-L237]]"
      - "[[sources/background-agent/20261105/server/incident-data.ts#L1-L187]]"
      - "[[sources/background-agent/20261105/server/schema.ts#L1-L120]]"
created: 2026-11-05
updated: 2026-11-04
---

# 兩個時鐘、兩個存放區

## Lesson

背景代理同時活在兩個時間尺度裡：世界的現在，以及這次 run 已完成到哪裡。這個節點分開 world state、run state 與 execution history，並說明 Postgres 與 Inngest 各自保存什麼、為什麼不能混用。

## Steps

1. [Replay 不是接回一個掛起的堆疊](two-clocks-two-stores/two-clocks.md)
2. [現在為真的事，和這次 run 已經做過的事](two-clocks-two-stores/three-kinds-of-state.md)
3. [我們只存跟業務邏輯有關的東西](two-clocks-two-stores/postgres-and-inngest.md)
4. [一次 Run 就是被一個事件叫醒](two-clocks-two-stores/a-run-is-one-wake-up.md)
