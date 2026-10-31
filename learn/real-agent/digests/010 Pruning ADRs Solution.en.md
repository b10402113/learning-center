---
source: sources/real-agent/20261030/Language/010 Pruning ADRs Solution.en.srt
source_type: text
source_lines: 435
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- Delete means the ADR was never a real decision; deprecate means it was real and later reversed.
- A superseded ADR left in the folder is a trap because agents read it as current.
- Frivolous records (Prettier, Lucide icons) fail the bar and should go.
- Stale decisions (IP API lookup, mail-to-log) are replaced by a new ADR that records the reversal and its options.
- Align surviving ADRs with glossary terms while pruning.
- Result: a small, current ADR set where reversals are explicit and agents cannot retry rejected approaches.

# L2 detail

- `#L1-L34` — send the pruning prompt; the agent first checks whether ADRs still match the code.
- `#L35-L106` — question one: delete vs deprecate definitions; choose B; a superseded file misleads readers.
- `#L107-L186` — question two: Prettier and Lucide icon ADRs are too frivolous and easily reversed.
- `#L187-L242` — question three: ADR 008's IP-API decision is reversed; write a new ADR and remove the old one (git keeps it).
- `#L243-L286` — question four: mail-log ADR is stale and already behind a reusable interface; drop it.
- `#L287-L330` — questions five and six: 005/006/009 survive; update ADR terms to match the glossary.
- `#L331-L366` — implement: remove the agents.md icon instruction, delete four ADRs, update the rest to glossary language.
- `#L367-L410` — ADR 0012 records the reversal and its considered options, stopping agents from retrying the IP API.
- `#L411-L435` — a healthy list of about eight or nine ADRs; the pruning rule is now clear.
