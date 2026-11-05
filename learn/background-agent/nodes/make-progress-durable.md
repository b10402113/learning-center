---
id: make-progress-durable
title: "讓進度可持久"
subject: background-agent
tier: 2
order: 8
status: confirmed
goal: "能解釋 replay 為何跳過已完成 step，並說明 workflow body 必須確定性、step 必須幂等。"
digests:
  - 10-durable-execution.md
  - 11-workflow-state.md
  - lessons-02-durable-execution.md
  - server.md
prerequisites:
  - learn/background-agent/nodes/two-clocks-two-stores.md
  - learn/background-agent/nodes/first-runnable-loop.md
steps:
  - id: single-step-is-not-durable
    title: "全部都在一個 step 裡"
    purpose: "能指出把整個迴圈放進一個 step 的崩潰窗口，並說明重啟為何會重做觀察、模型呼叫與副作用。"
    sources:
      - "[[sources/background-agent/20261105/10-durable-execution.vtt#L1-L94]]"
      - "[[sources/background-agent/20261105/10-durable-execution.vtt#L95-L123]]"
      - "[[sources/background-agent/20261105/lessons/02-durable-execution/index.md#L6-L20]]"
      - "[[sources/background-agent/20261105/lessons/02-durable-execution/index.md#L37-L50]]"
      - "[[sources/background-agent/20261105/lessons/02-durable-execution/index.md#L251-L258]]"
  - id: replay-skips-completed-steps
    title: "Replay 不是恢復暫停的堆疊"
    purpose: "能解釋 replay 重跑 workflow body 卻跳過已完成 step，並說明這不是恢復 JS 堆疊。"
    sources:
      - "[[sources/background-agent/20261105/10-durable-execution.vtt#L313-L364]]"
      - "[[sources/background-agent/20261105/10-durable-execution.vtt#L365-L401]]"
      - "[[sources/background-agent/20261105/lessons/02-durable-execution/index.md#L21-L30]]"
      - "[[sources/background-agent/20261105/server/agent.ts#L1-L28]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L1-L216]]"
  - id: deterministic-workflow-body
    title: "step 之外的程式碼必須是確定性的"
    purpose: "能說明 step.run 之外的 workflow body 必須確定性，並指出時間與隨機會如何破壞 replay。"
    sources:
      - "[[sources/background-agent/20261105/10-durable-execution.vtt#L124-L204]]"
      - "[[sources/background-agent/20261105/lessons/02-durable-execution/index.md#L6-L20]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L1-L216]]"
  - id: idempotent-steps
    title: "step 必須是冪等的"
    purpose: "能說明 step 的副作用為何必須幂等，並用 idempotency key 解釋重播為何不重複收費。"
    sources:
      - "[[sources/background-agent/20261105/10-durable-execution.vtt#L205-L283]]"
      - "[[sources/background-agent/20261105/lessons/02-durable-execution/index.md#L6-L20]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L1-L288]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L1-L216]]"
  - id: checkpoints-and-live-deploys
    title: "兩個時鐘，兩個儲存位置"
    purpose: "能說明 checkpoint 由平台保存、我們只存業務狀態，並權衡長跑中部署新版的代價。"
    sources:
      - "[[sources/background-agent/20261105/11-workflow-state.vtt#L1-L117]]"
      - "[[sources/background-agent/20261105/11-workflow-state.vtt#L118-L237]]"
      - "[[sources/background-agent/20261105/10-durable-execution.vtt#L284-L312]]"
      - "[[sources/background-agent/20261105/lessons/02-durable-execution/index.md#L31-L36]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L1-L288]]"
created: 2026-11-05
updated: 2026-11-05
---

# 讓進度可持久

## Lesson

只要整個迴圈包在一個 step 裡，程序一死就得從頭再來，模型呼叫與副作用都會重複。這個節點說明 step 是記憶化的單位、replay 不是恢復堆疊，以及 workflow body 的確定性與 step 的幂等性為何是耐久執行的兩個前提。

## Steps

1. [全部都在一個 step 裡](make-progress-durable/single-step-is-not-durable.md)
2. [Replay 不是恢復暫停的堆疊](make-progress-durable/replay-skips-completed-steps.md)
3. [step 之外的程式碼必須是確定性的](make-progress-durable/deterministic-workflow-body.md)
4. [step 必須是冪等的](make-progress-durable/idempotent-steps.md)
5. [兩個時鐘，兩個儲存位置](make-progress-durable/checkpoints-and-live-deploys.md)
