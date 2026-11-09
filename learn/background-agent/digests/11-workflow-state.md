---
source: sources/background-agent/20261109/course/11-workflow-state.txt
source_type: text
source_lines: 129
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Two kinds of state — Business state (incidents, checkout state) lives in Postgres under our control, while workflow state (completed steps and their results) is managed by Inngest as checkpoints.
- Upgrading running workflows — Changing code while runs are in flight needs a migration plan: parallel versions, killing old runs, or stopping them, weighed like a database migration.
- Extracting an `executeAction` helper — The act step is moved into a reusable function that logs the activity, calls the checkout operations API, records the tool action, and logs failures before rethrowing.
- Logger and policy placement — `logAgentActivity`, `actionPolicy`, and the `ActionName` type are imported so the helper can log and type actions without duplicating loop code.

# L2 detail

- `#L1-L9` — Separates business state stored in Postgres from workflow step state that Inngest stores and resumes on our behalf.
- `#L10-L20` — Explains steps as checkpoints saved by Inngest, with only return values persisted for resume, distinct from our own business-logic observations.
- `#L21-L36` — Discusses upgrading long-running workflows: versioning, running two versions in parallel, stopping runs, and the database-migration analogy.
- `#L37-L50` — Moves to code: checkout lesson 2, stop the old servers, and replace the single loop with multiple durable steps.
- `#L51-L56` — Adds imports for `logAgentActivity`, `actionPolicy`, and the `ActionName` type.
- `#L57-L73` — Defines the `executeAction` helper's parameters (environment ID, run ID, action ID, name, optional expected version) and the input fallback.
- `#L74-L90` — Logs the act-phase activity with the action name and action ID before executing.
- `#L91-L108` — Fetches the checkout `/operations` endpoint with method, headers, and JSON body; throws when the response is not OK.
- `#L109-L117` — Records the tool action when the result is not stale, passing environment, run, action, name, input, and result.
- `#L118-L129` — On error, logs an activity with the action ID and error message, then rethrows since errors are not yet handled.
