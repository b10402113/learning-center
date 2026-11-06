---
source: sources/ai-agent-workflows/20261105/course/3-mcp-skills.txt
source_type: text
source_lines: 281
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- MCP (Model Context Protocol) is Anthropic's 2024 standard, now under the AI Foundation/Linux Foundation, for connecting tools and APIs to LLMs, analogous to HTTPS for the web.
- An MCP server exposes a tool list; an MCP client (Copilot, Cursor, or another harness) calls the server and passes results back to the LLM.
- MCP standardizes transport and format, not the tool itself; pre-MCP, a vendor API change broke every developer's integration, while with MCP the vendor maintains the server.
- Skills give the agent instructions and preferences (packages, syntax, component libraries) rather than external access; a skill is a `SKILL.md` with name, description, instructions, and optional bundles.
- Skills protect context through lazy loading: roughly 100 tokens of metadata per skill is always present, instructions (target under about 5,000 tokens) load on invocation, and nested bundles load only when needed.
- Skills can bundle deterministic scripts so only their output enters context, useful for form validation and format conversion.
- The same tools, skills, and API connections that improve freshness and reduce hallucination permanently consume context, worsening the context budget.

# L2 detail

- `#L1-L14` — Definition: MCP = Model Context Protocol, created by Anthropic in 2024, now part of the AI Foundation under the Linux Foundation; HTTPS analogy for standardizing tool/API connections.
- `#L15-L49` — Roles: MCP server supplies tools; MCP client (Copilot/Cursor harness) executes them; results return through the client to the LLM; the standard covers transport/format, not the tool, and works across clients.
- `#L50-L82` — Before MCP, a Slack API change broke every agent integration and forced thousands of engineers to fix it; with MCP the vendor owns server compatibility, citing GitHub, Datadog, and Slack.
- `#L83-L127` — End-to-end call flow: server returns tool list, LLM selects one, client asks server, underlying API executes, result returns to client and then the LLM; note that building MCP servers is a larger topic.
- `#L128-L170` — Skills vs tools/MCP: tools reach outward; skills supply instructions such as preferred tools, class over function syntax, or a specific component library; Anthropic originated skills but they now work across models.
- `#L171-L188` — Skill contents: a `SKILL.md` with name, description, instructions, and possibly bundled documents/tools/skills; metadata always loaded, instructions only when invoked.
- `#L189-L224` — Lazy bundled information: a frontend/backend codebase skill only loads the relevant section; context is limited, especially for smaller agents at a few hundred thousand tokens.
- `#L225-L245` — Anthropic's sizing: about 100 tokens of always-loaded metadata per skill, instruction layer kept under about 5,000 tokens; arbitrarily nested bundles are free until needed.
- `#L246-L266` — Skills can bundle real scripts; running them puts only the output in context, giving deterministic results for validation or format conversion instead of model guesswork.
- `#L267-L281` — Closing warning: tools, skills, and API connections sit in context all the time, so the fix for stale knowledge and hallucination makes the context problem significantly worse.
