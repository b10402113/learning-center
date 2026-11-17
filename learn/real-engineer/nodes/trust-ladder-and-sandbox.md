---
id: trust-ladder-and-sandbox
title: "trust ladder、沙箱與第一個 implementer"
subject: real-engineer
tier: 6
order: 13
status: draft
goal: "能說明五個合併步驟哪些可 AFK、把 agent 丟進遠端沙箱，並用一個 label 跑出第一個 PR。"
digests:
  - 073 Our Factory's Goal.en.md
  - 074 Sandboxing The Factory.en.md
  - 075 Setting Up Secrets And Permissions.en.md
  - 076 Running Your Own Coding Agent.en.md
  - 077 Your First Implementer.en.md
  - 078 Your First Implementer Solution.en.md
  - 079 Splitting Build From Review.en.md
  - 080 Splitting Build From Review Solution.en.md
prerequisites:
  - learn/real-engineer/nodes/automated-review-and-retro.md
  - learn/real-engineer/nodes/automated-checks.md
steps: []
created: 2026-11-16
updated: 2026-11-16
---

# trust ladder、沙箱與第一個 implementer

## Lesson

油門只有在煞車踩得住時才安全：trust ladder 說你能同時跑幾個 agent，取決於你多信任它，而合併的五個步驟裡 implement 與 review 幾乎已經可以 AFK。本機撐不住平行執行，所以把 agent 搬進遠端沙箱，用一個 label 觸發第一個 implementer，看它自己撞上你設好的自動檢查。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
