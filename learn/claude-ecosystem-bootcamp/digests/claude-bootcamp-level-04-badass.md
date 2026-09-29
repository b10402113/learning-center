---
source: Claude Bootcamp Level 04 - Badass
source_type: text
source_lines: 8173
level: 04 - Badass
status: absorbed
absorbed_at: 2026-09-29
created: 2026-09-29
updated: 2026-09-29
---

# Digest — Claude Bootcamp Level 04 — Badass

## Overview (L1)

Module groupings (from the Level 04 resources pages): **01 Building Your Claude OS** (lessons 4.1–4.7 + 🎁 Bonus #1: Plugin for PA agent); **02 Social Media Platform Posting** (lessons 4.8–4.13 + 🎁 Bonus #2: Skills for Business and Marketing); **03 Trading Stock or Crypto with Claude** (lessons 4.14–4.19 + 🎁 Bonus #3: Workflow for trading). The sidebar reports "All 22 lessons complete" (19 video lessons + 3 bonuses).

- 4.1 Why your AI has amnesia — Each chat re-reads your raw files from zero; Andrej Karpathy's "LLM Wiki" method processes sources once into an evolving, interlinked personal Wikipedia across three layers (raw/, wiki/, CLAUDE.md rules).
- 4.2 Install the stack — Install Obsidian, the Obsidian Web Clipper extension, and the Terminal community plugin; create a vault and launch `claude` inside its integrated terminal.
- 4.3 Build your brain OS — Let Claude interview you first (purpose, 3–5 areas, voice), then create per-area raw/ and wiki/ folders plus global index.md and log.md, and write the CLAUDE.md rulebook.
- 4.4 Use case 1: YouTube video — Turn a YouTube transcript into a raw note, then have Claude extract key ideas/frameworks/tools and propose wiki pages that update the index and log.
- 4.5 Use case 2: Web article — Use the Web Clipper to file a marketing article into the right raw/ folder, then ingest it into reusable, tagged wiki tactics.
- 4.6 Use case 3: Texts and images — Paste mixed text + image posts (and ad screenshots) so Claude reads the images too, extracts tactics, and stores the image in an attachments folder linked into the wiki.
- 4.7 In action — Query across two wikis at once for cross-source answers, save good answers back as new pages, and periodically ask Claude to "lint" the wiki.
- 4.8 Skill for content — Package audience, voice, and channel rules into one reusable skill that generates ready-to-post content for X, LinkedIn, and Instagram in one prompt.
- 4.9 Skill for carousel images — Build a second skill that generates on-brand carousel images via Kie.ai (Nano Banana 2) through Composio, using an embedded design system.
- 4.10 Running skills — Run both skills live (in Claude.ai browser) from topic to finished, edited carousel, including swapping a design reference and adding an image to a slide.
- 4.11 Post to LinkedIn — Connect Claude to LinkedIn (and Instagram) through Composio connectors so it can publish a post with its carousel directly.
- 4.12 Post to Instagram — Run the entire flow in one prompt (content → carousel images → publish to Instagram) with a pasted design reference and no human revisions.
- 4.13 Scheduling with Buffer — Connect Buffer via a remote MCP so Claude can queue/schedule multi-platform posts for a future date/time instead of publishing immediately.
- 4.14 What we are building — Frame the AI trading bot as a strategy executor (not a money machine): Claude Code scheduled tasks + Alpaca's paper-trading API.
- 4.15 Setting up Alpaca and Claude Code — Create an Alpaca paper account, generate API keys, wire the Alpaca MCP server into Claude Code, and prove it with a live test order.
- 4.16 Trailing stop strategy — Explain and implement the trailing-stop strategy on Solana, schedule a 15-minute monitor, and pressure-test it against three scenarios.
- 4.17 Turn your strategy to a skill — Turn the trailing-stop strategy into a reusable skill (single slash-style command, any stock/crypto), and outline three more strategies: DCA, mean reversion, momentum breakout.
- 4.18 News sentiment trading bot — Build a sentiment-driven bot that scans financial news, scores stocks, trades only on "strong buy," and logs every trade with its sentiment reason.
- 4.19 Managing your bot and next steps — Day-to-day management: a morning check-in prompt, running multiple strategies, baseline risk rules, and next steps (congressional trades, options/wheel, multi-signal stacking).

## Sections (L2)

### 4.1 Why your AI has amnesia
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.1. Why your AI has amnesia.en.srt]]`
- Summary: Opens Level 04 with the default AI "amnesia" problem: you drag files into an AI, get a good answer, then the next day it re-reads everything from scratch. Introduces Andrej Karpathy's "LLM Wiki" fix — the AI reads your sources once, then summarizes, organizes, and interlinks them into a personal Wikipedia that keeps growing. Defines the three layers (raw files, wiki notes, one rules file) and the roles of Obsidian (viewer), Claude (writer), and the wiki (your brain).
- Key claims: nothing is saved between questions by default, so every query starts from zero and wastes time, tokens, and money; with LLM Wiki the AI does the reading work once and maintains an evolving, non-frozen wiki; layer 1 is raw files (read-only source of truth), layer 2 is the wiki (index page, concept pages, all linked, written by AI), layer 3 is a single `CLAUDE.md` telling the AI how to organize, format, and ingest; on each new source the AI updates old pages, spots contradictions, and adds links on its own.
- Learner-relevant: the core mental model and architecture for the whole Level 04 "second brain"; sets up Obsidian as the viewer for the graph of pages/connections.
- Resources: none

### 4.2 Install the stack
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.2. Install the stack.en.srt]]`
- Summary: Installs the three-tool stack for the second brain: Obsidian (from obsidian.md), the Obsidian Web Clipper browser extension, and the "Terminal" community plugin inside Obsidian. Creates a new vault named "my second brain" on the Desktop, then opens the integrated terminal in that folder and runs `claude` so Claude lives inside the vault folder.
- Key claims: none of the three tools is technical; a "vault" is really just a folder; the Web Clipper lets you save a browsing article into the vault; enabling community plugins and installing the Terminal plugin gives terminal access scoped to the vault folder; running `claude` inside the integrated terminal is the last setup step before building the brain.
- Learner-relevant: hands-on environment setup that every later lesson depends on (Obsidian open, terminal docked, Claude live inside the empty folder).
- Resources: tools — Obsidian (`obsidian.md`), Obsidian Web Clipper (Chrome extension), Obsidian community plugin "Terminal"; command to start Claude: `claude`. Vault name in demo: `my second brain`.

### 4.3 Build your brain OS
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.3. Build your brain OS.en.srt]]`
- Summary: Rather than pasting a big technical spec, Claude first interviews you with three questions (what the brain is mainly for; 3–5 main areas to organize; how it should talk to you). It then proposes a structure — each area gets its own `raw/` and `wiki/` subfolder plus a global `index.md` and `log.md` — and waits for confirmation. After approval, Claude creates the folders and writes `CLAUDE.md` describing the structure, ingest workflow, page formatting, and answering rules, then explains the system back in plain English.
- Key claims: let Claude interview you so your own work turns into the folders; the model is Sonnet 5 by default (no need for Opus/Fable 5 here); `CLAUDE.md` is the "rule book" Karpathy described, made concrete; ingest workflow = read source → summarize key ideas/concepts/tactics → suggest pages → on confirm create pages, update index, add a log line; page formatting requires a short summary and citation of the raw source.
- Learner-relevant: turns the abstract LLM-Wiki idea into an actual folder structure and a persistent `CLAUDE.md` that governs all future ingests.
- Resources:
  - **Prompt 1 (verbatim):** "You're going to help me set up a personal knowledge OS in this folder — a "second brain" built on the LLM Wiki method: raw source files go in, and you maintain a set of interlinked wiki pages out of them.
    Before you build anything, interview me. Ask me one question at a time:
    1. What is this brain mainly for? (my work, a specific field, my whole life?)
    2. What are the 3–5 main areas I want to organize? These become my top-level folders.
    3. How should you talk to me — blunt, friendly, or professional and direct?
    Once I've answered, propose a folder structure where each area gets its own raw/ and wiki/ subfolder, plus a global index.md and log.md at the root. Show me the structure and WAIT for my OK before creating anything."
  - **Prompt 2 (verbatim):** "That's perfect. Go ahead and create it. Then write a CLAUDE.md in the root that explains the rules:
    Structure:
    - raw/ is read-only source material — you never edit it
    - wiki/ is yours to write, update, and interlink
    - wiki page naming: capitalize each word, join with underscores, no special characters (e.g. Email _Subject_ Lines.md)
    - link related pages with [[Page _Name]] syntax
    Ingest workflow (whenever I add something new to a raw/ folder):
    - Read the full source
    - Summarize the key ideas, concepts, or tactics
    - Suggest which ones deserve their own wiki page — ask me first, don't create pages automatically
    - Once I confirm, create the pages, update that domain's section of index.md, and add a line to log.md
    Page formatting rules:
    - Every wiki page starts with a short summary
    - Always cite which raw source the page came from
    - If new information contradicts something already in the wiki, flag it clearly instead of silently overwriting it
    Answering my questions:
    - Always consult the wiki first, not raw/
    - Cite the specific pages you used
    - Tell me if you're uncertain about something
    Then explain back to me, in plain English, how my brain now works."

### 4.4 Use case 1: YouTube video
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.4. Use case 1- YouTube video.en.srt]]`
- Summary: Demonstrates the capture→ingest habit on a YouTube video. To turn one into a wiki page, grab the video link, extract the transcript with `youtube-transcript.io`, paste it into a new note in `content/raw/` with the link as reference, then prompt Claude to pull out key ideas/frameworks/tools and propose wiki pages. Claude summarizes the talk, offers candidate pages (e.g. Software 3.0; vibe coding vs. agentic engineering), creates the chosen pages, and updates `index.md` and `log.md` — the graph view fills in.
- Key claims: this is the actual habit you return to — browse, capture, ingest, and your brain gets smarter; the transcript is messy raw spoken text, so the prompt must ask for key ideas/frameworks/tools/people and require source citation; Claude proposes which concepts deserve their own page and waits for your choice; it then updates the index and log automatically.
- Learner-relevant: the canonical "capture once, remember forever" workflow and a repeatable ingest prompt for any transcript.
- Resources:
  - **Link:** `https://www.youtube.com/watch?v=96jN2OCOfLs`
  - Tool: `youtube-transcript.io` (transcript extraction)
  - **Prompt (verbatim):** "I just saved a YouTube video transcript to content/raw/. It's raw spoken text, so it'll be messy — pull out the key ideas, frameworks, and any tools or people mentioned. The video link is at the top of the file, make sure it's cited as the source."

### 4.5 Use case 2: Web article
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.5. Use case 2- Web article.en.srt]]`
- Summary: Case two clips a data-backed web article. Using the Web Clipper, capture the page and "Add to Obsidian," then drag the clip out of `clippings/` into the relevant `marketing/raw/` folder. Prompt Claude to pull out concrete, reusable tactics and tag the page. Claude reads the article, groups findings by category (common mistakes, testing/measurement, audience targeting, emojis, personalization), then creates a tag-left wiki page and updates the index.
- Key claims: the Web Clipper grabs the whole page and files it under a `clippings` folder you then move into the correct raw/ folder; the ingest prompt should ask for concrete reusable tactics plus a tag; Claude produces a tagged wiki page (e.g. email subject lines) covering length, personalization, emoji, and mistakes to avoid.
- Learner-relevant: extends the ingest habit to articles and shows how tags and folders keep the wiki organized.
- Resources:
  - **Link:** `https://www.attentive.com/blog/email-subject-line-best-practices`
  - **Prompt (verbatim):** "I just added an email marketing article to marketing/raw/. Pull out the concrete, reusable tactics — subject-line rules, character counts, personalization tips — and tag the page "email.""

### 4.6 Use case 3: Texts and images
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.6. Use case 3- Texts and images.en.srt]]`
- Summary: Case three handles mixed text-and-image material. Because the clipper only grabs text (not images), you highlight and copy the whole post (text plus images) into a new note in `ads/raw/`, then prompt Claude to extract the specific tactics and reference the before/after image examples while explaining each. Claude reads the images too, derives tactics (e.g. don't write the title over the content; show the product in action), and creates an ads wiki page. A bonus shows a pure ad screenshot (a Tony Robbins Facebook ad) turned into an ads wiki entry.
- Key claims: the clipper captures text only, so mixed posts must be copied wholesale to keep the images; Claude will "view each image" to understand which tactic it illustrates; the ad-screenshot prompt captures headline, offer, and CTA, saves the image into an attachments folder, embeds it in the page, and links it to related pages; Claude recognizes details in the image (e.g. the person shown) and builds a linked graph.
- Learner-relevant: teaches image-aware ingestion and the attachments-folder pattern for embedding visual evidence in the wiki.
- Resources:
  - **Link:** `https://marketingexamples.com/landing-page/meta-images`
  - Asset: Tony Robbins ad image
  - **Prompt 1 (verbatim):** "I just pasted a mixed text-and-image post into ads/raw/ about "meta images" — the preview image that shows up when you share a link. Pull out the specific tactics it recommends, and reference the before/after image examples in the note when you explain each one."
  - **Prompt 2 (verbatim):** "Create an ads wiki entry from this ad screenshot. Capture the headline, the offer, and the call-to-action, save the image into an attachments folder, embed it in the page, and link it to any related pages."

### 4.7 In action
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.7. In action.en.srt]]`
- Summary: Shows the payoff of the wiki: Claude answers by connecting ideas across everything you've fed it, not just one document. It reads `index.md` to find relevant pages, then drafts subject-line angles pulling a proven tactic from the marketing wiki plus a hook from the content wiki, citing the exact pages used. The key habit is saving a good answer back into the wiki as a new page that links to everything it cited, so the knowledge compounds instead of vanishing into chat history. Finally, a periodic "lint" prompt audits the wiki for contradictions, outdated claims, orphan pages, and missing concept pages.
- Key claims: the wiki lets Claude synthesize across folders (marketing tactics + content hook stitched into one answer); an unsaved answer defaults into chat history and disappears, so save keepers as new pages named after the question and linked to cited pages; the loop keeps the graph getting richer; a housekeeping prompt should report problems without fixing them first.
- Learner-relevant: demonstrates cross-source synthesis, answer write-back (the step most people skip), and wiki maintenance.
- Resources:
  - **Prompt 1 (verbatim):** "Read my marketing wiki and my content wiki, start with index.md to find the relevant pages, then open them. Draft me 3 subject-line angles for an email announcing a new AI feature. Use a proven tactic from my marketing wiki AND a hook from something I saved in content. For each angle, cite the exact wiki pages you pulled from."
  - **Prompt 2 (verbatim):** "That last answer is a keeper. Save it as a new page in my marketing wiki, name it after the question, link it to every page you cited, update index.md, and add a line to log.md."
  - **Prompt 3 (verbatim):** "Lint my whole wiki. Check for: pages that contradict each other, claims that might be outdated, orphan pages that nothing links to, and concepts mentioned across pages that don't have their own page yet. Give me a short report, don't fix anything yet."

### 4.8 Skill for content
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.8. Skill for content.en.srt]]`
- Summary: Moves from a brain full of knowledge to building on top of it, starting with a reusable content skill. You add three reference files that define your voice guide, channel guides (formats/styles for X, LinkedIn, Instagram, including character counts and carousel styles), and audience avatar, then run one prompt to create the skill. The skill spells out behavior (with a topic vs. no topic — the latter auto-searches trending AI/creator topics), output format per platform, and rules that keep content on-brand. Result: three files + one prompt = a reusable skill that generates ready-to-post content for all three platforms.
- Key claims: stop re-explaining your audience/voice/platform needs every time; the skill embeds the voice guide, channel guides, and audience avatar so behavior and output formats are fixed; without a topic it searches the web for current AI-tools/creator-economy trends and picks the most relevant; rules require matching voice, tailoring per platform (never cross-posting identical text), leading with hooks, and including a CTA; the skill appears automatically in future conversations and can be saved to the skills library.
- Learner-relevant: the template for packaging any repeated writing task into a reusable Claude skill.
- Resources:
  - **Download 3 files** — `007 3 files.zip` (voice guide, channel guides, audience avatar reference files)
  - **Prompt (verbatim):** "Analyze the 3 attached files to understand my target audience, brand voice, and platform-specific formatting rules. Then create a new skill that generates ready-to-post social media content for X, LinkedIn, and Instagram.

    ## Behavior

    **When a topic is provided:**
    Generate content for all three platforms based on that topic. Follow each platform's format and constraints from the channels guide.

    **When no topic is provided:**
    Use web search to find current hot trends and news in these areas: AI tools, AI automation, Claude/Anthropic updates, creator economy, and content entrepreneurship. Pick the single most relevant and timely trend, then generate content for all three platforms about it.

    ## Output Format

    ### X
    - A single post version (within 280 chars)
    - A thread version (4–6 posts, numbered)

    ### LinkedIn
    - A full post (1,200–1,800 chars, hook-first, line breaks for readability)
    - A carousel outline (4 slides max, hook on slide 1, CTA on last slide)
    - 3–5 hashtags

    ### Instagram
    - A carousel outline (4 slides max, hook on slide 1, CTA on last slide)
    - A caption (150–300 words, hook before the fold, CTA at the end)
    - 5–10 hashtags (for first comment)

    ## Rules

    1. Every piece of content must match the voice guide — tone, word choices, patterns, and pillars.
    2. Every piece must be tailored to the platform per the channels guide — never cross-post the same text.
    3. Content must speak to the primary audience avatar's pain points and language level.
    4. Lead with outcomes, insights, or hooks — never with throat-clearing intros.
    5. Include a clear CTA on every platform.
    6. When auto-selecting a trend topic, briefly state which trend was chosen and why before generating content."

### 4.9 Skill for carousel images
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.9. Skill for carousel images.en.srt]]`
- Summary: Builds the visual half of the content pipeline: a skill that generates carousel images. It first compares AI image generators (Higgsfield, Freepik/Freepik-like, Replicate-style pay-per-use, and Kie.ai) and picks Kie.ai for its $5 minimum and access to powerful models including Nano Banana. Because Kie.ai has no MCP server yet, the skill uses Composio (which has the Kie.ai integration built in) as a remote MCP connector. Using a design-system file (or a reference image), the prompt creates a skill that generates LinkedIn/Instagram carousels via Kie.ai, embedding the design system as the default and falling back to a provided reference image when one is supplied.
- Key claims: copy without visuals is only half the job; Kie.ai is the cheapest entry ($5 minimum) with quality models, and Nano Banana 2 is used for all image generation; Composio provides the bridge since Kie.ai has no MCP server, working from phone or laptop; the design system must be embedded in the skill (not re-uploaded); carousel best practices (one idea per slide, bold scannable headlines, consistent identity, slide 1 = hook, last slide = CTA) and platform specs (1080×1080 or 1080×1350, max 4 slides) are baked in; disable all connectors except Composio before running.
- Learner-relevant: teaches connecting Claude to an image API via Composio MCP and embedding a design system into a skill; sets up the next lesson's live run.
- Resources:
  - **Links:** `https://kie.ai`; `https://composio.dev/`; `https://getdesign.md/claude/design-md`
  - Composio MCP endpoint: `connect.composio.dev/mcp` (added as a custom connector; Kie.ai connected via API key)
  - Reference image asset: `010 ref-3.jpg`
  - **Prompt (verbatim):** "Analyze the attached DESIGN-claude.md file to understand my design system — color palette, typography, spacing, layout patterns, and visual hierarchy. Then create a new skill that generates carousel images for LinkedIn and Instagram using Kie.ai via Composio, using the Nano Banana 2 model for all image generation.

    The design system from DESIGN-claude.md becomes the skill's default. It must be embedded into the skill so it's always available without needing to re-upload.

    ## Design Input at Runtime

    **When no images are provided:**
    Use the default design system (from DESIGN-claude.md) for all visual decisions.

    **When images are provided:**
    Ignore the default design system. Instead, analyze the provided images to extract colors, styles, vibe, typography, and layout patterns — then use those as the visual standard for that generation.

    ## Carousel Best Practices

    The skill must follow these design principles:

    - One core idea per slide — no walls of text
    - Bold, scannable headlines with minimal supporting text
    - Consistent visual identity across all slides (colors, fonts, spacing)
    - High contrast between text and background for readability
    - Slide 1 is the hook — scroll-stopping headline, no filler
    - Last slide is always a CTA — follow, save, visit link, or engage
    - Clean whitespace — let the design breathe
    - Visual flow that guides the eye from slide to slide

    ## Platform Specs

    **LinkedIn carousel:**
    - Format: 1080×1080 px or 1080×1350 px
    - Max 4 slides
    - Professional, clean aesthetic — avoid heavy decoration

    **Instagram carousel:**
    - Format: 1080×1080 px or 1080×1350 px
    - Max 4 slides
    - Visually bold — designed to stop the scroll in a feed context

    ## Output

    For each carousel request, generate:
    1. The carousel images via Kie.ai (one image per slide)
    2. A brief text summary of the design choices applied (colors, fonts, layout) so I can review consistency

    ## Rules

    1. Always use the Nano Banana 2 model via Kie.ai for image generation.
    2. Default to the embedded design system unless images are provided.
    3. Keep text on slides short — headlines and key phrases only, not paragraphs.
    4. Maintain a consistent visual thread across all slides in a set.
    5. Adapt layout to platform context (LinkedIn = professional, Instagram = bold/visual) while staying within the active design system."

### 4.10 Running skills
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.10. Running skills.en.srt]]`
- Summary: Runs both skills together, deliberately in the Claude.ai browser (not just desktop) to show they work anywhere. With a single topic ("Claude design"), the content skill generates X, LinkedIn, and Instagram posts plus carousel outlines; then the carousel skill turns the LinkedIn outline into generated slide images via Composio/Kie.ai. It shows cost feedback (12 credits per image in Kie.ai's log) and how to revise a single slide by dropping in a reference image and prompting "add this image to slide three nicely."
- Key claims: skills defined in Claude carry over to the live Claude.ai site, so they run anywhere; one comment/topic yields content for all three platforms; the two skills chain from idea to finished, edited carousel; you can inspect the Kie.ai usage log (model, params, credits consumed) and refine individual slides with a reference image.
- Learner-relevant: proves the content+image skill combo end-to-end, and how to edit a single generated slide.
- Resources: none (runs the skills built in 4.8–4.9; uses Composio connector; Kie.ai image generation at 12 credits/image). Reference to higher models (Opus) but Sonnet 5 high effort used.

### 4.11 Post to LinkedIn
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.11. Post to LinkedIn.en.srt]]`
- Summary: Closes the gap between generating and publishing by connecting Claude to social platforms through Composio. In Composio's Connected Apps, connect LinkedIn and Instagram (authorizing access). Back in the existing Claude chat, refresh and re-enable the Composio connector, then replace the prompt with "create a post on my LinkedIn with the above content and carousel images" so it reuses the already-generated content and carousel (avoiding re-spending image tokens). Claude asks which images to include (choose the carousel), then publishes live to the demo account.
- Key claims: Composio connectors let Claude post to LinkedIn/Instagram directly (no copy-paste or manual upload); after connecting you must Refresh and re-enable Composio in the chat; reuse the existing chat's content + carousel to avoid regenerating images on Kie.ai; Claude may ask a clarifying question about which images to include; on connect it publishes live and returns a link to the post.
- Learner-relevant: completes the content pipeline by wiring Claude to real accounts and publishing from chat.
- Resources: none specific (Composio Connected Apps → LinkedIn; demo account "connect demo startup").

### 4.12 Post to Instagram
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.12. Post to Instagram.en.srt]]`
- Summary: Pushes the pipeline to a full single-prompt flow for Instagram. You grab a carousel design reference from Dribbble, save it, attach it, and give one prompt that asks Claude to write an engaging Instagram post about Claude Cowork, design the carousel images using the attached reference design system, and post the full carousel immediately without asking for revisions. Claude auto-selects the content and carousel skills, builds the carousel in the 3D-icon style, and (after an explicit "I already connected Instagram to Composio, please use Composio" nudge) publishes live.
- Key claims: the whole flow — content, images, and posting — can run in one prompt; Claude picks the right skills even when not named; it can miss the Instagram connector and need an explicit reminder to use Composio; instructing "do not ask for revisions/feedback/permission" makes it publish without confirmation; smells that Instagram requires an image/video (text-only can't post there).
- Learner-relevant: shows the most automated end state and how to give the model permission to act without asking.
- Resources:
  - **Link:** `https://dribbble.com/shots/25550884-Linkedin-Carousel-Design-Social-Post`
  - **Prompt (verbatim):** "Create an engaging Instagram post about Claude Cowork. Cover what it is and highlight several practical, real-world use cases.

    Then design the carousel images for that content using the exact design system like the attached reference image.

    Once the caption and carousel images are ready, post the full carousel directly to my Instagram account immediately. Do not ask for revisions, feedback, or permission."

### 4.13 Scheduling with Buffer
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.13. Scheduling with Buffer.en.srt]]`
- Summary: Adds scheduling so posts can be queued instead of published instantly. Buffer (buffer.com) is a free-to-start scheduler (free forever: up to 3 channels, 10 scheduled posts/channel, 1 user, AI assistant with 1 API key, 3,000 requests/month, no credit card). Connect X/Twitter, LinkedIn, and Instagram inside Buffer, then add Buffer as a remote MCP custom connector in Claude (`https://mcp.buffer.com/.mcp`), grant read-only "always allow" and set delete-post to "needs approval," and test with "list all my connected buffer channels." Finally, combine the content skill with Buffer so one prompt generates posts and schedules them for next Monday 8am (Instagram can't schedule text-only).
- Key claims: Buffer is free to start and handles cross-platform scheduling; the Buffer MCP endpoint is `https://mcp.buffer.com/.mcp`; set delete post to require approval (safety); one prompt can generate content AND schedule it into the Buffer queue for a future time; Instagram requires image/video so text-only scheduling fails there while X and LinkedIn queue fine; you can publish now or let the schedule fire automatically.
- Learner-relevant: completes the social-media module — a fully automated generate→design→publish/schedule pipeline run from inside Claude.
- Resources: tool — Buffer (`buffer.com`, free plan: 3 channels, 10 scheduled posts/channel, 3,000 requests/month); Buffer MCP server `https://mcp.buffer.com/.mcp`; bonus `012 bonus-2-custom-skills-for-business-marketing.zip`.

### 4.14 What we are building
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.14. What we are building.en.srt]]`
- Summary: Kicks off the trading module by framing the bot honestly: it is a strategy executor, not a magic money machine. You define the playbook (what to buy, when to buy, how much risk) and Claude runs it with no hesitation, emotion, or boredom — like a personal assistant watching one screen with a checklist. Two tools are used: Claude Code (the Claude "code" tab in the desktop app, where Claude executes real commands, saves files, connects to external services, and runs scheduled tasks) and Alpaca's trading API with a free paper-trading account loaded with fake money.
- Key claims: the schedule is what turns a chatbot into an actual trading bot; Alpaca lets Claude place orders, check prices, and pull account data programmatically; Alpaca provides a paper account with fake money to experiment risk-free; the roadmap is: set up Alpaca account + MCP + test trade → teach a trailing stop strategy → turn it into a reusable skill → news-sentiment scanning → day-to-day management and safety; everything is paper trading for learning — not financial advice.
- Learner-relevant: sets expectations and the safety framing for the trading module; introduces Claude Code scheduled tasks as the automation engine.
- Resources: tools — Claude Code (desktop app "code" tab), Alpaca (paper trading API).

### 4.15 Setting up Alpaca and Claude Code
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.15. Setting up Alpaca and Claude Code.en.srt]]`
- Summary: Sets up the trading environment. Create a trading account at `alpaca.markets` (Trading APIs), confirm the email, enable multi-factor authentication, and land on a dashboard with a paper-trading account loaded with $100,000 in play money. Generate API keys (endpoint, key, secret) — treat them like a bank login. Then set up the Alpaca MCP server: search "alpaca MCP," install for Claude Desktop, paste the provided config into Claude Desktop's Developer → Edit Config (requires Python and `uv`/`uvx` installed), reopen Claude Desktop, enable the Alpaca connector, pick a working folder, and run a test prompt (check balance, buy 2 shares of Shopify at market, show confirmation). The order is accepted but queued because the market is closed.
- Key claims: the paper account is a sandbox ("like a video game where the high score is your portfolio balance"); API key + secret must be safeguarded like a bank login; the Alpaca MCP server runs via `uvx`, so Python and uv must be installed (check version with `uv --version`); the connector must be enabled and the MCP config edited with correct commas; a test order confirms the connection — Claude correctly reports market hours and queues the order.
- Learner-relevant: the concrete setup steps (account, keys, MCP config, dependencies) for connecting Claude Code to a broker; ends with Claude able to trade but with no strategy yet.
- Resources:
  - Tool/site: `alpaca.markets` (Trading APIs); Alpaca MCP server (Claude Desktop install; requires Python + `uv`/`uvx`)
  - **Prompt (verbatim):** "I just connected my Alpaca paper trading account via MCP. Let's make sure it works. Can you check my account balance, then buy 2 shares of Shopify (SHOP) at market price? After the order fills, show me a confirmation with the price paid and my updated cash balance."

### 4.16 Trailing stop strategy
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.16. Trailing stop strategy.en.srt]]`
- Summary: Teaches a real, rule-based strategy — the trailing stop — and implements it on Solana via the Alpaca paper account. Walkthrough: buy at $50 with a floor at $45 (max 10% loss); if price rises, the floor trails a fixed percentage below the new peak (e.g. 5% below $65 = $61.75) and only ever moves up; when price dips to the floor, Claude sells, locking a profit. The prompt buys SOL, sets a 10% hard stop, activates trailing once +10%, trails 5% below the high, creates a Desktop Scheduled Task to monitor every 15 minutes, and saves config + trade log in the project folder. Crypto is chosen because it trades 24/7, so the bot can be tested immediately. Three pressure-test scenarios are then run.
- Key claims: trailing stop rules are crystal clear (no judgment, just math) which suits a bot; floor only moves up, never down; crypto runs 24/7 so it tests instantly (stocks depend on market open); Claude creates the config file, trade log, and the recurring "routine"/scheduled task (visible in the routines list) that reads config, checks live price, and updates the floor; pressure testing (SOL +30% in a week; SOL −12% day one; SOL +15% then −7%) shows exactly which rule fires and the math; the annoyance is having to re-explain the whole strategy for a new ticker — motivating the next lesson.
- Learner-relevant: first concrete, schedulable trading strategy; teaches trailing stops, scheduled-task monitoring, and pre-flight pressure testing.
- Resources:
  - Strategy file: `015 Trading Strategies.zip`
  - **Prompt 1 (verbatim):** "I want to run a trailing stop strategy on Solana (SOL) using my Alpaca paper trading account. Here's my game plan:
    1. Buy 8 Solana (SOL) at the current market price right now.
    2. Stop loss: If SOL drops 10% from my buy price, dump the whole position. I don't want to lose more than that on this trade.
    3. Trailing floor: Once SOL climbs 10% above my buy price, start trailing. Set the floor at 5% below whatever the current high is. Every new high, move the floor up. It never moves down.
    4. Show me a full summary of every order you place so I can double check everything looks right.
    5. Set up a Desktop Scheduled Task to run this monitor every 15 minutes. Each cycle, check if the floor needs to move or if a stop needs to trigger.
    Save the full strategy config and a trade log file in our project folder so you have everything on each scheduled run."
  - **Prompt 2 (verbatim):** "Let's pressure test our Solana strategy. Walk me through exactly what would happen in each scenario:
    1. SOL rallies 30% in a week. What does the floor look like at each stage?
    2. SOL drops 12% on day one, right after we buy. What fires?
    3. SOL goes up 15%, then pulls back 7%. Do we sell or hold? Show the math."

### 4.17 Turn your strategy to a skill
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.17. Turn your strategy to a skill.en.srt]]`
- Summary: Turns the trailing-stop strategy into a reusable skill so it can be applied to any stock or crypto with a single command. The skill ("trailing stock") defines a description, arguments (symbol, action, shares, price), example commands (e.g. `trailing stock Nvidia buy 8`), the buy/sell/status rule sequences, the schedule (every 15 minutes during market hours), and a state file per symbol. After installing only the trailing-stock skill (three other drafts are offered but not installed), it is tested with Nvidia and then ADA. The lesson also outlines three further strategies: DCA (fixed dollar amounts on a schedule), mean reversion (RSI + Bollinger Bands to buy oversold bounces), and momentum breakout (buy on a breakout above resistance on heavy volume).
- Key claims: a skill removes re-explaining/copy-pasting a strategy across tickers; the trailing-stock skill uses arguments (symbol, action, shares, price), runs on every 15 minutes during market hours, and keeps state per symbol; testing it on a closed market queues an "day" order and shows a healthy account; the point is not memorizing a strategy but knowing how to turn any idea into a working bot; the three extra strategies are provided as skill drafts the learner can install; all for demo/learning, not financial advice.
- Learner-relevant: generalizes a one-off trading workflow into a parameterized skill; introduces DCA, mean reversion, and momentum breakout concepts.
- Resources:
  - Strategy/skill files: `015 Trading Strategies.zip` (trailing stock skill SKILL.md, state example JSON, plus DCA / mean-reversion / momentum-breakout drafts); install only the trailing-stock skill in the demo; slash command `trailing stock`.

### 4.18 News sentiment trading bot
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.18. News sentiment trading bot.en.srt]]`
- Summary: Removes the last human bottleneck — picking the stock — by building a sentiment-driven bot in a fresh project folder. Claude scans financial news for stocks getting heavy attention, scores each one (strong buy → strong sell), and trades only on "strong buy" with position limits. It then creates orders, sets up two recurring routines (scheduled for Australian-time market hours), and logs every trade with the sentiment reason. A second prompt, run after a few days, pulls the trade log and produces a performance breakdown (win rate, average gain/loss, which calls were right, open positions and unrealized P&L) plus tweak suggestions.
- Key claims: scanning news and scoring sentiment turns stock selection from gut feeling into a system; entry rules require a "strong buy" bar with max $2,500/stock, no more than 4 stocks, and never more than 50% of the account in one name (HTML resources say 15%); exit rules sell within the next cycle if sentiment turns negative and immediately if a position drops 7% from entry; the bot schedules itself every 30 minutes during market hours (9:30 AM–4:00 PM ET, Mon–Fri) and appends to a running trade log with date/ticker/action/price/sentiment reason; the after-run performance breakdown is what makes the bot worth running — it reveals whether a sentiment call actually worked.
- Learner-relevant: end-to-end autonomous stock selection + execution + evaluation; introduces sentiment scoring and a performance-review loop.
- Resources:
  - Optional: spin up a second Alpaca paper account + new API keys for clean performance tracking
  - **Prompt 1 (verbatim):** "Build me a news sentiment trading bot connected to my Alpaca paper trading account. Here's the playbook:
    1. Scan phase: Search financial news for stocks getting heavy attention right now. I want you looking at real headlines — earnings surprises, product launches, analyst upgrades, regulatory news, anything driving volume and conversation.
    2. Score it: For each stock you find trending, rate the sentiment. Is the coverage overwhelmingly positive? Mixed? Negative? Give each one a clear signal — strong buy, mild buy, neutral, mild sell, strong sell.
    3. Entry rules: Only buy when sentiment is "strong buy" — I want a high bar. Max position size is $2,500 per stock. No more than 4 stocks in the portfolio at once. Never put more than 15% of the account into one name.
    4. Exit rules: If sentiment turns negative on something we own, sell it within the next check cycle. If anything we own drops 7% from our buy price, sell it immediately — that's the hard floor regardless of what the headlines say.
    5. After the first scan, give me a full readout:
    - Every stock you analyzed and its sentiment score
    - Which ones passed your bar and got bought
    - Which ones you flagged as interesting but didn't buy, and why
    - Current portfolio state
    6. Schedule this to run every 30 minutes during market hours (9:30 AM – 4:00 PM ET, Monday through Friday) as a Desktop Scheduled Task.
    7. Keep a running trade log in the project folder — every trade gets logged with the date, ticker, action, price, and the sentiment reason. Append to it, don't overwrite."
  - **Prompt 2 (verbatim):** "Pull up our sentiment bot trade log and give me a performance breakdown:
    1. All trades executed so far — entries and exits
    2. Win rate — how many trades made money vs. lost money
    3. Average gain on winners vs. average loss on losers
    4. Which sentiment calls were spot-on and which were duds
    5. Our current open positions and unrealized P&L
    Then tell me — based on the data so far, is there anything you'd tweak about the strategy? What patterns are you seeing?"

### 4.19 Managing your bot and next steps
- Locator: `[[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.19. Managing your bot and next steps.en.srt]]`
- Summary: Closes the trading module with day-to-day operations and where to go next. A "morning check-in" prompt reviews all active strategies and reports positions, trades since yesterday, scheduled-task status, any position within 3% of its stop, and account balance/invested/P&L. You can run multiple strategies at once (each on its own schedule, e.g. trailing-stop protecting a position, DCA growing a Bitcoin position, mean-reversion catching bounces, sentiment scanning new opportunities) and can spin up a separate Alpaca paper account per strategy for clean tracking. It then lays out a baseline set of global risk rules, practicalities for keeping scheduled tasks running, and next steps (congressional-trade copying, options/wheel strategy, multi-signal stacking).
- Key claims: bots run autonomously but you should check in once a day; run each strategy on its own schedule/account so they don't interfere and performance is attributable; baseline "circuit breaker" risk rules: max 2% account risk per purchase, no more than five open positions, every position gets a stop loss (no exception), stocks only (no options/margin/leverage), freeze all trading and notify if account value drops 10% from starting balance, trade only during regular market hours (9:30 AM–4:00 PM ET), and log every trade (timestamp, ticker, action, price, quantity, reason); scheduled tasks need the computer awake and Claude Desktop open (set sleep timer to never during market hours, or upgrade to Claude Max for cloud routines, or dedicate an old laptop); next steps include copying public congressional-trade data (e.g. Capitol Trades), options/wheel strategies (Alpaca supports options via API), and multi-signal stacking (only buy when news is bullish AND the chart confirms).
- Learner-relevant: operational habits and safety rails for autonomous trading; roadmap of advanced directions to extend the foundation.
- Resources: tool — Claude Max (cloud-based routines, ~15 schedules/day); reference — public trading databases like Capitol Trades (e.g. `capitoltrades`); bonus `017 bonus-3-trading-workflow.zip`. Note module assets: `006 bonus-1-plugin-for-personal-assistant-agent.zip` (Bonus #1, module 01) and `012 bonus-2-custom-skills-for-business-marketing.zip` (Bonus #2, module 02).
