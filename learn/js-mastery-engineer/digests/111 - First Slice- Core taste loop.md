---
source: sources/js-mastery-engineer/20261107/supplement/111 - First Slice- Core taste loop.txt
source_type: text
source_lines: 24
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- With the first five features of ScopeMD completed, the lesson architects the Core Taste Loop.
- The loop lets users sign in, swipe through a small deck of films, and receive a personalised feed based on their ratings.
- Authentication methods are email/password, magic link and Google sign-in, with Google preferred for modern ease.
- Onboarding is complete when the user rates at least five films from a fixed deck of twenty.
- Recommendations come from a pre-fetched pool of films to avoid delays during interaction.
- Ratings may update the database immediately, though batching these updates could be considered.
- The architecture must accommodate a taste vector, with rules for how likes and dislikes affect the profile.
- Swipes trigger refreshes that exclude previously picked films from new recommendations.

# L2 detail

- `#L1-L8` — the starting point: five features done and the Core Taste Loop up next.
- `#L9-L24` — the loop's sign-in, onboarding, pre-fetched recommendations, taste vector, and refresh behaviour.
