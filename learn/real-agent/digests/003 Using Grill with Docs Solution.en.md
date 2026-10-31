---
source: sources/real-agent/20261030/Language/003 Using Grill with Docs Solution.en.srt
source_type: text
source_lines: 1055
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- Treat the refund confusion as a language problem before a code problem.
- Enumerate every name for the concept across UI, email, error messages, schema, and commits.
- Grill one decision at a time and answer from the learner's mental model, not internal jargon.
- Use scenario testing to decide whether one term or two are needed (refund request vs refund).
- Let scenarios expose the lifecycle (pending, issued, failed) and set explicit glossary boundaries.
- Write settled terms to `glossary.md`, then implement renames so code, copy, and migration agree.

# L2 detail

- `#L1-L27` — dictate the opening prompt: pending chargeback vs reversal confusion; bootstrap a glossary around it.
- `#L28-L47` — both skills load; the first pass finds four names, including `refund` hidden in schema and commits.
- `#L48-L81` — inventory of inconsistencies: button copy, email, settings page, a rogue cancel, and error messages.
- `#L82-L116` — question one: choose the learner-facing word; agree on `refund`.
- `#L117-L163` — question two: one term or two; request event vs money returned; request sentence testing; question three raises scope.
- `#L164-L211` — exclude bank chargebacks; the glossary needs a boundary, not a speculative definition.
- `#L212-L311` — scenario matrix for one vs two terms; partial amounts and re-requesting after a decline expose real differences.
- `#L312-L451` — questions four to six: approve vs paid out; pending and issued refunds need separate modeling.
- `#L452-L567` — glossary written; unwanted chargeback entry rejected; lifecycle scenario yields pending, issued, failed statuses.
- `#L568-L700` — lifecycle accepted; eligibility bug deferred; glossary thickens; choose `open` over `requested`; learner-facing copy.
- `#L701-L866` — out-of-scope calls; shared-understanding summary; implement; `refundStatus` enum rename plus migration.
- `#L867-L1055` — payoff in code: settings route, variable names, comments, `getRefundOffer`; open questions about `learner`; practice prompt.
