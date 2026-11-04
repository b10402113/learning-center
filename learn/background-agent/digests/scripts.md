---
source: sources/background-agent/20261105/scripts
source_type: codebase
source_lines: 463
language: typescript
file_count: 6
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- scripts/build-notes.mjs — Generates the six lesson pages under `lessons/<slug>/index.md` by splicing author prose with real `git diff` hunks between the `lesson-N` branch checkpoints; has a `--check` mode that fails when a committed page has drifted from its sources.
- scripts/lesson-data.json — The data build-notes.mjs consumes: per-lesson slug, title, start/solution branches, prose slots (promise, opening, edit, verify, experiment, mistakes, extension, challenge) and an `editCues` map that must have one human-written cue per code edit.
- scripts/check-ports.mjs — Verifies a list of ports (3001 operator, 3002 agent, 3004 checkout, 5173 dashboard, 5174 lessons, 8288 Inngest) are free on both 127.0.0.1 and ::1 before a workshop run.
- scripts/preflight.mjs — Environment doctor: Node ≥ 22, OPENAI_API_KEY / OPENAI_MODEL / OPENAI_BASE_URL, and a live PostgreSQL check that the `labs` table exists; prints a checklist of fixes and sets a non-zero exit code.
- scripts/stop.mjs — Finds and stops the workshop process groups (checkout, operator, agent, vite/vitepress, inngest dev) that belong to this repo directory, escalating SIGTERM to SIGKILL.
- scripts/wait-for.mjs — Polls a health URL up to 100 times at 100 ms (500 ms timeout each) and exits 0 once it answers, so start-up sequencing in the workshop scripts is deterministic.

# L2 detail

- `#L1-L132` — build-notes.mjs — Dev tooling, not agent behaviour. It generates the lesson pages from prose + git diffs: `diffBlocks()` (L13-L49) shells out to `git diff --unified=3 <start> <solution> -- server/agent-workflow.ts` and parses the output into per-hunk blocks, then `renderLesson()` (L51-L118) reads `scripts/lesson-data.json` plus the matching prose file `scripts/lesson-prose/NN.md`, asserts one hand-written cue per code edit (L54-L58, the guard against docs drift), and emits markdown with front matter, an engineering-idea section, and a fenced `` ```diff `` block per edit. The driver loop (L120-L130) writes `lessons/<slug>/index.md`, or under `--check` (L10, L123-L126) throws if the committed page no longer matches. Teaches nothing about durable execution; it exists so lesson notes cannot silently disagree with the branches.
- `#L133-L203` — check-ports.mjs — Dev tooling. `hostPortIsFree()` binds and closes (L12-L21), `hostPortAcceptsConnections()` probes with a 500 ms socket (L23-L39), and `portIsFree()` combines both over `127.0.0.1` and `::1` (L41-L51) because a workshop service may be bound to only one stack; the `names` map (L3-L10) is the useful bit, documenting which port belongs to which process, and the CLI loop (L53-L70) validates each port and exits 1 with a "stop the existing workshop process" message.
- `#L204-L318` — lesson-data.json — Dev tooling/data. Six lesson records (L3-L86) with `slug`, `title`, `start`/`solution` branch names (`lesson-1`…`main`), and the prose slots build-notes.mjs interpolates; the `editCues` object (L88-L114) maps a lesson number to the ordered human cues, and its counts deliberately mirror the number of diff hunks (1 for lessons 1-2, 2 for lesson 3, 2 for lesson 4, 3 for lesson 5, 4 for lesson 6). Useful as a curriculum map of the workshop's real teaching claims — e.g. lesson 5's cue to derive "one stable ID from the run, decision cycle, and selected action", lesson 6's move of `request_help` onto the persisted-proposal path — but it contains no executable behaviour.
- `#L319-L372` — preflight.mjs — Dev tooling. Accumulates human-readable `problems` rather than throwing: Node major < 22 (L5-L6), missing/placeholder `OPENAI_API_KEY` and `OPENAI_MODEL` (L8-L13), a malformed `OPENAI_BASE_URL` (L14-L22), and a `DATABASE_URL` that either fails to parse/connect or connects to a database missing the `labs` table, prompting `npm run db:push` (L24-L47). Exits 1 with `✗` lines or 0 with a single success line (L49-L53).
- `#L373-L445` — stop.mjs — Dev tooling. Refuses to run on Windows (L4-L9), then matches the repo's own processes using a single `workshopCommand` regex (L12-L13: `server/operator.ts`, `server/agent.ts`, `service/checkout.ts`, vite/vitepress, `inngest dev -u …3002`), filtering by process group and by `lsof` cwd equal to the repo root so it never kills unrelated Node processes on the machine (L30-L50), then SIGTERM, 1.5 s grace, SIGKILL the stragglers (L52-L69) and reports the freed ports.
- `#L446-L463` — wait-for.mjs — Dev tooling. The smallest script: takes a URL argument, polls it up to 100 times at 100 ms with a 500 ms per-request timeout, and exits 0 on the first `response.ok` or 1 with a diagnostic. Used to sequence workshop start-up so the agent's operator API is listening before the checkout service starts emitting events.
