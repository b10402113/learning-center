---
id: chaining-the-factory
title: "把 build 與 review 拆開，串起整條工廠"
subject: real-engineer
tier: 6
order: 14
status: draft
goal: "能用 review label 接第二段流程、對遠端 run 做 retro，串成 explore → implement → review。"
digests:
  - 081 Retro A Run.en.md
  - 082 Retro A Run Solution.en.md
  - 083 Explore Before You Commit.en.md
  - 084 Explore Before You Commit Solution.en.md
  - 085 Chaining The Whole Factory.en.md
  - 086 Chaining The Whole Factory Solution.en.md
prerequisites:
  - learn/real-engineer/nodes/trust-ladder-and-sandbox.md
steps: []
created: 2026-11-16
updated: 2026-11-16
---

# 把 build 與 review 拆開，串起整條工廠

## Lesson

一個 implementer 只是一段流程，工廠是流程串起來之後才出現的：draft PR 貼上 review label 接上第二段，外部回饋先經過 explore 驗證再決定要不要實作，而每一段 run 都能拿來做 retro。等 explore 能自己判斷 easy call、implement 自動請求 review，整條鏈就從「填一張表」開始跑。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
