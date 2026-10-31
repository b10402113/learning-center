---
source: sources/claude-code-master/20261031/4-Volume C - Memory/2-Module C2 - Claude MD best practices/2-Module_C2_-_Claude_MD_best_practices.en.vtt
source_type: text
source_lines: 409
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Core mechanic — CLAUDE.md works like an employee handbook that Claude Code reads at the start of every session, turning it into instructions for the agent.
- Four pillars — a good CLAUDE.md should handle identity, goals, rules, and a map of the workspace.
- Identity and goals — identity can be three lines (name, role such as chief of staff, vibe); goals should state the end state so every suggestion can be filtered by whether it moves the needle.
- Rules — the operational part: writing rules (avoid em dashes, prefer plain non-technical English) and approval rules for commands that spend credits, such as generative AI model calls.
- Self-updating — the recommended habit is asking Claude to edit its own CLAUDE.md when a rule is needed, or to self-assess improvements against the four pillars.
- Workspace map — CLAUDE.md should also map business domains (content, community, product development, design, operations) to folders so the agent can navigate instead of getting lost.
- Maintenance stance — do not overthink it; only self-update when Claude misbehaves or drifts from spec.

# L2 detail

- `#L1-L46` — Opening: CLAUDE.md as the employee handbook read every session; most existing workspaces already have one, and the file becomes the agent's standing instructions.
- `#L47-L115` — Pillar one, identity: a three-line identity block, naming the agent (Robo), giving it the role of chief of staff, and stating its vibe, which matters when building for clients.
- `#L116-L178` — Pillar two, goals: goals need not be detailed but must state the end state; the speaker's "conversation filter" checks whether every suggestion moves the needle toward them.
- `#L179-L262` — Pillar three, rules: the real handbook section covering writing rules (no em dashes, plain non-technical English for non-coders) and approval rules before running commands that cost credits, with usage dictating which rules apply.
- `#L263-L307` — Self-editing practice: ask Claude to edit its own CLAUDE.md when a rule is missing, plus a supplied prompt that lets Claude self-assess against the four pillars and suggest additions.
- `#L308-L409` — Pillar four, workspace map: domains like content, community, product development, design, and operations mapped to folders so Claude can navigate; update only when output is off-spec, and identity + goals + rules + map is enough for a simple CLAUDE.md.
