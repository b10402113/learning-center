---
id: model-prompt-context
title: "Model、prompt、context"
subject: ai-agent-engineer
tier: 1
order: 3
status: written
goal: "依工作選模型、用四件事寫 prompt、用 select／compress／isolate／offload 管好 context window。"
digests:
  - agentic-coding-handbook.1.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/the-map.md"
steps:
  - id: pick-the-model-per-job
    author: "gpt-6-luna"
    title: "依工作挑模型"
    purpose: "依推理難度、成本與程式碼去向選模型，並在換模型前先確認壞的不是 prompt 或 context。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L352-L392]]"
  - id: prompt-four-things
    author: "gpt-6-luna"
    title: "好 prompt 的四件事"
    purpose: "用成果與原因、驗證方式、不可碰的範圍、自家程式碼範例四件事寫一則可驗收的 prompt。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L393-L414]]"
  - id: context-window-fills-up
    author: "gpt-6-luna"
    title: "Window 是有限的"
    purpose: "說出 window 在輸入前已被什麼佔滿、為何越滿越失準，以及 compaction 會丟掉哪些指令。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L415-L442]]"
  - id: four-context-operations
    author: "gpt-6-luna"
    title: "四種 context 操作：select、compress、isolate、offload"
    purpose: "用 select、compress、isolate、offload 四個操作與 handoff 控制 window 裡實際被讀到的內容。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L443-L515]]"
created: 2026-11-03
updated: 2026-11-04
---

# Model、prompt、context

## Lesson

一次呼叫由三層決定：模型的能力與成本、prompt 的指令品質、window 裡實際被讀到的內容。Prompt 有天花板，換句話說仍失敗時要往 context 看；context 滿了，早先的指令與修正都會被擠掉。三個層次分開診斷，才不會一直重寫同一句話。

## Steps

1. [依工作挑模型](model-prompt-context/pick-the-model-per-job.md)
2. [好 prompt 的四件事](model-prompt-context/prompt-four-things.md)
3. [Window 是有限的](model-prompt-context/context-window-fills-up.md)
4. [四種 context 操作：select、compress、isolate、offload](model-prompt-context/four-context-operations.md)
