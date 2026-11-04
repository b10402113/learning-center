---
id: model-prompt-context
title: "Model、prompt、context"
subject: ai-agent-engineer
tier: 1
order: 3
status: draft
goal: "依工作選模型、用四件事寫 prompt、用 select／compress／isolate／offload 管好 context window。"
digests:
  - agentic-coding-handbook.1.part.md
prerequisites: []
steps: []
created: 2026-11-03
updated: 2026-11-03
---

# Model、prompt、context

## Lesson

一次呼叫由三層決定：模型的能力與成本、prompt 的指令品質、window 裡實際被讀到的內容。Prompt 有天花板，換句話說仍失敗時要往 context 看；context 滿了，早先的指令與修正都會被擠掉。三個層次分開診斷，才不會一直重寫同一句話。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
