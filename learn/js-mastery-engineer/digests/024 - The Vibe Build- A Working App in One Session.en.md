---
source: sources/js-mastery-engineer/20261107/course/024 - The Vibe Build- A Working App in One Session.en.txt
source_type: text
source_lines: 37
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Shows the vibe build compressed from a single session: one prompt asked for a movie recommendation app with sign-in, Letterboxd CSV import or swipe onboarding, a personalized feed with reasons, and a vibe search.
- The agent scaffolds Next.js, wires Supabase auth, builds swipe cards, the feed page, and the import endpoint.
- For recommendations it asks the smartest model to generate them from the user's taste, then validates each suggestion against the TMDB database so nothing hallucinated slips through — a validation step the narrator credits as clever.
- The session produced about 2,000 lines of code, and the demo works: sign-in, swipe onboarding, feed generation, genuinely good deep-cut recommendations, and a vibe search that understands queries like "Blade Runner but funnier".
- The lesson explicitly does not call vibe coding bad; the app works, the speed is real, and the seduction of building a full app is real.
- What a demo hides: concurrent users, page-load cost, and an agent-made decision buried in the engine file that becomes a costly monthly bill at scale because nobody decided it.
- Concludes that demos hide economics, load times, and token costs, and transitions to showing how the app behaves for real.

# L2 detail

- `#L1-L7` — Frames the compressed single-session build and gives the one-prompt specification covering auth, Letterboxd import or swipe onboarding, feed with reasons, and vibe search.
- `#L8-L15` — Describes the scaffold (Next.js, Supabase auth, swipe cards, feed page, import endpoint), the generate-then-validate recommendation approach, and the resulting 2,000 lines of code.
- `#L16-L25` — Shows the working demo: sign-in, swipe onboarding, feed generation, quality deep-cut recommendations, and a vibe search that understands natural queries.
- `#L26-L33` — Refuses to call vibe coding bad, affirms the app works and the speed is real, then lists what the demo hides: concurrency, per-page cost, and an agent decision in the engine file that becomes a monthly bill.
- `#L34-L37` — Concludes that demos hide economics, load times, and token costs, and transitions to real behavior.
