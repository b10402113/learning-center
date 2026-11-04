---
source: sources/background-agent/20261105/shared
source_type: codebase
source_lines: 13
language: typescript
file_count: 1
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- shared/types.ts — The workshop's only shared vocabulary module: the list of action names an agent may choose, plus two deliberately loose type aliases. No runtime logic, no schemas, no Inngest or event types — it is imported by the agent harness, the server, and the web app purely for the `ActionName` union.

# L2 detail

- `#L1-L13` — shared/types.ts — To be honest about what is here: it defines exactly three things and nothing more. `ACTIONS` (L1-L9) is an `as const` tuple of seven action names — `inspect_logs`, `inspect_changes`, `disable_feature`, `rollback_release`, `request_help`, `complete`, `wait`; note the first four match the names `POST /operations` accepts in service/checkout.ts, while `request_help`, `complete` and `wait` are harness-only decisions that no checkout endpoint implements (the asymmetry is the teaching point: the model proposes, the harness decides what becomes an effect). `ActionName` (L10) is the union derived from that tuple via `(typeof ACTIONS)[number]`. The remaining two are untyped escape hatches, not contracts: `WorldState = Record<string, unknown>` (L12) and `GoalCondition = { path: string; equals: string | number | boolean } | null` (L13). There are no zod schemas, no response types for the checkout service, no Inngest step or event types, and no guarantee that world state or goal conditions actually look like this — learners should not expect type safety from this file.
