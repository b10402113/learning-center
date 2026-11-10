---
id: put-a-human-in-control
title: "讓人類掌握控制權"
subject: background-agent
tier: 3
order: 8
status: written
goal: "能實作 propose → wait → 重讀 → 重驗版本的核准流程，並處理 stale approval 與 rejection。"
digests:
  - 20-hitl-human-in-the-loop.md
  - 21-building-the-approval-flow.md
  - lessons-04-human-approval.md
  - server.md
  - web.md
prerequisites:
  - learn/background-agent/nodes/wait-for-the-world.md
steps:
  - id: human-judgment-inside-the-loop
    author: "z-ai/glm-5.3-flash"
    title: "卡在 run 中間等你：背景代理的 HITL 和聊天核准差在哪"
    purpose: "能用「卡在同一個 run 中間」與 inbox 說明背景代理的 HITL 和聊天核准有何不同。"
    sources:
      - "[[sources/background-agent/20261109/course/20-hitl-human-in-the-loop.txt#L1-L15]]"
      - "[[sources/background-agent/20261109/course/20-hitl-human-in-the-loop.txt#L16-L25]]"
      - "[[sources/background-agent/20261109/course/20-hitl-human-in-the-loop.txt#L26-L53]]"
      - "[[sources/background-agent/20261109/course/20-hitl-human-in-the-loop.txt#L54-L66]]"
      - "[[sources/background-agent/20261109/supplement/lessons/04-human-approval/index.md#L6-L12]]"
  - id: action-becomes-a-proposal
    author: "z-ai/glm-5.3-flash"
    title: "把需要核准的動作變成一張 Proposal"
    purpose: "能把需要核准的 action 存成帶 expectedVersion 與到期時間的 proposal，並讓 inbox 讀到它。"
    sources:
      - "[[sources/background-agent/20261109/course/20-hitl-human-in-the-loop.txt#L67-L83]]"
      - "[[sources/background-agent/20261109/course/20-hitl-human-in-the-loop.txt#L95-L113]]"
      - "[[sources/background-agent/20261109/course/21-building-the-approval-flow.txt#L1-L20]]"
      - "[[sources/background-agent/20261109/course/21-building-the-approval-flow.txt#L21-L41]]"
      - "[[sources/background-agent/20261109/course/21-building-the-approval-flow.txt#L42-L66]]"
      - "[[sources/background-agent/20261109/supplement/lessons/04-human-approval/index.md#L13-L19]]"
      - "[[sources/background-agent/20261109/supplement/lessons/04-human-approval/index.md#L45-L65]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-data.ts#L175-L212]]"
      - "[[sources/background-agent/20261109/supplement/server/schema.ts#L92-L107]]"
      - "[[sources/background-agent/20261109/supplement/server/operator.ts#L40-L49]]"
      - "[[sources/background-agent/20261109/supplement/web/src/App.tsx#L434-L474]]"
  - id: wait-for-a-correlated-decision
    author: "z-ai/glm-5.3-flash"
    title: "別相信手上的 proposal：把人工審核流程寫對"
    purpose: "能用 proposalId 過濾 approval 事件、timeout 後重讀 proposal，而不是信任喚醒當下的值。"
    sources:
      - "[[sources/background-agent/20261109/course/21-building-the-approval-flow.txt#L67-L73]]"
      - "[[sources/background-agent/20261109/course/21-building-the-approval-flow.txt#L74-L108]]"
      - "[[sources/background-agent/20261109/course/21-building-the-approval-flow.txt#L109-L136]]"
      - "[[sources/background-agent/20261109/supplement/lessons/04-human-approval/index.md#L66-L118]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-data.ts#L214-L226]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L158-L170]]"
  - id: recheck-before-acting
    author: "z-ai/glm-5.3-flash"
    title: "醒來之後先核對世界版本：核准通過不代表可以直接執行"
    purpose: "能在核准醒來後重讀世界版本，版本不符就標記 stale 重跑，被拒絕則升級。"
    sources:
      - "[[sources/background-agent/20261109/course/21-building-the-approval-flow.txt#L137-L149]]"
      - "[[sources/background-agent/20261109/course/21-building-the-approval-flow.txt#L150-L158]]"
      - "[[sources/background-agent/20261109/course/21-building-the-approval-flow.txt#L159-L175]]"
      - "[[sources/background-agent/20261109/course/21-building-the-approval-flow.txt#L176-L187]]"
      - "[[sources/background-agent/20261109/supplement/lessons/04-human-approval/index.md#L20-L33]]"
      - "[[sources/background-agent/20261109/supplement/lessons/04-human-approval/index.md#L119-L140]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-data.ts#L228-L288]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L171-L185]]"
      - "[[sources/background-agent/20261109/supplement/web/src/App.tsx#L490-L549]]"
created: 2026-11-09
updated: 2026-11-10
---

# 讓人類掌握控制權

## Lesson

模型可以發現某個 release 看起來有問題，但沒有權限直接 rollback；人類判斷要發生在 workflow 的中間，而不是迴圈結束之後。這個節點把 write／approval action 變成持久化的 proposal，透過 inbox 等待決定，醒來後重讀資料庫並重驗版本，避免用過期的授權執行。

## Steps

1. [卡在 run 中間等你：背景代理的 HITL 和聊天核准差在哪](put-a-human-in-control/human-judgment-inside-the-loop.md)
2. [把需要核准的動作變成一張 Proposal](put-a-human-in-control/action-becomes-a-proposal.md)
3. [別相信手上的 proposal：把人工審核流程寫對](put-a-human-in-control/wait-for-a-correlated-decision.md)
4. [醒來之後先核對世界版本：核准通過不代表可以直接執行](put-a-human-in-control/recheck-before-acting.md)
