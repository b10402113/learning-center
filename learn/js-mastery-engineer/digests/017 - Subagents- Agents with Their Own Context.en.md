---
source: sources/js-mastery-engineer/20261107/course/017 - Subagents- Agents with Their Own Context.en.txt
source_type: text
source_lines: 57
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Sub-agents are introduced as the fourth primitive, solving the problem that every file read and search piles up in the main context window even when only a short answer is wanted.
- A terminal demo starts a fresh Claude session, runs the `context` command showing about 4% spent, then asks a broad question about error handling across API routes; the main agent dispatches an "Explore" sub-agent instead of reading files itself.
- The sub-agent works in its own separate context, so all its file reads and searches never land in the main window; only a few sentences of summary come back, and the context barely moves.
- Two benefits: keeping the main window clean, and speed through parallelism, since several sub-agents can run side by side on independent parts of a job, like parallel code execution.
- Sub-agents are not free and not always the answer: the test is whether the work is heavy with only the result mattering, or whether the job can be split into independent parts.
- Small, exact tasks that a main agent could answer in one or two file reads do not justify a sub-agent; the judgment mirrors the MCP lesson of asking whether the job needs its own space.
- The agentic engineering workflow later in the course relies on this idea to stay fast and keep context clean while heavy work happens off to the side.

# L2 detail

- `#L1-L9` — Opens with the question of when a primitive earns its place, states the problem that every file read and search fills one context window, and frames a job where only a short answer is wanted.
- `#L10-L17` — Sets up the terminal demo, opens a fresh session, and runs `context`, showing roughly 1% system prompts, 2% system tools, and 93% free space (4% spent).
- `#L18-L33` — Asks a broad error-handling question, shows the main agent dispatching an "Explore" sub-agent in its own context, notes none of its file reads land in the main window, and observes the returned summary plus an almost unchanged context.
- `#L34-L40` — Explains the second benefit: each agent running in its own space lets the main agent send several sub-agents at once, splitting work in parallel so the whole task finishes faster.
- `#L41-L51` — States sub-agents are not free and gives the two-question test (heavy work where only the result matters, or work splittable into independent parts), and warns against using one for small exact tasks.
- `#L52-L57` — Closes by tying the judgment back to MCP, previewing that the agentic engineering workflow leans on sub-agents to keep context clean, and pointing to the next lesson on all four primitives.
