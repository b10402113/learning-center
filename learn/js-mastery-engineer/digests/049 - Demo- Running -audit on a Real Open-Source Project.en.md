---
source: sources/js-mastery-engineer/20261107/course/049 - Demo- Running -audit on a Real Open-Source Project.en.txt
source_type: text
source_lines: 129
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- BookWise is a real two-year-old open-source university library app (140 file changes) with ID-card sign-up, admin approval, and book borrowing; it stands in for "a codebase someone just handed you" from the previous lesson.
- Running the audit skill on an established repo behaves differently: with 62+ source files, database migrations, and auth already present, it routes to a full repo scan instead of interviewing about conventions.
- Before writing docs, audit asks for consent to discover agent skills and MCP servers, then spawns a sub-agent so the main conversation only keeps the useful result instead of every file opened.
- The generated root AGENTS.md captures the stack, versions, key dependencies, package manager, build approach, commands, where specs live, and the codebase rules; nested AGENTS.md files are created only where an area genuinely needs them.
- Nested files here cover the database (Drizzle schema as single source of truth, Neon Postgres, Redis client, dev seed script) and the app (auth, root, and admin layouts).
- The human still owns the map: read it against the real project, confirm the stack, actually run a command, and catch missed conventions; the same skill adapts to monorepos by adding a root file plus per-workspace files.

# L2 detail

- `#L1-L19` — Introduces BookWise, an old hand-written library app, and frames the scenario as inheriting an unfamiliar codebase; the answer is to build a map with audit, not to start changing code.
- `#L20-L31` — Runs audit, which detects an established repo with 62+ source files, migrations, and auth, and therefore takes the phase-two full-repo-scan path.
- `#L32-L44` — Answers the skills/MCP consent prompts, watches audit spawn a sub-agent for discovery, and explains why the main context keeps only results while AGENTS.md is written.
- `#L45-L56` — Describes what lands in the root AGENTS.md (stack, commands, patterns, surprising details) and the discovered skills/MCPs: Neon, Drizzle, AuthJS/NextAuth v5, Upstash, and ImageKit.
- `#L57-L65` — Explains why nested AGENTS.md files appear only for areas with their own conventions, external integrations, or local risks; this run creates database and app files.
- `#L66-L78` — Covers the security-risk judgment on the Auth.js skill (left to the human), the install, and the final audit summary of what was written and recommended.
- `#L79-L91` — Notes that scope does not exist yet, so build approach is undecided; reviews why the new root AGENTS.md changes every future prompt and what it now records.
- `#L92-L109` — Reads the database nested file (schema.ts as single source of truth, drizzle.ts, redis.ts, seed.ts) and the app nested file (auth, root, admin layouts and their conventions).
- `#L110-L129` — Assigns the human's verification job, explains monorepo behavior, and argues that restraint (read what exists, add only what is missing) makes the map trustworthy enough to build on.
