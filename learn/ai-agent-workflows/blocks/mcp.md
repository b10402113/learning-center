---
id: mcp
title: MCP（模型上下文協定）
label: MCP
subject: ai-agent-workflows
type: concept
status: draft
summary: MCP 是連接工具與 API 到 LLM 的標準化通訊協定，統一傳輸與格式而非工具本身。
aliases: []
prerequisites: []
related: []
sources:
  - '[[sources/ai-agent-workflows/20261105/course/3-mcp-skills.txt#L1-L14]]'
created: 2026-11-06
updated: 2026-11-06
---

# MCP（模型上下文協定）

## 定義

MCP（Model Context Protocol，模型上下文協定）是一套把工具與 API 連接到 LLM 的標準化通訊協定。它由 Anthropic 於 2024 年推出，現屬 Linux Foundation 旗下的 AI Foundation。

## 為什麼重要

沒有標準時，每個服務的 API 連接方式都不同，只要服務商調整介面，寫在 agent 裡的串接程式就會壞掉。就像網際網路需要標準才催生 HTTPS，AI 也需要一套標準來規範工具、API 與 LLM 之間的連接。

## 如何運作

MCP 定義 client 與 server 之間的通訊方式與資料格式。MCP server 依標準提供可用工具清單，MCP client（通常是 harness 或 IDE）向 server 發出執行請求，server 執行背後的 API 後把結果回傳，client 再餵回 LLM。

## 例子

Slack 可以提供一個 MCP server，列出讀取訊息、發送訊息等工具；支援 MCP 的 client 接上後，就能讓模型使用這些工具。

## 邊界與常見誤解

MCP 不是工具本身，也不是某個產品或模型。它只標準化「怎麼連」與「長什麼格式」，不決定工具內部怎麼運作。生態與自建 server 才是實際能力所在。

## 進階

理解 MCP 的價值在於互通與維運分攤；接下來可進一步看 client/server 分工、標準化範圍，以及 API 變更責任的轉移。
