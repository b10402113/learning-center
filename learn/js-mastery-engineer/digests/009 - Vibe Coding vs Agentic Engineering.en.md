---
source: sources/js-mastery-engineer/20261107/course/009 - Vibe Coding vs Agentic Engineering.en.txt
source_type: text
source_lines: 49
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Contrasts two developers given the same Stripe checkout task to show the difference between vibe coding and agentic engineering.
- Developer A prompts once; the agent scaffolds a payment intent, API route, and webhook in minutes, producing 240 lines the developer cannot fully read but pushes anyway.
- A production webhook signature error exposes a silently missing raw-body parser, and the developer must debug unfamiliar code in a fresh session with no context.
- Developer B first inspects existing auth middleware, API conventions, Stripe keys, and SDK version, updates the agent's MD, then scopes the task to one endpoint.
- Developer B reviews the 60-line output, catches a missing auth guard, tests, commits, and then scopes the next step; the result is clean and reviewable.
- Concludes the difference is who is in control, not skill or model, and that AI exposed a gap that typing speed previously hid.
- Notes the gap compounds as sessions run without direction and that vibe coding is the default when no system exists; the course supplies that system.

# L2 detail

- `#L1-L11` — Developer A: one prompt, fast unreviewed output, and a production break.
- `#L12-L27` — Developer B: context gathering, scoped task, review, fix, test, and next scoped step.
- `#L28-L37` — The real variable is control; AI exposed rather than created the gap.
- `#L38-L49` — Compounding drift, vibe coding as the no-system default, and the module handoff.
