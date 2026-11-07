---
source: sources/js-mastery-engineer/20261107/course/052 - Stack Tooling.en.txt
source_type: text
source_lines: 229
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Develop turns the accepted stack spec into a runnable scaffold: because docs and AGENTS.md already occupy the folder, it scaffolds Next.js 16 in a scratch directory and moves the files in.
- The scaffold creates `.env.example` with every future key (Supabase URLs, Anthropic/OpenAI, TMDB, InGest, Resend) and proves itself by building, starting the server, and fetching the homepage for a 200.
- Feature one is accepted after the human verifies manually; audit then runs as a greenfield standards capture, not a codebase scan, recording architecture style (functional), feature-based folder split, linting with Biome, no test suites, and automatic Git handling.
- Audit writes AGENTS.md and a CLAUDE.md pointer covering the tracer-bullet approach, commands, code style, the nine architecture rules, tooling, Git policy, and skills, and it makes the first commit for a clean diff baseline.
- Contradictions (Playwright CLI present in spec but not installed, no test suite) force a sync plus a re-run of architect; the ownership risk of having no tests is closed with scoped query helpers.
- Develop tooling installs Biome plus Lefthook pre-commit checks and mechanically enforces the import restriction; follow-up sync/scope passes reconcile the tier and push the initial repo to GitHub.

# L2 detail

- `#L1-L12` — Develop finds the spec, recognizes a scaffold subtask, and checks scaffolding-tool flags because no Git repo exists yet.
- `#L13-L27` — Scaffolds Next.js 16 in a scratch pad, moves it in, creates the env example, passes the build, and fetches a 200 homepage.
- `#L28-L42` — Updates status, offers verification, and verifies by running pnpm install/dev on localhost:3000.
- `#L43-L52` — Marks verify/test as human-checked, closes feature one, accepts the spec, and confirms four completed steps in scope.
- `#L53-L68` — Runs audit as greenfield standards capture: functional style, feature-based folders, named exports/error handling/a11y conventions, and Biome for lint plus format.
- `#L69-L88` — Sets testing conventions (type check plus manual), no CI yet, automatic Git branch/commit, skill gaps, and the first commit.
- `#L89-L107` — Installs the Resend skill, finishes audit, and shows AGENTS.md/CLAUDE.md contents plus the feature-two progress mark.
- `#L108-L131` — Resolves two contradictions (Playwright CLI, no test suite) by re-running architect to make the decision explicit.
- `#L132-L151` — Closes the ownership risk with scoped query helpers, updates spec and rationale, and skips cross-check for this small change.
- `#L152-L176` — Develops tooling with Lefthook and a Biome rule banning raw DB handles outside the DB layer.
- `#L177-L201` — Runs syncing to reconcile AGENTS.md, scope tier, and follow-ups, and explains why repeated sync is cheaper than late refactors.
- `#L202-L229` — Creates a GitHub repo, pushes main and feature branches, merges the feature branch, and clears for the data model.
