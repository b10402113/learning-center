---
id: wait-for-the-world
title: "等待世界改變"
subject: background-agent
tier: 2
order: 10
status: draft
goal: "能說明事件只負責喚醒、醒來必須重讀狀態，並用 waitForEvent + eventSequence 避免漏接。"
digests:
  - 16-when-to-wait-for-input.md
  - 17-add-wait-conditions-steps.md
  - lessons-03-events-and-waiting.md
  - server.md
prerequisites:
  - learn/background-agent/nodes/make-progress-durable.md
steps: []
created: 2026-11-05
updated: 2026-11-05
---

# 等待世界改變

## Lesson

事件只是門鈴，通知世界可能變了，並不是一份可信任的快照。這個節點把 waitForEvent、eventSequence、醒來後重新觀察與完成判定串起來，讓代理可以停在原地等世界自己好轉。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
