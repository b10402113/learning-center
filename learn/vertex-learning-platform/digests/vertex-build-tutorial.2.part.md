---
source: vertex-build-tutorial
part: 2
created: 2026-08-22
updated: 2026-08-22
---

# Part 2 — Design system → homepage → auth → Sanity setup

## Overview (L1)

This part starts the real build. The AI implements the **Vertex design system** from a reference image (tokens in Tailwind v4 globals, typed component library, showcase route verified by screenshots). The author then establishes the engineering-team workflow: every feature on a branch → PR → CodeRabbit review → merge, setting up the GitHub repo and CodeRabbit. Next, the **homepage** is built from the provided UI mockup (nav, hero with the search bar, course grid) and its content width tuned. Then **Clerk authentication** is wired in via the Clerk CLI (middleware/proxy, sign-in/signup, env keys) and reviewed/merged. The part closes by starting **Sanity** setup (`npx create sanity@latest`).

## Sections (L2)

### Building the design system with one prompt (1701-2100)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_2:1701-2100]]
- Summary: Drops the Vertex design-system images into a `design/` folder next to `public/`, then gives a three-word prompt ("implement the vertex design system") with the image attached. The agent reads AGENTS.md, inspects the project, writes an implementation prompt in a new `prompts/` folder, and asks for approval before coding.
- Key claims: Design system contents = typography, type scale per heading, primary/neutral colors, spacing, radius/shadows, icons, buttons, inputs, badges, status indicators. Agent authored `prompts/design-system.md`: goal = real reusable foundation on Tailwind v4, typed component library, design-system showcase route to visually diff against the image; it lists token placement, color scheme, fonts, components, requirements, security, accessibility, acceptance criteria, manual test steps. Author settings: default recommended model, medium effort thinking, auto mode. Session kept under ~150k tokens (saw 135k); new session per feature because context rot is real (degradation can start ~50k tokens even in a 200k window). Result: rewrote globals.css theme, wired fonts in layout, built the component library, added a 14-section showcase, verified against the reference with headless-Chrome screenshots, iterating until sections matched. Test via `npm run dev` → design-system page.
- Learner-relevant: A short prompt works only because AGENTS.md already supplies the "what/how"; token-budget discipline and the approval-gated implementation-prompt loop are core workflow habits.

### GitHub repo, branching/PR workflow, CodeRabbit (2101-2248)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_2:2101-2248]]
- Summary: Creates the repo at github.com/new ("vertex-learning-platform"), then from this point every real feature happens on a branch, goes through a PR, gets reviewed, and is only then merged — the way engineering teams (and AI-assisted solo devs) should work to keep AI code safe. Adds a repo description from AGENTS.md, website, topics; then connects CodeRabbit.
- Key claims: Branch → PR → review → merge is enforced from now on for safety with AI-generated code. CodeRabbit setup: add repository, authenticate GitHub, grant repo access; start the 14-day trial covering security PR review, dependency-vulnerability scanning, secrets detection, and AI deep scan; can "scan now" or schedule, rescan after significant features.
- Learner-relevant: The PR/review loop is the safety mechanism for AI code; tidy repos (description, topics) help discovery.

### Building the homepage from the mockup (2249-2788)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_2:2249-2788]]
- Summary: Commits/pushes the design system, then opens a fresh agent window and gives a one-line prompt ("implement the vertex homepage from the attached UI"). The agent reads AGENTS.md, inspects the design system and files, writes `prompts/homepage.md`, and builds: header, hero with search bar (the primary feature), all-courses grid, footer.
- Key claims: Home page = nav bar + user avatar, hero with search bar, list of courses; presentational only (no real data yet). The agent reproduced the reference, then screenshotted the page across screen sizes (Playwright), diagnosed horizontal overflow, measured card extents, and adjusted; it also verified the design system stayed unchanged. Author had the main content width widened from 960px to ~1440px (typical readable content widths run ~760-1300px+). Pushed on branch `feat/home`, opened a PR, CodeRabbit reviewed (merge risk minimal), merged — Vertex's first learner-facing page.
- Learner-relevant: Presentational-first pages; the agent self-verifies against the design across breakpoints; iterate on measurements (content width) rather than freestyle.

### Adding Clerk authentication (2789-3296)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_2:2789-3296]]
- Summary: Adds auth with Clerk so Vertex can know who the learner is (progress tracking later) rather than building OAuth infrastructure. The Clerk installation prompt is copied into the agent, which installs the Clerk CLI, runs `clerk oauth login`, verifies Next.js, adds sign-in/signup/user buttons, and runs `clerk doctor`.
- Key claims: Clerk free tier = up to 50,000 monthly retained users; it provides the auth system, sessions, sign-in/signup UIs, middleware support, and an identity usable for progress tracking (and billing later). CLI auto-adds env keys; the secret key lacks the `NEXT_PUBLIC_` prefix so it never reaches the browser, and `.gitignore` excludes envs. Generated files: dependencies (`@clerk/nextjs`), env keys, `proxy` middleware, layout with ClerkProvider, sign-in/signup routes, header components. Next.js 16 renames middleware → proxy: Clerk middleware reads the session cookie, verifies the JWT, runs a handshake when the token is missing/expired/different instance, and attaches resolved auth state to the request. **Bare Clerk middleware protects nothing — it's an auth resolver, not a gate**; browsing stays public per AGENTS.md, and routes are gated only when a feature marks them protected (e.g., later lesson pages / "My Learning").
- Learner-relevant: Ask the agent to explain every generated/modified file (middleware, routes, protected-route mechanics, UI wiring) to stay in control; understand resolver-vs-gate semantics of middleware.

### Starting Sanity setup (3297-3400)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_2:3297-3400]]
- Summary: After the homepage and auth, the next step is the database/content layer: `npx create sanity@latest`, authenticate, pick the existing project or create one, choose the production dataset, and answer setup questions.
- Key claims: Command `npx create sanity@latest`; choose production dataset; configure Sanity MCP and agent skills for the editors (selecting Claude Code and VS Code); add config files for the Sanity project inside the Next.js folder; next question is TypeScript.
- Learner-relevant: Sanity's guided CLI wires the project, dataset, MCP, and agent skills into the existing Next.js app.
