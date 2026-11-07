---
source: sources/js-mastery-engineer/20261107/supplement/087 - The Three Kinds of Broken pdf.txt
source_type: text
source_lines: 88
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Three kinds of broken: a normal code bug (a real fault you can observe and reproduce), an AI-written-code failure (invented functions, plausible-but-wrong logic, a decision made silently mid-file, a missed edge case), and the agent losing the path (the code may be fine, the process is broken).
- The six-step method that /debug runs handles the first kind; the second uses the same method but recovers intent from the spec instead of memory; the third needs stop-then-steer/reset/rethink, not another prompt.
- A fix you cannot explain is a bug you have not caught: if the error disappears and you can't say why, you may have hidden the symptom, moved it, or made it temporarily harder to reach.
- Misclassification is costly: treating a invisible bug as agent-fixable costs ten prompts then manual reproduction; treating a poisoned session as productive loses the evidence it gathered; treating an agent loop as a code problem burns an hour changing correct code.
- The second kind is harder because on AI-written code you have no memory of intent, so you must recover it from the spec, the surrounding code, and the running behaviour.

# L2 detail

- `#L1-L39` — the three kinds table, with what is wrong and the response for each.
- `#L40-L52` — insight: an unexplained fix means the cause may still be there.
- `#L53-L82` — what each misclassification costs.
- `#L83-L88` — why kind two is harder and where intent must be recovered from.
