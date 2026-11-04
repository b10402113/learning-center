---
source: sources/background-agent/20261105/0-introduction.vtt
source_type: text
source_lines: 578
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - web.md#L1-L713
  - service.md#L1-L221
  - server.md#L1-L216
---

# L1 overview

- Lecture framing — background agents defined as "agents that run forever and don't die": chat/conversational agents (ChatGPT, Claude) are synchronous; background agents watch events, run on a schedule, and work toward a goal without being prompted.
- Deterministic human-in-the-loop — reaching out for help or approval is baked into the system so it fires when a condition is met, never when the model feels like it; a background agent = harness + infrastructure + traditional agent, running indefinitely and self-healing.
- The workshop scenario — an e-commerce company's flaky checkout service and burned-out on-call staff; the agent observes all events/logs for that service and triages investigations, replacing chat with an observation/unblocking interface.
- The loop as demonstrated — a new event opens an investigation, the agent reads the alert, observes the current world state, then repeatedly picks the next best action from (state + goal + allowed actions), and can escalate to a human.
- The operator inbox — the two human surfaces: help requests (missing context / "I'm not sure") and approvals on actions the harness has locked behind a human decision.
- Live demo: dependency fault — creating a fake third-party fault on the checkout service, watching a run kick off, wait, loop, and decide "I need help" because the failure is outside its domain.
- Events keep arriving during waits — a `health recovered` event lands while the run is still blocked on the human; the operator's answer plus the event plus a fresh state read (healthy, upstream healthy) produce a confident terminal "job done".
- Harness as protection — the workshop's thesis: you supply the tools, the harness blocks destructive/costly actions, and the harness (not the model) decides when a human is required.

# L2 detail

- `#L1-L118` — Scott introduces himself and the course premise ("agents that run forever and don't die"); contrasts chat/conversational agents with background agents and argues the latter do not replace the former — they add event-watching, schedules, unprompted goal pursuit, and deterministic reach-out for help/approval; defines the stack as harness + infrastructure + traditional agent.
- `#L119-L182` — Starts the environment: `npm run dev` brings up the app, then the agent's own API (an API that listens for events); opens the dashboard and warns that a fresh checkout of `main` shows nothing because the database is empty, while his is full of past runs.
- `#L183-L315` — Explains the scenario and the dashboard: an e-commerce company with a checkout service that has had outages and exhausted the on-call rotation, so the agent watches its events/logs to speed triage; because nobody is chatting with it, an interface is needed to observe and unblock it; walks one investigation — new event arrives, run starts, agent sees the alert, observes the current world state, then loops to choose the next most likely action; one run shows the agent deciding it needs a person.
- `#L316-L400` — The help path resolves and introduces the inbox: the harness is what makes the agent's "I need help" true (code, not model whim), a person replies "you're good to go", and after a couple of cycles the agent declares the service resolved; the inbox is then explained as the single surface for both questions/context gaps and harness-locked approvals.
- `#L401-L470` — Live demo of a fault: uses the demo checkout service to inject a fake fault on a dependency (the service fails because a third-party API is failing — outside our control), starts a run, then shows the activity view where a new run kicks off, waits, loops, and quickly decides "I need help".
- `#L471-L533` — The key teaching moment: while the run is blocked asking for help on the payment gateway, a `health recovered` event arrives, proving the agent keeps listening for events even mid-decision; Scott states the division of labour — we give it tools, the harness stops destructive actions, and the harness requires reach-out.
- `#L534-L578` — The operator answers "it should be good soon, just wait for the recovery event"; the agent consumes both the answer and the health-recovered event, re-reads the latest state (`healthy` and `upstream healthy` both true), confirms consistency, and terminates the run — closing the demo of what the day will build.
