---
source: sources/claude-code-master/20261031/8-Volume G - Agentic OS/5-Module G5 - Apps- 3 New Levels/5-Module_G5_-_Apps-_3_New_Levels.en.vtt
source_type: text
source_lines: 501
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Level 1 — connect apps: the unlock is reaching apps with no official connector through a `/search connectors` skill, which checks in a fixed order — official connector, community CLI, API, community MCP.
- Cost order — CLIs are lightest (one short command), APIs return verbose payloads Claude must read, and MCPs are heaviest because every session loads the full list of each server's capabilities.
- Level 2 — mods: small Chrome-extension-like add-ons for Claude Code (e.g. the usage/token Robo bar), and the same concept applied to Chrome via extensions built from a `/chromify` skill.
- Level 3 — micro apps for routine big jobs: instead of chat, purpose-built local apps for reviewing video cuts, Instagram carousels, and generated media.
- Reusable UI — a component library inside the `/robo` skill avoids rebuilding from scratch and keeps team output consistent (Stripe's UI library for employees and agents as precedent).

# L2 detail

- `#L1-L63` — Apps are the last layer: external applications Claude can reach outside chat plus applications you build yourself. Level 1 is connecting the apps you use, and the main unlock is connecting apps with no official connector, such as Adobe Premiere Pro and MyFitnessPal; rather than digging through settings, a `/search connectors` skill scours the internet in a specific order: the maker's official connector, then a community CLI, then the application's API, then a community MCP.
- `#L64-L126` — Order matters by weight. CLIs are lightest: Claude types one short command and gets only the answer it asked for, saving usage. APIs, obtained via an API key, are a step heavier because responses are long with detail Claude does not need yet must read.
- `#L127-L189` — MCP connectors are heaviest: every new chat loads the full list of what each MCP can do before anything is asked, so MCP use should be kept light, which is why the search order exists. Level 2 is mods, which change Claude Code itself: a mod is a small add-on, like a Chrome extension for Claude Code, that can change how it looks and works, such as the usage Robo bar showing weekly and five-hour limits plus prompt-cache information.
- `#L190-L252` — Mods need not stop at Claude Code. The browser is the other app always open — it hosts artifact review and the browser-based OS dashboard — and Chrome has always had mods in the form of extensions, so extensions can shape daily work on sites and browser apps; a `/chromify` skill encodes Chrome extension best practices.
- `#L253-L315` — Extension examples: RoboCapture grabs the underlying code of a liked part of a website so Claude can reverse engineer the look instead of working from a screenshot, and another extension saves a YouTube title or thumbnail into a database skill on right-click. Extensions run via code and cost no tokens but leave references for later work; build them with Claude, enable developer mode in Chrome, and load them from the computer. Level 3 is a micro app for a big recurring job.
- `#L316-L378` — Level 3 rationale: once a task is routine, a chat window may not be the best interface, and much work now happens in local apps Claude built. The rubric editor reviews every cut with the actual clip and accepts comments, easier than typing in chat; a small app reviews Instagram carousels Claude makes. A good tip is to start a reusable UI component library.
- `#L379-L441` — A "Generations" micro app collects generated images and videos through a more direct connection to the image and video model. The `/robo` skill includes a component library Claude can pick from instead of remaking each component, saving tokens and keeping components consistent across employees and teammates; Stripe's VP of design Katie Dill described a similar UI library employees and their agents draw from for branded, cost-efficient, unified material.
- `#L442-L501` — The ARMS framework is complete. Closing: the prompts and resources mentioned are in a linked guide that can be sent to an agent for the useful parts, and the session ends with an invitation to subscribe for more AI-for-business content.
