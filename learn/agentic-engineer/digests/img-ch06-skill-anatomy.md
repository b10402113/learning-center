---
source: sources/agentic-engineer/20261030/6. Skills — The System You Needed/2. How to Read a SKILL.md file.png
source_type: image
source_lines: 0
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

A slide card titled "The Anatomy of a Skill", from the lesson on reading a SKILL.md file. Read by OCR from the PNG.

- Root: `SKILL.md` is the only required file; everything else is optional.
- Frontmatter: `name` + `description`. The description is the trigger — the line the agent reads to decide whether the skill fires. A vague description means it fires on the wrong tasks or never fires at all.
- Body: plain instructions for the agent — what it is for, when to use which part, the steps, the gotchas. You don't read it front to back, and neither does the agent.
- Optional helpers, loaded only when needed: `scripts/` (code the agent runs when a job must be exact — only the output enters context, not the code), `references/` (extra docs opened only when the task needs them), `assets/` (templates, images, files the skill uses in its output).
- The line that matters most is the description: the body can be perfect and the skill still won't fire if the description doesn't tell the agent when to use it.

# L2 detail

- `sources/agentic-engineer/20261030/6. Skills — The System You Needed/2. How to Read a SKILL.md file.png` — slide: SKILL.md anatomy (frontmatter/body), description as trigger, and the three lazy-loaded helper folders.
