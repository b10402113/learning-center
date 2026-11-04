---
id: first-runnable-loop
title: "第一個可跑的迴圈"
subject: background-agent
tier: 2
order: 7
status: draft
goal: "能實作 observe → 目標檢查 → chooseAction → 執行，並用決策上限收尾。"
digests:
  - 4-setting-up-the-workflow.md
  - 5-choosing-the-next-action.md
  - 6-custom-tool-loop.md
  - 7-loop-walkthrough.md
  - 8-running-the-background-agents.md
  - lessons-01-goal-and-harness.md
  - server.md
prerequisites:
  - learn/background-agent/nodes/give-the-agent-a-goal.md
  - learn/background-agent/nodes/the-authority-question.md
  - learn/background-agent/nodes/setup-three-processes.md
steps: []
created: 2026-11-05
updated: 2026-11-05
---

# 第一個可跑的迴圈

## Lesson

最小可用的代理就是一個有上限的迴圈：讀狀態、檢查目標、問模型下一步、執行或停下。這個節點把 Inngest function、確定性的完成判定、結構化決策與 action 執行接成一條線，並用儀表板確認它真的在跑。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
