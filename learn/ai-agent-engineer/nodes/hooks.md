---
id: hooks
title: "Hooks"
subject: ai-agent-engineer
tier: 2
order: 11
status: draft
goal: "用五個 hook 把危險指令、secret、紅燈測試與 session context 變成每次都會執行的 gate。"
digests:
  - agentic-coding-handbook.3.part.md
  - course-kit.md
  - ticket-bay.4.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/harness-engineering.md"
steps: []
created: 2026-11-03
updated: 2026-11-03
---

# Hooks

## Lesson

寫在 AGENTS.md 的規則只是文字，模型沒有義務遵守；hook 是在固定時點自動執行的腳本。阻擋型 hook 不讓 agent 崩潰，而是回傳原因，讓它改走別條路。五個必備 hook 分別管危險指令、secret、測試 gate、編輯後回饋與 session 開場。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
