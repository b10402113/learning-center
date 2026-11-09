---
source: sources/background-agent/20261109/course/19-testing-wait-resume.txt
source_type: text
source_lines: 105
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Test plan — start a checkout fault with delayed recovery; the same run should wait, receive `health.recovered`, re-observe checkout, and complete; sending multiple alerts with `-3` should attach to one incident; recovering after 0 ms breaks the run.
- Running the scenario — start the API/app with Inngest, run the service with a dependency fault recovering after 30 seconds, then watch the paused run.
- Observed agent behavior — the agent paused, asked for help because the upstream payment gateway is unhealthy and not locally repairable; before help exists, it waited on the 10-second event wait.
- Event mapping — the fake server's `health.recovered` maps to the Inngest `health/recovered`-style event with a slash; both represent the same recovery.
- Resume and completion — the recovery event resumed the run, which continued the for loop, re-observed healthy state (upstreamHealthy true), and completed.
- Why it asked for help — no run book told it to wait, so asking for help was the correct reasoning; a run book would have changed the behavior. The wait duration is hard-coded but could be a dynamic, validated action.
- Harness, not AI — none of this touched AI; the code around the LLM (about four lines) is unchanged and insignificant compared to the harness controlling it.

# L2 detail

- `#L1-L8` — Test plan: delayed-recovery fault, same run waits and completes, `-3` alerts attach to one incident, 0 ms recovery breaks it.
- `#L9-L16` — Start the API/app with Inngest, then run the service with dependency fault and 30-second recovery.
- `#L17-L26` — The run already paused; asked for help, then a recovery event made it say help is no longer needed.
- `#L27-L31` — Incident opened on the new alert; state shows 42 errors, no features enabled, upstreamHealthy false.
- `#L32-L38` — The loop decided to ask for help because the upstream payment gateway cannot be repaired locally.
- `#L39-L44` — Hypothetical Slack delivery of the question; mapping a human reply back to an event; the run stays paused because help is not built.
- `#L45-L52` — The waited-for event matches `health.recovered`; the fake server's dotted event maps to the slash-named Inngest event.
- `#L53-L62` — Checkout recovered after upstream recovery; the event resumed the run, continued the for loop, re-read state, saw healthy, and completed.
- `#L63-L71` — Why asking for help was correct given no run book; the run would have waited indefinitely since help was not implemented.
- `#L72-L80` — Breaking it with a 0 ms wait leaves it stuck on `while (true)`; harness guardrails make unexpected-but-acceptable paths fine.
- `#L81-L96` — Run-book reasoning: reaching out for help is natural for unseen severe issues; dynamic wait durations would need validation; the alert later made help unnecessary.
- `#L97-L105` — Closing: nothing AI-related changed; the LLM is a few lines, and the harness controlling it is what matters.
