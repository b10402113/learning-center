---
source: sources/real-agent/20261030/Language/004 ADRs _ Domain Language.en.srt
source_type: text
source_lines: 495
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- ADRs capture the decisions and rejected options that code erases.
- The format is deliberately tiny: what was decided and why, with optional options and consequences.
- Only record a decision that is hard to reverse, surprising, and the result of a real trade-off.
- Whole-day refund windows are the worked example: arbitrary-looking, and easy for an agent to trample.
- ADRs and glossaries are secondary sources; they fill gaps but never replace code as the source of truth.
- Capture decisions during grilling, at the moment they are actually made.

# L2 detail

- `#L1-L26` — recap of Grill with Docs; ADRs are the second artifact produced by domain modeling.
- `#L27-L50` — ADRs are records of decisions taken; they exist because code alone is not enough.
- `#L51-L90` — code is the answer with the working rubbed out; ADRs supply that working.
- `#L91-L134` — what an ADR is and the minimal template: decision plus why; optional options, consequences.
- `#L135-L222` — bloat risk; the sparing three-part bar; icon or toast library vs a React-to-Vue move.
- `#L223-L342` — worked example: `isWithinWindow` counts whole days, a surprising choice an agent could silently undo.
- `#L343-L382` — a global `docs/ADR` folder makes decisions findable; grilling is when to record them.
- `#L383-L462` — primary vs secondary source anxiety; ADRs and glossary only explain what code cannot.
- `#L463-L495` — glossary plays the same role; both documents earn their creation and maintenance cost.
