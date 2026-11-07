---
source: sources/js-mastery-engineer/20261107/course/054 - Use Check-Verify command for Data Model.en.txt
source_type: text
source_lines: 77
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The lesson runs `/check verify` on the data model for the first time; the skill reads the feature's verify.md checklist and starts exercising the unticked steps.
- Verification blocks because the repo has no `.env.local`, so migration, seed, and app commands cannot run; the human must supply the Supabase connection variables.
- The agent fills the two public Supabase values it can read through the MCP and guides the human to the dashboard for the two connection strings: transaction pooler on port 6543 for the database URL and direct connection on port 5432 for the direct URL, both needing the database password.
- The lesson warns to put the values in `.env.local`, not `.env.example`, because misidentifying the database URL versus the public Supabase URL is a common mistake.
- After the envs are added, verify switches the direct URL to the IPv4 session pooler because the machine lacks a global IPv6 address, then exercises profiles, onboarding completion, and auth-row deletion.
- The run finishes with 11 acceptance criteria checked, zero unexercised, zero blockers, and the database returned to a clean slate; next is `check review`.

# L2 detail

- `#L1-L16` — Frames the first `check verify`, locates the data model in scope, and shows the skill reading verify.md.
- `#L17-L31` — Verify reports the missing `.env.local` blocking migrate/seed/app start, and the human asks the agent to guide key retrieval.
- `#L32-L59` — The agent writes the public Supabase values, explains the transaction-pooler (6543) and direct (5432) URLs, password entry, and the `.env.local` vs `.env.example` warning.
- `#L60-L77` — Resumes verify, switches to the session pooler for IPv4, exercises the feature, and reports all 11 criteria checked with no blockers.
