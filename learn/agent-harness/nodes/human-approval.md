---
id: human-approval
title: "Approval：人類等待是一種 durable state"
subject: agent-harness
tier: 3
order: 10
status: draft
goal: "用 DBOS recv/send 讓 workflow 停在審批點，重啟後仍能續行。"
prerequisites: []
steps: []
created: 2026-10-24
updated: 2026-10-24
---

# Approval：人類等待是一種 durable state

## Lesson

需要人類點頭的工具不能靠 prompt 提醒，而要由 harness 攔下來。Workflow 在審批點用 recv 暫停、用 send 喚醒，等待期間 process 可以死，重啟後仍從同一個 checkpoint 續行。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
