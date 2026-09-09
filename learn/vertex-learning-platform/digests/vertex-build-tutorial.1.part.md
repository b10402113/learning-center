---
source: vertex-build-tutorial
source_lines: 9438
part: 1
created: 2026-08-22
updated: 2026-08-22
---

# Part 1 — Intro, stack & the agentic workflow foundation

## Overview (L1)

Opens the video with the core promise: search a video in plain English and jump to the exact second a topic is taught, built in hours via an **agentic engineering workflow** instead of blind prompting. Introduces Vertex (a full-stack learning platform: author-facing Sanity studio admin + learner-facing Next.js site with intelligent search). Walks through the whole stack and why each tool is chosen (product-first, stack-picks-itself thinking): Next.js, Sanity, Clerk, PostHog, CodeRabbit — all free to start. Steps through creating the accounts, scaffolding the Next.js app, installing the AI **agent skills** (Sanity agent toolkit, Sanity Context, Clerk), and then explains the single most important file: **AGENTS.md** (the project-operating manual that tells the AI what Vertex is, how to plan, when to ask approval, and never-do rules). Closes by introducing the design system (AI may be creative across pages otherwise) and tees up the homepage build.

## Sections (L2)

### Intro hook: search a video like Google (1-8)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:1-8]]
- Summary: Poses the product fantasy — search a video, land on the exact second of the explanation; claims it takes minutes to build the feature and hours for the whole platform.
- Key claims: The flagship feature is jumping to the exact second; the build is measured in minutes/hours, not weeks.

### Why this workflow, and what Vertex is (9-224)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:9-224]]
- Summary: Contrasts "prompt until it works" (fine for demos, collapses under scalability/security/understanding) with a systematic approach. The human stays the engineer; AI just moves faster. Then defines the product being built and pitches the author's deeper course on the agentic workflow.
- Key claims: Use **agent skills, context files (AGENTS.md), and project rules** so the AI understands project structure and builds to plan. Vertex = admin dashboard (authors manage courses/modules/instructors) + learner side (plain-English search, jump to taught moment). It is a production-ready app (real content, auth, analytics, video lessons, intelligent search), not a landing page.
- Learner-relevant: Repetition of the central mental model: give the AI context + tool knowledge + approval gates, then let it build; never hand over control.

### Product-first architecture thinking; why Next.js (225-320)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:225-320]]
- Summary: The first step is never picking a stack — it's defining the product: who creates vs consumes content, where data lives, what is public, what needs auth, what stays server-side. Answer those and the stack picks itself.
- Key claims: Stack = Next.js + TypeScript + Tailwind + Sanity + Clerk + PostHog + CodeRabbit, all free to start. Next.js is chosen because it's the most widely adopted way to do server rendering/routing/SEO, hence most valuable to know (LMSs and most serious industry apps run on it).
- Learner-relevant: Adopt the "product first, stack second" checklist before any build; reusable across any project.

### Sanity: the content backbone & admin dashboard (321-400)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:321-400]]
- Summary: Sanity does the most work of any tool: realtime studio out of the box becomes the admin dashboard; authors/instructors get a ready-made interface to create/collaborate on content (courses, modules, lessons, instructors, categories); you never write an admin panel from scratch.
- Key claims: Sanity's realtime studio = the platform's admin dashboard; shape the studio around your content structure; used by Puma/Pinterest; author created a Sanity project named starting with `JSM_vertex`.
- Learner-relevant: Sanity is "the content layer," modeled to your exact schema rather than a generic CMS; account creation is a required manual step before building.

### Clerk: auth without building it (401-488)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:401-488]]
- Summary: Choosing between building auth yourself (great learning exercise, do it once) versus using Clerk. Auth is a huge surface area (sessions, password flows, OAuth, email verification, security edge cases, middleware, redirects, profiles), so for a product build use Clerk and spend time on the product; Clerk will also handle billing later.
- Key claims: Clerk handles sessions/password flows/OAuth/email verification/security edge cases/middleware/redirects/profile handling and later billing. Setup: create app starting with `JSM`, call it Vertex; providers email + Google.
- Learner-relevant: Tradeoff reasoning: build-your-own = learning, managed = shipping; auth surface area is large enough to outsource in a prototype.

### PostHog: analytics to answer product questions (489-572)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:489-572]]
- Summary: Analytics is taught not to "have analytics" but to answer real product questions: Are people using search? How much of a lesson is watched before drop-off? Do learners who search complete more lessons? This is the build→launch→measure→learn→improve loop that separates serious builders.
- Key claims: PostHog is free (claims 97% of users pay $0); the questions above are the analytics goals for Vertex; the full product loop is the differentiator for freelance/hiring.
- Learner-relevant: Instrument analytics around a product hypothesis, not just as a checkbox.

### CodeRabbit: AI code review for security (573-628)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:573-628]]
- Summary: Because everything is AI-generated, hidden security issues are easy to miss. Every feature ships through a pull request and CodeRabbit Security reviews it — checks code, scans for vulnerabilities, leaked secrets, and risky patterns before shipping. Account connects via GitHub (where the repo will live).
- Key claims: CodeRabbit scans for real vulnerabilities, leaked secrets, risky patterns; integrated per-PR; Nvidia CEO endorsement cited; auth via GitHub.
- Learner-relevant: PR-based review is the security gate for AI-generated code; wiring a reviewer in early.

### Scaffolding the Next.js app & quick tour (629-732)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:629-732]]
- Summary: Creates a `vertex` folder, runs `npx create-next-app .` with recommended defaults, runs `npm run dev` on localhost:3000, and tours the starter: `app/` (pages/routes), `page.tsx` (home), `layout.tsx` (wrapper), `globals.css` (styles), `public/` (assets), `package.json`, `tsconfig.json`.
- Key claims: Commands: `npx create-next-app .` then `npm run dev`; the default starter file layout as described above. Pro tip: use AI chat to learn a new codebase ("tell me about the repo").
- Learner-relevant: Baseline Next.js App Router structure; using AI as a codebase tour guide.

### Installing agent skills: Sanity, Sanity Context, Clerk (733-1052)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:733-1052]]
- Summary: Skills are tool-specific knowledge the AI reads before implementing a feature, so prompts stay short and the AI doesn't rely on stale training data or guess API patterns. Install via `npx skills add`; then run a "sanity check" prompt asking the AI to read and summarize installed skills without changing files.
- Key claims: `npx skills add sanity-io/agent-toolkit`, `npx skills add sanity-io/context-all`, `npx skills add clerk` (select core + clerk-nextjs skills). Skills explain tools; AGENTS.md explains your project — do NOT cram API/tool details into AGENTS.md (it goes stale and is loaded for every feature, even pure UI). A skill = knowledge the agent reads before implementing. Verification prompt: "Read the installed sanity and sanity context skills in this project and summarize what each skill is responsible for. Do not change any files."
- Learner-relevant: The skill/context separation (tool knowledge in skills, project rules in AGENTS.md) is the crux of the workflow; sanity-check skills before building.

### AGENTS.md: the most important file in the workflow (1053-1648)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:1053-1648]]
- Summary: AGENTS.md is written for the AI agent, not users/README. It states what Vertex is, tools and responsibilities, never-do rules, how to plan work, when to ask for approval, and how to report back. Without it the AI finishes with bare-minimum results. The file is provided pre-made (from the video kit) but its decisions are explained feature-by-feature; the author also has free open-source workflow skills (scope → architect → audit → sync) that generate/maintain these files for one's own projects.
- Key claims: AGENTS.md sections: role ("principal-level full stack engineer building Vertex"), what you are building (product description: authors create courses in Sanity; learners use the Next.js site; intelligent search returns ranked result cards deep-linking to the exact lesson second), how to work (never jump into code: read files/skills, study codebase, ask focused questions, write an implementation prompt, cross-check own work; approval before code), UI work (reproduce provided designs from screenshots — no freestyling), skills section (load only when needed), how the app is structured (web app separate from Sanity studio per Sanity best practice; private writes server-side; Clerk owns auth; PostHog owns analytics), data model (course/module/lesson/instructor/category/video/document/progress — get relationships right or catalog/page/search get messy), transcripts + search config, and how search must behave (full results page of ranked cards: lesson results and video moments deep-linking to the match second — NOT a chat interface). Workflow skills: scope (define what to build), architect (decide how key pieces work, asks every detail), audit (write coding-standards context files), sync (keep context accurate after features). The file should tell the AI what to do, what never to do, and how to do it.
- Learner-relevant: AGENTS.md is the operating manual that keeps AI "under control"; the "how to work" + "data model" + "search behavior" sections prevent the AI from inventing its own (wrong) product decisions.

### Design system intro (1649-1700)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:1649-1700]]
- Summary: Before any pages, solve visual consistency: AI can make one screen look good but may improvise (e.g., add its favorite gradient) across a multi-page project. A design system (typography, colors, buttons, cards, badges, inputs, reusable patterns) makes the AI strictly follow it for all UI work. Designs were generated ahead of time (author mentions GPT image), with images provided in the video kit.
- Key claims: Reason for a design system = prevent AI freestyle across pages; design = typography/colors/buttons/cards/badges/inputs/reusable patterns; UI work should reproduce provided screenshots closely.
- Learner-relevant: Defining design tokens upfront keeps AI-built multi-page UI consistent.
