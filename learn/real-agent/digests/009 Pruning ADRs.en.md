---
source: sources/real-agent/20261030/Language/009 Pruning ADRs.en.srt
source_type: text
source_lines: 135
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- ADR folders bloat the same way glossaries do.
- Hold every ADR to the three-part test: hard to reverse, surprising, and a real trade-off.
- Two remedies: delete the file, or deprecate it as no longer present in the code.
- Deprecation preserves decision history while keeping the current ADR set accurate.
- Exercise: grill the ADR pile and prune with delete or deprecate.

# L2 detail

- `#L1-L32` — from glossary pruning to a seeded pile of ADRs; reset to the `seed-adr-pile` commit.
- `#L33-L58` — apply the three-part test from the domain modeling skill; failing ADRs need attention.
- `#L59-L78` — choose between deleting the file wholesale and deprecating it.
- `#L79-L110` — deprecation marks a decision as no longer present, keeping history without misleading readers.
- `#L111-L135` — job: open Grill with Docs and prune using the test and either remedy.
