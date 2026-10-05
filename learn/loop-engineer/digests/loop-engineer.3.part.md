---
source: loop-engineer
source_type: text
source_lines: 33675
part: 3
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — loop-engineer (part 3)

## Overview (L1)

- Working State vs. Long-Term Memory — Memory is not one thing: a short-lived working state serves the current run, while a separate long-term memory holds durable facts for future runs. Mixing them creates brittleness, so a validation "memory gate" decides what gets promoted. Sets the central state/memory distinction.
- Preserve Progress Across Iterations — Progress is the useful state created along the way (decisions, changed files, tool results, tests), not just the final answer. Working state should be a structured record (task state, artifacts, observations, decisions) checkpointed before the next action so retries skip duplicate work and resume from a confirmed point.
- Checkpoint, Resume, and Prevent Duplicate Actions — The risky boundary is the moment after an action, where a crash, timeout, or lost context can occur. A checkpoint captures enough run-specific state to resume safely; idempotency keys plus a tool ledger distinguish an attempt from a committed result, preventing repeated side effects.
- Context Budgets and Information Prioritization — A context window is a fixed budget where every token competes. Budget deliberately by relevance, recency, and risk; keep must-have items in full, compress useful context, and retrieve low-value material on demand. Small structured context packs beat giant prompts and prevent drift.
- Summarization, Compaction, and Retrieval — Three complementary techniques keep a long-running loop focused: summarization turns messy streams into accurate short records, compaction decides what stays in working state, and retrieval rehydrates exact detail on demand. Summaries must stay source-backed so the loop never drifts from reality.
- Prevent Context Drift and Lost Requirements — Context drift is the slow loss of the original request across turns. The source of truth is a pinned set of goals, constraints, acceptance criteria, and contracts that travels with every step; each turn must be checked against the same checklist, backed by repository files and tool signals.
- Resume an Agent Without Repeating Work — A hands-on coding exercise: implement `resume_agent()` to validate a checkpoint JSON, detect already-completed actions, skip them while keeping the iteration, and increment the iteration only for a new action. Comes with the reference solution and unit tests.
- State, Memory, and Context — A multiple-choice quiz covering working-state contents, duplicate side effects after resume, idempotency, and related state/memory/context concepts, with per-answer feedback and an overall explanation.
- Lab Recover an Interrupted Agent Run — A 45–60 minute lab building a recoverable order-processing agent with durable `orders.json`, `receipts.json`, and `checkpoint.json`. Exercises atomic writes, SHA-256 input fingerprinting, idempotent receipts, interrupt-after-N simulation, safe resume, and escalation when the input changes.

## Sections (L2)

### working-state-vs-long-term-memory

- Locator: `[[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/14. Working State vs. Long-Term Memory.en.srt#working-state-vs-long-term-memory]]`
- Summary: Distinguishes short-lived working state (active task context: plan, recent tool results, evaluation notes) from long-term memory (stable preferences, project facts, reusable decisions, summaries). Explains why mixing them creates brittle systems and introduces the validation boundary between them.
- Key claims: Use state to finish the current run and memory to improve future runs; working state is fast, local, tied to the objective, and safe to discard; only checked, summarized, approved info should be promoted to memory; memory should be auditable, access-controlled, versioned, and compliant, behind a governed memory service.
- Learner-relevant: Anchors the core mental model for the whole chapter — the state/memory split and the "memory gate" (durable, reusable, safe, approved) that later steps build on.

### preserve-progress-across-iterations

- Locator: `[[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/15. Preserve Progress Across Iterations.en.srt#preserve-progress-across-iterations]]`
- Summary: Argues that progress is the useful state created along the way, and every loop pass should inherit useful context from the previous pass. Recommends treating working state as a structured record of task state, artifacts, observations, and decisions, updated after each meaningful action.
- Key claims: Losing state forces rediscovery, repeated tool calls, and decisions without latest evidence; retries must not blindly rerun commands, re-read files, or overwrite existing nodes; checkpoint before action (record intent), store outcome after result, inspect saved state before retry; durable state is committed only after validation (schema checks, linting, tests, policy, approval).
- Learner-relevant: Gives the capture-update-choose-resume lifecycle and the "advance, verify, resume" rhythm used in checkpoint/resume implementation.

### checkpoint-resume-and-prevent-duplicate-actions

- Locator: `[[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/16. Checkpoint, Resume, and Prevent Duplicate Actions.en.srt#checkpoint-resume-and-prevent-duplicate-actions]]`
- Summary: Details a resumable loop lifecycle: assign a run identifier, save intent, record each tool attempt with parameters before the call, and commit results after success. Distinguishes recording an attempt from committing a result, and explains idempotency keys to stop duplicate side effects.
- Key claims: A checkpoint connects to a durable operational state store for the specific run, not general long-term memory; on timeout/crash do not assume failure or success — reload the checkpoint and verify what actually happened; checkpoint record contains run metadata, working state, a tool ledger, identity keys, artifacts, and a decision log; before a side effect generate a stable idempotency key, check the ledger, execute once if absent, skip if already committed.
- Learner-relevant: Explains the exact mechanism (attempt vs commit, idempotency key, recovery sequence) that the labs require students to implement.

### context-budgets-and-information-prioritization

- Locator: `[[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/17. Context Budgets and Information Prioritization.en.srt#context-budgets-and-information-prioritization]]`
- Summary: Frames the context window as a fixed budget and presents prioritization as the discipline of deciding what information deserves space before reasoning begins. Introduces a three-layer model (must-include, compressible, retrieve-later) and a priority filter based on relevance, freshness, and risk.
- Key claims: Ask not "how much can we stuff" but "what changes the next decision"; must-include items (goal, completion criteria, active file, latest error) should appear in full; middle-layer context (related files, past attempts, tool history) can be compressed; low-value material (large docs, old logs, reference APIs) should be retrieved on demand; a context-pack builder selects only task-scoped pieces and refreshes rather than hoards.
- Learner-relevant: Provides the budgeting rubric and layered priority model for designing what enters the prompt each iteration.

### summarization-compaction-and-retrieval

- Locator: `[[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/18. Summarization, Compaction, and Retrieval.en.srt#summarization-compaction-and-retrieval]]`
- Summary: Defines three complementary techniques for keeping a long-running loop focused — summarization (stream to short accurate record), compaction (shape of working state: what stays, what is archived), and retrieval (rehydrate exact detail when a decision needs it). Emphasizes source-backed summaries over trusting a summary forever.
- Key claims: Context is a budget spent on current goals, constraints, evidence, and next actions, not every historical token; keep references to commit ids, failing tests, tool responses, and fail lines so full evidence can be retrieved later; compaction layers state into full trace, episode summary, stable facts, and next-action state; when detail is missing, mark it unknown or retrieve it rather than invent it; retrieval policy decides sources, query rewriting, metadata filters, and ranking.
- Learner-relevant: Supplies the architectural vocabulary for designing a memory system that keeps prompts small while staying correct.

### prevent-context-drift-and-lost-requirements

- Locator: `[[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/19. Prevent Context Drift and Lost Requirements.en.srt#prevent-context-drift-and-lost-requirements]]`
- Summary: Explains context drift as the gradual loss of the original request across turns and pins the source of truth to goals, constraints, acceptance criteria, non-functional requirements, and data contracts. Recommends a five-part control layer that keeps the loop faithful across many turns.
- Key claims: The latest message or observation is not the source of truth; extract explicit and implicit requirements and pin them as a canonical checklist referenced during planning, before action, and after results; the control layer comprises a requirement register, decision log, memory boundary, context budget, and validation gates; planning, tool use, code changes, and testing are each insufficient alone to prevent drift; at scale this becomes a governance concern (intake/spec review, approvals, audit trails, release gates).
- Learner-relevant: Gives the failure mode (drift) and the checklist discipline that motivates every earlier state-management technique.

### resume-an-agent-without-repeating-work

- Locator: `[[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/2. Resume an Agent Without Repeating Work.html#resume-an-agent-without-repeating-work]]`
- Summary: A hands-on exercise page. Students complete `resume_agent(checkpoint_json, requested_action)` so an interrupted agent resumes from its last checkpoint instead of repeating completed work. Includes instructions, a unit-test file `evaluate.py`, and the reference solution `checkpoint_resume.py`.
- Key claims: Validate that `requested_action` is a non-empty string; parse `checkpoint_json` into a dict and return an error when invalid; validate `iteration` (int) and `completed_actions` (list); skip an action already in `completed_actions` while keeping the current iteration; increment the iteration for a new action; return a structured decision without raising an unhandled exception.
- Learner-relevant: Concrete practice target for checkpoint parsing, skip-on-duplicate logic, and structured error handling.

### state-memory-and-context

- Locator: `[[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/3. State, Memory, and Context.html#state-memory-and-context]]`
- Summary: A multiple-choice quiz titled "State, Memory, and Context" with a score board, per-answer feedback, and an overall explanation. Questions test which information belongs in working state and what control prevents a duplicate payment after resume.
- Key claims: Working state should capture the current goal, completed steps, pending actions, and recent evidence; a resumed agent repeating a completed payment most likely lacked a durable operation record with an idempotency key; other distractors (larger context window, more creative prompt, second planning agent) are incorrect.
- Learner-relevant: A ready-made assessment item bank for probing/verifying the chapter's core state-memory concepts.

### lab-recover-an-interrupted-agent-run

- Locator: `[[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/20. Lab Recover an Interrupted Agent Run.html#lab-recover-an-interrupted-agent-run]]`
- Summary: A step-by-step 45–60 minute lab building `recoverable_agent.py`, an order-processing agent that creates receipts, saves progress after every order, validates input consistency, and resumes safely after a simulated crash. Uses only local files and the Python standard library.
- Key claims: Separate durable from in-memory state via `RunState` (goal, input fingerprint, next_index, completed_order_ids, status, trace); write atomically with temp-file-then-replace; fingerprint input with SHA-256 so a checkpoint only matches the workload that created it; store receipts keyed by `order_id` for idempotent creation (create, skip identical, fail on conflict); terminal states COMPLETED, INTERRUPTED, ESCALATED, FAILED; `--interrupt-after N` simulates a crash and a second run resumes at `next_index`; changing `orders.json` after checkpointing yields `ESCALATED`.
- Learner-relevant: End-to-end applied practice of checkpointing, atomic writes, input fingerprinting, idempotency, and safe resume versus unsafe escalation.
