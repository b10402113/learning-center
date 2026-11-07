---
source: sources/js-mastery-engineer/20261107/supplement/033 - Configuring And Using A Subagent.txt
source_type: text
source_lines: 239
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The lesson follows up on what a subagent is with how to configure and run one, starting in Claude Code and then comparing other tools.
- `/agents` is the guided, recommended way to create, edit and delete subagents; it is a settings screen, not how you run one.
- The manual way is a Markdown file with four frontmatter fields (`name`, `description`, `tools`, `model`) plus a system-prompt body.
- `description` is the trigger the main agent reads to decide delegation; `tools` limits what the subagent can touch (a reviewer with only Read/Grep/Glob cannot edit code); `model` routes cheap work to a cheaper, faster model.
- Project subagents live in `.claude/agents/` and travel with the repo; personal ones live in `~/.claude/agents/` and apply across every project.
- You run them automatically (Claude delegates when a task matches the description) or explicitly by naming the agent in a normal message; neither is a slash command.
- Claude Code ships built-ins: Explore (read-only, runs on Haiku), Plan (read-only), and general-purpose (the catch-all).
- Cursor and Codex use nearly the same Markdown-plus-frontmatter folder layout, while Gemini CLI uses TOML and Copilot uses agent profiles with built-in specialists.

# L2 detail

- `#L1-L20` — intro and the reminder that a subagent is only worth configuring when the work is heavy or independent
- `#L21-L44` — the easy way via `/agents` and why it manages rather than runs subagents
- `#L45-L84` — the manual Markdown file and its four frontmatter fields plus system prompt
- `#L85-L103` — what each field does: name, trigger description, tool boundary, model routing, body
- `#L104-L110` — project vs personal agent folders and when each is right
- `#L111-L133` — automatic vs explicit invocation and the built-in Explore, Plan and general-purpose agents
- `#L134-L224` — the same idea in Cursor, Codex, Gemini CLI and Copilot, including format differences
- `#L225-L239` — the takeaway and teardown of tools, skills, MCP and subagents before the next mapping lesson
