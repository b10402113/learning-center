---
id: decisions-special-cases-and-actions
title: "決策、特例與行動執行"
subject: background-agent
tier: 2
order: 6
status: written
goal: "能把 LLM 決策包成 step、處理 complete/wait/help 特例，並用 idempotency 執行 action。"
digests:
  - 13-generate-a-decision.md
  - 14-handle-special-cases.md
  - 15-executing-actions.md
  - lessons-02-durable-execution.md
  - server.md
  - shared.md
prerequisites:
  - learn/background-agent/nodes/make-progress-durable.md
steps:
  - id: decision-as-step
    author: "google/gemini-3.8-flash"
    title: "為何 LLM 決策必須包進 Step？用 Inngest 打造可靠的工作流"
    purpose: "能說明為何 LLM 決策必須包進 step，並用 choose-action、set-iteration 與 record-decision 記錄它。"
    sources:
      - "[[sources/background-agent/20261109/course/13-generate-a-decision.txt#L1-L117]]"
      - "[[sources/background-agent/20261109/supplement/lessons/02-durable-execution/index.md#L6-L36]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-brain.ts#L8-L41]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L93-L97]]"
  - id: special-case-actions
    author: "google/gemini-3.8-flash"
    title: "處理 Agent 的特殊決策：為 wait、complete 與 request_help 建立持久化 step"
    purpose: "能為 wait、complete 與 request_help 各寫一條分支，並把報告與完成狀態包成 step。"
    sources:
      - "[[sources/background-agent/20261109/course/14-handle-special-cases.txt#L1-L50]]"
  - id: action-id-and-policy
    author: "google/gemini-3.8-flash"
    title: "Action ID 為何不必包成 Step：用行動政策分類執行權限"
    purpose: "能判斷 action ID 不必包成 step，並用行動政策把執行分成 read、write、approval、help 與 terminal。"
    sources:
      - "[[sources/background-agent/20261109/course/14-handle-special-cases.txt#L51-L133]]"
      - "[[sources/background-agent/20261109/supplement/server/tool-policy.ts#L1-L15]]"
      - "[[sources/background-agent/20261109/supplement/shared/types.ts#L1-L13]]"
  - id: execute-actions-idempotently
    author: "google/gemini-3.8-flash"
    title: "把 Action 包進 Step：用 Idempotency Key 與版本比對防止重複改動世界"
    purpose: "能把 action 執行包進 step，並用 idempotency key 與 expectedVersion 讓重試與 stale 結果都不重複改動世界。"
    sources:
      - "[[sources/background-agent/20261109/course/15-executing-actions.txt#L1-L197]]"
      - "[[sources/background-agent/20261109/supplement/lessons/02-durable-execution/index.md#L51-L96]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L20-L56]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L187-L211]]"
created: 2026-11-09
updated: 2026-11-08
---

# 決策、特例與行動執行

## Lesson

不是每個 action 都能直接執行：complete 要對照目標條件，wait 與 request_help 要改變 run 的生命周期，write 與 approval 要經過 harness 的政策閘門。這個節點把 LLM 決策包成 step、補上特例分支，並用 idempotency key 與 expectedVersion 執行真正的 action。

## Steps

1. [為何 LLM 決策必須包進 Step？用 Inngest 打造可靠的工作流](decisions-special-cases-and-actions/decision-as-step.md)
2. [處理 Agent 的特殊決策：為 wait、complete 與 request_help 建立持久化 step](decisions-special-cases-and-actions/special-case-actions.md)
3. [Action ID 為何不必包成 Step：用行動政策分類執行權限](decisions-special-cases-and-actions/action-id-and-policy.md)
4. [把 Action 包進 Step：用 Idempotency Key 與版本比對防止重複改動世界](decisions-special-cases-and-actions/execute-actions-idempotently.md)
