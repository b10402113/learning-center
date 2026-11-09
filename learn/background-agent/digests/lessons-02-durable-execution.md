---
source: sources/background-agent/20261109/supplement/lessons/02-durable-execution/index.md
source_type: text
source_lines: 265
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
supplements:
  - server.md#L381-L596
  - server.md#L340-L380
  - server.md#L597-L624
---

# L1 overview

- Why the single step fails — one `whole-agent-loop` step means a process death after a tool commit leaves no saved result, so retry may repeat observations, model calls, and effects.
- Durable replay — Inngest persists each completed `step.run` result and reexecutes the function body, skipping finished callbacks and resuming at the first unfinished step; code outside steps runs again, so effects belong inside named steps.
- Step boundaries and `chooseAction` — give state read, model choice, tool effect, and report their own steps so a replay reuses the recorded decision instead of asking the model again; `cycle` suffixes keep repeated step IDs unique.
- Two clocks, two stores — checkout holds current state, PostgreSQL holds incident/approval/event/action history, Inngest holds completed steps; `observe-state-3` is evidence of cycle 3, not a promise about cycle 4.
- Obsolescence of in-memory state — session variables, `step.sleep` replacing in-process delays, `AGENT_SETTLE_DELAY`, restart-only-the-agent replay, and the honest limit that durability is not exactly-once.

# L2 detail

- `#L1-L5` — Header: start `lesson-2` → solution `lesson-3`; outcome that every observation, decision, effect, and report becomes a named durable step.
- `#L6-L20` — Core durability argument: the crash window inside one big step, Inngest persisting and reconstructing step results, why model decisions must be checkpointed (dynamic first run, deterministic replay), and why trace legibility matters more than "it technically ran".
- `#L21-L30` — Replay is not a suspended stack (the body reruns; separate reevaluated JavaScript from executed callbacks) and "two clocks, two stores" (checkout state vs PostgreSQL history vs Inngest step history).
- `#L31-L36` — Step-granularity tradeoff (opaque loop vs noisy micro-steps), checkpointing only what matters after a crash, Inngest versioning semantics of step IDs, and Anthropic's long-running-harness artifacts argument.
- `#L37-L50` — "See it in the lab" (one opaque step replays model calls and tool attempts) plus live-coding framing: replace the handler in `server/agent-workflow.ts`, keep cycle-suffixed IDs, note the action ID is still attempt-local.
- `#L51-L96` — Edit 1, part A: new imports (`logAgentActivity`, `actionPolicy`, `ActionName`) and the `executeAction(environmentId, runId, actionId, name, expectedVersion?)` helper that logs `act` activity, `POST`s to `${checkoutServiceUrl}/operations`, records non-stale results via `recordToolAction`, and logs then rethrows errors.
- `#L97-L111` — Edit 1, part B: function options gain `retries: 2`, `concurrency: { limit: 1, key: 'event.data.environmentId' }`, and `onFailure` that marks the run `failed` from `event.data.event.data.runId`.
- `#L112-L243` — Edit 1, part C: the handler body — `getRun` guard on `instanceId` and terminal statuses, 24-cycle loop with `observe-state-N`, `write-report-N`/`complete-run-N`, `choose-action-N`, `set-iteration-N`, `record-decision-N`, escalations for `wait`/`request_help`/`approval`, `execute-action-N` with `policy === 'read' ? undefined : state.world.version`, `stale-action-N` + `continue`, `settle-status-N` setting `waiting`, `step.sleep('settle-N', process.env.AGENT_SETTLE_DELAY ?? '1s')`, and `stop-at-limit`.
- `#L244-L250` — Format/lint/typecheck gate; Verify by running `AGENT_SETTLE_DELAY=20s npm run dev:agent`, triggering `--fault feature`, then Ctrl-C and restart terminal 1 during the sleep so the same run resumes from checkpoints.
- `#L251-L258` — "Break it on purpose" boundary between a committed operation and a recorded step result, plus the crash-window table challenge (before model output, after commit before ack, after step result).
- `#L259-L265` — Catch up to `lesson-3`; common mistake (a step records a successful result, not a lost acknowledgement; do not restart the Inngest Dev Server) and the optional "which step could be recomputed" extension.
