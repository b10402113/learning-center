---
id: subagents
title: "Subagents"
subject: ai-agent-engineer
tier: 2
order: 10
status: draft
goal: "知道何時該開子代理、為什麼 few for building, many for reading，以及何時只會變貴。"
digests:
  - agentic-coding-handbook.2.part.md
  - agentic-coding-handbook.3.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/model-prompt-context.md"
  - "learn/ai-agent-engineer/nodes/harness-engineering.md"
steps: []
created: 2026-11-03
updated: 2026-11-03
---

# Subagents

## Lesson

子代理有自己的 window，只把摘要帶回主代理；它看不到主對話與已讀檔案。讀取型任務可以平行，建置型任務則會互相衝突，除非各自開 worktree。十個代理不會讓結果好十倍，先從單一代理開始。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
