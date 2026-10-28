---
source: sources/claude-code-master/20261028/3-Volume B - Skills
source_type: text
source_lines: 113
status: absorbed
absorbed_at: 2026-10-28
created: 2026-10-28
updated: 2026-10-28
---

# L1 overview

**Volume B — Skills** (5 modules, slide text only). Skills are "recipe cards" the agent follows — the fastest way to feel the power of agentic tools and the S of ARMS.

- **B1 Skills Explained** — a skill is just a markdown file: a description up top, instructions in the body. Claude Code preloads only each skill's name, description, and triggers until you invoke it, so a big skill library stays light on context. You can invoke by name, with a slash command, or let Claude pick.
- **B2 Creating Good Skills** — the "two-times rule": if you've prompted the same thing twice, save it as a skill. The align skill asks clarifying questions before a big task. The most natural way to build a skill is to save a whole finished work session as one.
- **B3 Advanced Skills** — a skill isn't only markdown: it can carry its own scripts, reference files, and assets (e.g. a brand book that builds itself as you work). One skill can call another (robo can pull in align every time).
- **B4 Installing Skills Safely** — before installing an online/GitHub skill, run a "check-if-clean" prompt because some skills carry malicious code; switch to a powerful model for this one job. The personalize skill bundles this check into one command.
- **B5 How many Skills is too many?** — rule: as long as it doesn't confuse you or Claude, you're fine. A one-prompt audit merges and trims the library in <30 min; the context command shows the true token cost of skills.

# L2 detail

- `#L94-L97` — `sources/claude-code-master/20261028/3-Volume B - Skills/1-Module B1 - Skills Explained/index.html` — skill = markdown recipe card; only name/description/triggers preloaded; invocation methods.
- `#L94-L97` — `sources/claude-code-master/20261028/3-Volume B - Skills/2-Module B2 - Creating Good Skills/index.html` — two-times rule; align skill; save-a-session-as-skill.
- `#L94-L97` — `sources/claude-code-master/20261028/3-Volume B - Skills/3-Module B3 - Advanced Skills/index.html` — skills with scripts/references/assets; skills calling skills.
- `#L94-L97` — `sources/claude-code-master/20261028/3-Volume B - Skills/4-Module B4 - Installing Skills Safely/index.html` — check-if-clean prompt, malicious-code risk, personalize skill.
- `#L94-L97` — `sources/claude-code-master/20261028/3-Volume B - Skills/5-Module B5 - How many Skills is too many-/index.html` — when skills are too many, one-prompt audit, token cost check.
