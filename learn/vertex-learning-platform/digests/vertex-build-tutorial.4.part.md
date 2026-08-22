---
source: vertex-build-tutorial
part: 4
created: 2026-08-22
updated: 2026-08-22
---

# Part 4 — All-courses page, PostHog analytics, lesson page, search groundwork

## Overview (L1)

Wires the homepage courses to real Sanity data, then adds the **all-courses** page (with CodeRabbit's first real, actionable review comments). Sets up **PostHog** analytics — including its "self-driving" agent mode and Replay Vision — to answer product questions. Builds the **lesson page** (video player, sidebar curriculum, notes/resources) and fixes a seed defect it exposed. Closes by scoping the **intelligent search**: connecting Sanity Context MCP and a server-side search API (search logic first; transcript ingestion and the results-page UI deferred to later lessons).

## Sections (L2)

### Fixing homepage courses + verifying course details (5101-5216)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:5101-5216]]
- Summary: The homepage courses still point to fake URLs, so the author screenshots the section, drag-drops it into the agent, and asks to fetch homepage courses from the seeded Sanity content. Then manually visits a course details page to verify.
- Key claims: Course page shows hero (title/level/duration/student count), "what you'll learn" section and course-content modules pulled dynamically from Sanity, and a progress bar. Lessons still 404 because the lesson details page doesn't exist yet.
- Learner-relevant: Verify data wiring against real content by visiting the actual routes; patch leftover hard-coded data by feeding screenshots back to the agent.

### All-courses page + first real CodeRabbit review comments (5217-5520)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:5217-5520]]
- Summary: Implements a simple all-courses page (no sorting/pagination yet) that routes and lists more than the three homepage courses. Agent reuses the home grid + course-card components for design continuity (no design mockup existed for this page). Opens a PR; CodeRabbit gives its first detailed review.
- Key claims: Page lists all 10 courses with difficulty, duration, module count. **CodeRabbit comments:** (1) count only courses that can render — `courses.length` includes records the course grid removes when `slug` is null, so filter on published courses for the count/empty state; (2) the bookmark button has no onClick (bookmarking not implemented) — mark it disabled rather than expose a non-operational button. Author notes he pays for CodeRabbit seats for his whole team; "we wrote or should I say prompted" the code. Context window was ~200k at this point.
- Learner-relevant: Even prompt-generated code gets caught by review for edge cases (null slugs) and dead UI; merge risk stays low because the prompt was detailed.

### PostHog: analytics + self-driving mode (5521-6068)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:5521-6068]]
- Summary: The "measure" step of the product loop. Questions PostHog will answer: do learners open courses, which are most popular, do they start lessons or bounce, does search help complete more lessons. Sets up PostHog through its **self-driving** wizard and turns on its agent-driven tooling.
- Key claims: Setup via `npx posthog-wizard@latest self-driving` (wizard, not manual SDK wiring): creates project, scans repo for frameworks/SDKs (detects Next.js), plans event tracking, installs SDK, sets env vars, initializes, identifies users, and figures out app-specific events. Self-driving = the same rules+context+implementation-prompt mechanism used for coding, pointed at the live product: agents read events/session replays/funnels/errors, decide what to fix, and can open a PR — but a human still reviews and merges. **Scouts** = scheduled checks that watch data and flag issues to the inbox; two suggested gaps were added: course-completion-funnel drop-offs and AI-search failed/abandoned queries (run daily, pausable). **Replay Vision** = AI reviews filtered session recordings, explains in plain language what went wrong, and opens a fix PR; first findings within 30 min. Events appear in PostHog in real time with the Clerk identity attached; enable replay vision + session replays under project settings → tools. The dev-only console error from PostHog disappears after restarting the server + hard refresh (Cmd+Shift+R).
- Learner-relevant: Analytics is wired around explicit product questions; the "self-driving" loop is the same agentic pattern extended to a live product with human approval retained.

### Lesson page: the learning experience (6069-6504)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:6069-6504]]
- Summary: Builds the actual lesson experience from the mockup — modules/lessons sidebar, lesson overview, and the video player on top — wired to Sanity with the video playing through the provider's own embed.
- Key claims: New `lessons/[slug]` route + video player; extended the lesson-by-slug query (added level, cover image, duration-in-seconds per module; parent course derived by **reverse reference**, since a lesson doesn't store its course); regenerated Sanity types. Exposed and fixed a seed defect: key truncation gave 39 of 100 lessons the same notes key — fix via `studio run seed import`, then a hard reload. Lesson href now takes an **optional start-second** and emits lesson-slug exports — groundwork for deep-linking to specific video moments (the core feature). Data flow: one server-side Sanity read with the lesson query + params (slug/id, optional tags, course); video renders via a parse-video-URL helper showing the Sanity poster + play button, mounting nothing third-party until pressed, then swapping in an iframe from the video embed URL. Breadcrumbs (all courses → course → lessons), collapsible modules, next-lesson navigation, notes and resources.
- Learner-relevant: Ask the agent to explain each generated/modified file (what/why changed, how content is read, how video/notes render) to stay in control; deep-link support is designed into the route from the start.

### Scoping intelligent search: Sanity Context MCP + server search API (6505-6800)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:6505-6800]]
- Summary: The differentiating feature: plain-English search that reads video **transcripts** (not just titles/tags) and returns the exact result. Introduces Sanity Context, which gives the AI structured, allowed access to the Sanity dataset, and defines the request architecture before implementing.
- Key claims: Sanity Context lets the agent reason over courses/lessons/modules/categories/instructors and later video documents. Architecture: the **browser never talks to Sanity Context / the LLM directly** — the browser sends the query to a server route in the Next.js app, which uses the Sanity Context setup, asks the model to search the right content, and returns structured results to the UI. Uses the Sanity Context skills installed at the start. Prompt to the agent: implement intelligent search (connect Sanity Context MCP + server-side search API + results page). Scoping answers: video results need video documents/chapters/transcript chunks that don't exist yet → **lesson results only for now** (transcript/chapter ingestion is the next lesson); no design image for the results page yet → build search logic only; OpenAI key powers the search (`OPENAI_API_KEY` in `.env.local`, key created on the OpenAI API platform).
- Learner-relevant: Search is architected as browser → server route → Sanity Context/LLM → structured results; transcript-based (semantic) search over metadata search is the product's whole point.
