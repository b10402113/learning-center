---
source: sources/claude-code-master/20261031/6-Volume E - Apps/3-Module E3 - Using CLIs/3-Module_E3_-_Using_CLIs.en.vtt
source_type: text
source_lines: 177
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- What a CLI is — the agent types a specific command and gets a clean, lean response; example given is YTDLP fetching the last three videos of a channel.
- Setup is easy — ask Claude Code to find a CLI, but better to supply the exact link (e.g. the Google Workspace CLI GitHub repo) to save research tokens.
- Install flow — Claude Code installs the package and starts an authorization step that opens the browser for login, linking Gmail/Google Workspace to Claude Code.
- Capability gain — after auth, Claude Code can read and draft Gmail and mark emails as read, which the Gmail MCP connector cannot do.
- Compounding value — knowing MCPs, APIs, and CLIs gives optionality; combined with routines and skills it lets routines act on the apps you use.
- Final benefit — you can create CLIs yourself, shown in the next module.

# L2 detail

- `#L1-L44` — Definition recap: a CLI connection means the agent types commands that do something specific. YTDLP (a popular tool with its own CLI) is the example: a command returns the last three videos from a channel as a clean, lean response.
- `#L45-L88` — Setup: asking Claude Code to find the Google Workspace CLI works, but it is almost always better to provide the exact link. GitHub is where agents now put code and files; the Google Workspace CLI lives there, and giving Claude Code that link lets it guide the setup.
- `#L89-L133` — Install walkthrough: a first-time setup installs the package, then runs authorization by opening the browser to log in, connecting Gmail/Google Workspace to Claude Code. After that Claude Code has maximum capability over Gmail: drafting, reading, and marking emails as read.
- `#L134-L177` — Connects back to the prior module: the CLI can mark and read emails as read, which the MCP connector cannot. Knowing CLIs, APIs, and MCPs gives optionality; routines plus skills let you automate real work across your apps. Final benefit: you can build your own CLIs (next module).
