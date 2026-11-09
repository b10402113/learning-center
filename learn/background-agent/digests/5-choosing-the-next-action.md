---
source: sources/background-agent/20261109/course/5-choosing-the-next-action.txt
source_type: text
source_lines: 161
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Choosing the next action — when the goal is unmet, the harness asks an LLM for one decision, passing only the goal and current state.
- The LLM is the least important part — no message history, no chat loop; the harness owns everything else and the call is a stateless one-off.
- Structured outputs — `generateText` returns schema-backed JSON (action, reason, detail), so no manual validation is needed.
- Housekeeping and audit — iteration counts and every decision are persisted so a background run can be explained after the fact.
- LLM as a reasoning function — deterministic code handles checks and state; the model is invoked only where reasoning is required.
- State is the hard part — describing "what good looks like" differs per harness (JSON, screenshots, coordinates, game server data).
- Jamba discussion — a smaller/faster model can pick from a finite action set, but cannot invent dynamic arguments and is not a drop-in replacement.

# L2 detail

- `#L1-L8` — After a failed goal check, the harness calls the LLM to choose the next action given the goal and state.
- `#L9-L24` — The LLM is the least important part: no messages, no multi-turn chat, each call is stateless; harness work dominates.
- `#L25-L40` — `choose action` is a single `generateText` call using structured outputs; the schema enforces action, reason, and detail.
- `#L41-L48` — The prompt supplies system role, goal, and observed state; the result is a JSON decision object.
- `#L49-L54` — Housekeeping: increment the iteration count and record the decision in the database.
- `#L55-L62` — Background agents lack chat history, so decisions and approvals must be stored to reconstruct how a run got somewhere.
- `#L63-L72` — The harness is mostly housekeeping and guardrails; the LLM is best treated as a reasoning function among deterministic code.
- `#L73-L78` — Letting the AI decide everything is untrustworthy in production; a question asks whether goal checks and action choice are the "thinking" parts.
- `#L79-L92` — Goal satisfaction can be deterministic when state is an object; state shape and "what good looks like" are per-agent business logic.
- `#L93-L102` — Other harnesses observe screenshots, coordinates, or game server data; describing and mutating state may consume most of the effort.
- `#L103-L110` — The state contract (mutable, immutable, append-only) is central; use an LLM for goal checks only when deterministic evaluation is infeasible or costly.
- `#L111-L116` — If an LLM judges goal satisfaction, write evals and spend on a strong model; choose reasoning calls deliberately.
- `#L117-L122` — Recording decisions captures environment, run, cycle, action, and reason; terminal/special actions like "wait" need special handling.
- `#L123-L132` — A "complete" decision can conflict with the deterministic check, revealing gaps or misleading instructions to fix.
- `#L133-L144` — Jamba can fit only when actions are finite and arguments are deterministic or supplied by the harness.
- `#L145-L154` — A cheap model can predict the likely action quickly, but it cannot generate arguments or new tokens for reasoning.
- `#L155-L161` — Adopting Jamba requires an architecture change and evals; it is not a one-line drop-in replacement.
