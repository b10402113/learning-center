---
source: sources/background-agent/20261109/course/16-when-to-wait-for-input.txt
source_type: text
source_lines: 83
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Lesson framing — this lesson "Wait for the World" targets the outcome of an unresolved incident, where the agent knows something is happening but lacks enough information to act.
- Waiting strategies and context — deciding when to wait (seeing more errors, watching a dependency recover, throttling), and how run books or workflow codification could supply context the agent currently lacks.
- Why the harness must support waiting — the world does not wait on the agent; events act as doorbells, dependencies can recover while idle, and multiple alerts can describe one outage.
- Agent-chosen vs. harness-forced waiting — some waits (human approval) must be deterministic and belong to the harness; others (wait, ask for help) only the agent can decide because only it holds the reasoning context, and these are non-destructive.
- The dependency-fault scenario — the checkout service will fail via a crashing third-party dependency that recovers after 30 seconds, motivating waiting to see recovery or asking for help.
- One agent, many runs — the same harness can run thousands of instances; grouping related alerts/incidents into one run beats separate runs that cannot talk to each other, possibly aided by an LLM triage layer. System prompt could be made dynamic per run.

# L2 detail

- `#L1-L2` — Lesson title "Wait for the World" and its outcome: an unresolved incident.
- `#L3-L7` — Incident arrives with insufficient information; examples of waiting for more errors or a correlated error within 5 minutes.
- `#L8-L16` — Missing context such as run books, and how codifying them into workflows could inform decisions; people also watch and wait.
- `#L17-L25` — The harness must support this; the world does not wait, dependencies recover while idle, events are doorbells not rooms, and the agent wakes without a full snapshot.
- `#L26-L37` — Give the model the freedom to choose to wait; contrast with harness-forced waits such as human approval; waiting/asking for help is non-destructive, approval decisions are not.
- `#L38-L47` — Transition to coding: the test will use a dependency fault on checkout recovering after 30 seconds; goal is an agent that waits or asks for help when unsure.
- `#L48-L57` — The third-party dependency recovers on its own, or throttling means waiting is the only option; many scenarios where the agent might choose to wait.
- `#L58-L67` — Q&A: one agent and one workflow but many concurrent instances; architecture choice on grouping alerts versus one run per event.
- `#L68-L77` — Recommendation to group events first; separate runs cannot share context, so an LLM triage layer could decide whether events are related before firing one.
- `#L78-L83` — The system prompt could be made dynamic per run instead of hard coded while reusing the same workflow and harness.
