---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.17.part.txt
source_type: text
source_lines: 668
part: 17
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Lesson 47, Capstone: AI Features for a SaaS Product — a full seven-step interview answer on a CRM with 40,000 tenants, 1M seats, and three requested features: email drafting, call summaries, and "ask my pipeline." The whole lesson argues that three features hide **one shared platform** (gateway, router, safety sandwich, eval service, telemetry) and that "ask my pipeline" is **text-to-query over a semantic layer**, not document RAG. Covers per-feature classification by shape and stakes, a risk-ordered ship plan (summaries → drafting → pipeline Q&A), tenant isolation that fails closed (including per-tenant cache keys), four data-governance tiers, four-stage pipeline Q&A, testing across 40,000 schemas via schema versions and golden pairs, and the ~$16,000/day bill against a $50 seat price. Closes with mid/senior/staff answer comparisons and follow-ups.

# L2 detail

- `#L1-L37` — Lesson vocabulary (SaaS, CRM, safety sandwich, eval service, text-to-query, semantic layer, policy dial) and the exercise: design three AI features for a 40,000-tenant CRM in about 40 minutes.
- `#L38-L118` — Part 1 frames the problem: the trap is three separate systems, so name one shared platform; classifies each feature by shape (chat-shaped drafting, pipeline-shaped summaries, text-to-query pipeline Q&A) and stakes, states scope, and warns against document RAG for counting questions.
- `#L119-L164` — Part 2 defines success: scale assumptions (2M calls, 1.5M drafts, 300K pipeline questions/day), per-feature quality signals and speed targets, two invariants (no cross-tenant data; every number comes from the database), and one business measure tying cost to adoption and retention.
- `#L165-L183` — Part 3 maps the data: what each feature reads, why outside text is untrusted (indirect injection), why every tenant has a different schema, how tenant-internal permissions still apply, and what free feedback each feature produces.
- `#L184-L212` — Part 4 picks models and ship order: small model for summaries, a 70/30 small-vs-frontier split for drafting, frontier for query writing; ship lowest-risk first (summaries, then drafting, then pipeline Q&A) so each proves a platform part for the next.
- `#L213-L389` — Part 5 designs the shared platform: gateway (per-tenant rate/budget limits, audit logging, data boundaries), router by tier with provider failover, the safety sandwich with hardened assembly and per-tenant policy dials, the eval service, and telemetry; tenant isolation is a rule every box obeys, semantic caches are keyed per tenant or disabled, and four data-governance tiers are enforced by gateway and router.
- `#L390-L499` — Part 6 designs "ask my pipeline": intent classification, text-to-query over the semantic layer (least privilege for data, per-tenant definitions), read-only SQL under the asking user's permissions, and narration where every number comes from the database; low-confidence queries are shown back and a failed query gets one repair then an honest failure.
- `#L500-L532` — Part 7 keeps it working: per-feature golden sets (transcripts with reference summaries, thread/reply pairs plus injection probes), testing 40,000 schemas via a few schema versions with golden pairs against fixture data, canary rollout, and the context-assembly diagnosis for a draft that quoted the wrong contact.
- `#L533-L607` — Part 8 counts the costs: token math per feature (summaries ~0.2¢, drafts ~0.5¢ blended, pipeline ~1.5¢), a ~$16,000/day total, ~48¢ per seat per month, drafting as the largest bill, and the "budget halved" decision made from telemetry rather than by vote.
- `#L608-L623` — Part 9 compares mid-level, senior, and staff answers: the tell of a mid-level answer is "RAG over the CRM data"; a staff answer opens with a judgment line and adds tenant differences as configuration plus cost-to-retention telemetry.
- `#L624-L665` — Part 10 follow-ups: a bank demanding no third-party model (model residency as a policy dial and fleet tier), accounting vs HR hardening (audit-traceable figures, bias checks, stricter role access), auto-send without review, and a frontier provider outage.
- `#L666-L668` — Chapter 7 divider: Agentic Systems.
