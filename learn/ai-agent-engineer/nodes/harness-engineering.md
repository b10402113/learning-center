---
id: harness-engineering
title: "Harness engineering"
subject: ai-agent-engineer
tier: 1
order: 4
status: draft
goal: "用 tools、permissions、verification、routing 補上模型外的機器，讓一次 run 可靠。"
digests:
  - agentic-coding-handbook.1.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/the-map.md"
  - "learn/ai-agent-engineer/nodes/model-prompt-context.md"
steps: []
created: 2026-11-03
updated: 2026-11-03
---

# Harness engineering

## Lesson

模型只會回文字或 tool call，真正執行的是模型外的 harness。預設 harness 不認識你的專案，所以會猜 API、漏掉風險操作、讓 agent 自認完成。Harness engineering 的原則是：agent 每犯一次錯，就替它加一條規則或檢查。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
