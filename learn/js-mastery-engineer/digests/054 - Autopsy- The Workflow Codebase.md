---
source: sources/js-mastery-engineer/20261107/supplement/054 - Autopsy- The Workflow Codebase.txt
source_type: text
source_lines: 25
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The lesson contrasts engineering an app with merely coding it, using a recommendation system as the example.
- The feed builds a taste vector from ratings, making database calls efficient and page loads nearly free.
- AI only generates reasons when necessary, so it does not slow page load.
- Caching recommendations is a deliberate decision that cuts cost and improves user experience.
- Import handles data integrity by matching rows and avoiding information loss.
- Search is built as a simple, efficient pipeline using user profiles and structured intent.
- Tests reflect acceptance criteria, and the codebase is driven by purposeful decisions rather than defaults, unlike the earlier reviewed one.

# L2 detail

- `#L1-L9` — intro: engineering vs coding, using the recommendation system as the example
- `#L10-L25` — the decisions: taste vector and cheap feed, conditional AI reasons, caching, safe import, search pipeline, acceptance-criteria tests, and the comparison
