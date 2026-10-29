---
id: agentic-eval
title: "Agentic eval: trace attribution, complex inputs, adversarial"
subject: agent-eval
tier: 4
order: 13
status: draft
goal: "Read a state-transition heatmap to locate cascades, separate input-processing from reasoning errors, and probe prompt injection."
prerequisites: []
steps: []
created: 2026-10-29
updated: 2026-10-29
---

# Agentic eval: trace attribution, complex inputs, adversarial

## Lesson

This node scales agentic evaluation past manual trace reading: discrete states, first-failing-state attribution, and a transition failure heatmap to locate where errors cascade. It then separates input-processing errors (images, long documents, PDFs) from LLM reasoning errors, and closes with adversarial probing for prompt injection and privilege escalation.

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
