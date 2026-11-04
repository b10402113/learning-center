---
id: subagents
title: "Subagents"
subject: ai-agent-engineer
tier: 2
order: 10
status: written
goal: "知道何時該開子代理、為什麼 few for building, many for reading，以及何時只會變貴。"
digests:
  - agentic-coding-handbook.2.part.md
  - agentic-coding-handbook.3.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/model-prompt-context.md"
  - "learn/ai-agent-engineer/nodes/harness-engineering.md"
steps:
  - id: a-separate-window
    author: "gpt-6-luna"
    title: "一個獨立的 window"
    purpose: "能解釋子代理為何存在：主 window 會被研究塞滿，自我審查又會沿用同一組假設。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L393-L403]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L1-L10]]"
  - id: few-for-building-many-for-reading
    author: "gpt-6-luna"
    title: "建置用少數，讀取用多數"
    purpose: "能判斷讀取型任務可平行、建置型任務會衝突，並用 worktree 隔開同時建置。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L11-L31]]"
  - id: when-subagents-cost-more
    author: "gpt-6-luna"
    title: "少即是多"
    purpose: "能算出多開子代理的三到十倍成本，並說出該加與不該加子代理的時機。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L32-L55]]"
created: 2026-11-03
updated: 2026-11-04
---

# Subagents

## Lesson

子代理有自己的 window，只把摘要帶回主代理；它看不到主對話與已讀檔案。讀取型任務可以平行，建置型任務則會互相衝突，除非各自開 worktree。十個代理不會讓結果好十倍，先從單一代理開始。

## Steps

1. [一個獨立的 window](subagents/a-separate-window.md)
2. [建置用少數，讀取用多數](subagents/few-for-building-many-for-reading.md)
3. [少即是多](subagents/when-subagents-cost-more.md)
