---
source: sources/js-mastery-engineer/20261107/supplement/037 - The Three Types of Context.txt
source_type: text
source_lines: 116
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Context splits into three types, and the key difference is when each one costs you.
- Always-on context loads automatically every session before you type; for this workflow it is `AGENTS.md`, holding standing facts like the stack, conventions and the rule that money is stored as integer cents.
- On-demand context is what the agent pulls in itself mid-task: a file opened after a search, a skill body loaded when its trigger matches, grep results.
- Reference context is everything in the project that stays out of context until something explicitly points at it: specs, design docs, the wider codebase.
- Always-on is paid every session; on-demand and reference are paid only when used.
- The instinct to load more into always-on is backwards; a bloated file is permanent rent and causes context rot, illustrated by the "nine-files mistake".
- The rule: always-on holds only what is true for almost every task; everything else belongs in on-demand or reference.
- The test for every line is "Would the agent need this on most tasks I do?"

# L2 detail

- `#L1-L8` — intro: context is not one thing, and the three types differ in when they cost you
- `#L9-L18` — type 1, always-on context and its defining trait
- `#L19-L26` — type 2, on-demand context and its defining trait
- `#L27-L35` — type 3, reference context and how it differs from on-demand
- `#L36-L49` — the distinction that matters: always-on is paid every session, the other two only when used
- `#L50-L80` — why always-on has to stay small, token rent and the nine-files mistake
- `#L81-L103` — the rule of thumb and the one-question test for each line
- `#L104-L116` — the discipline's payoff and the preview of loading mechanics
