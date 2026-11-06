---
id: mcp-standardization-scope
title: "MCP 標準化範圍（Standardization Scope）"
label: "MCP 標準化範圍"
subject: ai-agent-workflows
type: concept
status: draft
summary: "MCP 只標準化傳輸方式與資料格式，不標準化工具本身，也不干涉工具內部邏輯。"
aliases: []
prerequisites: []
related:
  - mcp
sources:
  - "[[sources/ai-agent-workflows/20261105/course/3-mcp-skills.txt#L18-L22]]"
  - "[[sources/ai-agent-workflows/20261105/course/3-mcp-skills.txt#L39-L49]]"
created: 2026-11-06
updated: 2026-11-06
---

# MCP 標準化範圍（Standardization Scope）

## 定義

MCP 標準化範圍指協定真正管到的部分：client 與 server 之間的傳輸方式，以及交換資料的格式。它不包含工具內部的實作邏輯，也不是工具本身。

## 為什麼重要

釐清範圍才不會誤以為 MCP 定義了工具的行為或品質。正因為只統一連接層，任何支援標準的 client——Claude、Copilot、Cursor——都能接上同一個 MCP server，互通才成立。

## 如何運作

協定規範訊息怎麼送、欄位長什麼樣子；至於工具背後如何抓資料、怎麼運算，由 server 自行決定。MCP 只是一個標準，不執行任何工具，也不限制工具的實作方式。

## 例子

同一個 Slack MCP server 可以同時被 Claude、Copilot 與 Cursor 使用，因為它們都遵循同一套傳輸與格式；但 server 內部怎麼呼叫 Slack API，並不由 MCP 規定。

## 邊界與常見誤解

標準化連接不等於標準化工具語意或品質。工具好不好用，仍取決於 server 的實作與 metadata；MCP 本身也不會替你把工具寫對。

## 進階

理解這個界線後，評估重點會從「支不支援 MCP」轉向「server 提供哪些工具、metadata 清不清楚、維護是否可靠」。
