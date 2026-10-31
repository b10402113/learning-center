---
source: sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/1-Module A1 - Three Surfaces/1-Module_A1_-_Three_Surfaces.en.vtt
source_type: text
source_lines: 1810
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Three surfaces — Claude Code runs in the Claude desktop app, a VS Code (IDE) extension, or the terminal; all three use the same Anthropic models (Opus, Sonnet, Haiku) and the same harness, so only the interface differs. All are downloadable from claude.ai/downloads.
- Desktop app — three tabs (Chat, Claude Work, Claude Code) where Chat is least capable and Claude Work is a watered-down Claude Code; you pick a local folder as a "workspace", click "Trust Workspace" so Claude can write files, and manage multiple chat sessions. Split view runs up to four sessions side by side but tabs cannot be dragged or reordered.
- Desktop app extras — a Routines tab for scheduled tasks (pause/resume/calendar) and a Customize view listing every skill and MCP connector; the author warns that manual skill lists stop being useful past ~80–90 skills.
- Workspace as second brain — a workspace is any folder on disk; the author's "Robo" folder is ~8 GB of Claude-created images, videos, and Markdown, and modern models (e.g. Opus 4.8) parse thousands of files quickly, so manual file organization matters less.
- VS Code extension — the recommended starting surface: install "Claude Code for VS Code" from Extensions, open the folder, and Claude can create and open files directly in the editor (text, images, PDFs via plugins). Sessions are separate tabs that can be dragged, resized, and arranged, enabling ~4x parallel work on a second monitor.
- Skills and MCP in VS Code — no dedicated skill list UI; type `/` to see slash commands/skills, and MCP servers are visible the same way; the author prefers asking Claude to view, edit, or prune skill files in natural language.
- Terminal surface — launch by typing `claude` in the terminal, trust the folder, and chat; output is the most verbose because it was the original developer-facing surface. It lacks file visibility and opens files in the OS default app, but new features often ship there first (e.g. Ultra Code) and commands like `/insights` work best there.
- Recommendation — desktop app is least intimidating but weakest; VS Code extension is the best daily driver after ~10–30 minutes of use; terminal is the most intimidating but has the most features and the newest releases.

# L2 detail

- `#L1-L100` — Introduces the three surfaces (desktop app, IDE extension, terminal), the claude.ai/downloads page, and the claim that all surfaces share the same models and harness.
- `#L101-L240` — Desktop app tour: Chat vs Claude Work vs Claude Code tabs, why Claude Code is the most powerful, selecting a workspace folder, and "Trust Workspace".
- `#L241-L360` — Workspace as a folder on the device, the Hello World file demo, mass file creation potential, and the "operating system / second brain" framing.
- `#L361-L500` — The author's ~8 GB "Robo" workspace of images, videos, and Markdown created by Claude; models like Opus 4.8 / Sonnet parse thousands of files quickly; multiple workspaces and new sessions in the desktop app.
- `#L501-L670` — Deep-research example, clarifying questions as best practice, opening split view, running up to four concurrent sessions, and the limitation that desktop tabs can only be resized, not dragged or reordered.
- `#L671-L760` — Routines tab: scheduled tasks can be paused, resumed, and viewed as a calendar, but become hard to manage through UI once there are many.
- `#L761-L900` — Customize view listing skills (including the skill creator skill), adding skills manually, MCP connectors, and the warning that ~80–90 skills make a list view useless.
- `#L901-L1060` — Argument that manually editing skill files is obsolete; recommendation to start with an IDE, install VS Code (free, open source) and the Claude Code extension, and open an existing workspace.
- `#L1061-L1200` — VS Code session list, creating a "Hello Robo Nuggets" text file, and Claude opening the file inside the VS Code editor for preview.
- `#L1201-L1340` — Previewing text/images/PDFs inside the IDE, dragging multiple sessions into a layout, double-click equalizing widths, second-screen workflow, and browsing workspace folders and Markdown directly.
- `#L1341-L1470` — VS Code lacks a skill list UI: use the `/` slash-command menu to see all skills (~80 for the author), ask Claude to prune them, and view MCP servers the same way.
- `#L1471-L1620` — Terminal surface: typing `claude`, trusting the folder, needing terminal navigation skills to reach the workspace, verbose tool output, and creating a "Robo Crew" text file.
- `#L1621-L1810` — Terminal drawbacks (no file visibility, opens files in the OS default app), newer features like Ultra Code shipping to terminal first, `/insights` availability, and the closing comparison plus recommendation to use the VS Code extension daily.
