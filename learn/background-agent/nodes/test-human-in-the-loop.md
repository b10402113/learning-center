---
id: test-human-in-the-loop
title: "測試人類介入流程"
subject: background-agent
tier: 3
order: 9
status: written
goal: "能從 inbox 核准 rollback、讀 audit log，並解釋 durable suspension 與 resume 機制。"
digests:
  - 22-testing-hitl.md
  - lessons-04-human-approval.md
  - server.md
  - web.md
prerequisites:
  - learn/background-agent/nodes/put-a-human-in-control.md
steps:
  - id: run-the-approval-demo
    author: "z-ai/glm-5.3-flash"
    title: "跑一次 release fault：親眼看 harness 擋下 rollback、在 inbox 留下一筆待核准的 proposal"
    purpose: "能跑一次 release fault，看到 harness 擋下 rollback 並在 inbox 留下一筆待核准的 proposal。"
    sources:
      - "[[sources/background-agent/20261109/course/22-testing-hitl.txt#L5-L26]]"
      - "[[sources/background-agent/20261109/supplement/lessons/04-human-approval/index.md#L34-L44]]"
  - id: approve-and-audit
    author: "z-ai/glm-5.3-flash"
    title: "從 inbox 核准 rollback，沿 decide API 與 audit log 確認 run 恢復"
    purpose: "能從 inbox 核准 rollback，並沿 decide API 與 audit log 確認 state 更新、run 恢復。"
    sources:
      - "[[sources/background-agent/20261109/course/22-testing-hitl.txt#L27-L55]]"
      - "[[sources/background-agent/20261109/supplement/lessons/04-human-approval/index.md#L119-L125]]"
      - "[[sources/background-agent/20261109/supplement/web/src/App.tsx#L440-L545]]"
      - "[[sources/background-agent/20261109/supplement/server/operator.ts#L36-L50]]"
  - id: why-the-run-can-wait-forever
    author: "z-ai/glm-5.3-flash"
    title: "Agent 等你核准的期間，程式到底在哪裡？"
    purpose: "能說明 run 為何能無限期等待，並區分 runtime 的 durable suspension 與本機的 while 迴圈。"
    sources:
      - "[[sources/background-agent/20261109/course/22-testing-hitl.txt#L56-L70]]"
      - "[[sources/background-agent/20261109/supplement/lessons/04-human-approval/index.md#L6-L12]]"
  - id: resume-and-recheck
    author: "z-ai/glm-5.3-flash"
    title: "從按下核准按鈕那一刻說起：沿 approval.decided 事件追工作流"
    purpose: "能沿 approval.decided 事件追出 replay、快取快轉、版本重驗與 stale 分支。"
    sources:
      - "[[sources/background-agent/20261109/course/22-testing-hitl.txt#L71-L99]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L141-L185]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-data.ts#L214-L288]]"
  - id: read-the-trace-in-inngest
    author: "z-ai/glm-5.3-flash"
    title: "用 Inngest Trace 讀懂多次迴圈的執行軌跡"
    purpose: "能用 Inngest trace 的編號迴圈與 step 輸出讀懂多次迴圈的執行軌跡。"
    sources:
      - "[[sources/background-agent/20261109/course/22-testing-hitl.txt#L100-L111]]"
created: 2026-11-09
updated: 2026-11-10
---

# 測試人類介入流程

## Lesson

核准流程最難說服人的地方，是代理暫停期間程序可以消失、人類可以隔很久才回答，而 run 仍然必須接得回去。這個節點從 inbox 核准一次 rollback，沿著 audit log 與 Inngest trace 看 resume、版本重驗與 stale 分支，並說明 durable suspension 是 runtime 行為，不是自訂的等待程式。

## Steps

1. [跑一次 release fault：親眼看 harness 擋下 rollback、在 inbox 留下一筆待核准的 proposal](test-human-in-the-loop/run-the-approval-demo.md)
2. [從 inbox 核准 rollback，沿 decide API 與 audit log 確認 run 恢復](test-human-in-the-loop/approve-and-audit.md)
3. [Agent 等你核准的期間，程式到底在哪裡？](test-human-in-the-loop/why-the-run-can-wait-forever.md)
4. [從按下核准按鈕那一刻說起：沿 approval.decided 事件追工作流](test-human-in-the-loop/resume-and-recheck.md)
5. [用 Inngest Trace 讀懂多次迴圈的執行軌跡](test-human-in-the-loop/read-the-trace-in-inngest.md)
