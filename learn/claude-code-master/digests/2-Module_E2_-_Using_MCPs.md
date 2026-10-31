---
source: sources/claude-code-master/20261031/6-Volume E - Apps/2-Module E2 - Using MCPs/2-Module_E2_-_Using_MCPs.en.vtt
source_type: text
source_lines: 317
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Setup — you can ask Claude to find and connect an MCP (e.g. the HiggsField MCP) but that costs tokens because it researches first; handing Claude the MCP server URL directly is cheaper.
- Verify — in the VS Code extension, type `/mcp` or click MCP servers to confirm a connector is live.
- What MCP gives you — the third-party tool becomes usable inside the Claude Code session; connected HiggsField, the agent can generate images, and it knows available image models (GPT Image 2 from OpenAI is named).
- Benefits — MCPs are more official and get a nicer UI; the Claude desktop app lists connectors under customize, supports custom connectors by name + MCP server URL, and Claude Design (under co-work/chat) can use the same connector inside one design chat.
- Drawbacks — some MCP connectors have capability gaps; the out-of-the-box Gmail connector can read and write mail with approval but cannot mark emails as read, blocking "parse only unread" automations.
- Workaround — for Gmail the course uses the Google Workspace CLI instead, shown in the next module.

# L2 detail

- `#L1-L58` — Practical MCP setup: asking Claude to find the HiggsField MCP works but costs tokens due to research; instead supply the MCP server URL directly to Claude Code. In the VS Code extension, `/mcp` or clicking MCP servers shows HiggsField already connected. Explains that an MCP connector exposes the third-party tool inside the session.
- `#L59-L118` — Demo: with HiggsField connected, ask Claude Code to generate an image using `/robo design`; it understands the skill, can list available image models, and is asked to use GPT Image 2 (OpenAI's latest). It confirms generation and the credit amount, then the image appears in HiggsField.
- `#L119-L170` — Benefits of MCP: connectors are more official, and the Claude desktop app shows them under customize → connectors with icons. A custom connector can be added by giving it a name (Higgsfield) and the MCP server URL; duplicate URLs are rejected.
- `#L171-L222` — Claude Design rationale: connectors also appear in Claude Design (now found under co-work/chat) via profile photo → connectors, letting slides, animations, or site prototypes pull images/video from tools like Higgsfield in one chat. Example: a slide made with one prompt, then a second prompt to add a title slide using Higgsfield GPT Image 2, rendered into the slide.
- `#L223-L278` — Drawbacks: MCP connectors may cap what Claude can do. The built-in Gmail connector exposes read and write email with adjustable approvals, but as of recording it cannot mark emails as read.
- `#L279-L317` — Consequence: an automation that reads only unread email then marks them read each day is impossible via the Gmail MCP. This is why the course uses the Google Workspace CLI for Gmail, covered next.
