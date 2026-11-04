---
source: sources/background-agent/20261105/11-workflow-state.vtt
source_type: text
source_lines: 782
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L217-L504
  - server.md#L929-L969
---

# L1 overview

- Two separate state stores — business state is ours: incidents, the checkout process, whatever the service is doing, persisted in Postgres. Workflow state (which steps completed, what they returned) is Inngest's and we never store it.
- Checkpoints are free — every completed step is a checkpoint saved by the platform. There is no resume bookkeeping to write; "Inngest does all that for us."
- We only persist business logic — anything domain-meaningful is written by us (a new observation, the action the AI chose, etc.), which is why the dashboard can show a run at all. The platform records step return values for resumption; it does not know your domain.
- Deploying code over live runs is a migration problem — update the workflow while an investigation is in flight and you must decide: run two versions in parallel and drain the old, kill the old runs, or refuse the deploy if the change is destructive. Same reasoning as migrating a database with columns the existing rows lack.
- Rewrite begins on the `lesson-2` branch — the whole single-step agent loop is replaced by a set of steps; he flags this as likely the largest and most important code block in the course.
- New helper `executeAction` — takes `environmentId`, `runId`, `actionId`, action `name`, and an optional `expectedVersion`; logs an activity before calling, then POSTs to the checkout service `/operations` and records the outcome.
- Version precondition as an input — the request body is `{ expectedVersion }` when supplied, otherwise `{}`, so a write can be rejected if the world moved under an approved decision.
- Staleness and failure are logged, not swallowed — `result.stale !== true` triggers `recordToolAction(...)`; a failed call logs an "attempt failed" activity with the action ID and error message and then rethrows.

# L2 detail

- `#L1-L117` — The state split, stated up front: the checkout process is the service under this agent's care and its state/incidents live in Postgres; but the workflow state — all completed steps and their results — is calculated and stored by Inngest, "we don't have to store any of that." Steps are checkpoints; a checkpoint is saved on every completed step. We save only business-logic rows, and that is exactly why we wrote our own observation/action records.
- `#L118-L237` — The deployment consequence: a long-running workflow is investigating while you ship new code — what happens to in-flight runs, how do you migrate running code? Options are Inngest versioning (two versions in parallel; old ones die off, new runs get the new version), stopping runs you don't care about, or avoiding destructive changes. Compared explicitly to a DB migration where existing rows lack the new fields, so you must price the migration or you'll be stuck later.
- `#L238-L317` — Into the code: `git switch lesson-2` (students may stay on their own branch — "it's all the same code"), restart the service and agent processes, and replace the entire loop with a bunch of steps to make it "way more durable." Warning that this lesson contains most of the code in the course and is the most important part to remember.
- `#L318-L350` — Imports: `logAgentActivity` from `agent-log`, `actionPolicy` from `tool-policy`, and the `ActionName` type — the three things the restructured workflow needs to log decisions and consult policy without branching on service internals.
- `#L351-L464` — `executeAction` signature and inputs: an async helper taking environment ID string, run ID (to associate the work with the run), action ID, action name, and an optional `expectedVersion`. Its first job is the version input — `expectedVersion` if present, otherwise `{}` — extracted into the helper so it isn't duplicated when the loop is split across steps that all need it.
- `#L465-L564` — Logging then calling: `logAgentActivity(environmentId, runId, 'act', ...)` with a message like "calling <name>", then `fetch` against the checkout service URL + `/operations` with method, headers, a stringified JSON body carrying the action ID, action name, and the spread inputs. This is the same call as before, moved out of the loop into one reusable unit.
- `#L565-L632` — Response handling: parse `response.json()` as the result, and if the response is not OK throw a new error wrapping the result — the same behavior as the previous inline implementation, just relocated, with a `catch` added so the helper is self-contained.
- `#L633-L712` — Recording only real outcomes: `if (result.stale !== true)` then `recordToolAction(environmentId, runId, actionId, name, input, result)` — a stale result means the world version moved and the action was not applied, so it must not be recorded as done. Then the helper returns the tool result to the caller.
- `#L713-L782` — Failure path: even when the call fails, log it — `logAgentActivity(..., 'act', '<name> attempt failed', { actionId, error: error.message ?? String(error) })` — because "we want to at least know that something happened," and then rethrow, since error handling proper is not built yet at this stage.
