---
source: reel-experiment
source_type: codebase
source_lines: 9230
language: typescript
file_count: 8
part: 5
status: absorbed
absorbed_at: 2026-10-14
created: 2026-10-14
updated: 2026-10-14
---

# Digest — reel-experiment (part 5) — reel-agentic_engineering: schema, ADRs & workflow skills

## Overview (L1)
- This is the "agentic-engineering" build of Reel (chapter 7 A/B experiment, also the chapter-13 greenfield build): a login-walled, recommendation-first movie app where users import Letterboxd/IMDb CSV history or onboard to get a taste vector, then receive a Claude-reasoned feed and natural-language vibe search. It sits on Supabase Postgres + pgvector, Next.js 16 App Router, Supabase Auth/RLS, Anthropic (Haiku parse / Sonnet reason), OpenAI embeddings (`text-embedding-3-small`, 1536-dim), and TMDB as the catalog of record.
- The migration chain (`supabase/migrations/`) runs init schema (7 tables + RLS + triggers) → catalog metadata columns (ADR 0003) → OAuth handle copy (ADR 0005) → taste vectors + HNSW index (ADR 0006) → recommendations + `match_feed_candidates`/`replace_recommendations` (ADR 0007) → `match_vibe_candidates` (ADR 0009). `supabase/config.toml` is the local Supabase project config (`project_id = "movies"`).
- The ADR trail `docs/adr/0001..0010` records each workflow-first decision (stack, data model, catalog validation, design system, auth, CSV import/taste profile, feed, onboarding, vibe search, secondary rows), each with a `verify.md` beside it; `docs/hardening/` and `docs/roadmap/roadmap.md` carry the hardening pass and the feature plan. The in-repo `.claude/skills/` (12 skills: architect, audit, debug, develop, document, harden, review, roadmap, status, sync, test, verify) are the spec-driven workflow that drove the build.

## Structure (L2)

### supabase/migrations/20260704173914_init_schema.sql
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/supabase/migrations/20260704173914_init_schema.sql]]`
- Purpose: Reel core data model (ADR 0002). Seven tables plus RLS, the profile auto-create trigger, and `updated_at` triggers. Vector columns are deliberately absent (feature 7 adds them).
- Key exports: `set_updated_at()` shared trigger fn; tables `profiles`, `movies` (id = TMDB `bigint` natural key), `imports` (`status` check pending/processing/completed/failed; `source` check letterboxd/imdb; `unmatched jsonb`), `ratings` (`source` check letterboxd/imdb/onboarding, `raw_value`/`raw_scale`/`normalized_value` check 0..100, `import_id` FK, unique `(user_id, movie_id)`), `taste_profiles` (PK `user_id`, `genre_affinities` jsonb, `rating_count`, `computed_at`), `watchlist_items` (unique user+movie), `searches` (`parsed_intent`/`results` jsonb); indexes (`idx_ratings_movie_id`, `idx_ratings_import_id`, `idx_imports_user_id`, `idx_searches_user_created`); `handle_new_user()` SECURITY DEFINER trigger `on_auth_user_created`; per-operation RLS policies for every table (movies read-only for authenticated).
- Dependencies: `auth.users`, `gen_random_uuid()`, `pgcrypto`/`now()`; referenced by every later migration and ADR 0002-0010.
- Learner-relevant: the "enforce invariants in the database" stance — enums as `text` + CHECK, TMDB id as natural key, RLS keyed on `(select auth.uid())`, and `SECURITY DEFINER` on the trigger because there is deliberately no user INSERT policy on `profiles`.

### supabase/migrations/20260704181325_add_catalog_columns.sql
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/supabase/migrations/20260704181325_add_catalog_columns.sql]]`
- Purpose: Extends `movies` with the factual TMDB metadata the catalog caches (ADR 0003); no semantic/vibe columns (feature 7's boundary).
- Key exports: adds `imdb_id text`, `directors jsonb`, `top_cast jsonb`, `keywords jsonb`, `vote_average numeric(3,1)`, `vote_count int`, `popularity numeric`, `synced_at timestamptz`; unique partial index `idx_movies_imdb_id` (nullable); `idx_movies_popularity`.
- Dependencies: `public.movies` from init schema.
- Learner-relevant: ADR 0003's `synced_at` (null = not yet fully cached) is the self-healing cache flag; `imdb_id` unique-when-present drives exact IMDb-export resolution.

### supabase/migrations/20260705062903_update_handle_new_user_from_oauth.sql
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/supabase/migrations/20260705062903_update_handle_new_user_from_oauth.sql]]`
- Purpose: Replaces `handle_new_user` so a new profile copies the Google identity (ADR 0005).
- Key exports: `create or replace function public.handle_new_user()` — inserts `(id, display_name, avatar_url)` from `raw_user_meta_data ->> 'full_name'|'name'` and `'avatar_url'|'picture'`; still SECURITY DEFINER, `set search_path = ''`; trigger binding unchanged.
- Dependencies: `auth.users.raw_user_meta_data`; ADR 0005.
- Learner-relevant: profile population is atomic and tamper-resistant (server-side trigger) instead of a fragile client write after sign-in.

### supabase/migrations/20260705120000_add_taste_vectors.sql
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/supabase/migrations/20260705120000_add_taste_vectors.sql]]`
- Purpose: Adds the two pgvector columns ADR 0002 deferred (ADR 0006) plus the HNSW index the feed queries.
- Key exports: `create extension if not exists vector`; `movies.embedding vector(1536)` nullable; `taste_profiles.vector vector(1536)` nullable; `idx_movies_embedding_hnsw` HNSW `vector_cosine_ops` with `(m = 16, ef_construction = 64)`.
- Dependencies: `pgvector`; ADR 0006; consumed by ADR 0007 feed and ADR 0009 vibe search.
- Learner-relevant: embeddings from OpenAI `text-embedding-3-small` (1536 dims) stored L2-normalized so cosine distance and inner product agree; 1536 fits pgvector's 2000-dim HNSW limit; taste vector gets no ANN index (read by PK, never similarity-searched).

### supabase/migrations/20260705130000_add_recommendations.sql
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/supabase/migrations/20260705130000_add_recommendations.sql]]`
- Purpose: The cached feed (ADR 0007): one row per (user, movie) pick.
- Key exports: `recommendations` (id, user_id FK cascade, movie_id FK, `rank`, `score numeric`, `reason text`, `generated_at`, unique `(user_id, movie_id)`); `idx_recommendations_user_rank`; owner-only RLS; `match_feed_candidates(taste_vector, pool_size)` (sql, stable, `security invoker`, `set search_path=''`, cosine via `operator(public.<=>)`, non-null embedding, `not exists` anti-join on `ratings`, order by distance `limit pool_size`); `replace_recommendations(rows jsonb)` (plpgsql, security invoker, raises if unauthenticated, delete-then-insert in one transaction).
- Dependencies: `movies.embedding`, `taste_profiles.vector`, `ratings`; ADR 0006/0007.
- Learner-relevant: selection is deterministic SQL over real rows (no hallucination risk in picks); `security invoker` keeps RLS applied to the caller's ratings anti-join (never security definer); atomic replace means a failed regeneration never leaves a half-built feed.

### supabase/migrations/20260705140000_add_vibe_search.sql
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/supabase/migrations/20260705140000_add_vibe_search.sql]]`
- Purpose: Ranks the catalog by cosine similarity to an embedded parsed vibe, returning both query and taste distances so the caller blends them (ADR 0009). No new table — reuses `movies.embedding` + HNSW, logs to `searches`.
- Key exports: `match_vibe_candidates(query_vector, taste_vector, pool_size, min_year, max_year, max_runtime)` (sql, stable, `security invoker`, `set search_path=''`, `operator(public.<=>)`, returns `query_distance` + nullable `taste_distance`, year/runtime SQL filters).
- Dependencies: `movies.embedding`; ADR 0006/0009.
- Learner-relevant: the pgvector operator is written `operator(public.<=>)` so it resolves under the locked empty `search_path` — the lesson carried from ADR 0007; taste term is null when the user has no vector (feature works pre-profile).

### supabase/config.toml
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/supabase/config.toml]]`
- Purpose: Local Supabase CLI project config.
- Key exports: `project_id = "movies"`; `[api]` schemas `public`/`graphql_public`, `extra_search_path` includes `extensions`, `max_rows = 1000`; `[db] major_version = 17`, migrations enabled, seed `./seed.sql`; `[auth] site_url http://127.0.0.1:3000`, Google noted among providers, `[auth.external.apple]` block (disabled), rate limits; storage, realtime, edge runtime, analytics enabled; `[experimental.pgdelta] enabled = true`.
- Dependencies: Supabase CLI conventions.
- Learner-relevant: `extra_search_path = ["public", "extensions"]` is why migrations qualify types (`operator(public.<=>)`) and lock `search_path` explicitly.

### scripts/seed-movies.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/scripts/seed-movies.ts]]`
- Purpose: Re-runnable, idempotent catalog seed from TMDB popular + top-rated + trending, then embeds the newly-cached movies (ADR 0003/0006).
- Key exports: `main()`, `collectIds()`; imports `resolveByTmdbId` (catalog), `embedMissingByIds` (embeddings), `listPopular`/`listTopRated`/`listTrending` (tmdb client); `PAGES = process.env.SEED_PAGES ?? 5`; embed batches of 200.
- Dependencies: `src/lib/catalog/resolver`, `src/lib/embeddings`, `src/lib/tmdb/client`; run via `npm run seed:movies` (`tsx --env-file=.env.local`).
- Learner-relevant: idempotency via upsert-on-TMDB-id + `embedMissingByIds` skips already-embedded rows, so re-running never re-spends; the seed is the "instant sensible catalog on day 1" half of ADR 0003's hybrid population.

### scripts/backfill-embeddings.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/scripts/backfill-embeddings.ts]]`
- Purpose: One-time, re-runnable backfill embedding movies that have no vector (seeded before feature 7, or left null by an empty document/transient failure) (ADR 0006).
- Key exports: `main()`; imports `embedMissingByIds`, `getServiceClient`; `PAGE = 200`; pages `movies` where `embedding is null` ordered by id, advancing `offset` by the skipped count so it terminates.
- Dependencies: `src/lib/embeddings`, `src/lib/supabase/service`; run via `npm run backfill:embeddings`.
- Learner-relevant: the offset-advance-by-skipped trick avoids looping forever on documents that can never be embedded; movie/embedding writes go through the service client (system path), never a user path.

### docs/adr/0001-stack-and-architecture.md
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/docs/adr/0001-stack-and-architecture.md]]`
- Purpose: The stack decision (Status: Accepted) — one full-stack Next.js (App Router) TypeScript app on Vercel, Supabase Postgres + pgvector + Auth + RLS, Anthropic Claude, TMDB; Node serverless runtime; synchronous CSV import for the MVP.
- Key exports: proposed stack table (Language/Framework/Architecture/DB/Vector search/Auth/Data access/AI/Embeddings deferred/Movie data/Hosting/Server runtime/Observability); two RECOMMEND picks (Node serverless not Edge; synchronous in-request CSV import with the ~10,000-row revisit threshold); consequences naming the Supabase BaaS coupling, the service-role-never-on-user-data rule, the pooler requirement, and TMDB attribution.
- Dependencies: `docs/roadmap/roadmap.md`; seeds ADR 0002-0010.
- Learner-relevant: the "small team, few moving parts" reasoning, and the load-bearing rule that RLS only protects data when server code uses a user-scoped Supabase client (service key bypasses RLS).

### docs/adr/0002-data-model/0002-data-model.md (+ verify.md)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/docs/adr/0002-data-model/0002-data-model.md]]`
- Purpose: The seven-table normalized schema, RLS on every user-owned table, deferred vector columns (Status: Accepted). `verify.md` confirms the live schema.
- Key exports: `verify.md` records 7 tables, RLS on all 7 (23 policies), 4 CHECK constraints, 2 unique constraints, 9 FKs, 5 triggers, and no vector columns yet; behavioral steps deferred to later features.
- Dependencies: ADR 0001; the init-schema migration.
- Learner-relevant: RECOMMEND picks — text+CHECK enums (easier to evolve than native ENUM), TMDB id as natural PK, `handle_new_user` trigger with SECURITY DEFINER, trigger-maintained `updated_at`; the explicit "defer the vector columns safely (additive, nullable)" argument.

### docs/adr/0003-movie-catalog-validation/0003-movie-catalog-validation.md (+ verify.md)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/docs/adr/0003-movie-catalog-validation/0003-movie-catalog-validation.md]]`
- Purpose: How real movies enter `movies` and how the app guarantees no invented title (Status: Accepted). Hybrid population (re-runnable seed + cache-through) + constrained generation + validation backstop.
- Key exports: RECOMMEND picks (direct fetch no SDK; v4 bearer `TMDB_READ_TOKEN`; in-process token-bucket limiter + 429/Retry-After backoff; `src/lib/tmdb` vs `src/lib/catalog` split; `tsx` seed; normalized title+year match rule; DB-filter candidate placeholder; full-fetch-and-upsert on first reference; service client + `SUPABASE_SECRET_KEY`); API table (`getDetails`, `searchByTitleYear`, `findByImdbId`, `list*`, `resolveByTmdbId/ImdbId/TitleYear`, `validateMovieIds`, `getCandidates`, `resolveMany`, `seedMovies`); `verify.md` confirms resolve/validate/seed live and `resolveMany` (AC-9) exercised when import lands.
- Dependencies: ADR 0001/0002; consumed by ADR 0006/0007/0009/0010.
- Learner-relevant: constrained generation makes "no fake titles" structural (AI picks only from real rows, plus an id-existence backstop); the resolver fails closed to `no-match`; the secret key is legitimate here only because `movies` is a shared system-owned table (never copy onto user data).

### docs/adr/0004-design-system-ui-foundation/0004-design-system-ui-foundation.md (+ verify.md)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/docs/adr/0004-design-system-ui-foundation/0004-design-system-ui-foundation.md]]`
- Purpose: The cinematic-editorial dark design system before any screen is built (Status: Accepted) — Tailwind v4 (CSS-first `@theme`) + shadcn-style copy-in Radix primitives, dark-first, WCAG AA hard requirement.
- Key exports: RECOMMEND picks (Fraunces + Inter via `next/font/google`; deep near-black palette with marquee-gold accent; 4px spacing + role type scale + radius + dark-tuned elevation; `motion` from `motion/react`; copy-in primitives; file layout `design.md` at root, primitives `src/components/ui`, products `src/components`; designed poster fallback; Tailwind v4 setup to doc-check at build); full token tables (colors, type, spacing, radius, elevation, motion); component inventory; Server vs Client Component boundary rules; accessibility; `verify.md` confirms build/biome/design.md and lists manual keyboard/SR/reduced-motion passes.
- Dependencies: ADR 0003 (`posterUrl`, `attribution.ts`).
- Learner-relevant: "design one theme well, shape tokens so light can be added later"; the AppShell stays server-rendered with small client leaves; the token discipline (no raw hex/px).

### docs/adr/0005-accounts-auth/0005-accounts-auth.md (+ verify.md)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/docs/adr/0005-accounts-auth/0005-accounts-auth.md]]`
- Purpose: Google-only sign-in on Supabase Auth with `@supabase/ssr` cookie sessions, an adaptive `/`, and the three user-scoped clients every later feature reuses (Status: Accepted).
- Key exports: three clients (`client.ts` browser, `server.ts` server with try/catch `setAll`, proxy `updateSession` with the same-response cookie contract); PKCE OAuth (`signInWithOAuth` → `/auth/callback` `exchangeCodeForSession`); the `handle_new_user` update (quoted SQL); the hard rule `getUser()` not `getSession()`; the middleware matcher regex and the "matcher is a UX fast-path, not the security boundary" rule; server-action `signOut`; `verify.md` confirms build + 307 protection + migration, manual Google roundtrip pending.
- Dependencies: ADR 0001/0002/0004; **note**: roadmap reports Next 16 renamed middleware to `proxy.ts` (the ADR still says `middleware.ts`).
- Learner-relevant: cookie sessions because the app reads data on the server; `getUser()` validates the token server-side; defense in depth (middleware redirect + per-route `getUser()`).

### docs/adr/0006-csv-import-taste-profile/0006-csv-import-taste-profile.md (+ verify.md)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/docs/adr/0006-csv-import-taste-profile/0006-csv-import-taste-profile.md]]`
- Purpose: Turn a Letterboxd/IMDb export into a taste vector (Status: Accepted) — client-parsed chunks, resumable bounded server actions, a rating-weighted embedding centroid, computed only after all rows succeed.
- Key exports: ten RECOMMEND picks (Papa Parse in browser; fixed linear normalize with raw retained; centroid with the zero-variance fallback; L2-normalized storage; chunk size 100 = the synchronous-to-chunked threshold; HNSW `m=16/ef_construction=64`/`ef_search=40`; official `openai` SDK batched `text-embedding-3-small`; 3-attempt jittered backoff; discriminated-union results; weighted `genre_affinities` cache); `MIN_RATINGS_FOR_PROFILE = 20`; API table (`createImport`, `processImportChunk`, `getImportStatus`, `computeTasteProfile`, `embedMovies`, `backfillEmbeddings`); embed-text doc = overview+keywords+genres+directors+top_cast; `verify.md` lists operator prerequisites (OPENAI_API_KEY, apply migration, backfill) and the UI states.
- Dependencies: ADR 0001/0002/0003; consumed by the feed (0007) and onboarding (0008).
- Learner-relevant: the four items ADR 0001 owed this feature (model, index+tuning, threshold, retry/resume/idempotency); never write a half-built profile; embeddings stay off the shared resolver so a feed cache-through never blocks on OpenAI.

### docs/adr/0007-recommendation-feed-reasons/0007-recommendation-feed-reasons.md (+ verify.md)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/docs/adr/0007-recommendation-feed-reasons/0007-recommendation-feed-reasons.md]]`
- Purpose: The cached, Claude-reasoned feed (Status: In Progress) — one pgvector query, top-10 unseen real movies, one batched Sonnet reason each, atomic replace, regenerate only on profile change or manual refresh.
- Key exports: RECOMMEND picks (batched `claude-sonnet-5` structured JSON with a grounded fallback line; `match_feed_candidates` RPC + popularity near-tie break over a 30-pool; reason prompt = movie metadata + top genres + 3-5 highest-rated titles; transactional `replace_recommendations` + read-time staleness via `computed_at` vs max `generated_at`; auto-refresh at most once per mount, no auto-retry; no `validateMovieIds` needed since selection is deterministic SQL; `score` stored as cosine similarity); `generateFeed`/`getFeed`/`refreshFeed`/`writeReasons` API table; feed freshness state machine; `verify.md` lists prerequisites and cache/regen/fail-closed checks.
- Dependencies: ADR 0006 engine; reuses `recommendation-card`, AppShell, three clients, `groundedReason`; consumed by ADR 0010.
- Learner-relevant: caching a derived value only because recompute = a per-load Sonnet call; no blocking render on the multi-second Claude call; the reason is prompt-grounded (bounded, not guaranteed factual).

### docs/adr/0008-onboarding-genres-swipe.md
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/docs/adr/0008-onboarding-genres-swipe.md]]`
- Purpose: The no-CSV on-ramp (Status: In Progress) — pick genres, swipe real embedded movies, write `source = 'onboarding'` ratings, run the same `computeTasteProfile`. No new table, no migration, no AI.
- Key exports: RECOMMEND picks (dedicated deck query requiring `embedding is not null`, excludes rated ids; like→100/dislike→0 binary mapping; one `completeOnboarding` action; the floor is the finish gate with refill/broadening; hardcoded TMDB genre list; reuse `ratings`/`taste_profiles`/`profiles.onboarding_completed`); API table (`getOnboardingDeck`, `completeOnboarding`, `buildOnboardingDeck`); premise note that the roadmap's "≈15 swipes" is corrected to the 20-rating floor.
- Dependencies: ADR 0002/0003/0005/0006; reuses `SwipeCard`.
- Learner-relevant: onboarding is "a new way to produce ratings for the engine that already exists"; only embedded movies move the vector, so the deck filters on `embedding is not null`; thin catalog shows an honest below-floor state.

### docs/adr/0009-natural-language-vibe-search.md
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/docs/adr/0009-natural-language-vibe-search.md]]`
- Purpose: Vibe search (Status: In Progress) — Haiku parses the query into a vibe description + hard facets, embed it with the catalog's OpenAI model, cosine search blended with taste, Sonnet selects 3-5 and writes reasons, `validateMovieIds` backstops, log to `searches`.
- Key exports: RECOMMEND picks (`parseVibe` `claude-haiku-4-5` structured JSON → `{ vibeText, yearFrom?, yearTo?, maxRuntimeMinutes?, audience? }`; embed with `embedTexts`; new `match_vibe_candidates` RPC; blend `0.7*query + 0.3*taste`, pool 40 → shortlist 15; one Sonnet select+reason call constrained to shortlist ids; backstop validation; log every search); pipeline diagram; API table (`searchVibe`, `parseVibe`, `matchVibeCandidates`, `writeVibePicks`).
- Dependencies: ADR 0003 (`validateMovieIds`), 0006, 0007; reuses `recommendation-card`, `VibeSearchInput`, `searches`.
- Learner-relevant: makes no-fabrication structural the same way as the feed (shortlist is real by construction); personalization degrades cleanly to query-only for users with no profile; one new DB object (the RPC) is the only schema change.

### docs/adr/0010-secondary-recommendation-rows.md
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/docs/adr/0010-secondary-recommendation-rows.md]]`
- Purpose: Themed home rows beyond the feed (Status: In Progress) — one larger `match_feed_candidates` pool sliced into secondary signals, deduped, with deterministic grounded reasons. No table, no migration, no AI cost.
- Key exports: RECOMMEND picks (reuse `match_feed_candidates` pool ~60, slice in app code; three row definitions — "Hidden gems" (popularity ASC), "Crowd-pleasers for you" (popularity DESC), "More <top genre>"; greedy cross-row dedupe; `groundedReason` with per-row lead-in; deterministic render, no cache; no-profile → onboarding/import prompt); `getHomeRows`/`buildRows` API table; `N ≈ 12`, `MIN_ROW ≈ 4`.
- Dependencies: ADR 0007 (`match_feed_candidates`, `groundedReason`, `genre_affinities`, `recommendation-card`); depends on the feature-8 migration being applied.
- Learner-relevant: treats secondary rows as "cheap deterministic slices of the engine, not a second premium surface" — the feed keeps the Claude-reasoned experience; distinctness falls out of slicing what the feed's popularity tiebreak de-emphasizes.

### docs/hardening/2026-07-05-csv-import-taste-profile.md
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/docs/hardening/2026-07-05-csv-import-taste-profile.md]]`
- Purpose: Systems-level hardening pass on the ADR 0006 feature (Analysed by opus; posture "Harden before merge").
- Key exports: one ✅ FIXED (duplicate movie in one chunk fails the whole upsert — now deduped by `movie_id` before upsert, with regression tests in `src/app/import/actions.test.ts`); should-harden items (server trusts client rows with no length/field validation; `imports.unmatched` jsonb re-read/rewrite is O(N²); no OpenAI/Supabase call timeout); watch/accept items (concurrent duplicate embed double-spend, double-fired `runImport` count drift, `error.message` leak, stuck `processing` status, non-transactional upsert+count); "Already covered" (RLS real, idempotent upsert/embed, `chunkIndex === 0` reset, taste vector only in `finalizeImport`).
- Dependencies: `src/app/import/actions.ts`, `src/lib/embeddings/index.ts`; ADR 0006.
- Learner-relevant: a concrete production-failure taxonomy (TOCTOU, quadratic rewrite, missing timeout) with `file:line` locators — the "how does this break in production" pass the workflow runs after tests.

### docs/roadmap/roadmap.md
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/docs/roadmap/roadmap.md]]`
- Purpose: The living, coarse, spec-driven feature roadmap (owned by `/roadmap`), Tracer-Bullet build approach.
- Key exports: At-a-glance table of 13 features (1-5 Foundations done; 6-7 Slice 1 done; 8 feed, 9 onboarding, 10 vibe search, 11 detail page, 12 watchlist, 13 secondary rows in-progress); each feature's intent + Done-when + AC-tagged tasks + pointer line (`ADR n · code in <path>`); Deferred list (in-app learning profile, streaming availability, analytics, error monitoring, public pages, consent); Legend (status lifecycle, weight tags, pointer line).
- Dependencies: all ADRs; `src/` code areas.
- Learner-relevant: the pipeline's source of truth for status; shows the tracer-bullet progression and the `⚠ migration written, apply is an operator step` notes for features 8/10.

### .claude/skills/architect/ (SKILL.md, agent-prompt.md, adr-template.md, questions/*)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/.claude/skills/architect/SKILL.md]]`
- Purpose: The ADR-authoring skill. Runs a gated, acceptance-criteria-first staged design conversation (infer/ask/recommend) and writes a complete-build-spec ADR to `docs/adr/`; owns all ADR files and the feature's `ADR` pointer + derived AC-tagged build tasks.
- Key exports: four modes FEATURE/ARCHITECTURE/ENHANCEMENT/CROSS-CUTTING; feature-linked vs standalone-decision status models; umbrella-directory ADR shape with `research/`; `adr-template.md` (Summary/Context/Requirements/Options/Decision/Rationale/Feature design/Proposed stack/Build plan/Consequences/Follow-up/References + mode-specific sections); fallback question files `questions/{feature,architecture,enhancement,cross-cutting}.md`; `agent-prompt.md` (Staff/Principal persona, build-approach handling, RECOMMEND items).
- Dependencies: `AGENTS.md`, roadmap, community skills; feeds `/develop`.
- Learner-relevant: the spec-driven core — "leaving a gap is the failure mode"; one dimension per question, never bundle; the ADR is the contract `/develop` builds to and `/verify` checks.

### .claude/skills/audit/ (SKILL.md, agent-prompt.md, patterns/*)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/.claude/skills/audit/SKILL.md]]`
- Purpose: The context-bootstrapper — writes/maintains the tool-agnostic `AGENTS.md` files (root + nested) and the thin `CLAUDE.md` pointer; handles greenfield, whole-repo, area, and gap-fill phases.
- Key exports: Phase 0-4 routing; coding-pattern presets `patterns/{clean-architecture,domain-driven,functional,solid-oop}.md` (the four architecture styles with MCQ labels/conventions); root/nested/gap-fill rules; `agent-prompt.md` with stack + build-approach reconciliation from ADRs/roadmap.
- Dependencies: `AGENTS.md`, `CLAUDE.md`, roadmap, architecture ADR.
- Learner-relevant: "AGENTS.md is canonical, CLAUDE.md is a one-line `@AGENTS.md` pointer"; never overwrite curated content; root is short/global, nested only for distinct areas.

### .claude/skills/develop/ (SKILL.md, ui-guide.md, logical-guide.md, checklist.md, templates/*)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/.claude/skills/develop/SKILL.md]]`
- Purpose: The builder — implements an already-decided feature (both UI and logical tracks) from an ADR, gating on `/architect` when a decision is owed.
- Key exports: Step 0 invent-test ADR gate; UI vs logical track routing; `ui-guide.md` (design-system resolution, token/stack/dark-mode detection, Path A image extraction vs Path B template picker, asset/placeholder resolution, 5 phases with WCAG AA); `logical-guide.md` (data layer → logic → interface → integration → superseded-code removal → safety pass; migration must be applied and verified); `checklist.md` (keyboard/focus/semantics/labels/ARIA/contrast/token/responsive/states); `templates/{stripe,supabase,nike,posthog,raycast}.md` (full design-token template files); emits verify steps and writes `verify.md` beside the ADR.
- Dependencies: ADR, `AGENTS.md`, `design.md`, roadmap; feeds `/verify`, `/test`, `/sync`.
- Learner-relevant: the ADR-overrides-AGENTS.md precedence; subagents build one coherent slice; a data-layer task isn't done until the migration is applied and the schema confirmed live.

### .claude/skills/debug/, review/, harden/, document/ (skills + guides + prompts/templates)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/.claude/skills/debug/SKILL.md]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/.claude/skills/review/SKILL.md]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/.claude/skills/harden/SKILL.md]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/.claude/skills/document/SKILL.md]]`
- Purpose: Four post-build quality skills.
- Key exports: **debug** — reproduce→localize→hypothesize(one at a time)→test→fix-at-root→verify/regression, minimal fix not symptom (`SKILL.md` only). **review** — cross-model senior PR review (reviewer must differ from author via `agent-prompt.md` + `review-guide.md` rubric; severity Blocker/Major/Minor/Nit; writes `docs/reviews/`; `TESTS` signal handling). **harden** — systems-level failure-mode analysis (`harden-guide.md` taxonomy: concurrency/scale/resource/network/time/adversarial/data-integrity/observability) writing a ranked `docs/hardening/` checklist; read-only. **document** — PR/changelog/release-note/postmortem from real git history (`agent-prompt.md` + `templates/{pr,changelog,release-note,postmortem}.md`), grounded-only, never leaks secrets.
- Dependencies: git, ADRs, `AGENTS.md`, `test-preferences.json`.
- Learner-relevant: review's "a model reviewing its own output shares its blind spots"; harden's concrete-scenario requirement; document's "the diff is the source of truth".

### .claude/skills/roadmap/, sync/, status/, test/, verify/ (skills + templates/guides)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/.claude/skills/roadmap/SKILL.md]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/.claude/skills/sync/SKILL.md]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/.claude/skills/status/SKILL.md]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/.claude/skills/test/SKILL.md]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/.claude/skills/verify/SKILL.md]]`
- Purpose: The planning/lifecycle skills.
- Key exports: **roadmap** — one command inferred into plan/replan/add; proposes ≥5 paths, build approach (Tracer Bullet/Skateboard/Facade/Journey), foundations-first sequencing, per-feature weight/Needs-ADR; `roadmap-template.md` shapes. **sync** — maintains `AGENTS.md`, creates nested docs for net-new areas, reconciles linked ADR `Status` lines and roadmap sub-tasks from evidence (`agent-prompt.md` is the rulebook). **status** — read-only "you are here" (git state, roadmap progress, ADR statuses, resume points, drift). **test** — writes a suite for uncommitted changes, framework from `test-preferences.json`, traces to ACs (`writing-guide.md`, `agent-prompt.md`). **verify** — runtime acceptance + spec-conformance gate, feature vs refactor (before/after diff) modes, reports `specced-but-missing` vs `specced-but-not-applied`.
- Dependencies: git, roadmap, ADRs, `test-preferences.json`, `docs/reviews`/`docs/hardening`.
- Learner-relevant: the workflow's closed loop — roadmap seeds the WHAT, ADRs design the HOW, develop builds, test/verify/harden/review gate, sync/status keep the durable knowledge honest.

### AGENTS.md, CLAUDE.md, design.md, README.md (top-level docs)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/AGENTS.md]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/CLAUDE.md]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/design.md]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/README.md]]`
- Purpose: The canonical project context and visual source of truth.
- Key exports: **AGENTS.md** — the full stack, commands, Tracer Bullet build approach, rules (functional/immutable style, TS strict, Next.js default structure, RLS-only-with-user-scoped-client, `getUser()` not `getSession()`, install deps just-in-time, TMDB attribution, build to `design.md`), tooling (Biome, no pre-commit, Vitest + typecheck + `/verify`, no CI), context files, the `frontend-design` skill note, and the Next.js "read `node_modules/next/dist/docs/`" notice. **CLAUDE.md** — the `@AGENTS.md` pointer only. **design.md** — the design system (tokens: colors/type/layout/elevation/shapes/motion, component specs, do's/don'ts, responsive). **README.md** — the default `create-next-app` boilerplate (stale).
- Dependencies: the ADRs it summarizes; consumed by every skill.
- Learner-relevant: `AGENTS.md` is the durable, tool-agnostic context every agent reads; `design.md` is why components must use tokens, never raw hex.

### package.json, biome.json, tsconfig.json, vitest.config.ts, vitest.setup.ts, test-preferences.json, skills-lock.json (config)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/package.json]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/biome.json]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/tsconfig.json]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/vitest.config.ts]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/vitest.setup.ts]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/test-preferences.json]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/skills-lock.json]]`
- Purpose: Tooling and dependency configuration.
- Key exports: **package.json** — scripts (`dev`/`build`/`start`/`lint`/`format`/`check`/`seed:movies`/`backfill:embeddings`/`test`/`test:watch`); deps `@anthropic-ai/sdk`, Radix primitives, `@supabase/ssr`+`supabase-js`, `class-variance-authority`, `clsx`, `lucide-react`, `motion`, `next` 16.2.10, `openai`, `papaparse`, React 19, `sonner`, `tailwind-merge`; devDeps `@biomejs/biome`, `tailwindcss` v4, `tsx`, `typescript`, `vitest` 4, `jsdom`. **biome.json** — formatter (2-space, 100 width, double quotes), recommended rules, `globals.css` excluded, organize-imports assist. **tsconfig.json** — strict, `@/*` → `./src/*`. **vitest.config.ts** — jsdom, globals, `src/**/*.test.ts`, `vitest.setup.ts`, `@` alias. **vitest.setup.ts** — dummy env stubs so server modules don't trip startup validation. **test-preferences.json** — vitest + jsdom, co-located `*.test.ts`, npm, no e2e. **skills-lock.json** — the 12 workflow skills pinned to source `JavaScript-Mastery-Pro/pilot` with computed hashes.
- Dependencies: n/a (top-level configs).
- Learner-relevant: the "install just-in-time" + "typecheck + `/verify` is the gate, no CI yet" convention is encoded here; `skills-lock.json` shows the workflow skills are vendored from an upstream (pilot) repo.
