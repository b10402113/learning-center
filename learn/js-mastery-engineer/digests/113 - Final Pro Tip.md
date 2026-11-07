---
source: sources/js-mastery-engineer/20261107/supplement/113 - Final Pro Tip.txt
source_type: text
source_lines: 33
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The lesson details the Core Taste Loop of ScopeMD: its features, sign-in methods, and film recommendation generation using real accounts and inputs.
- The first five ScopeMD features are completed, allowing progress to the Core Taste Loop.
- The loop provides a streamlined sign-in process and user interaction with a starter deck of films.
- Onboarding requires rating at least five films from a deck of twenty, with recommendations based on those ratings.
- Google Sign-In is favoured for convenience, while password sign-ups require email verification.
- The system pre-fetches a pool of about 500 films and builds a feed of up to 12 movie picks per session.
- Swipes (likes, dislikes, skipped) refine the taste vector and recommendations, and on-demand refresh lets users revisit stored picks after logging back in.
- Debugging identified and fixed an issue with notably missing film posters on initial reloads.

# L2 detail

- `#L1-L10` — the lesson's scope: Core Taste Loop architecture and a user-friendly onboarding with real accounts.
- `#L11-L27` — sign-in, five-of-twenty onboarding, 500-film pool, 12 picks per session, swipe logging, refresh, and the poster bug fix.
- `#L28-L33` — footer showing 0 comments.
