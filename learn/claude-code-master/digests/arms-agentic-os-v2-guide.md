---
source: sources/claude-code-master/20261031/8-Volume G - Agentic OS/1-Module G1 - Intro- My Agentic OS v2/resources/arms-agentic-os-v2-guide.txt
source_type: text
source_lines: 720
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Guide purpose — the companion PDF to the Agentic OS v2 video; uses the ARMS framework (Apps, Routines, Memory, Skills) with three levels each, twelve total, and gives a copy-paste Claude Code prompt for every level.
- Suggested use — either feed the whole PDF to an agent and ask which three levels fit your setup, or read in video order (Skills, Routines, Memory, Apps); a 12-level map sits on page 3 and a checklist on page 16.
- What's new — the guide is framed around Claude 5.5 (1M token context), Jev (a fast TypeScript/OpenRouter router that picks a model per prompt), and Mods (desktop add-ons for Claude Code).
- Skills levels — know your skill types (database, artifact, self-triggered), route each skill to the cheapest adequate model, and let feedback improve a skill rather than lengthen it.
- Routines levels — prefer passive routines that only ping on signal, cap the expensive scheduled tasks, and run a weekly routine that suggests new routines from your own sessions.
- Memory levels — three plain-text layers (MEMORY.md, CLAUDE.md as map, database-skill routers) with no vector database, purpose-driven compaction plus cache warmth, and a self-evolving memory built from a fix backlog and `/calibrate`.
- Apps levels — connect any app by trying maker tools, community CLI, API, then community MCP in that order; mods and Chrome extensions for daily clicks; one micro app per recurring review job.
- Closing material — a tools-and-links page (RUBRIC Agentic OS, Carousels, Recos, Ribbon, calibrate, videos), a "before you go" note that the weekly loop matters more than pasting prompts, and a twelve-item checklist.

# L2 detail

- `#L1-L46` — Cover page, README: what the guide is, how to use it (whole PDF to an agent or read part by part), where the full setup lives, and the three "what's new" items: Claude 5.5, Jev, Mods.
- `#L47-L176` — The map: ARMS as "arms to reach into your workspace," the twelve levels laid out per letter (Skills, Routines, Memory, Apps) with one-line descriptions and page references, plus the idea that context and workspace organization underneath are what make the visuals work.
- `#L177-L226` — Part 1, Skills: definition of a skill, Level 1 skill types (database skills like `/tone` and `/thumb`, overfitting and wildcards via `/wildcard`, artifact skills built in HTML from a brand book with one inbox, self-triggered skills run on `claude -p`), Level 2 model routing (pinning `model: haiku` for `/grammar`, Jev routing stats), Level 3 self-improving skills via a teach switch.
- `#L227-L298` — Skills prompts: Level 1 database skill, artifact skill, and self-triggered skill prompts; Level 2 model-routing prompt (Jev via OpenRouter, `OPENROUTER_API_KEY` from disk, logging with on/off) and its prerequisites; Level 3 self-improving skill prompt with the principle-over-rule guidance.
- `#L299-L343` — Part 2, Routines: definition, Level 1 active vs passive routines (daily inbox digest vs brand watch, why passive scales past 50 routines), Level 2 capped routines (token-cost view, cap a routine at about $4/week), Level 3 routines that suggest routines (Friday session review into RUBRIC Recos with a cart).
- `#L344-L381` — Routines prompts: sorting active vs passive plus three new passive suggestions; finding the most expensive scheduled task, ranking by weekly tokens, and cutting it to a cap with before/after costs; a Friday routine that surfaces jobs done 3+ times as cards with a copyable cart.
- `#L382-L420` — Part 3, Memory: definition, Level 1 long-term memory — a ~420,000-file workspace mapped by three plain-text layers (short MEMORY.md, CLAUDE.md as map with per-department router files and AGENTS.md for Codex, database skills as routers), no vector database, text descriptions for images, and the "open two or three files" test.
- `#L421-L462` — Memory Levels 2 and 3: the 1M-token context window, context rot and cost, Fix 1 compact with a purpose (`/compact keep ...` plus standing rules), Fix 2 watch the prompt cache (cold cache example costing ~$5, once-an-hour warm ping, ~$437 saved, Ribbon mod); Level 3 self-evolving memory via a `/note` fix backlog, `/calibrate`, and suggested fixes in Recos.
- `#L463-L502` — Memory prompts: Level 1 plain-text map prompt (short memory.md, claude.md as map, router files, image descriptions, no vector DB); Level 2 usage-saving prompt (standing compaction rules, 30-day cold-cache audit, hourly warm ping with a note that cache is per model); Level 3 prompt building `/note` and `/calibrate` with approval before changes.
- `#L503-L553` — Part 4, Apps: definition, Level 1 connect anything in order (maker tools, community CLI, API, community MCP) with the note that MCPs load every tool list each chat, and `/search-connectors`; Level 2 mods (usage bar) and browser extensions (grab site code, save YouTube titles) loaded via developer mode; Level 3 a micro app per big job (RUBRIC Editor, Carousels, Generations) starting from a reusable UI parts library.
- `#L554-L591` — Apps prompts: connecting an app with the lightest-first order, key handling, and one real test; a one-job Chrome extension that runs as plain code and saves to a readable folder; a micro app for the most-repeated review job, built on a small UI parts library with copy-back comments and file persistence.
- `#L592-L656` — Tools and links: classroom items (RUBRIC Agentic OS, Carousels, Recos, Editor, Generations, `/search-connectors`, `/clean-up`), free items (Ribbon usage mod, calibrate skill), and video links (9 Claude Mods, Images and video with Claude, Jev, first ARMS levels, Katie Dill talk).
- `#L657-L720` — Before you go and recap: pacing advice (a level an evening) versus the weekly loop of noticing which job deserves a skill, cap, memory, or app; community offer; the twelve-level ARMS checklist with one test per level and the closing "cheaper, faster, better" line.
