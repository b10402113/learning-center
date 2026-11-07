---
source: sources/js-mastery-engineer/20261107/supplement/093 - Debugging Code You Didnt Write.txt
source_type: text
source_lines: 124
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- On code an agent wrote you lack the memory of intent that does half the work when debugging your own code; watching it be generated is not a substitute because you saw the output, not the reasoning.
- Read it like a stranger wrote it, because otherwise you debug your theory about the code rather than the code itself.
- Intent comes from three places: the spec's acceptance criteria (what it was supposed to do), the surrounding code (the conventions it should follow), and the running behaviour (what actually happens).
- Without a spec, the finding matters more than the bug: a behaviour with no recorded decision is a decision that was never made, which goes to /architect, not /debug.
- Four patterns: invented function (easy, loud failure), plausible-but-wrong logic (hardest, reads and reviews correctly), a decision made mid-file (invisible until it conflicts), and the unconsidered edge case (easy once fed real data).
- The tell: the bug is almost never in the line that failed but in a decision made earlier that nobody wrote down, so ask whether it was ever decided.
- The same six steps and discipline apply; the only difference is recovering intent from spec, surrounding code and behaviour instead of memory.

# L2 detail

- `#L1-L16` — why memory of intent is missing on agent-written code and the "read it like a stranger wrote it" technique.
- `#L17-L48` — where intent comes from instead, with the spec's acceptance criteria as the key source.
- `#L49-L59` — when there is no spec, the missing decision belongs to /architect rather than /debug.
- `#L60-L109` — the four failure patterns and how hard each is to catch.
- `#L110-L121` — the tell (an earlier unwritten decision) and what does and does not change.
- `#L122-L124` — pointer to the third kind of broken: the agent, not the code.
