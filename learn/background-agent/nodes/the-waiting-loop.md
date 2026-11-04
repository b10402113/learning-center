---
id: the-waiting-loop
title: "等待迴圈"
subject: background-agent
tier: 2
order: 11
status: draft
goal: "能實作可重播的等待迴圈，並用同一個 run 完成 wait → 醒來 → 重新觀察 → 完成。"
digests:
  - 18-waiting-loop.md
  - 19-testing-wait-resume.md
  - lessons-03-events-and-waiting.md
  - notes-course-plan.md
prerequisites:
  - learn/background-agent/nodes/wait-for-the-world.md
steps: []
created: 2026-11-05
updated: 2026-11-05
---

# 等待迴圈

## Lesson

等待不是一次 sleep，而是一個每次都重新檢查事件序號、run 狀態與逾時的迴圈。這個節點實作可重播的等待，並用同一個 run id 驗證 wait → 醒來 → 重新觀察 → 完成的整條路徑。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
