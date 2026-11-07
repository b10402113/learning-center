---
source: sources/js-mastery-engineer/20261107/supplement/028 - Tools- What the Model Can Call.txt
source_type: text
source_lines: 87
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- A tool is a specific, defined action the agent is allowed to perform and can get a real result from, not a suggestion or a description.
- The model's training has a cutoff, so for current facts it reaches for a web search tool and answers from what it actually found.
- Tools are like functions or API calls: read("auth.ts") returns contents the way a function returns a value.
- Some tools are built in, such as reading a file or searching the web, and others can be added.
- The agent does not run the function itself; it requests a tool call, something else executes it, and the result comes back.
- The core set is Read, Write, Edit, Search (grep/glob), and Run a command, and these cover the vast majority of agent work.
- Reasoning and execution are separate, so a right decision can still produce a bad result from a malformed call, a missing file, or an unavailable command.
- Tool calls are real operations with real cost, so a quiet-looking file read still has weight, and MCP is the next topic for reaching outside services.

# L2 detail

- `#L1-L5` — Opening: the four primitives were named, and tools are the one already seen in action.
- `#L6-L34` — What a tool actually is: the web-search example, the function-call analogy, built-in versus added tools, and the chatbot distinction.
- `#L35-L47` — The core set of Read, Write, Edit, Search, and Run a command, and the claim that they cover most work.
- `#L48-L63` — Why "calling a tool" is the right mental model and how reasoning and execution fail separately.
- `#L64-L80` — Why this matters for reading a session, the real cost of each call, and the learning summary.
- `#L81-L87` — Transition to MCP for wiring up outside services such as a calendar, database, or third-party API.
