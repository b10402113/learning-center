---
source: sources/background-agent/20261109/course/3-goal-and-harness-overview.txt
source_type: text
source_lines: 95
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Lesson outcome — the checkout service opens an incident and fires an alert; the harness observes it and runs the observe-predict-act loop.
- The agent's "world" — for a service-watching agent, the world is the service's state, not physics; browser and computer-use agents improve by being shown annotated screenshots.
- Harness-owned observation — the harness force-feeds a fresh world state each loop instead of letting the model choose to observe.
- Actions and validation — the agent picks the next action from state, goal, and history; the harness validates whether it may execute, routing restricted actions to a human.
- Three state kinds — world state, run state, and execution history all inform the next decision.
- Small tool set — inspect logs, inspect changes, disable feature, roll back, wait, ask for help, done; deliberately minimal and mostly simulated.

# L2 detail

- `#L1-L5` — Goal: the checkout service opens an alert and the harness observes it and acts on the observe-predict-act loop, the foundation for everything else.
- `#L6-L16` — Aside on researchers who argue intelligence requires understanding a world or simulation, since LLM-generated video shows poor physics understanding.
- `#L17-L29` — For this agent the "world" is the service state; the same principle explains why browser and computer-use agents improve when shown annotated screenshots.
- `#L30-L39` — Snapshotting server state (health, 200s, recent alerts) and giving it to the agent feels humanlike; the harness, not the agent, performs observation, unlike a traditional tool loop.
- `#L40-L47` — The harness force-feeds new state every loop; the agent decides the next action from state, goal, and history, including non-code actions like done or wait.
- `#L48-L53` — Other possible actions include asking a person for help or using a provided tool to investigate logs; the harness then validates execution.
- `#L54-L63` — Harness authors forbid destructive actions like rollbacks and redeploys; restricted actions are handed to a human in the inbox while the agent only knows something external handled it.
- `#L64-L73` — Letting the LLM decide when approval is needed fails over time; Anthropic's agent guidance distinguishes model-directed actions, predefined workflows, and harness-delegated actions.
- `#L74-L80` — World state is the service state, run state is the current investigation's knowledge, and execution history is every action taken; all feed the next decision.
- `#L81-L89` — ReAct is cited as an early 2022 thinking framework, similar in spirit to observe-plan-decide, and recommended reading.
- `#L90-L95` — The tool list is small on purpose—inspect logs, inspect changes, disable a feature, roll back, wait, ask for help, done—and mostly simulated so focus stays on the harness.
