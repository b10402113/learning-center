---
source: sources/claude-code-master/20261028/4-Volume C - Memory
source_type: text
source_lines: 1
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-28
updated: 2026-10-28
---

# L1 overview

**Volume C — Memory** (8 modules, slide text only). Memory is the M of ARMS: the file cabinet that stops a growing workspace from quietly eating your tokens. Two key files (CLAUDE.md and MEMORY.md) and two levels of memory (always-loaded vs pulled-on-demand).

- **C1 How Memory Works** — memory = a file cabinet the agent files into and retrieves from. Two files, two levels: CLAUDE.md and MEMORY.md do different jobs; one level loads every session, the other is pulled on demand.
- **C2 CLAUDE.md Best Practices** — CLAUDE.md is the "employee handbook" read at the start of every session. Four things it should do: set identity, give goals, lay out rules, map the workspace. Ask Claude to suggest its own updates when sensible.
- **C3 The Two CLAUDE.md's** — there are two files: a project CLAUDE.md and a global one. Project file carries rules/goals/identity/map; most power users (incl. presenter) keep everything in one project rather than scattering it.
- **C4 Use /init** — you don't hand-write CLAUDE.md; the slash init command reads the whole workspace and drafts one (or suggests improvements without overwriting). Run it when Claude starts getting confused, not daily.
- **C5 Memory.md Explained** — MEMORY.md is not a giant dump; it's a short index pointing to the memory files you've built. Claude looks through the cabinet and pulls only the relevant artifacts instead of loading everything.
- **C6 Automatic Memory** — MEMORY.md mostly fills itself: recent Claude Code writes memories when it decides a conversation is worth keeping; you can ask it to remember a nugget; you can check/toggle auto memory from the terminal.
- **C7 Memory in Context** — both memory files load every session, so know their cost. Check token cost with the context command; know what a healthy size is; audit when they creep past a level that dents your plan.
- **C8 The Calibrate Skill** — run at the end of almost every session: it reviews the session, spots where you corrected/gave feedback, folds those lessons into memory, and suggests skill updates. This is how a chatbot becomes a teammate tuned to you.

# L2 detail

- `#L1-L1` — `sources/claude-code-master/20261028/4-Volume C - Memory/1-Module C1 - How Memory Works/index.html` — memory as file cabinet; two files (CLAUDE.md, MEMORY.md); two levels (every session vs on-demand).
- `#L1-L1` — `sources/claude-code-master/20261028/4-Volume C - Memory/2-Module C2 - Claude MD best practices/index.html` — CLAUDE.md as employee handbook; identity, goals, rules, workspace map; self-suggested updates.
- `#L1-L1` — `sources/claude-code-master/20261028/4-Volume C - Memory/3-Module C3 - The two Claude MDs/index.html` — project vs global CLAUDE.md; keep one project file as the second brain.
- `#L1-L1` — `sources/claude-code-master/20261028/4-Volume C - Memory/4-Module C4 - Use -init/index.html` — /init reads workspace, drafts/improves CLAUDE.md without overwriting; when to run.
- `#L1-L1` — `sources/claude-code-master/20261028/4-Volume C - Memory/5-Module C5 - Memory MD explained/index.html` — MEMORY.md as short index into per-fact memory files; pull relevant artifacts only.
- `#L1-L1` — `sources/claude-code-master/20261028/4-Volume C - Memory/6-Module C6 - Automatic memory/index.html` — auto memory writes itself; ask to remember; check/toggle setting.
- `#L1-L1` — `sources/claude-code-master/20261028/4-Volume C - Memory/7-Module C7 - Memory in context/index.html` — both files load every session; context command cost; healthy size; auditing.
- `#L1-L1` — `sources/claude-code-master/20261028/4-Volume C - Memory/8-Module C8 - The calibrate skill/index.html` — calibrate reviews session, folds corrections into memory, suggests skill updates.
