---
id: plan-then-fan-out
title: "先計畫，再平行派人：supervision"
subject: agent-harness2
tier: 4
order: 10
status: written
goal: "產出 schema-backed plan、`allSettled` 平行 fan-out、部分失敗時 degrade 再 synthesize。"
prerequisites: []
steps:
  - id: plan-mode-before-subagents
    title: "先開 plan mode，再談 sub-agent"
    purpose: "能說明 sub-agent 適合隔離工作與研究彙整，以及為什麼由使用者開啟 plan mode，而不是讓 agent 自己判斷。"
    sources:
      - "[[sources/agent-harness2/20261029/22-supervision-with-subagents.txt#L1-L46]]"
      - "[[sources/agent-harness2/20261029/22-supervision-with-subagents.txt#L47-L73]]"
  - id: plan-is-a-first-class-artifact
    title: "Plan 是一級公民，而且只規劃一次"
    purpose: "能用 Zod 定義 plan 的 id／agent／objective，用 generateObject 取得結構化物件，並把 makePlan 包進 DBOS step。"
    sources:
      - "[[sources/agent-harness2/20261029/23-supervisor-workflow.txt#L1-L53]]"
      - "[[sources/agent-harness2/20261029/23-supervisor-workflow.txt#L54-L72]]"
      - "[[sources/agent-harness2/20261029/23-supervisor-workflow.txt#L73-L119]]"
      - "[[sources/agent-harness2/20261029/23-supervisor-workflow.txt#L120-L143]]"
      - "[[sources/agent-harness2/20261029/23-supervisor-workflow.txt#L182-L248]]"
      - "[[sources/agent-harness2/20261029/23-supervisor-workflow.txt#L249-L269]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/supervisor.ts#L8-L31]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/supervisor.ts#L48-L62]]"
  - id: read-only-investigators
    title: "Investigator 是唯讀的 sub-agent"
    purpose: "能為 billing、technical、sales 各設一個單一工具與專屬 prompt 的唯讀調查員，並把推論限制在五個 turn。"
    sources:
      - "[[sources/agent-harness2/20261029/22-supervision-with-subagents.txt#L74-L102]]"
      - "[[sources/agent-harness2/20261029/22-supervision-with-subagents.txt#L103-L132]]"
      - "[[sources/agent-harness2/20261029/22-supervision-with-subagents.txt#L133-L199]]"
      - "[[sources/agent-harness2/20261029/22-supervision-with-subagents.txt#L200-L259]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/investigators.ts#L1-L60]]"
  - id: parallel-fan-out
    title: "所有 sub-agent 在同一個 step 裡平行跑"
    purpose: "能用 Promise.allSettled 包住 plan.steps.map，讓每個 sub-agent 在各自的 DBOS step 同時執行並發出開始與完成事件。"
    sources:
      - "[[sources/agent-harness2/20261029/24-dispatching-subagents.txt#L1-L19]]"
      - "[[sources/agent-harness2/20261029/24-dispatching-subagents.txt#L20-L78]]"
      - "[[sources/agent-harness2/20261029/24-dispatching-subagents.txt#L79-L113]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/supervisor.ts#L64-L89]]"
  - id: fan-in-and-synthesize
    title: "Fan-in：收下成功的，合成一封回覆"
    purpose: "能在 fan-in 時收下成功、記錄失敗，再用 DBOS step 執行 synthesize 並註冊 supervisor workflow。"
    sources:
      - "[[sources/agent-harness2/20261029/24-dispatching-subagents.txt#L114-L158]]"
      - "[[sources/agent-harness2/20261029/24-dispatching-subagents.txt#L159-L209]]"
      - "[[sources/agent-harness2/20261029/24-dispatching-subagents.txt#L210-L248]]"
      - "[[sources/agent-harness2/20261029/24-dispatching-subagents.txt#L249-L291]]"
      - "[[sources/agent-harness2/20261029/24-dispatching-subagents.txt#L292-L326]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/supervisor.ts#L91-L128]]"
created: 2026-10-29
updated: 2026-10-29
---

# 先計畫，再平行派人：supervision

## Lesson

Supervisor 先產出 schema-backed plan，再把唯讀 investigator 平行派出去，最後把 findings 合成一封回覆。部分失敗不是例外，是設計的一部分：`allSettled` 讓成功的收進來、失敗的留下紀錄，整條流程照樣結束。

## Steps

1. [先開 plan mode，再談 sub-agent](plan-then-fan-out/plan-mode-before-subagents.md)
2. [Plan 是一級公民，而且只規劃一次](plan-then-fan-out/plan-is-a-first-class-artifact.md)
3. [Investigator 是唯讀的 sub-agent](plan-then-fan-out/read-only-investigators.md)
4. [所有 sub-agent 在同一個 step 裡平行跑](plan-then-fan-out/parallel-fan-out.md)
5. [Fan-in：收下成功的，合成一封回覆](plan-then-fan-out/fan-in-and-synthesize.md)
