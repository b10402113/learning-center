---
id: ask-for-help-and-hand-off
title: "求助並交接"
subject: background-agent
tier: 2
order: 14
status: draft
goal: "能實作 request_help 的暫停與恢復，並說明人的回答是上下文、不是世界已恢復的證據。"
digests:
  - 24-asking-for-help.md
  - lessons-06-incident-drill.md
  - server.md
  - web.md
prerequisites:
  - learn/background-agent/nodes/the-waiting-loop.md
  - learn/background-agent/nodes/put-a-human-in-control.md
steps: []
created: 2026-11-05
updated: 2026-11-05
---

# 求助並交接

## Lesson

有些問題不在代理的工具範圍內，這時 request_help 是合法的下一步，而不是失敗。這個節點讓代理停下來問人、把回答當成上下文、再重新觀察，並說明為什麼人的回答不能當成世界已恢復的證據。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
