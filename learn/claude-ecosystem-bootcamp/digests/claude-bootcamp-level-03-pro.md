---
source: Claude Bootcamp Level 03 - Pro
source_type: text
source_lines: 14361
level: 03 - Pro
status: absorbed
absorbed_at: 2026-09-29
created: 2026-09-29
updated: 2026-09-29
---

# Digest — Claude Bootcamp Level 03 — Pro

## Overview (L1)

**Module groupings (from the resources pages):** 01 Stop hitting Claude limits · 02 Claude with LLM and Ollama · 03 [Design] - Foudations · 04 [Design] - Brand Design System · 05 [Design] - UI Design · 06 [Design] - Startup Assets · 07 [Code] - Desktop · 08 [Code] - Routines · 09 [Code] - Where to run.

- 3.1 Why Claude cuts you off — Claude re-reads the whole thread each turn, so cost scales per turn; summarize and start a fresh chat.
- 3.2 5 Great habits — Five token-stretching habits: edit don't correct, batch requests, cut fluff, turn off unused features, match model+effort to the task.
- 3.3 Set it once, use it forever — One-time setup: Projects knowledge base, profile instructions, and memories/chat search to stop re-explaining.
- 3.4 Master your usage window — The 5-hour rolling window starts at your first message; shift it earlier (or automate with a routine) to double productive time.
- 3.5 Claude UI is the product — Claude Desktop is harness + model; "co-work on 3P" lets you swap the model for Ollama, OpenRouter, etc.
- 3.6 Ollama local models — Install Ollama, pull a model, raise the 4K context to 32K, and alias it to a "Claude"-style name for Desktop.
- 3.7 Ollama cloud models — Same Ollama setup but models run on their servers; fast, largely free, but rate-limited and not fully private.
- 3.8 OpenRouter — A gateway of hundreds of models via one API key; Desktop now blocks non-Anthropic names but OpenRouter adds failover/budget/usage control.
- 3.9 9Router - free models — Open-source 9Router sits between Desktop and providers, disguising any model as a Claude model so free models work.
- 3.10 9Router - paid models — Add a specific paid model in 9Router combos (e.g. Qwen 3.5) and use it from Desktop for cents per million tokens.
- 3.11 Install skills, plugins, connectors — Switching to 3P wipes skills/plugins/connectors; manually re-upload skills and plugins and add MCP servers.
- 3.12 Multi connectors with Composio — One Composio connector gives many apps (Gmail, Calendar, Airtable, Tally) instead of one MCP per app.
- 3.13 What is Claude Design — Not a Figma/Canva killer; you describe outcomes in plain English. Flow: Chat (think) → Design (visual) → Code (production).
- 3.14 Having fun with Claude Design — Blank canvas, templates (prototype/slide/document/wireframe/animation), Opus for best output; projects expose source files.
- 3.15 Start from scratch — Build a design system once (color, type, spacing, components); reverse-engineer a live site, then publish as default and export a PDF playbook.
- 3.16 DESIGN.md — A plain markdown brand spec; grab pre-made files from awesome-design-md to skip website analysis and generate a design system faster.
- 3.17 Create a landing page — Build a full landing page from a design system using a structured prompt, annotate edits, image drop, and the tweak control.
- 3.18 Ship it - two paths — Deploy a Claude Design page via Vercel "send to", or hand it off to Claude Code web to get the full codebase.
- 3.19 Mobile app UI — Generate a full multi-screen iOS flight-booking flow as a storyboard, then refine with edit and tweak controls.
- 3.20 Component UI — Drop a screenshot and ask for three distinct concepts of a single component (Airbnb search control) to compare side by side.
- 3.21 Pitch decks — Turn a webpage into a 7-slide markdown outline first, then design the deck in Claude Design and export to PowerPoint/PDF/Canva.
- 3.22 Installations — Pre-flight setup: Git, Node.js (optional but useful), and latest Claude Desktop.
- 3.23 Build 1 — Build a neon snake game to learn the plan → build → iterate workflow, permissions modes, /init memory, and rewrite vs fork.
- 3.24 Slash commands — Built-in slash commands: /init, /clear, /compact, /model, /review, /usage, /context, /rewind.
- 3.25 Build 2 — Build a Kanban board wired to Airtable via MCP connectors and deploy it live to Vercel, all from Claude Code.
- 3.26 What are routines — Routines are saved prompt+connector+repo setups fired by schedule, API call, or GitHub events; compare to Co-work schedules.
- 3.27 Routine 1 — Build a cloud routine that sends a "Good morning" push at 7am daily to start your usage-window session.
- 3.28 Routine 2 — Build an API-triggered routine: Tally feedback form → webhook → Claude drafts a Gmail reply for review.
- 3.29 Terminal — Install Claude Code natively and run it in the plain terminal, logging in with a subscription.
- 3.30 IDE — Run Claude Code inside an IDE (Anti-Gravity/VS Code/Cursor) terminal, setting model, effort, and permission mode.
- 3.31 Claude Extension — The official Claude Code VS Code extension adds a visual layer: model/context, inline edits, file references, and undo/fork/rewind.

## Sections (L2)

### 3.1 Why Claude cuts you off
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.1. Why Claude cuts you off.en.srt]]`
- Summary: Explains that hitting the usage limit is not about message count but about how Claude processes the entire conversation thread on every send. Because context accumulates, message 10 in a long thread costs far more than message 1. Claude now auto-summarizes older parts when code execution is on, which softens but does not remove the problem.
- Key claims: Claude reads the whole thread top-to-bottom on every send, so cost scales each turn; auto-summarization compresses old context but longer chats still burn more limit; ask for a tight summary before leaving a long chat, then paste it into a fresh chat
- Learner-relevant: Builds the mental model for why limits are hit and gives the primary habit (summarize + restart) used throughout the rest of the level.
- Resources: none

### 3.2 5 Great habits
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.2. 5 Greate habits.en.srt]]`
- Summary: Five sub-10-second habits that stretch usage: edit instead of correcting with new messages, batch multiple asks into one request, cut fluff from prompts, disable unused features (research/web search/extended thinking), and match the model and effort level to task difficulty. Each habit reduces accumulated context or token burn.
- Key claims: Editing a prior message avoids reprocessing the whole accumulated context; one batched message produces better output with one context slot; effort level (low → max) trades thoroughness for token spend, so match it to task difficulty
- Learner-relevant: Immediately actionable daily habits for freelancers/operators; also introduces the model+effort selector that recurs in Claude Code.
- Resources: none

### 3.3 Set it once, use it forever
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.3. Set it once, use it forever.en.srt]]`
- Summary: A one-time, roughly 4-minute setup to stop re-explaining yourself: put recurring documents into a Project's knowledge base, put personal/preference instructions into the profile, and enable memories/chat search (paid plans). Documents referenced more than once belong in a project, not the prompt.
- Key claims: Project knowledge is cached so only new/uncached parts count against the limit; profile instructions apply automatically to every new conversation; memories and chat search pull context from everything you've discussed, while projects hold documents for specific work
- Learner-relevant: Foundational cost/latency setup that makes every later chat start smarter and cheaper.
- Resources: none

### 3.4 Master your usage window
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.4. Master your usage window.en.srt]]`
- Summary: Claude limits reset on a rolling 5-hour window that starts at your first message, not at midnight, alongside a weekly cap. The common mistake is sending the first message right when an intensive work block starts, so the window dies mid-block. The fix is shifting the window earlier with a low-effort message ~3 hours ahead, then automating that with a routine.
- Key claims: The 5-hour window begins at your first message and rolls; a 10am–3pm work block started at 10am burns out by noon and locks you until 3pm; send "hi" at 7am so a fresh session opens at noon and lets you work 10am–5pm; automate with a "morning session starter" routine (daily 7am, cheapest model) — routines need a subscription; usage credits are an emergency backup with a monthly spending cap
- Learner-relevant: Direct operational control over the limit; ties into the later routines module via the "morning session starter".
- Resources: none

### 3.5 Claude UI is the product
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.5. Claude UI is the product.en.srt]]`
- Summary: Claude Desktop is two separable things: the harness (chat window, skills, file handling, MCP, agent loop) and the model doing the thinking. Anthropic's "co-work on 3P" (third party) lets you keep the whole harness while swapping in a different model (Ollama, Gemma, Gemini, OpenRouter, Kimi). Three reasons: cost, privacy, and no rate limits.
- Key claims: The harness and model are separable via "co-work on 3P"; three paths are local Ollama, Ollama cloud, and gateways like OpenRouter; enable via Help → Troubleshooting → Enable developer mode, then Developers → Configure third-party inference; it is a cost layer, not a replacement for real Claude on deep-reasoning or reliable multi-step agent tasks
- Learner-relevant: Frames the entire "Claude with LLM and Ollama" module and where to configure third-party inference.
- Resources: none

### 3.6 Ollama local models
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.6. Ollama local models.en.srt]]`
- Summary: Install Ollama, pull a model (e.g. Qwen 3.5), raise its default 4K context to 32K in settings, and connect Claude Desktop's gateway to `localhost:11434`. Because Desktop only recognizes model names that look like Claude models, create an alias (`ollama cp`) named e.g. "Claude Haiku 4.5" to make it discoverable.
- Key claims: Ollama runs models fully locally with no API key; default 4K context is too small for real workflows, so raise it to 32K; Desktop only discovers models whose names start with Claude/Opus/Haiku, so alias the local model; local inference is slower than real Claude on modest hardware
- Learner-relevant: First hands-on path to running a private local model behind the Desktop harness.
- Resources: none

### 3.7 Ollama cloud models
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.7. Ollama cloud models.en.srt]]`
- Summary: For weaker machines, Ollama's cloud tag runs models on Ollama's servers through the same interface. Run with `ollama run <model> cloud`, sign in, and pick free-tier models (e.g. minimax-m2.5, gemma4); some models require a subscription. Alias a cloud model to a "Claude Sonnet" name so Desktop discovers it, then use it in Co-work.
- Key claims: Cloud models are fast and largely free but come with rate limits and are not fully private; not all cloud models are on the free tier (some error "requires subscription"); free cloud usage resets every two hours plus a weekly cap; speed is traded against privacy versus local Ollama
- Learner-relevant: Alternative when hardware can't run big local models; demonstrates the alias trick again and Co-work file access.
- Resources: none

### 3.8 OpenRouter
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.8. OpenRouter.en.srt]]`
- Summary: OpenRouter is a gateway (one account, one API key) to hundreds of models, some free. Create an API key, add a new gateway connection in Desktop (gateway URL ending in `/api`), use a static API key credential, and set workspace restrictions: enable chat beta, allow egress, and disable Anthropic web search (third-party models crash on it).
- Key claims: After a Desktop update, OpenRouter discovery only returns Anthropic models — non-Anthropic names are blocked, worked around in the next video; disable Anthropic native web search when using non-Anthropic models or the request crashes; if the model list doesn't appear, fully sign out rather than just relaunching; OpenRouter still gives provider failover, per-person budget control, and usage visibility for teams
- Learner-relevant: Core gateway setup reused by the 9Router workaround; teaches workspace-restriction settings that must be repeated per connection.
- Resources: none

### 3.9 9Router - free models
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.9. 9Router - free models.en.srt]]`
- Summary: 9Router is a free, open-source middleman that disguises any provider's models as Claude models so Desktop accepts them. Install globally, open the web UI (localhost:20182, default password 123456), connect OpenRouter, and build a "combo" (e.g. Combo3) mixing free models, then point a Desktop gateway connection at the 9Router endpoint.
- Key claims: Desktop blocks model names that don't look Anthropic, which 9Router solves; combos use fallback routing to try the next model when one hits a rate limit; after creating a new Desktop connection you must re-apply workspace restrictions (allow egress, disable Anthropic web search) or web access is blocked; the setup is a workaround, not an official Anthropic feature, but runs free
- Learner-relevant: Enables completely free Co-work sessions and demonstrates combo/fallback routing.
- Resources: none

### 3.10 9Router - paid models
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.10. 9Router - paid models.en.srt]]`
- Summary: For a specific model not listed in OpenRouter, add it manually in 9Router (paste the model id, test, add), then create a paid combo (e.g. "claw-code-pay") selecting only that model. It appears in Desktop's model discovery and can be used in Co-work, costing cents per million tokens.
- Key claims: You can add any specific model by id, validate with Test, and route it through a combo; the Qwen 3.5 paid option costs about 11 cents per 1M input tokens and 80 cents per 1M output tokens; switching to a third-party model wipes skills, connectors, and plugins, which the next video fixes
- Learner-relevant: Shows how to cheaply access a specific paid model; sets up the toolkit-loss problem solved in 3.11.
- Resources: none

### 3.11 Install skills, plugins, connectors
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.11. Install skills, plugins, connectors.en.srt]]`
- Summary: Switching to third-party inference wipes skills, plugins, and connectors because they normally run on Anthropic infrastructure; they must be rebuilt manually in about 10 minutes. Download the official anthropics/skills repo, zip and upload useful skills (creator, MCP builder, web-artifact builder), add plugins (e.g. marketing, finance), and add connectors as MCP servers.
- Key claims: Third-party inference removes all Anthropic-hosted skills/plugins/connectors — not a bug; method one for connectors is adding each MCP server directly (e.g. Firecrawl remote MCP URL with streamable HTTP transport and the API key in the URL); direct MCP means repeating the setup per app, which motivates Composio
- Learner-relevant: Practical recovery recipe after switching to 3P models; introduces MCP server wiring that recurs throughout.
- Resources: none

### 3.12 Multi connectors with Composio
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.12. Multi connectors with Composio.en.srt]]`
- Summary: Composio.dev is a shortcut: connect once to Composio and get a whole library of apps (Gmail, Google Calendar, Airtable, Tally) through a single connector. Create a free account (20,000 tool calls/month), connect apps, then add Composio as a streamable-HTTP MCP server via auto-register in Desktop. Demonstrated by asking Claude to triage unread email and summarize Tally survey responses.
- Key claims: Free tier gives 20,000 tool calls/month and asks for a mobile number at signup; the Composio MCP URL is `https://connect.composio.dev/mcp` with auto-register; use Composio for many apps and a direct MCP when you only need one; you can keep 9Router for free models and switch back to normal Claude by signing in with Claude AI
- Learner-relevant: Rebuilds the full 3P toolkit (model + skills + plugins + connectors) and shows real multi-app agent workflows.
- Resources: From `001 Multi connectors with Composio … .html` — Prompt 1: "Check my inbox for the 5 newest unread emails in the last 3 days. For each one, give me a one-line summary and a priority tag: reply today, this week, or can wait." Prompt 2: "Pull the latest 5 responses from my “Ollama & Local AI” survey on Tally. Summarize each one in 4-5 lines, and flag any that mention WIndows operating system."

### 3.13 What is Claude Design
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.13. What is Claude Design.en.srt]]`
- Summary: Claude Design is not a Figma or Canva replacement; instead of manipulating a canvas you describe the outcome in plain English and Claude builds a landing page, prototype, pitch deck, or animation. It is the visual middle step between thinking and shipping in the flow Chat (think) → Design (visual) → Code (production).
- Key claims: You direct an outcome rather than pushing pixels; Claude Design is for solo founders, freelancers, and indie hackers building without a design team; the three-stage flow is thinking → visual → production, though you don't need all three every time
- Learner-relevant: Sets the conceptual frame for the whole Design module and where Claude Design fits relative to Chat and Code.
- Resources: none

### 3.14 Having fun with Claude Design
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.14. Having fun with Claude Design.en.srt]]`
- Summary: A playground tour of Claude Design's templates — prototype, slide, document, wireframe, and animation — starting from a blank canvas. Demonstrates building an interactive editable text canvas with particle effects, then a list of animated game fonts, using Opus for the best visual results. Projects expose all source files (JS/HTML) for download or hand-off to Claude Code/Cursor.
- Key claims: Templates cover prototype, slide, document, wireframe, and animation; Opus gives better design output than Sonnet at higher token cost; every project's source files can be downloaded and handed to another coding tool
- Learner-relevant: Builds familiarity with templates, canvas, chat, and source access before the serious design-system work.
- Resources: From `002 Having fun with Claude Design … .html` — Prompt 1: "Create a large interactive editable text canvas pre-filled with sample text containing words like 'Fire', 'Smoke', 'Electric', 'Ice' and 'Wind'. Apply matching visual and particle effects to these words. Allow users to drag words with the mouse. The surrounding text should smoothly reflow to accommodate new positions. Keep the text fully editable with live-updating effects." Prompt 2: "Create a list of fonts for my game. Each font should have a name based on a theme or element, and include an animation that matches the name. For example: A 'Thunder' font should have a lightning animation."

### 3.15 Start from scratch
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.15. Start from scratch.en.srt]]`
- Summary: The common mistake is designing ad hoc, retyping brand colors and fonts across projects. The fix is to build a design system once — a rulebook covering color palette, typography, spacing, and components. Starting from scratch, you ask Claude to analyze a live site (supabase.com) and reverse-engineer a complete design system, then publish it as the default.
- Key claims: A design system covers four things: color, typography, spacing, and components; you can reverse-engineer a brand from an existing website; publish the design system as default so every new project inherits the brand; export it as a PDF playbook to share or reference outside Claude Design
- Learner-relevant: Establishes the reusable brand foundation used by all later Design lessons.
- Resources: From `003 Start from scratch … .html` — Prompt 1: "Analyze the website supabase.com, pull out the color palette, typography, and overall visual theme. Then build a complete design system for us based on what you find." Prompt 2: "Create a playbook in PDF for the Supacool design system — include the color palette, typography, spacing, and components — so I can reference it anywhere."

### 3.16 DESIGN.md
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.16. DESIGN.md.en.srt]]`
- Summary: DESIGN.md is a plain markdown file describing a brand's entire visual language — color, typography, spacing, button sizes, vibe — which AI agents read better than most formats. Instead of uploading screenshots and waiting for reverse-engineering, grab a pre-made DESIGN.md from the awesome-design-md repo and generate a design system directly. Demonstrated with the Airbnb file using the cheaper Sonnet model.
- Key claims: DESIGN.md is plain markdown with no Figma or JSON; pre-made files at github.com/voltagent/awesome-design-md are organized by category; because the file already contains everything, you can use Sonnet instead of a powerful model and save tokens; the resulting design system becomes a foundation across website, deck, social, and video
- Learner-relevant: Fast-track alternative to reverse-engineering; teaches where to source ready brand specs.
- Resources: From `004 DESIGN.md … .html` — Link: https://github.com/voltagent/awesome-design-md ; Prompt: "Use this DESIGN.md file to generate a complete design system - extract the color palette, typography, spacing, and components exactly as defined in the file."

### 3.17 Create a landing page
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.17. Create a landing page.en.srt]]`
- Summary: Builds a full publishable landing page from a design system using a highly specified prompt that locks in audience, primary goal, scope, and exact section order. Uses annotate to edit copy directly on the canvas, chat to add an email-capture section and drop in an image, and the tweak control to add and compare animation variations.
- Key claims: Defining audience, goal, and section order up front stops Claude from guessing the structure; annotate lets you point at a specific element (e.g. "rewrite this subline under 15 words") instead of describing its location; tweak gives actual variations to compare rather than committing to one version
- Learner-relevant: The core "prompt → annotate → tweak" workflow for producing real, publishable design assets.
- Resources: From `006 Create a landing page … .html` — Prompt 1: "Build a homepage for Brightline Marketing Co. using my design system. Audience: Small e-commerce brand owners ($20K–100K/month revenue) who need marketing support but can't justify an in-house hire yet. Primary goal: Convert visitors into booked discovery calls. Scope for this pass: Structure and layout only - content, copy, and visual polish come next round. Sections (in order): 1. Hero - Headline: \"Marketing that pays for itself.\" Subline reinforcing e-commerce focus. Primary CTA: \"Book a Free Audit.\" 2. Social proof strip: 4 client logos + 1 standout result stat. 3. Service packages: 3 tiers with pricing. 4. How it works: 3-step process. 5. Founder note: Photo placeholder + short personal blurb. 6. FAQ: 4 questions. 7. Final CTA band: Repeat primary CTA." Prompt 2: "Rewrite this subline to lead with the outcome, under 15 words" Prompt 3: "Add a section: Email capture" Prompt 4: "Add this image to the right side of the Hero section, keep the headline and CTA on the left." Prompt 5: "In the Hero section, make header animated"; Link: Download image

### 3.18 Ship it - two paths
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.18. Ship it - two paths.en.srt]]`
- Summary: Deploy a finished design two ways: send it straight to Vercel via Share → Send to (connect the Vercel destination first), or hand it off to Claude Code web to produce the full codebase. The Vercel path is fastest; the Claude Code path gives you the code (index.html, script.js, stylesheet) to keep building and deploy yourself.
- Key claims: Share → Send to → add the Vercel destination, connect, and send for an automatic deploy; the alternative is "send to Claude Code web", which asks how to implement (e.g. static HTML/CSS) and generates a full repo; the hand-off gives full control over the code, at the cost of doing the deployment yourself later
- Learner-relevant: The publishing step that turns design work into a live URL, plus the bridge into the Code module.
- Resources: none

### 3.19 Mobile app UI
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.19. Mobile app UI.en.srt]]`
- Summary: Design a multi-screen iOS flight-booking app as a five-screen storyboard (search → results → flight details → payment → success) using the Airbnb design system and the prototype template. Then refine it live with the edit tool and the tweak control (e.g. add a button shake effect and a three-color tweak). Ends by stressing starting a new conversation for a different task/design system to save tokens.
- Key claims: Explicitly saying "no need for interactive actions" avoids generating costly interactive buttons; the tweak control adds configurable variations (shake effect, color options) you can preview live; starting a fresh conversation for a new task or design system saves tokens from irrelevant context
- Learner-relevant: Shows rapid multi-screen product-flow design and live refinement without Figma.
- Resources: From `007 Mobile app UI … .html` — Prompt 1: "Create a simple iOS mobile app for flight booking. Need a flow for different screens: Select flights and destinations -> Results -> Flight details -> Payment -> Success. Show all screens at once. No need for interactive actions" Prompt 2: "Make the primary buttons shaking effect when user clicks on it. Also make tweak for 3 different colors"

### 3.20 Component UI
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.20. Component UI.en.srt]]`
- Summary: Focuses on a single component instead of a whole app: screenshot Airbnb's search control, drop it into a new Claude Design project with no design system, and ask for three distinct concepts (single bar vs. segmented vs. expandable panel). The result is three comparable options in one shot rather than starting from a blank canvas.
- Key claims: A screenshot plus a prompt can generate multiple alternative component concepts at once; varying the layout approach (single bar / segmented / expandable panel) produces genuinely comparable options; UI workflow is start from template or screenshot → generate full flow or concept set in one prompt → refine with direct edit or tweak controls
- Learner-relevant: Fast way to gather design inspiration for a specific UI element before building.
- Resources: From `008 Component UI … .html` — Prompt: "Design 3 distinct concepts for Airbnb's search control (location, dates, guests). Vary the layout approach for each - e.g., single bar vs. segmented vs. expandable panel, and get creative with icons, spacing, and micro-interactions. Show each as a standalone option so I can compare them side by side."

### 3.21 Pitch decks
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.21. Pitch decks.en.srt]]`
- Summary: Turn a webpage into a pitch deck in two steps: first have Claude Chat fetch the content and produce a structured markdown slide outline (capped at 7 slides), then paste that outline into Claude Design to build the actual deck with a chosen design system and dark theme. Finish by polishing inline and exporting to PowerPoint, PDF, or Canva.
- Key claims: Cap the outline ("maximum 7 slides") or the model may generate 20–30; get clean structured content first, because design gets easier from a good outline; the deck honors layout/visual notes rather than dumping text on a template; export options include PowerPoint, PDF, and Canva, plus full-screen presentation views
- Learner-relevant: End-to-end asset pipeline (outline → design → export) for investor or client decks without Canva.
- Resources: From `009 Pitch decks … .html` — Prompt 1: "Fetch the content from https://supabase.com/solutions/beginners and turn it into a structured slide deck outline — maximum 7 slides total, so prioritize the strongest points and cut the rest. For each slide: - Short, punchy title - Core content in 2-4 bullet points (source content only, no fluff) - Visual/layout description (e.g. \"left: headline + 3 stat callouts, right: code snippet screenshot\" or \"full-bleed image with overlay text\") - Intended tone/emphasis (e.g. \"reassuring, beginner-friendly\" vs \"technical proof point\") One section = one slide, 7 max. Output the whole thing as raw markdown in a code block so I can copy it directly." Prompt 2: "Build a slide deck from this markdown outline. Each \"##\" section is one slide — use the bullets as slide content and the layout/visual notes as design direction, don't just dump text on a plain template. Dark theme throughout - dark background, high-contrast text, accent color for highlights/CTAs. Keep it clean and modern, consistent type/color system across slides, generous whitespace. This is for client pitch so make it polished and presentation-ready. [paste markdown here]"

### 3.22 Installations
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.22. Installations.en.srt]]`
- Summary: Pre-flight setup for the Code module: install Git (used to push code to GitHub, check changes, and roll back) and Node.js (no longer required by Claude Code's native installer but useful for web projects and MCP servers), and make sure Claude Desktop is on the latest version. Verifies each with `git version` and `node --version` (24 or 22+).
- Key claims: Git lets Claude push to GitHub, check changes, and roll back; Claude Code no longer requires Node.js, but many tools and MCP servers run on it, so it's worth installing; the latest Claude Desktop combines Chat and Co-work behind a tab switch
- Learner-relevant: Removes environment friction before building; the Node/Git knowledge carries into every code lesson.
- Resources: none

### 3.23 Build 1
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.23. Build 1.en.srt]]`
- Summary: Build a neon snake game to learn the plan → build → iterate loop in Claude Code Desktop (local mode). Covers choosing model and effort, the permission modes (manual, accept-edits, plan, auto, bypass), letting Claude verify in a browser (and turning the browser tool off to save tokens), and the `/init` memory file. Demonstrates also turning off the browser tool and the rewrite vs. fork controls.
- Key claims: Permission modes range from manual to bypass, with plan mode giving a plan before touching files; use powerful models for the first design pass and cheaper models (Haiku) for follow-ups; `/init` generates CLAUDE.md, a permanent project memory that stops re-explaining; rewrite rolls back, fork branches a new conversation without losing the original
- Learner-relevant: The foundational Claude Code workflow (plan/build/iterate + memory) reused for every later code project.
- Resources: From `011 Build 1 … .html` — Prompt 1: "Build me a simple snake game with a neon visual style. Keep it fun and satisfying to play." Prompt 2: "Change the food's color each round, so it's a different neon color every time the snake eats. Also, if I eat 3 pieces of food in a row without dying, trigger a quick confetti burst on screen." Prompt 3: "Add a high score that saves in local storage, and add a subtle screen-shake when the snake crashes."

### 3.24 Slash commands
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.24. Slash commands.en.srt]]`
- Summary: Slash commands are typed shortcuts inside Claude Code that trigger instant actions; Claude ships a dozen built-in. The lesson walks the most useful ones: `/init` (generate CLAUDE.md project memory), `/clear` (wipe the conversation), `/compact` (compress and keep the important parts), `/model`, `/review` (bugs/security/quality), `/usage`, `/context`, and `/rewind`.
- Key claims: Type `/` to see the full command list and filter by typing letters; `/clear` wipes context while `/compact` compresses and retains the important parts; `/usage` replaced the old `/cost`; `/context` shows how full the context window is (messages, system prompt, MCP tools)
- Learner-relevant: Speeds up navigation of Claude Code and ties back to the context-management theme of module 01.
- Resources: none

### 3.25 Build 2
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.25. Build 2.en.srt]]`
- Summary: Build a Kanban board (to-do / in-progress / done) backed by a real Airtable database via MCP connectors, then deploy it live to Vercel — all inside Claude Code. Covers enabling Airtable with read/write/delete permissions, choosing local-storage for the personal access token (no backend), creating the base/table, and using `/init` then a second session to deploy with the Vercel connector.
- Key claims: The Kanban status is written to a real database, not just the browser, so it behaves like a real tool; because there's no backend, the Airtable personal access token lives in browser local storage; Claude can create the Airtable base/table and later deploy to Vercel via connectors, returning a live URL; the pattern is reusable: build UI → connect real data → ship live
- Learner-relevant: The canonical "real app with external data + live deploy" pattern for client dashboards and internal tools.
- Resources: From `013 Build 2 … .html` — Prompt 1: "Build a web app like a kanban board using just HTML, CSS, and JavaScript, that connects to a database in Airtable for tasks. Create a new database called 'Kanban Tasks' in Airtable with fields: Title, Description, and Status (To Do, In Progress, Done). When I drag and drop a task into a different column, update that task's status in the database automatically. Include options to create and delete tasks." Prompt 2: "Deploy this project to Vercel and give me the live URL."

### 3.26 What are routines
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.26. What are routines.en.srt]]`
- Summary: Routines let Claude do work while you're away: a saved Claude Code setup (prompt, GitHub repo, connectors) that runs automatically on your local machine or Anthropic Cloud instead of being triggered by hand. A schedule is just a routine with a schedule trigger attached. Three trigger types exist: schedule, API call, and GitHub events.
- Key claims: One routine is a saved container (prompts, connectors, repo) and the trigger is what wakes it; a routine can have several triggers and three trigger types are schedule, API call, and GitHub events; routines are mainly for development work (repos, branches, PRs) while Co-work scheduled tasks serve knowledge work (briefings, reports, inbox); routines run on local or cloud, but Co-work schedules are local-only as of this video
- Learner-relevant: Conceptual foundation for the Routines module and for automating recurring workflows.
- Resources: none

### 3.27 Routine 1
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.27. Routine 1.en.srt]]`
- Summary: Build a cloud routine that sends a "Good morning" notification at 7am daily, automating the usage-window hack from 3.4. Configures it as a cloud (not local) routine so it fires whether or not the laptop is awake, on the cheapest model (Haiku 4.5), with an environment, a daily 7am schedule, and push notification on completion.
- Key claims: Choose the cloud option so the routine runs without your laptop being awake; use the cheapest model (Haiku) because the task only needs "Good morning"; create an environment and a daily 7am schedule; test with Run now and confirm the push notification is delivered
- Learner-relevant: First hands-on routine; directly automates the daily session-starter to stretch the usage window.
- Resources: From `014 Routine 1 … .html` — Prompt: "Just send a \"Good morning\" notification"

### 3.28 Routine 2
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.28. Routine 2.en.srt]]`
- Summary: Build an API-triggered routine that turns a Tally customer-feedback submission into a drafted Gmail reply for review. First create the feedback form (name, email, feedback) via Chat, then create a cloud routine ("Feedback Responder") whose instruction tells Claude to draft (do NOT send) a warm reply, connect Tally and Gmail, and wire Tally's webhook to the routine's API URL with the auth token.
- Key claims: The routine instruction must explicitly say "do NOT send" and "save as draft in Gmail and stop there" so Claude drafts rather than sends; the API trigger exposes a routine-specific URL plus a token that goes in Tally's webhook as an Authorization header with Content-Type application/json; end result: a form submission produces a ready-drafted Gmail reply
- Learner-relevant: A real, revenue-relevant automation pattern (form → analysis → drafted reply) using API-triggered routines.
- Resources: From `015 Routine 2 … .html` — Prompt 1: "Create a form name \"Customer Feedback Form\" in my Tally with 3 fields: Name, Email and Feedback." Prompt 2: "You'll receive a customer feedback submission containing their name, their email address and their feedback message. Read the feedback carefully and figure out what they're asking for, complaining about, or suggesting. Then use the Gmail connector to draft - do NOT send - a warm, helpful reply addressed to their email, responding directly to what they said. Keep it concise, no more than a few short paragraphs. Save it as a draft in Gmail and stop there."

### 3.29 Terminal
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.29. Terminal.en.srt]]`
- Summary: First of three ways to run Claude Code: the plain terminal. Install natively from the Claude Code docs (macOS/Linux command, or Windows option), run `claude`, and complete first-time setup by choosing the dark mode and the login method (subscription or API). Confirms the same engine that powers Desktop and the routines.
- Key claims: Claude Code can be installed natively (Homebrew/WinGet options) and run straight from any terminal; first run prompts for theme and login; it's the exact same engine that powers everything else covered so far, just without an IDE
- Learner-relevant: Makes Claude Code usable outside Desktop; baseline for the IDE and extension variants that follow.
- Resources: none

### 3.30 IDE
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.30. IDE.en.srt]]`
- Summary: Run Claude Code inside an IDE's built-in terminal (demonstrated with Anti-Gravity; VS Code and Cursor work the same). Open the project folder, open the terminal, and run `claude` — no special setup needed. Sets model and effort (Sonnet with medium effort) and switches modes with Shift+Tab, then builds a single-page pricing calculator in plan mode.
- Key claims: Any IDE terminal works the same way for Claude Code; select model and effort each session, and use Shift+Tab to switch between manual, accept-edits, and plan modes; plan mode lays out the whole plan before touching files; useful for iterating on a single HTML file with live refresh
- Learner-relevant: Shows how to run Claude Code inside a familiar IDE workflow rather than a standalone terminal.
- Resources: From `016 IDE … .html` — Prompt 1: "Build me a single-page pricing calculator. User enters number of seats, and it shows monthly and annual cost, with a 20% discount for annual. Keep it clean and simple, one HTML file." Prompt 2: "Add a toggle so I can preview monthly vs annual pricing side by side."

### 3.31 Claude Extension
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.31. Claude Extension.en.srt]]`
- Summary: The third way to run Claude Code: the official Claude Code extension for VS Code (published by Anthropic). It gives a visual left panel with slash commands, model and context views, inline edits with change previews, file references, and per-message undo options (fork conversation, rewind code, or both). Same engine as the terminal, just a visual layer.
- Key claims: The extension surfaces model/context and slash commands in a panel and highlights the file being worked on; you can reference a specific file by pressing @ and selecting it; per-message undo offers fork conversation, rewind code, or both — so you can roll code back without losing chat history; overall there are three wrappers: standalone terminal, IDE built-in terminal, and official extension
- Learner-relevant: Compares all three Claude Code run modes and helps the learner pick the workflow that fits them.
- Resources: From `017 Claude Extension … .html` — Prompt 1: "Change the toggle's color when monthly is selected" Prompt 2: "Save the last entered seat count so it's still there if I refresh the page"
