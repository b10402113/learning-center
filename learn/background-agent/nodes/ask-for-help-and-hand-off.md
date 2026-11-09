---
id: ask-for-help-and-hand-off
title: "求助並交接"
subject: background-agent
tier: 3
order: 11
status: draft
goal: "能實作 request_help 的暫停、回答與 resume，並說明人的回答是上下文、不是世界已恢復的證據。"
digests:
  - 24-asking-for-help.md
  - lessons-06-incident-drill.md
  - server.md
prerequisites:
  - learn/background-agent/nodes/put-a-human-in-control.md
steps: []
created: 2026-11-09
updated: 2026-11-09
---

# 求助並交接

## Lesson

有些事故不是本地工具能修的：依賴掛掉時，rollback 自己的 release 沒有用。這個節點讓 request_help 走自己的 policy 與暫停路徑，把問題送進 inbox，回答後回到同一個 run 重新觀察，並強調人的回答是上下文，不是世界已恢復的證據。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
