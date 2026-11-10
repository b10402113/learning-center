---
id: wait-for-the-world
title: "等待世界"
subject: background-agent
tier: 3
order: 7
status: written
goal: "能用 waitForEvent + eventSequence 讓同一個 run 等待、醒來、重新觀察並完成，並跑過 dependency fault 測試。"
digests:
  - 16-when-to-wait-for-input.md
  - 17-add-wait-conditions-steps.md
  - 18-waiting-loop.md
  - 19-testing-wait-resume.md
  - lessons-03-events-and-waiting.md
  - server.md
  - service.md
prerequisites:
  - learn/background-agent/nodes/decisions-special-cases-and-actions.md
steps:
  - id: when-waiting-beats-acting
    author: "z-ai/glm-5.3-flash"
    title: "讓代理自己決定什麼時候等：Wait for the World"
    purpose: "能判斷何時該讓代理自己選擇等待，並說明為何等待與求助屬於 agent，而核准屬於 harness。"
    sources:
      - "[[sources/background-agent/20261109/course/16-when-to-wait-for-input.txt#L1-L16]]"
      - "[[sources/background-agent/20261109/course/16-when-to-wait-for-input.txt#L17-L37]]"
      - "[[sources/background-agent/20261109/course/16-when-to-wait-for-input.txt#L38-L57]]"
  - id: three-pause-paths
    author: "z-ai/glm-5.3-flash"
    title: "幫 Agent 建立暫停分支：wait、request_help 與被擋下的 complete"
    purpose: "能為 wait、request_help 與未達標的 complete 各寫一條暫停分支，並把 run 標成 waiting。"
    sources:
      - "[[sources/background-agent/20261109/course/17-add-wait-conditions-steps.txt#L1-L24]]"
      - "[[sources/background-agent/20261109/course/17-add-wait-conditions-steps.txt#L25-L48]]"
      - "[[sources/background-agent/20261109/course/17-add-wait-conditions-steps.txt#L49-L74]]"
      - "[[sources/background-agent/20261109/supplement/lessons/03-events-and-waiting/index.md#L35-L64]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L99-L117]]"
  - id: wait-for-event-semantics
    author: "z-ai/glm-5.3-flash"
    title: "step.waitForEvent：讓工作流停在某一步，等事件來或等時間到"
    purpose: "能說明 waitForEvent 的 event、filter 與 timeout 語意，並維持 control flow 的確定性。"
    sources:
      - "[[sources/background-agent/20261109/course/17-add-wait-conditions-steps.txt#L75-L107]]"
      - "[[sources/background-agent/20261109/supplement/lessons/03-events-and-waiting/index.md#L9-L19]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L118-L131]]"
  - id: event-sequence-wait-loop
    author: "z-ai/glm-5.3-flash"
    title: "讓工作流乖乖等事件：用 while 迴圈與 eventSequence 寫出等待邏輯"
    purpose: "能在 while 迴圈比對 eventSequence、每次醒來前重驗 run 狀態，並用 10 秒 timeout 補漏接。"
    sources:
      - "[[sources/background-agent/20261109/course/18-waiting-loop.txt#L1-L38]]"
      - "[[sources/background-agent/20261109/course/18-waiting-loop.txt#L39-L95]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L118-L133]]"
      - "[[sources/background-agent/20261109/supplement/server/incident-data.ts#L90-L111]]"
  - id: test-wait-and-resume
    author: "z-ai/glm-5.3-flash"
    title: "讓同一個 run 等待、醒來、重新觀察、再完成：dependency fault 實測"
    purpose: "能跑 dependency fault 讓同一個 run 等待、醒來、重新觀察並完成，並解釋 0 ms 與多 alert 的結果。"
    sources:
      - "[[sources/background-agent/20261109/course/19-testing-wait-resume.txt#L1-L26]]"
      - "[[sources/background-agent/20261109/course/19-testing-wait-resume.txt#L39-L62]]"
      - "[[sources/background-agent/20261109/course/19-testing-wait-resume.txt#L63-L105]]"
      - "[[sources/background-agent/20261109/supplement/lessons/03-events-and-waiting/index.md#L118-L129]]"
      - "[[sources/background-agent/20261109/supplement/server/observe.ts#L1-L17]]"
      - "[[sources/background-agent/20261109/supplement/service/checkout.ts#L95-L107]]"
created: 2026-11-09
updated: 2026-11-10
---

# 等待世界

## Lesson

世界不會停下來等代理跑完：依賴可能在兩次觀察之間恢復，多個 alert 也可能描述同一場事故。這個節點把 wait 變成真正的 durable pause：用 waitForEvent 等待事件、用 eventSequence 補漏接，醒來後重新觀察，而不是把事件 payload 當成最新快照。

## Steps

1. [讓代理自己決定什麼時候等：Wait for the World](wait-for-the-world/when-waiting-beats-acting.md)
2. [幫 Agent 建立暫停分支：wait、request_help 與被擋下的 complete](wait-for-the-world/three-pause-paths.md)
3. [step.waitForEvent：讓工作流停在某一步，等事件來或等時間到](wait-for-the-world/wait-for-event-semantics.md)
4. [讓工作流乖乖等事件：用 while 迴圈與 eventSequence 寫出等待邏輯](wait-for-the-world/event-sequence-wait-loop.md)
5. [讓同一個 run 等待、醒來、重新觀察、再完成：dependency fault 實測](wait-for-the-world/test-wait-and-resume.md)
