---
source: sources/background-agent/20261105/4-setting-up-the-workflow.vtt
source_type: text
source_lines: 1338
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L217-L504
  - server.md#L970-L1006
---

# L1 overview

- An agent is an LLM plus a harness — the model only predicts; the harness is all the surrounding code that supplies context, tools, workflows and the ability to run unsupervised in the background. Cursor and Claude Code feel different despite the same model because their harnesses differ, and you're building a custom harness from scratch around whatever model sits in `.env`.
- Inngest as the durable execution runtime — `createFunction({ id, name, triggers })` produces a workflow invoked by an event (`incident/opened`), not by an HTTP request. Background agents are fire-and-forget, so events are the only channel: the reply may never come, or come a year later.
- `step.run` is a checkpoint — a step executes once per run, is memoized, and is skipped on any resume/replay. This lesson deliberately punts on it: the entire agent loop is wrapped in a single `step.run("whole agent loop")`, which is "basically the same as not having Inngest at all" — a starting point to be broken apart in later lessons.
- Two identifiers arrive on `event.data` — `environmentId` and `runId` — and `getRun(runId)` is a plain database lookup to detect an existing run and avoid duplicate investigations (same as looking up a user by ID, nothing AI-related).
- Deterministic completion beats asking the model — `goalSatisfied(currentState, run.goalCondition)` compares the observed world object to a declared goal condition, so the harness decides "done" without spending tokens. The LLM is only consulted when the goal is not satisfied.
- The loop skeleton and the decision limit — `for` loop capped at 8 cycles as a hard guardrail "so we're not sitting here forever"; per iteration: observe state → check goal → (later) ask the model → act. Termination writes a report and marks the run `completed` with no state, so a later event with the same `runId` would be a broken state.
- Harness as the moat — models are commoditized ("there are no moats right now, even across LLMs"); the harness's control, guardrails and bookkeeping are the differentiator. Motivation: the thing that works in the demo breaks for your client, and a better prompt will not fix it.
- Most supporting code is provided for free — persistence, API calls and the operator side are not the lesson; only the workflow (the harness itself) matters, "this isn't a how to write Node course".

# L2 detail

- `#L1-L68` — Starts the supplied checkout service with a fault (`npm run checkout`, then the `feature` fault — "somebody deployed a feature behind an AB flag" with no canary) so a real alert exists for the agent to observe.
- `#L69-L116` — The agent server is already running and consuming events but has no harness, so nothing acts on them; he then notices he is still on `main` and switches to the lesson-one branch to open `server/agent-workflow`, which is an empty stub.
- `#L117-L176` — Q&A: what is an agent vs a harness — an agent is an LLM plus a harness, and the harness is everything that supplies context, tools and workflows; passing a prompt to a model and getting text back is just "interacting with the model".
- `#L177-L248` — Cursor vs Claude Code both run Opus 5.5 and feel completely different because tool selection and compaction live in the harness; what we are building is a custom harness from scratch around whatever model is in `.env` (his: Luna).
- `#L249-L342` — Opens the stub, then the Inngest pitch — inngest.com, "Unbreakable agents, invisible infra", durable workflows where steps are memoized so pause/resume never re-runs them ("distributed computing in a box"), it tracks your position and can wait for events; it is not AI-specific, and the bank-transfer example shows why hand-written rollback logic is annoying.
- `#L343-L429` — Competitor landscape (Cloudflare, Vercel) and why Inngest's DX won him over, then back to the editor to start writing code.
- `#L430-L476` — Deletes the old `setRun` stub, imports `randomUUID` from `crypto` "to help us keep track of all of our events and things like that", and begins pulling a batch of helpers out of `agent-data`.
- `#L477-L538` — Why most of the file is pre-written — persistence and API calls are not the lesson, the workflow *is* the harness — then walks `AgentStates` and `getRun`, which finds runs that already started.
- `#L539-L637` — The `goalSatisfied` argument: hand over both the current state and what a good state should look like and the harness can deterministically compare two objects instead of asking the agent (the LLM is only needed when it is ambiguous); then `recordDecision`, `recordToolAction` (written only after harness validation) and `setIteration` counting every loop for observability, with `setRun` re-imported from `agent-data`.
- `#L638-L691` — Imports `chooseAction` and `writeReport` from `agent-brain` (the report is the end-of-investigation summary "tool") and `checkoutServiceUrl` from `observe`, noting he is about to mess with ports.
- `#L692-L799` — `createFunction` anatomy — function id, human-readable name, and the trigger: fire an `incident/opened` event and this function runs; contrasts a background agent's fire-and-forget model ("not a fire and wait", the response may come a year later) with a chat agent's request/response, then introduces `step` as a checkpoint.
- `#L800-L939` — `step` memoization per run so a replayed invocation skips executed steps; reads `environmentId` and `runId` off `event.data`; intentionally wraps the entire loop in one `step.run` ("basically the same as not having Inngest at all", incremental on purpose); `getRun(runId)` inside that step is a plain DB lookup to avoid duplicate investigations, and the hard-coded guardrail caps the agent at 8 cycles.
- `#L940-L1147` — Every iteration observes the world with `agentState(environmentId, runId)` and asks whether that observed state already is the goal state (500 bad, 200 good); if so, end now — and he points out no LLM code has been touched yet, this is all harness.
- `#L1148-L1338` — The satisfied branch — `writeReport(goal, state)` so no more tokens are spent deciding next steps, then update the run to `completed` with no state and `return` the report (terminal, so another event with the same `runId` would be a broken state); closes on harness-over-model ("there are no moats right now, even across LLMs"), the controlled deterministic loop, and the warning that a demo that works and then breaks for your client is not fixed by writing a better prompt.
