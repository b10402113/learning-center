---
source: agentic-engineer.21
source_type: text
source_lines: 2624
part: 21
status: absorbed
absorbed_at: 2026-10-14
created: 2026-10-14
updated: 2026-10-14
---

# Digest — agentic-engineer (part 21) — Greenfield: design system, first slice, showcase, pro tip

## Overview (L1)
- Update the Design System — After seeing the generated design, the author changes preferences (wants more modern), compacts rather than clears context to preserve prior state, asks the agent to re-architect and redevelop, answers the architect interview (palette inversion, geometric font, new primitives), accepts the new spec, then develops the design system and verifies it.
- Design System Output — Walks through the `/design` route output: surfaces, lines/text, three status colors, the movie-like font, radii/space/motion tokens, swipe card + deck, rail, chips, buttons, form controls, loading/empty/error states and toasts, all available as a reusable design language for future features.
- First Slice Core taste loop — Architects and develops the "core taste loop" thin slice (sign in, swipe a fixed starter deck, get a 12-pick feed with one-sentence reasons), settles sign-in method, pool size, taste vector, quota, gating via a long interview, builds 15 tasks on a branch, then verifies with Playwright and manual testing.
- App Showcase — Rates ~20 movies in onboarding, hits two runtime errors (cannot update component, fetch failed), debugs, builds a feed (Reservoir Dogs hero), marks the feature complete, and closes the module after showing the full architect→develop loop.
- Final Pro Tip — Batch tip: architect multiple features upfront (or have the agent answer its own questions with recommended answers), then build them all together in one session to get both speed and precision.

## Sections (L2)

### update-the-design-system
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/10. Update the Design System.srt#update-the-design-system]]`
- Summary: Continues from the previous session after the author changes their mind about the generated design and wants something more modern. Instead of clearing context, the author compacts it (was at 275 tokens) so the agent retains what it previously did, then asks it to re-architect and redevelop the system. It answers an architect interview, produces spec 0004, and the design system is developed and verified.
- Key claims: Compacting context (not clearing) preserves prior work so the agent knows what changed; the author inverts the palette (white primary action fill, violet→magenta gradient brand identity, amber only for star rings) to match the references; the rework fully re-themes color plus adds new composition primitives (full-bleed hero with gradient scrim, horizontal rail, pill, floating tab bar, glass panel surface, stair rating); glass is kept on tab bar and overlays only to avoid dropping frames on mid-range phones.
- Learner-relevant: Shows the architect→accept spec→develop→`check verify` loop and the "you're in control" dynamic. Concrete details: spec named `0004`; catalog has `poster path` but no `backdrop path` so the hero was updated to add the backdrop path; catalog pool adds an image backdrop; adds the star rating to the meta line; geometric "sands" face recommended; git/commands mentioned: `pmpmdev` on `localhost 3000`, "check verify". Tags: rule three (no slow work in a request), rule five (reason persisted, never regenerated), rule six (per-user daily quota before each model call).

### design-system-output
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/11. Design System Output.srt#design-system-output]]`
- Summary: Explains a secondary deliverable of the architect/develop skills — the completed design system page. The author visits `localhost:3000/design` to show the app's visual language and all component states, arguing that the value is the durable design language future develop skills reuse, not just the initial screen.
- Key claims: The `/design` route (may be a different endpoint per implementation) documents the full visual language; it covers surfaces, lines and text, three status colors (good, danger, brand), a movie-like font, radii, spacing and motion tokens; consistency means future features won't invent different radii/colors and will respect accessibility rules; it includes swipe card + rating deck, rail, chips, buttons, form controls, loading/empty/error states, success/background toasts and responsive overlay.
- Learner-relevant: Supports understanding design tokens as a reusable contract for later features. Concrete artifacts: output route `localhost 3000/design`; swipe deck actions "seen it, liked it, not for me, skip"; feed/hero/movie card, meta line, pic card, poster tile with no artwork.

### first-slice-core-taste-loop
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/12. First Slice Core taste loop.srt#first-slice-core-taste-loop]]`
- Summary: The author architects and develops the core taste loop — the first real end-to-end slice ("walking skeleton") through the whole product. An extensive architect interview settles every dimension (auth method, onboarding completion, pool source, taste vector, gating, feed build), then the develop skill implements it as 15 build-plan tasks on a branch, followed by automated and manual verification.
- Key claims: The slice is deliberately narrow — fixed starter deck, no CSV import, no vibe search, no in-feed feedback yet; sign-in uses Supabase auth with Google as the main path (email verification deferred, custom SMTP skipped since Google accounts arrive verified); onboarding requires at least 5 liked/disliked out of a 20-card deck (finish early allowed) and the taste vector rebuilds only on onboarding finish; the candidate pool is ~500 popular + top-rated films deduped, one feed build produces 12 picks selected by top-12 cosine distance excluding anything rated/picked, using one batched model call parsed with Zod; swipe weighting is symmetric (liked +1, disliked -1, skipped 0) and each swipe is persisted immediately via one server action; quota is 25 reason model calls per user per day (one call per feed build).
- Learner-relevant: Concrete agentic-engineering mechanics. Skills used: architect then develop. Commands: `check verify` (runs Playwright browser tests — spins up Chrome, creates an account, clicks through flows), `pmpmdev` on `localhost 3000`. Build plan of 15 tasks on branch `feed core taste loop`; verify steps derived from acceptance criteria saved for later. Requires adding `anthropic` and `openai` API keys. Auth gotcha: Google provider must be enabled manually in the Supabase dashboard and needs a Google Cloud OAuth web client ID + secret + authorized redirect URI (from Supabase, `console.cloud.google`); Google name/avatar pulled for personalization; "refresh my feed" action marks old picks seen and inserts 12 new, excluding already-picked. Debug case fixed a Next.js 16 `next/image` `priority` prop deprecation by switching to `preload`/`loading="eager"`. Rule five (reason sentences persisted) and rule six (daily quota) reappear.

### app-showcase
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/13. App Showcase.srt#app-showcase]]`
- Summary: End-to-end showcase of the finished first slice: the author rates ~20 movies (like/dislike/skip via buttons or drag-and-drop), encounters runtime errors, debugs them, and successfully builds the feed. The feed returns 12 picks each with a one-sentence reason tied to what was just rated, and the feature is marked complete.
- Key claims: Rating 20 movies is enough to produce a personalized feed (Reservoir Dogs shown as the hero pick with a reason referencing Whiplash's psychological intensity); two errors appeared — "cannot update component" console error and "fetch failed" — and re-running the app locally resolved them, though the author cross-verified with debug; the remaining features follow the same architect→develop core loop, so the author skips repetitive parts and closes the module; feeding a full Letterboxd list would improve results further.
- Learner-relevant: Reinforces debug workflow (copy both errors, use debug in a new agent window, re-run locally to surface terminal info) and that 20 ratings is the practical minimum. Concrete: 12 picks with one sentence each; "mark the current feature as completed" to close the loop; feature seven is next; scope shows the feature closed by hand after check/verify.

### final-pro-tip
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/14. Final Pro Tip.srt#final-pro-tip]]`
- Summary: A short closing tip showing the workflow can be both fast and thorough. Rather than architecting and developing one feature at a time, you can architect several features upfront (or let the agent answer its own questions by choosing the recommended answer), then build them all together in a single session.
- Key claims: Architecting features upfront lets the agent traverse all specs and deliver a professional solution on its own; you remain the architect and can still check the specs, but then "let the agent fly"; this yields both speed and precision (the best of both worlds).
- Learner-relevant: Practical throughput technique for the architect→develop workflow — batch-architect then batch-develop, using the agent's recommended answers to move fast while retaining control over specs.
