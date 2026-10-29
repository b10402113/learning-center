---
id: judge-validate
title: "Validate the judge: TPR, TNR, why precision/recall mislead"
subject: agent-eval
tier: 2
order: 3
status: draft
goal: "Measure a judge's TPR/TNR on a labeled dev/test split and explain why those beat precision/recall for estimating a true pass rate."
prerequisites: []
steps: []
created: 2026-10-29
updated: 2026-10-29
---

# Validate the judge: TPR, TNR, why precision/recall mislead

## Lesson

A judge is only useful once you know how often it is right, and here you treat it like a classifier trained by prompt engineering: disjoint train/dev/test splits, balanced Pass/Fail examples, and a refinement loop that measures TPR and TNR. The key move is seeing why TPR/TNR — not precision/recall — are the two numbers that map directly onto over- and under-estimating the true pass rate.

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
