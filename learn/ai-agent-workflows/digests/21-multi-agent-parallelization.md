---
source: sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt
source_type: text
source_lines: 229
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Parallelization (aka aggregator or ensemble) splits one request across multiple agents at the same time.
- Two subtypes: sectioning, where agents handle different subtasks in parallel, and voting, where agents attempt the same task and results are reconciled.
- Trade-offs mirror sequential: latency goes from bad to good, while cost goes up, especially in voting because the same agent runs multiple times.
- Traces to Google's self-consistency paper: sampling the same reasoning question many times and taking the majority answer raises accuracy.
- For the career app, sectioning does not fit (a school cannot be chosen before a career), but voting does: same request to several agents, then an aggregator reconciles.
- The aggregator can be an agent, an LLM, or deterministic code; the merge step remains a single point of failure and can hallucinate.
- For large PR review, run three agents with different models, providers, and reasoning amounts to surface more issues.
- As models improve and agents agree consistently, tear the pattern down and use a single agent to stop wasting money.

# L2 detail

- `#L1-L18` — Definition: parallelization/aggregator/ensemble sends one request to multiple agents simultaneously; two subtypes are sectioning (different subtasks in parallel) and voting (same task, reconciled).
- `#L19-L40` — Mirror-image trade-offs versus sequential: parallelization makes latency very good but cost high, and voting multiplies cost because the agent runs multiple times.
- `#L41-L51` — Precedent: Google's self-consistency paper sampled the same reasoning question repeatedly and took the majority answer, raising accuracy; parallelization is that idea wrapped in agents.
- `#L52-L84` — Voting applied to the career example: sectioning fails because career must precede school, so send the same request to several agents, then an aggregator agent (or deterministic code) reconciles into top recommendations with more confidence from agreement.
- `#L85-L131` — PR-review use case: PRs have grown to 1,000–3,000 changes, so three agents with different models and reasoning amounts each report what might be wrong, turning an unmanageable PR into tangible review feedback.
- `#L132-L171` — Cost caveat and model choice: use models from different families/providers (OpenAI, Anthropic, an open-weight model) because same-family pre-training finds similar issues and wastes the workflow.
- `#L172-L198` — The merge/aggregation step is still a single point of failure where mistakes and hallucinations can occur; use a capable model for it or deterministic code to avoid LLM hallucination.
- `#L199-L229` — Models now disagree far less than early LLMs; if parallel agents consistently agree, that is a signal to remove the pattern and use a single agent, since running it is expensive — track agreement counts.
