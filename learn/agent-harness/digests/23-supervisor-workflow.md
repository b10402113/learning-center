---
source: 23-supervisor-workflow
source_type: pdf
source_lines: 269
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 23-supervisor-workflow

## Overview (L1)

- The supervisor's job — The supervisor decides whether investigators are needed and produces the plan, making it the most involved file in this segment. It imports DBOS plus `generateObject` and wires events, the model, and the workflow.
- Structured outputs — `generateObject` returns a schema-backed JSON object guaranteed to follow the provided schema, unlike free-form `generateText`. This unlocks use cases like on-the-fly generated UI, and newer models are fine-tuned for JSON at the model level rather than requiring the old loop-parse-retry approach.
- Plan schema and `makePlan` — The plan is a first-class artifact with a schema of `{ id, agent, objective }`, from which a TypeScript type is inferred via `z.infer`. `makePlan(task)` calls `generateObject` with that schema and returns the object. A deprecation notice recommends `generateText` with an output setting instead.
- `synthesize` — Summarizes all investigator findings into one place for the supervisor to evaluate, using `generateText` with a "support lead" system prompt that writes one clear reply and acknowledges missing investigations.
- Supervisor workflow scaffold — A second DBOS workflow (alongside the runtime agent loop) establishes a workflow ID, emits a start event, creates the plan inside a `DBOS.runStep` callback, and emits a plan-created checkpoint event.

## Sections (L2)

### supervisor-role

- Locator: `[[sources/agent-harness/20260915/23-supervisor-workflow.txt#supervisor-role]]`
- Summary: Opens the supervisor file, framing its responsibilities as deciding whether investigators are needed and producing the plan.
- Key claims: The supervisor must determine if investigators are required and what the plan is; this file is notably code-heavy and is walked through step by step.
- Learner-relevant: Sets the mental model that the supervisor is the planner/orchestrator, not an investigator.

### structured-outputs

- Locator: `[[sources/agent-harness/20260915/23-supervisor-workflow.txt#structured-outputs]]`
- Summary: Contrasts `generateObject` (schema-backed structured output) with `generateText`, and explains how structured outputs became model-level.
- Key claims: `generateObject` returns JSON guaranteed to follow a supplied schema, versus `generateText` which just returns text; structured outputs are powerful because they are schema-backed, enabling things like mapping a UI component schema to generated React components; newer models are fine-tuned on JSON output so schema adherence happens at the model level, unlike the old loop-parse-retry approach where markdown JSON blocks were parsed against the schema and retried until valid.
- Learner-relevant: The conceptual basis for making plans machine-checkable artifacts rather than prose — and a concrete example (generated UI) of why schema-backed output matters.

### plan-schema-and-make-plan

- Locator: `[[sources/agent-harness/20260915/23-supervisor-workflow.txt#plan-schema-and-make-plan]]`
- Summary: Defines the plan schema (`id`, `agent`, `objective`) and implements `makePlan` using `generateObject`.
- Key claims: The plan is a first-class artifact, so it needs its own schema to validate correctness; the schema shape is `{ id, agent, objective }`; `z.infer` derives a TypeScript type from the zod schema; `makePlan(task)` awaits `generateObject` with the model, schema, system prompt, and the task as the prompt, then returns the object.
- Learner-relevant: Shows how to declare and infer the structured plan type — the data contract every dispatch step in the next file iterates over.

### generate-object-deprecation

- Locator: `[[sources/agent-harness/20260915/23-supervisor-workflow.txt#generate-object-deprecation]]`
- Summary: Notes an AI SDK deprecation warning encountered while writing `generateObject`.
- Key claims: `generateObject` is flagged as deprecated, with the guidance to use `generateText` with an output setting instead (and `streamObject`/prompt variants for streaming); the instructor calls `generateObject` confusing, thinks the replacement is better, but keeps the current code and recommends readers consider the newer API.
- Learner-relevant: A current-API awareness note — useful when the learner later refactors or writes new structured-output code.

### synthesize-findings

- Locator: `[[sources/agent-harness/20260915/23-supervisor-workflow.txt#synthesize-findings]]`
- Summary: Implements `synthesize(task, findings)`, which summarizes all investigator findings into one reply for the supervisor to evaluate.
- Key claims: Synthesis uses `generateText` because the goal is summarizing, not structured output; the system prompt casts the model as a support lead who writes one clear, friendly reply addressing every point and briefly acknowledges any missing investigation with a follow-up promise; the prompt supplies the escalation task and the investigators' findings so far.
- Learner-relevant: The fan-in counterpart to investigator fan-out — how findings get collapsed into a single customer-facing reply.

### supervisor-workflow-scaffold

- Locator: `[[sources/agent-harness/20260915/23-supervisor-workflow.txt#supervisor-workflow-scaffold]]`
- Summary: Starts the second DBOS workflow: workflow ID, start event, the plan step, and a plan-created emit that acts as a checkpoint.
- Key claims: A second DBOS workflow `supervisorWorkflow(task)` is created alongside the runtime agent-loop workflow; it establishes `workflowId` via `DBOS.workflowID`; events are always emitted inside steps because emit touches the database and subscribers (the GUI) listen; `makePlan` must be wrapped in `DBOS.runStep` so the plan is created once and immortalized rather than recomputed on every workflow re-evaluation; each emit acts as a checkpoint for reconstructing where execution was.
- Learner-relevant: Demonstrates the durable-execution rule of thumb — wrap non-deterministic, costly work in a step — applied to plan creation, with events serving as resumable checkpoints.

## Sources

- [[sources/agent-harness/20260915/23-supervisor-workflow.txt]]
