---
source: sources/background-agent/20261105/16-when-to-wait-for-input.vtt
source_type: text
source_lines: 643
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L505-L691
  - server.md#L1052-L1066
---

# L1 overview

- Lesson framing "Wait for the World" — the target outcome is an *unresolved* incident: the agent has alerts but not enough information, so it pauses rather than acting.
- Wait vs act is a judgement call only the agent can make — it read the logs and made the tool calls, so the harness cannot deterministically encode "is this enough evidence yet".
- Events are doorbells, not rooms — an event is a signal, never a snapshot; on wake the agent must re-read checkout state instead of trusting the payload.
- Harness-forced waits (approval gates) stay at harness level; agent-chosen waits and asking for help are non-destructive tools and are safe to delegate.
- Policies cannot be written for data that does not exist yet — that gap is precisely why the model needs a `wait` action it can pick on its own.
- Event grouping is an architecture decision explained here: one run per incident (grouped by a triage LLM) beats one run per event, because sibling runs cannot talk to each other.

# L2 detail

- `#L1-L58` — Opens the lesson: "Wait for the World", outcome is an unresolved incident, with the concrete example of acknowledging errors now but escalating if a second error lands inside 5 minutes.
- `#L59-L100` — Side note on missing context: no run books are supplied to this agent yet; a fuller build would pass run books as context or codify them into the workflow itself.
- `#L100-L140` — The posture being added: "I'm acknowledging this degradation, but I'm going to watch it" — the harness must be able to wait too, and the world will not wait for an agent loop to finish.
- `#L140-L200` — The doorbell analogy: checkout publishes the signal, the API persists it onto the current incident, the agent wakes and re-reads the checkout service — it does not accept the event payload as a snapshot; if the picture is incomplete it goes back to sleep.
- `#L200-L262` — Why the model gets a `wait` tool: harness-imposed waits (human approval) are only one kind; the logical conclusion of the agent's own reasoning may require waiting, and no deterministic policy can pre-encode that.
- `#L262-L305` — Policy limits stated plainly: policies can be written for approval, but not "for data that doesn't exist yet"; waiting or asking for help is non-destructive, so it is fine to hand those tools to the agent.
- `#L305-L360` — The line the instructor will not cross: the agent must not decide whether it needs approval — that gate stays at harness level. Test setup previewed: checkout service with a dependency fault that recovers after 30 seconds.
- `#L360-L440` — Goal for this branch: the agent pauses or asks for help when it genuinely has no actionable move, because a third-party upstream is broken and is not something this agent can repair.
- `#L440-L472` — Throttling example: a third-party API with a rate-limit queue means waiting is the *only* correct action — hit it again after a short pause rather than escalating.
- `#L472-L530` — Q&A on scale: one agent, one workflow, but many concurrent instances investigating different incidents; whether a new event opens a new run is an architecture choice.
- `#L530-L610` — Grouping vs run-per-event, with the instructor having tested both: three runs investigating three symptoms of one root cause can never converge, because each only saw one of the three events.
- `#L610-L643` — The recommended fix: a triage LLM in front that asks "are these related?" and only fires the event onto the existing investigative run; the system prompt could become a per-run variable so one harness serves many agent flavours.
