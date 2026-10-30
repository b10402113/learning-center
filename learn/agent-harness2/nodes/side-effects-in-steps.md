---
id: side-effects-in-steps
title: "重跑就重複扣款：把副作用包進 step"
subject: agent-harness2
tier: 2
order: 5
status: written
goal: "移除 AI SDK 的 `execute`、自己跑工具，把 tool call 與 emit 包成 `runStep`，示範重跑不會重打 LLM。"
digests:
  - 7-durable-execution-setup-with-neondb.md
  - 8-implementing-durable-execution.md
  - 9-durable-tools.md
  - harness-engineering.1.part.md
  - harness-engineering.2.part.md
  - harness-engineering.3.part.md
prerequisites: []
steps:
  - id: wrap-tool-calls-and-emits-in-steps
    title: "工具呼叫與 emit 為什麼要各自包成 step"
    purpose: "能指出 runtime 裡該 durable 的兩件事，並解釋為什麼 tool call 與 emit 包成 step 後才組成 workflow。"
    sources:
      - "[[sources/agent-harness2/20261029/9-durable-tools.txt#L1-L49]]"
      - "[[sources/agent-harness2/20261029/7-durable-execution-setup-with-neondb.txt#L177-L203]]"
  - id: remove-execute-take-back-tools
    title: "刪掉 execute：把工具執行權拿回來"
    purpose: "能說明 AI SDK 看到 execute 就自動執行工具，以及為什麼那會繞過 step、讓副作用重複。"
    sources:
      - "[[sources/agent-harness2/20261029/9-durable-tools.txt#L50-L98]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/tools.ts#L48-L95]]"
  - id: one-runtool-switch
    title: "把所有工具收進一個 runTool"
    purpose: "能把各 tool 的 execute 邏輯搬進單一 runTool 的 switch，並在未知工具時丟錯。"
    sources:
      - "[[sources/agent-harness2/20261029/9-durable-tools.txt#L139-L175]]"
      - "[[sources/agent-harness2/20261029/9-durable-tools.txt#L176-L229]]"
      - "[[sources/agent-harness2/20261029/9-durable-tools.txt#L230-L261]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/tools.ts#L97-L129]]"
  - id: model-turn-and-tool-step
    title: "把迴圈拆成 modelTurn 與 toolStep"
    purpose: "能定義 ToolCall、Turn，把模型回合與工具執行抽成獨立函式，為各自包 step 做準備。"
    sources:
      - "[[sources/agent-harness2/20261029/9-durable-tools.txt#L262-L300]]"
      - "[[sources/agent-harness2/20261029/9-durable-tools.txt#L301-L343]]"
      - "[[sources/agent-harness2/20261029/9-durable-tools.txt#L344-L359]]"
      - "[[sources/agent-harness2/20261029/9-durable-tools.txt#L360-L435]]"
      - "[[sources/agent-harness2/20261029/9-durable-tools.txt#L436-L481]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/runtime.ts#L24-L70]]"
  - id: runstep-rerun-does-not-recall-llm
    title: "用 DBOS.runStep 包住：重跑不會重打 LLM"
    purpose: "能用 DBOS.workflowID 與 runStep 包住 emit、modelTurn、toolStep，並從事件日誌證明重跑跳過已完成的工作。"
    sources:
      - "[[sources/agent-harness2/20261029/9-durable-tools.txt#L482-L497]]"
      - "[[sources/agent-harness2/20261029/9-durable-tools.txt#L498-L539]]"
      - "[[sources/agent-harness2/20261029/9-durable-tools.txt#L540-L546]]"
      - "[[sources/agent-harness2/20261029/8-implementing-durable-execution.txt#L293-L356]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/runtime.ts#L90-L140]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/runtime.ts#L185-L211]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/runtime.ts#L229-L231]]"
created: 2026-10-29
updated: 2026-10-29
---

# 重跑就重複扣款：把副作用包進 step

## Lesson

重跑時最貴的不是 token，是重複的副作用。把 tool call、emit、LLM 呼叫各自包進 step，親手移除 AI SDK 的自動執行，改用 harness 自己的 `runTool`，最後用事件日誌證明重跑沒有重複扣款。

## Steps

1. [工具呼叫與 emit 為什麼要各自包成 step](side-effects-in-steps/wrap-tool-calls-and-emits-in-steps.md)
2. [刪掉 execute：把工具執行權拿回來](side-effects-in-steps/remove-execute-take-back-tools.md)
3. [把所有工具收進一個 runTool](side-effects-in-steps/one-runtool-switch.md)
4. [把迴圈拆成 modelTurn 與 toolStep](side-effects-in-steps/model-turn-and-tool-step.md)
5. [用 DBOS.runStep 包住：重跑不會重打 LLM](side-effects-in-steps/runstep-rerun-does-not-recall-llm.md)
