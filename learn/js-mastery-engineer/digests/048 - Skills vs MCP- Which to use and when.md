---
source: sources/js-mastery-engineer/20261107/supplement/048 - Skills vs MCP- Which to use and when.txt
source_type: text
source_lines: 57
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Skills carry a tool's real, current conventions so the agent stops guessing from outdated training data; Supabase is the example, covering its auth setup, row-level security, current API and recommended patterns.
- The same applies to Next.js, Stripe and Prisma skills.
- MCPs are also tool-specific but do the other half: a Supabase MCP connects the agent to your real project — real tables, data and queries — instead of assumptions.
- For one tool you often want both: the skill knows how to write correct code, the MCP reaches into the live instance.
- The workflow finds the relevant skills and MCPs for your actual stack automatically instead of you hunting for them.
- It asks before installing, and account connections such as signing into Supabase remain yours to approve.
- The pattern: the system does the tedious part, you make the calls.

# L2 detail

- `#L1-L4` — intro: skills and MCPs made practical through specific tools
- `#L5-L22` — skills carry a tool's real conventions (Supabase, Next.js, Stripe, Prisma)
- `#L23-L31` — MCPs give live access to the real instance of the same tool
- `#L32-L46` — the workflow finds skills and MCPs, asks approval, and leaves account sign-ins to you
- `#L47-L57` — summary of the split and transition to the side-by-side build
