---
source: sources/background-agent/20261109/course/8-running-the-background-agents.txt
source_type: text
source_lines: 77
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Demo run — restart the checkout service and agent, then watch events and logs flow.
- Triggering event — a health alert reports a checkout Express feature error during payment confirmation with a 42.1% error rate.
- Activity feed — a new checkout investigation starts and uses permitted actions to restore service.
- Observe step — the raw event arrives and the agent state is captured as a health object (degraded, error rate 42, release, feature flag).
- Iteration one — the loop is logged, then the agent predicts "inspect the logs" because the alert implicates the enabled feature.
- Acting — inspect-logs is not a guarded action, so it executes and returns log results.
- Read vs mutate — inspecting logs changes no state, so the loop re-observes nearly identical state.
- Iteration two — the logs identify the Express feature as the error source, so the agent picks "disable feature".
- Open-ended loop — with no terminal features built, it keeps cycling toward the eight-iteration limit.

# L2 detail

- `#L1-L4` — Restarting the checkout service and the agent, and checking the ingest workflow logs.
- `#L5-L10` — A health alert event appears and the activity feed shows an investigation using permitted actions to restore service.
- `#L11-L16` — The run's opening entry records the goal and event ID; the first observation is the raw service event.
- `#L17-L26` — The observe function logs agent state: health status degraded, error rate 42, release, service name, and feature flag.
- `#L27-L36` — Iteration one is logged; the agent recommends inspecting the logs because the alert points at the enabled feature.
- `#L37-L44` — Inspect-logs is not a guarded action, so it runs and returns the mocked log results.
- `#L45-L54` — The action is recorded and the loop repeats; reading logs mutates no state, so the observation barely changes.
- `#L55-L68` — In loop two the logs identify the Express feature as the error source, so the agent selects "disable feature".
- `#L69-L77` — No terminal actions are implemented yet, so it keeps cycling to eight while remaining consistent about disabling the feature.
