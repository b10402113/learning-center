---
source: sources/claude-code-master/20261031/3-Volume B - Skills/3-Module B3 - Advanced Skills/3-Module_B3_-_Advanced_Skills.en.vtt
source_type: text
source_lines: 334
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Skills are more than one Markdown file — a skill folder can hold scripts, references, and other assets; some useful skills are only two or three lines, but complex ones expand beyond the recipe card.
- `/last30days` as the complex example — extracts information on the past 30 days across eight sources, using a Markdown recipe card plus scraping scripts and brief-format references.
- `/robo` + `brandbook.html` — the robo skill folder includes a `brandbook.html` opened in the browser as the reference for slide and web design style; the skill invokes it as a visual-style reference.
- Let artifacts emerge naturally — if Claude suggests creating artifacts while building a skill, direct it to; do not feel obliged to read every skill top to bottom.
- Skills can call other skills — the robo skill was changed to invoke `/align` first, adding a "step zero" before any robo work because designs are token-intensive and alignment should come first.
- Agent edits are verbose on purpose — think of the agent as an employee more verbose than you'd like; you manage outcomes, not every thought, even if real-time edits look intimidating to non-developers.
- Result — the robo `SKILL.md` gains "before any Robo work, always invoke the align skill directly", so invoking robo naturally loads align into the same session.

# L2 detail

- `#L1-L33` — Correction to a popular belief: a skill is not only a Markdown file and can expand. Some skills are two or three lines long and still effective, but the most complex tasks can use folders richer than one file.
- `#L34-L87` — `/last30days` example: extracts information on the past 30 days across eight different sources. In the workspace skills folder it has the Markdown recipe card plus scripts/code to scrape sources and references for what the brief should look like.
- `#L88-L149` — Teaser for safe online installation (covered in the next module). The `/robo` folder is already well-defined but also contains `brandbook.html`, opened in the browser as the reference brandbook for slide and web design style.
- `#L150-L199` — Advice: let assets and artifacts come about naturally; if Claude suggests creating artifacts as part of the skill, direct it to that. You do not need to read skills top to bottom; the brandbook emerged from building the design system, and updating the skill added a line invoking the brandbook as visual-style reference.
- `#L200-L240` — Skills can call other skills. Goal: make `/robo` always use `/align` so it asks clarifying questions first, since slide and design work is token-intensive and alignment before work is in your interest.
- `#L241-L301` — The agent thinks through the problem and edits `robo/SKILL.md`. For non-developers, real-time edits can intimidate; reframe the agent as an employee more verbose than you would like — you care about final output. The edit adds a "step zero".
- `#L302-L334` — Resulting skill: before any Robo work, always invoke the align skill directly. On invocation the session gets that instruction, finds the align skill, and reads it as well.
