---
id: data-model
title: "Data Model：先寫 spec，再跑 migration"
subject: agentic-engineer
tier: 5
order: 23
status: draft
goal: "能先把九張表寫成 spec 才動 migration，並用 verify 與 review 抓到只存在於應用層的約束缺口。"
digests:
  - ch13-idea-to-first-ship.2.part.md
  - code-reel-agentic-docs.md
  - code-reel-agentic-src.md
  - code-reel-agentic-skills.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# Data Model：先寫 spec，再跑 migration

## Lesson

整個目標 schema 在第一次 migration 之前就寫成一份 spec：九張表、五個 enum，連現在用不到的表都先標成後續 feature。`/check verify` 對照 11 條 AC 證明它真的活了過來，`/check review` 換一個模型看到一條只在應用層維護的不變式——然後修法是新開一支 migration，不是改已經跑過的那支。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
