---
source: reel-experiment
source_type: codebase
source_lines: 9230
language: typescript
file_count: 27
part: 1
status: absorbed
absorbed_at: 2026-10-14
created: 2026-10-14
updated: 2026-10-14
---

# Digest — reel-experiment (part 1) — reel-vibe_coded (the one-shot vibe build)

## Overview (L1)
- A Next.js 15 App Router movie-recommendation app ("Reel") built one-shot from a vibe prompt. Pipeline: taste profile → Claude (`claude-opus-4-8`) proposes unverified `Candidate`s → TMDB validation turns them into renderable `Movie`s → personal feed. Auth is Supabase + RLS; CSV import distills Letterboxd/IMDb history into a profile.
- The architecture is demo-grade: every `/feed` load and every vibe search re-calls Claude live (no cache, no persistence of results), each engine call fans out to a `Promise.all` of one TMDB search per candidate (up to 24 feed / 16 vibe HTTP calls), the model name is a hard-coded literal, and the whole design assumes low traffic and no retry/rate-limit strategy.
- The course "autopsy" contrast: the one-shot build has no cost/latency budget, no idempotency or dedup at the boundary, and couples an expensive, nondeterministic API call to a user-facing POST with a 120s `maxDuration` — while the typed `Candidate`→`Movie` split is the one genuinely good decision it got right.

## Structure (L2)

### src/lib/types.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/lib/types.ts]]`
- Purpose: Domain types and the app's central invariant — engine output is `Candidate` (unverified) and only becomes a `Movie` after TMDB matching; components accept `Movie`, not `Candidate`, so "no hallucinations by construction" is enforced by the type system.
- Key exports: `TasteProfile`, `Candidate`, `Movie`, `TmdbMatch`, `ImportedRating`, `SavedPick`.
- Dependencies: none (leaf module).
- Learner-relevant: the exemplary decision — put the trust boundary in the type signature (`Candidate` vs `Movie`) rather than in a prompt.

### src/lib/engine.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/lib/engine.ts]]`
- Purpose: the Claude matching engine. `generateFeedCandidates` (default `count=18`, asks for `count+6`), `generateVibeCandidates` (`count=12`, asks for `count+4`), `buildProfileFromRatings` (import → `TasteProfile`).
- Key exports: `generateFeedCandidates`, `generateVibeCandidates`, `buildProfileFromRatings`; internal `CandidateSchema` / `ProfileSchema` (zod), `ENGINE_SYSTEM`, `profileBlock`, `MODEL`, `client()`.
- Dependencies: `@anthropic-ai/sdk`, `@anthropic-ai/sdk/helpers/zod`, `zod`, `@/lib/types`.
- Learner-relevant: `MODEL = "claude-opus-4-8"` is a hard-coded literal; every call uses `max_tokens: 16000` + `thinking: { type: "adaptive" }`; `buildProfileFromRatings` bounds the prompt by sorting ratings and sampling `slice(0, 300)` + `slice(-100)`; over-generates (`count+6` / `count+4`) so TMDB validation can trim — the wasted-generation cost is never measured.

### src/lib/tmdb.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/lib/tmdb.ts]]`
- Purpose: TMDB validation + metadata layer — the gate between engine and UI.
- Key exports: `searchTmdb`, `matchCandidate`, `validateCandidates`, `posterUrl`; internal `GENRE_NAMES` (hard-coded id→name map for 19 genres), `normalize`, `releaseYear`, `toMovie`, `tmdbGet`.
- Dependencies: `@/lib/types`.
- Learner-relevant: `validateCandidates` runs `Promise.all` of `matchCandidate` per candidate → up to 24 parallel TMDB searches per feed (each may do a yearless fallback = 2 calls). `tmdbGet` uses `fetch(..., { next: { revalidate: 60*60*24 } })` (24h cache) but no request coalescing, no batching/rate-limit handling; per-candidate matches are dedup by `tmdb_id` keeping first occurrence.

### src/lib/csv.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/lib/csv.ts]]`
- Purpose: parse Letterboxd or IMDb ratings CSVs into normalized `ImportedRating[]`; detection by header shape.
- Key exports: `parseRatingsCsv`; internal `field`, `parseLetterboxd`, `parseImdb`.
- Dependencies: `papaparse`, `@/lib/types`.
- Learner-relevant: Letterboxd ratings stay 0.5–5; IMDb's 1–10 is halved (`rating10 / 2`). IMDb TV entries filtered by `/movie/i` on `Title Type`. Whole file parsed in memory via PapaParse.

### src/lib/supabase/client.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/lib/supabase/client.ts]]`
- Purpose: browser-side Supabase client for Client Components.
- Key exports: `createClient`.
- Dependencies: `@supabase/ssr`.
- Learner-relevant: uses `NEXT_PUBLIC_*` anon key only; no service-role key exposed.

### src/lib/supabase/server.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/lib/supabase/server.ts]]`
- Purpose: server-side Supabase client for Server Components, Route Handlers, Server Actions; sessions ride on Next cookies.
- Key exports: `createClient`.
- Dependencies: `@supabase/ssr`, `next/headers`.
- Learner-relevant: `setAll` swallows errors when called from a Server Component (relies on middleware to refresh).

### src/lib/supabase/middleware.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/lib/supabase/middleware.ts]]`
- Purpose: the login wall — refreshes the Supabase session cookie and redirects unauthenticated requests to `/login`.
- Key exports: `updateSession`; internal `PUBLIC_PATHS = ["/login", "/auth"]`, `isPublic`.
- Dependencies: `@supabase/ssr`, `next/server`.
- Learner-relevant: if env keys are missing, only `/login` (and `/auth`) is reachable. Authenticated users hitting `/login` are bounced to `/`. Calls `supabase.auth.getUser()` on every matched request — a network round-trip in middleware.

### src/middleware.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/middleware.ts]]`
- Purpose: wires `updateSession`; `matcher` covers everything except `_next/static`, `_next/image`, `favicon.ico`, and image extensions.
- Key exports: `middleware`, `config`.
- Dependencies: `next/server`, `@/lib/supabase/middleware`.
- Learner-relevant: the login wall covers the entire app; no logged-out surface besides the door.

### src/app/page.tsx
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/app/page.tsx]]`
- Purpose: root router — signed-in users go to `/feed` if they have a profile row, else `/onboarding`; unauthenticated → `/login`.
- Key exports: `Home` (async Server Component, default).
- Dependencies: `next/navigation`, `@/lib/supabase/server`.
- Learner-relevant: selects only `user_id` to test profile existence.

### src/app/layout.tsx
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/app/layout.tsx]]`
- Purpose: root layout; loads `Instrument_Serif` (`--font-display`) + `Hanken_Grotesk` (`--font-body`) via `next/font/google`; sets metadata; renders a `.grain` overlay.
- Key exports: `metadata`, `RootLayout` (default).
- Dependencies: `next`, `next/font/google`, `./globals.css`.
- Learner-relevant: two Google fonts fetched at build; body classes reference custom theme tokens (`bg-night text-cream`).

### src/app/login/page.tsx
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/app/login/page.tsx]]`
- Purpose: sign-in / sign-up form (email + password, `minLength={6}`); toggles mode; friendly "Reel needs its keys" panel when `CONFIGURED` is false.
- Key exports: `LoginPage` (client, default).
- Dependencies: `react`, `next/navigation`, `@/lib/supabase/client`.
- Learner-relevant: `CONFIGURED` computed from `NEXT_PUBLIC_SUPABASE_*`; on signup without a session it shows a "confirm your email" notice.

### src/app/onboarding/page.tsx
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/app/onboarding/page.tsx]]`
- Purpose: build the taste profile via either a CSV import or a 5-step quiz. Quiz steps: genres (15), moods (14), decades (9), favorites (TMDB autocomplete), dislikes (12). `finishQuiz` assembles a `taste_summary` client-side and POSTs `/api/profile`.
- Key exports: `OnboardingPage` (client, default); internal `GENRES`/`MOODS`/`DECADES`/`DISLIKES` constants, `Chip`, `FavPick`.
- Dependencies: `react`, `next/navigation`, `/api/import`, `/api/movies/search`, `/api/profile`.
- Learner-relevant: largest file (428 lines). Favorite autocomplete debounced 250ms and hits TMDB live. Import copy advertises "~20 seconds". `loved_keywords: []` is always empty on the quiz path (only CSV import fills keywords).

### src/app/feed/page.tsx
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/app/feed/page.tsx]]`
- Purpose: the ranked "For You" feed; calls `POST /api/recommendations` on mount and on "Deal me a fresh reel"; handles `409` by redirecting to `/onboarding`.
- Key exports: `FeedPage` (client, default).
- Dependencies: `react`, `next/navigation`, `@/components/Nav`, `@/components/MovieCard`, `@/lib/types`.
- Learner-relevant: every mount and every refresh button triggers a fresh Claude call + full TMDB fan-out — no caching, no pagination, no "already generated" state. Loading shows 6 skeleton cards.

### src/app/search/page.tsx
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/app/search/page.tsx]]`
- Purpose: natural-language vibe search; `POST /api/vibe`; example chips ("slow-burn sci-fi that feels lonely", "something like Portrait of a Lady on Fire", etc.).
- Key exports: `SearchPage` (client, default); internal `EXAMPLES`.
- Dependencies: `react`, `@/components/Nav`, `@/components/MovieCard`, `@/lib/types`.
- Learner-relevant: `if (!trimmed || loading) return;` guards concurrent submits; an empty result set is surfaced honestly ("Nothing survived validation").

### src/app/picks/page.tsx
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/app/picks/page.tsx]]`
- Purpose: server-rendered watchlist from `saved_picks` ordered by `created_at desc`; poster grid, reason line, remove button.
- Key exports: `PicksPage` (async Server Component, default).
- Dependencies: `next/image`, `next/link`, `@/components/Nav`, `@/lib/supabase/server`, `@/lib/tmdb`, `@/lib/types`, `./RemovePickButton`.
- Learner-relevant: uses `user!.id` non-null assertion (relies on middleware); loads all picks with no limit/pagination.

### src/app/picks/RemovePickButton.tsx
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/app/picks/RemovePickButton.tsx]]`
- Purpose: client button that DELETEs `/api/picks?tmdb_id=…` then `router.refresh()`.
- Key exports: `RemovePickButton` (client, default).
- Dependencies: `next/navigation`, `react`.
- Learner-relevant: no optimistic removal; waits on the round-trip then refreshes.

### src/app/globals.css
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/app/globals.css]]`
- Purpose: Tailwind 4 `@theme` tokens (night/panel/panel-2/cream/faded/dim/amber/line), font vars, `rise`/`glow` keyframes, `.grain`, `.display`, `.rule`, `.stagger` reveal helpers.
- Key exports: CSS only.
- Dependencies: `tailwindcss`.
- Learner-relevant: styling is polished (this is why the demo "looked great" while the architecture hid the problems).

### src/app/api/recommendations/route.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/app/api/recommendations/route.ts]]`
- Purpose: `POST` — the ranked feed: load profile, build exclude list, call the engine, validate, return.
- Key exports: `POST`; `export const maxDuration = 120`.
- Dependencies: `next/server`, `@/lib/supabase/server`, `@/lib/engine`, `@/lib/tmdb`, `@/lib/types`.
- Learner-relevant: cost/latency hotspot — one Claude call + up to ~24 TMDB searches per request, repeated on every reload. Excludes rated titles (top 400 by rating) + saved pick titles via `Promise.all`; returns `409` when no profile. Result `.slice(0, 18)`, never persisted.

### src/app/api/vibe/route.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/app/api/vibe/route.ts]]`
- Purpose: `POST { query }` — vibe search personalized through the profile.
- Key exports: `POST`; `export const maxDuration = 120`.
- Dependencies: `next/server`, `@/lib/supabase/server`, `@/lib/engine`, `@/lib/tmdb`, `@/lib/types`.
- Learner-relevant: a Claude call + up to ~16 TMDB searches per keystroke-submitted query; `400` on empty query, `409` with no profile; `.slice(0, 12)`.

### src/app/api/movies/search/route.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/app/api/movies/search/route.ts]]`
- Purpose: `GET ?q=` TMDB autocomplete for the onboarding favorites step; returns `{ tmdb_id, title, year, poster_path }`, capped `.slice(0, 6)`.
- Key exports: `GET`.
- Dependencies: `next/server`, `@/lib/supabase/server`, `@/lib/tmdb`.
- Learner-relevant: an unauthenticated-user guard, but each keystroke (debounced 250ms) is a live TMDB call with no server-side cache beyond the 24h fetch revalidation.

### src/app/api/import/route.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/app/api/import/route.ts]]`
- Purpose: `POST { csv }` — parse Letterboxd/IMDb CSV → replace user's `ratings` → engine writes `profiles`; returns `{ ok, imported, profile }`.
- Key exports: `POST`; `export const maxDuration = 120`.
- Dependencies: `next/server`, `@/lib/supabase/server`, `@/lib/csv`, `@/lib/engine`.
- Learner-relevant: deletes all prior ratings then inserts in sequential 500-row chunks (unpaginated loop over the whole export); then a full-profile Claude call. No transaction — a failure mid-loop leaves partial ratings. Copy says ~20s.

### src/app/api/profile/route.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/app/api/profile/route.ts]]`
- Purpose: `GET` current profile (`maybeSingle`); `POST` upsert a `TasteProfile` (defaults every array/string).
- Key exports: `GET`, `POST`.
- Dependencies: `next/server`, `@/lib/supabase/server`, `@/lib/types`.
- Learner-relevant: no server-side validation beyond defaulting; accepts whatever shape the client sends.

### src/app/api/picks/route.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/app/api/picks/route.ts]]`
- Purpose: `GET` saved picks (all, `created_at desc`); `POST` upsert by `(user_id, tmdb_id)`; `DELETE ?tmdb_id=`.
- Key exports: `GET`, `POST`, `DELETE`.
- Dependencies: `next/server`, `@/lib/supabase/server`.
- Learner-relevant: per-action API round-trip (save/remove) with no batching; `GET` is unpaginated.

### src/components/MovieCard.tsx
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/components/MovieCard.tsx]]`
- Purpose: renders one recommendation (poster, title/year, up to 3 genres, reason line, 2-line overview) with an optimistic-ish Save toggle.
- Key exports: `MovieCard` (client, default); props `{ movie, initiallySaved }`.
- Dependencies: `react`, `next/image`, `@/lib/types`, `@/lib/tmdb`.
- Learner-relevant: save state is local and never synced from the DB (`initiallySaved` defaults false), so cards in the feed don't reflect already-saved picks; each toggle is a separate API call.

### src/components/Nav.tsx
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/src/components/Nav.tsx]]`
- Purpose: sticky top nav — links `/feed`, `/search`, `/picks` (active on `pathname.startsWith`) plus Sign out.
- Key exports: `Nav` (client, default); internal `LINKS`.
- Dependencies: `next/link`, `next/navigation`, `@/lib/supabase/client`.
- Learner-relevant: sign-out is a client-side call + `router.refresh()`.

### supabase/schema.sql
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/supabase/schema.sql]]`
- Purpose: Postgres schema — `profiles` (PK `user_id`; `loved_genres`, `loved_moods`, `loved_decades`, `loved_keywords`, `favorite_films`, `disliked` as `text[]`, `taste_summary`, timestamps), `ratings` (`id`, `user_id`, `title`, `year`, `rating numeric(2,1)`, `source check in ('letterboxd','imdb')`), `saved_picks` (`id`, `user_id`, `tmdb_id`, `title`, `year`, `poster_path`, `reason`, `unique(user_id, tmdb_id)`).
- Key exports: DDL; `touch_updated_at()` trigger on `profiles`.
- Dependencies: `auth.users`.
- Learner-relevant: RLS enabled on all three tables with `auth.uid() = user_id` for all ops; indexes on each `user_id`. No index/constraint on `ratings(title)` even though the recommendations exclude path selects titles; no caching/materialization table for generated recommendations.

### next.config.ts
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/next.config.ts]]`
- Purpose: allow `next/image` remote posters from `https://image.tmdb.org/t/p/**`.
- Key exports: `nextConfig` (default).
- Dependencies: `next`.
- Learner-relevant: only remote pattern configured; no `images.remotePatterns` for other hosts.

### postcss.config.mjs
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/postcss.config.mjs]]`
- Purpose: PostCSS plugin list — `@tailwindcss/postcss` only.
- Key exports: `config` (default).
- Dependencies: `@tailwindcss/postcss`.
- Learner-relevant: minimal Tailwind 4 wiring.

### package.json
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/package.json]]`
- Purpose: project manifest. Scripts: `dev` (`next dev --turbopack`), `build`, `start`, `lint`.
- Key exports: deps `@anthropic-ai/sdk ^0.110.0`, `@supabase/ssr ^0.12.0`, `@supabase/supabase-js ^2.110.0`, `next ^15.5.20`, `papaparse ^5.5.4`, `react`/`react-dom ^19.2.7`, `zod ^4.4.3`; dev `@tailwindcss/postcss`, `tailwindcss ^4.3.2`, `typescript ^5.9.3`.
- Dependencies: n/a.
- Learner-relevant: no test runner, no lint config beyond `next lint`; no caching/queue/rate-limit dependency — the cost and latency problems have no library mitigation.

### tsconfig.json
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/tsconfig.json]]`
- Purpose: TS config — `strict: true`, `target ES2017`, `moduleResolution bundler`, path alias `@/* → ./src/*`.
- Key exports: n/a.
- Dependencies: `typescript`, `next`.
- Learner-relevant: strict typing enforces the `Candidate`/`Movie` boundary at compile time.

### .env.local.example
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/.env.local.example]]`
- Purpose: env template — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `TMDB_API_KEY` (v3), `ANTHROPIC_API_KEY` (server-only).
- Key exports: n/a.
- Dependencies: n/a.
- Learner-relevant: secrets live only in server env; no separate prod/dev keys or quotas noted.

### README.md
- Locator: `[[sources/agentic-engineer/20261014/reel-vibe_coded/README.md]]`
- Purpose: project doc — describes the pipeline, the "no hallucinations, by construction" invariant, setup (Supabase schema, keys), and CSV import steps.
- Key exports: n/a.
- Dependencies: n/a.
- Learner-relevant: states the architecture aspiration ("engine output is typed as `Candidate` … can only become a renderable `Movie` by matching against TMDB") — the claim the autopsy tests against the actual unpaginated/cost-blind implementation.
