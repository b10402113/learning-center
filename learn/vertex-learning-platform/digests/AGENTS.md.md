---
source: AGENTS.md
source_hash: 35764268eab1025259417c0dd3eb2f242b662b7bbd9e4905aef484351e4116a6
source_lines: 194
created: 2026-08-22
updated: 2026-08-22
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — AGENTS.md (Vertex operating manual)

The project-operating manual for building **Vertex**, the AI-powered learning platform. Written for the AI implementation agent, not for users. It is the core artifact of the agentic engineering workflow: it gives the agent the product, the workflow, the boundaries, the data model, the search behavior, and the checks — so the human stays the product thinker and the AI executes inside that system. The video tutorial and the PDF guide both explain how and why this file is written the way it is.

## Overview (L1)

- **Role split & job** — the human is the product thinker/architect; the AI is the implementation agent. The AI's job: understand the request, read skills, inspect code, write an implementation prompt, get approval, then build strictly to it and report. Planning precedes coding.
- **Product & scope** — Vertex: authors create courses in Sanity, a Next.js site serves learners. The standout feature is intelligent search (plain-language query → ranked clickable result cards → exact second in a lesson video). Build only what is listed; do not overbuild.
- **UI, skills, structure, stack, decisions, data model, ingestion, search config, search behavior, traps, checks** — each is one chapter pinning down a decision so the agent never improvises it.
- **Server/client + secret boundary** — the browser never holds private tokens, never calls the MCP or LLM, never writes content/progress; all of that happens server-side or in offline tooling.

## Sections (L2)

### Role and job (1)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md#role-and-job]]`
- Summary: The AI is a principal-level full-stack engineer and AI implementation agent building Vertex. Its job: understand the request, use the right skills, write a clear implementation prompt, get approval, then implement.
- Key claims: Planning is not the first step's enemy — it *is* the first step; code comes only after an approved prompt.
- Learner-relevant: The prompt-before-code loop is the spine of the whole workflow.

### How to work: the loop (2)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md#how-to-work]]`
- Summary: The nine-step loop: read AGENTS.md → read named skills → inspect existing code → ask one focused question only if genuinely ambiguous → write an implementation prompt in `prompts/` (goal, skills read, code inspected, decisions/assumptions, files to touch, requirements, security, acceptance criteria, checks, manual tests) → ask Yes/No approval → build strictly to the prompt → run checks → close with a short report (What I did / Test / Needs your attention).
- Key claims: Do not write code before the prompt is approved unless told to skip; decisions needed from the user go through the interactive question panel; the report is short bullets, detail lives in the prompt file.
- Learner-relevant: This is a repeatable, reviewable loop — plan → review → approve → implement → test → fix → ship.

### UI rules (3)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md#ui-rules]]`
- Summary: The AI does not design UI. The user supplies desktop images plus a prompt; the AI reproduces them exactly (layout, spacing, typography, color, states) and makes pages responsive down to mobile without restyling. Reuse existing components/Tailwind patterns before adding new ones.
- Key claims: The reference image is the source of truth; no mobile reference exists, so adapt sensibly (stack columns, collapse sidebar).
- Learner-relevant: AI creativity is bounded to implementation, not design.

### Skills to lean on (4)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md#skills-to-lean-on]]`
- Summary: Named skills to reach for instead of guessing: sanity-best-practices, sanity-migration, create-agent-with-sanity-context, dial-your-context, shape-your-agent, plus `node_modules/next/dist/docs/` for Next.js conventions. Follow package docs for next-sanity, Portable Text, Tailwind, Clerk, PostHog, AI SDK.
- Key claims: Use the project's actual tools and local docs, not memory of older versions; do not invent new skills.
- Learner-relevant: Skill+docs-first reduces uncertainty and stale-knowledge mistakes.

### App structure (5)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md#app-structure]]`
- Summary: Two standalone workspaces in one repo — a Studio workspace (schema + authoring, nothing else) and a web workspace (Next.js pages, search UI, server-side integration). Responsibilities are separated: pages read-only; Clerk auth via middleware; data access is a server-only Sanity client with token; search API is a server route to the MCP; search UI is a client component; PostHog runs in the browser with the public key; video pipeline is offline tooling; search config is a Sanity Context document.
- Key claims: Never cross boundaries — the browser holds no token, never calls MCP/LLM, never writes content or progress; any write goes through a server route.
- Learner-relevant: The server/client and token boundaries are the safety architecture of the whole app.

### Tech stack (6)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md#tech-stack]]`
- Summary: Next.js (App Router), Clerk, PostHog, Sanity Studio with next-sanity/@sanity/image-url/@portabletext/react, Tailwind with typography, Sanity Context MCP over server-side HTTP, Vercel AI SDK with OpenAI provider, react-markdown only for the search reply, Zod for structured output, TypeScript.
- Key claims: Negative list — no `@sanity/context` plugin when it lags the Sanity major, no `text::semanticSimilarity()` unless embeddings are enabled, no embedded Studio, no public dataset, no client-side token, no separate backend framework.
- Learner-relevant: The negative list matters as much as the stack list — it forecloses reasonable-looking but wrong alternatives.

### Decisions already made (7)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md#decisions]]`
- Summary: Search = Sanity Context MCP + LLM surfaced as result cards, not a chatbox; search is grounded (never invent a course/lesson/price/duration/timestamp); video intelligence lives in dedicated video documents (TOC + timestamped transcript chunks) kept as an internal lookup; timestamps resolve chapters first then transcript; playback stays on-site via provider embeds with a start-seconds param; content coherent and structured (Portable Text); Clerk for auth; progress keyed by Clerk user id written only via server route; PostHog for engagement events; search is a full results page with count and sort; some surfaces (My Learning, notifications, Notes tab, free-preview badge) are presentational only.
- Key claims: These decisions exist because search quality and safety depend on them; build to them unless the user changes them.
- Learner-relevant: A strong AGENTS.md records decisions so they are never re-litigated per feature.

### Data model (8)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md#data-model]]`
- Summary: Course (top level: title/slug, marketing fields, outcomes, instructor+category refs, ordered modules); Module (embedded object inside course, title/summary/ordered lesson refs — numbers derived from order); Lesson (document: title/slug, video URL, poster, duration, free-preview flag, student count, Portable Text notes, key points, pro tip, resources — no parent course stored, derive by reverse ref); Instructor; Category; Video document (id/url, chapters `{startSeconds,label}`, chunks `{startSeconds,text}`, never whole transcript in one field); Agent context document (content scope filter + instructions); Progress record (Clerk user id key, completed lessons + resume position, app state not content).
- Key claims: Module is embedded, not a document; lesson doesn't store its course; video chunks are short timestamped pieces; progress is app state separate from read-only content.
- Learner-relevant: The data model is the substrate every other decision (search, timestamps, pages) builds on.

### Video ingestion (9)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md#video-ingestion]]`
- Summary: Offline tooling builds video documents, keyed by an id derived from the video URL (stripping chars datastores reject). Transcript stored as many short timestamped chunks; source chapter markers become the TOC. Whole transcripts never enter the request path.
- Key claims: Provider support means both ingestion and playback work; YouTube/Vimeo/Bunny each need caption-to-chunks ingestion, a chapter source, and an embed seek case.
- Learner-relevant: Heavy processing happens before learners need it; search uses prepared results.

### Search config document (10)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md#search-config]]`
- Summary: A Sanity Context document lets the user tune the agent without code changes — a content scope filter and short instruction deltas. Edits reach the agent on the next request; inline system-prompt changes need a server restart.
- Key claims: Use dial-your-context to write it; if the Studio plugin is unavailable, edit by import or through the Sanity MCP.
- Learner-relevant: Config-as-content: tune search behavior without redeploying code.

### Search behavior (11)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md#search-behavior]]`
- Summary: Full results page, ranked best-first, with count and a sort control defaulting to most relevant; no capping; empty state points to the catalog. Two result kinds — video result (course/module/lesson label, thumbnail, clip length, description, matched second; action plays from that second on-site) and lesson result (topic match; action opens lesson). Match both ways and merge; rank by specificity. Ground everything in real data. Text match is token-based: wildcard keywords, OR multiple words, never match a whole phrase; match Portable Text via plain-text projection.
- Key claims: Video documents stay an internal lookup; a video result is always tied to the lesson that uses that video; critical query/ranking rules live in both the inline system prompt and the Context document.
- Learner-relevant: Two-stage timestamp resolution and the grounding rule are the heart of the search feature.

### Traps (12)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md#traps]]`
- Summary: Context MCP needs a deployed Studio app; the `@sanity/context` plugin may lag the Sanity major; semantic search may be off (fall back to keyword wildcards); model follows inline system prompt more reliably (put critical rules in both); escape backticks in template-literal prompts; search route should cache initial context (instruction changes need restart); never return whole transcript/chunks (overflow); dataset private, read token server-only; env for keys with committed `.env.example`; Clerk secret server-only, middleware protects routes; write token server-only; PostHog public key browser-safe, private key server-only.
- Key claims: These are things you cannot infer from code — practical warnings that look-correct-but-wrong code avoids.
- Learner-relevant: Client-safe vs not-client-safe value split (Clerk publishable + PostHog public = safe; Clerk secret, Sanity tokens, OpenAI keys, PostHog private = not).

### Checks (13)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md#checks]]`
- Summary: In web: type check, lint, production build when routes/config/server code change, dev server. In Studio: deploy the Studio app (required before Context MCP serves the dataset), deploy the schema, import content/config documents. For search/ingestion, verify against the live MCP endpoint.
- Key claims: Never claim a check passed without running it; report real output.
- Learner-relevant: Done is measurable — checks are the accountability contract.

### When in doubt (14)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md#when-in-doubt]]`
- Summary: Reset rules: keep it small; use the relevant skill; preserve server/client boundaries and the private-token rule; match the provided UI exactly; get specifics from setup/config not hardcoding; save a prompt and get approval before coding; run the checks; share exact test steps.
- Key claims: When unsure, return to these rules rather than improvising.
- Learner-relevant: The fallback rules are the lowest common denominator of the whole manual.
