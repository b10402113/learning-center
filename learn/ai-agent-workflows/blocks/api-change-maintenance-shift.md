---
id: api-change-maintenance-shift
title: "API 變更維運轉移（Maintenance Shift）"
label: "API 變更維運轉移"
subject: ai-agent-workflows
type: concept
status: draft
summary: "採用 MCP 後，維持第三方 API 連線的責任從每個開發者轉移到提供 MCP server 的企業。"
aliases: []
prerequisites: []
related:
  - mcp
sources:
  - "[[sources/ai-agent-workflows/20261105/course/3-mcp-skills.txt#L60-L82]]"
created: 2026-11-06
updated: 2026-11-06
---

# API 變更維運轉移（Maintenance Shift）

## 定義

API 變更維運轉移指在 MCP 出現後，第三方服務的 API 改版時，負責修好連線的人從「每一個使用該服務的開發者」變成「提供該 MCP server 的企業」。

## 為什麼重要

在 MCP 之前，Slack 一改 API，所有自己接 Slack 的 agent 都會斷線，成千上萬、甚至數百萬名工程師得各自修補。這種重複勞動既浪費，也讓 agent 極易因外部變更而停擺。

## 如何運作

當企業發布並維護自己的 MCP server，確保這個連線與工具持續可用就成了企業的責任。開發者只要接上標準化的 MCP 介面，就不必追蹤每次 API 變更；server 會吸收這些差異。

## 例子

GitHub、Datadog、Slack 等公司提供自家的 MCP server，開發者透過 client 接上工具清單，API 內部怎麼改由服務商負責維持。

## 邊界與常見誤解

責任轉移不等於零風險。server 的品質、可用性與更新速度仍要評估；若自己建 server，維運責任其實又回到自己身上。

## 進階

評估一個 MCP server 時，除了工具功能，也要看它的維護者、更新頻率與故障處理，因為這些正是轉移過來的維運成本。
