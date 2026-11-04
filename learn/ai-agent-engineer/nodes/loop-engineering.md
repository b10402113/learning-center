---
id: loop-engineering
title: "Loop engineering"
subject: ai-agent-engineer
tier: 1
order: 6
status: draft
goal: "用 trigger、goal check、停止機制把多個 session 串成一個不會提早停的 loop。"
digests:
  - agentic-coding-handbook.1.part.md
prerequisites: []
steps: []
created: 2026-11-03
updated: 2026-11-03
---

# Loop engineering

## Lesson

沒有 loop 時，你就是 loop：寫 prompt、讀結果、再打下一個 prompt。Loop 把 trigger、目標檢查與停止機制接起來，讓工作不必由你啟動。停止訊號必須是 agent 無法偽造的，否則它會在測試仍紅時回報成功。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
