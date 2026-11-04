---
id: ai-employee
title: "Your 24/7 AI employee"
subject: ai-agent-engineer
tier: 8
order: 24
status: draft
goal: "在自有機器上裝好 Hermes gateway、rootless Docker sandbox、模型登入與 fallback chain。"
digests:
  - agentic-coding-handbook.8.part.md
  - agentic-coding-handbook.9.part.md
  - course-kit.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/boundary-engineering.md"
  - "learn/ai-agent-engineer/nodes/connect-capture-lint.md"
  - "learn/ai-agent-engineer/nodes/build-mcp-server.md"
steps: []
created: 2026-11-03
updated: 2026-11-03
---

# Your 24/7 AI employee

## Lesson

AI employee 是跑在自己伺服器上的背景服務，工作來自 Discord 訊息或 cron。Hermes gateway 在 host 執行，所有 shell 指令進 rootless Docker sandbox，模型登入與 token 留在 gateway 外。先裝好 engine、sandbox 與 approvals，才談它要做什麼。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
