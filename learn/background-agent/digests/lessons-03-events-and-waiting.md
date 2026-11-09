---
source: sources/background-agent/20261109/supplement/lessons/03-events-and-waiting/index.md
source_type: text
source_lines: 137
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
supplements:
  - server.md#L672-L858
  - server.md#L863-L879
  - service.md#L1-L221
---

# L1 overview

- Events as doorbells — a checkout alert is a notification that the world may have changed, not a certified snapshot; the agent wakes, reads `/state` again, and never trusts the payload as proof of recovery.
- Correlation policy — one active run per checkout service instance: first degraded alert opens it, later alerts join, `health.recovered` wakes it; an application-level rule, not an Inngest feature or an LLM judgment.
- Durable wait — model-selected `wait` persists `waiting`, registers `step.waitForEvent('incident/updated')` correlated by `async.data.runId`, and compares a persisted `eventSequence` (with 10s timeout rechecks) so an event racing wait registration cannot be lost.
- Fresh observation and completion — after a wake a new observation step is created, and `health.status = healthy` is evaluated from that fresh state; a model-selected `complete` is rejected while the condition fails.
- Boundaries — in-memory producer queue means a crash between state change and alert can lose the wake, restart issues a new `instanceId`, and unfinished runs plus pending approvals are superseded.

# L2 detail

- `#L1-L5` — Header: start `lesson-3` → solution `lesson-4`; outcome that an unresolved incident pauses for a new service event and resumes with a fresh observation.
- `#L6-L12` — Doorbell framing, one-run-per-instance reasoning (merge vs duplicate risk), why the correlation rule is application-level, and the note that Inngest `concurrency` bounds execution rather than incident semantics.
- `#L13-L19` — The wait mechanics (persisted `waiting`, `waitForEvent`, `eventSequence` recheck, timeout as reconciliation tick, new observation step), the honest dependency fault, the producer failure window and outbox, and superseding old runs/approvals on restart.
- `#L20-L34` — "See it in the lab" with `--fault dependency --recover-after-ms 30000` (current checkpoint escalates on `wait` or help) and live-coding framing: replace the temporary wait escalation in `server/agent-workflow.ts`; help is parked, not delivered.
- `#L35-L96` — Edit 1 diff: widen the pause condition to `wait || request_help || (complete && run.goalCondition)`, add `reject-completion-{cycle}` and `defer-help-{cycle}` `logAgentActivity('human')` calls, `wait-status-{cycle}` with per-action reason text, then a `while (true)` loop of `read-event-sequence-{cycle}-{check}` on `getRun(runId)`, bail-out on `cancelled`/`superseded`/`failed`, break when `latest.eventSequence > state.eventSequence`, and `step.waitForEvent('wait-for-service-{cycle}-{check}', { event: 'incident/updated', if: 'async.data.runId == "<runId>"', timeout: '10s' })`, then `continue`.
- `#L97-L117` — Edit 2 diff: delete the separate `help-unavailable-{cycle}` escalation branch that preceded the `actionId`/`actionPolicy` lines; format/lint/typecheck reminder.
- `#L118-L125` — Verify: dependency fault with delayed recovery should wait, receive `health.recovered`, re-observe, complete; `--alerts 3` must attach to one incident; "Break it on purpose": `--recover-after-ms 0` keeps the run waiting and a healthy restart supersedes it.
- `#L126-L129` — Engineering challenge: compare one-run-per-event, one-run-per-service, and explicit incident IDs; design the reconciliation rule for an event arriving just before a durable wait.
- `#L130-L137` — Catch up to `lesson-4`; common mistake (notification ≠ state snapshot) and the optional multi-region incident-key extension.
