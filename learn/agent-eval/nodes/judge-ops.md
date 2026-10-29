---
id: judge-ops
title: "Judge at scale: bias, stochasticity, group-wise metrics"
subject: agent-eval
tier: 2
order: 5
status: draft
goal: "Harden a judge against position/verbosity/self-enhancement bias and run it 3–5× for stability; add Success@k / Precision@k / Recall@k for multi-output cases."
prerequisites: []
steps: []
created: 2026-10-29
updated: 2026-10-29
---

# Judge at scale: bias, stochasticity, group-wise metrics

## Lesson

This closes the judge thread by making it dependable in production: mitigating the three known biases, checking label stability across repeated runs at temperature > 0, and moving beyond a single output to group-wise metrics like Success@k and Precision@k. It is where a validated judge turns into an operational one you can trust on every trace.

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
