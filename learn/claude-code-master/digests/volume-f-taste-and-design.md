---
source: sources/claude-code-master/20261028/7-Volume F - Taste and Design
source_type: text
source_lines: 106
status: absorbed
absorbed_at: 2026-10-28
created: 2026-10-28
updated: 2026-10-28
---

# L1 overview

**Volume F — Taste and Design** (10 modules, slide text only). The largest volume: building beautiful, working websites/apps with an agent, following the **CRAFT framework** — **C**reate, **R**ig, **A**udit, **F**ire up, **T**ailor. Thesis: in an AI world front-end *taste* is the real differentiator; don't ship generic "vibe-coded" sites.

- **F1 Incredible Websites** — intro + CRAFT overview: create a beautiful front end, rig the backend, audit it, fire it up live, tailor it for any client. Goal: build almost any site/software with an agentic platform.
- **F2 Creating the Base** — the Create step: research the sections an agency site needs in 2026, trim the list for a first build, then have the agent generate a one-page front end; the /html skill renders the plan visually to review before building.
- **F3 Awesome Design Systems** — turn a generic AI-looking site into your brand: the /robo system restyles a page in one prompt; build your own reusable Design System X skill by combining a base aesthetic + brand palette (exact colors, fonts, spacing, "what this style is NOT" list).
- **F4 UI Sniping** — grab pre-built components from 21st.dev, and use a Robo Capture Chrome extension to snipe any element off a live site and rebuild it in your design system; loading unpacked Chrome extensions.
- **F5 /tweak** — stop re-prompting for every visual change: the /tweak skill drops a live slider panel onto the page (adjust sizes, edit text inline, remove elements), then bakes changes back into the source.
- **F6 Creative AI Aggregators** — the /generate skill connects to Fal AI (pay-as-you-go) for image/video models (Seedance, Veo, Nano Banana); Kie AI and WaveSpeed as cheaper/backup options; drop generated assets into sections.
- **F7 Component Building** — grow Design System X with new interactive components in one prompt (split-view drag, interactive grid, typography animations); run this with the most powerful model right before usage resets.
- **Bonus: Claude Design** — quick intro to Anthropic's new visual front-end tool (still beta); how it may connect with your coding agent for a more visual workflow.
- **F8 Backend Rig and Audit** — the Rig + Audit steps: front-of-house vs kitchen analogy; wire a contact form to send real emails via Resend with an API key; have the agent self-audit the site with Playwright before shipping.
- **F9 Deployment and Launch!** — the Fire up + Tailor steps: deploy to Vercel with a chosen URL in seconds; document the whole build (including corrections) into a reusable website-creation skill; show/tailor on Rubric Flows for any client.

# L2 detail

- `#L94-L98` — `sources/claude-code-master/20261028/7-Volume F - Taste and Design/1-Module F1 - Incredible Websites/index.html` — CRAFT framework overview; taste as the edge; module roadmap.
- `#L94-L98` — `sources/claude-code-master/20261028/7-Volume F - Taste and Design/2-Module F2 - Creating the Base/index.html` — Create step; research/trim sections; /html renders plan; generate front end.
- `#L94-L98` — `sources/claude-code-master/20261028/7-Volume F - Taste and Design/3-Module F3 - Awesome Design Systems/index.html` — design system as reusable skill; /robo; Design System X recipe (colors/fonts/spacing/NOT list).
- `#L94-L98` — `sources/claude-code-master/20261028/7-Volume F - Taste and Design/4-Module F4 - UI Sniping/index.html` — 21st.dev components; Robo Capture extension; load unpacked extensions.
- `#L94-L98` — `sources/claude-code-master/20261028/7-Volume F - Taste and Design/5-Module F5 - -tweak/index.html` — /tweak live slider panel; adjust/edit/remove live; bake back to source.
- `#L94-L98` — `sources/claude-code-master/20261028/7-Volume F - Taste and Design/6-Module F6 - Creative AI Aggregators/index.html` — /generate + Fal AI pay-as-you-go; Kie AI / WaveSpeed; generate & place images.
- `#L94-L98` — `sources/claude-code-master/20261028/7-Volume F - Taste and Design/7-Module F7 - Component Building/index.html` — add interactive components in one prompt; use most powerful model near usage reset.
- `#L94-L98` — `sources/claude-code-master/20261028/7-Volume F - Taste and Design/8-Bonus- Claude Design/index.html` — Claude Design beta; future visual workflow with coding agent.
- `#L94-L98` — `sources/claude-code-master/20261028/7-Volume F - Taste and Design/9-Module F8 - Backend Rig and Audit/index.html` — Rig: contact form → Resend + API key, test it live; Audit: Playwright self-test of every button/form; repeatable rig-then-audit loop.
- `#L94-L98` — `sources/claude-code-master/20261028/7-Volume F - Taste and Design/10-Module F9 - Deployment and Launch!/index.html` — Fire up: deploy to Vercel, chosen URL, custom domain; Tailor: document build + corrections into website-creation skill; Rubric Flows tailoring.
