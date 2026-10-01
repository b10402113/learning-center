---
source: race-60-open-source-llms-1
source_type: text
source_lines: 1860
part: 1
status: absorbed
created: 2026-10-01
updated: 2026-10-01
absorbed_at: 2026-09-30
---

# Digest — Race 60+ Free Open Source LLMs (part 1)

## Overview (L1)

- Adrian (JavaScript Mastery) opens by rejecting the standard "chatbot + model dropdown" AI tutorial: the real question is *which* open-source model to use, so he builds an "LLM arena" that races up to three open-source models on one prompt and lets users vote.
- The build is fully agentic with Claude Code, starting from nothing but a written idea, an Excalidraw sketch (three UI sketches), a `scope.md`, and a `CLAUDE.md`; it follows the phase-based workflow (scope → architect → develop → check → test → document → sync) encoded in the open-source JSM agentic engineering skills.
- Stack: Next.js 16, Prisma + Postgres, Clerk (auth), PostHog (observability), Arcjet (rate limiting/bot + prompt-injection protection), CodeRabbit (AI PR review), Vercel AI SDK + OpenRouter provider.
- First workflow lesson: every decision is made out loud in plain language and the agent *stops before writing code* to ask a question with options; the first such fork is how to call OpenRouter and how three models stream to the browser at once.
- This chunk covers the hook, project scaffolding, GitHub + CodeRabbit, the foundations branch, and the first feature (env validation, dependency install, Clerk/OpenRouter/PostHog/Arcjet setup).

## Structure (L2)

### The hook and the LLM arena project

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#00:00]]`
- Summary: Every AI tutorial ships the same chatbot + model-picker dropdown; the dropdown hides the unanswered question "which one should you actually be using?" Adrian introduces the LLM arena — one prompt, up to three open-source models streaming side by side with real tokens/sec, time-to-first-token, and cost, then a user vote feeding a public leaderboard.
- Key claims: the app is an "honest measuring instrument, not just a flashy demo"; whole build goes from a written idea + rough handwritten sketch to a deployed app agentically with Claude Code; stack named inline (Next.js 16, Prisma, Postgres, Clerk, PostHog, Arcjet, CodeRabbit).
- Learner-relevant: the product framing (measure, don't demo) and the full target stack, useful as the map for the rest of the series.

### The workflow philosophy and the JSM skills

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#01:46]]`
- Summary: Before any code, Adrian explains the method: developers make the decisions only they can make, stated out loud in plain language, then instruct the AI. If the plan turns out wrong once real, fix the plan too, not just the code. He points to the agentic engineering course (in beta, waitlist) and the open-source JSM skills, whose `/scope` skill turned the vague idea into the spec.
- Key claims: agents are non-deterministic, so the generated spec and sketches are bundled as a download so everyone starts from the identical point; scripting commits after each verified feature; the spec was auto-created by the `scope` skill (idea → product plan, slices, features).
- Learner-relevant: the core principle "decide first, then build" and why a fixed starting spec matters when the builder is non-deterministic.

### Project init and the starting files (scope, sketches, CLAUDE.md)

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#05:46]]`
- Summary: Creates an empty `llm-arena` folder, runs `pnpm create next-app@latest --yes`, then drags in the downloaded starting files: `scope.md` (in `docs/`), three UI sketches, and `CLAUDE.md` at the root. Explains CLAUDE.md is the file the agent reads first and encodes how to work: decide before building, stop and report back before touching code, ask one real question with options when something genuinely forks, keep scope.md updated, plus project rules (no test runners, color decisions).
- Key claims: the scope file was created automatically by the `scope` skill; all agentic steps from here read CLAUDE.md first; `pnpm install` + `pnpm dev` boots a clean empty app on localhost:3000; the scope describes auth via Clerk so only env keys are needed rather than a Clerk setup prompt.
- Learner-relevant: the concrete artifact set (scope.md + sketches + CLAUDE.md) and the "agent reads CLAUDE.md first" convention that makes the workflow reusable on client projects.

### GitHub repo and CodeRabbit AI code review

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#08:33]]`
- Summary: Pushes the local project to GitHub (`git init` → `main` → remote origin) and connects CodeRabbit (transcribed "GPile/Gravile/Grapile"), an AI PR reviewer. Setup walkthrough: free tier (unlimited repos, 50 credits/month), connects the GitHub repo, indexes the entire codebase into a graph of functions/imports/call graph (not diffs in isolation), configures comment sensitivity (high = P1 only, low = more comments, balanced recommended), re-trigger on new commits, updates PR description, and a "fix with Claude" copy-paste prompt. Also introduces TX / "Test Run Execute" (T-Rex), which runs the change in a sandbox (services, dev servers, mocks, browser agents, targeted tests) and comments evidence on failure, plus optional auto-approve of PRs rated a clean 5/5 (low-risk config/formatting foundations).
- Key claims: real engineers open a PR per feature rather than one big commit; CodeRabbit learns over time from thumbs up/down; early foundation PRs may be auto-approved because they are low-risk.
- Learner-relevant: how to set up an AI reviewer that sees whole-repo context, and the auto-approve/learn-from-feedback behavior as a practice for solo and team work.

### Foundations branch and the first architectural decision

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#15:55]]`
- Summary: Creates the `foundations` branch. Notes the process is agent-agnostic (VS Code chat window, terminal CLI, or a dedicated Claude extension ~22M downloads). Runs Claude at auto/medium effort on the default recommended model (Opus 5). The first prompt tells the agent to read CLAUDE.md and scope.md and decide the approach for feature one *without writing code*. The agent asks: call OpenRouter via raw fetch or via Vercel AI SDK + OpenRouter provider? Adrian picks the AI SDK because it gives streaming, per-model usage token data, and abort handling out of the box, and because the PostHog AI wrapper plugs directly into the AI SDK provider for per-call analytics. The second open decision is how three models stream to the browser: the scope flags that one shared connection is *wrong* — if it drops, all three answers die; the app needs independent connections, one per model.
- Key claims: "decide first, then stop before a single line of code exists" is the rule, not the agent being slow; giving the right answers to these forks is what prevents an expensive rewrite later; independent per-model connections are the only version that survives one model failing.
- Learner-relevant: a worked example of a load-bearing architecture decision surfaced with options before coding, and the reasoning for per-model streaming connections.

### Feature one build: env validation and dependency install

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#22:03]]`
- Summary: On green light the agent records the decision, marks "connecting to a model" in progress, and installs dependencies: OpenRouter, Clerk, Prisma, PostHog, Zod, plus dev deps. It creates its own to-dos (Prisma client, singleton, Clerk middleware, PostHog wired) and starts with an env module using fail-fast validation at startup. Adrian warns this first prompt can take 5–10 minutes and is the only one that long, so he collects all API keys meanwhile so the agent never stalls mid-build.
- Key claims: fail-fast env validation at startup is the first thing built; placeholder env values may not exist yet, so real values are pasted in directly; two things the original plan got wrong (mostly env), which the agent surfaced.
- Learner-relevant: the "collect your keys during the long first build" workflow tip and start-time env validation as a foundation practice.

### Clerk auth and the OpenRouter key

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#23:04]]`
- Summary: Clerk handles user management with a ready-made login UI; free on unlimited apps with >50,000 monthly retained users per app, and Clerk offers an MCP server plus detailed agent skills. Walkthrough creates the "JSM LLM Arena" app with a GitHub provider and pastes the publishable + secret keys into `.env.local`. Then OpenRouter: browse 300+ text models (~40 image, ~30 embedding, some audio/video); create a free account (no payment method), grab the API key, and paste it under `OPENROUTER_API_KEY`.
- Key claims: because scope.md already specifies Clerk auth, only env keys are required (no separate Clerk setup prompt); three keys obtained (OpenRouter + two Clerk), PostHog and others still pending; OpenRouter gives access to the free open-source models the arena races.
- Learner-relevant: concrete auth setup and the model-access provider that makes the whole "race free open-source models" premise possible.

### PostHog self-driving setup

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#26:01]]`
- Summary: PostHog's new "self-driving" connects to GitHub, reads issues, and can be prompted from Slack to fix and report. The install command opens a wizard that analyzes the project, authenticates, creates an "LLM Arena" project, and connects the GitHub repo. It proposes custom "scouts" (scheduled checks): watch the prompt→vote funnel for completion drops, and watch model win rate for unhealthy vote concentration — both turned on. It automatically opens draft PRs for what it can fix. Envs: set `POSTHOG_HOST` (EU or US) and paste the project token as `POSTHOG_KEY` from project settings.
- Key claims: PostHog is becoming an all-in-one observability + development tool with a single data layer (analytics, replays, errors); the scouts noticing exactly the metrics worth tracking later is valuable; the PostHog AI wrapper previously drove the AI SDK choice; wizard may or may not add envs automatically.
- Learner-relevant: observability wired from the start, and the app-specific metrics (prompt→vote completion, win-rate concentration) that a lesson can anchor to measuring model quality.

### Arcjet in front of the endpoint

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#31:16]]`
- Summary: Introduces Arcjet as the second security concern, with two parts; the first is what sits in front of the endpoint — rate limiting and bot protection — and it will block a prompt-injection attempt before any model ever sees it. (Cut off at the end of this chunk; the second half is continued in part 2.)
- Key claims: Arcjet guards the model endpoint at the edge; prompt-injection blocking happens pre-model; rate limiting and bot protection are part of the same layer.
- Learner-relevant: why an LLM app needs endpoint-level protection before requests reach a model, setting up the next chunk's Arcjet + injection-defense lesson.
