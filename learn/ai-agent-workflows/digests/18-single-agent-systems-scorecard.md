---
source: sources/ai-agent-workflows/20261105/course/18-single-agent-systems-scorecard.txt
source_type: text
source_lines: 141
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Against workflows, the single-agent scorecard gets worse on context, reliability, and cost, but gains adaptability.
- One context window must hold the student's whole situation plus large tool results, such as 40,000 tokens of school and scholarship data.
- Critical details like "same state as my parents, South Carolina" can be dropped or lost in the middle of a million-token window.
- That failure looks like a useless agent to the user, e.g. recommending Oregon after being told South Carolina — a bad experience users do not forgive.
- Reliability drops because the number of steps is unknown, so there are no workflow-style gates and risk is harder to judge.
- Cost is worse than workflows because loops cost more than single calls, but still better than multi-agent setups.
- Adaptability is the payoff: it enables paths that were previously impossible to enumerate across careers, schools, scholarships, and eligibility rules.
- On prompt injection, sandboxes are only a start; deterministic checks at every step plus guardrails catch roughly 98–99% of problems.

# L2 detail

- `#L1-L7` — Opens the single-agent scorecard discussion, noting the career advisor has been implemented several ways.
- `#L8-L26` — Context worsens: the window must hold the student's situation, preferences, state, GPA, family, and large school and scholarship results.
- `#L27-L52` — The South Carolina constraint may be dropped or lost mid-context, producing an Oregon recommendation that reads as a broken product.
- `#L53-L64` — Reliability worsens because step count is unknown and there are no gates between steps, unlike workflows with known LLM calls.
- `#L65-L71` — Cost is worse than workflows (loop vs. on-demand calls) but better than multi-agent; sets up the adaptability trade-off.
- `#L72-L97` — Adaptability is the major gain, enabling previously impossible coverage of every career, school, scholarship, and eligibility criterion.
- `#L98-L112` — Recap that single agents are slightly worse everywhere, and the obvious move to multi-agent is not always the right answer.
- `#L113-L141` — Prompt-injection Q&A: sandboxes are a good start, add deterministic checks like SQL-injection defenses, accepting it is never perfect but catches ~98–99%.
