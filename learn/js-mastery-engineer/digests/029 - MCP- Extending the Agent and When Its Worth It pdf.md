---
source: sources/js-mastery-engineer/20261107/supplement/029 - MCP- Extending the Agent and When Its Worth It pdf.txt
source_type: text
source_lines: 213
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- MCP turns an external service into tools the agent can call: a service builds a server, the agent connects, and actions like backing up a database become tool calls.
- MCP is a standard, not a Claude feature; Cursor, Codex and Claude Code connect to the same server, which is why Prisma, Neon, Clerk and PostHog ship them.
- Connect a server only when the task needs live, current data you cannot just paste in; skip it for docs, static values, or anything you already know.
- Every added server is another failure point and a live connection to something that matters; Prisma's own server requires confirmation before destructive commands.
- Claude Code has three scopes set with `--scope`: local (default, current project only), user (`--scope user`, all projects), and project (`--scope project`, which writes `.mcp.json` to the repo root for the team).
- Other tools use different files but the same two levels: Cursor `~/.cursor/mcp.json` vs `.cursor/mcp.json`, Codex `~/.codex/config.toml` vs `.codex/config.toml`, Copilot `~/.copilot/mcp-config.json` vs repo settings.
- A stack of three common servers, about 81 tools, can eat over 20,000 tokens up front, roughly 16% of a 128k window, before the session starts.
- Default to project scope for anything tied to one project or holding real access; reserve global for a small set of genuinely general-purpose tools.

# L2 detail

- `#L1-L9` — repo link and the one-line MCP definition
- `#L10-L33` — adding Prisma with `claude mcp add`, signing in via `/mcp`, MCP as a cross-tool standard, and swapping services
- `#L34-L84` — when an MCP is worth it: the risk, the live-data question, and the worth-it vs skip lists
- `#L85-L145` — global vs project placement and the three Claude Code scopes (`local`, `user`, `project` with `.mcp.json`)
- `#L146-L169` — the same two levels in Cursor, Codex and Copilot, plus the general rule
- `#L170-L208` — when global vs project is right, security/context/maintainability concerns, and the one-line best practice
- `#L209-L213` — the same personal-vs-project pattern across skills, subagents and MCP
