---
source: sources/background-agent/20261109/course/24-asking-for-help.txt
source_type: text
source_lines: 127
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Actually asking for help — the agent has a `request for help` tool but never uses it, so the harness must give the request its own policy and resume path instead of folding it under wait.
- Reuse the approval policy — one policy now covers both approval and help, distinguished by whether the decision carries inputs, with the question stored as decision detail.
- Force a re-think — on a help policy the loop `continue`s back to the top so the agent re-reads state, where the human's answer already lives, rather than branching into a one-off observation.

# L2 detail

- `#L1-L4` — states the goal: the agent should genuinely ask for help, not just announce that it wants to and then do nothing.
- `#L5-L30` — a long aside urging learners to read lab research papers, describing how partial understanding compounds into implementable ideas and better AI prompting.
- `#L31-L46` — begins the implementation at the wait logic, removing the old `action == request for help` branch since help now needs its own handle.
- `#L47-L60` — extends the approval policy to also cover help, detects which one it is via `inputs`, and stores the question as the decision detail.
- `#L61-L83` — when the policy is help, `continue` returns to the loop top; the answer is already in state because the state function reads answered questions from the database.
- `#L84-L95` — justifies forcing a re-render over branching into a local observation, comparing it to React and warning that ad-hoc state reads become untrackable.
- `#L96-L108` — picks a run condition that should defeat the agent (dependency resolution) so it has to ask for help, and starts the run.
- `#L109-L127` — the run pauses and asks the question, the human answers, and the agent re-reads state, connects the answer to the new healthy event, and finishes.
