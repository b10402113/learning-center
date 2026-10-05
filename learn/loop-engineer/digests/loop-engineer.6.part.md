---
source: loop-engineer
source_type: text
source_lines: 33675
part: 6
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — loop-engineer (part 6)

## Overview (L1)

- When One Agent Is Enough — One well-bounded agent beats premature multi-agent splits when scope is bounded, context is shared, work is sequential, and a clear validator exists. Adds a single-agent decision workflow (goal → context → tools → verification) and the four building blocks of a single-agent system (instructions, context, tools, boundaries/feedback). Splitting is justified only by real ownership, context, or risk separation.
- Sub-Agent, Agent-as-Tool, and Handoff Patterns — The three collaboration patterns and when each applies: sub-agent (delegation the coordinator still owns), agent-as-tool (reusable capability with a stable input/output contract), and handoff (transferring ownership). Reliability comes from contracts and verified evidence, not prompts; avoid over-orchestration.
- Orchestrator–Worker Architecture — An orchestrator owns the goal and task graph while specialized workers research, implement, and verify; review feeds back to assignment so weak evidence triggers retry, narrowing, or escalation. Coordination is only useful when it reduces uncertainty, and must sit inside permissions, approval gates, context limits, and audit traces.
- Parallel Work and Result Aggregation — Independent shards run concurrently but must be collected, normalized, validated, conflict-resolved, and synthesized into one coherent answer. Parallelism saves time only when disciplined aggregation preserves quality; governance (tool limits, cost budgets, human approval) keeps it accountable.
- Specialist Routing and Delegation — A router parses intent, inspects context/risk, selects the best specialist, hands off a precise task with permissions and required evidence, then validates the result before merging. Delegation is justified by specialized tools, high risk, large context splits, or independent verification — not by default.
- Create Clear Handoff Contracts — A handoff contract converts implicit memory into explicit instructions: goal, inputs, constraints, tools, acceptance tests, and return format. Poor handoffs fail predictably through vague requests, hidden assumptions, and unclear completion; merges should be gated on validated contract conditions.
- Prevent Delegation Loops and Conflicting Work — Delegation loops are a state-management failure, not a prompt failure. Controls include a single current owner per task, ownership leases, a delegation ledger, depth/budget limits, no-self-delegation, conflict detection, and explicit escalation; policy, ownership, and validation belong in the environment (CLAUDE.md, codebasemap, settings, MCP/LSP/CI).
- Repair a Failed Agent Handoff (role-play) — A role-play lab page for practicing diagnosis and repair of a broken agent handoff; the source HTML contains only the title and an empty content container, so no prompts or answer key are specified.
- Route Tasks to Specialist Workers — A Python coding exercise: implement `orchestrate_tasks()` so an orchestrator validates a list of structured tasks, routes each to a worker from `WORKER_REGISTRY`, aggregates success/failure per task, continues past invalid/unknown tasks, and sets overall `ok` true only when all succeed.
- Multi-Agent Patterns — A 10-question assessment covering when a single agent suffices, agent-as-tool, handoff contract fields, conflicting parallel edits, aggregation responsibilities, coordination cost, delegation-loop safeguards, valid split reasons, handoff ownership transfer, and reconciling contradictory worker outputs.

## Sections (L2)

### when-one-agent-is-enough

- Locator: `[[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/35. When One Agent Is Enough.en.srt#when-one-agent-is-enough]]`
- Summary: Argues the default should be one capable, well-bounded agent loop (plan → act → observe → stop) rather than multiple agents, because a single loop keeps reasoning and action in one place for easier debugging. Gives a decision workflow and the structural building blocks around the loop, then enumerates when splitting genuinely pays off.
- Key claims: A single agent is safer when the task is bounded, sequential, and verifiable; ask whether work needs separate owners, separate context, or separate approvals before splitting; single-agent structure = instructions (CLAUDE.md, codebasemap.md), context, tools (MCP/LSP), boundaries (settings, approval rules), and feedback (tests, linters, logs); splitting is justified by parallel specialties, separate risk zones, conflicting goals, or independent approvals; never add agents because the diagram looks advanced.
- Learner-relevant: Establishes the baseline "one agent first" principle that every later multi-agent pattern must justify itself against; supports a decision checklist for architecture choice.

### sub-agent-agent-as-tool-and-handoff-patterns

- Locator: `[[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/36. Sub-Agent, Agent-as-Tool, and Handoff Patterns.en.srt#sub-agent-agent-as-tool-and-handoff-patterns]]`
- Summary: Defines three collaboration patterns — sub-agent (delegation with the main agent retaining ownership), agent-as-tool (packaged agent invoked like an internal API with a defined input/output contract), and handoff (transfer of context, state, and responsibility to a new owner). Explains routing logic and why contracts, not prompts, make delegation scale.
- Key claims: Coordinator first understands intent/context, then routes; routing completes only when scope, contract, state transfer, and evidence can be verified; a contract defines allowed actions, information, tools, memory access, and required evidence; loose delegation fails while contracted delegation scales; start with the smallest pattern that preserves control, context, and accountability; do not create a handoff when a tool call suffices.
- Learner-relevant: Gives the vocabulary (sub-agent vs agent-as-tool vs handoff) used by all later sections and a rule for picking the lightest sufficient pattern.

### orchestrator-worker-architecture

- Locator: `[[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/37. Orchestrator–Worker Architecture.en.srt#orchestrator-worker-architecture]]`
- Summary: Describes the orchestrator–worker pattern for work too broad, uncertain, or risky for one chain: the orchestrator plans, assigns, reviews evidence, and synthesizes, while narrow specialists research, implement, and verify. Includes a runtime loop and the feedback path where weak evidence triggers repair, plus the enterprise controls that must wrap orchestration.
- Key claims: Value comes from controlled coordination, not agent count; break work into narrow tasks and give each worker only needed context to reduce pollution; results are not trusted until the review step checks evidence/test output; the review→assignment loop is where repair happens (retry narrower, switch worker, request context, escalate); shared files (CLAUDE.md, codebasemap.md, settings JSON) give stable rules; start small with one orchestrator, one implementation worker, one independent verifier.
- Learner-relevant: The canonical multi-agent control structure and its feedback loop; the "who owns the goal / who acts / what evidence / where it stops" explainability test.

### parallel-work-and-result-aggregation

- Locator: `[[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/38. Parallel Work and Result Aggregation.en.srt#parallel-work-and-result-aggregation]]`
- Summary: Covers running independent shards concurrently and the mandatory aggregation step that reconciles, de-duplicates, cross-verifies, and synthesizes results into a single answer. Details the pipeline (shard → dispatch → collect → normalize → conflict-resolve → synthesize) and its quality/governance controls.
- Key claims: Parallelism creates multiple partial results that must be merged or they become noise and contradictions; workers need isolated context/tools/limits to avoid contaminating each other or exceeding budget; results must be normalized to a shared format (answer, evidence, status, confidence, errors) before comparison; schema validation, evidence checks, conflict resolution, and confidence scoring gate readiness; LSP signals help coding workflows judge file validity and type errors.
- Learner-relevant: Explains why fan-out without a disciplined fan-in reduces quality; supports designing result contracts and aggregation quality gates.

### specialist-routing-and-delegation

- Locator: `[[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/39. Specialist Routing and Delegation.en.srt#specialist-routing-and-delegation]]`
- Summary: Presents the router as a decision layer matching a task to the right specialist capability, then validating returned evidence before acceptance. Describes the delegation contract, the routing workflow, and the conditions that justify delegating.
- Key claims: Routing is about matching task to capability with clear boundaries and evidence, not just splitting work; workflow = parse intent → inspect context/tools/risk → choose specialist → hand off precise task + context + permissions + required evidence → validate before merging; delegation contract = router policy, specialist registry, context package, tool permissions, return schema, escalation rules; without the contract nobody owns the boundary between delegation and acceptance; delegate for specialized tools, high risk, large context splits, or independent verification, not for simple low-risk work.
- Learner-relevant: Central routing pattern; supports building a specialist registry and deciding when delegation adds expertise, isolation, evidence, or safety.

### create-clear-handoff-contracts

- Locator: `[[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/40. Create Clear Handoff Contracts.en.srt#create-clear-handoff-contracts]]`
- Summary: Defines the handoff contract as the explicit agreement between the agent finishing work and the agent continuing it, and gives the fields, workflow, failure modes, and enterprise wiring for reliable handoffs.
- Key claims: Contracts turn implicit memory into explicit instructions and define "done" before the next agent starts; fields = goal, inputs, constraints, tools, acceptance tests, return format; workflow = define outcome → package context → declare authority → set validation rules → require returned evidence; a trace timeline (decision logs, tool calls, changed files, validation results) makes handoffs auditable; failure modes are vague requests, hidden assumptions, and unclear completion; merge only when contract validation conditions are satisfied.
- Learner-relevant: Actionable contract template that pairs with the routing/ownership patterns; enables safe scaling and easier debugging of delegations.

### prevent-delegation-loops-and-conflicting-work

- Locator: `[[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/41. Prevent Delegation Loops and Conflicting Work.en.srt#prevent-delegation-loops-and-conflicting-work]]`
- Summary: Frames delegation loops and conflicting edits as state-management failures where each agent looks reasonable but the system moves without progress. Presents bounds (ownership, leases, ledger, depth/budget limits, no-self-delegation, conflict detection, escalation) and where to encode them.
- Key claims: Every task needs a single current owner, a clear direction of travel, and a source of truth for what was assigned; a task receives an ownership lease reserving a scope so others cannot modify it in parallel; a delegation ledger records task id, parent, current owner, depth, and status; maximum depth and no-self-delegation prevent endless recursion; conflict detector watches overlapping edits and incompatible intent; escalation is a designed stop condition, not an automation failure; policy lives in CLAUDE.md, codebasemap.md, settings JSON, plus MCP/LSP/tests/linters/CI gates.
- Learner-relevant: Supplies the concrete guardrails and an operational checklist (task id, one owner, visible depth/budget, reserved files, usable return packet) to make multi-agent collaboration safe.

### repair-a-failed-agent-handoff

- Locator: `[[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/2. Repair a Failed Agent Handoff.html#repair-a-failed-agent-handoff]]`
- Summary: A role-play lab page titled "Repair a Failed Agent Handoff (role-play)". The HTML contains only styling and an empty `.content` container, so the exercise prompt and scenario are not present in the source file.
- Key claims: This is a role-play exercise on repairing a failed handoff; no prompt, scenario detail, or answer key is embedded in the source.
- Learner-relevant: Marks a hands-on role-play activity slot in this chapter, to be supplied during teaching rather than extracted from the file.

### route-tasks-to-specialist-workers

- Locator: `[[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/4. Route Tasks to Specialist Workers.html#route-tasks-to-specialist-workers]]`
- Summary: A Python coding exercise where learners implement `orchestrate_tasks()`: an orchestrator receives a list of structured tasks, validates them, routes each to a worker from a fixed `WORKER_REGISTRY` (research/code/review), and aggregates per-task success/failure.
- Key claims: Must confirm `tasks` is a list (else `{"ok": False, "error": "Tasks must be a list"}`); each task needs non-empty `id`, `type`, `instruction`; validate before selecting a worker; unknown `type` returns `"Unknown specialist"`; invalid fields return `"Invalid task"`; process tasks in original order and continue after failures; overall `ok` is true only if all tasks succeed; tests cover single routing, ordering, unknown specialist, continuation, missing fields, and non-list input.
- Learner-relevant: A concrete implementation anchor for the routing/aggregation ideas — the solution separates validation, dispatch via registry, and result aggregation.

### multi-agent-patterns

- Locator: `[[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/6. Multi-Agent Patterns.html#multi-agent-patterns]]`
- Summary: A 10-question multiple-choice assessment (with per-option feedback) checking the chapter's core design judgments, from choosing a single agent to reconciling conflicting worker outputs.
- Key claims: One narrow goal + one tool sequence → a single well-controlled agent first; agent-as-tool retains coordinator control over a bounded specialist result; handoff contracts include inputs/context, completion and escalation rules, expected output schema, and objective/scope (not implicit ownership or unrelated history); conflicting concurrent edits are prevented by isolated worktrees or explicit file ownership; aggregation responsibilities = reconcile conflicts, validate outputs, map to the original goal; adding agents reduces reliability because every handoff adds coordination, context, and failure boundaries; delegation loops need delegation-depth and repeated-handoff detection; valid split reasons are context isolation, parallel independent subtasks, and different tools/expertise; after acceptance the receiving agent owns next decisions within the contract; contradictory sourced conclusions require evidence-aware reconciliation or escalation.
- Learner-relevant: A ready-made check bank for `/tackle`-style verification of this chapter's strands; each option's feedback states the design rationale.
