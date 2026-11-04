---
source: sources/background-agent/20261105/6-custom-tool-loop.vtt
source_type: text
source_lines: 877
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L1052-L1066
  - service.md#L1-L221
---

# L1 overview

- Breaking out of the stock tool loop — `generateText` can accept `tools` plus a stop-when condition and loop internally until the model is ready to answer, but then the SDK owns execution. The harness must be able to step in between "the model decided" and "the tool ran" (to pause, to escalate, to ask a human), and that interception is hard in any off-the-shelf loop, so you eventually build your own. Here the model is only asked for a recommendation; the harness owns the loop.
- Special actions act as harness gates — `request_for_help`, `complete` and `rollback_release` are caught before execution, the run is `setRun(..., escalated)` with a reason, and the function `return`s. The rollback gate is explicitly a harness-level policy decision ("I don't think you should do that without human approval"), not a prompt instruction; approvals get wired up in later lessons.
- Derived `actionId` — built from `runId` + `randomUUID()`, sent to the service and then recorded, so every executed action is individually traceable. The stated reason is trust: even a well-behaved background agent gets zero trust from other people unless you can show proof of exactly what happened.
- Actions live on the service, not the agent — the harness POSTs to the checkout service's `/operations` route with `{ actionId, action, expectedVersion }` and lets the service execute its own business logic. The model doesn't know or care how the action is implemented.
- `expectedVersion` versions the observed world — `state.world.version` is sent so the service can reject an action based on a stale view, the same idea as versioning an API when its schema changes; he calls it "probably overkill" but a cheap precaution.
- Every action must mutate observable state — the state the agent reads *is* its UI. If an action doesn't change state, on the next cycle the agent sees the same world, doubts whether the action worked, and either thrashes ("can you go check whether the rollback actually happened?") or never makes progress — like clicking Merge on GitHub and watching the UI never update.
- Stale results and error handling — `if (!response.ok) throw`, and `recordToolAction(...)` only fires when `results.stale !== true`, so an action accepted against a superseded world version isn't logged as truth. Real retry/error policy in durable execution is deliberately out of scope ("that's a whole course").
- Loop termination — after the `for` loop exits, `setRun(runId, { status: 'escalated', reason: 'decision_limit_reached' })` (limit 8). Gotcha corrected live: `return` inside the `for` exits the entire call stack, not just the loop, so this bottom is only reached when the decision limit is hit.

# L2 detail

- `#L1-L54` — Adds the third special case `if (decision.action === 'request_for_help')` and explains why stock tool loops cannot do this: the best they offer is coarse guardrail functions or bolt-on human-in-the-loop, and it is much harder to intercept right before a tool call and do something else.
- `#L55-L99` — What `chooseAction` deliberately does *not* use — `generateText` accepts `tools` plus a stop-when condition, giving an internal loop where the model calls a tool, sees results, and keeps calling until it is ready to answer.
- `#L100-L175` — Why that internal loop is unusable here: some tools need infrastructure (pausing, reaching out for help, halting on actions the agent should not take), so the SDK cannot be allowed to execute them — "you have to eventually just break that out and make your own tool loop", which is what the harness does by asking only for a recommendation.
- `#L176-L210` — First gate written out: `await setRun(runId, { status: 'escalated', reason: 'first loop cannot pause' })` then `return` — the pause machinery is a later lesson, but the case is caught now so nothing unexpected runs.
- `#L211-L299` — Second gate: `if (decision.action === 'rollback_release')` gets the same escalated/return treatment because "I don't want an agent just automatically doing rollbacks"; approvals are not built yet, and this is a harness-level policy — if you ask for a rollback release, you need human approval.
- `#L300-L399` — The rule for everything else: anything that is not one of those four special cases just runs. Derives `actionId` as `runId` + `randomUUID()` so actions are trackable ("be super clinical about what we track"), with the warning that even a well-behaved agent gets zero trust from anyone else unless you can show proof of what happened.
- `#L400-L499` — Performs the action with `fetch` against the checkout service's `/operations` route, deliberately chosen so the business logic stays on the service instead of being dragged into the agent ("the model doesn't care, the AI doesn't know or care"); sets headers and starts the `JSON.stringify` body with the `actionId` and the action name the agent chose.
- `#L500-L569` — Adds `expectedVersion` to the body — `state.world.version` — framed as versioning your state the way you would version an API, a precaution for when the service's state schema is upgraded; then `decision.action` and `await` the fetch, assuming the service performs the action.
- `#L570-L639` — The design constraint behind all of this: every action must modify the state, because that is the only feedback the agent gets on the next loop — if nothing changed it cannot tell whether its action worked, and it will start looping on a world that never moves.
- `#L640-L694` — The GitHub "Merge" analogy (you clicked merge, the UI never changed, so did it merge?) to drive home that the observed state is the agent's UI, followed by `await response.json()`.
- `#L695-L739` — `if (!response.ok) throw new Error(...)` as the entire error story, with the disclaimer that error handling, retry policies and durable-execution failure modes are "a whole course".
- `#L740-L799` — Stale-state handling: `if (results.stale !== true)` then `recordToolAction(environmentId, runId, actionId, action, expectedVersion, result)` — capturing env id, run id, action id, the recommended action, `state.world.version` and the result itself.
- `#L800-L877` — Outside the `for` loop: `setRun(runId, { status: 'escalated', reason: 'decision_limit_reached' })` with the limit at 8 — plus the live correction that `return` inside a `for` exits the entire call stack, not just the loop, so this bottom is only ever reached by hitting the decision limit.
