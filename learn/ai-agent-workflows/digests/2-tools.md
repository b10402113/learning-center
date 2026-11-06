---
source: sources/ai-agent-workflows/20261105/course/2-tools.txt
source_type: text
source_lines: 353
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Agent anatomy is split into what it can do (tools, MCP, skills), what it knows (RAG, context, memory), and how it thinks (planning, reflection).
- Agents are loops that do, think, and act until a stopping condition; because LLMs only handle text, tools provide reach into the environment.
- A tool is metadata (name, description, schema) plus an executable function, e.g. web search, computer-use GUI control, or a Slack message fetch.
- The LLM sees only tool metadata, never the function body; unclear names, descriptions, and parameters are the main cause of tool bugs.
- The LLM does not execute tools: it emits a call string, surrounding code runs the function, and the result must be passed back as an observation.
- Even models not trained for tool use can call tools through a prompted output convention parsed with regex, though trained models are far more reliable.
- Good tool design means clear naming, examples, narrow scope, few required parameters, and avoiding tool sprawl because all metadata stays in context.
- The career product could easily require 50–1000 tools and API connections, each of which breaks on vendor API changes, motivating MCP.

# L2 detail

- `#L1-L20` — Section map: what the agent can do (tools, MCP, skills), what it knows (RAG, context, memory), how it thinks (planning, reflection).
- `#L21-L58` — Agents are loops with a breaking/stopping condition; LLM text-only limits require tools to touch the outside world.
- `#L59-L79` — Tools defined: fetch external information, call APIs, run code, call other models; read-only vs read-write; guardrails belong in tools, recalling Replit's deleted database and `rm -rf`.
- `#L80-L105` — Tools escape pre-training data and provide real-time information; common examples are web search and computer use that operates a GUI.
- `#L106-L130` — Building a tool = metadata (name, description, schema) + function; a Slack "get messages" API wrapper is already a complete tool.
- `#L131-L162` — The model only sees metadata, so metadata must make selection and parameters unambiguous; the function body is for the surrounding code.
- `#L163-L198` — Ambiguous `get_weather(city)` forces guesses about zip code, format, or "Chicago, Illinois"; most tool bugs are unclear wording, and if it confuses you it will confuse the model far more.
- `#L199-L246` — Execution flow: LLM outputs function name and arguments, your code executes, output returns to your code, and only then is it fed back to the LLM as an observation—explaining the "magic."
- `#L247-L296` — Untrained small models can still use tools via a system-prompt format (e.g. capitalized TOOL + name + parameters) and regex parsing; trained models are preferred for reliability.
- `#L297-L334` — Tool documentation and hygiene: descriptions, parameter clarity, names, examples; avoid overly broad tools, too many parameters, and many overlapping tools, since metadata always occupies context.
- `#L335-L353` — Career product could need hundreds of tools for databases, school APIs, and scholarships; every API change breaks a connection, which is why MCP comes next.
