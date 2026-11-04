---
id: setup-three-processes
title: "設定：三個程序與故障注入"
subject: background-agent
tier: 2
order: 6
status: draft
goal: "能從乾淨 repo 啟動 checkout、operator、agent 三個程序，並用 fault flags 造出可觀察的事件。"
digests:
  - 2-course-project-setup.md
  - README.md
  - notes-simulator.md
  - notes-lesson-authoring.md
  - scripts.md
  - lessons-index.md
prerequisites:
  - learn/background-agent/nodes/world-is-observed-state.md
steps: []
created: 2026-11-05
updated: 2026-11-05
---

# 設定：三個程序與故障注入

## Lesson

在改任何一行 agent 程式前，先把世界、操作台與代理跑起來，並學會製造可重現的故障。這個節點涵蓋 Neon、三個終端、分支與 fault flags，讓後面每個機制都有可觀察的實驗場景。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
