---
source: sources/background-agent/20261105/8-running-the-background-agents.vtt
source_type: text
source_lines: 526
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

- Live run walkthrough — Scott restarts the checkout service, replays a run, and narrates the harness cycle (observe → predict → act → loop) from the operator dashboard. His point is diagnostic: is the agent predicting off the *current observed state*, and is the ordering of the loop being followed?
- Event feed vs activity feed — the events tab holds the raw service event ("checkout Express feature raised an error during payment confirmation, error rate 42.1"); the activity feed shows the derived run ("new investigation, currently running") with the goal text attached. Raw evidence and agent narrative are separate surfaces.
- Observation is re-read state, not the event payload — the observe phase renders the world snapshot: `health.status: degraded`, `errorRate: 42`, current `release`, service name, and the `checkoutExpress` feature flag. The event only wakes the agent; the state object is what the model reasons over.
- Iteration counting is visible — the loop logs each iteration, so the dashboard shows "we're still in loop one" then "we're now on loop 2". The run row's iteration counter is the agent's public clock.
- Prediction is constrained by the action list — in iteration 1 the model picks `inspect_logs` with a stated reason ("the alert points to the enabled Express feature, but logs are needed to confirm the failure source"), and the harness checks policy: read actions are not a special case, so it executes immediately.
- Read actions don't move the world — after inspecting logs the action records and the loop continues, but the next observation is materially unchanged. Nothing is mutative, so no state update is expected.
- Loop 2 escalates intent — with the log line naming the feature as the error source, the model chooses `disable_feature`. But since no write path, terminal action, or history is wired up yet, the run keeps re-deciding the same thing.
- Decision limit as safety net — with no `request_help`/`complete` handling built, the run simply loops to the cap (8 in this build) and stops. Scott closes on "this is working pretty well," while flagging that the agent never gets annoyed that it has said the same thing eight times.

# L2 detail

- `#L1-L28` — Cold start: return to the app, run the checkout service again ("Got the checkout service running"), then go back and tail the logs. No code changes, just bringing the supplied service and the agent process back up so a fresh run can be observed.
- `#L29-L60` — Log reconnaissance: the log grep names the wiring — the serve function event and the `checkout incident agent` event/internal pair — then he restarts the agent to get a clean stream ("I want to see some logs here").
- `#L61-L111` — Event and activity surfaces: the events tab shows a health alert with `error rate 42.1`; the activity feed shows a new investigation currently running, described as "using permitted actions to restore service" (which is close to verbatim the goal), then the walkthrough starts from the beginning of the run.
- `#L112-L207` — Run header and first observation: the run opens with the goal ("investigate the checkout incidents, use permitted actions to restore service when possible, ask a human for help…") and an event ID, then the raw service event, then observe. He finds `observe` in code (it calls `getAgentState`), notes the logging is done by that function, and reads out the world state: health object with `status: degraded`, `errorRate: 42`, release, service name, feature enabled — "that's the state you have to figure out for the thing you're putting this on."
- `#L208-L285` — Iteration 1 prediction: the loop logs its iteration ("this is our first iteration"), then predicts from the enumerated action list and lands on `inspect_logs` with the reason that logs are needed to confirm the failure source before changing the service state. He then checks the harness: "is inspecting the logs one of these special cases? No." — a read action, so it executes without approval.
- `#L286-L362` — Act and re-observe: `inspect_logs` returns mocked log output (he admits the service response is fabricated), the action is recorded, nothing errors, and the loop goes back up to observe again. The state is unchanged because looking at logs is not mutative — "you wouldn't expect your server to have a different state because you looked at the logs."
- `#L363-L462` — Iteration 2 decision: now on loop 2 the model recommends `disable_feature`, justified by a log line reading "Checkout Express feature raised an error during payment confirmation." He jokes that the service has suspiciously excellent engineers writing detailed logs, and the AI is simply cashing in on them; the action is selected and the loop turns again.
- `#L463-L526` — Hitting the cap: it keeps re-selecting `disable_feature` and re-observing "up till 8 times" because no terminal actions (`request_help`, `complete`) exist yet, so nothing stops the loop except the iteration limit. He frames it as watching how the agent thinks: it is consistent, it just has no way to declare victory or ask for help — "so this is working pretty well."
