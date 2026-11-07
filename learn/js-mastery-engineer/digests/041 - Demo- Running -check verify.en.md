---
source: sources/js-mastery-engineer/20261107/course/041 - Demo- Running -check verify.en.txt
source_type: text
source_lines: 111
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Demonstrates `check verify`, the alpha-tier skill that opens the real app and tests a feature against its acceptance criteria.
- Shows the check skill has two modes, verify and review, and asks which when run without an argument.
- Explains that check first loads the "contract" — the spec's acceptance criteria and the `verify.md` checklist the develop skill saved.
- Details the four outcome states for each criterion: met, specced but missing, specced but not applied, and blocked.
- Runs it on the data model, where it fails one specced check and one of seven smoke-test assertions, and recommends debug for the two issues.
- Shows the depth of a second run on the core review loop: credential checks, Supabase MCP queries, lint, build, grep, curl requests, cookie manipulation, and SQL.
- Notes verification is only as strong as the access it has: without browser, database, or MCP access, more results come back blocked and proof is not kept as history.
- Reports the core review loop result: 9 of 15 behaviors met, one confirmed bug, three blocked for lack of a browser tool, one not run needing a Vercel deploy.

# L2 detail

- `#L1-L22` — Introduces the module, notes features in progress, and shows the check skill offering verify, review, or both.
- `#L23-L44` — Check loads the acceptance-criteria contract from the spec's verify.md and enumerates the four result states.
- `#L45-L69` — Data model run fails one check and one smoke assertion, evidence of the work done, and the pass rule (all criteria met).
- `#L70-L99` — Core review loop run uses Supabase MCP, lint, build, grep, curl, cookie mocking, and SQL; explains access limits and that prototype has no scope box.
- `#L100-L111` — Core review loop report: 9/15 met, one bug (HTTP localhost), three blocked, one not run requiring deploy.
