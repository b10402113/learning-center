---
id: the-agent-loop
title: "Agent 迴圈：它怎麼讀你的程式庫"
subject: js-mastery-engineer
tier: 2
order: 3
status: draft
goal: "能用 read → decide → act → observe 解釋 agent 行為，並說明它靠 grep/glob/read 現查、沒有索引。"
digests:
  - 010 - The Agent Loop.en.md
  - 011 - How Agents Read Your Codebase.en.md
  - 014 - The Agent Loop.md
  - 015 - What the Agent Sees.md
  - 016 - How Agents Read Your Codebase.md
prerequisites:
  - learn/js-mastery-engineer/nodes/why-ai-coding-falls-apart.md
steps: []
created: 2026-11-07
updated: 2026-11-07
---

# Agent 迴圈：它怎麼讀你的程式庫

## Lesson

所有 coding agent 都跑同一個 read → decide → act → observe 迴圈，而它對你的程式庫沒有索引，只能靠 grep、glob、read 當場找。理解這件事，才知道為什麼命名、結構與「你有沒有把檔案放到它眼前」會直接決定成敗。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
