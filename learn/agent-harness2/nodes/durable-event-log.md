---
id: durable-event-log
title: "斷線就失憶：把事件寫進資料庫"
subject: agent-harness2
tier: 2
order: 4
status: written
goal: "說出 checkpoint／replay／idempotency，並把 in-memory bus 換成先落地再廣播的 Postgres bus。"
prerequisites: []
steps:
  - id: restart-loses-everything
    title: "重啟之後，完全不知道發生什麼"
    purpose: "能說明 durable execution、checkpoint 與 idempotency，並指出 messages 只在記憶體時重啟會壞在哪。"
    sources:
      - "[[sources/agent-harness2/20261029/7-durable-execution-setup-with-neondb.txt#L1-L115]]"
      - "[[sources/agent-harness2/20261029/6-stream-messages-to-the-ui.txt#L82-L108]]"
  - id: runtime-as-steps
    title: "把 runtime 變成 step"
    purpose: "能說明 DBOS 如何用 workflow ID 與 step 的 input／output 跳過已完成工作，並把 Postgres 連線接上。"
    sources:
      - "[[sources/agent-harness2/20261029/7-durable-execution-setup-with-neondb.txt#L116-L256]]"
      - "[[sources/agent-harness2/20261029/8-implementing-durable-execution.txt#L1-L27]]"
  - id: event-log-table
    title: "event_log：用 seq 定序的事件日誌"
    purpose: "能定義 event_log 的 seq 與 jsonb 兩欄，並用 ensureSchema 在啟動時補上缺的表。"
    sources:
      - "[[sources/agent-harness2/20261029/8-implementing-durable-execution.txt#L28-L210]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/db.ts#L1-L39]]"
  - id: write-then-broadcast
    title: "先落地，再廣播"
    purpose: "能改寫 emit、subscribe、history，讓事件先寫進 Postgres 才通知 listener，重連時依 seq 重播。"
    sources:
      - "[[sources/agent-harness2/20261029/8-implementing-durable-execution.txt#L211-L372]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/bus.ts#L1-L29]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/shared/events.ts#L1-L71]]"
created: 2026-10-29
updated: 2026-10-29
---

# 斷線就失憶：把事件寫進資料庫

## Lesson

斷線就失憶是第一個要修的故障。先把 durable execution 的語彙裝好——workflow、step、checkpoint、replay、idempotency——再把 in-memory bus 換成寫進 Postgres 的 event log，讓「先落地、再可見」成為順序。

## Steps

1. [重啟之後，完全不知道發生什麼](durable-event-log/restart-loses-everything.md)
2. [把 runtime 變成 step](durable-event-log/runtime-as-steps.md)
3. [event_log：用 seq 定序的事件日誌](durable-event-log/event-log-table.md)
4. [先落地，再廣播](durable-event-log/write-then-broadcast.md)
