---
source: sources/js-mastery-engineer/20261107/course/062 - First Slice- Core taste loop.en.txt
source_type: text
source_lines: 201
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The first real slice is the "walking skeleton": sign in, rate a fixed 20-film starter deck, and land on a feed of 12 picks each carrying a one-sentence reason; CSV import, vibe search, and in-feed feedback are deliberately excluded.
- Sign-in uses Google as the main path (email/password with verification optional), onboarding requires at least five like/dislike ratings but the whole deck is encouraged, and a fixed pool of about 500 popular/top-rated TMDB films is prefetched because slow work cannot run in a request.
- Feed building is asynchronous: the app shows a building state and polls a status enum; 12 picks are chosen by cosine distance excluding rated or already-picked films, and one backend call generates all 12 reasons, persisted and never regenerated.
- Taste math is settled: like +1, dislike -1, skip 0 (symmetric chosen over half-weight dislike), the taste vector rebuilds only at onboarding finish, swipes persist immediately via one server action each, and the quota is 25 reason-model calls per user per day.
- Sessions use middleware refresh plus page-level user resolution, visitors follow a strict funnel, returning users see stored picks plus an on-demand refresh, and the account shows Google name/avatar with working sign-out.
- After development and Playwright-heavy verify, a real bug appears: Next.js 16 deprecated the image `priority` prop, so the onboarding poster intermittently fails; the fix uses `preload` plus `loading="eager"` on posters and the hero.

# L2 detail

- `#L1-L13` — Defines the core taste loop as the thinnest real thread and states its done condition, including custom SMTP for verification email.
- `#L14-L34` — Architect round one: Google sign-in, all-20 onboarding with a five-rating minimum, prefetched pool, building/poll state, and deferring Resend if Google-only.
- `#L35-L49` — Sets the 500-film candidate pool, 12 picks per build, a build-status enum, and opens the swipe-weight question.
- `#L50-L68` — Chooses symmetric dislike weight, vector rebuild timing, immediate swipe persistence, one call for 12 reasons, and top-12 cosine selection.
- `#L69-L95` — Sets 25 reasons/day quota, middleware gating, strict funnel, returning-user stored picks plus refresh, Google account data, and confirms the data model.
- `#L96-L113` — Skips cross-check, accepts the spec, starts develop, saves verify steps, and reports 15 build tasks plus needed keys.
- `#L114-L139` — Watches the slow Playwright verify, stops it, tests manually, and finds Google sign-in not enabled in Supabase.
- `#L140-L165` — Enables Google in Supabase, creates a Google Cloud OAuth web client with the redirect URI, pastes ID/secret, and signs in to onboarding.
- `#L166-L201` — Debugs the intermittent missing poster, finds Next 16's deprecated `priority`, and fixes posters and hero with `preload` and eager loading.
