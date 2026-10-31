---
source: sources/claude-code-master/20261031/4-Volume C - Memory/5-Module C5 - Memory MD explained/5-Module_C5_-_Memory_MD_explained.en.vtt
source_type: text
source_lines: 160
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Long-term memory — MEMORY.md is where Claude Code keeps long-term memory, alongside CLAUDE.md as the second of two memory levels.
- What it is — a short reference list, roughly 75 lines in the example, that indexes memory artifacts accumulated during conversations.
- Index not storage — instead of loading all memories into one long file, MEMORY.md points to separate markdown files.
- Nested pointers — for example memory-feedback.md lists further markdown files of feedback, such as feedback-audience-non-technical.md.
- Artifact shape — each artifact file has a name, a description, and a body that Claude Code reads when it judges the memory relevant to the task.
- Practical effect — MEMORY.md lets Claude Code search the file cabinet and retrieve relevant past conversations so it can assist better.

# L2 detail

- `#L1-L43` — Two levels of memory: CLAUDE.md is read in full every session, and MEMORY.md is the other file Claude Code reads, holding long-term memory.
- `#L44-L76` — MEMORY.md is essentially a short index of about 75 lines that points to separate markdown memory artifacts rather than storing them inline.
- `#L77-L124` — Example chain: memory-feedback.md points to feedback files, and feedback-audience-non-technical.md shows the artifact format of name, description, and body read only when relevant.
- `#L125-L160` — Conclusion: MEMORY.md is an index that lets Claude Code look through the file cabinet and find relevant artifacts and past conversations.
