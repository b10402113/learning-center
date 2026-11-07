---
source: sources/js-mastery-engineer/20261107/supplement/052 - Autopsy- Reading the Vibe Codebase.txt
source_type: text
source_lines: 37
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The lesson reviews the vibe-coded codebase and finds architectural flaws even where individual lines look fine.
- It examines the matching engine in `lib/engine.ts`, where unverified data must pass validation before display.
- Recommendations are fetched with no caching, forcing expensive calls on every page view.
- `validateCandidates` lacks rate limiting and error handling, risking silent failures when candidates are rejected.
- An API key is exposed through query parameters, a security vulnerability.
- Database operations in `route.ts` handle deletions and insertions manually without rollback, risking data integrity.
- There are no test cases and no migration folder, so code is unvalidated and unstable.
- The takeaway: vibe coding produces undecided architecture, not necessarily bad code; the next lesson shows a version with deliberate decisions.

# L2 detail

- `#L1-L9` — intro: micro-level code looks fine while the architecture is flawed
- `#L10-L30` — the specific issues: validation, missing cache, no rate limiting or error handling, exposed API key, no rollback, no tests or migrations
- `#L31-L37` — the takeaway (undecided architecture) and the next lesson's revised codebase
