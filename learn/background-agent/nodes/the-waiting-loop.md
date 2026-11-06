---
id: the-waiting-loop
title: "等待迴圈"
subject: background-agent
tier: 2
order: 11
status: written
goal: "能實作可重播的等待迴圈，並用同一個 run 完成 wait → 醒來 → 重新觀察 → 完成。"
digests:
  - 18-waiting-loop.md
  - 19-testing-wait-resume.md
  - lessons-03-events-and-waiting.md
  - notes-course-plan.md
  - server.md
  - service.md
prerequisites:
  - learn/background-agent/nodes/wait-for-the-world.md
steps:
  - id: wait-is-an-inner-loop
    author: "google/gemini-3.8-flash"
    title: "每一次都重新檢查"
    purpose: "能說明等待為何是巢狀 while 迴圈，並用 check 計數與終止狀態檢查讓每輪可重播。"
    sources:
      - "[[sources/background-agent/20261105/18-waiting-loop.vtt#L1-L40]]"
      - "[[sources/background-agent/20261105/18-waiting-loop.vtt#L40-L88]]"
      - "[[sources/background-agent/20261105/18-waiting-loop.vtt#L88-L112]]"
      - "[[sources/background-agent/20261105/18-waiting-loop.vtt#L112-L145]]"
      - "[[sources/background-agent/20261105/18-waiting-loop.vtt#L175-L230]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L99-L124]]"
  - id: poll-before-you-wait
    author: "google/gemini-3.8-flash"
    title: "通知可能搶在等待註冊之前"
    purpose: "能用 eventSequence 先檢查再等待，並用逾時重檢接住搶在註冊前落地的事件。"
    sources:
      - "[[sources/background-agent/20261105/18-waiting-loop.vtt#L145-L175]]"
      - "[[sources/background-agent/20261105/18-waiting-loop.vtt#L230-L290]]"
      - "[[sources/background-agent/20261105/18-waiting-loop.vtt#L290-L340]]"
      - "[[sources/background-agent/20261105/18-waiting-loop.vtt#L340-L400]]"
      - "[[sources/background-agent/20261105/18-waiting-loop.vtt#L560-L630]]"
      - "[[sources/background-agent/20261105/lessons/03-events-and-waiting/index.md#L13-L19]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L118-L132]]"
      - "[[sources/background-agent/20261105/server/incident-data.ts#L89-L119]]"
  - id: wake-resumes-the-same-run
    author: "google/gemini-3.8-flash"
    title: "醒來後接著跑下一行"
    purpose: "能說明喚醒如何從同一 run 的下一行續跑、重新觀察並完成，而不是另開 run。"
    sources:
      - "[[sources/background-agent/20261105/19-testing-wait-resume.vtt#L1-L40]]"
      - "[[sources/background-agent/20261105/19-testing-wait-resume.vtt#L80-L130]]"
      - "[[sources/background-agent/20261105/19-testing-wait-resume.vtt#L420-L480]]"
      - "[[sources/background-agent/20261105/19-testing-wait-resume.vtt#L480-L540]]"
      - "[[sources/background-agent/20261105/19-testing-wait-resume.vtt#L540-L580]]"
      - "[[sources/background-agent/20261105/lessons/03-events-and-waiting/index.md#L20-L34]]"
      - "[[sources/background-agent/20261105/notes/course-plan.md#L6-L7]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L120-L134]]"
      - "[[sources/background-agent/20261105/server/incident-data.ts#L91-L111]]"
      - "[[sources/background-agent/20261105/server/observe.ts#L1-L17]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L95-L108]]"
  - id: prove-the-loop-with-faults
    author: "google/gemini-3.8-flash"
    title: "故意弄壞它"
    purpose: "能用延遲恢復、重複告警與零秒恢復驗證等待迴圈，並解釋卡住與改走求助的原因。"
    sources:
      - "[[sources/background-agent/20261105/19-testing-wait-resume.vtt#L40-L80]]"
      - "[[sources/background-agent/20261105/19-testing-wait-resume.vtt#L130-L190]]"
      - "[[sources/background-agent/20261105/19-testing-wait-resume.vtt#L190-L240]]"
      - "[[sources/background-agent/20261105/19-testing-wait-resume.vtt#L240-L300]]"
      - "[[sources/background-agent/20261105/19-testing-wait-resume.vtt#L300-L360]]"
      - "[[sources/background-agent/20261105/19-testing-wait-resume.vtt#L360-L420]]"
      - "[[sources/background-agent/20261105/19-testing-wait-resume.vtt#L580-L640]]"
      - "[[sources/background-agent/20261105/19-testing-wait-resume.vtt#L640-L681]]"
      - "[[sources/background-agent/20261105/lessons/03-events-and-waiting/index.md#L118-L125]]"
      - "[[sources/background-agent/20261105/lessons/03-events-and-waiting/index.md#L126-L137]]"
      - "[[sources/background-agent/20261105/notes/course-plan.md#L8-L11]]"
created: 2026-11-05
updated: 2026-11-05
---

# 等待迴圈

## Lesson

等待不是一次 sleep，而是一個每次都重新檢查事件序號、run 狀態與逾時的迴圈。這個節點實作可重播的等待，並用同一個 run id 驗證 wait → 醒來 → 重新觀察 → 完成的整條路徑。

## Steps

1. [每一次都重新檢查](the-waiting-loop/wait-is-an-inner-loop.md)
2. [通知可能搶在等待註冊之前](the-waiting-loop/poll-before-you-wait.md)
3. [醒來後接著跑下一行](the-waiting-loop/wake-resumes-the-same-run.md)
4. [故意弄壞它](the-waiting-loop/prove-the-loop-with-faults.md)
