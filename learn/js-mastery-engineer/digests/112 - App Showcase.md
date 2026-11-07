---
source: sources/js-mastery-engineer/20261107/supplement/112 - App Showcase.txt
source_type: text
source_lines: 26
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The lesson walks through the Core Taste Loop of ScopeMD, covering architectural decisions for sign-in, movie rating and recommendations.
- The first five features are complete and focus shifts to the Core Taste Loop.
- Users sign in via email/password, Magic Link, or Google sign-in.
- Onboarding is complete after rating at least five films from a starter deck of 20.
- Recommendations draw from a fixed pool of popular and top-rated films based on user ratings.
- Each feed build generates 12 movie picks, each with a one-sentence reason.
- Input values are defined: "liked" +1, "disliked" -0.5, "skipped" 0.
- The taste vector is rebuilt after onboarding, and middleware handles session refreshing and redirection.

# L2 detail

- `#L1-L8` — the lesson's focus: Core Taste Loop architecture.
- `#L9-L26` — sign-in methods, onboarding, recommendation pool, 12 picks with reasons, input weights, taste-vector rebuild, session middleware.
