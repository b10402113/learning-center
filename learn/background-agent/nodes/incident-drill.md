---
id: incident-drill
title: "事件演練：四個 trial"
subject: background-agent
tier: 3
order: 15
status: draft
goal: "能跑完 feature、release、retry、dependency 四場演練，並用 world outcome、action trajectory、human boundary 判定成敗。"
digests:
  - lessons-06-incident-drill.md
  - lessons-advanced-lab.md
  - notes-course-plan.md
  - notes-simulator.md
prerequisites:
  - learn/background-agent/nodes/wait-for-the-world.md
  - learn/background-agent/nodes/the-waiting-loop.md
  - learn/background-agent/nodes/put-a-human-in-control.md
  - learn/background-agent/nodes/make-retries-safe.md
  - learn/background-agent/nodes/ask-for-help-and-hand-off.md
steps: []
created: 2026-11-05
updated: 2026-11-05
---

# 事件演練：四個 trial

## Lesson

四個故障情境各配一個全新的 checkout，讓同一套 harness 在不同世界狀態下被檢驗。這個節點要求學員看世界結果、行動軌跡與人類邊界，而不是只看代理最後說了什麼。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
