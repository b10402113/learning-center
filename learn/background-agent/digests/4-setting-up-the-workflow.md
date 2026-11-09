---
source: sources/background-agent/20261109/course/4-setting-up-the-workflow.txt
source_type: text
source_lines: 205
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Starting state — run the checkout service with a feature fault so an alert exists for the harness to observe.
- Agent vs harness — an agent is an LLM plus a harness; the harness is all surrounding code providing context, tools, memory, and workflows.
- Inngest — a durable execution runtime with memoized steps, pause/resume, and event-driven triggers, chosen for its developer experience.
- Function setup — createFunction declares an id, name, and trigger event (incident/opened); background agents communicate through events, fire-and-forget.
- Steps as checkpoints — memoized step.run blocks mean completed work is not repeated for the same run.
- First harness loop — one step wrapping a max-8-iteration loop: fetch run, observe state, deterministically check the goal, write a report and finish when satisfied.

# L2 detail

- `#L1-L9` — Start the checkout service with a feature fault so at least one alert exists to observe.
- `#L10-L17` — The server consumes events but there is no harness yet; switch to the lesson one branch and address the agent-vs-harness question.
- `#L18-L26` — An agent is an LLM plus a harness; the harness supplies context, tools, workflows, and memory, everything beyond a raw prompt-response call.
- `#L27-L37` — Cursor and Claude Code differ mainly by harness despite the same model; the course builds a custom harness around the model set in .env.
- `#L38-L44` — On lesson one, open server/agent workflow; the skeleton does nothing; introduction to Inngest with the slogan "Unbreakable agents, invisible infra".
- `#L45-L51` — Inngest runs durable workflows whose steps are memoized, supports pause/resume, tracks position, and is general-purpose distributed computing, not AI-specific.
- `#L52-L63` — Banking transfer analogy: durable execution avoids hand-written rollback logic; Inngest has the best DX among comparable tools like Cloudflare and Vercel.
- `#L64-L69` — Inngest is worth exploring beyond the course; begin coding by deleting the setRun helper.
- `#L70-L84` — Import randomUUID from crypto and helpers from agent data; most boilerplate is pre-written so focus stays on the workflow, the harness itself.
- `#L85-L86` — AgentStates is introduced as something to be explained later.
- `#L87-L97` — getRun finds an existing run; GoalsSatisfied deterministically compares the current state object against the desired one so the LLM need not judge completion.
- `#L98-L107` — Imports also include recordDecision, recordToolAction, setIteration, setRun, chooseAction, writeReport, and checkoutServiceUrl; recording decisions and tool actions supports observability.
- `#L108-L117` — createFunction takes an id, a human-readable name, and triggers; fire events and handle them, such as incident/opened invoking this function.
- `#L118-L125` — Background agents are fire-and-forget, not request-response; the response may never come or arrive a year later, so events are the communication mechanism.
- `#L126-L135` — A step is a checkpoint: once executed for a run it is memoized and never repeats for the same run.
- `#L136-L144` — Extract environmentId and runId from event.data; for now put the whole loop into a single step, which is inefficient and equivalent to not using Inngest.
- `#L145-L155` — step.run wraps the whole agent loop; getRun by runId resumes existing context and prevents duplicate investigations, purely a database lookup.
- `#L156-L163` — A hard-coded guard rail caps the loop at eight iterations; every iteration first observes state via agentState for environmentId and runId.
- `#L164-L177` — Check whether the observed state already satisfies the goal; if so end early—this is pure harness logic, no LLM touched.
- `#L178-L191` — When the goal is satisfied, writeReport, update the run to completed with no state, and return the report.
- `#L192-L199` — The harness makes an agent unique; moats are harnesses, not models, since the same LLM under different harnesses behaves differently; it is a controlled deterministic loop.
- `#L200-L205` — Deterministic outcomes matter; a better prompt will not fix a system that works in demos but fails in production.
