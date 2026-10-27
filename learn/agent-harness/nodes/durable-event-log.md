---
id: durable-event-log
title: "Event log：系統的狀態面"
subject: agent-harness
tier: 2
order: 4
status: written
goal: "說明事件如何先落 Postgres 再廣播，並用 seq 與 replay 重建斷線後的時間軸。"
prerequisites: []
steps:
  - id: events-cannot-live-in-memory
    title: "事件只活在記憶體裡，斷線就沒了"
    purpose: "能指出只有 WebSocket 串流時的遺失點，並說明為什麼需要可重播的儲存層。"
    sources:
      - "[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#L83-L108]]"
      - "[[sources/agent-harness/20260915/12-durable-execution-recap.txt#L137-L169]]"
  - id: event-log-schema
    title: "Event log 的 schema：seq 與 jsonb"
    purpose: "能解釋 seq 如何提供排序與去重，以及 payload 為什麼用 jsonb 存。"
    sources:
      - "[[sources/agent-harness/20260915/8-implementing-durable-execution.txt#L99-L155]]"
      - "[[sources/agent-harness/20260915/8-implementing-durable-execution.txt#L156-L194]]"
  - id: persist-then-broadcast
    title: "先落地再廣播：emit 的順序"
    purpose: "能寫出先 insert 再 fan-out 的 emit，並說明順序顛倒會壞在哪。"
    sources:
      - "[[sources/agent-harness/20260915/8-implementing-durable-execution.txt#L195-L243]]"
      - "[[sources/agent-harness/20260915/8-implementing-durable-execution.txt#L294-L356]]"
  - id: subscribe-and-history
    title: "subscribe 與 history：兩個方向的介面"
    purpose: "能實作會回傳 cleanup 的 subscribe，並用 history 依 seq 讀回全部事件。"
    sources:
      - "[[sources/agent-harness/20260915/8-implementing-durable-execution.txt#L244-L293]]"
      - "[[sources/agent-harness/20260915/8-implementing-durable-execution.txt#L357-L372]]"
  - id: replay-after-crash
    title: "重啟後 replay：把斷線的時間軸接回來"
    purpose: "能用 seq 重播歷史事件，說明為什麼重連後看到的是同一條時間軸。"
    sources:
      - "[[sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt#L161-L205]]"
      - "[[sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt#L307-L369]]"
      - "[[sources/agent-harness/20260915/12-durable-execution-recap.txt#L170-L214]]"
created: 2026-10-24
updated: 2026-10-27
---

# Event log：系統的狀態面

## Lesson

Harness 的狀態不在記憶體，而在事件流：每個 emit 先寫入 Postgres，再廣播給 UI。斷線或重啟後，client 靠 seq 排序的歷史事件重播，看到的是同一條時間軸。

## Steps

1. [事件只活在記憶體裡，斷線就沒了](durable-event-log/events-cannot-live-in-memory.md)
2. [Event log 的 schema：seq 與 jsonb](durable-event-log/event-log-schema.md)
3. [先落地再廣播：emit 的順序](durable-event-log/persist-then-broadcast.md)
4. [subscribe 與 history：兩個方向的介面](durable-event-log/subscribe-and-history.md)
5. [重啟後 replay：把斷線的時間軸接回來](durable-event-log/replay-after-crash.md)
