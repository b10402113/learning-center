---
id: runtime-control-loop
title: "Runtime：一回合的控制平面"
subject: agent-harness
tier: 2
order: 2
status: written
goal: "追出一則 user 訊息如何變成 model turn、tool call 與 UI 事件，並指出迴圈的終止條件。"
digests:
  - 5-harness-runtime.md
  - 6-stream-messages-to-the-ui.md
prerequisites: []
steps:
  - id: turn-and-max-steps
    title: "一個 turn 是什麼：while 迴圈與 maxSteps"
    purpose: "能定義一個 turn，並說出 maxSteps 為何是 harness 自己設的上限。"
    sources:
      - "[[sources/agent-harness/20260915/5-harness-runtime.txt#L1-L54]]"
      - "[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#L152-L179]]"
      - "[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#L215-L258]]"
  - id: messages-are-the-state
    title: "Messages 陣列就是 agent 的狀態"
    purpose: "能組出 system + user messages，並解釋 LLM 無狀態為何每次都要重送整段對話。"
    sources:
      - "[[sources/agent-harness/20260915/5-harness-runtime.txt#L55-L118]]"
      - "[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#L1-L38]]"
  - id: stream-become-events
    title: "把 stream part 翻成 UI 事件"
    purpose: "能把 text delta、tool call、tool result、error 四種 part 各自對到一個事件。"
    sources:
      - "[[sources/agent-harness/20260915/5-harness-runtime.txt#L119-L186]]"
      - "[[sources/agent-harness/20260915/5-harness-runtime.txt#L187-L266]]"
      - "[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#L39-L82]]"
  - id: toolcall-is-a-request
    title: "Tool call 是請求，不是執行"
    purpose: "能說明模型只回傳名稱與參數，並用 toolCallID 把執行結果配對回去。"
    sources:
      - "[[sources/agent-harness/20260915/5-harness-runtime.txt#L267-L322]]"
      - "[[sources/agent-harness/20260915/5-harness-runtime.txt#L323-L380]]"
      - "[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#L109-L151]]"
  - id: how-the-loop-ends
    title: "迴圈怎麼結束：回答、maxSteps、失敗"
    purpose: "能指出正常收尾與異常收尾兩條路徑，並用 workflow failed 收掉例外。"
    sources:
      - "[[sources/agent-harness/20260915/5-harness-runtime.txt#L420-L476]]"
      - "[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#L109-L179]]"
created: 2026-10-24
updated: 2026-10-27
---

# Runtime：一回合的控制平面

## Lesson

Runtime 是 harness 的控制平面：同一個 while 迴圈決定何時叫模型、何時執行工具、何時收尾。先把一回合拆成可觀察的事件，後面的 durability 與 memory 才有地方掛進去。

## Steps

1. [一個 turn 是什麼：while 迴圈與 maxSteps](runtime-control-loop/turn-and-max-steps.md)
2. [Messages 陣列就是 agent 的狀態](runtime-control-loop/messages-are-the-state.md)
3. [把 stream part 翻成 UI 事件](runtime-control-loop/stream-become-events.md)
4. [Tool call 是請求，不是執行](runtime-control-loop/toolcall-is-a-request.md)
5. [迴圈怎麼結束：回答、maxSteps、失敗](runtime-control-loop/how-the-loop-ends.md)
