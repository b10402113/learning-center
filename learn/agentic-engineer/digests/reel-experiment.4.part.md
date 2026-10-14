---
source: reel-experiment
source_type: codebase
source_lines: 9230
language: typescript
file_count: 38
part: 4
status: absorbed
absorbed_at: 2026-10-14
created: 2026-10-14
updated: 2026-10-14
---

# Digest — reel-experiment (part 4) — reel-agentic_engineering: domain logic (lib)

## Overview (L1)
- `src/lib/**` is the whole domain layer: the TMDB client + its fixed-window rate limiter, the catalog resolver that caches real movies into the `movies` table, browser-side CSV parsing, OpenAI embeddings + taste-vector math in pgvector, the recommendation feed with reason writing, secondary home rows, natural-language vibe search, onboarding, and the three Supabase clients.
- It encodes the course's just-in-time-dependency decision (each feature installs its own SDK: `@anthropic-ai/sdk` with the AI features, `openai` with the engine, `papaparse` with import, TMDB fetch with the catalog) and its scoped query-helper decision: a single public API per module (`catalog`, `feed`, `search`, `rows`) whose barrels re-export only server pieces while client-safe `types`/`constants` leaves stay importable by the browser.
- The recurring design pattern is fail-closed, no-fabrication: every boundary returns a tagged union (`ResolveResult`, `ParseResult`, `GetFeedResult`, `SearchResult`), ranking is a Postgres RPC over real `movies` rows, and the AI may only return ids from a real shortlist. This is what the vibe build's failures (invented titles, uncached per-load model calls) are structurally prevented from recurring.
- Caching is layered: TMDB responses cached as `movies` rows keyed by TMDB id, embeddings cached on `movies.embedding`, reasons cached in `recommendations`, and a cheap `genre_affinities` cache avoids recomputation.

## Structure (L2)

### env.ts — server environment validation
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/env.ts]]`
- Purpose: validate required server secrets at module import so a missing key fails loudly at startup, not silently at first use.
- Key exports: `serverEnv` (const object).
- Dependencies: none.
- Learner-relevant: `required(name)` throws `Missing required environment variable: <name>`. Reads `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `TMDB_API_READ_ACCESS_TOKEN`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`. Because it reads `process.env[name]` dynamically, Next cannot inline it client-side — the reason every client-safe leaf must avoid importing server modules (the barrel-safety rule `docs/reference` and `feed/AGENTS.md` describe).

### anthropic.ts — shared Anthropic client
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/anthropic.ts]]`
- Purpose: one lazily-constructed server-only `Anthropic` singleton for the reason writer and the vibe parse/select calls.
- Key exports: `getAnthropic()`.
- Dependencies: `@anthropic-ai/sdk`, `@/lib/env`.
- Learner-relevant: models are split by tier per ADR 0001 (Haiku parses, Sonnet writes); sharing one client keeps the key and singleton in one place. Server-only because it reads `serverEnv.anthropicApiKey`.

### supabase/service.ts — service-role client
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/supabase/service.ts]]`
- Purpose: lazy singleton `SupabaseClient` using the Supabase secret key, with `persistSession: false` and `autoRefreshToken: false`.
- Key exports: `getServiceClient()`.
- Dependencies: `@supabase/supabase-js`, `../env`.
- Learner-relevant: **the secret key bypasses RLS**, so this is the deliberate exception for system-owned data only (the shared `movies` catalog). Used by catalog resolver/validation, embeddings, and the onboarding deck; never on a user data path.

### supabase/client.ts — browser user-scoped client
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/supabase/client.ts]]`
- Purpose: `createBrowserClient` for client components, carrying the signed-in session so RLS applies.
- Key exports: `createClient()`.
- Dependencies: `@supabase/ssr`.
- Learner-relevant: publishable key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) is safe in the browser; RLS is the protection. The user-data counterpart to `service.ts`.

### supabase/server.ts — server user-scoped client
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/supabase/server.ts]]`
- Purpose: async `createServerClient` reading the session from `next/headers` cookies for server components, server actions, and route handlers.
- Key exports: `createClient()`.
- Dependencies: `@supabase/ssr`, `next/headers`.
- Learner-relevant: `setAll` is wrapped in try/catch because Server Components cannot set cookies; the proxy (`src/proxy.ts`) persists the refreshed session. This is the client the feed, rows, taste, and search paths use so RLS scopes every query to the caller.

### tmdb/client.ts — TMDB HTTP client
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/tmdb/client.ts]]`
- Purpose: thin fetch wrapper over `https://api.themoviedb.org/3` with rate limiting, 404-as-null, and 429/5xx retry.
- Key exports: `getMovieDetails`, `searchMovies`, `findByImdbId`, `listPopular`, `listTopRated`, `listTrending`.
- Dependencies: `../env`, `./rate-limiter`, `./types`.
- Learner-relevant: `MAX_ATTEMPTS = 4`; bearer token sent as `Authorization` header (never in URL); `append_to_response: "credits,keywords"` fetches cast/crew/keywords in one call; a 404 returns `null` (clean "not found", never an error); 429 honors `retry-after`. Models the "cache-through on a hot render path" caution — details come from here via the resolver.

### tmdb/rate-limiter.ts — fixed-window limiter
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/tmdb/rate-limiter.ts]]`
- Purpose: token-bucket-style fixed window allowing `capacity` acquisitions per `refillMs`.
- Key exports: `createRateLimiter`, `RateLimiter`.
- Dependencies: none.
- Learner-relevant: catalog client instantiates it at `capacity: 40, refillMs: 10_000` (TMDB free tier ≈ 50 req/10s). Documented known limit (ADR 0003): state is per-process, so it does not coordinate across concurrent serverless invocations — the client's 429 backoff is the cross-invocation net until a shared limiter (e.g. Upstash) is added. `timer.unref()` keeps the seed script from hanging.

### tmdb/types.ts — TMDB response shapes
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/tmdb/types.ts]]`
- Purpose: minimal typed shapes for only the fields the catalog caches or matches on.
- Key exports: `TmdbGenre`, `TmdbCastMember`, `TmdbCrewMember`, `TmdbKeyword`, `TmdbMovieDetails`, `TmdbSearchResult`, `TmdbSearchResponse`, `TmdbFindResponse`, `TmdbListResult`, `TmdbListResponse`.
- Dependencies: none.
- Learner-relevant: `TmdbMovieDetails` carries `release_date: "YYYY-MM-DD"`, `imdb_id`, `genres`, `runtime`, `credits { cast, crew }`, `keywords`. Explicitly "not exhaustive" — models the data rather than typing the whole API.

### tmdb/attribution.ts — TMDB obligation constants
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/tmdb/attribution.ts]]`
- Purpose: single source of the required TMDB attribution (notice, logo, link) and image URL helper.
- Key exports: `TMDB_ATTRIBUTION_NOTICE`, `TMDB_HOME_URL`, `TMDB_LOGO_URL`, `TMDB_IMAGE_BASE`, `posterUrl(posterPath, size = "w500")`.
- Dependencies: none.
- Learner-relevant: a legal/compliance requirement (ADR 0001, ADR 0003) centralized so features import it rather than re-typing; `posterUrl` maps `poster_path` to `https://image.tmdb.org/t/p/<size><path>` (sizes w200/w300/w500/original).

### catalog/types.ts — catalog domain types + column list
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/catalog/types.ts]]`
- Purpose: the `movies` row shape, the shared select column string, and the resolve tagged union.
- Key exports: `Person`, `CastMember`, `NamedTag`, `Movie`, `MOVIE_COLUMNS`, `ResolveResult`, `MovieRef`.
- Dependencies: none.
- Learner-relevant: `id` is the **TMDB id used as the natural primary key**; `synced_at` marks a fully cached row. `MOVIE_COLUMNS` keeps every read returning a full `Movie`. `ResolveResult = { status: "matched"; movie } | { status: "no-match" }` — the no-fabrication contract stated as a type. `MovieRef` is the three input kinds (`tmdb`, `imdb`, `title`).

### catalog/mapper.ts — TMDB → movies row
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/catalog/mapper.ts]]`
- Purpose: pure function turning a `TmdbMovieDetails` into a `movies` row ready to upsert.
- Key exports: `mapDetailsToMovie`.
- Dependencies: `../tmdb/types`, `./types`.
- Learner-relevant: `MAX_CAST = 10` caps stored cast; directors filtered by `job === "Director"`; `release_year` derived from the first 4 chars of `release_date`; empty arrays stored as `null`; `synced_at` set to now. Pure and immutable — the side effect (upsert) lives in the resolver.

### catalog/resolver.ts — cache-through resolution
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/catalog/resolver.ts]]`
- Purpose: resolve a movie reference to a real catalog row, caching it on first sight; fail closed to `no-match`.
- Key exports: `resolveByTmdbId`, `resolveByImdbId`, `resolveByTitleYear`, `resolveRef`, `resolveMany`.
- Dependencies: `../supabase/service`, `../tmdb/client`, `../tmdb/types`, `./mapper`, `./types`.
- Learner-relevant: the caching decision — `getCachedById` reads `movies` by `id`; a row with `synced_at` is a cache hit; otherwise `fetchAndCache` upserts on primary key (`onConflict: "id"`), so concurrent cold resolves update one row rather than duplicating. `resolveByTitleYear` `normalizeTitle`s (lowercase, strip leading article, drop punctuation), tries exact title+year, then exact title within ±1 year by popularity, else `no-match` — a stated confidence bar. `resolveMany` bounds concurrency (`concurrency = 5`) with a shared-cursor worker pool. **The resolver never calls OpenAI** (embeddings/AGENTS.md rule): cache-through on a hot render path never blocks on an embedding.

### catalog/validation.ts — the no-hallucination backstop
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/catalog/validation.ts]]`
- Purpose: report which AI-returned ids exist in the catalog and which do not; MVP candidate retrieval.
- Key exports: `validateMovieIds`, `CandidateFilter`, `getCandidates`.
- Dependencies: `../supabase/service`, `./types`.
- Learner-relevant: `validateMovieIds` de-dupes ids and returns `{ existing, missing }` — any `missing` id must not reach the user (used as the vibe-path backstop). `getCandidates` is the pre-embedding MVP retrieval: text `ilike` on title/overview, tag filters applied in memory (over-fetching `limit * 5` when tags are set), ordered by `popularity` desc, nulls last. Its header notes features 7/10 replace it with taste-vector retrieval, but real-rows-only keeps the guarantee regardless.

### catalog/index.ts — catalog public API
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/catalog/index.ts]]`
- Purpose: the barrel features import from (`@/lib/catalog`).
- Key exports: re-exports `resolveByImdbId/resolveByTitleYear/resolveByTmdbId/resolveMany/resolveRef`, the `types`, and `CandidateFilter/getCandidates/validateMovieIds`.
- Dependencies: `./resolver`, `./types`, `./validation`.
- Learner-relevant: deliberately one import surface per module; note `getServiceClient` is never re-exported, so callers get the domain operations, not raw DB access.

### embeddings/index.ts — vectors in pgvector
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/embeddings/index.ts]]`
- Purpose: build movie documents, embed via OpenAI, store/read pgvector values, embed only unembedded movies.
- Key exports: `EMBED_MODEL = "text-embedding-3-small"`, `EMBED_DIMENSIONS = 1536`, `buildMovieDocument`, `l2normalize`, `toVectorLiteral`, `parseVector`, `embedTexts`, `EmbedResult`, `embedMovies`, `embedMissingByIds`.
- Dependencies: `openai`, `@/lib/catalog`, `@/lib/env`, `@/lib/supabase/service`.
- Learner-relevant: server-only. `EMBED_BATCH_SIZE = 96` cuts calls/cost. Every stored vector is **L2-normalized** so cosine distance equals inner product. The pgvector gotcha: **write as a string literal** `[0.1,...]` (`toVectorLiteral`) because supabase-js sends JSON and a JS array fails the `vector` cast; read with `parseVector`. `buildMovieDocument` composes overview + "Genres:" + "Themes:" + "Directed by" + "Starring"; an empty document isn't embedded. `embedMissingByIds` filters `.is("embedding", null)` so re-imports cost nothing (the backfill path). Writes through the service client (movies are system-owned).

### embeddings/index.test.ts — embeddings unit tests
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/embeddings/index.test.ts]]`
- Purpose: Vitest coverage of document building, normalization, vector literal round-trip, and embedding.
- Dependencies: `vitest`, `./index`; mocks the `openai` SDK.
- Learner-relevant: the mock returns a fixed `[3,4,0]` (normalizes to `[0.6,0.8,0]`), and asserts `embedTexts` called with `{ model: "text-embedding-3-small", dimensions: 1536 }`. Confirms pure logic is tested at the boundary (OpenAI mocked), matching the repo's "mock the DB, TMDB, and OpenAI at the boundary" testing stance.

### taste/index.ts — taste-vector computation
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/taste/index.ts]]`
- Purpose: turn a user's ratings into one rating-weighted centroid taste vector plus a genre-affinity cache.
- Key exports: `MIN_RATINGS_FOR_PROFILE = 20`, `computeTasteProfile`.
- Dependencies: `@supabase/supabase-js`, `@/lib/catalog`, `@/lib/embeddings` (`l2normalize`, `parseVector`, `toVectorLiteral`), `@/lib/import/types`.
- Learner-relevant: reads `ratings` joined to `movies(embedding, genres)`, excluding unembedded movies ("not embedded → excluded from matching"). Each rating is **centered on the user's own average**, so liked-above-norm films pull the vector and disliked push it away. Constants `MIN_STDDEV = 1.0`, `MIN_NORM = 1e-6`; a zero-variance fallback returns the plain mean direction. Below 20 matched embedded ratings it writes nothing and returns `below-floor` (routes to onboarding). Writes `taste_profiles` (`vector`, `genre_affinities`, `rating_count`, `computed_at`) via upsert `onConflict: "user_id"` using the **user-scoped client** so RLS runs. `computeGenreAffinities` normalizes liked-movie genre weights to a distribution summing to 1.

### taste/index.test.ts — taste math tests
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/taste/index.test.ts]]`
- Purpose: Vitest coverage of the floor, unembedded exclusion, computed centroid, zero-variance fallback, and read failure.
- Dependencies: `vitest`, `@/lib/embeddings`, `./index`; a fake Supabase client captures upserts.
- Learner-relevant: asserts stored vector is length 4 in test space and `norm ≈ 1`; below-floor writes nothing; the zero-variance case has no NaN and empty `genre_affinities`. The fake client mocks the DB at the boundary.

### import/parse.ts — browser CSV parsing
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/import/parse.ts]]`
- Purpose: parse Letterboxd/IMDb ratings CSVs in the browser (no file ever reaches the server), auto-detecting source from headers.
- Key exports: `IMDB_NON_MOVIE_TYPES`, `detectSource`, `parseRatingsCsv`.
- Dependencies: `papaparse`, `./types`.
- Learner-relevant: `detectSource` keys on `"Letterboxd URI"`/`Name`+`Rating` vs `Const`+`Your Rating`+`Title Type`. Letterboxd rows with an empty `Rating` (watched-but-unrated) are skipped; IMDb TV/episode types are skipped via `IMDB_NON_MOVIE_TYPES`; unmatched rows are `skipped` so nothing is silently lost. `rawValue` keeps the source's own scale; the server normalizes to 0-100 (the client never does that mapping). Never throws — resolves a `ParseResult`. Privacy decision: parsing is client-side, file storage out of MVP scope.

### import/types.ts — import pipeline types
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/import/types.ts]]`
- Purpose: shared types usable by both the client parser and server actions without pulling each other's dependencies.
- Key exports: `ImportSource`, `ParsedRow`, `ParseResult`, `CreateImportResult`, `ImportCounts`, `ChunkResult`, `FinalizeResult`, `UnmatchedRow`, `ImportStatus`.
- Dependencies: none.
- Learner-relevant: `ParsedRow` carries `title`, `year`, `imdbId` (tt id or null), `rawValue`, `ratedAt`. Server results follow the house tagged-union style (`FinalizeResult` = `computed | below-floor | failed`; `ImportStatus` = `pending | processing | completed | failed` with `matched`/`unmatched`/`unmatchedRows`). This is the type leaf that keeps client/server bundles separate.

### import/parse.test.ts — CSV parser tests
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/import/parse.test.ts]]`
- Purpose: Vitest coverage of detection, both export shapes, skips, forced source, and errors.
- Dependencies: `vitest`, `./parse`; builds real `File` objects (jsdom).
- Learner-relevant: verifies raw rating preservation, unrated-row skip with count, IMDb tvSeries skip, forced-source override, and the two error messages. Tests pure parsing with no network.

### feed/types.ts — feed types + tunables (client-safe)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/feed/types.ts]]`
- Purpose: shared feed shapes and constants; type-only `Movie` import so the feed UI can import it.
- Key exports: `FEED_SIZE = 10`, `FEED_POOL_SIZE = 30`, `FeedPick`, `FeedCandidate`, `TasteSummary`, `GetFeedResult`, `RefreshFeedResult`, `GenerateFeedResult`.
- Dependencies: `@/lib/catalog`.
- Learner-relevant: `score` is cosine similarity (`1 - distance`). Tagged unions: `GetFeedResult` = `no-profile | empty | { ready, stale }`, `RefreshFeedResult` = `ready | no-profile | error`, `GenerateFeedResult` = `ok | no-profile | error`. `TasteSummary` is `{ topGenres, topTitles }`. A stated, tunable MVP default pair.

### feed/candidates.ts — feed retrieval + popularity tiebreak
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/feed/candidates.ts]]`
- Purpose: rank the catalog by cosine similarity to the taste vector via the `match_feed_candidates` RPC, then break near-ties by popularity.
- Key exports: `matchFeedCandidates`.
- Dependencies: `@supabase/supabase-js`, `@/lib/catalog`, `./types`.
- Learner-relevant: server-only, runs under the **user-scoped client** (the RPC is `security invoker`, so RLS scopes the rated-movie anti-join to the caller). Passes `taste_vector` and `pool_size`; returns `FEED_SIZE` after sorting by `byDistanceThenPopularity`. `TIE_EPSILON = 0.02` — candidates within that band are ordered by popularity so an obscure near-match doesn't outrank a popular one. Uses the HNSW index (ADR 0006). The RPC returns full `Movie` columns + `distance` (jsonb already parsed).

### feed/reasons.ts — Sonnet reason writing
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/feed/reasons.ts]]`
- Purpose: write one short "why this fits you" line per pick in one batched Claude Sonnet call, grounded in real metadata.
- Key exports: `REASON_MODEL = "claude-sonnet-5"`, `groundedReason`, `writeReasons`.
- Dependencies: `@anthropic-ai/sdk`, `@/lib/catalog`, `@/lib/env`, `./types`.
- Learner-relevant: server-only. Structured output via `output_config: { format: { type: "json_schema", schema: REASON_SCHEMA } }` and `thinking: { type: "disabled" }`; schema requires `{ reasons: [{ movie_id, reason }] }` with `additionalProperties: false`. System prompt steers to fit/tone/theme and "Invent nothing". `groundedReason(movie)` is a deterministic metadata-only fallback used when the model omits a movie or refuses. A transient API error **throws** so `generateFeed` fails closed; a bad/empty body yields an empty map → grounded fallbacks. Models the caching decision: reasons are expensive, written once per regeneration, never per load.

### feed/generate.ts — feed orchestration + staleness
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/feed/generate.ts]]`
- Purpose: run retrieval → reasons → atomic cache replace; report staleness at read time.
- Key exports: `readWatchlistIds`, `isFeedStale`, `generateFeed`, plus re-exported `Movie`.
- Dependencies: `@supabase/supabase-js`, `@/lib/catalog`, `./candidates`, `./reasons`, `./types`.
- Learner-relevant: `SUMMARY_GENRES = 3`, `SUMMARY_TITLES = 5` shape the `TasteSummary` handed to Claude. Reads `taste_profiles.vector`/`genre_affinities`; a null vector returns `no-profile`. Passes the stored pgvector **text literal** straight into the RPC (casts it), no re-normalizing. Empty candidates clears the feed via `replace_recommendations` with `rows: []` and **skips Claude**. The atomic delete-then-insert is one transaction (`replace_recommendations` RPC), reached only once the full set is built, so any failure keeps the old feed (fail closed). `isFeedStale(computedAt, maxGeneratedAt)` compares at read time (nothing stored). Watchlist state attached via `readWatchlistIds`.

### feed/index.ts — feed public API
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/feed/index.ts]]`
- Purpose: server-only barrel for the feed engine.
- Key exports: `matchFeedCandidates`, `generateFeed`, `isFeedStale`, `readWatchlistIds`, `groundedReason`, `writeReasons`, and the feed types/constants.
- Dependencies: `./candidates`, `./generate`, `./reasons`, `./types`.
- Learner-relevant: note it re-exports `./types` here (unlike rows/search barrels which omit their leaf) — still, `feed/AGENTS.md` warns client components to import the leaf `@/lib/feed/types` to avoid dragging Anthropic/OpenAI/service client into the browser bundle.

### rows/types.ts — home-rows types + tunables (client-safe)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/rows/types.ts]]`
- Purpose: types and constants for themed home rows.
- Key exports: `ROW_POOL_SIZE = 60`, `ROW_LENGTH = 12`, `MIN_OPTIONAL_ROW = 4`, `RowPick`, `HomeRow`, `HomeRowsResult`.
- Dependencies: `@/lib/catalog/types` (type-only).
- Learner-relevant: `RowPick.reason` is "a grounded, row-appropriate line (no Claude call on this path)". `HomeRowsResult` = `no-profile | { ready, rows }`. Leaf kept separate from the server barrel for bundle safety.

### rows/index.ts — themed home rows
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/rows/index.ts]]`
- Purpose: one cosine query returns a large pool; slice it into distinct themed rows by a secondary signal, deduped, each pick with a grounded reason.
- Key exports: `getHomeRows`.
- Dependencies: `@supabase/supabase-js`, `@/lib/catalog/types`, `@/lib/feed` (`groundedReason`, `readWatchlistIds`), `./types`.
- Learner-relevant: server-only. **Reuses `match_feed_candidates`** with `ROW_POOL_SIZE` (the "reuse these before adding a new one" rule) — no new RPC. `buildRows` produces `hidden-gems` (lowest popularity — what the feed's tiebreak buries), `crowd-pleasers` (highest popularity), and an optional `more-genre` row (the user's top genre from `genre_affinities`, only when ≥ `MIN_OPTIONAL_ROW`), greedily deduping across rows. **No Claude on this path** — row reasons are deterministic (`hiddenGemReason`, `crowdPleaserReason`, `groundedReason`). Returns `no-profile` when the user has no taste vector.

### search/types.ts — vibe search types + weights (client-safe)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/search/types.ts]]`
- Purpose: shared vibe types and blend weights.
- Key exports: `VIBE_POOL_SIZE = 40`, `VIBE_SHORTLIST_SIZE = 15`, `VIBE_MIN_PICKS = 3`, `VIBE_MAX_PICKS = 5`, `QUERY_WEIGHT = 0.7`, `TASTE_WEIGHT = 0.3`, `VibeIntent`, `VibeCandidate`, `VibePick`, `SearchResult`.
- Dependencies: `@/lib/catalog/types` (type-only).
- Learner-relevant: blend = `QUERY_WEIGHT * queryScore + TASTE_WEIGHT * (tasteScore ?? 0)` (query dominates). `VibeIntent` carries `vibeText` + optional `yearFrom`/`yearTo`/`maxRuntimeMinutes` + `audience: "family" | "any"`. `SearchResult` = `ok | empty | error`. Leaf kept separate from the server barrel.

### search/parse.ts — Haiku vibe parsing
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/search/parse.ts]]`
- Purpose: turn a free-text vibe into a clean description to embed plus optional hard facets.
- Key exports: `PARSE_MODEL = "claude-haiku-4-5"`, `parseVibe`.
- Dependencies: `@anthropic-ai/sdk` (type), `@/lib/anthropic`, `./types`.
- Learner-relevant: the cheap parse tier (ADR 0001 parse/write split). Structured output `INTENT_SCHEMA` with nullable-plus-required fields and `additionalProperties: false`; `audience` enum `["family", "any"]`. System prompt expands vibeText and does not name films. A JSON parse failure falls back to embedding the raw query rather than failing the search.

### search/retrieve.ts — vibe retrieval + blend
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/search/retrieve.ts]]`
- Purpose: call `match_vibe_candidates` (cosine over movie embeddings with the taste distance alongside), blend query and taste relevance, return the shortlist.
- Key exports: `matchVibeCandidates`.
- Dependencies: `@supabase/supabase-js`, `@/lib/catalog/types`, `./types`.
- Learner-relevant: server-only, user-scoped client; passes `query_vector`, `taste_vector` (null when no profile → taste term 0 → query-only ranking), `pool_size`, and `min_year`/`max_year`/`max_runtime` from the intent. Computes `score`, `queryScore`, `tasteScore`, sorts desc, slices `VIBE_SHORTLIST_SIZE`.

### search/select.ts — Sonnet pick selection + reasons
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/search/select.ts]]`
- Purpose: one batched Sonnet call picks 3-5 best fits from the real shortlist and writes a grounded one-line reason each.
- Key exports: `SELECT_MODEL = "claude-sonnet-5"`, `VibePickChoice`, `writeVibePicks`.
- Dependencies: `@anthropic-ai/sdk` (type), `@/lib/anthropic`, `@/lib/catalog/types`, `./types`.
- Learner-relevant: server-only. Prompt states "Only use movie_id values from the provided list. Never invent"; code re-enforces it by keeping only ids in the `allowed` shortlist set and deduping (`seen`), capping at `VIBE_MAX_PICKS`. A family-audience filter line is appended when `intent.audience === "family"`. Structured `PICKS_SCHEMA`, `thinking: disabled`. Refusal or parse failure returns `[]`. The caller runs `validateMovieIds` as the backstop (no-fabrication is structural).

### search/index.ts — vibe search public API
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/search/index.ts]]`
- Purpose: server-only barrel for the search engine; deliberately does NOT re-export `./types`.
- Key exports: `parseVibe`, `matchVibeCandidates`, `VibePickChoice`, `writeVibePicks`.
- Dependencies: `./parse`, `./retrieve`, `./select`.
- Learner-relevant: the explicit note ("the barrel does NOT re-export ./types") is the client-safety pattern: the browser imports `@/lib/search/types` so Anthropic/OpenAI/service client never land in the bundle.

### onboarding/constants.ts — onboarding constants (client-safe)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/onboarding/constants.ts]]`
- Purpose: genres, pick bounds, and deck sizing for the swipe onboarding.
- Key exports: `GENRES` (18 standard TMDB names), `MIN_GENRES = 1`, `MAX_GENRES = 5`, `ONBOARDING_MIN_DECISIONS = 20`, `ONBOARDING_DECK_SIZE = 40`.
- Dependencies: none.
- Learner-relevant: `ONBOARDING_MIN_DECISIONS` mirrors `MIN_RATINGS_FOR_PROFILE` (20) but is re-declared here because `@/lib/taste` is server-only — the client-safe constants leaf. Genres are TMDB names so a picked value matches the catalog's `movies.genres`.

### onboarding/deck.ts — swipe deck builder
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/onboarding/deck.ts]]`
- Purpose: build a deck of real, embedded, popular catalog movies matching chosen genres, excluding already-rated/seen ids, broadening outside genres when the pool is thin.
- Key exports: `buildOnboardingDeck`.
- Dependencies: `@/lib/catalog/types`, `@/lib/supabase/service`, `./constants`.
- Learner-relevant: server-only, service client (catalog is system-owned). Filters `.not("embedding", "is", null)` and `.not("synced_at", "is", null)`, orders by popularity, over-fetches `size * 10`, excludes in memory, then returns genre-matched first followed by the popular rest. Every deck movie is embedded so each swipe is a matched rating that moves the taste vector toward the floor.

### onboarding/index.ts — onboarding barrel
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/onboarding/index.ts]]`
- Purpose: server-only barrel exporting only the deck builder.
- Key exports: `buildOnboardingDeck`.
- Dependencies: `./deck`.
- Learner-relevant: intentionally does NOT re-export `./constants`; client components import `@/lib/onboarding/constants` directly so the server-only deck builder (which pulls in the service client) never lands in the browser bundle.

### utils.ts — class-name merge
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/utils.ts]]`
- Purpose: merge conditional class names resolving Tailwind conflicts (last wins).
- Key exports: `cn(...inputs)`.
- Dependencies: `clsx`, `tailwind-merge`.
- Learner-relevant: the standard shadcn-style helper; UI-only, no domain logic.

### motion.ts — motion tokens + variants
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/motion.ts]]`
- Purpose: shared motion durations, easing, and variants so animation stays consistent (ADR 0004).
- Key exports: `DURATION`, `EASE`, `SWIPE_SPRING`, `revealVariants`.
- Dependencies: none.
- Learner-relevant: durations mirror the CSS motion tokens in `globals.css`; `SWIPE_SPRING` is the onboarding card's release spring; `revealVariants` is the card/poster enter reveal. UI-only.
