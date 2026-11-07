---
source: sources/js-mastery-engineer/20261107/course/050 - Demo- Your First Change in Legacy Code.en.txt
source_type: text
source_lines: 153
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The first real change in code you did not write uses the same scope → architect → develop order, but every skill now begins by reading what already exists rather than imagining a greenfield.
- Scope reads the audit-produced AGENTS.md, scans the codebase into a feature inventory, identifies the involved parts and verification depth, and plans the return/renewal slice (return only, overdue deferred).
- Architect on a live repo reads how the feature currently works, follows the request through existing files, checks dependents, and then designs the smallest safe fit; here it reframes return-a-book as an enhancement of borrow-a-book, decides admin-only, immediate/atomic, and handles the fact that it cannot be fully atomic (two passes).
- The spec records where the change belongs, what behavior must stay unchanged, which files move, and how the result is proven — deliberately preserving odd legacy conditions, extra queries, and contracts whose purpose is not obvious.
- Develop reads the surrounding code and matches existing patterns (structure, error shape, data access, tests), reuses utilities, stays inside the spec boundary, writes the return-book server action, and wires the admin menu without unrelated cleanup.
- The result touches only four files and adds no migration; the lesson closes with the rule: understand what exists, find the smallest safe place to change, match the project, and prove both what changed and what stayed the same.

# L2 detail

- `#L1-L8` — Frames the lesson: make a first real change in someone else's code without breaking behavior, using the familiar skill order on a non-empty project.
- `#L9-L20` — Scope reads AGENTS.md, maps the repo, and asks which slice to plan; the chosen slice is book return and renewal for students and admins.
- `#L21-L31` — Scope asks scoping questions, returns a feature inventory, notes that small changes can skip scope, and produces one planned feature, 14 existing, two deferred.
- `#L32-L43` — Architect warns that return-flow pieces already exist (return status, admin borrow records, reminder workflow), flags out-of-scope issues, and shows the numbered scope.md feature list.
- `#L44-L56` — Architect reads the current implementation, follows data and dependents, frames the work as an enhancement, and runs the requirement stage (admin-only trigger, atomic effect, overdue irrelevant).
- `#L57-L75` — Covers minimal-change philosophy, data-migration explanation, the two-pass concession because atomicity is impossible, and the draft spec before accepting it.
- `#L76-L95` — Explains the spec's preservation rules for legacy code, the accept/scope-update flow, and the clear-then-develop handoff.
- `#L96-L116` — Develop reads surrounding files and patterns, implements the server action in lib/actions, wires the menu, uses a read-only helper for deeper scans, and stays inside the spec boundary.
- `#L117-L133` — Develop searches references before replacing code, keeps unrelated cleanup out, passes types, fixes pre-existing lint, updates spec/scope, and reports the four-file, migration-free result.
- `#L134-L153` — Recaps the full path, contrasts evidence-based skills with imagination, and states when the full sequence can be shortened.
