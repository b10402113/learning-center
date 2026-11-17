---
id: orchestrator-loops
title: "orchestrator 的 loop：改善、ratchet、rebase、慢查詢"
subject: real-engineer
tier: 7
order: 16
status: draft
goal: "能設計自己排程的 loop，用門檻與 label 控制節奏，讓失敗走回人手上。"
digests:
  - 091 Improve Codebase Architecture.en.md
  - 092 Improve Codebase Architecture Solution.en.md
  - 093 The Ratchet.en.md
  - 094 The Ratchet Solution.en.md
  - 095 The Morning Rebase.en.md
  - 096 The Morning Rebase Solution.en.md
  - 097 The Slow-Query Monitor.en.md
  - 098 The Slow-Query Monitor Solution.en.md
prerequisites:
  - learn/real-engineer/nodes/seams-and-adapters.md
  - learn/real-engineer/nodes/lint-mutation-and-data-sources.md
  - learn/real-engineer/nodes/choosing-infrastructure.md
steps: []
created: 2026-11-16
updated: 2026-11-16
---

# orchestrator 的 loop：改善、ratchet、rebase、慢查詢

## Lesson

orchestrator 的真正價值是能自己排程：每天起一次 loop、依事件再 spawn 一台 runner，讓工廠從「你按一下它跑一次」變成「它自己找事做」。四個 loop 示範同一組設計肌肉——先做確定性的部分再叫 agent、用 label 與張數門檻避免重複開票、把 push 改成 pull 以奪回節奏，以及沒人接手時把失敗退回人手上。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
