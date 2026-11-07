---
source: sources/js-mastery-engineer/20261107/course/016 - MCP- Extending the Agent and When Its Worth It.en.txt
source_type: text
source_lines: 117
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Reminds that MCP lets the agent reach outside the repo, which matters because dependencies such as databases do not live in the repository.
- Notes that Prisma, Drizzle, Supabase, and other database services ship dedicated MCP servers, then demonstrates adding a Prisma Postgres server from the terminal.
- Shows MCP servers can be inspected in Claude Code's UI or via `/mcp`, authenticated through the browser, and require restarting the session.
- Demos a request to seed the database with a backup first; the agent inspects the workspace, databases, schema, and Prisma config before acting.
- The agent creates a Prisma project and database, writes its ID into `.env`, creates a backup and migration, seeds data, and verifies the rows, all from one sentence.
- Defines MCP as a bridge: a service builds a server, its capabilities become tools, and the open standard works across Cursor, Codex, and Claude Code.
- Notes a docs-search tool solves the model's training cutoff, but the real skill is knowing when MCP is worth the dependency, breakage, and access risk.
- Gives a test: use MCP for live current data you cannot paste in, and skip it for static or already-known information.

# L2 detail

- `#L1-L11` — MCP reaches outside the repo; database services ship MCP servers; adding the Prisma server.
- `#L12-L25` — Inspecting and authenticating MCP servers in Claude Code and restarting the session.
- `#L26-L45` — Demo request to seed the database; inspecting workspace, databases, schema, and Prisma config.
- `#L46-L63` — Creating a Prisma project and database, wiring `.env`, backup, migration, and seeding.
- `#L64-L77` — Verifying the seeded data in the app and the Prisma dashboard and studio.
- `#L78-L93` — The MCP definition, open-standard portability, and swapping services behind the same bridge.
- `#L94-L114` — Docs search versus training cutoff; when MCP earns its dependency and access risk.
- `#L115-L117` — Handoff to subagents and the next "when is it worth it" question.
