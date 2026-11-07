---
source: sources/js-mastery-engineer/20261107/course/006 - Why AI Coding Falls Apart.en.txt
source_type: text
source_lines: 69
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Describes the familiar failure arc: a prompt scaffolds auth and routes convincingly, then the agent duplicates functions, fixes break other things, and rewrites unrelated files.
- Notes that as context grows, responses slow and become less precise, until the developer starts a new chat and re-explains what was already explained.
- Root cause one: the model predicts the average public-code version of a task, not the learner's specific API client, conventions, or past decisions; your code is absent unless placed in front of it.
- Root cause two: modern agents do plan, but they plan toward the stated goal and fill everything unstated with likely defaults, producing large diffs full of invisible decisions.
- The two causes combine into a cycle of big prompt, big output, unverifiable change, breakage, and an even bigger prompt that is even harder to verify.
- Argues the problem is a missing system rather than prompting, and the course replaces hope with a workflow that engineers context and plans before building.
- Gives a diagnostic question: did the agent lack context, or did it make decisions that were the human's to make?

# L2 detail

- `#L1-L16` — The honeymoon-to-chaos failure arc most developers recognize.
- `#L17-L31` — Root cause one: the model returns the generic average, not the project's specific conventions.
- `#L32-L49` — Root cause two: planning toward the literal goal and silently filling unspecified decisions.
- `#L50-L59` — The combined doom loop and why better prompts cannot fix it.
- `#L60-L69` — The course's system answer and the two-part diagnostic question.
