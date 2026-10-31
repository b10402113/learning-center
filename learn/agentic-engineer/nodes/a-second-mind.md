---
id: a-second-mind
title: "A Second Mind：review 與 document"
subject: agentic-engineer
tier: 4
order: 18
status: draft
goal: "能用不同模型做出 rank findings 的 review，並只從真實 diff 寫出 PR 描述。"
digests:
  - ch10-ship-like-a-team.md
  - code-jsm-skills-system.md
  - code-reel-agentic-docs.md
  - code-reel-agentic-skills.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# A Second Mind：review 與 document

## Lesson

前面所有階段的盲點是同一個：同一個模型建、verify、test，然後評自己，於是同一個錯誤可以一路穿過每一關。GA 這一層把它交給一個完全沒參與撰寫的模型，而且問的是「它是怎麼被做出來的」，不是「它能不能跑」。接著 `/document` 只從磁碟上既有的 diff、spec、review、test 寫出會跟著改動一起走的紀錄。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
