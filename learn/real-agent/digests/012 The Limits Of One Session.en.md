---
source: sources/real-agent/20261030/Planning/012 The Limits Of One Session.en.srt
source_type: text
source_lines: 391
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- Agent-driven building moves the bottleneck from doing work to planning work, so planning must be sized to saturate available agents.
- Grilling fails at scale because it is one session: question growth pushes the model into the dumb zone, while compaction destroys rich session history.
- Splitting into multiple sessions creates cross-session coupling and constant context management, especially when prototyping intrudes.
- Shape Up (Ryan Singer) supplies the vocabulary: choose the right shape and the right fidelity for the discussion.
- Fidelity is a ladder from discussion to breadboarding to wireframes to prototypes to production code; higher fidelity costs more tokens but buys more certainty.
- Agents make high-fidelity artifacts cheap, so a planner should pick fidelity deliberately per part of the work; Wayfinder is that planner.

# L2 detail

- `#L1-L46` — Course framing: idea-to-build handoff is being automated, so the new bottleneck is planning; wants a planning setup big enough to keep all agents busy.
- `#L47-L98` — Why grilling falls short: grilling is a single session, adding questions eventually reaches the dumb zone, and the session history is too valuable to compact away.
- `#L99-L166` — Workarounds and their cost: splitting the grill across sessions couples questions, prototyping forces extra sessions, and you must know the shape before deciding how many sessions to use.
- `#L167-L206` — Pre-AI reset: go back to Shape Up by Ryan Singer for right shape, right fidelity, and shipping the right thing.
- `#L207-L298` — Defining fidelity: discussion, breadboarding, wireframes, prototyping, production code; lower fidelity means lower commitment and fewer tokens, higher fidelity is slower but more certain.
- `#L299-L338` — The agent opportunity: prototypes are cheap so work can sit at higher fidelity; the two problems to solve are session management and choosing the right fidelity.
- `#L339-L378` — Introducing Wayfinder: a planning skill that spans sessions, picks fidelity per plan area, and suits work full of unknown unknowns.
- `#L379-L391` — Section promise: master Wayfinder for planning really hard and really big work.
