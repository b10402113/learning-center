---
source: sources/background-agent/20261109/course/0-introduction.txt
source_type: text
source_lines: 85
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Course framing — Scott Moss introduces background agents as long-running, self-healing intelligence systems that watch events, run on schedules, and work toward a goal without a prompt.
- Deterministic authority — the system, not the model, decides when help or approval is required, so critical outreach can never be skipped.
- Composition — a background agent is a harness plus infrastructure plus the traditional agents you already know, combined so it runs indefinitely unsupervised.
- Demo scenario — an e-commerce checkout service with outages; an agent watches logs and alerts, triages incidents, asks for help, and confirms recovery.
- Collaboration UI — an activity feed shows each investigation and loop; an inbox carries the agent's questions and approval requests.

# L2 detail

- `#L1-L4` — Scott Moss welcomes learners and states the course theme: background agents that run forever and do not die.
- `#L5-L13` — Background agents are a different type of agent from chat-based ones; they watch events, run on schedules, hold a goal, and deterministically reach out when a condition requires help or approval.
- `#L14-L19` — A background agent combines a harness, infrastructure, and traditional agents so it can run indefinitely, heal itself, and work without supervision; preview of what will be built.
- `#L20-L30` — Demo walkthrough setup: npm run dev starts the app, the agent itself is an API listening for events, and an empty database means no runs yet on main.
- `#L31-L43` — The scenario: an e-commerce checkout service with outages; an agent watches logs and events to help on-call staff triage, with a UI for observing and unblocking instead of chatting.
- `#L44-L55` — Each run shows the agent observing state, choosing the likeliest next action, and the harness applying validation checks; an example run where the agent asked a human for help.
- `#L56-L61` — The inbox is where the agent asks questions when missing context and where approval requests wait; these are the interfaces for interacting with background agents.
- `#L62-L70` — Live demo: a simulated third-party dependency fault starts a run; the agent loops and quickly asks for help because the failing dependency is outside its domain.
- `#L71-L83` — A health-recovered event arrives while the agent waits; the agent combines the human's answer, the latest state, and the recovery event to confirm the service is healthy and stop.
- `#L84-L85` — Closing hook: this is the system the course will build.
