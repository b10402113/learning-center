---
source: sources/js-mastery-engineer/20261107/course/053 - Data Model.en.txt
source_type: text
source_lines: 381
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Feature three architects the core entities everything stands on: users, movies, ratings, taste profiles, feed picks with reasons, watchlist entries, import runs, model usage, and audit events.
- Architect asks shape questions and settles: design the full target model but land one migration, store taste as rows (one per facet, starting with one average vector) rather than a single column, normalize both rating paths into one score-plus-source shape, and key a profile table to auth.users.
- The first migration stands up all nine tables in one go, with four marked idle until their feature arrives; choices include UUID movie keys plus unique TMDB ID, per-user/movie ratings updated in place, standalone pick rows, skip as a rating state, nullable embeddings plus a partial index, Postgres enums, and a generic audit_events table.
- Deliverables include a seed script with 20 checked-in TMDB IDs, deny-all RLS written in the migration, DrizzleKit-generated committed SQL applied over the direct URL, a typed registry for the scoped query helper, and a cold-start rule that a missing taste vector means onboarding is incomplete.
- A second model cross-checks and finds 10 gaps (three blocking), including unproven account-deletion audit and trigger/security-definer role concerns; all are applied and the spec is accepted.
- Development blocks on live database access, so the lesson walks through authenticating the Supabase MCP, creating a free project, applying the migration, seeding, testing signup triggers, and proving acceptance criteria against the real database.

# L2 detail

- `#L1-L14` — Frames architecting the data model: lists the core entities and the done condition, and notes only the design checkbox is in scope for now.
- `#L15-L43` — Architect pulls the merged PR, reads the work as a feature design on the existing stack, and settles target-model scope, taste-vector storage, rating storage, and the profile table.
- `#L44-L56` — Decides which tables land in the first migration (all of them, to design ahead), then fixes movie identity with a UUID key, unique TMDB ID, and embedding column.
- `#L57-L79` — Settles pick rows, skip states, model quota rows, rating history, feed state on picks, audit events, and introduces the scoped query helper.
- `#L80-L107` — Chooses per-entity schema files, Postgres enums, nullable embedding with a partial index, rating-scale reconciliation, starter-deck flag, and the Supabase region.
- `#L108-L128` — Reviews and confirms the nine-table model, then decides deliverables (seed, deny-all RLS, throwaway route, Zod), migration workflow, typed registry, and cold-start state.
- `#L129-L152` — Adds the auth.users trigger that creates profiles, declines references, writes the spec, and launches the cross-check that finds 10 issues.
- `#L153-L171` — Walks the blocking findings (account-deletion audit row, trigger role/security definer, RLS confusion) and applies all 10 fixes.
- `#L172-L195` — Summarizes the accepted spec (nine tables, scoped helper, taste rows), reviews scope, checks context usage, then clears and pulls before developing.
- `#L196-L233` — Development stops on database access; troubleshoots the Supabase MCP's wrong URL, read-only flag, and approval flow.
- `#L234-L267` — Restarts Claude Code, creates a Supabase project (cost, free organization, database password), and links it.
- `#L268-L289` — Handles an MCP account mismatch, installs Drizzle tooling, nearly finishes the spec, saves verify steps, and commits.
- `#L290-L315` — Reconnects the MCP to the right account, applies the migration in one transaction, and confirms extensions, trigger privilege, and table ownership.
- `#L316-L349` — Seeds the 20-film deck, tests the auth signup trigger, exercises acceptance criteria, fixes an advisor finding, and clears verification data.
- `#L350-L381` — Flags the EU West vs EU Central region mismatch, amends the spec, and hands off to check verify.
