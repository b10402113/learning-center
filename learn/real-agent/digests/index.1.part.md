---
source: sources/real-agent/20261030/index.txt
source_type: text
source_lines: 3964
part: 1
status: skipped
skip_reason: "consolidated duplicate of the 38 per-lesson .srt transcripts, which are digested individually; kept only as the source of the [FIGURE] annotations"
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- Domain Language — Agents invent compressed private jargon and drift into several names for one concept (cancel / reversal / chargeback) across UI, email, and code identifiers. The fix is a shared GLOSSARY.md vocabulary that stays identical in conversation, product, and code. Takeaway: settle language before building so one concept has one name everywhere.
- Using Grill with Docs (practice) — Hands-on with Liam's $79 refund, which three screens call by three names. The exercise is to run /grill-with-docs, pick one term, write GLOSSARY.md from scratch, then rename the three files. Takeaway: fix language before touching code, and judge an entry by whether a new developer understands the user's state from it alone.
- Using Grill with Docs Solution — A full session: inventory four names, choose "refund", scenario-test one term vs two (Refund Request + Refund), and model the lifecycle so the team's decision and the money movement are separate states. Ends with enum rename, migration, and copy changes across schema, settings, course, and refund routes. Takeaway: let scenario tables decide how many terms you need; align identifiers, comments, errors, and UI copy to the glossary.
- ADRs — Code records what you built but erases what you rejected. An ADR is a tiny record — title plus 1–3 sentences — offered only when the decision is hard to reverse, surprising without context, and the result of a real trade-off. Worked example: counting the refund window in whole days rather than hours.
- Writing an ADR (practice) — A new feature (approve/decline an Open Refund Request) raises one thorny question: what happens to enrollment and progress on approval? Exercise: grill the approval screen using existing glossary terms, then decide which decisions deserve an ADR and write them to docs/adr/.
- Writing an ADR Solution — Grilling surfaces enrollment vs purchase, progress stored separately, two meanings of "admin", and a 50% eligibility check missing on the server. Two rounds of eight questions settle decisions, and scenario testing S1–S6 grows the vocabulary (Individual Purchase, Team Licence, Claimed/Unclaimed Seat). Four ADRs pass the three-part test. Takeaway: push back when money and dense decisions deserve a durable record.
- Pruning the Glossary (practice) — Glossaries accrete an "Other terms" pile of implementation details and general programming words. Exercise: reset to the bloated glossary, grill it down to domain terms, and derive explicit rules for what stays and what goes.
- Pruning the Glossary Solution — Removes implementation details (refunds table, refunded_at) and too-general terms (Button, Component, cwd, Loader, slug), catches a stale hardcoded watch limit, compresses "place on a course" into Enrollment, and first picks learner then flips to student after counting 8 vs 180 occurrences. ADRs and comments get realigned. Takeaway: keep the glossary short, keep implementation out, and let codebase frequency settle contested names.
- Pruning ADRs (practice) — The same decay problem in docs/adr/. Exercise: reset to an 11-ADR pile and judge each against the three-part test, choosing delete vs deprecate. Deprecate when the decision was real but later reversed.
- Pruning ADRs Solution — The agent cross-checks ADRs against code to find drift. It adopts delete-with-reversal-recorded-in-a-new-ADR, drops four (lucide, Prettier, stale ip-api, log-email), rewords 0009 to the glossary, and writes 0012 recording full-price charging with the abandoned ip-api approach as a considered option. Result: eight healthy ADRs. Takeaway: the most valuable ADR records a decision not to do something.
- Q&A — Scaling language: prefix entities (Quiz question vs Discussion question), or split into bounded contexts with GLOSSARY-MAP.md and per-context ADRs when two vocabularies collide. Ship glossary updates at decision time, before spec and tickets, renames included; mine words from real users; no glossary is ever finished; an agent must not own the glossary alone.

# L2 detail

- `#L1-L81` — Domain Language lesson: agent-invented jargon, the cancel/reversal/chargeback drift in UI, email, and identifiers, why a shared vocabulary pays off, /grill-with-docs built from grilling + domain-modeling, ubiquitous language from DDD.
- `#L82-L126` — Using Grill with Docs practice: seed state, find the right word, create GLOSSARY.md, unify the three files, verify the UI.
- `#L127-L162` — Solution setup: four-name inventory including DB schema, the "cancel" error message, the opening prompt, the agent's grep of chargeback|reversal|refund and its first questions.
- `#L163-L205` — Round 1 naming (refund), one term vs two, chargebacks parked as out of scope; Round 2 scenario table A–D and the two-term decision, plus Q6 on approved vs issued.
- `#L206-L253` — Round 3 lifecycle scenarios (approved but money not sent, failed refund) and the agent wrongly adding chargeback; Round 4 full status tables for Refund Request and Refund plus learner-facing copy.
- `#L254-L338` — Implementation: RefundStatus Requested→Open, data-fix migration for existing rows, diffs in schema, settings, courses, and refund routes, and what's left undefined (learner).
- `#L339-L443` — ADRs lesson: code as the answer with the working rubbed out, the minimal template, three tests for offering an ADR, the whole-day refund window example, top-level docs/adr/, ADRs vs secondary sources.
- `#L444-L474` — Writing an ADR practice: Liam's Open Refund Request, the enrollment/progress options table, grill the approval screen with glossary terms, write ADRs to docs/adr/.
- `#L475-L523` — Solution opening: the prompt, four findings (enrollment vs purchase, progress stored elsewhere, two meanings of admin, missing 50% server check), eight Q&A, new People section.
- `#L524-L567` — Round 2 team licences: seats claimed while a request is Open, scenario testing S1–S6 producing Individual Purchase, Team Licence, Claimed/Unclaimed Seat, and per-purchase refund requests.
- `#L568-L609` — Pruning the glossary (reject Void Seat and Access), round 3's eight questions, and pushing the agent to write ADRs despite its initial refusal.
- `#L610-L689` — Four ADRs (progress kept, enrollment ends at approval, team licences all-or-nothing, enrollment not tied to purchase), why they earn their place, what's next.
- `#L690-L731` — Pruning the Glossary practice: reset to seed-bloated-glossary, read the Other terms section, grill to prune, work out the rules, check the result.
- `#L732-L782` — Solution prompt; Q1 removes implementation details (refunds table, refunded_at, resolved_by_user_id) and too-general terms (Button, Component, cwd, Loader); Q2 slug is a routing detail.
- `#L783-L827` — Q3 stale two-hour watch limit vs the one-hour constant, Q4 enrollment vs "place on a course", Q5 Lapsed kept and redefined, Q6 learner vs student.
- `#L828-L867` — Q7 headings left open, rewrite from 113 to 87 lines, learner 8 vs student 180 occurrences flipping the choice to student, Q9 updating ADR wording.
- `#L868-L947` — Updating comments, ADRs, and ADR filenames to Enrollment, the final glossary sections (Enrollment, People, Watch Limit), and pruning as an art.
- `#L948-L1001` — Pruning ADRs practice: reset to seed-adr-pile, apply the three-part test, choose delete vs deprecate, run the grilling session.
- `#L1002-L1057` — Solution: the prompt, the agent cross-checking ADRs against code, Q1 delete/deprecate semantics with option B, Q2 lucide-react and Prettier failing the bar.
- `#L1058-L1097` — Q3 the reversed ip-api ADR 0008, Q4 the log-email ADR 0010 replaced by Postmark, Q5 keepers 0005/0006/0009, Q6 ADR terms clashing with the glossary.
- `#L1098-L1155` — Implementation: dropping the added AGENTS.md icon rule, four deletions, 0009 reworded, ADR 0012 recording full-price charging, and the final eight-entry list.
- `#L1156-L1238` — Q&A: one glossary vs many (prefix entities, bounded contexts, GLOSSARY-MAP.md), when to ship glossary updates, mining words from users, no glossary-first requirement, why a human must own the glossary, further reading.
