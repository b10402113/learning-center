---
source: sources/js-mastery-engineer/20261107/supplement/041 - Challenge- Checkpoint - Make the call.txt
source_type: text
source_lines: 379
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Five judgment-call situations, each answered by a move rather than by a magic prompt or a better model.
- Q1: a 300-line diff across six files that cannot realistically be reviewed is fixed by scoping the work down, not by writing a longer prompt or switching models.
- Q2: scanning a 2,000-line log for one pattern without polluting the working context calls for a subagent that scans in its own context and reports only the finding.
- Q3: repeatedly correcting dollar-vs-cents formatting is fixed by putting the integer-cents rule in always-on context (AGENTS.md, imported into CLAUDE.md), not by correcting it again.
- Q4: scheduling a call based on real calendar availability does earn an MCP, because it needs live, current data that changes on its own.
- Q5: at forty messages, a re-suggested fix and a re-asked decision mean context rot; clear or compact and restate the two or three facts that matter.
- The conclusion: the whole first part of the course comes down to calls — scope it, delegate it, fix the context, reach for the right tool, or reset.

# L2 detail

- `#L1-L6` — intro to the five situations and the claim that every one is a judgment call
- `#L7-L92` — Q1: a 300-line diff that needs scoping, not a longer prompt or a stronger model
- `#L93-L158` — Q2: a subagent for scanning the 2,000-line log in its own context
- `#L159-L222` — Q3: moving the integer-cents rule into always-on context
- `#L223-L301` — Q4: when a calendar-availability task earns an MCP
- `#L302-L373` — Q5: recognizing context rot and clearing or compacting
- `#L374-L379` — the closing summary and transition to Part 2
