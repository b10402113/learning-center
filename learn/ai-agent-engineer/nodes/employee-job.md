---
id: employee-job
title: "Give it a job"
subject: ai-agent-engineer
tier: 8
order: 25
status: draft
goal: "把 brain、skills、hooks、MCP、專用 inbox、cron loop、worktree 與晨間 PR triage 組成一份無人值守的工作。"
digests:
  - agentic-coding-handbook.9.part.md
  - course-kit.md
  - brain-template.md
  - skills.1.part.md
  - ticket-bay.1.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/ai-employee.md"
  - "learn/ai-agent-engineer/nodes/email-loop.md"
  - "learn/ai-agent-engineer/nodes/prompt-injection.md"
steps: []
created: 2026-11-03
updated: 2026-11-03
---

# Give it a job

## Lesson

一份無人值守的工作需要 trigger、worktree、skill、connector、checker 與 run 外的 memory。專用 inbox 只讀不寄，cron 每十五分鐘領取最舊未處理的信，pre_verify 最多退回三次，早上再把 PR 依風險排成 queue。Host 與 sandbox 的分層，決定 agent 能碰到什麼、不能碰到什麼。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
