---
id: split-the-loop-into-steps
title: "把迴圈拆成獨立步驟"
subject: background-agent
tier: 2
order: 9
status: confirmed
goal: "能替觀察、決策、行動各建 step，並用 cycle 編號讓重播對得上。"
digests:
  - 12-multi-step-loop.md
  - 13-generate-a-decision.md
  - 14-handle-special-cases.md
  - 15-executing-actions.md
  - lessons-02-durable-execution.md
  - server.md
prerequisites:
  - learn/background-agent/nodes/make-progress-durable.md
steps:
  - id: cycle-named-checkpoints
    title: "把整個迴圈的 checkpoint 換成具名 step，並保留唯一的 cycle 後綴"
    purpose: "能替每一輪的觀察建具名 step，並用 cycle 編號讓重播對回同一個檢查點。"
    sources:
      - "[[sources/background-agent/20261105/12-multi-step-loop.vtt#L1-L120]]"
      - "[[sources/background-agent/20261105/12-multi-step-loop.vtt#L121-L280]]"
      - "[[sources/background-agent/20261105/12-multi-step-loop.vtt#L341-L415]]"
      - "[[sources/background-agent/20261105/lessons/02-durable-execution/index.md#L112-L243]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L1-L216]]"
  - id: the-decision-is-a-step
    title: "把 step 想成 useMemo"
    purpose: "能說明決策與 iteration 為何各自進 step，並用 replay 與 useMemo 解釋重播時的值從哪來。"
    sources:
      - "[[sources/background-agent/20261105/13-generate-a-decision.vtt#L1-L140]]"
      - "[[sources/background-agent/20261105/13-generate-a-decision.vtt#L141-L400]]"
      - "[[sources/background-agent/20261105/13-generate-a-decision.vtt#L401-L540]]"
      - "[[sources/background-agent/20261105/13-generate-a-decision.vtt#L541-L700]]"
      - "[[sources/background-agent/20261105/13-generate-a-decision.vtt#L791-L884]]"
      - "[[sources/background-agent/20261105/server/agent-brain.ts#L1-L51]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L139-L154]]"
  - id: one-async-per-step
    title: "非同步的事放進 step，而且一次只放一件"
    purpose: "能用 async ⇒ step、一個 step 一件事判斷切點，並說明重試時整個 step 會重跑的代價。"
    sources:
      - "[[sources/background-agent/20261105/12-multi-step-loop.vtt#L416-L510]]"
      - "[[sources/background-agent/20261105/12-multi-step-loop.vtt#L661-L790]]"
      - "[[sources/background-agent/20261105/12-multi-step-loop.vtt#L791-L998]]"
      - "[[sources/background-agent/20261105/13-generate-a-decision.vtt#L701-L790]]"
      - "[[sources/background-agent/20261105/lessons/02-durable-execution/index.md#L31-L36]]"
  - id: special-outcomes-exit-the-loop
    title: "需要一個 return，否則迴圈會繼續跑"
    purpose: "能為 wait、complete、request_help 各寫一個分支，並用 return 決定迴圈下一輪或結束。"
    sources:
      - "[[sources/background-agent/20261105/14-handle-special-cases.vtt#L1-L130]]"
      - "[[sources/background-agent/20261105/14-handle-special-cases.vtt#L131-L280]]"
      - "[[sources/background-agent/20261105/14-handle-special-cases.vtt#L281-L430]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L1-L216]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L16-L43]]"
  - id: policy-then-execute
    title: "AI 有沒有權限做這件事？"
    purpose: "能用 actionPolicy 分流並把執行包進 step，送出 expectedVersion、把 stale 結果當成功記錄。"
    sources:
      - "[[sources/background-agent/20261105/14-handle-special-cases.vtt#L431-L520]]"
      - "[[sources/background-agent/20261105/14-handle-special-cases.vtt#L521-L680]]"
      - "[[sources/background-agent/20261105/14-handle-special-cases.vtt#L681-L830]]"
      - "[[sources/background-agent/20261105/14-handle-special-cases.vtt#L831-L941]]"
      - "[[sources/background-agent/20261105/15-executing-actions.vtt#L1-L170]]"
      - "[[sources/background-agent/20261105/15-executing-actions.vtt#L171-L240]]"
      - "[[sources/background-agent/20261105/15-executing-actions.vtt#L241-L330]]"
      - "[[sources/background-agent/20261105/15-executing-actions.vtt#L401-L540]]"
      - "[[sources/background-agent/20261105/15-executing-actions.vtt#L541-L620]]"
      - "[[sources/background-agent/20261105/server/tool-policy.ts#L1-L15]]"
      - "[[sources/background-agent/20261105/server/schema.ts#L51-L90]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L1-L216]]"
created: 2026-11-05
updated: 2026-11-05
---

# 把迴圈拆成獨立步驟

## Lesson

把觀察、決策、特殊分支與行動各自拆成具名 step，重播才能跳過已完成的工作，並讓每個 cycle 在 Inngest 上可追蹤。這個節點也處理 complete／wait／help 的邊界，以及 expectedVersion 與 activity 記錄。

## Steps

1. [把整個迴圈的 checkpoint 換成具名 step，並保留唯一的 cycle 後綴](split-the-loop-into-steps/cycle-named-checkpoints.md)
2. [把 step 想成 useMemo](split-the-loop-into-steps/the-decision-is-a-step.md)
3. [非同步的事放進 step，而且一次只放一件](split-the-loop-into-steps/one-async-per-step.md)
4. [需要一個 return，否則迴圈會繼續跑](split-the-loop-into-steps/special-outcomes-exit-the-loop.md)
5. [AI 有沒有權限做這件事？](split-the-loop-into-steps/policy-then-execute.md)
