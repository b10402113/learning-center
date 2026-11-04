---
id: put-a-human-in-control
title: "讓人類掌握控制權"
subject: background-agent
tier: 2
order: 12
status: draft
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
steps: []
created: 2026-11-05
updated: 2026-11-05
---

# 讓人類掌握控制權

## Lesson

批准不是模型自己決定的禮貌詢問，而是 harness 對寫入型 action 的硬性關卡。這個節點實作 proposal → wait → 重讀 → 版本重驗的流程，並處理拒絕、stale 與過期。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
