---
source: sources/js-mastery-engineer/20261107/supplement/070 - sync- Understand It Then Automate It.txt
source_type: text
source_lines: 24
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Code changes can leave documentation out of sync, which causes confusion.
- /sync bridges the gap between code and documentation at the end of the development cycle.
- Run /audit first to confirm coding standards and tooling are correct before syncing.
- Initializing a git repository is a prerequisite for /sync.
- /sync uses git diff and log to determine what changed.
- Small documentation changes to agents.md and scope.md can trigger sync actions.
- The skill is lightweight and safe enough to run frequently.
- The lesson shows fixing issues manually in preparation for automating later.

# L2 detail

- `#L1-L4` — title block and lecture summary header
- `#L5-L13` — the drift problem and /sync as the reconciler at the end of the cycle
- `#L14-L20` — prerequisites: audit first, a git repo, and using git diff/log to find changes
- `#L21-L24` — lightweight repeatable use and the manual-then-automated progression
