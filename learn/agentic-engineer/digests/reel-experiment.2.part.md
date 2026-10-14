---
source: reel-experiment
source_type: codebase
source_lines: 9230
language: typescript
file_count: 24
part: 2
status: absorbed
absorbed_at: 2026-10-14
created: 2026-10-14
updated: 2026-10-14
---

# Digest — reel-experiment (part 2) — reel-agentic_engineering: routes & pages

## Overview (L1)
- The route surface is a Next.js 16 App Router app (`src/app/**`) with an adaptive root, Google OAuth callback, onboarding swipe deck, recommendation feed, vibe search, CSV import, movie detail, and watchlist, plus a dev-only design preview under the `(dev)` route group.
- Every authed surface follows the same workflow-first shape: a server-rendered `page.tsx` does its own `getUser()` gate and reads via a user-scoped Supabase client, while a `"use client"` leaf (`*-flow.tsx` / `*-view.tsx`) owns interactivity and drives `"use server"` actions in the route's `actions.ts`.
- Contrast with the parallel reel-vibe_coded build: the vibe build exposes REST-style handlers under `src/app/api/*/route.ts` and auth in `src/middleware.ts`; this workflow-first build instead uses route handlers only for the OAuth callback, server actions for every mutation/read, and `src/proxy.ts` (Next 16's rename of middleware) with a per-page `getUser()` backstop (ADR 0005).

## Structure (L2)

### `/` — adaptive root
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/page.tsx]]`
- Purpose: one route, two branches (ADR 0005) — the public landing when signed out, the signed-in home when authed. Gated by a validated `getUser()` (never the cookie) so authed data never renders for a visitor.
- Key exports: `default async function Home`.
- Dependencies: `@/app/auth/actions` (`signOut`), `@/app/home-rows` (`HomeRows`), `@/components/app-shell` (`AppShell`), `@/components/continue-with-google`, `@/components/ui/button`, `@/lib/rows` (`getHomeRows`), `@/lib/supabase/server` (`createClient`).
- Learner-relevant: signed-out branch renders `ContinueWithGoogle`; signed-in branch derives `name`/`avatar` from `user_metadata` (`full_name`/`name`, `avatar_url`/`picture`), calls `getHomeRows(supabase, user.id)` (ADR 0010, deterministic one-cosine-query themed rows, no Claude) and shows `<HomeRows>` only when `home.status === "ready"`. CTAs branch on `hasProfile` → `/feed`, `/search` vs `/onboarding`, `/import`.

### `src/app/layout.tsx` — root layout
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/layout.tsx]]`
- Purpose: root HTML shell, font wiring, and the global toast surface.
- Key exports: `metadata: Metadata`, `default function RootLayout`.
- Dependencies: `next/font/google`, `sonner` (`Toaster`), `./globals.css`.
- Learner-relevant: editorial font pairing (ADR 0004) via CSS vars `--font-fraunces` (Fraunces) and `--font-inter` (Inter); `Toaster` themed dark with `--color-surface-2`/`--color-border`/`--color-text` tokens. `metadata.title = "Reel"`.

### `src/app/home-rows.tsx` — home themed rows (client leaf)
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/home-rows.tsx]]`
- Purpose: horizontally scrollable strips of secondary picks (ADR 0010), distinct from the feed grid; each card links to `/movie/<id>` and toggles the watchlist optimistically.
- Key exports: `HomeRows` (`"use client"`).
- Dependencies: `@/app/watchlist/actions` (`setWatchlist`), `@/components/recommendation-card`, `@/components/ui/toast` (`toastError`), `@/lib/rows/types` (`HomeRow`).
- Learner-relevant: holds state in `rows` + a `rowsRef` mirror so the toggle callback reads live state without re-creation; reverts and toasts on `res.status === "error"`.

### `src/proxy.ts` — session refresh + route gate
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/proxy.ts]]`
- Purpose: Next.js 16 renamed middleware to proxy; this refreshes the Supabase session cookie on every matched request and redirects unauthenticated users off protected routes to `/`.
- Key exports: `async function proxy(request: NextRequest)`, `config` (matcher).
- Dependencies: `@supabase/ssr` (`createServerClient`), `next/server` (`NextRequest`, `NextResponse`).
- Learner-relevant: `isPublic` = `/` or any path under `/auth`. The matcher (`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`) is a UX fast-path, NOT the security boundary (ADR 0005), so every authed page repeats `getUser()`. Carries refreshed cookies onto redirects; must return the response whose cookies were mutated or sessions drop.

### `src/app/auth/actions.ts` — sign-out action
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/auth/actions.ts]]`
- Purpose: `"use server"` sign-out that clears the session and returns to the public landing.
- Key exports: `async function signOut`.
- Dependencies: `next/navigation` (`redirect`), `@/lib/supabase/server` (`createClient`).
- Learner-relevant: `supabase.auth.signOut()` then `redirect("/")`; passed into `AppShell` as `onSignOut` by every authed page.

### `/auth/callback` — OAuth code exchange
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/auth/callback/route.ts]]`
- Purpose: Google (via Supabase) redirects here with `?code`; exchange it for a session (sets cookies) then forward to `next` (default `/`).
- Key exports: `async function GET(request: Request)`.
- Dependencies: `next/server` (`NextResponse`), `@/lib/supabase/server` (`createClient`).
- Learner-relevant: the only route handler besides the proxy. Handles `x-forwarded-host` for Vercel and `NODE_ENV === "development"` for local; on missing code or exchange error redirects to `${origin}/` (never leaks an error state).

### `/feed` — recommendation feed
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/feed/page.tsx]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/feed/actions.ts]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/feed/feed-view.tsx]]`
- Purpose: the ranked personal feed (ADR 0007). Server page reads the cached feed via `getFeed` (no Claude call) so the page never blocks on the seconds-long Sonnet call; the client leaf drives regeneration.
- Key exports: `default async function FeedPage`; actions `getFeed`, `refreshFeed`, types `GetFeedResult`/`RefreshFeedResult`; `FeedView`.
- Dependencies: `@/components/app-shell`, `@/app/auth/actions`, `@/app/watchlist/actions`, `@/components/recommendation-card`, `@/components/ui/{button,toast}`, `@/lib/catalog` (`Movie`, `MOVIE_COLUMNS`), `@/lib/feed` (`generateFeed`, `isFeedStale`, `readWatchlistIds`, `FeedPick`), `@/lib/feed/types` (`FEED_SIZE`), `@/lib/supabase/server`.
- Learner-relevant: `getFeed` returns `no-profile` when `taste_profiles.computed_at` is null (avoids transferring the 1536-dim vector), selects `rank, score, reason, generated_at, movie:movies(...)` ordered by rank, and normalizes a to-one PostgREST join that may arrive as object or single-element array (`oneMovie`). `refreshFeed` calls `generateFeed` and fails closed (old feed untouched). `FeedView` renders five phases (`no-profile | loading | populated | thin-empty | error`), auto-fires `refreshFeed` at most once per mount (`shouldAutoRefresh`, `autoFired` ref) only for empty/stale feeds, never auto-retries, keeps a stale feed visible dimmed while `regenerating`, and imports from `@/lib/feed/types` not the `@/lib/feed` barrel (the barrel pulls server-only env into the client bundle). Skeleton uses `FEED_SIZE` cards.

### `/import` — CSV import pipeline
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/import/page.tsx]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/import/actions.ts]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/import/import-flow.tsx]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/import/actions.test.ts]]`
- Purpose: upload a Letterboxd/IMDb `ratings.csv`, resolve every row to a real catalog movie, persist ratings, embed new movies, and compute the taste profile (ADR 0006).
- Key exports: `ImportPage`; actions `createImport`, `processImportChunk`, `finalizeImport`, `getImportStatus`; `ImportFlow`; test `processImportChunk — duplicate movie in one chunk (harden)`.
- Dependencies: `@/lib/catalog` (`resolveMany`, `MovieRef`), `@/lib/embeddings` (`embedMissingByIds`), `@/lib/import/{parse,types}` (`parseRatingsCsv`, `ChunkResult`, `CreateImportResult`, `FinalizeResult`, `ImportSource`, `ImportStatus`, `ParsedRow`, `UnmatchedRow`), `@/lib/taste` (`computeTasteProfile`), `@/lib/supabase/server`, `@/components/ui/{badge,button,card,progress,toast}`, `@/components/app-shell`.
- Learner-relevant: browser parses the file, then drives `createImport` once → `processImportChunk` per 100-row chunk (`CHUNK_SIZE = 100`) → `finalizeImport`; `importIdRef` is kept so a failed import resumes. `normalizeRating` maps Letterboxd 0.5–5 and IMDb 1–10 to a shared 0–100 scale (`clamp0to100`), keeping `raw_value`/`raw_scale`. `withRetry` retries transient TMDB/OpenAI steps 3× with exponential backoff + jitter. Rows are keyed by `movie_id` so two source rows resolving to the same movie collapse to one rating (latest wins) — otherwise the upsert hits the same `(user_id, movie_id)` twice and Postgres throws "cannot affect row a second time", permanently wedging a re-drive; `chunkIndex 0` resets running counts for idempotent re-drive. The vector is written only in `finalizeImport` after all rows are in. `finalizeImport` can return `computed | below-floor | failed`; below-floor still saves ratings. `actions.test.ts` mocks `createClient`/`resolveMany`/`embedMissingByIds` and asserts the deduped upsert (movie 42, last value wins → 80) and independent normalization (`[100, 50]`).

### `/movie/[id]` — movie detail
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/movie/[id]/page.tsx]]`
- Purpose: real catalog metadata plus add-to-watchlist (feature 11). Login-walled via validated `getUser()`.
- Key exports: `default async function MoviePage({ params }: { params: Promise<{ id: string }> })`, local `formatRuntime`.
- Dependencies: `@/components/app-shell`, `@/components/poster-image`, `@/components/ui/badge`, `@/components/watchlist-button`, `@/lib/catalog/types` (`MOVIE_COLUMNS`, `Movie`), `@/lib/supabase/server`.
- Learner-relevant: Next 16 async `params` are awaited; `Number(id)` guard (`Number.isFinite`) → `notFound()`. Reads the shared `movies` row and the user's `watchlist_items` state through the user-scoped client (RLS lets any authed user read the catalog, only their own watchlist). No new decision — renders the existing `Movie` type.

### `/onboarding` — genre pick + swipe deck
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/onboarding/page.tsx]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/onboarding/actions.ts]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/onboarding/onboarding-flow.tsx]]`
- Purpose: the no-CSV path to a taste profile (ADR 0008): pick genres → swipe a deck → build the profile → feed.
- Key exports: actions `getOnboardingDeck`, `completeOnboarding`, types `OnboardingDeckResult`, `OnboardingSwipe`; `OnboardingFlow`; `OnboardingPage`.
- Dependencies: `@/lib/onboarding` (`buildOnboardingDeck`), `@/lib/onboarding/constants` (`GENRES`, `MIN_GENRES`, `MAX_GENRES`, `ONBOARDING_MIN_DECISIONS`), `@/lib/taste` (`computeTasteProfile`), `@/lib/catalog/types` (`Movie`), `@/lib/import/types` (`FinalizeResult`), `@/components/{swipe-card,app-shell}`, `@/components/ui/{button,toast}`, `@/lib/utils` (`cn`), `@/lib/supabase/server`.
- Learner-relevant: `OnboardingPage` redirects to `/feed` when `taste_profiles.computed_at` is set (cheap "has a profile" proxy). `getOnboardingDeck` excludes already-rated ids plus `sessionSeen`, returns `thin` when the deck is under `ONBOARDING_MIN_DECISIONS`. `completeOnboarding` dedupes swipes by movie (last wins, same Postgres double-touch protection as import), maps likes→100 / dislikes→0 on the 0–100 scale, upserts on `(user_id, movie_id)`, runs the shared `computeTasteProfile`, and sets `profiles.onboarding_completed = true` on `computed`. The client flow refills the deck (broadening past chosen genres) via a `refilling` ref until the floor, else lands on an honest `thin` state; finish routes to `/feed`.

### `/search` — natural-language vibe search
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/search/page.tsx]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/search/actions.ts]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/search/search-view.tsx]]`
- Purpose: describe a mood; get 3–5 real matches with reasons (ADR 0009). Works with or without a taste profile (no profile gate, unlike the feed).
- Key exports: `searchVibe`; `SearchView`; `SearchPage`.
- Dependencies: `@/lib/catalog` (`validateMovieIds`), `@/lib/catalog/types` (`Movie`), `@/lib/embeddings` (`embedTexts`, `toVectorLiteral`), `@/lib/feed` (`readWatchlistIds`), `@/lib/search` (`matchVibeCandidates`, `parseVibe`, `writeVibePicks`), `@/lib/search/types` (`SearchResult`, `VibePick`), `@/components/{recommendation-card,vibe-search-input,app-shell}`, `@/components/ui/toast`, `@/app/watchlist/actions`.
- Learner-relevant: `searchVibe` orchestrates the whole thread server-side — read the taste vector literal (or null), `parseVibe` (Haiku), `embedTexts`, `matchVibeCandidates` (cosine retrieval blended with taste), `writeVibePicks` (Sonnet) — then backstops by `validateMovieIds` against the catalog ("no-fake" promise) and logs to `searches` (`query_text`, `parsed_intent`, `results: [{ movie_id, rank, reason }]`); empty shortlist/picks return `empty`. `SearchView` renders phases `idle | searching | results | empty | error`, reuses `RecommendationCard`, and toggles watchlist optimistically via `picksRef`.

### `/watchlist` — saved movies
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/watchlist/page.tsx]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/watchlist/actions.ts]]`, `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/watchlist/watchlist-view.tsx]]`
- Purpose: the user's saved movies, each removable in place (feature 12). Login-walled via validated `getUser()`.
- Key exports: `setWatchlist`, `getWatchlist`; `WatchlistView`; `WatchlistPage`.
- Dependencies: `@/lib/catalog/types` (`MOVIE_COLUMNS`, `Movie`), `@/lib/supabase/server`, `@/components/{recommendation-card,app-shell}`, `@/components/ui/{button,toast}`.
- Learner-relevant: `setWatchlist(movieId, add)` is the single add/remove control shared by the feed, vibe search, and detail page — upserts on `(user_id, movie_id)` or deletes owner-scoped (RLS). `getWatchlist` reads `added_at, movie:movies(...)` ordered newest-first and normalizes the to-one join. `WatchlistView` removes optimistically and re-adds to the front with a toast on failure.

### `(dev)/preview` — dev-only design system preview
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/app/(dev)/preview/page.tsx]]`
- Purpose: a route-grouped (`(dev)`) `"use client"` gallery of the design system ("Dev preview · not shipped") — buttons, input/label, badges, dialog, skeleton, card, `PosterImage`, `RecommendationCard`, `SwipeCard`, `VibeSearchInput`.
- Key exports: `default function PreviewPage`, local `Section`.
- Dependencies: `@/components/app-shell`, `@/components/poster-image`, `@/components/recommendation-card`, `@/components/swipe-card`, `@/components/ui/{badge,button,card,dialog,input,label,skeleton,toast}`, `@/components/vibe-search-input`, `@/lib/catalog/types` (`Movie`).
- Learner-relevant: `MOCK_MOVIE` (Inception, id 27205) and `MOCK_MOVIE_NO_POSTER` are typed to the real `Movie` type — mocks that cannot drift from the contract. Rendering is not authed (kept behind the route group and the global proxy matcher).

### `next.config.ts` — image host allowlist
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/next.config.ts]]`
- Purpose: configure `next/image` remote patterns and SVG handling.
- Key exports: `nextConfig: NextConfig`, default export.
- Learner-relevant: allows `image.tmdb.org /t/p/**` (poster art, ADR 0003) and `www.themoviedb.org /assets/**` (attribution logo); `dangerouslyAllowSVG: true` with `contentDispositionType: "attachment"` and a restrictive `contentSecurityPolicy`.

### `postcss.config.mjs` — Tailwind v4 wiring
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/postcss.config.mjs]]`
- Purpose: PostCSS plugin config.
- Key exports: default `config`.
- Learner-relevant: single plugin `@tailwindcss/postcss` (Tailwind CSS v4, CSS-first), matching the AGENTS.md note that `src/app/globals.css` is excluded from Biome because Biome cannot parse Tailwind v4 directives.
