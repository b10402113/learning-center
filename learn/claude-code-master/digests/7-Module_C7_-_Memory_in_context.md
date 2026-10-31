---
source: sources/claude-code-master/20261031/4-Volume C - Memory/7-Module C7 - Memory in context/7-Module_C7_-_Memory_in_context.en.vtt
source_type: text
source_lines: 115
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Always loaded — CLAUDE.md and MEMORY.md are loaded every session and pre-injected once you send the first prompt.
- Measuring cost — `/context` shows the memory files layer and its token size, reported as roughly 8,100 tokens in the example.
- No fixed size rule — each person's work differs, so there is no rule for how big CLAUDE.md or MEMORY.md should be.
- Audit threshold — memory files exceeding about 50,000 tokens are worth auditing, especially on the Pro plan.
- What you can change — the system prompt and system tools are pre-coded by Anthropic as part of the Claude Code harness, so they are not adjustable.
- What is malleable — memory files and skill descriptions are user-controllable, making them the lever for trimming context.

# L2 detail

- `#L1-L25` — Both memory layers load every session: CLAUDE.md and MEMORY.md are pre-injected as soon as you start prompting in a session or chat window.
- `#L26-L60` — `/context` shows the memory files as a green layer, giving the exact token size of CLAUDE.md plus MEMORY.md, which in the example is a healthy 8,100 tokens.
- `#L61-L115` — No universal size rule, but memory exceeding about 50,000 tokens warrants an audit, especially on Pro; system prompt and system tools are fixed by Anthropic's harness, while memory files and skill descriptions are user-malleable levers for token management.
