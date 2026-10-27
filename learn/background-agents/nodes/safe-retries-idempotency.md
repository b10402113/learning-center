---
id: safe-retries-idempotency
title: "安全重試與 idempotency"
subject: background-agents
tier: 2
order: 7
status: draft
goal: "說出為何拆 step 不夠、還需要 idempotency key 與 derived action ID、expectedVersion 最後柵欄、cancelOn 與 lost-ack。"
prerequisites: []
steps: []
created: 2026-10-27
updated: 2026-10-27
---

# 安全重試與 idempotency

## Lesson

拆 step 只保證 checkpoint，不保證 effect 只發生一次。idempotency key 綁參數、action ID 用 run/cycle/action 推導、expectedVersion 是最後柵欄。lost-ack 與 cancelOn 收緊一致性。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
