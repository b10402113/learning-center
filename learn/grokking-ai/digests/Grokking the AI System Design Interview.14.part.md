---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.14.part.txt
source_type: text
source_lines: 582
part: 14
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Lesson 40, Capstone: Enterprise Document Q&A — a 20,000-employee internal assistant over Confluence, Google Drive, Slack, Jira and an HR policy system that must "never show anyone something they are not allowed to see." Runs the seven-step framework: reframe success as ticket deflection with supported-answer rate and refusal correctness, and treat zero permission leaks as an invariant rather than a metric. About 2M documents become 20M chunks; Slack threads are the document unit, Drive link-shares are readable only by named people and groups, ACLs ride on every chunk, and group membership resolves live at query time instead of being indexed. Content, permission and deletion travel on three separate feeds with their own SLOs (15 min edit, 5 min permission, 1 hour to leave index and caches, 24 hours to leave every derived artifact). Permissions are enforced inside the index query, never after; the service fails closed to public-content-only when the directory is down; caches recheck sources on every hit and purge on delete. Cost is explicitly not the constraint — about $500/day of model spend against $4,000/day of helpdesk tickets.

# L2 detail

- `#L1-L21` — Lesson 40 header and vocabulary: ACL, group, directory, invariant, derived artifact, permission probe, ticket deflection.
- `#L22-L36` — The exercise: five sources, 20,000 employees, 40 minutes, and the one skill under test — putting the permission check in the right place.
- `#L37-L50` — Part 1: framing — "document question answering where permissions decide the design," the thousands of audiences versus one public help center, and scope in and out.
- `#L51-L103` — Part 2: success — supported-answer rate, ticket deflection measured against teams without the assistant, refusal correctness in both directions, zero-leak invariant, 0.35 avg and ~1 peak question/second, TTFT ~2 s, and four freshness targets.
- `#L104-L252` — Part 3: mapping the data — per-source document shape and permission model, 2M documents to 20M chunks, Slack thread as document, the Drive link-share hazard, ACLs as chunk metadata, live group resolution and why it beats listing every employee, the three feeds, and staleness in both directions under the same 5-minute SLO.
- `#L253-L295` — Part 4: picking models — existing LLM answer model with per-claim citations, small rewrite/classify model, embedding model, reranker, a baseline of the current intranet search; hybrid retrieval for identifier-heavy enterprise questions; reranking 50 candidates to 5; and source-aware retrieval (per-source quotas plus reranker leveling) so Slack cannot crowd out Confluence.
- `#L296-L426` — Part 5: the serving path — why permission filtering must sit inside the index query rather than after generation or after retrieval, Maya's vacation-carry-over question step by step to ~3–5 s, fail-closed public-content-only mode when the directory is down, and the three cache rules (public content only, recheck every source per hit, purge on deletion).
- `#L427-L466` — Part 6: keeping it working — the four kinds of golden-set questions including permission probes and injection cases, the red-team pass on prompt injection hidden in ingested content, staged rollout (one department, two sources), and what to watch (freshness lag per feed, leak audits, deletion audits, answer quality).
- `#L467-L523` — Part 7: the failure ledger (fail closed on group resolution, lexical-only when the vector index is down, stale-source banners, pause a source missing its SLO, show permitted documents when the LLM is down, purge-and-report on a deleted document) and the cost ledger (~$0.05/question, ~$500/day, ~82 GB of vectors or ~20 GB quantized, versus helpdesk ticket value).
- `#L524-L539` — Part 8: how mid-level, senior and staff answers sound — late permission filtering versus inside-the-index filtering plus fail-closed, versus reframing success around deflection and treating deletion as a compliance surface.
- `#L540-L582` — Part 9: five follow-ups (revoked access and stale caches, Slack dominance, a CEO's cited wrong answer postmortem, legal proof of deletion across every artifact, adding actions later) and key takeaways plus the chapter divider.
