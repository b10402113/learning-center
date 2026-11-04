---
source: sources/background-agent/20261105/3-goal-and-harness-overview.vtt
source_type: text
source_lines: 657
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1052-L1066
  - server.md#L970-L1006
  - server.md#L1-L216
---

# L1 overview

- Lesson outcome — the checkout service opens an incident and fires an alert; the harness must observe that alert and act, running the observe/decide/act loop that becomes the foundation everything else is built on.
- What "the world" means — a digression on researchers who argue real intelligence requires understanding a world (simulation, physics, why generated video looks wrong) — explicitly not what we're building; here the world is simply the observed state of the service.
- Showing the agent the world — evidence from browser/computer-use agents: screenshots improve them, annotated screenshots (boxes on interactable elements) improve them more; easy to do for a digital world, hard for a physical one, and our digital world is (healthy?, 200s?, recent alerts).
- Observation is harness-owned — the deliberate departure from a tool loop: no prompt-plus-tools menu, the harness re-reads the world state in code every cycle and force-feeds it to the agent rather than letting the agent choose to look.
- Decision inputs and action kinds — the agent picks the next action from current state + goal + execution history, and an action need not touch code: terminal (I'm done), wait (pause myself), request help, or go investigate logs.
- Harness validates every action — policy lives in the harness, so disallowed moves (rollback, redeploy, anything costly or risky) are handed to a human in the inbox while the agent is never told a human did it; the warning is that letting the LLM judge when it needs approval will never work (prompt-whack-a-mole), with Anthropic's guidance on model-directed vs predefined workflows vs harness-delegated actions as the reference.
- Three states fed to the model — world state (the service), run state (this investigation: what we know, alerts seen, what's been done — distinct from world state), and execution history (all actions taken so far).
- ReAct lineage and the small tool list — the 2022 ReAct paper as the ancestor of observe/plan/decide; then the deliberately tiny action set: inspect logs, inspect changes, disable feature, rollback release, wait, ask for help, complete — tiny on purpose because MCP servers/skills are not the lesson, and the service is simulated anyway.

# L2 detail

- `#L1-L44` — States the lesson's concrete outcome: the checkout service will open an alert / open an incident, and the harness must be able to observe that alert and act on it via the observe→predict→act loop, which becomes the foundation every later feature sits on top of.
- `#L45-L118` — Digression on the word "world": researchers who believe AGI/ASI requires an agent to understand the world it lives in (simulations, physics, why LLM-generated video looks physically wrong), then the disclaimer "we are not building any of that" — for this agent, the world is just the state of the service it must observe.
- `#L119-L216` — Shows the agent the world through examples: browser agents and computer-use agents improve dramatically when given a screenshot, and again when the screenshot is annotated with boxes/labels around only the interactable elements; digital worlds are easy to present, physical ones are not; therefore the agent's world is the service snapshot — health, 200s, recent alerts.
- `#L217-L340` — The most important design claim of the lesson: observation is baked into the harness, not chosen by the agent. In a traditional tool loop you hand over a tool menu and a prompt and let the agent pick; here the code re-observes the current world every single loop and force-feeds the new state, while the agent only decides the next action given state + goal + action history — including non-code actions: declare done, wait/pause, ask a human, or investigate further.
- `#L341-L500` — How the harness gates what the agent proposed: actions the authors don't want (rollbacks, redeploys, anything risky or expensive) are refused and routed to a human in the inbox to press a button, and the agent is never told a person did it — "something outside of me is doing it, I don't care who"; then the strong warning that letting the model decide when approval is needed will always fail ("I don't care what model you use"), producing endless prompt patching, with the Anthropic agent-guidance link on model-directed vs predefined vs harness-delegated actions.
- `#L501-L560` — Enumerates the three inputs the model receives: world state (what the server looks like), run state (this specific investigation — what we know so far, the alerts that happened, what we've done, kept separate from world state), and execution history (all actions taken so far) — all three used to determine the next action.
- `#L561-L620` — Recommends the research lineage: the 2022 ReAct thinking-framework paper (pointing at the PDF/HTML) as essentially the same observe/plan/decide shape used here, with the aside that four years feels like thirty in AI.
- `#L621-L657` — Lays out the complete, intentionally small tool list: inspect logs, inspect changes, disable a feature, roll back a release, wait, ask for help, and complete — noting that anyone coming from Codex or Claude Code with many MCP servers and skills will find this trivial, which is the point: the harness is the lesson and the service is simulated anyway.
