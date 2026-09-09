---
source: AGENTS.md_GUIDE.pdf
source_lines: 952
created: 2026-08-22
updated: 2026-08-22
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — AGENTS.md_GUIDE.pdf

A companion guide to the Vertex build: *how and why to write AGENTS.md*, the project-operating manual for an AI-assisted build. It teaches the underlying skill — being the product thinker who gives the AI a system to execute inside — with the Vertex learning platform as the running example. It walks through the mindset (human = product thinker, AI = implementation agent), then each of the 15 sections of a strong AGENTS.md, then a general method for writing one from the project outward, plus when to update it and a reusable prompt for creating it.

## Overview (L1)

- **Mindset** — AGENTS.md is written for the AI agent, not users; it is not a README. The human defines the product/stack/boundaries/rules/workflow; the AI executes inside that system. A weak prompt ("build me a learning platform") gives the AI too much freedom; a strong one gives it the system first.
- **The 15 sections** — role definition, what you're building, how the AI should work (plan→review→approve→implement→test→fix→ship), UI rules, skills/docs to use, app responsibilities, tech stack (incl. what NOT to use), decisions already made, the data model, video ingestion, search configuration, how search must behave, common traps, checks to run, and a when-in-doubt fallback.
- **General method** — write AGENTS.md from the project outward: describe the product in plain language first (if you can't, you're not ready), list main user flows, list tools and why each exists, define boundaries, define the data model, define major feature behavior, define the AI workflow, define checks/manual tests.
- **Detail calibration & maintenance** — detailed enough that the AI never makes product/architecture decisions during implementation, not so bloated that rules get buried; update when major decisions change, not for tiny details (those live in per-feature prompt files). Biggest mistake: vague inspiration instead of specific, actionable rules.

## Sections (L2)

### The role split and why AGENTS.md matters (1-80)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md_GUIDE.pdf#mindset]]`
- Summary: AGENTS.md is one of the most important files in an AI-assisted project — the system the AI follows instead of leaving every decision open. The human is the product thinker; the AI is the implementation agent.
- Key claims: Weak starting prompt = too much freedom (wrong data model, wrong search, exposed secrets, out-of-scope routes); strong starting prompt gives the system first — product, stack, boundaries, rules, workflow.
- Learner-relevant: Before writing any AGENTS.md, get the product clear; the standout feature decision (search) cascades into schema, ingestion, search API, result cards, timestamps.

### Section-by-section anatomy of a strong AGENTS.md (80-820)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md_GUIDE.pdf#sections]]`
- Summary: Walks each of the 15 sections with the Vertex example and explains the intent of each:
  - Define the AI role: posture matters (principal-level engineer, planning before coding).
  - Explain what you're building: product in plain language + the standout feature + scope boundary ("build nothing beyond that").
  - Define how the AI works: the 9-step loop and plan→review→approve→implement→test→fix→ship; prompt file = the plan; short close-out report.
  - Define UI rules: AI is not the designer; reproduce the reference exactly; no mobile reference → adapt sensibly; reuse components; reference image is source of truth.
  - Tell it which skills/docs: name skills + when to use them; read local docs over memory.
  - App responsibilities: browser/server boundary — browser never holds private tokens, never calls MCP/LLM, never writes content/progress; protects read/write tokens, Clerk secret, PostHog private keys, OpenAI keys.
  - List the tech stack + what not to use (public dataset, client tokens, separate backend, Sanity auth instead of Clerk, semantic similarity without embeddings).
  - Record decisions already made (search = results page not chatbox; grounded; video documents; chapters-first timestamps; on-site embeds; modules embedded; progress by Clerk id; PostHog events) — prevents re-deciding per feature.
  - Define the data model (course/module/lesson/instructor/category/video/agent-context/progress).
  - Explain video ingestion (offline, chunks, provider support = ingestion + playback).
  - Explain search config (Context document: content scope + instructions; repeat critical rules in system prompt too).
  - Define how search must behave (full results page, two result types, chapters-first timestamps, grounded — never invent).
  - List common traps (MCP needs deployed Studio; semantic off; backtick escapes; restart after prompt change; no whole transcripts; server-only tokens) + client-safe vs not-client-safe values.
  - Define checks (lint/build/typecheck/dev server/browser/Studio/search tests; "never claim a check passed without running it").
  - When in doubt: reset rules.
- Key claims: Negative instructions matter — AI picks reasonable-looking wrong alternatives; repeat critical rules in both the Context document and the inline system prompt because the model follows the system prompt more reliably.
- Learner-relevant: This is the template to reproduce for any project; each section exists to remove one class of decision the AI should not be making.

### How to write AGENTS.md for your own project (820-920)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md_GUIDE.pdf#method]]`
- Summary: Build from the project outward: (1) describe the product in plain language — the canary for readiness; (2) list the main user flows; (3) list tools and why each exists; (4) define the boundaries (browser vs server, offline vs request path); (5) define the data model before coding; (6) define major feature behavior (search/video/analytics rules); (7) define the AI workflow; (8) define checks and manual tests.
- Key claims: A strong structure covers everything; the biggest mistake is vague motivation ("build clean code, use best practices") — specific beats inspirational.
- Learner-relevant: The "if you can't write the product paragraph, you're not ready" test is a practical gate.

### Detail, maintenance, and the reusable prompt (920-952)
- Locator: `[[sources/vertex-learning-platform/AGENTS.md_GUIDE.pdf#calibration]]`
- Summary: Calibrate length to connected-system complexity; the test is "if the AI could make a dangerous or product-breaking assumption, write the rule down." Update when major decisions change (routes, auth model, search strategy, data model, new provider, recurring mistakes), not for every detail. Includes a reusable prompt to give a planning AI, then review every section for truth, scope, safety, and "what not to do."
- Key claims: Stable project rules belong in AGENTS.md; feature-specific details belong in per-feature prompt files. The bigger workflow scales to multiple focused context documents for larger products.
- Learner-relevant: The guide's takeaway — AGENTS.md gives the AI a real system to work inside; everything (catalog, course page, lesson, search, timestamps, analytics) shares that one source of truth.
