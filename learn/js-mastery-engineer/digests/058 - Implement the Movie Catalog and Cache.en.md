---
source: sources/js-mastery-engineer/20261107/course/058 - Implement the Movie Catalog and Cache.en.txt
source_type: text
source_lines: 71
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Develop builds the movie catalog and cache to spec 0003 and all 10 build-plan tasks, loading the spec, conventions, and InGest skill, and proceeds while the human gathers the TMDB and InGest keys.
- Check verify takes about 10 minutes and exercises 53 of 62 checklist steps, leaving 9 unexercised; it finds one real defect: event-level deduplication is dead because a spread overrides the custom ID with undefined, fixed by moving the ID after the spread.
- The human skips check review, syncs, and moves on; the lesson notes the workflow is flexible enough to architect several features up front and develop them together, though questions still need answers.
- Verification checks real film IDs, empty overviews, 404s, silent exits, caller vs client time budgets, and AC7 event results, and sync cleans two stale facts in the root AGENTS.md.

# L2 detail

- `#L1-L12` — Starts development, notes loaded context, and chooses to build while the TMDB and InGest keys are gathered.
- `#L13-L22` — Completes feature four (10 build tasks), flags AC12 still unproven, confirms keys were added, and starts verify.
- `#L23-L40` — Reports 53/62 steps passed and the event-level dedup defect, applies the fix, skips review, and moves toward design.
- `#L41-L52` — Reflects on batching features and confirms the fix is proven.
- `#L53-L71` — Details the verification exercises and the sync of stale AGENTS.md facts before the design language lesson.
