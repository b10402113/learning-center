---
source: sources/js-mastery-engineer/20261107/supplement/011 - Vibe Coding vs Agentic Engineering pdf.txt
source_type: text
source_lines: 72
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Two developers get the same task: add a Stripe checkout feature.
- Developer A gives one sentence and no context; Developer B checks auth middleware, API conventions, and env keys first.
- A's scope is "checkout feature" covering three things; B scopes to one payment-intent endpoint and records SDK version, route pattern, and raw-body webhook needs in CLAUDE.md.
- A produces 240 lines across three files in eight minutes but cannot read the diff and pushes it; B produces 60 lines in one file and catches a missing auth guard.
- A ships a signature-verification error to production; B ships a working endpoint with decisions on record.
- The breaking decision was Stripe's raw request body requirement, made silently by A's agent in a file nobody read.
- The bug was not a knowledge gap: the agent knew how webhooks work but was never asked and nobody checked.
- B was four minutes slower at the start and two hours faster overall; the same bug returns in Module 6 where the workflow refuses to create it.

# L2 detail

- `#L1-L9` — The shared task and the two-developer setup.
- `#L10-L25` — Context given: A gives nothing while B checks auth, API conventions, env keys and updates CLAUDE.md.
- `#L26-L37` — Scope: A's three-part checkout feature versus B's single payment-intent endpoint.
- `#L38-L49` — Output: A's 240 lines in eight minutes versus B's 60 lines in one file.
- `#L50-L58` — Review and result: A pushes an unread diff and hits a production error; B catches a missing auth guard.
- `#L59-L64` — The silent architectural decision about Stripe raw-body parsing that broke A's build.
- `#L65-L72` — Insight: four minutes slower at the start, two hours faster overall, and the Module 6 callback.
