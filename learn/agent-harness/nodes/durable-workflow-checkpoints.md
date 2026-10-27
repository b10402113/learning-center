---
id: durable-workflow-checkpoints
title: "Workflow：把不該重跑的事包成 step"
subject: agent-harness
tier: 2
order: 5
status: written
goal: "判斷哪些動作必須 durable，並解釋 recovery 為什麼會重跑 workflow body。"
prerequisites: []
steps:
  - id: what-must-be-durable
    title: "哪些動作不能重跑"
    purpose: "能列出 emit、tool call、LLM 呼叫三類必須 durable 的動作與重跑代價。"
    sources:
      - "[[sources/agent-harness/20260915/7-durable-execution-setup-with-neondb.txt#L95-L117]]"
      - "[[sources/agent-harness/20260915/12-durable-execution-recap.txt#L1-L47]]"
      - "[[sources/agent-harness/20260915/12-durable-execution-recap.txt#L48-L60]]"
  - id: workflow-body-vs-step
    title: "Workflow body 可以重跑，step 的結果會被記住"
    purpose: "能說明 workflow 與 step 的分工，並判斷哪段程式碼可以留在 step 外。"
    sources:
      - "[[sources/agent-harness/20260915/7-durable-execution-setup-with-neondb.txt#L178-L203]]"
      - "[[sources/agent-harness/20260915/9-durable-tools.txt#L1-L49]]"
      - "[[sources/agent-harness/20260915/10-durable-agent-loop.txt#L1-L9]]"
  - id: wrap-the-model-turn
    title: "把 modelTurn 包成 step"
    purpose: "能改寫 while 迴圈，用 DBOS step 包住 streamText，避免重啟重燒 token。"
    sources:
      - "[[sources/agent-harness/20260915/9-durable-tools.txt#L262-L435]]"
      - "[[sources/agent-harness/20260915/10-durable-agent-loop.txt#L10-L62]]"
  - id: wrap-the-tool-call
    title: "把 tool call 與回填包成 step"
    purpose: "能自己執行 tool call、以 tool role 回填結果，並把 emit 一起包進 step。"
    sources:
      - "[[sources/agent-harness/20260915/9-durable-tools.txt#L436-L497]]"
      - "[[sources/agent-harness/20260915/10-durable-agent-loop.txt#L63-L123]]"
      - "[[sources/agent-harness/20260915/10-durable-agent-loop.txt#L124-L192]]"
  - id: recovery-and-registration
    title: "Recovery 為什麼會重跑 workflow body"
    purpose: "能解釋註冊 workflow 後，重啟時如何跳過已完成 step 並續跑剩下的 body。"
    sources:
      - "[[sources/agent-harness/20260915/10-durable-agent-loop.txt#L193-L265]]"
      - "[[sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt#L307-L369]]"
      - "[[sources/agent-harness/20260915/12-durable-execution-recap.txt#L97-L136]]"
created: 2026-10-24
updated: 2026-10-27
---

# Workflow：把不該重跑的事包成 step

## Lesson

Durable execution 的分工很單純：workflow body 可以重跑，step 的結果會被 checkpoint。把模型呼叫、工具副作用與事件寫入包進 step，重啟後才知道哪些事不能再做。

## Steps

1. [哪些動作不能重跑](durable-workflow-checkpoints/what-must-be-durable.md)
2. [Workflow body 可以重跑，step 的結果會被記住](durable-workflow-checkpoints/workflow-body-vs-step.md)
3. [把 modelTurn 包成 step](durable-workflow-checkpoints/wrap-the-model-turn.md)
4. [把 tool call 與回填包成 step](durable-workflow-checkpoints/wrap-the-tool-call.md)
5. [Recovery 為什麼會重跑 workflow body](durable-workflow-checkpoints/recovery-and-registration.md)
