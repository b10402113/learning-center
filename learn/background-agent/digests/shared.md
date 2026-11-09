---
source: sources/background-agent/20261109/supplement/shared
source_type: codebase
source_lines: 13
language: ts
file_count: 1
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- `shared/types.ts` — Defines the shared vocabulary for the durable background agent: a fixed `ACTIONS` tuple of seven operational actions (inspect logs, inspect changes, disable feature, rollback release, request help, complete, wait), its derived `ActionName` union, a free-form `WorldState` record, and a `GoalCondition` that expresses a single path/equals predicate (or `null` for "no goal"). This is the contract every other module types against.

# L2 detail

- `#L1-L13` — `shared/types.ts` — Purpose is a minimal, dependency-free type contract. Key exports: `ACTIONS` (`as const` tuple of 7 action strings), `ActionName` (`typeof ACTIONS[number]`, so adding an action widens the type automatically), `WorldState` (`Record<string, unknown>`, the agent's viewed environment), and `GoalCondition` (`{ path, equals } | null`, a flat single-condition goal used to decide when the loop is done). Learner-relevant concept: the action set is deliberately closed and inspected as data, and the goal is intentionally shallow — the agent's decision surface lives in these types rather than in free-form prompt text.
