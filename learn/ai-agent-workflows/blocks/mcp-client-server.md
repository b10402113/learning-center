---
id: mcp-client-server
title: "MCP Client 與 Server（MCP 用戶端與伺服器）"
label: "MCP Client 與 Server"
subject: ai-agent-workflows
type: contrast
status: draft
summary: "MCP Server 提供並執行工具，MCP Client 是 harness，負責與 server 通訊並把結果交給 LLM。"
aliases: []
prerequisites: []
related:
  - mcp
sources:
  - "[[sources/ai-agent-workflows/20261105/course/3-mcp-skills.txt#L15-L34]]"
created: 2026-11-06
updated: 2026-11-06
---

# MCP Client 與 Server（MCP 用戶端與伺服器）

## A 是什麼

MCP Server 是依 MCP 標準提供工具清單與執行能力的一端。它包住某個服務的 API，把可用工具整理好，並在收到請求時真正執行背後的呼叫。例如 Slack 的 MCP server 提供讀取與發送訊息等工具。

## B 是什麼

MCP Client 是與 server 通訊的一端，通常是 harness、Copilot、Cursor 或 IDE 介面。它把工具清單交給 LLM，依模型的決定向 server 發出執行請求，再把結果餵回模型。

## 關鍵差異

Server 擁有並執行工具，Client 負責中介與轉送。模型本身無法直接接觸外部世界，必須靠 client 這個中介者去呼叫 server；server 執行完的資料也先回到 client，才回到 LLM。

## 何時用哪個

要接一個新服務時，先找它是否已有官方 MCP server，沒有就自己建 server；在 agent 這一端則實作或選用支援 MCP 的 client。兩者角色不同，不是二選一。

## 進階

一個 client 可以同時接多個 server，把不同服務的工具彙整給同一個模型；server 的品質與可用性，則決定這條連接穩不穩定。
