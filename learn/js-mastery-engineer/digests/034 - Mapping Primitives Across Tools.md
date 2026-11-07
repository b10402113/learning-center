---
source: sources/js-mastery-engineer/20261107/supplement/034 - Mapping Primitives Across Tools.txt
source_type: text
source_lines: 100
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The lesson tests the promise that four primitives transfer across tools by comparing Claude Code with Codex.
- Tools, Skills, MCP and Subagents all map across; names barely change and in most rows do not change at all.
- Skills are literally the same file: a Codex skill is a folder with a `SKILL.md`, and a Claude Code skill folder can be copied byte for byte and used unchanged.
- The one real divergence is the always-on file: Codex reads `AGENTS.md` directly, while Claude Code reads `CLAUDE.md` and needs an `@AGENTS.md` line to pull the shared context in.
- The takeaway is to learn the primitive once and look for the same four things under new labels, since the shape underneath rarely changes.

# L2 detail

- `#L1-L10` — the promise from the start of the module and the decision to test it against Codex
- `#L11-L46` — the four-primitive comparison table across Claude Code and Codex
- `#L47-L69` — skills as the same file, copied untouched between tools
- `#L70-L81` — the one real difference: `AGENTS.md` vs `CLAUDE.md` and the `@AGENTS.md` import
- `#L82-L100` — what this means for future tools and the transition to the model lesson
