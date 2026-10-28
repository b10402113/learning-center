---
source: sources/claude-code-master/20261028/6-Volume E - Apps
source_type: text
source_lines: 460
status: absorbed
absorbed_at: 2026-10-28
created: 2026-10-28
updated: 2026-10-28
---

# L1 overview

**Volume E — Apps** (6 lessons, full transcripts). The A of ARMS: connecting your agent to the apps you actually use for work, and eventually building your own. Core insight: there are three ways to connect — **MCPs, APIs, CLIs** — and they do **not** cost the same in tokens.

- **E1 Intro to Apps** — the three connection methods compared. MCPs are simplest but **preload every tool's description into the context window on every session**, so they burn the most tokens. APIs return verbose JSON (more than you need). CLIs are the leanest: the agent types a clean command and gets back only what it asked for — the presenter's default.
- **E2 Using MCPs** — connect fast by handing Claude the MCP server URL directly (cheaper than asking it to research). Demo: Higgsfield image gen inside Claude Code. Upsides: official, show nicely in Claude desktop + Claude Design. Real limitation: the Gmail MCP can't mark emails as read.
- **E3 Using CLIs** — the leanest way; agent runs a clean command (e.g. yt-dlp). Set up Google Workspace CLI by handing Claude the GitHub link → browser auth. CLIs unlock what MCPs can't (marking Gmail read) and can be combined with skills + routines to truly automate work.
- **Bonus: Creating your own CLIs** — "Printing Press" (printingpress.dev) lets you build a CLI for *any* app, even without a public API. Compares APIs (verbose JSON) vs MCPs (preloaded tool menus eat context) vs CLIs (minimal tokens). Five-step process: record actions in Chrome DevTools → copy as HAR → Claude extracts real API calls → generates a token-efficient Go CLI + a Claude skill + optional MCP server → bundles a local SQLite mirror of relevant data. Example: a MyFitnessPal CLI in ~15 minutes.
- **Tip: Searching for Connectors** — a paste-ready prompt that has the agent check an app and rank CLI vs API vs MCP, explaining what exists and the pros/cons; can be turned into a skill.
- **E4 Creating your Own Apps** — agents can build custom software (Chrome extensions, business tools) for you, not just connect to existing ones. Building your own app means you control the connection (often easier than third-party). Points to optional CRAFT-framework and Rubric lessons.

# L2 detail

- `#L1-L82` — sources/claude-code-master/20261028/6-Volume E - Apps/1-Module E1 - Intro to Apps/1-Module_E1_-_Intro_to_Apps.txt — three methods (MCP/API/CLI); MCP preloads all tool descriptions each session (token cost); APIs verbose JSON; CLIs leanest; when to use each.
- `#L1-L79` — sources/claude-code-master/20261028/6-Volume E - Apps/2-Module E2 - Using MCPs/2-Module_E2_-_Using_MCPs.txt — connect MCP via server URL (vs costly research); Higgsfield demo; official + Claude Design upsides; Gmail MCP can't mark read.
- `#L1-L44` — sources/claude-code-master/20261028/6-Volume E - Apps/3-Module E3 - Using CLIs/3-Module_E3_-_Using_CLIs.txt — CLI = clean command/clean response; Google Workspace CLI via GitHub link + browser auth; unlocks Gmail read; combine with skills+routines.
- `#L1-L232` — sources/claude-code-master/20261028/6-Volume E - Apps/4-Bonus- Creating your own CLIs/4-Bonus-_Creating_your_own_CLIs.txt — Printing Press; API vs MCP vs CLI token comparison; 5-step HAR→spec→Go CLI→skill→MCP; local SQLite mirror; MyFitnessPal example.
- `#L1-L12` — sources/claude-code-master/20261028/6-Volume E - Apps/5-Tip - Searching for Connectors/5-Tip_-_Searching_for_Connectors.txt — connector-finder prompt to rank CLI/API/MCP for any app; can become a skill.
- `#L1-L11` — sources/claude-code-master/20261028/6-Volume E - Apps/6-Module E4 - Creating your Own Apps/6-Module_E4_-_Creating_your_Own_Apps.txt — agents build apps for you; you control the connection; pointers to CRAFT/Rubric lessons.
