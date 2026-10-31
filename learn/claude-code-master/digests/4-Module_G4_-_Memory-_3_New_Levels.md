---
source: sources/claude-code-master/20261031/8-Volume G - Agentic OS/4-Module G4 - Memory- 3 New Levels/4-Module_G4_-_Memory-_3_New_Levels.en.vtt
source_type: text
source_lines: 1063
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Level 1 — long-term memory: everything in the workspace ("second brain"), organized as three plain-text routing layers — `MEMORY.md`, `CLAUDE.md` (or a shared `AGENTS.md`), per-department files like `business.md`, plus database skills.
- Retrieval over embeddings — the goal is fast, cheap retrieval as files pile up (~420,000); plain-text routers beat vector embeddings and RAG, matching what Anthropic reportedly finds at millions of files.
- Level 2 — short-term memory: the context window (1M tokens on Claude 5.5, about the first four Harry Potter books), with two costs — context rot and re-reading a bloated chat every prompt.
- Cache discipline — `/compact` with explicit keep rules, monitor the prompt cache (it goes cold after ~1 hour), and self-ping sessions hourly to stretch warmth to four hours.
- Level 3 — self-evolving memory: `/note` parks mid-task fixes in a backlog, `/calibrate` deliberately saves important feedback and links it to memories and the owning skill, and a recommendations app suggests memory improvements.

# L2 detail

- `#L1-L106` — Memory is everything Claude knows about you and your work, plus how fast and cheaply it can retrieve it, since files pile up with agent use and searching all of them is slow and burns usage. Memory splits into three levels; level 1 is long-term memory, meaning everything saved in the workspace, which is what "second brain" systems really describe — usually just a folder on the computer. The author's visual second brain begins here.
- `#L107-L212` — The visual second brain shows connected applications, routines, department-split files, and skills centered on `CLAUDE.md`. A fancy map is not required; it helps this author because he teaches AI and it is faster than a file explorer, and it represents the exact same files and folders. The real value is faster or cheaper retrieval — Claude finding things without draining usage limits.
- `#L213-L318` — The workspace holds about 420,000 files, so retrieval needs a system, but the author's is simpler than most: three layers that together give Claude a map of the whole workspace. The first layer, default in Claude Code, is `MEMORY.md`, which keeps one short line per remembered thing and is loaded at the start of every chat, like a library card catalog checked before walking the shelves. It links to nodes across departments (content, community, personal), so preloading gives Claude linkages into every part and helps it navigate the map; for a small starting workspace this is usually enough.
- `#L319-L424` — When retrieval starts failing as the workspace grows, the next layer is `CLAUDE.md`, instructions read at every chat start; instead of a handbook, the author uses it as a map that routes to each department's files, with each department getting its own router file such as `business.md` pointing to its subfiles and folders. Claude Code also reads `AGENTS.md`, so one central file can serve multiple AI tools.
- `#L425-L530` — Department routers are usually enough because 5.5 models find what they need from plain text; no vector embeddings are used unless retrieval pain appears. Boris Cherny and Anthropic's workspace, with millions of files, reportedly also find plain text better than earlier vector-embedding and RAG setups. The third supplementary layer is database skills.
- `#L531-L636` — Database skills tell Claude where information lives — e.g. a `/name-of-business-data` skill pointing at the up-to-date data or dashboards for a client — and their `SKILL.md` files are routers too, letting Claude infer where to look from the prompt. The takeaway is to make the whole second brain searchable with these three layers, plain text, and metadata for visual assets. Level 2 is short-term memory: the context window, 1M tokens on Claude 5.5, roughly the first four Harry Potter books.
- `#L637-L742` — Two problems with the context window: the fuller the chat, the worse Claude recalls it (Anthropic calls this context rot), and everything in the window is re-read on every prompt, so a bloated chat costs more and drains usage. Tip one is compacting with a purpose: `/compact` plus what to keep (business decisions, templates), otherwise Claude decides and may drop a needed detail; standing compaction principles can be written into `CLAUDE.md`.
- `#L743-L848` — Tip two is watching the prompt cache, which holds the chat in short-term memory so re-reading costs a fraction. Leaving a chat idle about an hour makes the cache cold, and the next message pays to reload the whole chat. Example: a chat idle 11 hours 30 minutes at about 600,000 tokens on Opus would cost roughly $5 in API credits; a mod (Chrome-extension-like add-on for Claude Code) makes cache state visible without spending tokens.
- `#L849-L954` — A second example has a warm cache: 186k tokens in the context window and only 9 minutes idle, so a message costs a fraction, but about 51 more idle minutes makes it cold. The author directs each session to self-ping hourly for four hours, stretching the one-hour cache life, and an analysis of 30 days of chats concluded this would have saved about $437 at API prices; the usage board is open sourced.
- `#L955-L1063` — Level 3 is self-evolving memory: if you must correct Claude twice on the same thing, memory missed something. Three tools: a backlog of fixes via `/note`, which uses Haiku to park mid-task feedback in a per-skill file to apply later when usage resets; `/calibrate`, which deliberately saves important feedback, links it to related memories, and fixes the owning skill; and Rubric Recos, whose memory section suggests improvements the author selects.
