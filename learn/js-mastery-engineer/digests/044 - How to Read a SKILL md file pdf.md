---
source: sources/js-mastery-engineer/20261107/supplement/044 - How to Read a SKILL md file pdf.txt
source_type: text
source_lines: 41
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- A skill's root is `SKILL.md`, the only required file; everything else is optional.
- Frontmatter holds `name` and `description`; the description is the trigger the agent reads to decide whether the skill fires, so a vague one fires on the wrong tasks or never.
- The body is plain instructions: what the skill is for, when to use which part, the steps and the gotchas; it is not read front to back.
- Optional helpers load only when needed: `scripts/` (code the agent runs when a job must be exact; only the output enters context), `references/` (docs opened when the task needs them), `assets/` (templates, images, files used in output).
- The description is the line that matters most: the body can be perfect and the skill still will not fire if the description does not say when to use it.

# L2 detail

- `#L1-L6` — the anatomy heading and `SKILL.md` as the only required file
- `#L7-L20` — frontmatter (`name`, `description`) and the body instructions
- `#L21-L33` — optional `scripts/`, `references/` and `assets/` helpers loaded only when needed
- `#L34-L41` — why the description is the line that matters most
