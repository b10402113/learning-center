---
source: sources/claude-code-master/20261031/6-Volume E - Apps/1-Module E1 - Intro to Apps/1-Module_E1_-_Intro_to_Apps.en.vtt
source_type: text
source_lines: 329
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Three connection methods — Apps connect to agents via MCP (Model Context Protocol, launched by Anthropic), APIs (API keys given to Claude Code), and CLIs (command line interfaces); the instructor defaults to CLIs.
- Why it matters — a tool may have no MCP, a thin MCP, or a CLI, so knowing all three lets you route around limitations; you can even build your own CLI for apps with no native connector.
- Token cost is the headline — MCPs consume the most context because every tool description is preloaded each session; APIs return verbose JSON; CLIs return only the requested output.
- Context evidence — typing `/context` in Claude Code shows tokens already allocated before the first prompt, under `system tools`, from MCP descriptions (e.g. 50 tools' descriptions).
- Severity varies — on a Max plan this is usually not a problem, but APIs and CLIs still buy flexibility.
- Scope of the module — APIs were covered in earlier modules; this volume dives into MCP connectors and CLI tools.

# L2 detail

- `#L1-L46` — Course framing: agents should be connected to the apps you work in (Gmail, YouTube, calendar); even without an official connector you can create one yourself. Introduces the three methods and states MCP connectors were launched by Anthropic specifically for agents.
- `#L47-L110` — Prior to MCPs there were APIs, where you generate an API key and hand it to Claude Code; the instructor's preferred method is CLIs. Explains that some apps lack an MCP or have a limited one, and that CLI knowledge lets you work around those limits and build your own. Starts the token-consumption comparison.
- `#L111-L175` — Under the hood for MCPs: every session preloads all tool descriptions into the context window, so 50 tools' descriptions are consumed at the first prompt. Demonstrated by opening Claude Code and clicking MCP, then `/context`, showing pre-allocated tokens under `system tools` before anything is typed.
- `#L176-L237` — Notes that on a Max plan this usually is not a problem, but APIs and CLIs still add flexibility. APIs are flexible but return verbose JSON, so an agent asking only for a YouTube video's title and description must read the whole structure; CLIs shine because the agent types one command that prints just the title of the last three videos of a channel.
- `#L238-L290` — CLI output is leaner and uses less context, which is why the instructor defaults to CLIs among the three. Concludes the background section: APIs were covered in earlier modules, so this module proceeds to MCP connectors and CLI tools.
- `#L291-L329` — Closing statement: learn all of them. Reaffirms the module plan — dive into MCP connectors and CLI tools now.
