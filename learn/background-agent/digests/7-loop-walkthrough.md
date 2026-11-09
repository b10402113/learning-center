---
source: sources/background-agent/20261109/course/7-loop-walkthrough.txt
source_type: text
source_lines: 89
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Full loop walkthrough — one ingest workflow, one step, a for loop capped at eight cycles.
- Each cycle — read state, deterministically check the goal, ask the LLM for the next action, then guard the special actions.
- Guarded actions — wait and request-for-help need pausing; complete needs a special finish; rollback needs human approval.
- Everything else runs — unguarded actions are executed through the service's API and recorded.
- State is the feedback loop — mutating actions must update state or the agent cannot tell its work succeeded.
- Debugging value of state — a stuck agent behaves like a person whose edit never shows up on screen.
- Goal-check gap — deterministic completion and the model's "complete" can conflict, exposing prompt/code mismatches.
- LLM goal check alternative — a focused LLM goal-checker creates a smaller, more evaluable surface.
- Demo setup — start the API and checkout service, then open the app on port 5173.

# L2 detail

- `#L1-L10` — One ingest workflow function, one step, and an eight-cycle loop that observes state and runs a deterministic goal check.
- `#L11-L16` — If the goal is unmet, the LLM picks the most likely action from the allowed set and explains its reasoning.
- `#L17-L22` — After the decision, housekeeping updates the loop count and records the decision before executing.
- `#L23-L28` — Waiting and request-for-help need ingest-specific pausing; complete likely needs a summary or notification.
- `#L29-L33` — Rollback release is blocked pending human input; all other actions may run autonomously.
- `#L34-L38` — Actions live on the service, so the harness only makes an API call, records the action, and loops again.
- `#L39-L50` — The loop re-observes state; a CSS edit analogy shows an agent confused when a change does not appear.
- `#L51-L62` — Without state updates the agent is stuck in "psychosis"; letting it ignore state defeats the whole design.
- `#L63-L72` — A question notes the in-loop goal check; the gap is between the agent's "complete" and the deterministic check.
- `#L73-L84` — Conflicting goal/system prompt and check code is a developer error; an LLM goal checker can shrink that surface.
- `#L85-L89` — Running the demo: start the agent API and checkout service, manage ports, and open the app on 5173.
