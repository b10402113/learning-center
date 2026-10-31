---
source: sources/real-agent/20261030/Language/001 Domain Language.en.srt
source_type: text
source_lines: 467
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- Communication quality is a first-order input to agent output quality, not a cosmetic concern.
- Agents invent token-efficient names; a reader without those definitions gets an unusable answer.
- The fix is a shared `glossary.md` that both the user and the agent read.
- Naming drift shows up in UI copy, emails, error messages, and code, and causes duplicated code.
- Grill with Docs layers domain modeling onto grilling to challenge terms, test edge cases, and write glossary plus ADRs.
- Borrow only the DDD idea of ubiquitous language: one vocabulary used identically in product, team talk, and code.

# L2 detail

- `#L1-L48` — language quality drives output quality; models have a reputation for being hard to talk to; a plausible but jargon-filled answer sets up the problem.
- `#L49-L84` — the sample answer invents four names that do not exist in the codebase.
- `#L85-L120` — agents compress meaning into invented names for token efficiency; a reader without definitions is lost; the fix is a shared glossary.
- `#L121-L176` — live Cadence issue: cancel purchase, reversal email, and pending chargeback are three names for one concept.
- `#L177-L220` — the same split naming lives in code; agents must find every alias and end up duplicating code.
- `#L221-L280` — fix method: settle the language while deciding what to build; Grill with Docs adds domain modeling to grilling.
- `#L281-L348` — outputs are `glossary.md` and `docs/ADR`; every other skill reads the glossary; the section roadmap.
- `#L349-L392` — DDD and Eric Evans' ubiquitous language; only the glossary idea is taken, not aggregates or event sourcing.
- `#L393-L444` — ubiquitous means team talk, product copy, and code all use the identical term.
- `#L445-L467` — naming the thing is effectively building it; wrap-up.
