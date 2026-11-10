---
id: custom-tool-loop
title: 自訂工具迴圈
subject: background-agent
tier: 2
order: 4
status: written
goal: >-
  能觀察一次真實 run 的 observe → predict → act 軌跡，並用 Inngest dashboard
  與資料庫解釋它為何重複行動、停在決策上限。
digests:
  - 6-custom-tool-loop.md
  - 7-loop-walkthrough.md
  - 8-running-the-background-agents.md
  - 9-dashboard-database-schema.md
  - lessons-01-goal-and-harness.md
  - server.md
prerequisites:
  - learn/background-agent/nodes/give-the-agent-a-goal.md
steps:
  - id: why-a-custom-loop
    author: google/gemini-3.8-flash
    title: 為什麼 Agent Harness 要自建工具迴圈？
    purpose: 能說明為何 harness 要自己寫迴圈，並指出 wait、request_help、complete、rollback 在哪裡被攔下。
    sources:
      - >-
        [[sources/background-agent/20261109/course/6-custom-tool-loop.txt#L1-L48]]
      - >-
        [[sources/background-agent/20261109/supplement/lessons/01-goal-and-harness/index.md#L6-L24]]
      - >-
        [[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L141-L185]]
      - >-
        [[sources/background-agent/20261109/supplement/server/tool-policy.ts#L1-L15]]
    blocks:
      - harness-owned-tool-loop
      - action-policy
  - id: execute-and-record-an-action
    author: google/gemini-3.8-flash
    title: 將 Agent 動作派送至 Checkout Service 並記錄執行結果
    purpose: >-
      能把選定的 action 送到 checkout service 的 /operations，並用 action ID 與
      expectedVersion 記錄執行結果。
    sources:
      - >-
        [[sources/background-agent/20261109/course/6-custom-tool-loop.txt#L49-L116]]
      - >-
        [[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L20-L56]]
      - >-
        [[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L187-L195]]
      - >-
        [[sources/background-agent/20261109/supplement/server/agent-data.ts#L156-L173]]
    blocks:
      - state-as-feedback
      - action-execution-and-audit
  - id: trace-one-run-through-state
    author: google/gemini-3.8-flash
    title: 解讀背景 Agent 的執行軌跡：從狀態日誌看 Observe、Predict 與 Act
    purpose: >-
      能從 state 與 activity log 讀出一次 run 的 observe → predict → act
      軌跡，並分辨讀取與改寫狀態的行動。
    sources:
      - >-
        [[sources/background-agent/20261109/course/7-loop-walkthrough.txt#L1-L84]]
      - >-
        [[sources/background-agent/20261109/course/8-running-the-background-agents.txt#L11-L68]]
      - >-
        [[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L81-L99]]
      - >-
        [[sources/background-agent/20261109/supplement/server/agent-data.ts#L63-L121]]
    blocks:
      - harness-owned-tool-loop
      - action-policy
      - state-as-feedback
      - decision-limit-and-history
  - id: read-dashboard-and-database
    author: google/gemini-3.8-flash
    title: 用 Inngest Dashboard 與資料表排查代理重複行動與決策上限
    purpose: 能用 Inngest dashboard 與 events/actions/runs 資料表解釋代理為何重複行動、為何停在決策上限。
    sources:
      - >-
        [[sources/background-agent/20261109/course/9-dashboard-database-schema.txt#L9-L103]]
      - >-
        [[sources/background-agent/20261109/course/6-custom-tool-loop.txt#L117-L127]]
      - >-
        [[sources/background-agent/20261109/course/8-running-the-background-agents.txt#L69-L77]]
      - >-
        [[sources/background-agent/20261109/supplement/server/schema.ts#L51-L90]]
      - >-
        [[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L212-L215]]
    blocks:
      - state-as-feedback
      - action-execution-and-audit
      - decision-limit-and-history
created: 2026-11-09T00:00:00.000Z
updated: 2026-11-08T00:00:00.000Z
---

# 自訂工具迴圈

## Lesson

有了第一個迴圈之後，重點變成看清楚它實際做了什麼：action 如何送到 checkout service、哪些 action 被攔下、狀態沒有改變時代理為什麼會原地打轉。這個節點用一次真實 run 與 Inngest dashboard／資料庫，把 observe → predict → act 的軌跡讀成可除錯的故事。

## Steps

1. [為什麼 Agent Harness 要自建工具迴圈？](custom-tool-loop/why-a-custom-loop.md)
2. [將 Agent 動作派送至 Checkout Service 並記錄執行結果](custom-tool-loop/execute-and-record-an-action.md)
3. [解讀背景 Agent 的執行軌跡：從狀態日誌看 Observe、Predict 與 Act](custom-tool-loop/trace-one-run-through-state.md)
4. [用 Inngest Dashboard 與資料表排查代理重複行動與決策上限](custom-tool-loop/read-dashboard-and-database.md)
