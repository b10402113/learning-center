---
source: 2-course-project-setup
source_type: pdf
source_lines: 315
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 2-course-project-setup

## Overview (L1)

- Repo tour: harness folder and model selection — Walkthrough of the starting repository, the `harness` folder, the JavaScript-level expectation, and the `model` file that selects any Vercel AI SDK-supported model.
- The runtime (agent loop) — The `runtime` file is the core of the harness and the agent's environment; it is mostly stubbed with `emit` calls because a distributed, durable agent uses WebSockets as its transport rather than request/response SSE.
- Remaining project structure — The roles of `lessons`, `notes`, `OpenSpec`, `server` (event bus + Express), `shared` (event definitions), `web` (unused client), and `.dev.vars` for the API key.
- Provider portability and platform runtimes — Q&A establishing that nothing depends on the AI SDK specifically, how to swap providers (e.g. Anthropic), and that cloud platforms offer their own harness runtimes (e.g. AWS agent core).
- Running the app and the first milestone — `npm run dev` starts the inspector, which reports "no agent yet"; the first task is a brittle agent loop, then wrapping a harness around it, with UI actions intentionally no-op for now.

## Sections (L2)

### repo-tour-and-model-selection

- Locator: `[[sources/agent-harness/20260915/2-course-project-setup.txt#repo-tour-and-model-selection]]`
- Summary: Tour of the starting lesson-one repo, beginning with the `harness` folder where most work happens and the `model` file that configures inference. Includes an audience Q&A about the required JavaScript level.
- Key claims: This is a JavaScript/Node course — no prior JS means struggling, but a Hello World Express or React background is enough, and AI can help bridge gaps; the `harness` folder contains the `model` file; the course uses the Vercel AI SDK, which supports many providers, so any supported model works by changing the import; the instructor uses GPT 4.5 but the model choice is irrelevant to the harness.
- Learner-relevant: Orients learners in the codebase and removes the misconception that model/provider choice affects the harness lessons.

### the-runtime-agent-loop

- Locator: `[[sources/agent-harness/20260915/2-course-project-setup.txt#the-runtime-agent-loop]]`
- Summary: Introduces the `runtime` file as the heart of the harness — the environment and loop in which the agent runs, analogous to a game loop. It is heavily stubbed and is where the majority of the course is spent.
- Key claims: The runtime is the agent's environment/agent loop and is mostly stubbed with `emit` calls; WebSockets are the transport because the harness needs bidirectional, fire-and-forget events rather than SSE request/response; the agent uses a distributed, durable execution layer, so events must reach any connected client; learners need no WebSocket knowledge — `emit` just broadcasts that something happened, a common distributed-computing pattern.
- Learner-relevant: Names the central artifact of the course and explains the transport decision before the learner encounters it in code.

### project-structure

- Locator: `[[sources/agent-harness/20260915/2-course-project-setup.txt#project-structure]]`
- Summary: Catalogues the remaining folders and files in the repo so learners know what to ignore and what matters.
- Key claims: `lessons` holds the markdown lessons; `notes` is instructor-only and empty; `OpenSpec` is a tool for tracking implementation work with coding agents and is unused here; `server` contains the WebSocket event bus and an Express server (roughly one route added during the course); `shared` defines all event types emitted by the runtime and consumed by clients; `web` is the client UI and requires essentially no work; `.dev.vars` is where the API key goes.
- Learner-relevant: Focuses attention on `harness` and `shared`/`server` while safely deprioritizing UI and scaffolding.

### provider-portability

- Locator: `[[sources/agent-harness/20260915/2-course-project-setup.txt#provider-portability]]`
- Summary: A detailed Q&A on how tightly the harness is coupled to the Vercel AI SDK and how to switch providers (OpenAI, Anthropic, Azure, etc.). Scott shows provider packages and explains the abstraction boundary.
- Key claims: The AI SDK has provider-specific npm modules (e.g. `@ai-sdk/openai`); `streamText`/`generateText` are the inference entry points and work the same regardless of provider; to use Anthropic, install its provider module, import and construct the client, then export that model; the harness itself is not dependent on AI SDK beyond making an inference call, and the tool calling it uses exists in raw provider SDKs too; platforms like AWS (agent core), Azure, and Cloudflare ship their own runtime covering these concerns, but you still need the concepts to know when to reach for them; the course builds from scratch to stay platform/SDK/language agnostic.
- Learner-relevant: Shows the harness's portability boundary and why understanding concepts beats memorizing one SDK, connecting the course to enterprise platform offerings.

### running-the-app

- Locator: `[[sources/agent-harness/20260915/2-course-project-setup.txt#running-the-app]]`
- Summary: Demonstrates running the course app and explains what the learner sees at this stage and why.
- Key claims: `npm run dev` starts the server serving the inspector; sending a message returns "no agent yet" because the runtime is only emits; the next step is to build a super brittle agent loop, then surround it with a harness to make it robust; many UI controls are intentionally no-ops in lesson one (e.g. clear and supervise) so the learner does not have to revisit UI later.
- Learner-relevant: Sets expectations for the first hands-on milestone and prevents confusion over intentionally broken UI.
