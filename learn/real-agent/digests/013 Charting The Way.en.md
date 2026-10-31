---
source: sources/real-agent/20261030/Planning/013 Charting The Way.en.srt
source_type: text
source_lines: 943
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- Wayfinder stores a plan as two data structures: a map issue and its child decision tickets, all living in the repo's issue tracker.
- Resolving and closing every decision ticket completes the map, which is then turned into a detailed spec for agents to build.
- The first session names the destination, and that naming shapes every ticket that follows.
- The map is a low-resolution index: destination, notes, decisions so far, out-of-scope items, and the fog of war.
- Tickets carry blocking relationships via the tracker's native dependency links; the frontier is the set of open, unblocked, unclaimed children.
- Four ticket types set fidelity: grilling (discussion), prototype (working artifact), research (third-party facts, AFK sub-agent), task (manual human steps).
- Wayfinder is invoked either with a prompt to chart a new map or with a ticket number to resolve one ticket in a fresh session.

# L2 detail

- `#L1-L98` — Install the Wayfinder skill, see its poetic framing ("a loose idea, too big for one agent session, wrapped in fog"), and learn that a map plus decision tickets are ordinary issue-tracker issues closed one at a time.
- `#L99-L154` — Destination: the first session decides it, naming it is the first act of charting, and Wayfinder also works for non-coding efforts such as this course.
- `#L155-L202` — For coding the destination is a spec handed to builders; GrilledWithDocs suits neatly scoped work while Wayfinder suits large projects and huge chunks of work.
- `#L203-L270` — Map mechanics: one issue labeled "Wayfinder map", child issues for decisions, the map as index, and toSpec turning the map into a spec index with per-ticket detail.
- `#L271-L330` — The map as low-resolution view: destination, general notes, decisions so far, and the fog of war that hides decisions you cannot see yet.
- `#L331-L426` — Blocking: decisions can require others first, GitHub's "blocked by" enforces this, and a ticket unblocks only when all blockers close; the frontier is what can be worked in parallel.
- `#L427-L498` — Fog clearing: making a decision reveals new tickets, tickets form a DAG, and maps can reach 50-60 tickets without losing the thread.
- `#L499-L630` — Grilling tickets: the default, most common type; one session answering a standard grill-with-docs question list at low fidelity.
- `#L631-L706` — Prototype tickets: raise fidelity with a cheap rough artifact when the question is how something should look or behave; delegates to the prototype skill.
- `#L707-L802` — Research tickets: gather third-party or local facts a decision waits on; AFK, created and immediately dispatched to a sub-agent that attaches findings.
- `#L803-L850` — Task tickets: manual work that must happen before a decision (sign up, provision access, reshape data); the agent writes the step list for the human.
- `#L851-L943` — Two usage modes (prompt to chart, ticket number to resolve), then a quiz checkpoint and close.
