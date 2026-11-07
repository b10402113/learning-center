---
source: sources/js-mastery-engineer/20261107/course/010 - The Agent Loop.en.txt
source_type: text
source_lines: 67
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- States that every coding agent, regardless of tool, runs the same loop: read, decide, act, observe, repeated until the task is done.
- Uses a demo app with a broken login button to show the loop live: the agent searches and greps for the button, then reads the relevant files.
- After reading, the agent decides to inspect the onClick handler and, because the request was a question, pauses to ask before acting.
- Acting means real tool calls: opening files and running Bash type checks and builds, not merely describing what it would do.
- Observation finds that the handler calls a function renamed in a refactor and never updated; a second loop locates and proposes the fix, which is approved and verified.
- Explains the loop as the atomic unit of agent behavior: about 8 cycles for a five-minute task and up to 80 for a complex feature.
- Warns that errors compound across loops, so directing means controlling what the agent reads, how clearly it decides, and how closely its observations are checked, catching drift at loop 3 rather than 30.

# L2 detail

- `#L1-L10` — Why the mental model matters and the universal read/decide/act/observe loop.
- `#L11-L27` — Demo setup and the read/decide phase on the broken login button.
- `#L28-L44` — Real tool-call actions, observation of the renamed function, and the approved fix.
- `#L45-L58` — Loop counts, compounding errors, and why sessions drift.
- `#L59-L67` — What directing the loop concretely means and the handoff to context.
