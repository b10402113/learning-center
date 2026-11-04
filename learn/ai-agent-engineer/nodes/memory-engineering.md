---
id: memory-engineering
title: "Memory engineering"
subject: ai-agent-engineer
tier: 1
order: 5
status: draft
goal: "分清 memory 與 context，判斷什麼該進 memory、放哪裡、由誰寫。"
digests:
  - agentic-coding-handbook.1.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/the-map.md"
  - "learn/ai-agent-engineer/nodes/model-prompt-context.md"
steps: []
created: 2026-11-03
updated: 2026-11-03
---

# Memory engineering

## Lesson

Context 管這一次呼叫讀到什麼，memory 管下一個 session 一開始就知道什麼。程式碼只留下做了什麼，理由、否決過的選項與商業脈絡都必須另外存。Memory 的三個問題是 what goes in、where it lives、who writes it。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
