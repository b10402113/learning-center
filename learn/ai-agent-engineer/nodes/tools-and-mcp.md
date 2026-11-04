---
id: tools-and-mcp
title: "Tools · MCP"
subject: ai-agent-engineer
tier: 2
order: 9
status: written
goal: "選對 Context7、Playwright、Chrome DevTools，並分清楚何時用 skill、CLI 或 MCP。"
digests:
  - agentic-coding-handbook.2.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/harness-engineering.md"
steps:
  - id: what-mcp-adds
    author: "gpt-6-luna"
    title: "工具 · MCP"
    purpose: "能說明 MCP 讓 agent 讀到 repo 外的真實狀態，而不是憑記憶寫 API 或猜頁面。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L317-L323]]"
  - id: three-servers
    author: "gpt-6-luna"
    title: "每個專案的三個 server"
    purpose: "能說出 Context7、Playwright、Chrome DevTools 各自解決什麼，並用 project scope 加進 .mcp.json。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L324-L365]]"
  - id: keep-the-list-short
    author: "gpt-6-luna"
    title: "把清單保持簡短"
    purpose: "能解釋 server 清單越長越容易選錯工具，並只留真正在用的 server。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L367-L373]]"
  - id: skill-cli-or-mcp
    author: "gpt-6-luna"
    title: "依 agent 的需要來選"
    purpose: "能依程序、好 CLI、live state 三種需求，選 skill、CLI 或 MCP。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L374-L391]]"
created: 2026-11-03
updated: 2026-11-04
---

# Tools · MCP

## Lesson

MCP 讓 agent 連到 repo 外的系統，server 提供工具，harness 負責執行。專案需要的 server 要短，否則相似工具會讓模型選錯。選擇準則很簡單：程序用 skill、有好 CLI 用 CLI、只有 live state 才用 MCP。

## Steps

1. [工具 · MCP](tools-and-mcp/what-mcp-adds.md)
2. [每個專案的三個 server](tools-and-mcp/three-servers.md)
3. [把清單保持簡短](tools-and-mcp/keep-the-list-short.md)
4. [依 agent 的需要來選](tools-and-mcp/skill-cli-or-mcp.md)
