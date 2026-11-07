---
source: sources/js-mastery-engineer/20261107/supplement/051 - Watch It Break.txt
source_type: text
source_lines: 21
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The vibe-coded app generates recommendations every time the feed is opened, using the Opus model to create suggestions live.
- Each page load takes approximately 40 seconds.
- Refreshing generates a new set of recommendations from scratch regardless of visual similarity.
- Recommendations come from fresh AI analyses, so suggestions differ each time.
- The app has no stable view of the user; it forms a new opinion on every request.

# L2 detail

- `#L1-L7` — overview of the vibe-coded feed and live Opus generation
- `#L8-L21` — feed generation timing, refresh behavior, and the lack of a stable user view
