---
id: ask-for-help-and-hand-off
title: "求助並交接"
subject: background-agent
tier: 3
order: 11
status: written
goal: "能實作 request_help 的暫停、回答與 resume，並說明人的回答是上下文、不是世界已恢復的證據。"
digests:
  - 24-asking-for-help.md
  - lessons-06-incident-drill.md
  - server.md
prerequisites:
  - learn/background-agent/nodes/put-a-human-in-control.md
steps:
  - id: give-help-its-own-policy
    author: "z-ai/glm-5.3-flash"
    title: "把 `request_help` 從 wait 分支拉出來，接上 harness 的 policy 判斷"
    purpose: "能說明 request_help 為什麼不能沿用 wait 分支，並把 help 加進 harness 的 policy 判斷。"
    sources:
      - "[[sources/background-agent/20261109/course/24-asking-for-help.txt#L31-L49]]"
      - "[[sources/background-agent/20261109/supplement/lessons/06-incident-drill/index.md#L33-L50]]"
      - "[[sources/background-agent/20261109/supplement/server/tool-policy.ts#L1-L15]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L141-L143]]"
  - id: share-the-approval-path
    author: "z-ai/glm-5.3-flash"
    title: "讓 help 重用 proposal 與 human-decision wait"
    purpose: "能讓 help 重用 proposal 與 durable wait，並用 input 形狀區分問題與核准。"
    sources:
      - "[[sources/background-agent/20261109/course/24-asking-for-help.txt#L47-L60]]"
      - "[[sources/background-agent/20261109/supplement/lessons/06-incident-drill/index.md#L51-L100]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L141-L176]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-data.ts#L175-L212]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-data.ts#L228-L273]]"
  - id: force-a-fresh-observation
    author: "z-ai/glm-5.3-flash"
    title: "用 continue 回到迴圈頂端，讓 agent 重新看一次 state"
    purpose: "能用 continue 回到迴圈頂端重新觀察，而不是在分支裡臨時補一次 state 讀取。"
    sources:
      - "[[sources/background-agent/20261109/course/24-asking-for-help.txt#L61-L95]]"
      - "[[sources/background-agent/20261109/supplement/lessons/06-incident-drill/index.md#L101-L121]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L158-L185]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-data.ts#L63-L110]]"
  - id: answer-is-context-not-evidence
    author: "z-ai/glm-5.3-flash"
    title: "當 agent 開口求助：跑完一場事故演練"
    purpose: "能跑出求助、回答、再觀察的完整 run，並解釋人的回答只是上下文，不是恢復證據。"
    sources:
      - "[[sources/background-agent/20261109/course/24-asking-for-help.txt#L96-L127]]"
      - "[[sources/background-agent/20261109/supplement/lessons/06-incident-drill/index.md#L22-L32]]"
      - "[[sources/background-agent/20261109/supplement/lessons/06-incident-drill/index.md#L101-L128]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L171-L185]]"
  - id: evaluate-the-handoff
    author: "z-ai/glm-5.3-flash"
    title: "該改 policy 還是改 prompt？把代理表現拆成三件事來評"
    purpose: "能分開評估世界狀態、行動軌跡與人類邊界，並判斷該改 policy 還是改 prompt。"
    sources:
      - "[[sources/background-agent/20261109/course/24-asking-for-help.txt#L109-L121]]"
      - "[[sources/background-agent/20261109/supplement/lessons/06-incident-drill/index.md#L14-L21]]"
      - "[[sources/background-agent/20261109/supplement/lessons/06-incident-drill/index.md#L119-L136]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-data.ts#L63-L110]]"
created: 2026-11-09
updated: 2026-11-10
---

# 求助並交接

## Lesson

有些事故不是本地工具能修的：依賴掛掉時，rollback 自己的 release 沒有用。這個節點讓 request_help 走自己的 policy 與暫停路徑，把問題送進 inbox，回答後回到同一個 run 重新觀察，並強調人的回答是上下文，不是世界已恢復的證據。

## Steps

1. [把 `request_help` 從 wait 分支拉出來，接上 harness 的 policy 判斷](ask-for-help-and-hand-off/give-help-its-own-policy.md)
2. [讓 help 重用 proposal 與 human-decision wait](ask-for-help-and-hand-off/share-the-approval-path.md)
3. [用 continue 回到迴圈頂端，讓 agent 重新看一次 state](ask-for-help-and-hand-off/force-a-fresh-observation.md)
4. [當 agent 開口求助：跑完一場事故演練](ask-for-help-and-hand-off/answer-is-context-not-evidence.md)
5. [該改 policy 還是改 prompt？把代理表現拆成三件事來評](ask-for-help-and-hand-off/evaluate-the-handoff.md)
