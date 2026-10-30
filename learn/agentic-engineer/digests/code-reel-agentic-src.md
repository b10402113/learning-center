---
source: sources/agentic-engineer/20261030/reel-agentic_engineering/src
source_type: codebase
source_lines: 6583
language: TypeScript
file_count: 87
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- `app/` — Next.js App Router routes. Each route is a thin server component that gates on `getUser()`, reads through the user-scoped Supabase client, and hands data to one client leaf; business logic lives in server actions, not in the page.
- `proxy.ts` + `app/auth/` — Auth is layered: a middleware (Next 16 renamed it `proxy`) refreshes the session and is explicitly *not* the security boundary; every page/action re-checks `getUser()`. OAuth uses a route handler to exchange the PKCE code.
- `lib/supabase/` — Three clients with strict roles: browser (RLS user), server (RLS user from cookies), and service (bypasses RLS, system catalog only). This is the repo's central data-boundary decision.
- `lib/catalog/` + `lib/tmdb/` — A cache-through catalog: TMDB is fetched once, mapped to a `Movie` row, upserted into `movies`, and every resolve fails closed (`no-match`, never a fabricated title). TMDB also has a rate limiter and attribution constants.
- `lib/import/` + `lib/taste/` — CSV import is browser-parsed and server-chunked (100 rows), idempotent, deduped per `(user_id, movie_id)`, with retries; taste is a rating-weighted centroid of movie embeddings stored as a pgvector unit vector.
- `lib/feed/`, `lib/rows/`, `lib/search/` — Three recommendation surfaces over the same embeddings: cached feed (SQL retrieval + Sonnet reasons), cheap themed home rows (no AI), and vibe search (Haiku parse → embed → blended retrieval → Sonnet select).
- `components/` — Design-system UI. Product components are presentational (typed props in, callbacks out); interactivity is isolated in small `"use client"` leaves. shadcn-style primitives on Radix, styled only through tokens.
- `app/globals.css` — Tokens (`@theme`) for color, radius, elevation, easing, plus reduced-motion neutralization. Styling is the last layer because every component depends on it.
- Tests — Vitest specs mock the boundaries (Supabase, OpenAI, catalog) to test the pure/algorithmic parts: CSV parsing, embedding math, taste centroid, and chunk dedupe.

# L2 detail

- `#L1-L47` — `app/layout.tsx` — Root layout: mounts the two `next/font` families as CSS variables (Fraunces serif + Inter sans, the editorial pairing) and one Sonner `<Toaster>`; no data or auth here.
- `#L1-L94` — `app/page.tsx` — Adaptive root: public landing when signed out, app home when signed in. Demonstrates branching on a validated `getUser()` (not the cookie) so authed data never renders for a visitor, plus an inline cheap `getHomeRows` call.
- `#L1-L64` — `app/home-rows.tsx` — Client leaf for themed home rows: horizontally scrolling strips, optimistic watchlist toggles with rollback and a toast; mirrors state in a ref so callbacks read fresh values.
- `#L1-L29` — `app/feed/page.tsx` — Feed page: login gate, reads the cached feed via `getFeed` (no Claude call on render) and passes it to the client leaf so the page never blocks on generation.
- `#L1-L93` — `app/feed/actions.ts` — Two server actions: `getFeed` reads `recommendations` and reports staleness without calling Claude; `refreshFeed` regenerates. Normalizes a PostgREST to-one join that can arrive as object or array.
- `#L1-L268` — `app/feed/feed-view.tsx` — Feed state machine (`no-profile | loading | populated | thin-empty | error`): auto-refreshes at most once per mount, keeps a stale feed visible while regenerating, and never auto-retries. Imports the server-free `types` leaf to avoid bundling `env`.
- `#L1-L40` — `app/import/page.tsx` — Import page: auth gate plus copy explaining that parsing happens in the browser and titles are never invented.
- `#L1-L260` — `app/import/actions.ts` — The import pipeline: `createImport` → `processImportChunk` (resolve, dedupe by movie id, upsert ratings, embed new movies, fold running totals) → `finalizeImport` (compute taste, settle status). Shows retry/backoff, idempotent re-drive, user vs service client split.
- `#L1-L348` — `app/import/import-flow.tsx` — Client driver for the chunk loop: parse file, create import, send 100-row chunks, track progress, resume a failed import, and render honest unmatched/below-floor states.
- `#L1-L108` — `app/import/actions.test.ts` — Vitest around the chunk action with a fake Supabase and mocked catalog: proves duplicate rows collapse to one rating (latest wins) and that distinct movies normalize independently.
- `#L1-L26` — `app/search/page.tsx` — Vibe-search page: auth gate but deliberately no profile gate; search personalizes when a taste vector exists and falls back to query-only otherwise.
- `#L1-L83` — `app/search/actions.ts` — Orchestrates vibe search: parse (Haiku) → embed (OpenAI) → blended retrieval → Sonnet select+reason → `validateMovieIds` backstop → log to `searches`. A readable example of composing multiple AI steps in one server action.
- `#L1-L132` — `app/search/search-view.tsx` — Search leaf: explicit submit with visible loading, results reuse `RecommendationCard`, optimistic watchlist toggles with rollback.
- `#L1-L34` — `app/onboarding/page.tsx` — Onboarding page: auth gate; if `taste_profiles.computed_at` exists it redirects to `/feed`, using that column as a cheap "has a profile" proxy.
- `#L1-L87` — `app/onboarding/actions.ts` — Deck fetch (excludes rated + session-seen) and `completeOnboarding`: collapse duplicate swipes, upsert binary ratings (like=100, dislike=0), run the same `computeTasteProfile`, mark onboarding complete.
- `#L1-L250` — `app/onboarding/onboarding-flow.tsx` — Genre pick → swipe deck → finish. Refills the deck when it runs out, broadens past chosen genres, and lands on an honest thin state; local `Progress` shows the floor.
- `#L1-L39` — `app/watchlist/page.tsx` — Watchlist page: auth gate and owner-scoped read via `getWatchlist`.
- `#L1-L57` — `app/watchlist/actions.ts` — `setWatchlist` (upsert/delete on `(user_id, movie_id)`) and `getWatchlist` (newest first). The single shared watchlist API used by feed, search, detail, and list.
- `#L1-L60` — `app/watchlist/watchlist-view.tsx` — Grid of saved movies with optimistic in-place removal and re-insert on failure.
- `#L1-L135` — `app/movie/[id]/page.tsx` — Detail page: parses the route param, 404s on bad ids, reads the shared catalog row and the user's watchlist state through the user-scoped client; renders the existing `Movie` type.
- `#L1-L253` — `app/(dev)/preview/page.tsx` — Dev-only design-system gallery: every primitive with mock data typed to the real `Movie` type, so the component contract is exercised without a database.
- `#L1-L11` — `app/auth/actions.ts` — `signOut` server action: creates the cookie-backed client, signs out, redirects. Small example of a server action used purely for mutation.
- `#L1-L25` — `app/auth/callback/route.ts` — OAuth route handler: exchanges the `code` for a session (which sets cookies), then redirects. Shows the route-handler vs server-action split and a proxy-aware redirect using `x-forwarded-host`.
- `#L1-L62` — `proxy.ts` — Auth middleware: refreshes the Supabase session on every matched request and redirects unauthenticated protected routes. Explicitly a UX fast-path, not the boundary; it must return the same response whose cookies it mutated.
- `#L1-L23` — `lib/env.ts` — Server env validated at import time, so a missing secret fails loudly at startup. Lists the five server-only keys and why each must never reach the browser.
- `#L1-L21` — `lib/supabase/AGENTS.md` — The three-client contract in prose: service = system catalog only, browser/server = user data under RLS, gate with `getUser()` not `getSession()`, and the proxy/OAuth rules.
- `#L1-L10` — `lib/supabase/client.ts` — Browser client carrying the signed-in session; publishable key is safe because RLS enforces access.
- `#L1-L32` — `lib/supabase/server.ts` — Cookie-based server client for components, actions, and route handlers. `setAll` is wrapped in try/catch because Server Components cannot set cookies; the proxy persists refreshes.
- `#L1-L16` — `lib/supabase/service.ts` — Lazy singleton with the secret key that bypasses RLS; documented as the deliberate exception for system-owned `movies` writes only.
- `#L1-L13` — `lib/anthropic.ts` — Shared lazy Anthropic singleton reading the server-only key; the one client used by both Haiku parsing and Sonnet writing.
- `#L1-L7` — `lib/utils.ts` — `cn()`: `clsx` + `tailwind-merge`, so conditional classes resolve Tailwind conflicts with last-wins semantics.
- `#L1-L29` — `lib/motion.ts` — Motion tokens mirroring the CSS durations/easings plus a swipe spring and a reveal variant, keeping animation consistent with the design tokens.
- `#L1-L65` — `lib/tmdb/types.ts` — Minimal hand-written shapes for the TMDB responses the app reads (details, search, find, list); a typed boundary around a third-party API.
- `#L1-L43` — `lib/tmdb/rate-limiter.ts` — Fixed-window token limiter with queued waiters and an unref'd timer; comments state its limit (per-process, not cross-invocation) and why 429 backoff is the real net.
- `#L1-L89` — `lib/tmdb/client.ts` — Typed TMDB fetch: bearer auth, shared limiter, 404 → `null` (clean not-found), 429 retry-after handling, bounded retries. A good example of wrapping an unreliable external API.
- `#L1-L21` — `lib/tmdb/attribution.ts` — Attribution constants and `posterUrl`; centralizes a legal obligation so every movie-rendering feature imports it instead of retyping.
- `#L1-L46` — `lib/catalog/types.ts` — The `Movie` row shape (TMDB id as natural key), `MOVIE_COLUMNS` in one place, the closed `ResolveResult` union, and the three `MovieRef` kinds.
- `#L1-L42` — `lib/catalog/mapper.ts` — `mapDetailsToMovie`: flattens a TMDB details response (credits, keywords, release date) into a cache-ready row, trimming cast and coercing optional fields.
- `#L1-L137` — `lib/catalog/resolver.ts` — Cache-through resolution by TMDB id, IMDb id, or title+year. Title matching normalizes and requires an exact-title near-year match; `resolveMany` runs bounded-concurrency workers through the shared limiter. Always fails closed.
- `#L1-L66` — `lib/catalog/validation.ts` — `validateMovieIds` (the anti-hallucination backstop) and `getCandidates` (popularity-ordered, in-memory tag filtering, over-fetch to fill the limit).
- `#L1-L11` — `lib/catalog/index.ts` — Barrel defining the catalog's public API; the only import surface features use.
- `#L1-L25` — `lib/embeddings/AGENTS.md` — Conventions: model/dimensions, L2 normalization, the pgvector string-literal gotcha, where embeddings may and may not be generated, and the taste-vector formula.
- `#L1-L149` — `lib/embeddings/index.ts` — Embedding engine: builds a movie document from metadata, L2-normalizes, converts to/from the pgvector literal form, batches embeddings, and writes them via the service client. `embedMissingByIds` makes imports idempotent.
- `#L1-L91` — `lib/embeddings/index.test.ts` — Mocks the OpenAI SDK to test document construction, normalization, vector literal round-trip, ordering, and the empty-input short-circuit.
- `#L1-L57` — `lib/import/types.ts` — Client/server shareable types for the import pipeline: `ParsedRow`, `ParseResult`, and tagged-union results for each action. Deliberately dependency-free.
- `#L1-L114` — `lib/import/parse.ts` — Browser CSV parsing with header-based source detection, per-source row mappers, and explicit skips (unrated rows, IMDb TV types) so nothing is silently lost.
- `#L1-L106` — `lib/import/parse.test.ts` — Tests both source formats, raw-rating preservation, TV/unrated skipping, forced source, and the error cases.
- `#L1-L150` — `lib/taste/index.ts` — The recommendation core: rating-weighted centroid of unit movie vectors, centered on the user's mean, with a zero-variance fallback. Also computes genre affinities and enforces a 20-rating floor.
- `#L1-L136` — `lib/taste/index.test.ts` — Proves the below-floor path writes nothing, unembedded movies are excluded, the stored vector is unit length, only liked genres contribute, and identical ratings still yield a finite vector.
- `#L1-L51` — `lib/feed/types.ts` — Client-safe feed types and tunables (`FEED_SIZE`, `FEED_POOL_SIZE`) plus the tagged-union result shapes callers switch on instead of catching throws.
- `#L1-L62` — `lib/feed/candidates.ts` — Retrieval via the `match_feed_candidates` RPC (HNSW cosine, excludes rated/unembedded), then a popularity tiebreak inside a 0.02 distance band. Ranking lives in SQL; the wrapper only nudges ties.
- `#L1-L162` — `lib/feed/reasons.ts` — One batched Sonnet call writes a reason per pick using structured JSON output and a strict grounded system prompt; a deterministic `groundedReason` fallback covers refusals or omissions. Snapshot of "AI writes prose, SQL does selection".
- `#L1-L141` — `lib/feed/generate.ts` — Generation lifecycle: read profile, retrieve, build a taste summary, write reasons, then atomically replace the cached feed via an RPC. Any error leaves the old feed untouched; staleness is computed at read time.
- `#L1-L16` — `lib/feed/index.ts` — Server-only feed barrel; deliberately does not re-export `types` so client bundles cannot pull server modules.
- `#L1-L38` — `lib/feed/AGENTS.md` — The engine conventions: RPC-first ranking, `operator(public.<=>)` under an empty search_path, Haiku-parses/Sonnet-writes, no fabrication by construction, and the "import the leaf, not the barrel" client-safety rule.
- `#L1-L24` — `lib/rows/types.ts` — Client-safe home-row types and tunables (pool 60, row 12, min optional 4).
- `#L1-L148` — `lib/rows/index.ts` — Reuses the feed RPC once with a larger pool, slices it into hidden-gems / crowd-pleasers / more-genre rows with cross-row dedupe, and attaches deterministic grounded reasons — zero Claude calls on this path.
- `#L1-L45` — `lib/search/types.ts` — Client-safe vibe types and blend weights (`QUERY_WEIGHT 0.7`, `TASTE_WEIGHT 0.3`) plus the `VibeIntent` facets.
- `#L1-L78` — `lib/search/parse.ts` — Haiku parses free text into `VibeIntent` with a JSON schema whose optional fields are nullable-but-required; falls back to embedding the raw query if parsing fails.
- `#L1-L51` — `lib/search/retrieve.ts` — Calls `match_vibe_candidates`, converts both distances to similarities, blends query and taste scores, and trims to the shortlist. Taste weight is 0 when there is no profile.
- `#L1-L131` — `lib/search/select.ts` — One Sonnet call picks 3–5 movies from the real shortlist and writes reasons; the result is filtered to ids that were actually in the shortlist, deduped, and capped.
- `#L1-L9` — `lib/search/index.ts` — Search barrel exporting only server pieces; types are imported from the leaf for client safety.
- `#L1-L39` — `lib/onboarding/constants.ts` — Client-safe constants: TMDB genre names, 1–5 genre bounds, and a 20-decision floor that mirrors the taste floor. Duplicated on purpose because `lib/taste` is server-only.
- `#L1-L52` — `lib/onboarding/deck.ts` — Builds a deck from embedded, popular, unrated movies: genre matches first, then broadened popular ones. Every deck movie is embedded so each swipe moves the taste vector.
- `#L1-L7` — `lib/onboarding/index.ts` — Onboarding barrel; intentionally does not re-export the client-safe constants.
- `#L1-L19` — `components/AGENTS.md` — UI contract: tokens only, server-by-default with small client leaves, WCAG AA focus/roles, font pairing, and the shared poster/attribution helpers.
- `#L1-L108` — `components/app-shell.tsx` — Server-rendered frame: skip link, header, nav, user menu, `<main>`, and the mandatory TMDB attribution footer. Interactivity is pushed into `MobileNav` and `UserMenu`.
- `#L1-L66` — `components/mobile-nav.tsx` — Small client leaf: a disclosure menu with `aria-expanded`/`aria-controls`, closing on navigation.
- `#L1-L54` — `components/user-menu.tsx` — Client dropdown over an avatar with initials fallback; sign-out is passed in as a server action.
- `#L1-L52` — `components/continue-with-google.tsx` — Starts Google OAuth with a `redirectTo` to `/auth/callback`; pending state only resets if the redirect fails to start.
- `#L1-L53` — `components/poster-image.tsx` — 2:3 poster at a TMDB size, with a designed fallback (gradient, clapperboard, serif title) when `poster_path` is null — never a broken image.
- `#L1-L128` — `components/recommendation-card.tsx` — The reusable pick card: poster, metadata, italic reason pull-quote, and a compact watchlist toggle; `href` makes the whole card navigable via a stretched link and a skeleton mode.
- `#L1-L141` — `components/swipe-card.tsx` — Motion-driven swipe card: drag threshold, like/nope overlays, spring return, reduced-motion branch, and an `aria-live` announcement.
- `#L1-L93` — `components/vibe-search-input.tsx` — Search landmark (`role="search"`), labelled input, submit spinner, example chips; controlled value with callbacks out.
- `#L1-L50` — `components/watchlist-button.tsx` — Labelled optimistic watchlist button with revert-and-toast on failure, shared by the detail page.
- `#L1-L50` — `components/ui/avatar.tsx` — Radix avatar wrappers with a token-styled fallback.
- `#L1-L36` — `components/ui/badge.tsx` — `cva` badge with semantic variants (neutral/accent/success/warning/danger/outline) and sizes.
- `#L1-L71` — `components/ui/button.tsx` — `cva` button: variants, sizes, `asChild` via Radix Slot, and a `loading` mode that sets `aria-busy` and disables.
- `#L1-L35` — `components/ui/card.tsx` — Card plus header/media/content/footer slots; `interactive` lifts the shadow on hover.
- `#L1-L88` — `components/ui/dialog.tsx` — Radix dialog with overlay, focus handling inherited from Radix, token styling, and data-state animations defined in `globals.css`.
- `#L1-L73` — `components/ui/dropdown-menu.tsx` — Radix dropdown wrappers with portalled content, highlight states, label, and separator.
- `#L1-L34` — `components/ui/input.tsx` — Input with an `error` prop that sets `aria-invalid`; pairs with `aria-describedby` at the call site.
- `#L1-L22` — `components/ui/label.tsx` — Radix label with peer-disabled styling.
- `#L1-L28` — `components/ui/progress.tsx` — Dependency-free determinate meter with `role="progressbar"` and aria values.
- `#L1-L44` — `components/ui/skeleton.tsx` — Decorative shimmer skeleton plus `SkeletonRegion` that announces loading to assistive tech.
- `#L1-L18` — `components/ui/toast.tsx` — Thin app-facing wrapper over Sonner (`toast`, `toastSuccess`, `toastError`), mounted once in the root layout.
- `#L1-L162` — `app/globals.css` — Design tokens via Tailwind `@theme` (color, radius, elevation, easing, fonts), motion durations, Radix data-state keyframes, a global `prefers-reduced-motion` neutralizer, and `.sr-only`.
