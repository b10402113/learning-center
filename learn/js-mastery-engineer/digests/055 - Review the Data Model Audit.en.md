---
source: sources/js-mastery-engineer/20261107/course/055 - Review the Data Model Audit.en.txt
source_type: text
source_lines: 21
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- After `check verify`, the next step is `check review`, which reviews the implementation with a model different from the one that wrote the code; Opus wrote it, so Sonnet is used for a fresh perspective.
- The review reads 37 files and finds one major issue: the ratings schema has no database constraint tying score nullability to state, so invariant 4 lives only in application code, plus four minor findings.
- The fix is applied and proves itself with a new migration rather than editing the old one, because the migrator goes by timestamp and editing would silently skip reapplication; the migration is then re-run.
- The feature's last remaining step is to document it with the document skill.

# L2 detail

- `#L1-L8` — Runs `check review` on the data model, detects Opus as the author, and chooses Sonnet for a fresh-eyes review.
- `#L9-L16` — Reports 37 files reviewed, the one major invariant-4 finding, four minor issues, and the applied fix.
- `#L17-L21` — Explains why the fix ships as a new migration instead of editing the old one, re-runs the migration, and hands off to documentation.
