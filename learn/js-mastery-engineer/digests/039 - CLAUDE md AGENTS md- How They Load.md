---
source: sources/js-mastery-engineer/20261107/supplement/039 - CLAUDE md AGENTS md- How They Load.txt
source_type: text
source_lines: 24
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The lesson creates a Next.js project repo to explain how rules are loaded from CLAUDE.md and AGENTS.md files.
- Rules reach the agent two ways: exploration is a maybe, while always-on context guarantees loading at the start of every session.
- The `/context` command shows exactly what loaded into the current session.
- `/memory` lists the files treated as always-on, making them easier to manage.
- Bloating the always-on context with unnecessary rules costs tokens on every session.
- The audit skill continuously updates AGENTS.md to retain only relevant rules.
- Always verify file load status with the available commands instead of assuming.

# L2 detail

- `#L1-L10` — lecture summary and the exploration vs always-on distinction
- `#L11-L24` — key points: the commands, the cost of bloat, the audit skill, and verifying rather than assuming
