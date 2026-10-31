---
source: sources/claude-code-master/20261031/3-Volume B - Skills/1-Module B1 - Skills Explained/1-Module_B1_-_Skills_Explained.en.vtt
source_type: text
source_lines: 379
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- What a skill is — a skill is a "recipe card" the agent keeps: a Markdown file with a description header and a body of instructions the agent follows when the skill is invoked.
- Default location — skills live in the `.claude` folder of the workspace; the instructor's skills were all created by the agent, not hand-written.
- Two-part structure — `SKILL.md` carries a name and description that are added to every request, while the body is not preloaded and only loads when the skill is invoked.
- Preloading mechanics — in a fresh session the agent sees only each skill's name, description, and trigger phrases (180 skills in the demo), not the full bodies; whole-text preload is limited to memory files.
- Invocation methods — say the skill name in plain language, type `/` plus the skill name, or let Claude pick a skill based on the job.
- `/robo` demo — invoking `/robo` reads the design-system `SKILL.md` and injects it into the session, producing a slide with the assigned font, dot-matrix design, colors, and visuals.

# L2 detail

- `#L1-L33` — Framing: skills are the most useful Claude Code feature, used daily, and the fastest way to feel the power of agentic coding platforms. Defines a skill as a recipe card and a plain Markdown text file.
- `#L34-L87` — Anatomy of the file: description at the top plus a body of instructions for when the skill is invoked. Example: the `/robo` skill created the course slides; skills by default live in the `.claude` folder and were all agent-created.
- `#L88-L152` — Looking at `.claude/robo/SKILL.md`: each skill has a top section giving its name and description; hovering shows the description is added to every request and used to decide when to load the skill; the body is not automatically loaded, only on invocation. The robo skill is long because it encodes a slide design system.
- `#L153-L252` — Testing preloaded context: a prompt asks what skills and exact text are preloaded in a raw new session. Memory files appear in full, but the 180 skills are only listed — name, description, and trigger phrases, nothing more.
- `#L253-L307` — How to invoke: say the skill's name ("run the robo skill") since its description is already preloaded; type `/` and the skill name to invoke directly (the slash menu mixes custom skills with built-in Claude Code commands); or let Claude choose the skill for the task.
- `#L308-L379` — `/robo` walkthrough: a prompt asks for a sample one-slider greeting. The agent finds the skill, reads `SKILL.md`, injects the whole file as context, then builds the slide with the assigned font, dot-matrix design, colors, and visual styling from the design-system skill.
