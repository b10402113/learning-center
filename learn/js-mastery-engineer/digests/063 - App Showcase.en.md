---
source: sources/js-mastery-engineer/20261107/course/063 - App Showcase.en.txt
source_type: text
source_lines: 53
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The lesson demonstrates the finished onboarding loop: rating films by button or drag, dropping titles that were not watched, and finishing the deck to build a feed.
- Two errors appear at the end (a console warning about setting state on an updated component and a fetch failure) and the build-feed button appears dead; the human copies both into `debug`, and rerunning the app locally makes it work again.
- The built feed returns 12 picks, each with a tailored sentence — for example Reservoir Dogs explained through relentless tension and moral ambiguity echoing Whiplash — validating that 20 ratings are enough to produce a plausible taste profile.
- The feature is marked complete by hand, and the lesson states that the remaining features follow the same architect → develop core loop, so the module can end here.

# L2 detail

- `#L1-L13` — Shows swiping and rating the deck, with personal commentary on individual films.
- `#L14-L32` — Captures two runtime errors, runs `debug`, reruns locally, and confirms the feed builds with 12 reasoned picks.
- `#L33-L53` — Reviews the recommendation quality, closes the feature, and explains that later features repeat the same loop.
