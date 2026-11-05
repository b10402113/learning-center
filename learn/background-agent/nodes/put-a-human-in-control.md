---
id: put-a-human-in-control
title: "讓人類掌握控制權"
subject: background-agent
tier: 2
order: 12
status: confirmed
goal: "能實作 propose → wait → 重讀 → 重驗版本的批准流程，並處理 stale approval。"
digests:
  - 20-hitl-human-in-the-loop.md
  - 21-building-the-approval-flow.md
  - 22-testing-hitl.md
  - lessons-04-human-approval.md
  - server.md
  - web.md
prerequisites:
  - learn/background-agent/nodes/split-the-loop-into-steps.md
  - learn/background-agent/nodes/wait-for-the-world.md
steps:
  - id: approval-is-harness-policy
    title: "批准不是萬用的安全盾"
    purpose: "能說明批准是 harness 的政策決定、為何模型不該知道，以及何時該改為去風險化而非增加關卡。"
    sources:
      - "[[sources/background-agent/20261105/20-hitl-human-in-the-loop.vtt#L1-L47]]"
      - "[[sources/background-agent/20261105/20-hitl-human-in-the-loop.vtt#L48-L97]]"
      - "[[sources/background-agent/20261105/20-hitl-human-in-the-loop.vtt#L98-L190]]"
      - "[[sources/background-agent/20261105/20-hitl-human-in-the-loop.vtt#L191-L295]]"
      - "[[sources/background-agent/20261105/20-hitl-human-in-the-loop.vtt#L296-L405]]"
      - "[[sources/background-agent/20261105/20-hitl-human-in-the-loop.vtt#L406-L500]]"
      - "[[sources/background-agent/20261105/20-hitl-human-in-the-loop.vtt#L678-L742]]"
      - "[[sources/background-agent/20261105/20-hitl-human-in-the-loop.vtt#L743-L790]]"
      - "[[sources/background-agent/20261105/lessons/04-human-approval/index.md#L20-L33]]"
      - "[[sources/background-agent/20261105/server/tool-policy.ts#L1-L15]]"
  - id: persist-the-proposal
    purpose: "能把 proposal 連同 expectedVersion 寫進資料庫，並只回傳 id 讓下一步重讀，而不是沿用區域變數。"
    sources:
      - "[[sources/background-agent/20261105/21-building-the-approval-flow.vtt#L47-L160]]"
      - "[[sources/background-agent/20261105/21-building-the-approval-flow.vtt#L161-L315]]"
      - "[[sources/background-agent/20261105/21-building-the-approval-flow.vtt#L316-L481]]"
      - "[[sources/background-agent/20261105/lessons/04-human-approval/index.md#L45-L118]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L175-L212]]"
      - "[[sources/background-agent/20261105/server/schema.ts#L92-L108]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L141-L158]]"
  - id: wait-and-reread-the-decision
    purpose: "能用綁定 proposal.id 的 waitForEvent 等待決定，醒來後從資料庫重讀，並用 timeout 補救漏接的喚醒事件。"
    sources:
      - "[[sources/background-agent/20261105/21-building-the-approval-flow.vtt#L482-L524]]"
      - "[[sources/background-agent/20261105/21-building-the-approval-flow.vtt#L525-L668]]"
      - "[[sources/background-agent/20261105/21-building-the-approval-flow.vtt#L669-L770]]"
      - "[[sources/background-agent/20261105/21-building-the-approval-flow.vtt#L771-L902]]"
      - "[[sources/background-agent/20261105/21-building-the-approval-flow.vtt#L903-L1039]]"
      - "[[sources/background-agent/20261105/22-testing-hitl.vtt#L521-L616]]"
      - "[[sources/background-agent/20261105/lessons/04-human-approval/index.md#L66-L118]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L158-L170]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L214-L226]]"
      - "[[sources/background-agent/20261105/server/operator.ts#L40-L49]]"
  - id: recheck-and-invalidate-stale
    purpose: "能在執行前重驗 world version，用 staleProposal 讓過期批准離開 inbox，並把拒絕升級為 escalated。"
    sources:
      - "[[sources/background-agent/20261105/21-building-the-approval-flow.vtt#L1040-L1170]]"
      - "[[sources/background-agent/20261105/21-building-the-approval-flow.vtt#L1171-L1236]]"
      - "[[sources/background-agent/20261105/21-building-the-approval-flow.vtt#L1237-L1293]]"
      - "[[sources/background-agent/20261105/21-building-the-approval-flow.vtt#L1294-L1431]]"
      - "[[sources/background-agent/20261105/22-testing-hitl.vtt#L617-L690]]"
      - "[[sources/background-agent/20261105/lessons/04-human-approval/index.md#L119-L140]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L171-L185]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L228-L288]]"
  - id: exercise-the-three-outcomes
    purpose: "能用 fault release 演練 approve、reject、stale 三條結局，並在 Inngest run view 讀懂每個 loop 的輸出。"
    sources:
      - "[[sources/background-agent/20261105/22-testing-hitl.vtt#L1-L64]]"
      - "[[sources/background-agent/20261105/22-testing-hitl.vtt#L65-L120]]"
      - "[[sources/background-agent/20261105/22-testing-hitl.vtt#L121-L173]]"
      - "[[sources/background-agent/20261105/22-testing-hitl.vtt#L174-L249]]"
      - "[[sources/background-agent/20261105/22-testing-hitl.vtt#L250-L360]]"
      - "[[sources/background-agent/20261105/22-testing-hitl.vtt#L361-L475]]"
      - "[[sources/background-agent/20261105/22-testing-hitl.vtt#L476-L520]]"
      - "[[sources/background-agent/20261105/22-testing-hitl.vtt#L691-L755]]"
      - "[[sources/background-agent/20261105/lessons/04-human-approval/index.md#L119-L125]]"
      - "[[sources/background-agent/20261105/web/src/App.tsx#L367-L551]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L187-L211]]"
created: 2026-11-05
updated: 2026-11-05
---

# 讓人類掌握控制權

## Lesson

批准不是模型自己決定的禮貌詢問，而是 harness 對寫入型 action 的硬性關卡。這個節點實作 proposal → wait → 重讀 → 版本重驗的流程，並處理拒絕、stale 與過期。

## Steps

1. [批准不是萬用的安全盾](put-a-human-in-control/approval-is-harness-policy.md)
2. [persist-the-proposal](put-a-human-in-control/persist-the-proposal.md)
3. [wait-and-reread-the-decision](put-a-human-in-control/wait-and-reread-the-decision.md)
4. [recheck-and-invalidate-stale](put-a-human-in-control/recheck-and-invalidate-stale.md)
5. [exercise-the-three-outcomes](put-a-human-in-control/exercise-the-three-outcomes.md)
