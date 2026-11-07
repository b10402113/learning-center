---
source: sources/js-mastery-engineer/20261107/supplement/046 - Build Your Own Skill pdf.txt
source_type: text
source_lines: 38
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The lesson builds a "teach me" skill: it asks the user's level (beginner, medium, pro) before explaining, asks for a topic when none is given, and verifies online when unsure or possibly out of date.
- Fast path: install skill-creator (`/plugin install skill-creator@anthropicagent-skills`; it is pre-installed in Claude Desktop and Cowork).
- Invoke it and describe the skill in plain language, being specific about when it should trigger, because that precision becomes the description that acts as the trigger.
- It runs a short Q&A where each question is a decision you can accept as default or override, then generates the full skill folder.
- Personal skills live in `~/.claude/skills/` (right for how you work); project skills live in `.claude/skills/` in the repo (right for team conventions and shared workflows).
- skill-creator gives a working skill in minutes, but getting one you trust in real work takes iteration and testing — the gap the workflow's nine skills have already closed.

# L2 detail

- `#L1-L7` — the teach-me skill prompt and its required behaviors
- `#L8-L24` — the fast path with skill-creator: install, describe, answer the Q&A, generate
- `#L25-L32` — where the skill lands: personal vs project scope
- `#L33-L38` — easy to make vs hard to make well
