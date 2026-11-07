---
source: sources/js-mastery-engineer/20261107/supplement/026 - The Four Primitives- Your Vocabulary Map pdf.txt
source_type: text
source_lines: 94
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The four primitives are Tools, Skills, MCP, and Subagents, and every agent action is some mix of them.
- Tools are the actions the agent can perform, thought of like function calls; the agent requests one rather than running it itself, so reasoning and execution can fail separately.
- The core tool set is Read, Write, Edit, Search (grep/glob), and Run a command; these five cover most agent work and separate an agent from a chatbot.
- Skills are instructions for one specific kind of work, picked up only when that job comes up, like grabbing one recipe card.
- MCP, the Model Context Protocol, is how the agent reaches services outside the project such as Slack, Google Calendar, or a database.
- Subagents are helpers sent to work in their own separate context window and return only the result, keeping the main window clean.
- Knowing the four means a newly launched tool is just a new name for pieces you already understand.

# L2 detail

- `#L1-L16` — Tools as defined actions, the function-call analogy, and the agent-requests/executor-runs separation.
- `#L17-L35` — The core five tools and why tools distinguish a coding agent from a chatbot.
- `#L36-L48` — Skills as per-job instructions loaded only when needed, likened to one recipe card.
- `#L49-L59` — MCP as the standard connection to services outside the repository.
- `#L60-L75` — Subagents doing work in their own context window and returning only the result.
- `#L76-L90` — Why the vocabulary map pays off across Claude Code, Cursor, Codex, and future tools.
- `#L91-L94` — Transition to MCP and the question of when it is worth using.
