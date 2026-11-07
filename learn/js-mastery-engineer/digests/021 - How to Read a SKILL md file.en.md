---
source: sources/js-mastery-engineer/20261107/course/021 - How to Read a SKILL md file.en.txt
source_type: text
source_lines: 57
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Opens an example from Anthropic's public skills repo (the PDF skill) to show a SKILL.md is ordinary markdown with structured frontmatter and no special skill syntax.
- Identifies the two frontmatter fields that matter, name and description, and calls the description the most important line because it is the trigger that decides when the skill fires.
- Explains the agent reads every skill's name and description to decide relevance and does not look at the instructions until the description convinces it; a vague description fires on wrong tasks or misses right ones.
- Describes the body as plain instructions briefed like to a good teammate: what the skill is for, which approach to use, the steps, and pitfalls.
- Shows a skill can be a folder, not one file: the SKILL.md points to files like forms.md and reference.md, which load only when a task reaches for them.
- Explains scripts as the strongest version of this: the agent runs a script and only the result returns, so the code never enters the conversation and most of a big skill costs nothing until used.
- Summarizes the anatomy: a folder with SKILL.md at its root, description decides when it fires, body tells how, and heavy helpers (scripts, deep docs) load on demand.
- Also notes assets such as templates or images that the skill drops into its output.

# L2 detail

- `#L1-L5` — Introduces Anthropic's public skills repo, opens the PDF skill, and notes its SKILL.md is just a clean markdown file to read.
- `#L6-L9` — Points out there is no special syntax; it is markdown like a readme with a little structured info at the top, and identifies name and description in the frontmatter.
- `#L10-L17` — Explains the description as the trigger, how the agent scans names and descriptions, and why a vague description makes a skill fire wrongly or not at all.
- `#L18-L23` — Describes the body's shape: purpose, which approach when, steps to follow, and pitfalls, written like a brief to a good teammate.
- `#L24-L31` — Reveals a skill can be a whole folder with forms.md, reference.md, and a scripts folder, and shows SKILL.md pointing at forms.md in its quick reference.
- `#L32-L37` — Explains that pointed-to files load only when the task needs them, so forms.md is untouched during plain PDF text extraction and reference.md loads only for deep details.
- `#L38-L45` — Explains that scripts run for exact jobs and only their result returns, so the code never enters the conversation and a large skill costs nothing until used.
- `#L46-L53` — Generalizes the anatomy with scripts, assets (templates/images), name-and-description, body, and optional on-demand helpers.
- `#L54-L57` — Summarizes the whole anatomy and transitions to building your own skill.
