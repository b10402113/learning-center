---
id: test-human-in-the-loop
title: "測試人類介入流程"
subject: background-agent
tier: 3
order: 9
status: draft
goal: "能從 inbox 核准 rollback、讀 audit log，並解釋 durable suspension 與 resume 機制。"
digests:
  - 22-testing-hitl.md
  - lessons-04-human-approval.md
  - web.md
prerequisites:
  - learn/background-agent/nodes/put-a-human-in-control.md
steps: []
created: 2026-11-09
updated: 2026-11-09
---

# 測試人類介入流程

## Lesson

核准流程最難說服人的地方，是代理暫停期間程序可以消失、人類可以隔很久才回答，而 run 仍然必須接得回去。這個節點從 inbox 核准一次 rollback，沿著 audit log 與 Inngest trace 看 resume、版本重驗與 stale 分支，並說明 durable suspension 是 runtime 行為，不是自訂的等待程式。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
