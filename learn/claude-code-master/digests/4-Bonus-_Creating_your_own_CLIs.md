---
source: sources/claude-code-master/20261031/6-Volume E - Apps/4-Bonus- Creating your own CLIs/4-Bonus-_Creating_your_own_CLIs.en.vtt
source_type: text
source_lines: 929
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Premise — the instructor connected Claude Code to Skool and MyFitnessPal, neither of which has a public API, by building custom CLIs; a Telegram agent now logs meals into MyFitnessPal.
- Tool — The Printing Press (printingpress.dev), an open-source toolkit/skill that prints a token-efficient Go CLI, a Claude Code skill, an OpenCode skill, and optionally an MCP server for any app.
- Repo starting points — the official Printing Press GitHub repo plus the Printing Press library repo of community-printed CLIs (Notion, Slack, Linear, Fireflies AI, Google Photos, Google Ads, Mercury, Kalshi, Domino's).
- Method — a five-step process whose only manual step is capturing real traffic: DevTools → Network → preserve log, perform the action once, then "Copy all as HAR" and hand the HTTP archive to Claude Code.
- Rest of the process — Claude Code extracts the real API calls, drops tracker noise, groups endpoints by topic, generates the CLI and skill, and sets up a local SQLite mirror of selected data to avoid IP blocks and extra tokens/bandwidth.
- Use — invoke the new CLI as a routine skill via slash command or natural language; the Telegram agent can call it, and image-in/auto-logging is floated as a next step.

# L2 detail

- `#L1-L60` — Hook: Claude is connected to Skool, which has no public API, and the instructor queries member posts from Claude Code; a Telegram agent added a meal to MyFitnessPal, also API-less, using custom CLIs. Introduces The Printing Press and lists community CLIs: Google Photos, Google Ads, Mercury, Kalshi, Domino's.
- `#L61-L130` — Why connectors matter: the information and work live in daily tools, so an agent that cannot reach them cannot automate that work. Names the three avenues (CLI, API, MCP) and states The Printing Press creates a CLI for any external tool. Begins differentiating them.
- `#L131-L200` — APIs are popular but return a verbose JSON wall of text containing more than the agent asked for, so they burn tokens. Anthropic then invented MCP, but loading many MCPs preloads their tool descriptions every session, like handing the agent the whole menu before it connects.
- `#L201-L260` — Consequence of MCP preloading: the context window fills before any prompt. This is why the instructor first checks whether a CLI exists for a third-party tool; CLIs are the lightest because the tool returns only the specific ask.
- `#L261-L330` — Under the hood: a CLI command returns just the last three YouTube videos, while a verbose API returns many unused attributes, and a YouTube MCP (search videos, get video details, get channel info) preloads all tool descriptions. For broad general use, CLI wins — but CLIs must exist, which is why Printing Press exists.
- `#L331-L400` — printingpress.dev is a toolkit/skill set: invoking it makes Claude Code print a best-in-class CLI for anything, including a token-efficient Go CLI (Go is Google's language), plus a Claude Code skill, an OpenCode skill, and optionally an MCP server. Points to the official GitHub repo and the community CLI library.
- `#L401-L480` — Install: send the repo link to Claude Code, but have it personalize the setup rather than just install. Example prompt: "using this what are the top three CLIs I can print based on all you know about me" — it suggests a YouTube analytics CLI, a Substack CLI, and a to-do CLI, and knows MyFitnessPal exists.
- `#L481-L560` — Alternatively browse the Printing Press library repo of community-printed CLIs; it is new and small, so ask Claude Code for the top CLIs useful to you. It surfaces Notion, Slack, Linear, and Fireflies AI (meeting transcripts). The website also offers a visual browse, including a Domino's pizza CLI.
- `#L561-L640` — The real power is printing your own. The instructor built the MyFitnessPal CLI inside a Claude Code session in about 15 minutes, then asked Claude Code to explain Printing Press as a five-step process and render it as HTML slides. Step 1: capture essential website actions for Claude Code.
- `#L641-L710` — Step 1 mechanics: use the site normally with Chrome DevTools recording. Press F12, open the Network tab, tick "Preserve log", confirm recording, then perform the action once (adding food in MyFitnessPal) so all network elements are captured.
- `#L711-L780` — Right-click the requests, choose Copy → "Copy all as HAR" (HTTP Archive) and give it to Claude Code. Steps two onward are handled end to end by Claude Code; your job is to steer and confirm the spec matches intent.
- `#L781-L850` — Claude Code reads the HAR, picks out the real API calls, drops noise such as trackers, groups endpoints by topic, then generates the CLI tool and a Claude skill from the agreed spec. It also bundles a local copy of relevant data into a SQLite database as a mirror/cache.
- `#L851-L929` — Why the local mirror: repeatedly hitting the source risks IP blocks and costs more tokens and bandwidth; a select local dataset is faster and editable. Then run or include the CLI in a scheduled routine, invoked by slash command or natural language, or through the Telegram agent (e.g. "control MyFitnessPal"). Closes with an idea to send an image and replicate Cal AI-style logging, and a pitch for the RoboNuggets community.
