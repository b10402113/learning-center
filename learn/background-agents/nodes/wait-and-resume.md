---
id: wait-and-resume
title: "等待與事件關聯：醒來之後接回"
subject: background-agents
tier: 2
order: 5
status: written
goal: "用「event 是門鈴不是快照」解釋醒來為何要重讀 state，以及 waitForEvent + eventSequence 對帳、timeout、resume。"
prerequisites: []
steps:
  - id: event-is-doorbell-not-snapshot
    title: "事件是門鈴，不是快照：醒來先重讀現況"
    purpose: "能用「門鈴不是快照」解釋為什麼 agent 收到事件後必須重讀 state，並分辨等待的兩種來源。"
    sources:
      - "[[sources/background-agents/20261027/16-when-to-wait-for-input.md#L20-L27]]"
      - "[[sources/background-agents/20261027/16-when-to-wait-for-input.md#L28-L39]]"
  - id: three-ways-to-pause-and-waitforevent
    title: "三種暫停，與 waitForEvent 的契約"
    purpose: "能說出 wait、request help、complete 三種暫停的語意差別，並用 waitForEvent 寫出「等事件或 timeout」的暫停。"
    sources:
      - "[[sources/background-agents/20261027/17-add-wait-conditions-steps.md#L15-L23]]"
      - "[[sources/background-agents/20261027/17-add-wait-conditions-steps.md#L60-L73]]"
      - "[[sources/background-agents/20261027/17-add-wait-conditions-steps.md#L74-L81]]"
      - "[[sources/background-agents/20261027/17-add-wait-conditions-steps.md#L82-L93]]"
  - id: waiting-loop-and-event-sequence
    title: "等待迴圈：用 eventSequence 對帳"
    purpose: "能用 eventSequence 判斷有沒有新事件，並解釋為什麼每輪等待前都要重查 run 狀態。"
    sources:
      - "[[sources/background-agents/20261027/18-waiting-loop.md#L8-L19]]"
      - "[[sources/background-agents/20261027/18-waiting-loop.md#L20-L29]]"
      - "[[sources/background-agents/20261027/18-waiting-loop.md#L30-L47]]"
      - "[[sources/background-agents/20261027/18-waiting-loop.md#L48-L62]]"
  - id: wake-up-and-resume
    title: "醒來之後：continue 接回與自行求救"
    purpose: "能說明 resume 如何回到外層迴圈重新讀取 run 並完成，也知道把 timeout 設成 0 會讓 run 卡死。"
    sources:
      - "[[sources/background-agents/20261027/19-testing-wait-resume.md#L1-L9]]"
      - "[[sources/background-agents/20261027/19-testing-wait-resume.md#L43-L56]]"
      - "[[sources/background-agents/20261027/19-testing-wait-resume.md#L57-L63]]"
      - "[[sources/background-agents/20261027/19-testing-wait-resume.md#L73-L81]]"
created: 2026-10-27
updated: 2026-10-27
---

# 等待與事件關聯：醒來之後接回

## Lesson

event 是門鈴，不是房間快照，agent 醒來必須重讀現況。`waitForEvent` 加 timeout 與 eventSequence 對帳，讓暫停的 run 能被事件或人工喚醒後接回。這是「關掉還活著」的關鍵。

## Steps

1. [事件是門鈴，不是快照：醒來先重讀現況](wait-and-resume/event-is-doorbell-not-snapshot.md)
2. [三種暫停，與 waitForEvent 的契約](wait-and-resume/three-ways-to-pause-and-waitforevent.md)
3. [等待迴圈：用 eventSequence 對帳](wait-and-resume/waiting-loop-and-event-sequence.md)
4. [醒來之後：continue 接回與自行求救](wait-and-resume/wake-up-and-resume.md)
