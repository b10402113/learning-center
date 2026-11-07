---
source: sources/js-mastery-engineer/20261107/supplement/015 - What the Agent Sees.txt
source_type: text
source_lines: 94
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The agent did not know where the login bug was; it had to grep, open the component, and follow the handler.
- Knowing is not something the agent starts with: it only knows what is currently loaded into its context window.
- The lesson names the gap between what you carry in your head and what the agent actually has in front of it.
- The context window holds only the current conversation, files explicitly read, always-on configured context such as CLAUDE.md, and system instructions.
- The rule of thumb: if you did not say it and it did not read it, it does not know it.
- Failures such as reintroducing a bug or ignoring a constraint are usually context gaps, not the agent being dumb.
- The resulting habit is to ask before each prompt whether the agent actually has the file, convention, or constraint it needs.
- That instinct is context engineering, built properly in Module 4; the next lesson covers how the agent reads code without an index.

# L2 detail

- `#L1-L18` — Opening: the agent had to search its way to the login bug because it only knows what is in its context window.
- `#L19-L32` — The gap between the developer's long-held project knowledge and the agent's session-only knowledge.
- `#L33-L44` — The complete contents of the context window: conversation, explicitly read files, always-on context, and system instructions.
- `#L45-L51` — The rule of thumb that unstated, unread information is unknown.
- `#L52-L71` — Four common context-gap explanations for behavior that feels inexplicably wrong.
- `#L72-L88` — The shift to asking "does it actually have what it needs?" and the link to context engineering.
- `#L89-L94` — Next lesson: how the agent reads the codebase without an index or embeddings.
