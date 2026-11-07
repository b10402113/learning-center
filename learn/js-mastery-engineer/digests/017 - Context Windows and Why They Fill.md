---
source: sources/js-mastery-engineer/20261107/supplement/017 - Context Windows and Why They Fill.txt
source_type: text
source_lines: 27
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The context window is the container for everything read, typed, and responded to in a session.
- Even large windows, such as those supporting up to a million tokens, can fill faster than expected.
- Every search step and opened file adds tokens, including search results and file contents.
- Much of the window often ends up holding exploration and irrelevant material rather than useful data.
- Exploring and searching incur a cost by filling the window with irrelevant pieces along the way.
- Proper code organization can reduce wasted exploration and preserve window space for relevant work.

# L2 detail

- `#L1-L4` — Page header and "Lecture Summary" label.
- `#L5-L14` — Context windows as session containers and how quickly both relevant and irrelevant data fill them.
- `#L15-L24` — Token accumulation from each search step and opened file, and the cost of exploration.
- `#L25-L27` — Structural organization as the way to minimize wasted exploration and conserve window space.
