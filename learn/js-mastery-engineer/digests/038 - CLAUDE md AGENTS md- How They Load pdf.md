---
source: sources/js-mastery-engineer/20261107/supplement/038 - CLAUDE md AGENTS md- How They Load pdf.txt
source_type: text
source_lines: 70
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- From Claude Code v2.1.277 (Sept 18, 2026), if a folder has no `CLAUDE.md`, Claude Code checks for and uses `AGENTS.md` as always-on context.
- A rule reaches the agent either by exploration (a maybe, not reliable) or always-on context (a guarantee loaded before you type).
- The fallback only applies when `CLAUDE.md` is absent; once any `CLAUDE.md` exists, even a one-liner, `AGENTS.md` is back to being a maybe unless explicitly imported.
- The fix is to keep shared rules in `AGENTS.md` and add `@AGENTS.md` at the top of `CLAUDE.md`; Claude Code expands the import at session start and appends Claude-only notes below.
- A symlink (`ln -s AGENTS.md CLAUDE.md`) also works when there are no Claude-only notes; on Windows prefer the import because symlinks need admin.
- Whether imported or loaded by fallback, `AGENTS.md` enters context in full at launch, so the keep-it-small rule still applies.
- Check with `/context` (look for the Memory files line) and `/memory` (imported files are tagged `@-imported`); no Memory files line means nothing loaded.

# L2 detail

- `#L1-L18` — the AGENTS.md support update and the two ways a rule reaches the agent
- `#L19-L30` — the catch: fallback only works while no `CLAUDE.md` exists
- `#L31-L57` — the import fix, how expansion works, and the symlink alternative
- `#L58-L70` — full loading cost, the `/context` and `/memory` checks, and keeping always-on small
