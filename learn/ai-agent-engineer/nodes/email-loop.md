---
id: email-loop
title: "The email loop"
subject: ai-agent-engineer
tier: 7
order: 22
status: draft
goal: "用 routine、bug-triage、測試與人工 review 建一個從客訴信到 PR、永不 merge 的 loop。"
digests:
  - agentic-coding-handbook.7.part.md
  - agentic-coding-handbook.8.part.md
  - course-kit.md
prerequisites: []
steps: []
created: 2026-11-03
updated: 2026-11-03
---

# The email loop

## Lesson

Email loop 把一封客訴信變成一個可 review 的 PR：先寫失敗測試、再最小修復、跑全套、開 PR、通知。Routine 每小時觸發，用 Gmail label 認領與記憶，三種結局都要回報。Agent 永遠不 merge，最後一道閘門永遠是人。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
