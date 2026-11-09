---
id: put-a-human-in-control
title: "讓人類掌握控制權"
subject: background-agent
tier: 3
order: 8
status: draft
goal: "能實作 propose → wait → 重讀 → 重驗版本的核准流程，並處理 stale approval 與 rejection。"
digests:
  - 20-hitl-human-in-the-loop.md
  - 21-building-the-approval-flow.md
  - lessons-04-human-approval.md
  - server.md
  - web.md
prerequisites:
  - learn/background-agent/nodes/wait-for-the-world.md
steps: []
created: 2026-11-09
updated: 2026-11-09
---

# 讓人類掌握控制權

## Lesson

模型可以發現某個 release 看起來有問題，但沒有權限直接 rollback；人類判斷要發生在 workflow 的中間，而不是迴圈結束之後。這個節點把 write／approval action 變成持久化的 proposal，透過 inbox 等待決定，醒來後重讀資料庫並重驗版本，避免用過期的授權執行。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
