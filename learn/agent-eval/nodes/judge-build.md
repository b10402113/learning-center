---
id: judge-build
title: "Build a judge: rubric → binary Pass/Fail prompt"
subject: agent-eval
tier: 2
order: 2
status: draft
goal: "Write a single-criterion binary Pass/Fail judge (clear definitions, few-shot examples, structured JSON) for one failure mode, and name the three biases it must survive."
prerequisites: []
steps: []
created: 2026-10-29
updated: 2026-10-29
---

# Build a judge: rubric → binary Pass/Fail prompt

## Lesson

This opens the judge spine: turning a rubric into a working LLM-as-judge for exactly one narrow criterion, with a binary Pass/Fail decision and structured output. You build the four-part prompt template and learn the three systematic biases (position, verbosity, self-enhancement) the judge will have to be defended against later.

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
