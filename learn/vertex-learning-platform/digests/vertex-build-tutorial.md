---
source: vertex-build-tutorial
source_hash: 163e22ff380334aae232a942c21a2cb3ee3f7d0cf5f2518fac0e0e5a6f261bc2
source_lines: 9438
created: 2026-08-22
updated: 2026-08-22
---

# Digest — vertex-build-tutorial

JS Mastery tutorial *Build and Deploy a Full Stack Learning Platform — Search Any Video, Jump to the Exact Second*. Walkthrough of building **Vertex**, an AI-powered learning platform: Next.js + TypeScript + Tailwind, Sanity CMS (standalone Studio) for course content, Clerk auth, PostHog analytics, offline video ingestion producing video documents (chapters + timestamped transcript chunks), and intelligent search via the Sanity Context MCP + an LLM that writes GROQ and returns grounded result cards deep-linking to the exact second in a lesson video. The whole build runs through an agentic engineering workflow — AGENTS.md operating manual, reusable agent skills, plan-before-code implementation prompts — with the human staying the product thinker and engineer.

## Overview (L1)

## Part 1 — Intro, stack & the agentic workflow foundation

## Overview (L1)

Opens the video with the core promise: search a video in plain English and jump to the exact second a topic is taught, built in hours via an **agentic engineering workflow** instead of blind prompting. Introduces Vertex (a full-stack learning platform: author-facing Sanity studio admin + learner-facing Next.js site with intelligent search). Walks through the whole stack and why each tool is chosen (product-first, stack-picks-itself thinking): Next.js, Sanity, Clerk, PostHog, CodeRabbit — all free to start. Steps through creating the accounts, scaffolding the Next.js app, installing the AI **agent skills** (Sanity agent toolkit, Sanity Context, Clerk), and then explains the single most important file: **AGENTS.md** (the project-operating manual that tells the AI what Vertex is, how to plan, when to ask approval, and never-do rules). Closes by introducing the design system (AI may be creative across pages otherwise) and tees up the homepage build.

## Sections (L2)

### Intro hook: search a video like Google (1-8)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:1-8]]`
- Summary: Poses the product fantasy — search a video, land on the exact second of the explanation; claims it takes minutes to build the feature and hours for the whole platform.
- Key claims: The flagship feature is jumping to the exact second; the build is measured in minutes/hours, not weeks.

### Why this workflow, and what Vertex is (9-224)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:9-224]]`
- Summary: Contrasts "prompt until it works" (fine for demos, collapses under scalability/security/understanding) with a systematic approach. The human stays the engineer; AI just moves faster. Then defines the product being built and pitches the author's deeper course on the agentic workflow.
- Key claims: Use **agent skills, context files (AGENTS.md), and project rules** so the AI understands project structure and builds to plan. Vertex = admin dashboard (authors manage courses/modules/instructors) + learner side (plain-English search, jump to taught moment). It is a production-ready app (real content, auth, analytics, video lessons, intelligent search), not a landing page.
- Learner-relevant: Repetition of the central mental model: give the AI context + tool knowledge + approval gates, then let it build; never hand over control.

### Product-first architecture thinking; why Next.js (225-320)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:225-320]]`
- Summary: The first step is never picking a stack — it's defining the product: who creates vs consumes content, where data lives, what is public, what needs auth, what stays server-side. Answer those and the stack picks itself.
- Key claims: Stack = Next.js + TypeScript + Tailwind + Sanity + Clerk + PostHog + CodeRabbit, all free to start. Next.js is chosen because it's the most widely adopted way to do server rendering/routing/SEO, hence most valuable to know (LMSs and most serious industry apps run on it).
- Learner-relevant: Adopt the "product first, stack second" checklist before any build; reusable across any project.

### Sanity: the content backbone & admin dashboard (321-400)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:321-400]]`
- Summary: Sanity does the most work of any tool: realtime studio out of the box becomes the admin dashboard; authors/instructors get a ready-made interface to create/collaborate on content (courses, modules, lessons, instructors, categories); you never write an admin panel from scratch.
- Key claims: Sanity's realtime studio = the platform's admin dashboard; shape the studio around your content structure; used by Puma/Pinterest; author created a Sanity project named starting with `JSM_vertex`.
- Learner-relevant: Sanity is "the content layer," modeled to your exact schema rather than a generic CMS; account creation is a required manual step before building.

### Clerk: auth without building it (401-488)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:401-488]]`
- Summary: Choosing between building auth yourself (great learning exercise, do it once) versus using Clerk. Auth is a huge surface area (sessions, password flows, OAuth, email verification, security edge cases, middleware, redirects, profiles), so for a product build use Clerk and spend time on the product; Clerk will also handle billing later.
- Key claims: Clerk handles sessions/password flows/OAuth/email verification/security edge cases/middleware/redirects/profile handling and later billing. Setup: create app starting with `JSM`, call it Vertex; providers email + Google.
- Learner-relevant: Tradeoff reasoning: build-your-own = learning, managed = shipping; auth surface area is large enough to outsource in a prototype.

### PostHog: analytics to answer product questions (489-572)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:489-572]]`
- Summary: Analytics is taught not to "have analytics" but to answer real product questions: Are people using search? How much of a lesson is watched before drop-off? Do learners who search complete more lessons? This is the build→launch→measure→learn→improve loop that separates serious builders.
- Key claims: PostHog is free (claims 97% of users pay $0); the questions above are the analytics goals for Vertex; the full product loop is the differentiator for freelance/hiring.
- Learner-relevant: Instrument analytics around a product hypothesis, not just as a checkbox.

### CodeRabbit: AI code review for security (573-628)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:573-628]]`
- Summary: Because everything is AI-generated, hidden security issues are easy to miss. Every feature ships through a pull request and CodeRabbit Security reviews it — checks code, scans for vulnerabilities, leaked secrets, and risky patterns before shipping. Account connects via GitHub (where the repo will live).
- Key claims: CodeRabbit scans for real vulnerabilities, leaked secrets, risky patterns; integrated per-PR; Nvidia CEO endorsement cited; auth via GitHub.
- Learner-relevant: PR-based review is the security gate for AI-generated code; wiring a reviewer in early.

### Scaffolding the Next.js app & quick tour (629-732)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:629-732]]`
- Summary: Creates a `vertex` folder, runs `npx create-next-app .` with recommended defaults, runs `npm run dev` on localhost:3000, and tours the starter: `app/` (pages/routes), `page.tsx` (home), `layout.tsx` (wrapper), `globals.css` (styles), `public/` (assets), `package.json`, `tsconfig.json`.
- Key claims: Commands: `npx create-next-app .` then `npm run dev`; the default starter file layout as described above. Pro tip: use AI chat to learn a new codebase ("tell me about the repo").
- Learner-relevant: Baseline Next.js App Router structure; using AI as a codebase tour guide.

### Installing agent skills: Sanity, Sanity Context, Clerk (733-1052)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:733-1052]]`
- Summary: Skills are tool-specific knowledge the AI reads before implementing a feature, so prompts stay short and the AI doesn't rely on stale training data or guess API patterns. Install via `npx skills add`; then run a "sanity check" prompt asking the AI to read and summarize installed skills without changing files.
- Key claims: `npx skills add sanity-io/agent-toolkit`, `npx skills add sanity-io/context-all`, `npx skills add clerk` (select core + clerk-nextjs skills). Skills explain tools; AGENTS.md explains your project — do NOT cram API/tool details into AGENTS.md (it goes stale and is loaded for every feature, even pure UI). A skill = knowledge the agent reads before implementing. Verification prompt: "Read the installed sanity and sanity context skills in this project and summarize what each skill is responsible for. Do not change any files."
- Learner-relevant: The skill/context separation (tool knowledge in skills, project rules in AGENTS.md) is the crux of the workflow; sanity-check skills before building.

### AGENTS.md: the most important file in the workflow (1053-1648)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:1053-1648]]`
- Summary: AGENTS.md is written for the AI agent, not users/README. It states what Vertex is, tools and responsibilities, never-do rules, how to plan work, when to ask for approval, and how to report back. Without it the AI finishes with bare-minimum results. The file is provided pre-made (from the video kit) but its decisions are explained feature-by-feature; the author also has free open-source workflow skills (scope → architect → audit → sync) that generate/maintain these files for one's own projects.
- Key claims: AGENTS.md sections: role ("principal-level full stack engineer building Vertex"), what you are building (product description: authors create courses in Sanity; learners use the Next.js site; intelligent search returns ranked result cards deep-linking to the exact lesson second), how to work (never jump into code: read files/skills, study codebase, ask focused questions, write an implementation prompt, cross-check own work; approval before code), UI work (reproduce provided designs from screenshots — no freestyling), skills section (load only when needed), how the app is structured (web app separate from Sanity studio per Sanity best practice; private writes server-side; Clerk owns auth; PostHog owns analytics), data model (course/module/lesson/instructor/category/video/document/progress — get relationships right or catalog/page/search get messy), transcripts + search config, and how search must behave (full results page of ranked cards: lesson results and video moments deep-linking to the match second — NOT a chat interface). Workflow skills: scope (define what to build), architect (decide how key pieces work, asks every detail), audit (write coding-standards context files), sync (keep context accurate after features). The file should tell the AI what to do, what never to do, and how to do it.
- Learner-relevant: AGENTS.md is the operating manual that keeps AI "under control"; the "how to work" + "data model" + "search behavior" sections prevent the AI from inventing its own (wrong) product decisions.

### Design system intro (1649-1700)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:1649-1700]]`
- Summary: Before any pages, solve visual consistency: AI can make one screen look good but may improvise (e.g., add its favorite gradient) across a multi-page project. A design system (typography, colors, buttons, cards, badges, inputs, reusable patterns) makes the AI strictly follow it for all UI work. Designs were generated ahead of time (author mentions GPT image), with images provided in the video kit.
- Key claims: Reason for a design system = prevent AI freestyle across pages; design = typography/colors/buttons/cards/badges/inputs/reusable patterns; UI work should reproduce provided screenshots closely.
- Learner-relevant: Defining design tokens upfront keeps AI-built multi-page UI consistent.


## Part 2 — Design system → homepage → auth → Sanity setup

## Overview (L1)

This part starts the real build. The AI implements the **Vertex design system** from a reference image (tokens in Tailwind v4 globals, typed component library, showcase route verified by screenshots). The author then establishes the engineering-team workflow: every feature on a branch → PR → CodeRabbit review → merge, setting up the GitHub repo and CodeRabbit. Next, the **homepage** is built from the provided UI mockup (nav, hero with the search bar, course grid) and its content width tuned. Then **Clerk authentication** is wired in via the Clerk CLI (middleware/proxy, sign-in/signup, env keys) and reviewed/merged. The part closes by starting **Sanity** setup (`npx create sanity@latest`).

## Sections (L2)

### Building the design system with one prompt (1701-2100)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_2:1701-2100]]`
- Summary: Drops the Vertex design-system images into a `design/` folder next to `public/`, then gives a three-word prompt ("implement the vertex design system") with the image attached. The agent reads AGENTS.md, inspects the project, writes an implementation prompt in a new `prompts/` folder, and asks for approval before coding.
- Key claims: Design system contents = typography, type scale per heading, primary/neutral colors, spacing, radius/shadows, icons, buttons, inputs, badges, status indicators. Agent authored `prompts/design-system.md`: goal = real reusable foundation on Tailwind v4, typed component library, design-system showcase route to visually diff against the image; it lists token placement, color scheme, fonts, components, requirements, security, accessibility, acceptance criteria, manual test steps. Author settings: default recommended model, medium effort thinking, auto mode. Session kept under ~150k tokens (saw 135k); new session per feature because context rot is real (degradation can start ~50k tokens even in a 200k window). Result: rewrote globals.css theme, wired fonts in layout, built the component library, added a 14-section showcase, verified against the reference with headless-Chrome screenshots, iterating until sections matched. Test via `npm run dev` → design-system page.
- Learner-relevant: A short prompt works only because AGENTS.md already supplies the "what/how"; token-budget discipline and the approval-gated implementation-prompt loop are core workflow habits.

### GitHub repo, branching/PR workflow, CodeRabbit (2101-2248)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_2:2101-2248]]`
- Summary: Creates the repo at github.com/new ("vertex-learning-platform"), then from this point every real feature happens on a branch, goes through a PR, gets reviewed, and is only then merged — the way engineering teams (and AI-assisted solo devs) should work to keep AI code safe. Adds a repo description from AGENTS.md, website, topics; then connects CodeRabbit.
- Key claims: Branch → PR → review → merge is enforced from now on for safety with AI-generated code. CodeRabbit setup: add repository, authenticate GitHub, grant repo access; start the 14-day trial covering security PR review, dependency-vulnerability scanning, secrets detection, and AI deep scan; can "scan now" or schedule, rescan after significant features.
- Learner-relevant: The PR/review loop is the safety mechanism for AI code; tidy repos (description, topics) help discovery.

### Building the homepage from the mockup (2249-2788)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_2:2249-2788]]`
- Summary: Commits/pushes the design system, then opens a fresh agent window and gives a one-line prompt ("implement the vertex homepage from the attached UI"). The agent reads AGENTS.md, inspects the design system and files, writes `prompts/homepage.md`, and builds: header, hero with search bar (the primary feature), all-courses grid, footer.
- Key claims: Home page = nav bar + user avatar, hero with search bar, list of courses; presentational only (no real data yet). The agent reproduced the reference, then screenshotted the page across screen sizes (Playwright), diagnosed horizontal overflow, measured card extents, and adjusted; it also verified the design system stayed unchanged. Author had the main content width widened from 960px to ~1440px (typical readable content widths run ~760-1300px+). Pushed on branch `feat/home`, opened a PR, CodeRabbit reviewed (merge risk minimal), merged — Vertex's first learner-facing page.
- Learner-relevant: Presentational-first pages; the agent self-verifies against the design across breakpoints; iterate on measurements (content width) rather than freestyle.

### Adding Clerk authentication (2789-3296)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_2:2789-3296]]`
- Summary: Adds auth with Clerk so Vertex can know who the learner is (progress tracking later) rather than building OAuth infrastructure. The Clerk installation prompt is copied into the agent, which installs the Clerk CLI, runs `clerk oauth login`, verifies Next.js, adds sign-in/signup/user buttons, and runs `clerk doctor`.
- Key claims: Clerk free tier = up to 50,000 monthly retained users; it provides the auth system, sessions, sign-in/signup UIs, middleware support, and an identity usable for progress tracking (and billing later). CLI auto-adds env keys; the secret key lacks the `NEXT_PUBLIC_` prefix so it never reaches the browser, and `.gitignore` excludes envs. Generated files: dependencies (`@clerk/nextjs`), env keys, `proxy` middleware, layout with ClerkProvider, sign-in/signup routes, header components. Next.js 16 renames middleware → proxy: Clerk middleware reads the session cookie, verifies the JWT, runs a handshake when the token is missing/expired/different instance, and attaches resolved auth state to the request. **Bare Clerk middleware protects nothing — it's an auth resolver, not a gate**; browsing stays public per AGENTS.md, and routes are gated only when a feature marks them protected (e.g., later lesson pages / "My Learning").
- Learner-relevant: Ask the agent to explain every generated/modified file (middleware, routes, protected-route mechanics, UI wiring) to stay in control; understand resolver-vs-gate semantics of middleware.

### Starting Sanity setup (3297-3400)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_2:3297-3400]]`
- Summary: After the homepage and auth, the next step is the database/content layer: `npx create sanity@latest`, authenticate, pick the existing project or create one, choose the production dataset, and answer setup questions.
- Key claims: Command `npx create sanity@latest`; choose production dataset; configure Sanity MCP and agent skills for the editors (selecting Claude Code and VS Code); add config files for the Sanity project inside the Next.js folder; next question is TypeScript.
- Learner-relevant: Sanity's guided CLI wires the project, dataset, MCP, and agent skills into the existing Next.js app.


## Part 3 — Sanity studio, data model, seeding & course page

## Overview (L1)

Finishes the Sanity CLI setup and tours the files it added. Then designs the content model with AGENTS.md (course = central object; modules embedded as arrays; lessons referenced; instructors/categories as references). The AI implements the Sanity content model as a **standalone studio workspace + server-only read layer** (splitting away from the embedded studio), reviewed via PR and CodeRabbit (attack-surface scan). Next, sample content is **seeded** — both the provided exact seed (`seed.ndjson` + `videos.json`, 10 courses × 4 modules × 3 lessons = 120 real YouTube videos) and the AI-generated path — plus the Sanity API read token. Finally the **course details page** is built from the mockup and wired to Sanity data.

## Sections (L2)

### Completing Sanity setup; files the CLI added (3401-3552)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_3:3401-3552]]`
- Summary: Answers the CLI questions (TypeScript yes, embedded studio yes, default route, clean project with no predefined schema) and has project ID + dataset auto-added to `.env.local`. Tours the new files.
- Key claims: `sanity.config.ts` = main studio config (project ID, dataset, plugins, content-structure entry point); `sanity.cli.ts` = CLI tooling (deploying the studio, managing datasets); a dedicated `sanity/` folder for schemas/definitions/env/structure; a `studio` route embedding the studio inside the app (localhost:3000/studio) so you don't run a separate admin app. Test with `npm run dev`.
- Learner-relevant: Sanity's CLI wires project + dataset + embedded studio into an existing Next.js app in one step.

### Designing the data model (3553-3688)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_3:3553-3688]]`
- Summary: Reads the data section of AGENTS.md (part 8) to decide how content is structured before implementing: in a learning platform the course is the main object that connects many pieces together.
- Key claims: Course = marketing info (title, icon, description) + summary, cover image, level, price, optional popularity flag, display student count, learning outcomes, plus references to instructors, categories, and a list of modules. **Modules are embedded as document arrays inside courses** (not top-level documents — you never visit a module page alone); lessons are referenced from modules. Mental model: course = main product page, module = ordered section, lesson = learning unit, instructor = who teaches, category = what topic.
- Learner-relevant: Getting the course→module→lesson relationship right up front is what keeps catalog, course page, and search from getting messy.

### Implementing the content model: standalone studio + server read layer (3689-4140)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_3:3689-4140]]`
- Summary: Prompts the AI to implement the Sanity content model and studio (course/module/lesson/instructor/category + server-side read client + data layer). The agent reads AGENTS.md, the Sanity skills, inspects the existing scaffolding, then asks a key architectural question before writing the implementation prompt.
- Key claims: The agent surfaced that the embedded studio contradicts AGENTS.md's requirement for a **standalone studio workspace** (needed for auto updates, typegen, independent deploy) — the Sanity-recommended project structure is project → standalone Sanity studio app → separate Next.js web frontend; they moved to standalone. The dataset is private, so the **read token must stay server-side** (server-only read layer). The implementation prompt specified: which schemas (course/module/lesson/instructor/category + module/learning-outcomes/resources objects), field types, slugs & references, lesson notes as Portable Text, server-only Sanity client + fetch helpers + query files. Result: standalone `studio/` workspace with its own node_modules/env, removed the embedded studio, wrote schemas, built the server-only data layer, ran typegen. Test: `cd studio && npm run dev` → localhost:3333 (courses/lessons/instructors/categories). PR + CodeRabbit: secret scan clean; ran the initial **attack-surface scan** to map entry points (3 of 13 verified so far; deep scan comes later).
- Learner-relevant: The skill-driven agent caught a real architecture decision (embedded vs standalone studio) from the skills; private-dataset read tokens stay server-side; attack-surface mapping grows as the app grows.

### Seeding sample content (4141-4868)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_3:4141-4868]]`
- Summary: Two ways to seed: (1) recommended — use the provided exact `seed.ndjson` (every document with references/durations) + `videos.json` (video metadata), imported via `sanity CLI import`, so the learner's data matches the video exactly for later search results; (2) let the AI generate fresh content. This is the first time the AI writes to the database, so never approve blindly.
- Key claims: Provided seed = 10 courses, each with 4 modules, each with 3 video lessons (120 lessons total), videos fetched from YouTube. For AI-generated seeding, prompt for instructors/categories/10 courses with modules and lessons on programming/development/AI, keeping durations consistent (module = sum of its lessons; course = sum of its modules). Schema only accepts YouTube/Vimeo/Bunny URLs, videos keyed one-per-unique-URL; author chose **unique real YouTube video per lesson** resolved via YouTube search queries (no YouTube data API), with Lorem Picsum images, 5 instructors / 6 categories / 10 courses / 120 lessons. Took 10-20 min (~120 YouTube fetches); the agent hand-authored the content spec, built a resolve step, an NDJSON generator reimplementing the studio's validation rules, and imported into production with deterministic IDs. Needs a **Sanity API read token** (viewer, no expiration) added to `.env.local` as `SANITY_API_READ_TOKEN` next to the Clerk vars since the dataset is private. Push + PR (CodeRabbit skipped review of pure data, as expected) → merged.
- Learner-relevant: Seeding turns an empty schema into realistic, internally consistent data fast; `npm update sanity` before run; AI writes to the DB only through an approved, reviewed prompt.

### Course details page wired to Sanity (4869-5100)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_3:4869-5100]]`
- Summary: The next logical step: make courses openable. Prompts the agent to implement the course page from the attached UI, wired with seeded Sanity content. The agent asks a clarifying question about progress UI before writing the prompt.
- Key claims: The design shows a sticky "your progress 35% complete" bar + continue-learning CTA, but Clerk-keyed progress docs and the server route don't exist yet → keep it **presentational only** (progress tracking comes later). Breadcrumbs link to `/courses` and lesson rows to lesson pages even though those routes don't exist yet (linked anyway). Build: `courses/[slug]` server component fetching via the Sanity data layer, course hero, learning outcomes, course-content accordion with progress bar, `format.ts` for duration/counts/level/lesson labels. Test: `npm run dev`, open a course, expand a module row, click a lesson → 404 for now.
- Learner-relevant: Ask the agent to clarify ambiguous UI states (progress bar) rather than invent them; defer unimplemented routes but keep the links so later features slot in.


## Part 4 — All-courses page, PostHog analytics, lesson page, search groundwork

## Overview (L1)

Wires the homepage courses to real Sanity data, then adds the **all-courses** page (with CodeRabbit's first real, actionable review comments). Sets up **PostHog** analytics — including its "self-driving" agent mode and Replay Vision — to answer product questions. Builds the **lesson page** (video player, sidebar curriculum, notes/resources) and fixes a seed defect it exposed. Closes by scoping the **intelligent search**: connecting Sanity Context MCP and a server-side search API (search logic first; transcript ingestion and the results-page UI deferred to later lessons).

## Sections (L2)

### Fixing homepage courses + verifying course details (5101-5216)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:5101-5216]]`
- Summary: The homepage courses still point to fake URLs, so the author screenshots the section, drag-drops it into the agent, and asks to fetch homepage courses from the seeded Sanity content. Then manually visits a course details page to verify.
- Key claims: Course page shows hero (title/level/duration/student count), "what you'll learn" section and course-content modules pulled dynamically from Sanity, and a progress bar. Lessons still 404 because the lesson details page doesn't exist yet.
- Learner-relevant: Verify data wiring against real content by visiting the actual routes; patch leftover hard-coded data by feeding screenshots back to the agent.

### All-courses page + first real CodeRabbit review comments (5217-5520)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:5217-5520]]`
- Summary: Implements a simple all-courses page (no sorting/pagination yet) that routes and lists more than the three homepage courses. Agent reuses the home grid + course-card components for design continuity (no design mockup existed for this page). Opens a PR; CodeRabbit gives its first detailed review.
- Key claims: Page lists all 10 courses with difficulty, duration, module count. **CodeRabbit comments:** (1) count only courses that can render — `courses.length` includes records the course grid removes when `slug` is null, so filter on published courses for the count/empty state; (2) the bookmark button has no onClick (bookmarking not implemented) — mark it disabled rather than expose a non-operational button. Author notes he pays for CodeRabbit seats for his whole team; "we wrote or should I say prompted" the code. Context window was ~200k at this point.
- Learner-relevant: Even prompt-generated code gets caught by review for edge cases (null slugs) and dead UI; merge risk stays low because the prompt was detailed.

### PostHog: analytics + self-driving mode (5521-6068)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:5521-6068]]`
- Summary: The "measure" step of the product loop. Questions PostHog will answer: do learners open courses, which are most popular, do they start lessons or bounce, does search help complete more lessons. Sets up PostHog through its **self-driving** wizard and turns on its agent-driven tooling.
- Key claims: Setup via `npx posthog-wizard@latest self-driving` (wizard, not manual SDK wiring): creates project, scans repo for frameworks/SDKs (detects Next.js), plans event tracking, installs SDK, sets env vars, initializes, identifies users, and figures out app-specific events. Self-driving = the same rules+context+implementation-prompt mechanism used for coding, pointed at the live product: agents read events/session replays/funnels/errors, decide what to fix, and can open a PR — but a human still reviews and merges. **Scouts** = scheduled checks that watch data and flag issues to the inbox; two suggested gaps were added: course-completion-funnel drop-offs and AI-search failed/abandoned queries (run daily, pausable). **Replay Vision** = AI reviews filtered session recordings, explains in plain language what went wrong, and opens a fix PR; first findings within 30 min. Events appear in PostHog in real time with the Clerk identity attached; enable replay vision + session replays under project settings → tools. The dev-only console error from PostHog disappears after restarting the server + hard refresh (Cmd+Shift+R).
- Learner-relevant: Analytics is wired around explicit product questions; the "self-driving" loop is the same agentic pattern extended to a live product with human approval retained.

### Lesson page: the learning experience (6069-6504)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:6069-6504]]`
- Summary: Builds the actual lesson experience from the mockup — modules/lessons sidebar, lesson overview, and the video player on top — wired to Sanity with the video playing through the provider's own embed.
- Key claims: New `lessons/[slug]` route + video player; extended the lesson-by-slug query (added level, cover image, duration-in-seconds per module; parent course derived by **reverse reference**, since a lesson doesn't store its course); regenerated Sanity types. Exposed and fixed a seed defect: key truncation gave 39 of 100 lessons the same notes key — fix via `studio run seed import`, then a hard reload. Lesson href now takes an **optional start-second** and emits lesson-slug exports — groundwork for deep-linking to specific video moments (the core feature). Data flow: one server-side Sanity read with the lesson query + params (slug/id, optional tags, course); video renders via a parse-video-URL helper showing the Sanity poster + play button, mounting nothing third-party until pressed, then swapping in an iframe from the video embed URL. Breadcrumbs (all courses → course → lessons), collapsible modules, next-lesson navigation, notes and resources.
- Learner-relevant: Ask the agent to explain each generated/modified file (what/why changed, how content is read, how video/notes render) to stay in control; deep-link support is designed into the route from the start.

### Scoping intelligent search: Sanity Context MCP + server search API (6505-6800)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:6505-6800]]`
- Summary: The differentiating feature: plain-English search that reads video **transcripts** (not just titles/tags) and returns the exact result. Introduces Sanity Context, which gives the AI structured, allowed access to the Sanity dataset, and defines the request architecture before implementing.
- Key claims: Sanity Context lets the agent reason over courses/lessons/modules/categories/instructors and later video documents. Architecture: the **browser never talks to Sanity Context / the LLM directly** — the browser sends the query to a server route in the Next.js app, which uses the Sanity Context setup, asks the model to search the right content, and returns structured results to the UI. Uses the Sanity Context skills installed at the start. Prompt to the agent: implement intelligent search (connect Sanity Context MCP + server-side search API + results page). Scoping answers: video results need video documents/chapters/transcript chunks that don't exist yet → **lesson results only for now** (transcript/chapter ingestion is the next lesson); no design image for the results page yet → build search logic only; OpenAI key powers the search (`OPENAI_API_KEY` in `.env.local`, key created on the OpenAI API platform).
- Learner-relevant: Search is architected as browser → server route → Sanity Context/LLM → structured results; transcript-based (semantic) search over metadata search is the product's whole point.


## Part 5 — Search backend, video ingestion, search UI, PostHog events

## Overview (L1)

Builds the **intelligent search backend**: Sanity Context MCP + a server-side search API returning ranked, grounded results (tested via curl), with a substantial CodeRabbit review that flags the "ground video moments" gap. Then builds the **offline video ingestion pipeline** — video documents with chapter markers and timestamped transcript chunks (~45s, ~350 chars) — which is what makes timestamp-precise search possible. Adds the **search results page UI** (loading/empty/error states, Cmd+K, result cards). Finally, wires **PostHog event tracking** for the real features (search performed, result opened, video play, watch depth, lesson completed) and lets PostHog AI analyze the data.

## Sections (L2)

### Intelligent search backend: Sanity Context MCP + search API (6801-7352)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_5:6801-7352]]`
- Summary: End-to-end search backend with **no UI in this task** — an explicit scope boundary. Deploys the Sanity studio (`vertex-js-mastery.sanity.studio`), adds the `OPENAI_API_KEY`, imports a Sanity Context document, and builds `POST /api/search` that turns plain language into ranked, grounded results.
- Key claims: Sanity Context MCP refused the dataset until the studio deployed; imported a "vertex search" Sanity agent context document (content filter + query instructions); skipped the Sanity Context plugin (pairs Sanity v6 vs studio v5). The API runs an MCP tool loop over the OpenAI provider, caches initial context in the system prompt, and validates output. **Grounding is structural: the model returns only lesson IDs; every displayed field is read back from Sanity** via a new lesson-by-IDs query (label derived from array order); latency trimmed. Tested via `curl` (e.g., "how do I fetch data and cache it" → ranked lessons, top result is the closest fit). PR: 35 files, ~3,000 lines; CodeRabbit (moderate merge risk) gave **5 comments**: (1) validate the OpenAI API key before creating the MCP client; (2) don't fire a PostHog event when the already-active tab is clicked; (3) **major — ground video moments before creating timestamp links**: the current path trusts the model's `startSeconds`/moment label while Sanity queries only reload lesson data (not a matching chapter/chunk), so a model can name a real lesson but fabricate a timestamp → load the video record matching the lesson's video URL and accept the result only when its timestamp matches a returned chapter/chunk (this is exactly the next lesson's transcript work); (4) minor — add a language to a URL code fence; (5) **major security — require HTTPS for the credential-bearing MCP URL** (clear-text transmission, internal reachability). This PR triggered a CodeRabbit security architecture review (moderate risk). A full AI deep scan is planned after transcript search lands.
- Learner-relevant: Setting "what will NOT be built" keeps scope tight; grounding by IDs (not trusting model text) prevents fabricated results; the MCP/LLM credentials stay server-side and require HTTPS.

### Offline video ingestion pipeline (7353-7660)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_5:7353-7660]]`
- Summary: Lesson-level search isn't enough — timestamp-specific search needs structured video data. A video URL by itself isn't searchable, and you mustn't dump whole transcripts on the model per search (noisy, expensive, uncontrollable at thousands of lessons). So: dedicated **video documents** in Sanity storing chapter markers and transcript chunks, each with a start second and a reference back to the lesson, produced by **offline ingestion**.
- Key claims: Offline = done ahead of time, outside the learner experience (once at upload, not on every search). Prompt: implement the offline video ingestion pipeline (video schema + objects; YouTube ingestion via innerTube API captions + YT initial data; chapter chunking; JSON build + import scripts); Vimeo/Bunny transcripts skipped since all videos are YouTube. Result: video document + video chapter + video chunk objects (read-only under "video intelligence" in the studio); `studio/scripts/ingest` reads lesson video URLs from the dataset, fetches chapters + captions, chunks them, caches per video. **Chunks ≈ 45 seconds / ~350 characters, never split mid-sentence**, so every start second is a real seekable moment. Ingested all 120 videos with zero failures — 564 chapters over 4,000+ chunks. Test: search "cache" now returns the caching-overview lesson at 80s or React cache at 928s.
- Learner-relevant: Chunked, timestamped transcripts are the data structure that makes "jump to the exact second" searchable; offline preprocessing beats on-the-fly processing.

### Search results page UI (7661-7916)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_5:7661-7916]]`
- Summary: Builds the real search page so the experience matches the intelligence: from the homepage you enter a query, it redirects to `/search`, and shows ranked result cards (video thumbnail, course, lesson, description, module, and the known timestamp).
- Key claims: The agent (reading AGENTS.md's search-behavior rules) covered the search input, result cards + types, loading/empty/error states, query handling via URL search params, and links to course/lesson pages. Delivered: search page checking the query, loading skeletons, error + retry, sorting controls, two result-card variants (video and lesson) over a shared shell, empty-state strip, and a course icon; the search form focuses via **Cmd+K**. Test: search "server actions" → 3 lessons; clicking a lesson navigates to the right lesson, **but the video does not jump to the timestamp yet** — that is the learner's upcoming assignment.
- Learner-relevant: UI states (loading/empty/error) and keyboard shortcuts (Cmd+K) are part of a polished search experience; the timestamp jump is deliberately left as the final piece.

### PostHog tracking for real features + self-driving analysis (7921-8500)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_5:7921-8500]]`
- Summary: Page views alone can't answer the product question that matters: does search lead to watching, and does watching lead to completing? The wizard's basic dashboard tracked active learners, lesson clicks, module expands, and a course-engagement funnel — now real-feature events are added and PostHog AI analyzes the data.
- Key claims: Requested events: `search performed` (with query), `search result opened` (result type), `video play`, `watch depth`, `resume used`, `lessons completed` — plus anything else PostHog deems important — following PostHog's Next.js best practices (server-side capture where appropriate; no PII beyond the existing Clerk user ID). Agent decisions: **watch depth** estimated from wall-clock time played vs stored lesson duration (embeds are plain iframes with no player API; cheap, approximate, wrong on pause/seek/speed-change); **lesson completed** derived from watch depth (no progress backend yet); **raw query captured** even though it's user-generated text (standard for search analytics and needed by the search-quality scout to spot zero-result queries). A shared event catalog was added under `events/`, and the agent drove the real app to verify each event fires. Live feed confirmed events with custom properties (position, query, rank, result count) — enabling analysis of whether users click 3rd/2nd/4th-ranked results (i.e., ranking quality). **PostHog AI** (chat) built the funnel search performed → video play → lesson completed and, on an open-ended request, produced a high-value insights dashboard from the product's own data (top content, course competition, discovery funnel homepage → courses → lesson in under 20s).
- Learner-relevant: Instrument the funnel that maps to your product thesis; "self-driving" analytics turns vague questions into dashboards from your own data without hand-building funnels.


## Part 6 — Self-driving analytics, security deep scan, assignments & wrap-up

## Overview (L1)

Covers the mature-product phase: the PostHog **self-driving inbox** surfaces a real bug (breadcrumb navigation loop) and opens its own fix PRs. Then everything uncommitted is committed, and **CodeRabbit Security's AI deep scan** runs — finding two architecture-level issues (an AI-cost DoS on the public search API, and a PostHog reverse-proxy trust-boundary leak). The author then hands over the final **assignments**: timestamp deep-linking (open the video at the exact matched second) and search tuning, each done through the full workflow (prompt → review plan → approve → branch → PR → CodeRabbit). Closes with the workflow recap and the deeper "agentic engineering" course pitch.

## Sections (L2)

### PostHog self-driving dashboard & inbox (8501-8660)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:8501-8660]]`
- Summary: From its own data PostHog generated an overview dashboard (user attention/retention by date, real vs bot traffic, unique visitors by acquisition channel, course popularity, top pages, course discovery vs lesson consumption vs search, traffic + new-user signups over 30 days). The self-driving inbox then surfaced a high-priority issue: breadcrumb exits redirect back to the lesson — anyone on a lesson page gets yanked back within a second (a navigation loop, caught by Replay Vision reviewing the session).
- Key claims: PostHog AI built funnels/dashboards without hand-writing queries. The "trapped in a navigation loop" insight came from session replay scanning; the author deliberately clicked around to show how self-driving works. **PostHog self-driving opened two PRs on its own**: wiring the hero search to the results page + stopping dev-error capture, and filtering third-party `clerk.js` fetch errors from capture — the human just submits/approves. "The agent surfaces the insight and you decide what to build next."
- Learner-relevant: Measure → learn → improve loop running automatically; session replay + AI review converts raw recordings into actionable PRs.

### Committing everything + enabling the AI deep scan (8661-8816)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:8661-8816]]`
- Summary: The ingestion pipeline, search page, and PostHog tracking were uncommitted, so they're committed and opened as a PR. Since the app now has a server route feeding user input to an LLM with content access, scripts that write to the dataset, and API keys (Sanity, Clerk, OpenAI, PostHog) in env files — every one a place AI code could be insecure — the author turns on **CodeRabbit Security AI deep scan** on top of the normal PR review.
- Key claims: Scope of review now includes runtime attack surface, not just code style. AI deep scan chosen as scan type; usage-based billing (no separate security plan needed); PR was ~49 files changed.
- Learner-relevant: Env keys, LLM-facing server routes, and DB-writing scripts expand the security surface beyond what UI checking catches.

### PR review: high merge risk, 7 findings (8817-8956)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:8817-8956]]`
- Summary: CodeRabbit rated the PR **high merge risk, level 5 critical, >2 hours review effort** — the largest yet — and produced a detailed walkthrough with specific comments.
- Key claims: Findings included: (1) **major/quick win** — telemetry capture can reject and turn a successful search into a 502; wrap the await in try/catch, log, and still return the response ("never cancel a response if you don't need to"); (2) minor — handle aborted requests before failure analytics; (3) **major** — watch depth is computed from elapsed playback time including the start second, so a learner who deep-links near the end can emit all milestones + lesson completed after one tick; offset position by the start second so percent watched uses elapsed time only; (4) minor — don't render completion state without progress data; (5) minor — remove the assumption every video lesson has an ingested video document; (6) sensitive-data exposure — PostHog can see the text typed into the search bar (author accepts: search queries are just searches); (7) limits for the queue. Author notes CodeRabbit "has to fully understand what our app is all about" to suggest such fixes; fixes applied via the "fix all comments" prompt (off-screen, since the learner's issues may differ).
- Learner-relevant: High-risk PRs against a live LLM/analytics pipeline surface logic bugs (502-on-telemetry-fail, milestone-gaming via deep links) that UI testing can't see.

### AI deep scan: two architecture-level findings (8957-9124)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:8957-9124]]`
- Summary: The AI deep scan ran ~14 minutes at ~$30 and returned two **medium** findings. Both are architecture-level: every individual line is fine, but the pieces interact unsafely — the class of thing pattern-matching scanners can't catch.
- Key claims: **Finding 1 — AI-cost DoS:** the search API is public; every request spins up an OpenAI call with an MCP tool loop, with no rate limit, concurrency cap, or budget guards. An attacker can make free HTTP calls that become expensive model calls ("they just used the feature faster than I planned for it"). Fixes: rate-limit before the MCP client is created, separate quotas for anonymous vs signed-in users, or a hard spending cap at the provider — the AI opens a fix PR itself. **Finding 2 — sensitive data / trust boundary:** PostHog is configured to send browser traffic to the same origin, which Next.js externally rewrites to PostHog while forwarding incoming request headers (the documented ingest reverse proxy recommended to beat ad blockers); because it's same-origin, the browser attaches every cookie — including the Clerk session cookie — and the rewrite forwards them. Two tools each doing exactly what's documented, combined, cross a trust boundary. Cost justification: finding 1 alone could cost more than $30 in OpenAI charges within an hour; finding 2 is the kind of thing a compliance audit flags. Cheap for a real product; you wouldn't run it weekly on a toy repo; cost estimates are shown before running.
- Learner-relevant: AI applications introduce a new vulnerability class (expensive model calls triggered cheaply); same-origin analytics proxies that forward headers can leak auth cookies; architecture-level reasoning catches what line-level scanners miss.

### Final assignments: timestamp deep-linking + search tuning (9125-9296)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:9125-9296]]`
- Summary: Everything major is built, so the learner runs the full workflow themselves on two upgrades. The main assignment: search already finds content, but clicking a result just opens the lesson page — the target is the promise from the video's opening: the result card links to the lesson **with a timestamp** and the video starts playing at the exact second.
- Key claims: Hints: think about chapters-matching vs transcript-only-matching (the video documents from the ingestion lesson already contain everything needed); the author's exact prompt is in the video kit — but try writing your own first. Second assignment: **tune** search, not add a feature — be specific about what content matters, how results rank, and making it faster ("make it better" is too open-ended). Finish by branching, committing, opening a PR, and running CodeRabbit one more time on code the AI wrote without the author watching.
- Learner-relevant: The skill is the workflow (decide → clear prompt → review the plan → approve → test → fix → reviewed PR), applied to both a new feature and a refinement.

### Recap, workflow takeaway & course pitch (9297-9439)
- Locator: `[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:9297-9439]]`
- Summary: Closes by summarizing what was built — a blank Next.js app became a full learning platform with real content, auth, course and lesson pages, analytics, structured video data, and intelligent search that drops you at the exact second a topic is taught — and restates that the workflow is the real takeaway.
- Key claims: The repeatable workflow: give the AI **skills** (tool knowledge), write **AGENTS.md** (project rules), make it **plan before building**, **approve every plan**, **verify every feature**, and put every change through a **reviewed pull request** — "you stayed the engineer the entire time." The same workflow applies to any product (SaaS, marketplace, dashboard, internal tool). For larger/team/production/long-running projects you need more than a single AGENTS.md — a repeatable system for scoping, architecture decisions, auditing the codebase, keeping context updated, and coordinating agents, which is what the author's **agentic engineering course** teaches (the underlying custom agent skills are free and open source on GitHub; took about a year to develop).
- Learner-relevant: Strong-prototype workflow vs production workflow: prototype = one AGENTS.md keeps the AI under control; production = a scoping/architect/audit/sync system.

