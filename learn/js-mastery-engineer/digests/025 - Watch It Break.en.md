---
source: sources/js-mastery-engineer/20261107/course/025 - Watch It Break.en.txt
source_type: text
source_lines: 33
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Opens the vibe-coded app's feed and shows that every page load calls Opus, the most expensive model, live in the request path to generate recommendations from scratch, then fires parallel TMDB validation requests.
- The feed takes 40 seconds every time, and refreshing regenerates a fresh set of recommendations rather than returning a stable answer.
- Demonstrates with three tabs on the same account and taste profile refreshed seconds apart: three different answers, and even the same movie gets completely different reasoning, because each tab triggers fresh generation and a fresh guess.
- Argues this means high token cost and no stable opinion about the user — the app has a new opinion every time asked.
- Notes all of these behaviors were invisible in the demo.
- Previews opening the code next to find where each error was born, with the spoiler that none were decided — they were all defaults the AI chose instead of the developer.

# L2 detail

- `#L1-L6` — Opens the feed and explains that every page view calls Opus live in the request path to generate recommendations from scratch, then batches parallel TMDB validation.
- `#L7-L14` — Shows the 40-second load repeating on refresh, with newly fetched recommendations rather than reuse, making the feed a slot machine.
- `#L15-L28` — Runs the three-tab test showing same person, same instant, three different answers with different reasonings, then explains there is no lookup and every tab forces a fresh guess with high token cost and no stable opinion.
- `#L29-L33` — Notes these behaviors were invisible in the demo and previews the code autopsy, where all of them turn out to be defaults rather than decisions.
