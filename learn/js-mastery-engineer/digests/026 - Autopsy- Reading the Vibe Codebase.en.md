---
source: sources/js-mastery-engineer/20261107/course/026 - Autopsy- Reading the Vibe Codebase.en.txt
source_type: text
source_lines: 71
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Reads the vibe codebase like a senior reviewer and locates four "killers" from the previous lesson.
- Killer 1: `lib/engine.ts` uses Claude Opus 4.8 (line 16), generates feed candidates with 16,000 max tokens and adaptive thinking, and is called from the feed page's `useEffect` on mount with no cache anywhere, so the most expensive operation runs on every page view at about 35 cents each.
- Killer 2: `tmdb.ts` `validateCandidates` maps about 24 candidates through `Promise.all` with no rate limiter, no backoff, and no retries, and its catch block returns `null`, so rejected validations silently vanish; the API key is passed as a query-string parameter and leaks into logs and proxies.
- Killer 3: the import `route.ts` deletes all previous ratings then loops over 500 inserts with nothing wrapping deletes and inserts, so a mid-way failure has no rollback.
- Killer 4: nothing — there are no tests anywhere and no migrations folder, just 85 lines of raw SQL schema for code full of edge cases (CSV parsing, fuzzy title matching).
- Argues the code is fine line by line but the failures are architectural: where expensive calls sit, behavior under concurrency, mid-failure handling, and scale at 400 versus 40 ratings.
- Conclusion: vibe coding doesn't produce bad lines, it produces undecided architecture; previews rebuilding the same app with those four decisions made on purpose.

# L2 detail

- `#L1-L7` — Frames reading the codebase like a reviewer and locates killer 1 in `lib/engine.ts`, describing the candidate-then-TMDB-validation flow.
- `#L8-L27` — Details killer 1: Opus 4.8 at line 16, generation with 16,000 max tokens and adaptive thinking, the feed page's mount `useEffect` at line 34, no cache, so every visit costs about 35 cents.
- `#L28-L39` — Details killer 2: `validateCandidates` uses `Promise.all` over about 24 candidates with no rate limiter, backoff, or retries, catches by returning null so failures vanish, and passes the TMDB API key in the query string.
- `#L40-L51` — Details killer 3: the import route replaces imports wholesale by deleting prior ratings then looping over 500 inserts, with no transaction or rollback if a chunk fails.
- `#L52-L58` — Details killer 4: no tests anywhere and no migrations folder, only 85 lines of raw SQL schema, despite edge-case-heavy parsing and fuzzy matching code.
- `#L59-L69` — Draws the lesson that individual lines are clean but failures are architectural, and concludes vibe coding produces undecided architecture rather than bad lines.
- `#L70-L71` — Previews the same app where all four decisions were made on purpose before code.
