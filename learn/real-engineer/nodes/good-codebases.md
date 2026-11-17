---
id: good-codebases
title: "好 codebase 的語言"
subject: real-engineer
tier: 4
order: 9
status: draft
goal: "能用 leverage、locality 與 deep／shallow module 診斷 codebase，找出該加深的模組。"
digests:
  - 046 Rescuing A Legacy Codebase.en.md
  - 047 A Language For Good Codebases.en.md
  - 048 Searching For Shallow Modules.en.md
  - 049 Searching For Shallow Modules Solution.en.md
  - cohort-005-project.1.part.md
  - cohort-005-project.2.part.md
  - cohort-005-project.3.part.md
  - cohort-005-project.4.part.md
prerequisites:
  - learn/real-engineer/nodes/brakes-and-accelerators.md
steps: []
created: 2026-11-16
updated: 2026-11-16
---

# 好 codebase 的語言

## Lesson

codebase 就是 agent 的環境，所以「好不好改」直接決定 agent 表現。這個 node 建立一套診斷語言：deep module 用小小的介面換來大量 leverage 與 locality，shallow module 則相反——看起來只是一個檔案一個 route，裡面什麼責任都混在一起。學會用這組詞，才有辦法把「這段程式很難改」講成一句 agent 聽得懂的話。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
