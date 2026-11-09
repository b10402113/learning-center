---
id: wait-for-the-world
title: "等待世界"
subject: background-agent
tier: 3
order: 7
status: draft
goal: "能用 waitForEvent + eventSequence 讓同一個 run 等待、醒來、重新觀察並完成，並跑過 dependency fault 測試。"
digests:
  - 16-when-to-wait-for-input.md
  - 17-add-wait-conditions-steps.md
  - 18-waiting-loop.md
  - 19-testing-wait-resume.md
  - lessons-03-events-and-waiting.md
  - server.md
prerequisites:
  - learn/background-agent/nodes/decisions-special-cases-and-actions.md
steps: []
created: 2026-11-09
updated: 2026-11-09
---

# 等待世界

## Lesson

世界不會停下來等代理跑完：依賴可能在兩次觀察之間恢復，多個 alert 也可能描述同一場事故。這個節點把 wait 變成真正的 durable pause：用 waitForEvent 等待事件、用 eventSequence 補漏接，醒來後重新觀察，而不是把事件 payload 當成最新快照。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
