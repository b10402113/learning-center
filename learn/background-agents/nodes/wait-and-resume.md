---
id: wait-and-resume
title: "等待與事件關聯：醒來之後接回"
subject: background-agents
tier: 2
order: 5
status: draft
goal: "用「event 是門鈴不是快照」解釋醒來為何要重讀 state，以及 waitForEvent + eventSequence 對帳、timeout、resume。"
prerequisites: []
steps: []
created: 2026-10-27
updated: 2026-10-27
---

# 等待與事件關聯：醒來之後接回

## Lesson

event 是門鈴，不是房間快照，agent 醒來必須重讀現況。`waitForEvent` 加 timeout 與 eventSequence 對帳，讓暫停的 run 能被事件或人工喚醒後接回。這是「關掉還活著」的關鍵。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
