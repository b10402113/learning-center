---
source: sources/js-mastery-engineer/20261107/supplement/060 - Nine Skills- Finding Your Entry Point.txt
source_type: text
source_lines: 208
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- This is an orientation page, not the actual teaching: every skill gets its own lesson later.
- The loop runs idea → /scope → /architect → /develop (scaffold) → /audit → /develop → /check, with /debug available any time something breaks.
- Nine skills map to stages: /scope owns requirements, /architect owns design specs, /develop owns implementation, /audit owns conventions (AGENTS.md), /sync owns feedback, /check verify owns verification, /test owns protection, /check review owns review, /document owns the record, and /debug owns recovery.
- Only five skills are needed to ship something real; at the Prototype tier those five are a complete workflow by themselves.
- Where you enter depends on what you start with: greenfield runs /scope then /architect then /develop then /audit then the feature loop; an existing codebase runs /audit first then /scope; a small change can go straight to /debug or /develop then /check verify.
- /audit runs first on existing code but fourth on a new project because it writes AGENTS.md from evidence that actually exists, never from assumptions.
- GitHub's Spec Kit, Amazon's Kiro and BMAD all put written structure before implementation; the open question is what happens to those documents on day thirty.
- A specification written once and forgotten is worse than no specification because it is confidently wrong.

# L2 detail

- `#L1-L6` — intro: nine installed skills with no map yet, this page is orientation only
- `#L7-L21` — the loop diagram: /scope → /architect → /develop → /audit → /develop → /check, /debug anytime
- `#L22-L135` — table of each skill, its stage, what it owns, and when it is covered
- `#L136-L139` — five of the nine are enough to ship; at Prototype they are a complete workflow
- `#L140-L167` — where you enter: greenfield, existing codebase, and one small change each take a different path
- `#L168-L190` — why /audit moves: it describes evidence rather than assumptions, so its position follows the evidence
- `#L191-L205` — GitHub Spec Kit, Amazon Kiro and BMAD as precedent; the danger of a stale spec on day thirty
- `#L206-L208` — next lesson: the first boundary, what /scope asks and writes
