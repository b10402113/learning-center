---
id: connect-apps-mcp-api-cli
title: "怎麼接 Gmail／行事曆／YouTube——MCP、API、CLI 哪個省 token"
subject: claude-code-master
tier: 6
order: 11
status: draft
goal: "能比較 MCP／API／CLI 的 token 成本，選對連法把 Gmail、行事曆、YouTube 接上並真正自動化。"
prerequisites: []
steps: []
created: 2026-10-28
updated: 2026-10-28
---

# 怎麼接 Gmail／行事曆／YouTube——MCP、API、CLI 哪個省 token

## Lesson

要讓 agent 碰你真正在用的工具，有三種接法，而它們的 token 成本天差地遠：MCP 最簡單但每個 session 都把工具說明預載進 context、最燒 token；API 回傳一堆用不到的 JSON；CLI 最精簡——agent 打一行乾淨指令、只拿回它要的結果。這一課比較三者，並實際用 MCP 與 CLI 把 Gmail、行事曆、YouTube 接上，示範 CLI 能解掉 MCP 做不到的事（例如把信標成已讀）。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
