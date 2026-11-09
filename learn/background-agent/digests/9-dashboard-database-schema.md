---
source: sources/background-agent/20261109/course/9-dashboard-database-schema.txt
source_type: text
source_lines: 103
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Harness loop as foundation — The agent's reliability comes from repeating state → choose action → act; if the loop, state, tool choice, and ordering are wrong, no downstream piece works.
- Inngest dev dashboard — A local UI on port 8288 shows functions, triggers, runs, steps, and events, and lets you kick off, mock, rerun, and stop runs. With only one step it looks thin, but it becomes the main debugging surface once work is split into steps.
- Minimal persistence schema — `events`, `actions`, and `runs` are simple Postgres tables holding JSON blobs. A run is one event-driven wake-up; deciding whether a new event starts a new run or appends to an existing one is harness policy, not LLM work.
- Durable runs as snapshots — Everything defining a run lives in the database, so a new execution with the same state resumes exactly where the old one left off. Serializing as much as possible into state keeps runs portable.
- Unfinished loop behavior — Without history in the prompt the agent retried the same action eight times; supplying history would likely have made it ask for help instead.

# L2 detail

- `#L1-L8` — Walks the mental model: read state, predict, choose a tool, check ordering; the loop is the foundation everything else depends on.
- `#L9-L26` — Introduces Inngest's built-in dev server and dashboard, notes the port confusion, and explains it shows little with only one function and one step.
- `#L27-L30` — Opens Q&A about the database schema, setting up the claim that it is surprisingly simple.
- `#L31-L40` — Describes `events`, `actions`, and `runs` tables as plain JSON blobs, and defines a run as one event-driven wake-up that may be new or appended.
- `#L41-L46` — Contrasts upstream incident categorization (SEV-0/SEV-1) with the workshop's approach of always creating a new run.
- `#L47-L54` — Lists the real design work: human approval gates, infrastructure stops, state mutation rules, and guardrails on loop length and cost.
- `#L55-L66` — Explains pausing/resuming and portable runs: serialize everything into state so a later execution is virtually the same run.
- `#L67-L82` — Notes the loop stopped after eight iterations and explains the missing action history as the reason it repeated itself instead of asking for help.
- `#L83-L88` — Answers scheduling: Inngest cron easily schedules deferred actions; a viewer supplies the dashboard port, 127.0.0.1:8288.
- `#L89-L103` — Tours the dashboard: function and triggers, a run that failed after eight cycles, viewing steps and events, and triggering test runs.
