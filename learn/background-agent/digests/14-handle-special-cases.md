---
source: sources/background-agent/20261109/course/14-handle-special-cases.txt
source_type: text
source_lines: 133
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Special-case actions — `wait`, `complete`, and `request-for-help` each get their own branch before the normal action path, with placeholder steps where a feature is not built yet.
- Complete flow — writing the report is a step (LLM call), marking the run complete is a step, then the report is returned.
- Durability wins — every `step.run` is a checkpoint that avoids recomputation and, for LLM calls, real money; it is the same business logic made durable.
- Action ID exception — a unique action ID need not be memoized because no logic depends on its value, unlike a random number used in calculations.
- Policy abstraction — actions carry `read` / `write` / `approval` / `help` / `terminal` policies, so the harness branches on a few policies instead of one `if` per action.

# L2 detail

- `#L1-L6` — Introduces reusing the earlier special-case handling for `wait`, `complete`, and `help`, noting the code can't be pasted verbatim.
- `#L7-L15` — Builds the `wait` (and incomplete run) branch: a step that marks the run as waiting with an "unavailable" message.
- `#L16-L22` — For `complete`, calls an LLM-written report inside a `write-report` step because LLM calls are nondeterministic.
- `#L23-L34` — Adds a `complete-run` step to mark the run done, preventing it from solving an already-solved problem, then returns the report.
- `#L35-L41` — Handles `request-for-help` like `wait` with a different "human help unavailable" message.
- `#L42-L50` — Explains that each `step.run` is a checkpoint giving free computation, saving time, space, and real LLM dollars.
- `#L51-L58` — Asks whether the action ID is deterministic and whether it needs a step.
- `#L59-L79` — Argues the action ID needs no step: it only needs to be unique, nothing depends on its value, so random regeneration is harmless.
- `#L80-L91` — Contrasts with a random value used in calculations (which would break determinism); a network-fetched ID might warrant a step for caching, not determinism.
- `#L92-L97` — Introduces the action policy as a gate on whether the AI has authority to perform an action.
- `#L98-L106` — Lists policy mappings: inspect log/changes are `read`, disable feature is `write`, rollback release is `approval`.
- `#L107-L113` — Defines how the harness interprets policies: read allowed, write needs approval, approval requires approval, help/terminal map to actions.
- `#L114-L120` — Explains policies let the harness handle a few categories instead of 30 per-action `if` statements.
- `#L121-L128` — Writes an approval-policy branch as a placeholder to be filled when human approval is implemented.
- `#L129-L133` — Leaves `read` as the fallback executed by default, with an option to be explicit.
