---
id: tools-and-mcp
title: "Tools · MCP"
subject: ai-agent-engineer
tier: 2
order: 9
status: draft
goal: "選對 Context7、Playwright、Chrome DevTools，並分清楚何時用 skill、CLI 或 MCP。"
digests:
  - agentic-coding-handbook.2.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/harness-engineering.md"
steps: []
created: 2026-11-03
updated: 2026-11-03
---

# Tools · MCP

## Lesson

MCP 讓 agent 連到 repo 外的系統，server 提供工具，harness 負責執行。專案需要的 server 要短，否則相似工具會讓模型選錯。選擇準則很簡單：程序用 skill、有好 CLI 用 CLI、只有 live state 才用 MCP。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
