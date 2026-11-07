---
source: sources/js-mastery-engineer/20261107/course/019 - CLAUDE md AGENTS md- How They Load.en.txt
source_type: text
source_lines: 87
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Uses a new Next.js project repo to make always-on context concrete, showing how rule files get created and loaded.
- Distinguishes two ways rules reach an agent: exploration, where the agent might open a rule file while looking around (unreliable), and always-on context, loaded at session start regardless of exploration (guaranteed).
- Shows the `context` command as the reliable way to see what is loaded, including a "Memory files" line; at the demo start it reports 0% but lists two memory files.
- Uses the `/memory` command to name the loaded files: project `CLAUDE.md`, user memory, and an `AGENTS.md` marked as an imported version of `CLAUDE.md`.
- Explains that Claude Code reads exactly one file at startup for always-on context — `CLAUDE.md`, not `AGENTS.md` — and has no fallback; `AGENTS.md` only loads because `CLAUDE.md` imports it.
- Proves it by removing the import, reloading the session, and showing the memory files disappear, dropping `AGENTS.md` from guaranteed context to a maybe reachable only through exploration.
- Warns that always-on context is paid for every session, so it must stay small and hold only rules the agent must never get wrong; part-specific rules belong closer to their use.
- Takeaways: exploration is a maybe and always-on is a guarantee, the import is how you get that guarantee, and `context` plus `/memory` show what actually loaded.

# L2 detail

- `#L1-L7` — Introduces the practical setup: create a new project repo and a Next.js app to observe how these rule files get created and loaded.
- `#L8-L17` — Explains the first path, exploration: the agent might open a rule file while looking around, but whether it does depends on the task and relevance, so it cannot be counted on.
- `#L18-L23` — Explains the second path, always-on context: a rule loaded at the very start of every session whether or not the agent explores, turning hope into a guarantee.
- `#L24-L35` — Introduces the `context` command as the way to see what is loaded, and reads its Memory files line showing 0% but two files.
- `#L36-L49` — Runs `/memory` to name the project `CLAUDE.md`, user memory, and `AGENTS.md` tagged as an import, then states Claude Code reads only `CLAUDE.md` at startup and does not read `AGENTS.md` on its own.
- `#L50-L63` — Proves the mechanic by removing the import, rerunning `context`, reloading the window, and showing no memory files, leaving `AGENTS.md` reachable only if the agent opens it while exploring.
- `#L64-L71` — Restores the import to make the rules guaranteed, then warns that everything in the file loads every session and a bloated always-on file is a tax paid forever.
- `#L72-L75` — Advises keeping part-specific rules closer to where they are used rather than in always-on context, and notes the audit skill will keep `AGENTS.md` trimmed.
- `#L76-L83` — States the takeaways: exploration is a maybe, always-on is a guarantee, the import provides the guarantee, and `context`/`/memory` reveal which files loaded.
- `#L84-L87` — Transitions to the next lesson on code structure as context.
