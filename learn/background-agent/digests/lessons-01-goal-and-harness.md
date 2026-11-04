---
source: sources/background-agent/20261105/lessons/01-goal-and-harness/index.md
source_type: text
source_lines: 136
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L970-L1006
  - server.md#L1052-L1066
---

# L1 overview

- Background agent as lifecycle — chat is an interface, background is a lifecycle: an alert opens one durable incident run with a goal snapshot, status, history, and stopping condition, and the browser is irrelevant to its survival.
- The loop — observe current world → choose one action → let the harness validate and execute → observe again, with the harness owning the action catalog, decision limit, and completion test instead of the model grading itself.
- Four kinds of information — world state (live checkout `/state`), run state (goal/status/decision count), execution history (Inngest checkpoints), event history (notifications); confusing them yields payload-as-snapshot and proposal-as-effect failures.
- Tool catalog and authority — `inspect_logs`, `inspect_changes`, `disable_feature`, `rollback_release`, plus harness-interpreted `wait`/`request_help`/`complete`; untrusted logs are evidence not instructions, so policy in code beats prompt pleas.
- The deliberate weakness — the entire loop sits in one `step.run('whole-agent-loop')`, so a crash mid-loop can repeat model calls and tool effects; approval and wait paths escalate because they are not built yet.

# L2 detail

- `#L1-L5` — Header: title, start branch `lesson-1`, solution `lesson-2`, and the outcome (alert opens incident; bounded harness observes, chooses, acts, verifies).
- `#L6-L18` — Engineering idea: "outcome" vs conversation, lifecycle vs interface, the observe–decide–act loop, the supplied checkout process and `agentState`, one structured model choice per turn, and when a plain workflow beats an agent (`if release === "v2-bad" then rollback`).
- `#L19-L24` — Four kinds of information (world state, run state, execution history, event history) and the deliberately small tool list; logs as untrusted evidence; references to ReAct, Anthropic tool design, and AgentDojo.
- `#L25-L28` — "See it in the lab": start checkout with `--fault feature`, then `/events` and `/activity` show the placeholder run ending `escalated` with "Harness not implemented yet".
- `#L29-L34` — Live coding framing: replace the placeholder in `server/agent-workflow.ts`, supplied vs student-written pieces, and the diff convention (context stays, `+` green adds, `-` red removals).
- `#L35-L114` — Edit 1 diff on `server/agent-workflow.ts`: add imports (`randomUUID`, `agentState`/`getRun`/`goalSatisfied`/`recordDecision`/`recordToolAction`/`setIteration`/`setRun`, `chooseAction`/`writeReport`, `checkoutServiceUrl`); `inngest.createFunction({ id: 'incident-agent', triggers: { event: 'incident/opened' } })` gains `step` and wraps `step.run('whole-agent-loop')` with an 8-cycle loop, goal check, `setIteration`, `recordDecision`, escalation for `wait`/`complete`/`request_help`/`rollback_release`, and `POST ${checkoutServiceUrl}/operations` with `actionId`, `name`, `expectedVersion` plus `stale` handling.
- `#L115-L121` — Run `npm run format`, `lint`, `typecheck`; intermediate file may not typecheck mid-replacement; Verify with `--fault feature` (disable feature, observe healthy, complete) and `--fault release` (escalates for missing approval gate).
- `#L122-L125` — "Break it on purpose": compare alert payload with `/state` body, and confirm `service.started` opens no incident.
- `#L126-L129` — Engineering challenge: map authority boundaries for checkout state, event delivery, incident creation, model choice, tool policy, completion; which data is snapshotted vs read fresh.
- `#L130-L136` — Catch up to `lesson-2` via `git status --short` and `git stash push -u -m "lesson 1 progress"`; common mistake (the event is a doorbell, not world state; the harness, not the model, decides on approval) and the optional read-only tool extension.
