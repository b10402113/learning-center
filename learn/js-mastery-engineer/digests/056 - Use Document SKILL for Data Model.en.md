---
source: sources/js-mastery-engineer/20261107/course/056 - Use Document SKILL for Data Model.en.txt
source_type: text
source_lines: 57
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The document skill asks for a doc type and the recommendation is a PR description, since the branch is three commits ahead of main with no PR open; changelog, release notes, and postmortem are the other options.
- It reads the commits/diff, the review findings, and the scope, then writes a PR body covering what the change implements, design reasoning, verification record, wiring, and how to test and verify.
- Committing the outstanding file, opening PR #2, and merging closes the data-model feature: four commits, 33 files, nine tables, five enums, handwritten migration SQL, the scoped query helper, seed script, and Drizzle wiring.
- The next foundation is feature four, movie catalog and cache, which blocks real data because today's starter deck comes from a checked-in file; then design system and UI foundation.

# L2 detail

- `#L1-L14` — Documents the data-model change, presents doc-type options, and chooses a PR description.
- `#L15-L27` — Reviews branches, findings, and scope, writes the PR body, and offers to commit and open the PR.
- `#L28-L45` — Merges PR #2, lists what shipped, and notes the still-open region and acceptance items.
- `#L46-L57` — Sets up feature four (movie catalog and cache) and explains its done condition before the design system.
