---
source: 25-human-in-the-loop
source_type: pdf
source_lines: 94
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 25-human-in-the-loop

## Overview (L1)

- Deterministic approvals — Human-in-the-loop approvals should live at the harness level, like the handoff, not be begged out of the LLM. You detect a tool call needing approval via config (e.g. a tool's `needsApproval`) or a harness-side map of tool → approval requirement.
- DBOS pause/resume — `DBOS.receive` pauses execution indefinitely (compute stops until a variable changes), and `DBOS.send` resumes the workflow by sending it a payload/tag; this is the mechanism for an approval gate.
- Suggested exercise — A recommended extension is to require approval of the plan before execution, with UI back-and-forth to adjust the plan and an approve button, which touches everything taught in this segment.

## Sections (L2)

### deterministic-approvals

- Locator: `[[sources/agent-harness/20260915/25-human-in-the-loop.txt#deterministic-approvals]]`
- Summary: Explains human-in-the-loop approvals as deterministic harness-level behavior rather than LLM discretion.
- Key claims: Approvals should work like the deterministic handoff — the harness detects a tool call and acts, instead of prompting the LLM to comply; you can track which tool calls need approval with a map, or use SDK-level tool configs such as a tool's `needsApproval` flag; inside the harness you look up the tool's config by name and pause if approval is required.
- Learner-relevant: The core principle for safely gating risky tool calls: enforce it in code, not in the prompt.

### dbos-pause-resume

- Locator: `[[sources/agent-harness/20260915/25-human-in-the-loop.txt#dbos-pause-resume]]`
- Summary: Describes using DBOS's pause and resume primitives to hold a workflow until a human approves.
- Key claims: `DBOS.receive` pauses execution — the compute stops and will not restart until the awaited variable changes; `DBOS.send` resumes by delivering a payload/tag to the workflow, and the workflow continues based on the value; this pause can last arbitrarily long, up to years.
- Learner-relevant: The durable-execution primitive that makes approval gates possible without keeping compute alive — directly reusable for any long-waiting human checkpoint.

### approval-exercise

- Locator: `[[sources/agent-harness/20260915/25-human-in-the-loop.txt#approval-exercise]]`
- Summary: Proposes an exercise: gate plan execution behind human approval with plan adjustment.
- Key claims: Currently the workflow creates a plan and immediately executes it; a better design approves the plan first, lets the user go back and forth to adjust it, and only executes on explicit approval; there should be an "approve" button in the UI; the instructor calls this an excellent exercise because it touches everything taught in the sub-agent/supervisor work.
- Learner-relevant: A capstone exercise that combines the plan artifact, durable pause/resume, and UI events into one approval workflow.

## Sources

- [[sources/agent-harness/20260915/25-human-in-the-loop.txt]]
