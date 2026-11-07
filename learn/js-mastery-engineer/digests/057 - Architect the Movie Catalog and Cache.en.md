---
source: sources/js-mastery-engineer/20261107/course/057 - Architect the Movie Catalog and Cache.en.txt
source_type: text
source_lines: 145
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Feature four designs the movie catalog and cache: the starter deck plus a reusable title-and-year lookup that returns a stored movie row, with TMDB as the source and Postgres as the permanent store rather than an expiring cache.
- A fuzzy match is scored (weighted normalized-title similarity against title and original title, penalized by year distance) with one threshold; matches are accepted or else recorded as unmatched, and stale rows refresh after 30 days.
- Everything that talks to TMDB runs as an InGest background job; reads of stored movies happen in the request, and an inline fetch on a rare cache miss is accepted after the sparring discussion about how often misses actually occur.
- Decisions cover additional TMDB fields (normalized/original title, IMDb ID, popularity, votes, keywords, tagline), poster path plus image config, normalization rules (case, accents, punctuation, leading articles), v4 bearer auth, fetch + Zod, concurrency/429 retries, dedup by upsert, delete-on-404, null embeddings, and reject-no-overview.
- Authorization is signed-in only with verified InGest signatures; per-film failures fail the run while keeping successes; the catalog adds fields to the existing movies table and logs structurally without new tables.
- The spec is written with 16 acceptance criteria traced to build tasks, verify steps are included, cross-check is skipped, and the lesson ends by clearing the session to develop.

# L2 detail

- `#L1-L13` — Frames feature four as a sizable feature that needs architect first, scopes it to the deck plus title/year lookup, and sets the matching rule.
- `#L14-L38` — Debates where TMDB fetches run, uses the sparring option to reason about rare cache misses, chooses job-for-writes/request-for-reads, and sets unmatched-record and staleness policy.
- `#L39-L56` — Adds TMDB fields for matching, vibe search, and presentation; keeps a curated starter deck list; sets v4 bearer auth, fetch + Zod client, and InGest install.
- `#L57-L81` — Covers rate limiting (about 50 req/s, concurrency plus 429 retries), poster path only plus image config, split-by-concern layout, normalization, and match confidence.
- `#L82-L113` — Settles fetch shape (one search plus one detail), 404 deletion, null embeddings, rejecting no-overview films, structured logs, signed-in access, upsert races, per-film failure, and the env variable name.
- `#L114-L145` — Confirms the data model additions, deck trigger, local run, verify inclusion, spec completeness (16 ACs), skips cross-check, and reviews the accepted spec.
