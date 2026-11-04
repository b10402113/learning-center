---
id: build-mcp-server
title: "Build an MCP server"
subject: ai-agent-engineer
tier: 6
order: 21
status: draft
goal: "從本機 stdio 到線上 /api/mcp，用每人一把 key、scope、401 與 deep link 把產品動作變成 agent 的工具。"
digests:
  - agentic-coding-handbook.6.part.md
  - course-kit.md
  - ticket-bay.1.part.md
  - ticket-bay.2.part.md
  - ticket-bay.3.part.md
  - ticket-bay.4.part.md
prerequisites: []
steps: []
created: 2026-11-03
updated: 2026-11-03
---

# Build an MCP server

## Lesson

MCP server 把產品動作包成具名、有描述與型別輸入的 tool，讓 agent 不必像人一樣點網頁。本機 server 用 stdio、免登入；線上 server 則要回答誰在呼叫、被允許做什麼、代表誰。每位使用者一把 key，危險動作只回 deep link，由人在 dashboard 確認。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
