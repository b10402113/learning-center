---
id: build-your-own-connector
title: "想接的 App 沒有 connector 怎麼辦"
subject: claude-code-master
tier: 6
order: 12
status: draft
goal: "能用 Printing Press 把任何 App 變成省 token 的 CLI（HAR→Go CLI→skill），或自己造 app 來掌控連線。"
prerequisites: []
steps: []
created: 2026-10-28
updated: 2026-10-28
---

# 想接的 App 沒有 connector 怎麼辦

## Lesson

當想接的 App 沒有現成 connector、甚至沒有公開 API，還是有路：Printing Press 讓你替任何 App 造一個 CLI。做法是先用 Chrome DevTools 錄下操作、複製成 HAR，Claude 再從中抽出真正的 API 呼叫，生成一個省 token 的 Go CLI（外加一個 skill、可選的 MCP server）。另一條路是自己造 app——自己掌控連線，往往比接第三方還簡單。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
