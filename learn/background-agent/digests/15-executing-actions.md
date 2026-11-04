---
source: sources/background-agent/20261105/15-executing-actions.vtt
source_type: text
source_lines: 1329
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - service.md#L1-L221
  - server.md#L1-L216
  - server.md#L217-L504
---

# L1 overview

- Execution goes in a step — `await step.run("execute action cycle N")` wraps `executeAction(environmentId, decision.action, expectedVersion)` because running a mutating action twice is dangerous; the step's memoization is the last line of defense, not the first.
- Idempotency is the real protection — mutation functions must be "potent": calling them twice with the same arguments must not do the thing twice. The pattern is an idempotency key (here the derived action ID) that the service remembers and answers 200 "already did it" on replay.
- Version precondition — the third argument is the expected version, sent as `undefined` for read-policy actions and as `state.world.version` for anything mutating, so the service can reject the action when state moved underneath the agent.
- Stale results are a feature — `if (result.stale)` means the service already performed this action (or the action no longer exists after a deploy removed it); it is acknowledged, logged with the cycle, and treated as success rather than an error.
- Activity record on every attempt — the act phase writes `decision.action`, `expectedVersion`, a message like "Action rejected because service state changed", and the result, which is what makes post-incident and post-deploy audits possible.
- Terminal vs continue — if no branch returned (no wait/complete/help, no approval needed), the loop intentionally falls through and continues; the explicit `continue` is unnecessary but harmless, and the run is updated to signal another turn.
- Verified end to end — three/four cycles of observe → decide → act, with the service emitting a recovery event after the flag was disabled; the agent re-observes, sees error rate drop 42 → 1 and `featureEnabled: false`, and self-verifies before emitting the report.

# L2 detail

- `#L1-L90` — Assumes every action reaching this point may run (approvals deferred), opens `await step.run(...)` for the execution, and warns that calling the same effect twice is exactly what a step's memory protects against.
- `#L91-L170` — The idempotency lesson: mutated functions need idempotency keys so a replayed call with the same key is a no-op that still returns 200 to the caller; promises problems if you skip it.
- `#L171-L240` — Implemented call `executeAction(environmentId, decision.action, expectedVersion)` with `undefined` for read-policy actions versus `state.world.version` for writes, and confirms the result is memoized by the step.
- `#L241-L330` — Handles `result.stale === true`: explains stale as the idempotent "already did this" acknowledgement, logs a `stale action cycle N` activity so it is visible in the timeline.
- `#L331-L400` — The second stale cause: a workflow in flight whose action was deleted by a redeploy, and the operational habit of sweeping those logs across active runs right after shipping.
- `#L401-L540` — Records the act-phase activity — `decision.action`, `expectedVersion: state.world.version`, the "Action rejected because service state changed" message, and the results — while fixing the compile error caused by the removed action-ID argument.
- `#L541-L620` — Confirms the shape (environmentId, runId, act phase, message, results) then deliberately does *not* return so the loop continues; notes `continue` is unnecessary but kept to avoid breaking the loop.
- `#L621-L700` — Updates the run once more to signal the next iteration, drops the simulated `sleep` (it made runs too fast to observe), deletes the old single-step workflow, and verifies `executeAction` already calls `recordToolAction`.
- `#L701-L820` — Boots the app (API, fault scenario, Inngest dev server), triggers the incident, and finds it finished so quickly the report is already written — explaining why a delay/timeout was in the service.
- `#L821-L900` — Reads the generated report (42% error rate at payment confirmation, Express feature disabled, verification event, healthy final state), then starts auditing it against the raw events; restates the hard-coded goal and "verify recovery from a fresh state".
- `#L901-L1020` — Loop 1: observes state, decides `inspect_logs` — allowed because read policy — executes with no inputs; loop 2: state unchanged so it escalates to `inspect_changes`, which simulates checking GitHub for recent pushes.
- `#L1021-L1140` — The improved reasoning: confirm something was recently pushed before disabling; notes the LLM behaved differently although only the harness changed, and that the harness bounds the blast radius; the git change says the Express feature was enabled; loop 3 disables it.
- `#L1141-L1240` — The service emits a recovery event after the flag flip, the tool result shows `featureEnabled: false`, and loop 4 observes `status: healthy`, error rate 1 (was 42) — proof of self-verification from state the agent did not fake.
- `#L1241-L1329` — Run completes and the report is always generated, wrap-up on how much scaffolding (steps, alerting service, mutable state) was needed, and the setup for the next lesson: gating `disable_feature` behind human approval because the blast radius is too large.
