---
id: make-progress-durable
title: "讓進度可持久"
subject: background-agent
tier: 2
order: 5
status: written
goal: "能說明 replay/memoization 與 workflow 確定性，並把迴圈拆成具名 durable steps。"
digests:
  - 10-durable-execution.md
  - 11-workflow-state.md
  - 12-multi-step-loop.md
  - lessons-02-durable-execution.md
  - server.md
prerequisites:
  - learn/background-agent/nodes/custom-tool-loop.md
steps:
  - id: replay-is-not-a-stack
    author: "google/gemini-3.8-flash"
    title: "Durable Execution 的運作原理：Memoize 重播而非還原 Call Stack"
    purpose: "能說明 durable execution 以 memoize 的 step 結果重播，而非恢復暫停的 JavaScript call stack。"
    sources:
      - "[[sources/background-agent/20261109/course/10-durable-execution.txt#L1-L14]]"
      - "[[sources/background-agent/20261109/course/10-durable-execution.txt#L41-L49]]"
      - "[[sources/background-agent/20261109/supplement/lessons/02-durable-execution/index.md#L7-L25]]"
  - id: deterministic-workflow-idempotent-steps
    author: "google/gemini-3.8-flash"
    title: "打造可重放的 Workflow：確定性邏輯與步驟冪等性"
    purpose: "能讓 workflow 保持確定性，並把每個 step 寫成可安全重試的冪等操作。"
    sources:
      - "[[sources/background-agent/20261109/course/10-durable-execution.txt#L15-L27]]"
      - "[[sources/background-agent/20261109/course/10-durable-execution.txt#L28-L36]]"
      - "[[sources/background-agent/20261109/course/10-durable-execution.txt#L37-L40]]"
      - "[[sources/background-agent/20261109/supplement/lessons/02-durable-execution/index.md#L251-L258]]"
  - id: business-state-vs-workflow-state
    author: "google/gemini-3.8-flash"
    title: "區分業務狀態與工作流程狀態：長時間運行 Agent 的升級策略"
    purpose: "能區分 Postgres 的 business state 與 Inngest 的 workflow state，並為在跑中的 run 規劃升級。"
    sources:
      - "[[sources/background-agent/20261109/course/11-workflow-state.txt#L1-L20]]"
      - "[[sources/background-agent/20261109/course/11-workflow-state.txt#L21-L36]]"
      - "[[sources/background-agent/20261109/supplement/lessons/02-durable-execution/index.md#L27-L30]]"
  - id: split-loop-into-durable-steps
    author: "google/gemini-3.8-flash"
    title: "重構 Agent 迴圈：拆解為具名且可記憶的有界工作流步驟"
    purpose: "能把單一 step 的迴圈改寫成有界、具名、可 memoize 的 durable steps，並抽出行動 helper。"
    sources:
      - "[[sources/background-agent/20261109/course/12-multi-step-loop.txt#L1-L84]]"
      - "[[sources/background-agent/20261109/course/12-multi-step-loop.txt#L105-L122]]"
      - "[[sources/background-agent/20261109/course/11-workflow-state.txt#L37-L129]]"
      - "[[sources/background-agent/20261109/supplement/lessons/02-durable-execution/index.md#L37-L243]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L1-L216]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-log.ts#L1-L41]]"
  - id: step-boundaries-and-portability
    author: "google/gemini-3.8-flash"
    title: "如何劃定 Checkpoint 邊界：非同步工作一次只做一個 Step"
    purpose: "能用「非同步工作一次一個 step」的判準決定 checkpoint 邊界，並對應到 Temporal 等工具。"
    sources:
      - "[[sources/background-agent/20261109/course/12-multi-step-loop.txt#L85-L104]]"
      - "[[sources/background-agent/20261109/course/12-multi-step-loop.txt#L123-L145]]"
      - "[[sources/background-agent/20261109/supplement/lessons/02-durable-execution/index.md#L31-L36]]"
      - "[[sources/background-agent/20261109/supplement/lessons/02-durable-execution/index.md#L259-L265]]"
created: 2026-11-09
updated: 2026-11-08
---

# 讓進度可持久

## Lesson

當整個迴圈塞在一個 step 裡，任何重啟都會從頭再跑一次模型與副作用；durable execution 把觀察、決策、行動與報告拆成可 memoize 的 checkpoint。這個節點解釋 replay 不是恢復暫停的 call stack，而是照確定性 workflow 重播已完成的 step，並要求每個 step 自己容忍重試。

## Steps

1. [Durable Execution 的運作原理：Memoize 重播而非還原 Call Stack](make-progress-durable/replay-is-not-a-stack.md)
2. [打造可重放的 Workflow：確定性邏輯與步驟冪等性](make-progress-durable/deterministic-workflow-idempotent-steps.md)
3. [區分業務狀態與工作流程狀態：長時間運行 Agent 的升級策略](make-progress-durable/business-state-vs-workflow-state.md)
4. [重構 Agent 迴圈：拆解為具名且可記憶的有界工作流步驟](make-progress-durable/split-loop-into-durable-steps.md)
5. [如何劃定 Checkpoint 邊界：非同步工作一次只做一個 Step](make-progress-durable/step-boundaries-and-portability.md)
