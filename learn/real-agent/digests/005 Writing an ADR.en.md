---
source: sources/real-agent/20261030/Language/005 Writing an ADR.en.srt
source_type: text
source_lines: 103
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- The refund request is open, but no approval path exists, so nothing can ever be issued.
- The open question is what happens to learner progress when money is returned.
- Delete, retain, or retain-for-N-days are all costly, making this a genuine trade-off.
- Involving people's money plus irreversibility makes it a strong ADR candidate.
- Exercise: grill the approval screen in existing glossary language, then decide which ADRs to write.

# L2 detail

- `#L1-L20` — return to Cadence; the request is open but the issue path was never built.
- `#L21-L60` — progress ownership question: delete the row, keep it, or keep it for a period; cost either way; ADR-worthy.
- `#L61-L86` — use glossary terms while grilling, and expect prompting to become more precise.
- `#L87-L103` — jobs: grill the refund approval screen, reuse `glossary.md` language, decide on ADRs.
