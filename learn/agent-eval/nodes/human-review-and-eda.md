---
id: human-review-and-eda
title: "Human review & trace data analysis"
subject: agent-eval
tier: 5
order: 14
status: draft
goal: "Build a low-friction review UI with smart sampling, and use EDA (clustering, outliers, cross-tabs) to generate hypotheses."
prerequisites: []
steps: []
created: 2026-10-29
updated: 2026-10-29
---

# Human review & trace data analysis

## Lesson

Automated evaluators handle most monitoring, but humans still need to read sampled traces to catch blind spots, so this node builds a review interface that turns a five-minute trace review into thirty seconds and selects which traces to show. It then adds exploratory data analysis — clustering, cross-tabs, outlier hunts — as a hypothesis-generation tool, always treating charts as prompts to go read the underlying traces, not conclusions.

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
