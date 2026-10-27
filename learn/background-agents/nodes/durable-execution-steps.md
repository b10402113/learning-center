---
id: durable-execution-steps
title: "Durable execution：把 loop 拆成 step"
subject: background-agents
tier: 2
order: 3
status: draft
goal: "解釋為什麼要把 loop 拆成 step、replay 的真相（memoize 而非重播 stack），以及 deterministic workflow + idempotent step 兩條規則。"
prerequisites: []
steps: []
created: 2026-10-27
updated: 2026-10-27
---

# Durable execution：把 loop 拆成 step

## Lesson

單一 step 內的失敗會讓整段重做，所以要把 loop 拆成 checkpoint。replay 不是重播 JS stack，而是重讀 memoized 的 step 結果；這要求 workflow deterministic、step idempotent。這兩條規則決定後面所有寫法。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
