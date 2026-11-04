---
source: sources/background-agent/20261105/19-testing-wait-resume.vtt
source_type: text
source_lines: 681
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L505-L691
  - server.md#L1035-L1051
---

# L1 overview

- The acceptance test stated up front: start checkout with `--fault dependency --recover-after 30s`, and the *same* run id must wait, receive `health.recovered`, re-observe checkout, and complete — no second run opened.
- The wake event resumes the paused run in place — code continues on the line after `step.waitForEvent` (the `continue`), falls out of the `while`, and goes back to the top of the cycle loop to re-observe.
- Re-observation is what closes the incident: the resumed cycle reads `upstreamHealthy: true` and the goal condition is met, so the run completes — the event payload was never trusted as the answer.
- Server events (`health.recovered`, dot form) are mapped to Ingest events (`incident/updated`, slash form) — they are the same event, which is why the browser feed and the `if` filter look different.
- The agent's path surprised the instructor: it skipped waiting and chose `request_help` because the upstream gateway is not its responsibility — and the harness made that a safe outcome.
- Breaking experiment: `--recover-after 0` with no help tool implemented leaves the run parked with no event to wake it, effectively stuck on `while (true)` — do not run it, it can freeze the machine.
- Closing lesson: none of this touched the LLM — every fix in the waiting arc was harness code around a model that never changed.

# L2 detail

- `#L1-L40` — The test plan is read out before running: delayed-recovery fault, same run id waits → receives `health.recovered` → re-observes checkout → completes; then multiple alerts via `-3` should attach to one incident, not create 3 runs.
- `#L40-L80` — The stated break experiment (recover after 0ms) and the exact order of operations: `npm run dev:agent`, then the app with Ingest, then the checkout service with the fault flags.
- `#L80-L130` — First observation: the run has literally already paused by the time the dashboard is opened — the wait fired almost immediately.
- `#L130-L190` — The unexpected behaviour: this run asked for help instead of waiting, and then recovered on its own when a new event arrived — "never mind, I don't need help anymore".
- `#L190-L240` — Timeline walked from the top: incident opened, agent started, the payment-gateway-timeout alert, and the observed state showing 42 errors with `upstreamHealthy: false`.
- `#L240-L300` — The decision text captured: checkout degradation caused by an unhealthy upstream payment gateway that cannot be repaired locally, "what do you want me to do?" — i.e. correct refusal to act.
- `#L300-L360` — The question logged for the human ("investigate and restore the payment gateway, then notify us when it is healthy") and the aside that this could just as easily be a Slack message whose reply posts an event back.
- `#L360-L420` — The pause made visible: `waitReason` is the hard-coded "help is not ready yet" from the `defer-help` step, and the run would have sat there for its 10 seconds.
- `#L420-L480` — Mapping explained: the server-side `health.recovered` event and the Ingest `incident/updated` event shown in the feed are the same thing, differing only by dot vs slash naming.
- `#L480-L540` — Why the run resumed: the awaited event landed, so the next line executed (`continue`), which exits the `while` and returns to the top of the cycle loop rather than starting a fresh run.
- `#L540-L580` — The resumed cycle re-observed checkout, saw `upstreamHealthy: true`, and completed the run — the full wait → wake → re-observe → complete shape working as designed.
- `#L580-L640` — Failure experiment dissected: with no help tool and no event coming, the 0ms-recovery variant parks the run indefinitely with nothing to unstop it, and the instructor warns it may freeze your computer.
- `#L640-L681` — Post-mortem takeaway: the outcome was right even though the path was unforeseen, because the harness only permits actions we sanction; a run book saying "wait 30s before asking for help" would have changed the path, and a bounded agent-chosen wait duration is possible — but note zero LLM code was touched.
