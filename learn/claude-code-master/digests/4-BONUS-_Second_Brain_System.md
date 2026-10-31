---
source: sources/claude-code-master/20261031/4-🎁 BONUS- Second Brain System/4-🎁_BONUS-_Second_Brain_System.en.vtt
source_type: text
source_lines: 1252
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Second brain as an optional layer on top of ARMS — built with Claude Fable 5; the whole system and its visual are exported so you can hand them to your own agent instead of paying to rebuild them.
- Departments, not one flat folder — the tour shows business, content, and personal departments, each with its own files, plus a visual graph of the entire agentic operating system.
- Four visible layers — blue applications (MCP connector, API, or CLI), yellow routines (scheduled background tasks), memory (a reported 35,466 files mapped into relationships), and skills (openable, with links to the files and routines they serve).
- Graph view with a purpose — unlike an Obsidian-style graph kept for show, this one surfaces which apps are connected or missing, which routines to retire, and how departments compare in size.
- Tested value: speed and tokens — side-by-side sessions show the second brain answering faster and using ~30k tokens versus ~50k for default Claude Code with GP/Glob, roughly 40% savings.
- Deterministic retrieval via `brain.js` — custom JavaScript strips filler keywords, scores indexed candidate sources without opening them, follows section pointers, and only then hands the answer to the model.
- Build principles — `/last30days` deep research on second-brain best practices, plus reference open-source memory projects (QMD, Gbrain, Graphify), plus a slash goal enforcing a load time under 10 seconds.

# L2 detail

- `#L1-L110` — Framing: the second brain is optional after ARMS (skills, memory, routines, applications) is in place. Fable 5 built the speaker's system; the system and visual are imported for anyone without access or budget, with the emphasis on principles, since every workspace differs.
- `#L111-L205` — Tour of the graph: separate files for business, content (personal and community), and personal work; departments mirror a company second brain. The critique: an Obsidian-style graph usually exists for show, while this one shows file counts per department and the whole agentic operating system at a glance.
- `#L206-L305` — ARMS as the standard: getting applications, routines, memory, and skills right puts you ahead of 99% of agentic-tool users. The blue line lists connected applications (Google Calendar, Google Drive, etc.) via MCP connector, API, or CLI tool.
- `#L306-L410` — Application visibility cuts both ways: an often-used tool absent from the blue circle needs plugging in, and more nodes mean more power but also more trust and risk (a fully connected HubSpot can email your list). Idle integrations should be disconnected. Routines follow the same principle.
- `#L411-L510` — Routines as scheduled background tasks: many routines mean automation and saved time, but forgotten ones should be retired. The speaker's run on the Hermes agent, with the daily log skill readable straight from the second-brain view or from the Windows file explorer.
- `#L511-L610` — Memory layer: about 35,466 files that Fable mapped into nodes and relationships, usable as a replacement for Finder or File Explorer to locate and open a specific document or photo (a 5x5 grid of profile photos). Skills are the most important and useful layer, openable from the same view.
- `#L611-L710` — Skills connect to specific files and routines, which makes this view a clean way to walk a client through their agentic operating system and its departments, clicking into folders. But any visualization captures only ~30% of the value; the other 70% is day-to-day work.
- `#L711-L810` — The real test: does Claude retrieve documents faster and at lower token cost? If the system slows you down or costs more to find files, it is not worth it. Two Claude Code sessions, one with the second brain and one without, are given the same prompt; the second brain answers first, the default one falls back to GP and Glob.
- `#L811-L910` — Reading `/context`: system prompts, tools, memory files, and skills are pre-injected and mostly fixed; the purple messages area is what Claude did. The second brain used ~30,000 tokens versus ~50,000 (~40% savings), and further tests Fable ran passed the same criteria. Design detail: Fable wrote `brain.js`.
- `#L911-L1010` — `brain.js` runs at the start of a retrieval task. Asked which TTS voice was used, it strips filler and keeps the keyword; because it is deterministic code over indexes and reference maps, it scores candidate sources without opening them and avoids invoking the model for the search.
- `#L1011-L1110` — Retrieval depth: open the highest-scoring Markdown file, check whether it has a section holding the answer rather than reading the whole file, and follow the section if it is a pointer elsewhere. Only then is the answer passed to the LLM. The transferable part is the guidance, not the exact system.
- `#L1111-L1210` — Guidance inputs: `/last30days` (Matt Van Horn) scouring Reddit, Twitter, YouTube, Hacker News for second-brain best practices, combined with a scan of the workspace; reference repos include QMD (query my docs, semantic search), Gbrain, and Graphify (smarter file/folder connections). A slash goal makes it self-check layout changes for lag.
- `#L1211-L1252` — Performance goal: the interface must reload in under 10 seconds and keep optimizing until it does. Closing: the second brain is a good use of Fable 5 while it is on non-usage-based pricing, and offloading context and memory work is worth it while it stays in the subscription.
