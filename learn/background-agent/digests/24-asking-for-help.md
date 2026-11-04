---
source: sources/background-agent/20261105/24-asking-for-help.vtt
source_type: text
source_lines: 842
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L217-L504
  - web.md#L1-L713
---

# L1 overview

- Agent-initiated questions: `requestForHelp` is pulled out from under the `wait` / "agent thinks it's done" ternary and given its own policy handle, so the agent can actually ask instead of announcing that it wants to.
- One resume event for both approval and help: `requestForHelp` reuses the same resume mechanism, and when the policy is help the loop simply `continue`s back to the top so the agent re-observes with the answer now in view.
- How an unanswered question behaves: the run parks in the paused / "needs help" status and stays there until a human answers from the inbox; answers are written to the database outside the agent, so nothing happens until the agent re-reads state — and the `getState` function already returns the answers to the questions it asked.
- Escalation / handoff to a human: the paused status plus the inbox question ("can you investigate whether the payment gateway is healthy and let us know") *is* the handoff surface — the human's answer is the input, and the health event arriving is what closes the loop.
- Evaluating by trajectory, not report: the run "completed" quickly, so the instructor had to check whether it completed because it read the human's answer and connected it to the recovery event, or because it just saw an event — the interesting outcome was the former.
- Authority boundary: it also sent a recovery event that was meant to be suppressed, so the completion was only legitimate because the observed state genuinely flipped to healthy and could be verified — right outcome, partially unintended path.
- Implementation discipline: `continue` (force a re-render) instead of branching an extra `observe` deeper inline — the React re-render analogy, keep all logic top-down in one stateless cycle.

# L2 detail

- `#L1-L206` — Opening aside before the drill: why read research papers from the big labs, how to replicate their experiments, and how that knowledge makes you a better prompt/architecture writer — explicitly flagged as recommended reading, not code.
- `#L207-L341` — Locates the `wait` branch in the durable loop, deletes the `action === "requestForHelp"` ternary that had been nested under `wait` and the "agent thinks it's done" fallback, and keeps the `wait` decision plus its reason.
- `#L342-L412` — Widens the approval policy handler to `policy === "approval" || policy === "help"`, adds the distinguishing `if (policy === "help")` case, and puts the question into `decision detail` as the input instead of a proposal.
- `#L413-L511` — Before writing a fresh state observation, `if (policy === "help")` calls `continue` to jump to the top of the loop, forcing the agent to think again now that the answer to its question exists and is returned by the state read.
- `#L512-L650` — Why that shape: every `continue` means "I changed something, go see it" — the same resume event covers help and approval, and forcing a re-render beats branching a second nested `observe` (React analogy), because tracking two observe points becomes unmanageable.
- `#L651-L712` — Hunt for a scenario that forces the help path: no notes written on which fault triggers it, then settles on `--fault dependency` without recovery, on the theory that the agent cannot know what to do and will select `requestForHelp`.
- `#L713-L765` — The run: events arrive, state observed, loop iterates, `requestForHelp` selected, run shows paused / needs help, and the inbox receives the question about investigating the payment gateway — plus an unwanted recovery event it also sent.
- `#L766-L812` — Answering from the operator inbox and tracing the resume: second-guessing whether it completed off the event or off the answer, then confirming it read the human's answer, attached it to the pending recovery event, and connected the dots.
- `#L813-L842` — Debrief: the instructor is impressed it verified rather than assumed — because the recovery event did land, the observed state flipped to healthy and the completion claim survived verification, closing the drill on the distinction between outcome and trajectory.
