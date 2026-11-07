---
source: sources/js-mastery-engineer/20261107/supplement/031 - Subagents- Agents with Their Own Context pdf.txt
source_type: text
source_lines: 27
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- A subagent is a separate agent the main agent spins up with its own context window; it does a task and hands back only the result, not the full path it took.
- It helps for two reasons: the heavy reading and searching happen in the subagent's window, keeping the main context clean.
- Independent parts can run at the same time in separate spaces, speeding up big jobs instead of doing them one step after another.
- It earns its place when the work is heavy and only the result matters, or when the job splits into parts that do not depend on each other.
- Skip it for small, exact tasks the main agent could finish in a read or two, where a subagent just adds extra steps.

# L2 detail

- `#L1-L9` — the one-line definition of a subagent and why it hands back only the result
- `#L10-L27` — the two benefits (clean context, parallelism) and when to use or skip a subagent
