---
source: agentic-engineer.02
source_type: text
source_lines: 1054
part: 2
status: absorbed
absorbed_at: 2026-10-14
created: 2026-10-14
updated: 2026-10-14
---

# Digest — agentic-engineer (part 2) — Agentic Mindset

## Overview (L1)
- Why AI Coding Falls Apart — Names the two root causes of AI coding failure: the model produces the generic public-code average, not your project's specific version (no real context), and it plans toward an underspecified goal, silently filling every unstated decision with its own likely defaults (no real plan). Introduces the diagnostic question for any failure.
- Direct the AI Dont Rely on Hope — Replaces the "genie" mental model (write a wish/prompt, hope, rewrite the wish) with "you are the architect, the agent is the engine." The human supplies judgment, constraints, and decisions; the agent supplies speed and tirelessness. Reframes the agent as a multiplier that amplifies whatever direction it is given.
- Skit- How to Outsmart a Genie — Reference pointer only: a YouTube link to a comedy sketch about trying to outsmart a genie with loopholes, used as an analogy for prompt-hacking.
- Vibe Coding vs. Agentic Engineering — Side-by-side of Developer A (vibe coding) and Developer B (agentic engineering) on the same Stripe checkout task. A ships fast and breaks production by never reviewing the diff; B reads the codebase, updates AGENTS.md context, scopes to one job, reviews and tests each step, and ships clean. Argues the difference is who is in control, not skill or model.

## Sections (L2)
### why-ai-coding-falls-apart
- Locator: `[[sources/agentic-engineer/20261014/2. Agentic Mindset/1. Why AI Coding Falls Apart.srt#why-ai-coding-falls-apart]]`
- Summary: Walks through the familiar arc where the AI scaffolds a project well for the first 30 minutes, then degrades — re-adding existing functions, breaking one thing while fixing another, editing files it wasn't asked to touch, slowing and losing precision as context grows. It diagnoses why this happens and states that neither cause is fixed by a better prompt.
- Key claims: Root cause 1 is that the model predicts the next token over a massive amount of public code, so it returns the most common way a thing is written — correct in general but generic by default, and it has never seen your codebase (specific API client, conventions, last week's decisions) unless you put it there; Root cause 2 is that a modern agent does plan (reads files, maps an approach, runs tests, self-corrects on failure), but the problem is what it aims at — it plans toward the goal you handed it and fills every unstated decision with the most likely default; Combining the two yields the stuck cycle: big prompt → big output → can't verify → something breaks → even bigger prompt → really can't verify.
- Learner-relevant: Establishes the failure diagnostic used throughout the course — when something goes wrong, ask "did the agent not have the context, or did it not own the decisions that were yours to make?" Almost always it is one of the two. The intended fix is not tricks or prompting hacks but an actual workflow that engineers context on purpose and plans before it builds. Mentions that a "build the cart feature" request produces ~10 unseen decisions (state shape, API surface, error handling) that pile into a 300-line diff.

### direct-the-ai-dont-rely-on-hope
- Locator: `[[sources/agentic-engineer/20261014/2. Agentic Mindset/2. Direct the AI Dont Rely on Hope.srt#direct-the-ai-dont-rely-on-hope]]`
- Summary: Argues the two root causes trace back to a wrong mental model: treating the agent like a genie whose wish you rewrite. Offers the correct model — you are the architect, the agent is the engine — and compares the working relationship to a senior engineer directing a junior: give context and direction, review what comes back, catch problems before they land.
- Key claims: The agent is super fast, tireless, and writes more code in an hour than you could type in a day, but it has no judgment — judgment is, and always was, your job; The same agent and model produce very different results depending on what the human in the loop does: an undirected "build the card feature" yields ~20 silent decisions and a 300-line unreviewable diff, whereas direction yields a ~40-line diff readable in two minutes; The agent is a multiplier — vague direction is amplified into a mess, clear direction into working software, so developers scared of replacement have it backward (the person who only hopes is replaceable; the person who turns a fuzzy problem into clear direction becomes more valuable).
- Learner-relevant: Gives the actionable directive to catch yourself "hoping" and, before firing off a vague prompt, ask what a senior engineer would do. Defines the directed task shape: say what the thing is, what it touches, what done looks like, and what does not get built. Sets up the A/B comparison in the next lesson.

### skit-how-to-outsmart-a-genie
- Locator: `[[sources/agentic-engineer/20261014/2. Agentic Mindset/3. Skit- How to Outsmart a Genie .txt#skit-how-to-outsmart-a-genie]]`
- Summary: This file contains only a YouTube link, not lesson prose.
- Key claims: It is a reference to a comedy sketch about outsmarting a genie, offered as an analogy for the futility of prompt-hacking loopholes.
- Learner-relevant: URL — https://www.youtube.com/watch?v=lM0teS7PFMo . Watch it as the illustration for the "genie" mental model contrasted against the architect/engine relationship.

### vibe-coding-vs-agentic-engineering
- Locator: `[[sources/agentic-engineer/20261014/2. Agentic Mindset/4. Vibe Coding vs. Agentic Engineering.srt#vibe-coding-vs-agentic-engineering]]`
- Summary: A concrete A/B scenario. Both developers get "build me a checkout feature" with Stripe. Developer A lets the agent scaffold a payment intent, API route, webhook handler and install packages, pushes a working-looking ~240-line / 3-file result it cannot read, and two hours later hits a signature verification error in production because the agent never wired up the raw body parser Stripe requires. Developer B inspects the project first, adds context, scopes to one job, reviews, and ships clean.
- Key claims: Developer B checks what the project already has (auth middleware, an existing API convention, a Stripe key already in environment variables), updates their AGENTS.md with the context that matters (SDK version, this project's route pattern, and that webhooks need raw body parsing), then scopes the task down from "checkout feature" to just "create a payment intent endpoint"; B's output is ~60 lines, they read it, spot a missing auth guard their project requires on every protected endpoint, get it fixed, test it, commit, then scope the next step (the webhook handler) — again one job with full context and reviewable output; The difference was not skill and not the model, it was who was in control — A was reacting and hoping, B was directing.
- Learner-relevant: Shows the practical building blocks of agentic engineering — read the codebase for existing conventions, maintain project context in an AGENTS.md file, scope each request to a single reviewable job, review and test the diff before committing, then scope the next step. Explains why the gap feels sudden (AI removed the typing bottleneck, exposing rather than creating the difference) and why it compounds (the longer a session runs without direction, the less reviewable its output and the more it breaks in production). Frames vibe coding as a default path of least resistance when you lack a system; the course is that system. Next module opens up how agents actually work — what they see, how they read your codebase, and why context fills up faster than you expect. Concrete terms: Stripe, payment intent, API route, webhook handler, raw body parser, signature verification error, auth middleware/guard, AGENTS.md, SDK version.
