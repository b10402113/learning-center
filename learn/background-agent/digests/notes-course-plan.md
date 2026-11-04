---
source: sources/background-agent/20261105/notes/course-plan.md
source_type: text
source_lines: 11
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Learning promise — give an agent a standing goal, leave it working, and understand how it wakes correctly after an event, a failure, or a human decision; one-day live workshop (later VOD) for professional JS/TS engineers.
- Lab topology — supplied local checkout service owns state and emits alerts (startup flags: feature failure, faulty release, dependency outage, healthy); operator app has Inbox/Activity/Events; Neon stores events, incidents, actions, human decisions, activity; Inngest stores checkpoints and waits.
- Incident lifecycle — one checkout instance has one active run; first alert opens it, later alerts join and wake it, recovery completes it after fresh observation, restart supersedes unfinished work; production would need explicit incident keys.
- Harness ownership — six branches (`lesson-1`..`lesson-6`) build a bounded goal-driven loop, durable steps, event waits, approval, safe retries, and help requests; the model proposes, the harness owns policy, version checks, decision budgets and human gates, the service owns idempotency.
- Depth over code volume — distinguishing notification from state, incident lifecycle, authority placement, ambiguous side effects, and evaluation evidence; old OpenSpec prototype files are kept as historical design records.

# L2 detail

- `#L1-L3` — Course promise and format: one-day live workshop for working JS/TS engineers, each lesson = engineering discussion + small live edit + trace/failure experiment + 15 minutes catch-up.
- `#L4-L5` — Supplied lab: local separate checkout service with state and alerts, startup flags for feature/release/dependency/healthy, operations API so a later observation can verify an effect, no simulator page or hidden scenario branch, operator app Inbox/Activity/Events, Neon vs Inngest storage split.
- `#L6-L7` — Correlation rule: one active run per checkout instance, subsequent alerts join and wake it, recovery completes it, restart supersedes unfinished work, and the stated production limits.
- `#L8-L11` — What students write across six branches, the authority split (model / harness / effect-owning service), the main drills (feature repair, release rollback with approval, dependency help and recovery, lost tool response), the advanced-lab dual scoring, and keeping OpenSpec files as history while README and lesson notes describe current behavior.
