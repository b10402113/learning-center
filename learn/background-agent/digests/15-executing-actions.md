---
source: sources/background-agent/20261109/course/15-executing-actions.txt
source_type: text
source_lines: 197
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Executing actions — the action runs inside a step, with idempotency keys so a replay or retry never performs a mutation twice; the returned result is memoized.
- Stale results — a `stale` result means the action was already applied (or no longer exists after a deploy), so it is logged and the loop continues.
- Live run walkthrough — the agent opens an incident, inspects logs, inspects recent git changes, disables the Express feature, then verifies recovery from its own state.
- State is the agent's ground truth — every mutation must update the state the agent observes, or it will repeat work and "trip" badly; the harness prevents harmful actions regardless.
- Next step — no inbox capability yet; the blast radius of letting the agent disable features needs to be addressed.

# L2 detail

- `#L1-L5` — Assumes any action can run at this point and wraps execution in `step.run` because running it twice could be dangerous.
- `#L6-L14` — Emphasizes idempotent actions: calling twice must not perform the mutation twice (e.g., a bank transfer).
- `#L15-L21` — Describes idempotency keys: reuse the same key per run so a replay is recognized as already done and still returns success.
- `#L22-L27` — Calls `executeAction` with environment ID, `decision.action`, and the expected version (`state.world.version`).
- `#L28-L35` — Handles `result.stale`: the action was already applied, or it vanished after a workflow deploy.
- `#L36-L42` — Explains logging stale actions lets you audit in-flight workflows after deploying a new workflow and act on mismatches.
- `#L43-L48` — Fixes the log call: environment ID, run ID, the act phase, and a message with the results.
- `#L49-L59` — After a clean execution with no return, continues the loop (explicit `continue`).
- `#L60-L65` — Considers updating the run again and drops the planned sleep simulation.
- `#L66-L72` — Cleans up the workflow and confirms `record-tool-action` already lives in the `executeAction` helper.
- `#L73-L80` — Removes dead code and starts the API to check nothing broke.
- `#L81-L89` — Runs the feature fault and dev environment; the run finishes so fast the timeout flag was added to make it observable.
- `#L90-L103` — Reviews the generated report: payment confirmation errors at 42%, logs pointing to the checkout service, feature disabled and healthy.
- `#L104-L111` — Walks the first event payload (Express feature error during payment confirmation) and the agent opening an incident.
- `#L112-L122` — Notes the hardcoded goal, the agent's plan to verify recovery from a fresh state, and the requirement to update state after mutations.
- `#L123-L130` — Analogizes a stale state to a magician's trick: the agent won't believe its eyes and will start tripping.
- `#L131-L137` — First loop: observe state, predict an action, inspect logs (read-only, allowed).
- `#L138-L144` — Logs return well-formed output; second loop sees unchanged state and still-unhealthy status.
- `#L145-L153` — This time the agent inspects recent changes to verify a push caused the incident before disabling anything.
- `#L154-L161` — Observes the LLM behaved differently after a harness-only change, and the harness guarantees safety regardless.
- `#L162-L169` — Git changes show the Express feature was enabled; third loop decides to disable it.
- `#L170-L178` — Approval is skipped for now; the disable succeeds and the server emits a recovery event.
- `#L179-L183` — The tool result shows the feature disabled; the fourth loop observes healthy status and error rate dropped to one.
- `#L184-L189` — The run completes and the report is generated; summarizes the steps, service, and state mutation needed.
- `#L190-L197` — Notes the agent runs unattended, inbox support comes next, and the disable-feature blast radius must be constrained.
