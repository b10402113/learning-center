---
source: sources/background-agent/20261105/12-multi-step-loop.vtt
source_type: text
source_lines: 998
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L217-L504
---

# L1 overview

- Run guards before doing any work — load the run by `runId` and bail if `run.instanceId` doesn't match `event.data.instanceId`, or if the status is already terminal (completed / failed / canceled / escalated / superseded). The same guard is re-run inside every cycle, because a run can go terminal *after* an action runs.
- Moving the loop from inside `step.run` to the workflow body — a fixed-count `for (let cycle = 1; cycle < 24; cycle++)` is deterministic, so it is legal at workflow level; a loop bounded by `Math.random()` would break durable replay and Inngest would reject it.
- Deciding what to memoize — anything async (DB reads, LLM calls, writes) goes in a step; deliberately *not* memoized: `getRun()` and the goal-satisfied check, since those must reflect reality on every cycle.
- One async thing per step — batching several async calls in one step means a retry replays all of them, so split anything whose replay has side effects; denormalize only when replay is harmless.
- Named steps carry the cycle number — `observe state cycle N`, `write report cycle N`, `complete run cycle N`, so Inngest's dashboard shows which iteration a checkpoint belongs to.
- Terminal vs continue — the `complete` branch writes the report in a step, completes the run in a step, then returns; the plain-action branch does not return, which is how the loop continues to the next cycle.
- Portability of the pattern — Temporal "activities", Vercel workflow decorators, Cloudflare's product all use the same workflow + step split: workflows deterministic, steps idempotent.

# L2 detail

- `#L1-L57` — Deletes the old single-step agent loop, keeps the bottom block temporarily "to migrate", and starts the new workflow body by destructuring the event and loading `const run = await getRun({ runId })`.
- `#L58-L120` — The entry guard: reads `instanceId` from `event.data` and returns early if `run.instanceId` mismatches or `run.status` is in `["completed","failed","canceled","escalated","superseded"]`.
- `#L121-L184` — Moves the loop into the workflow: explains workflow code must be deterministic, that a fixed upper bound makes the loop deterministic, and writes `for (let cycle = 1; cycle < 24; cycle++)`.
- `#L185-L280` — Checkpoint triage at the top of each cycle: `await getRun()` is intentionally left *outside* a step so it is never memoized/stale, then the terminal-status guard is repeated and returns on hit.
- `#L281-L340` — Why the per-cycle terminal check matters: it can never fire on iteration 1 (the entry guard would have caught it) but must fire after an action flips the run to completed, otherwise the loop never sees completion.
- `#L341-L415` — Goal check placed outside any step (must re-evaluate every turn) plus the first real step, `step.run("observe state cycle N", ...)` returning `getAgentState(environmentId, runId)` — memoized so it never re-runs on resume.
- `#L416-L510` — The step-sizing rules: async ⇒ step; one async operation per step; if several must share a step you must accept all of them replaying on retry; break them up "as the application requires".
- `#L511-L600` — Goal-satisfied branch: `step.run("write report cycle N")` wraps `writeReport` (expensive LLM call, must be memoized) and notes that whatever a step returns is available as the variable.
- `#L601-L660` — `step.run("complete run cycle N")` calls set-run with no variable captured (result unused), then `return report` ends the workflow for this invocation.
- `#L661-L790` — Recap of the decision procedure applied line by line — "is this async? should this be memoized? am I okay re-running it?" — with the two hard rules restated (async ⇒ step; don't batch async in one step unless replays are harmless).
- `#L791-L900` — Cross-tool comparison: Temporal activities, Vercel's workflow/step decorators, all equivalent; workflows deterministic, steps idempotent, syntax is the only difference.
- `#L901-L998` — Closing on portability: don't fixate on Inngest's API because all durable-execution products (including Cloudflare's, his second favorite) enforce the same rules.
