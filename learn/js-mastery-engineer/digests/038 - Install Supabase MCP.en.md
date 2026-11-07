---
source: sources/js-mastery-engineer/20261107/course/038 - Install Supabase MCP.en.txt
source_type: text
source_lines: 65
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- A short practical lesson on connecting the Supabase MCP server so the agent can inspect and operate the real database.
- Shows develop pausing mid-build to ask whether to add env vars or connect the MCP, then resuming the data model work after the MCP is wired up.
- Walks through creating a Supabase project, pushing the existing code to a GitHub repo, and granting the repo access.
- Covers generating a database password (to be saved), opening Supabase's MCP docs for hosted projects, and copying the HTTP MCP server command into the terminal.
- Shows authentication: reload the window, find the Supabase MCP needing auth, and run `/mcp` to authenticate and authorize Claude Code.
- Ends with rerunning `develop data model`, where the MCP presence lets the agent run migrations and work more precisely.

# L2 detail

- `#L1-L11` — Context: develop offered env vars or MCP connection, the instructor chose MCP, and develop paused until it was connected.
- `#L12-L27` — Creates a Supabase project, pushes code to a GitHub repo, grants repo access, and saves the generated database password.
- `#L28-L53` — Uses Supabase MCP docs for a hosted project, adds the HTTP MCP server command, reloads, and authenticates via `/mcp`.
- `#L54-L65` — Reruns develop on the data model, now able to run migrations via MCP, and suggests next features to build.
