---
source: sources/js-mastery-engineer/20261107/course/011 - How Agents Read Your Codebase.en.txt
source_type: text
source_lines: 57
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Corrects the common assumption that agents search a pre-built index or embeddings database; there is no index, embeddings store, or project map.
- The actual toolkit is grep for text, glob for filename patterns, and read for opening files, all called on demand.
- A demo asks where auth is handled in a fresh context; the agent runs a broad grep, gets many files, and filters by filename and matching context before opening anything.
- It reads auth.ts, follows referenced files for sessions, actions, and proxy, and answers that auth spans four layers with specific files and functions.
- Counts the cost: one search, one filtering decision, and four file reads just to answer a simple question.
- Argues clear naming and predictable structure directly reduce search effort, wrong guesses, and context burned, so code is written for a searching agent as well as humans.
- Compares the agent to a new hire who repeats day one from zero in every session.

# L2 detail

- `#L1-L15` — No index; the real search-and-read toolkit of grep, glob, and read.
- `#L16-L28` — Demo: a broad grep for auth and filtering results by filename.
- `#L29-L44` — Reading auth.ts and related files; the four-layer answer and its tool-call cost.
- `#L45-L57` — Why naming and structure matter to a searching agent; the new-hire analogy.
