---
source: sources/js-mastery-engineer/20261107/supplement/061 - scope- Challenge the Idea Before Any Code pdf.txt
source_type: text
source_lines: 256
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- /scope writes a plan into `docs/scope/` before any code exists; it is deliberately tool-agnostic and names no library, database, host or provider.
- The plan stays higher than a technical spec: what needs building, what foundations come first, what depends on what, and the order the project should grow in.
- The file has two parts, a slim index and the plan itself; the plan puts foundations (stack, standards, data model, design system) above product features, and each feature section carries intent, a "Done when:" line and checkbox steps.
- Decision one is the build approach, chosen from four long-standing engineering ideas: Tracer Bullet (walking skeleton, Alistair Cockburn / The Pragmatic Programmer), Skateboard (MVP, Henrik Kniberg), Facade (interface before backend), and Journey (one complete user path).
- Decision two is the workflow tier — Prototype (/develop only), Alpha (+/check verify), Beta (+/test), GA (+/check review then /document) — and each tier adds to the last.
- The tier also affects design before the build: higher tiers make a feature more likely to need a spec and run a cross-model decision critic; an Assumed spec blocks "done" at every tier.
- There is one project default recorded on the scope header's `Workflow:` line, with per-feature overrides tagged beside a feature heading; no tag means inherit.
- /scope is a recommendation, not a straitjacket: it records what you choose and what you skipped, and /sync keeps the scope reconciled with the repo over time.

# L2 detail

- `#L1-L18` — what /scope writes: a plan in docs/scope/, tool-agnostic, higher than a technical spec, in two parts
- `#L19-L36` — ReelA example plan with stack, standards, data model and design system listed as foundations
- `#L37-L53` — ground-before-house ordering, per-feature sections with Done-when and checkboxes, and use on existing projects
- `#L54-L109` — decision one, the build approach: Tracer Bullet, Skateboard, Facade and Journey, and when to pick each
- `#L110-L185` — decision two, the workflow tier: Prototype, Alpha, Beta and GA, what each adds, and what hurts when it breaks
- `#L186-L215` — the tier also decides design effort, what closes a feature, and that an Assumed spec blocks done
- `#L216-L225` — one project default with per-feature workflow overrides
- `#L226-L243` — it is a recommendation, not a process; the one requirement is writing down load-bearing decisions
- `#L244-L252` — /sync keeps the plan current as features ship
- `#L253-L256` — next: watching /scope run on a real idea
