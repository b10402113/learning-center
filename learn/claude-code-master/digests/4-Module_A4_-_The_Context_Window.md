---
source: sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/4-Module A4 - The Context Window/4-Module_A4_-_The_Context_Window.en.vtt
source_type: text
source_lines: 403
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Definition — the context window is the "desk" of a digital employee: every exchange fills it, it has a hard token limit, and hitting that limit ends the usable space for that session. In Claude Code, Opus shows a 1 million token context window.
- Compaction — when the window fills, Claude Code summarizes older content via compaction; `/compact` triggers it manually, and it refuses when there is too little to compact. In practice the author lets sessions run and only compacts once context rot appears; a full window also auto-compacts.
- Context rot — longer sessions get perceivably dumber because the window accumulates dead ends, stale details, and old errors; 1 million tokens is roughly seven Harry Potter books, so the model may surface the chapter-2 answer instead of the chapter-10 one. Starting fresh is often better than extending a stale session.
- `/context` — shows how much of the window is used; only chat messages appear in the purple area (demo: 7,000 tokens), because before you type anything a fixed system prompt, system tools, memory files, and skills already consume roughly 20,000–25,000 tokens or more depending on workspace size.
- Outlook — the window is large and growing, so it is not the biggest blocker for most users today.

# L2 detail

- `#L1-L100` — Desk analogy for the context window, the hard token limit per session, switching models to show Opus's 1 million context, and an input of ~5 tokens versus a ~200-token reply.
- `#L101-L175` — What happens at the limit: older content is summarized by compaction, `/compact` explained as the AI summarizing its own corpus, and a short session where `/compact` refuses.
- `#L176-L260` — Compacting a real landing-page session to free space; context rot defined (dead ends, stale details, old errors), the "gets dumber" effect, and 1M tokens ≈ seven Harry Potter books.
- `#L261-L340` — Practical advice to let sessions run and compact reactively, automatic compaction at a full window, `/context` output, and the purple messages area consuming only 7,000 tokens.
- `#L341-L403` — Pre-consumed tokens before any prompt: Anthropic's fixed system prompt and system tools plus memory files and skills, roughly 20,000–25,000 tokens (or more), and the conclusion that context size is not the main blocker.
