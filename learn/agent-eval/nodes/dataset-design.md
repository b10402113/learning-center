---
id: dataset-design
title: "Design the eval dataset: trace sampling & synthetic dimensions"
subject: agent-eval
tier: 3
order: 6
status: draft
goal: "Build a representative starting set (~100 traces, run to saturation) using production sampling or dimension→tuple synthetic generation."
prerequisites: []
steps: []
created: 2026-10-29
updated: 2026-10-29
---

# Design the eval dataset: trace sampling & synthetic dimensions

## Lesson

A judge is only as good as the data it runs on, so this node builds the dataset underneath everything else: sampling real traces across features and failure signals, or generating synthetic queries through dimensions and tuples instead of naive prompts that collapse into near-duplicates. The guiding idea is representativeness and saturation, not a fixed trace count.

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
