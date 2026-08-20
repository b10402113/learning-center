---
source: ai-coding-crash-course
source_hash: da481b10e4ee06523bb249bd623801d02915be4f05472a6d991396a56d17294a
source_lines: 10222
created: 2026-08-19
updated: 2026-08-19
---

# Digest — ai-coding-crash-course

Matt Pocock's *AI Coding Crash Course* — a hands-on course on shipping real features with AI coding agents (Claude Code), covering: agent fundamentals (model/harness/environment, turns, context), how agents think and cost money (attention, token billing, hallucinations), the smart/dumb context zone, grilling to design before building, steering via agents.md/skills, and shipping large work via specs/tickets/code review. Stripped SRT transcript, 10,222 content lines (~50 short lessons).

## Overview (L1)
- **part_aa** — course intro & setup: philosophy, paid subscription, Cadence playground, agent install, source-vs-database primer
- **part_ab** — clean config, request logger, agent=model+harness+environment, next-token non-determinism, turns, context & sessions
- **part_ac** — attention degradation & smart/dumb zone, statelessness, billing & token caching, hallucination types, effort dial
- **part_ad** — model effort levels, de-emphasizing model choice, sub-agents, Claude Code onboarding (commands, IDE, rewind, bash)
- **part_ae** — agent operation (bash, permissions, auto mode), context hygiene (reset, strip system prompt, token counter), exploration, first build
- **part_af** — plan mode vs grilling, compaction & handoff, context-window management
- **part_ag** — phase-boundary decisions, auto-compaction dangers, push-vs-point steering (agents.md, doc+pointer, skills)
- **part_ah** — skills placement & pruning, navigation pointers, specs/tickets for shipping large work
- **part_ai** — implementing tickets, code review, QA loop, archive specs, re-grill recipe, coding-standards, wrap-up recap

## Sections (L2)

### Welcome & Course Philosophy
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_aa:1-157]]`
- Summary: Matt introduces himself and the course: a two-year distillation of bringing software fundamentals back to AI coding, built around his skills repository (200k+ GitHub stars, 13M+ downloads). He previews a five-step system — grilling, creating a spec, creating tickets, implementing, then reviewing — plus context management and breaking large work into agent-sized chunks.
- Key claims: The course teaches agent-agnostic fundamentals, not one agent's quirks, usable in any terminal-based agent; the demo agent is Claude Code but it is only covered enough to take the course; prerequisites are just "can you read code" and "can you use a terminal (cd, ls)".
- Learner-relevant: Know the course shape, the five-step workflow to be trained on, and confirm you meet the minimal prerequisites before starting.

### Choosing Your AI Subscription
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_aa:158-301]]`
- Summary: Matt explains that a paid plan is required for the course — free tiers aren't sized for agentic work and hit a wall in the first serious session. He walks through Anthropic's tiers (free/Pro/Max 5x-20x) and OpenAI's (plus/pro), recommends starting on Pro and upgrading to Max for professional work, and argues subscriptions beat pay-per-token APIs.
- Key claims: Expect ~£89 (~$100) per month (a 5x Max is the maximum needed); subscriptions can be 20–50x cheaper than API key token pricing (example: Theo's ~$50k token spend was ~$800 via subs); metered cost per session creates a "electricity meter" psychology that distorts decisions toward token-saving over quality.
- Learner-relevant: Lock in a paid subscription before starting, pick Claude Code + its default model if no preference, and know that model choice will be revisited later.

### Setting Up the Playground (VS Code, git, Node, npm)
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_aa:302-611]]`
- Summary: Setup of the course environment: install VS Code (recommended for its built-in terminal; any IDE with a terminal works), clone the course repo with `git clone`, install Node (use an LTS version, check with `node --version`) which ships npm, run `npm install` to pull packages, then `npm run db:migrate` and `npm run db:seed`, and finally `npm run dev` to launch the Cadence app (localhost 5173+).
- Key claims: The agent runs as a terminal program; WSL gives a Linux terminal on Windows; the scripts live in package.json; the project is a TypeScript/Node app ("Cadence") seeded with dummy data including user switching via a dev UI.
- Learner-relevant: Successfully boot the local app and verify seeded dummy data (e.g. user Emma Wilson with TypeScript/Node.js courses) — the signal that setup is complete.

### Installing Your Coding Agent
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_aa:612-710]]`
- Summary: Install Claude Code (commands differ by platform — Linux/WSL/macOS vs Windows PowerShell vs CMD), open a fresh terminal, run the install command, trust the workspace when prompted, log in with the subscription option, pick a model via `/model`, and verify with a simple "hello" exchange.
- Key claims: Choose the default model for your subscription tier (e.g. Opus 5 with 1M token context, medium effort — how the course was recorded); the setup is complete when the agent replies to "hello".
- Learner-relevant: Have a working, authenticated coding agent with a chosen model in the project folder.

### Following Along: reset, cherry-pick, pull
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_aa:711-932]]`
- Summary: Matt demos tools to match your code to his at any lesson point. `git checkout -b dev` creates a throwaway learning branch; `npm run reset` rewinds your checkout to any filmed commit (each lesson maps to commits); `npm run cherry-pick` instead stacks commits on top of your own changes (preserving work like an added script); `npm run pull` fetches course updates shipped mid-course.
- Key claims: reset and cherry-pick are git operations (reset = rewind checkout, cherry-pick = stack a commit on top); if not comfortable with git cherry-pick/merge conflicts, stick with reset; every hands-on lesson will instruct a reset-to-commit first.
- Learner-relevant: Keep your environment in sync with the instructor at any lesson, choosing reset (simple) vs cherry-pick (preserves custom work).

### Databases vs Source Code (schema, migrations, seed)
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_aa:933-1128]]`
- Summary: A primer distinguishing source code (files you edit to change behavior, e.g. `app/db/schema.ts`) from the database (`data.db`, a SQLite file on disk). Source code defines the database's shape, but the database is updated separately via a manual migration (`npm run db:migrate`). Running `npm run reset` only rewinds source code — not the database — causing "no such column" errors until you migrate.
- Key claims: Source code and database must be versioned/synchronized together or you get errors; migrations are tracked in a generated migration history (e.g. `alter table courses add notes`); the seed script (`npm run db:seed`) deletes and recreates tables with dummy data, so the database is breakable — it's not production data.
- Learner-relevant: Understand the schema→migrate→seed flow, know to re-migrate after resetting source code, and recognize when an agent must migrate after editing schema.ts.


### Reset your agent config
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ab:1-100]]`
- Summary: Most people enter the course over-configured (MCP servers, skills, plugins, settings). The recommendation is to delete it all and work from a small starting point, backing up first via a copy-paste prompt that gets the agent to inventory, back up, and later rehydrate its own config.
- Key claims: Most learners arrive with way too much config, which most of them simply don't need; your agent is an expert on its own configuration and can back up/restore it because most config is file-based; running the course on a clean setup keeps course material from interacting with the learner's existing setup.
- Learner-relevant: After this lesson, the learner can run the provided prompt to have their agent back up config to a separate directory and restore it on demand, so they can try the course from a blank slate without losing anything.

### The request logger
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ab:101-244]]`
- Summary: Introduces the course's request logger: `npm run request-logger` starts a local web server on localhost:8787 that agents can be pointed at (e.g. `ANTHROPIC_BASE_URL=http://localhost:8787 claude`), which proxies requests to the real provider while logging every request and response into a `logs/` folder with UTC-timestamped files (a raw `request.tsx`/`response.tsx` and a readable markdown file with the full request and response including the entire exposed system prompt).
- Key claims: The logger works by passing an environment variable/config to the agent so it sends requests to localhost:8787 instead of the provider; the markdown log shows XML-tagged sections — system prompt, tools, message history, assistant text — useful for navigating; it currently works with Claude and Codex but is expected to be updated for more agents.
- Learner-relevant: The learner can set up the request logger and inspect real request/response logs to see exactly what gets sent to the model provider; later lessons will spend a lot of time in these logs.

### The Discord community
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ab:245-361]]`
- Summary: Points learners to the course Discord: public channels (General, AI Hero, Everlight, Sandcastle, Skills repo, Showcase, Random) plus crash-course-only channels (Course chat, Crash Course Random, and a forum-style Crash Course Questions for lesson questions), and explains the red "hero" roles and purple moderator roles.
- Key claims: The Discord is where questions get answered and where the instructor hangs out; course purchasers need to click the link below to get the correct role to see the extra channels; use the forum-post mechanism in Crash Course Questions for specific lesson questions to keep things organized.
- Learner-relevant: The learner can join the Discord with the crash-course role, say hello in Random, and know which channel to use for different kinds of questions.

### What is an agent?
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ab:362-501]]`
- Summary: Defines the four core elements — environment, model, agent, harness. The model is "the engine in the car" (e.g. Opus, Sonnet, GLM 5.2, Fable), a stateless text-in/text-out thing; the harness connects it to the outside world (the environment), e.g. Claude Code and Codex use the file system via tool calls, while ChatGPT/Claude.ai have their own virtual environments. The agent is just the harness + model together.
- Key claims: "An agent is a model harnessed in an environment"; examples — Opus 4.8 on Claude Code on the file system, GLM 5.2 on Pi on the file system, GPT 5.5 on ChatGPT in the ChatGPT environment; the harness/environment boundary bleeds (e.g. is an npm script part of the harness or the environment?); people over-focus on swapping models, but training a new model is unbelievably expensive, so the real lever is improving the harness and environment.
- Learner-relevant: The learner can name and distinguish the model, harness, environment, and agent, and reason about which part of the system they can actually improve to make agents perform better.

### The model: next-token prediction and non-determinism
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ab:501-687]]`
- Summary: Explains that a model does next-token prediction, assigning probabilities to candidate tokens (e.g. red 28%, blue 40%, orange), then a sampler picks one with weighted randomness; temperature controls this — high temperature = more random, low = more deterministic. But always picking the most likely token is a trap.
- Key claims: Non-determinism is baked in and produces better results — forcing the most likely choice every time is the "likelihood trap" (paper: "Trading off diversity and quality in natural language generation"), where human judges rate overly deterministic output as worse; even temperature 0 is not reproducible because LLM computation is massively parallel and ordering matters; non-determinism means your agent will behave differently from the instructor's, and there is always a non-zero chance the agent does something weird or bad, echoing into permissions.
- Learner-relevant: The learner understands why their agent's output varies, why they shouldn't chase determinism, and why they should keep risk of erratic agent behavior in mind (permissions).

### A turn with the agent: model provider requests, tool calls, tool results
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ab:688-1002]]`
- Summary: Uses the request logger to trace what a real interaction looks like: each ping to the provider (e.g. Anthropic's `/v1/messages`) is a model provider request, carrying the full system prompt, tools schema, and entire conversation history; sending "hello" and a follow-up generates multiple logged requests (including hidden ones like suggestion mode). Asking the agent to write a file reveals the flow: message → tool use (JSON with a file path and content, defined earlier in the request as JSON schema) → the harness executes the tool → tool result → final message.
- Key claims: Every request to the agent passes the entire conversation history along, and files grow longer over time; a tool is something the harness provides to the model to interact with the environment (e.g. a write tool taking file path + content); both model provider requests make up a single turn, and a turn can last hours and contain hundreds of model provider requests; this turn/request/tool-call/tool-result loop is how all the magic in Claude Code, Codex, and any harness works.
- Learner-relevant: The learner gains a precise vocabulary — model provider request, turn, tool call, tool result — and can trace a full agent interaction through the logs, including seeing the system prompt and tool schemas.

### Context, the context window, and sessions
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ab:1003-1128]]`
- Summary: Defines the agent's context as all the available information (instructions, parameters, tool calls, message history) that gets turned into tokens for next-token prediction; introduces the context window — a somewhat arbitrary maximum (e.g. GPT 5.6 Sol at 1.1M tokens, Gemini 3 Pro at 1M, GPT 5.2 Chat Latest at 128k) past which a request fails; the harness never starts context at zero because it injects a system prompt; building up context over multiple turns is a session.
- Key claims: You are billed for every token you send, so keep context worth sending and relevant (models get confused/distracted by too much text like humans); the system prompt tells the model what tools exist, its role, and high-level instructions (e.g. "You are Claude Code, Anthropics' official CLI..."); the chosen harness heavily influences the text sent; a session is the accumulated context across multiple turns.
- Learner-relevant: The learner understands why context management matters for cost and quality, can identify the system prompt in a log, and knows what a session is as they build up multi-turn conversations.


### Context Vocabulary & Navigating Sessions (finish)
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ac:1-31]]`
- Summary: Tail end of the earlier lesson on context and sessions: you can clear the context, compact the session, or move to a separate session and come back. Matt sets a mission — poke through the request logs and read the system prompt to see what's actually in there.
- Key claims: Having precise words for context, context window, sessions, turns, and model provider requests is essential for navigating AI interactions; each agent's system prompt differs (and Claude Code's changes constantly).
- Learner-relevant: Be able to use the session-navigation vocabulary and know how to inspect an agent's system prompt via the request logs.

### Attention, Attention Degradation, Smart Zone & Dumb Zone
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ac:32-283]]`
- Summary: Explains why the agent gets worse the more text it holds. With 2 tokens there are 3 things to track (both tokens + the relationship); relationships between tokens scale quadratically (1k tokens → 1M relationships, 100k → ~10B). This is the attention mechanism, and its degradation means a "smart zone" (complex planning, building software) and a "dumb zone" (simple tasks only).
- Key claims: More context in a model provider request → worse performance, plus higher token cost; the dumb zone currently starts around ~150k tokens (up from ~100-120k previously) and moves back as models improve; the 1M-token context window is a headline feature, not really for coding — quality work needs the smart zone; the dumb zone is a slow decline, not a cliff.
- Learner-relevant: Know the ~150k-token paranoia number and start planning how to bail out or hand off when a session approaches it, to keep work in the smart zone.

### Stateless Models, Stateful Harness & Environment
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ac:284-409]]`
- Summary: Breaks down where state lives. The model itself is totally stateless — it carries nothing forward; the harness is stateful but only within the duration of a session; the environment (file system) is fully stateful and survives clearing a session. Memory systems people bolt on are ways to augment the environment so the agent remembers across sessions.
- Key claims: The harness re-sends all session state in one big chunk because the model remembers nothing; if you save a file then clear the session, the state persists; Matt defaults to statelessness, quoting Mario Zechner (creator of Pi): "my code base is my memory system."
- Learner-relevant: Rely on the code base/filesystem as the durable memory rather than bolting on external memory systems to the agent.

### How You Get Billed: Tokens, Caching & the Prefix Cache
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ac:410-667]]`
- Summary: Explains agent billing using the numbers the provider returns on every model provider request. Input tokens (what you send — the whole session) vs output tokens (what the agent produces); output is billed at a much higher rate (Claude Opus 4.5: $10/M input vs $50/M output). A live demo on the request logger shows cache creation vs cache read input tokens and how the prefix cache makes subsequent requests cheaper.
- Key claims: Thinking tokens are billed the same as output tokens; sessions grow by appending, so caching is suited to them (stable stuff at the front of the request, changing stuff later); an hour's break can exhaust the cache; every input token is re-billed every request, so "sediment" builds up — keeping context small and relevant is good for both the agent and your wallet.
- Learner-relevant: Read the usage numbers in request logs, distinguish input/cached/output tokens, and treat growing sessions' cached reads as cheaper.

### Hallucinations: Factuality vs Faithfulness
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ac:668-959]]`
- Summary: A dictionary for hallucinations. A factuality hallucination is invented/wrong facts about the world, caused by missing parametric knowledge (knowledge frozen in the model's parameters at training time) or its knowledge cutoff. A faithfulness hallucination happens even with the right info in context — the model drifts from it, made much worse by the dumb zone's attention degradation. Demo: Opus 4.8 confidently gives outdated X/Twitter API pricing, then a web search reveals the truth.
- Key claims: Parametric knowledge is compressed ("fuzzy JPEG"), can't be patched (must retrain), and has a cutoff; contextual knowledge (in the context window) makes hallucinations much less common but is not a cure; decision tree — if the info wasn't in context it's a factuality problem (load it in; "never trust an unsourced LLM"), if it was in context it's a faithfulness problem (clear context / get out of the dumb zone).
- Learner-relevant: Diagnose any hallucination using the two-branch decision tree and apply the right fix (load context vs clear context).

### Effort, Reasoning Tokens & Chain-of-Thought
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ac:960-1128]]`
- Summary: Introduces the effort dial (`/effort` in Claude Code). A demo compares max vs low effort on the same prompt: max used 41k tokens over 2m15s vs low's 11k over 1m11s, digging deeper and catching doc drift. Effort works by producing more reasoning tokens — the model's train of thought — grounded in chain-of-thought prompting (the apples math example), where showing intermediate steps improves reasoning.
- Key claims: Models output text, tool calls, and reasoning tokens; reasoning tokens are the model's stream of consciousness, hidden in Claude Code but shown in Cursor/Pi; chain-of-thought is a "fairly old paper" whose abstract says intermediate reasoning steps significantly improve complex reasoning; DeepSWE benchmark shows higher effort raises task success (Fable ~60% low → 70% max) but average cost per task rises with effort. (Lesson continues past the end of the chunk.)
- Learner-relevant: Know the effort↔cost tradeoff and start reasoning about when to dial effort down (cheap, fast, simple tasks) vs up (deep exploration).


### Effort levels: quality, cost, and latency
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ad:1-133]]`
- Summary: Uses a benchmark graph (quality % vs. cost per task) to show how effort level (low/medium/high) dramatically changes both cost and quality of the model you use, and how higher effort produces more output tokens, which means slower responses and faster arrival in the "dumb zone".
- Key claims: Effort is both a quality trade-off and a latency trade-off — more effort = more tokens = less smart zone; benchmarks are all flawed because your day-to-day work differs from benchmark tasks, so the only real test is trying effort levels on your own work; almost never go to max/extra-high effort — providers add max mainly to squeeze a few % higher on benchmark scores; the instructor sticks with one model (Opus 4.8, medium) rather than min-maxing per task, preferring a consistent model and tuning the harness/environment above it.
- Learner-relevant: The learner can read a model/effort cost-quality graph, understand why max effort is wasteful, and decide on a single consistent model + effort level instead of per-task min-maxing.

### Choosing a model: the model is 50/50 with the harness
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ad:134-365]]`
- Summary: Addresses "what model should I use?" by de-emphasizing the model: in the mental model, the model is ~50/50 with the harness + environment, and "models are like employees" — invest in your company infrastructure so any employee can succeed. Gives a mental model for when to swap models.
- Key claims: Any model in the top right of the graph will probably be fine; efficiency is the key — it's not raw cost in tokens but what you get per token (Gemini 3.5 Flash spends lots of tokens but is cheap per token, pulling it back toward efficient); API-token billing vs. much cheaper subscription is a pricing-structure choice you make along with the model; different tasks need different quality levels — exploration/research/summarisation may need only low effort, detailed planning/code review may warrant high effort, so pick the right tool for the job (e.g. Claude Fable medium for planning, GPT 5.6 Sol medium for implementation); the empirical way to assess models is to run two setups on the same task, note which is better, and repeat a few times.
- Learner-relevant: The learner can reason about efficiency (output per token), pair models/effort levels to task types, and set up a simple A/B experiment to assess models on their own real tasks instead of trusting benchmarks.

### Delegating to sub-agents
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ad:366-458]]`
- Summary: Visualizes the agent's context (system prompt in grey, exploration in yellow, implementation in green) and explains that harnesses want smaller chunks to spend fewer tokens, free up the context window, and stay in the smart zone — but skipping exploration legwork makes implementation suffer. The solution many harnesses use is delegation to sub-agents.
- Key claims: An orchestrator agent can spawn a sub-agent that spends lots of tokens exploring the codebase in depth and summarizes findings back — like a senior dev sending a junior to research and report; the orchestrator can spawn multiple sub-agents in parallel for different tasks; sub-agents can have different system prompts, models, or effort levels, and can even spawn their own sub-agents (nesting depth depends on the harness).
- Learner-relevant: The learner understands the sub-agent/orchestrator pattern as a context-management technique and why deeper exploration can be offloaded cheaply to sub-agents; the course will use sub-agents heavily later.

### Why Claude Code for this course
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ad:458-496]]`
- Summary: Explains the course primarily uses Claude Code as its demo harness because it's very popular and the one the instructor uses most, but the course is harness-agnostic — any CLI harness works. A dedicated "before we start" section covers Claude Code basics (with some advanced tips) for newcomers.
- Key claims: Claude Code is used for driving lessons and demonstrations but the course principles transfer to any CLI harness; experienced Claude Code users will still pick up tips because the section covers advanced material too.
- Learner-relevant: The learner knows they can follow along with any CLI harness while watching Claude Code demos, and can choose to walk the Claude Code basics section.

### Claude Code basics: setup and core commands
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ad:496-718]]`
- Summary: Walks through running `claude` inside the VS Code integrated terminal, running `/terminal-setup` to install key bindings (notably shift+enter for new lines), then demonstrates the core slash commands: `/usage` (remaining session/week limits), `/context` (tokens in the context window broken down by system prompt, tools, skills, messages, plus window size), and `/clear` (resets context to zero).
- Key claims: Models are stateless, and `/clear` (or pressing Ctrl+C twice for a brand-new session) resets the state to a blank slate; escape interrupts the agent mid-run — it cancels its work and inserts an "interrupted" message asking what to do instead; Claude Code's 5x max subscription is all you need for the course (20x also exists); `/context` is the way to debug what your setup looks like.
- Learner-relevant: The learner can run Claude Code in VS Code, complete terminal setup, check usage limits, inspect the context window, clear context, and interrupt the agent on demand.

### Advanced prompting tips: @ files, stashing, images
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ad:718-834]]`
- Summary: Shows three built-in prompting features: referencing files with `@` (with fuzzy search and tab/enter to pull files into the prompt — files get read straight into the context window with no tool call), stashing a draft prompt with Ctrl+S to set it aside and pop it back later, and pasting images from the clipboard into the prompt (e.g. a Lake Bled photo answered correctly).
- Key claims: Passing files via `@` sends them in the first model provider request directly, which is great for things like a spec you need to pass in; Ctrl+S stashing is useful when you're giving the agent feedback and aren't ready to send — you can pull it back, insert something, and refine before sending; Claude Code supports pasting images even in the terminal.
- Learner-relevant: The learner can reference files efficiently, stash/reuse prompt drafts, and include images in prompts inside Claude Code.

### Claude Code and your IDE: diff management
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ad:835-921]]`
- Summary: Shows how Claude integrates with an IDE (VS Code, but Cursor/Windsurf/etc. work too) via the `/ide` command, which manages the IDE integration and shows status (connected to Visual Studio Code via the "Claude Code for VS Code" extension). The integration is primarily for diff management.
- Key claims: Without the IDE, edits appear as an awkward diff in the terminal; connected to VS Code, the diff opens in the IDE where you can scroll the file and either accept proposed changes or click in and save the file to agree; the diff feature is what the instructor uses ~99% of the time and is why he runs Claude Code inside VS Code.
- Learner-relevant: The learner can install the IDE integration and review/accept agent file edits as rich diffs in their IDE rather than in the terminal.

### Going backwards and forwards: rewind, resume, fork
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ad:922-1044]]`
- Summary: Covers conversation/session navigation. You can ask Claude to "revert that" or press escape+escape to enter rewind mode, restoring the code and/or the conversation to a chosen checkpoint. Claude persists sessions locally, so you can quit with Ctrl+C twice and resume later several ways.
- Key claims: Rewind mode offers options — restore code and conversation, restore conversation only, or restore code only; sessions persist locally and can be resumed via `claude resume <UUID>` (from the previous command's output), the `/resume` command in a fresh session (with search over all sessions in the repo), or `claude --continue`; there is also a `/fork` command (mentioned, covered elsewhere); rewind mode also shows a "summarize from here" option.
- Learner-relevant: The learner can revert unwanted agent edits, rewind to any earlier state of code/conversation, and resume or fork past sessions.

### Running bash commands in Claude Code
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ad:1045-1128]]`
- Summary: Explains that bash commands turn the agent from a passive code writer into something that can seek feedback loops, run your project, and use bash to find information. You can ask Claude to run a command (it reads package.json, finds the dev server, runs it), or use bash mode directly by typing `!` and then a command, which runs it and puts the output into Claude's context.
- Key claims: Running `npm run typecheck` in bash mode surfaced install errors into Claude's context, and it diagnosed that zod was in package.json but not installed and recommended `npm install`; for long-running commands like `npm run dev`, press Ctrl+B to background the task — output goes to a local file and a background-task indicator appears under the status line.
- Learner-relevant: The learner can run bash commands directly in Claude Code via `!` bash mode, push results into the agent's context for it to act on, and run long-lived dev servers in the background with Ctrl+B. (Lesson is cut off at the end of this chunk.)


### Managing Bash Commands in Claude Code
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ae:1-81]]`
- Summary: Matt demos the three ways to run bash commands and control what the agent sees. The `!` prefix runs a command in an interactive shell you can view (e.g. watch the dev server on localhost 5175), Ctrl+B backgrounds it for management, and Ctrl+Z suspends Claude Code entirely so you can run hidden commands and `fg` to resume with all state intact.
- Key claims: Suspending (Ctrl+Z) hides commands and their output from Claude while preserving its state — useful when you don't want the agent to see something; bash mode (`!` + Ctrl+B) is mainly for debugging dev-server or long-running-command issues; these are Windows shortcuts — Mac users need equivalents.
- Learner-relevant: Choose the right bash mode per task: visible output for the agent (bash/background) vs fully hidden commands (suspend + fg), and use the shell view to let the agent see live server logs.

### Claude Code's Permissions Model
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ae:82-238]]`
- Summary: A lesson on risk vs reward and how Claude Code gates its own power with a strict-by-default permissions model. When the agent wants to run a command (e.g. `pnpm typecheck`), it shows the exact command and reason with three options: allow once, allow forever ("don't ask again" for this project), or deny — and you can press tab to suggest a different command. Preferences are recorded as a `permissions` array in `.claude/settings.local.json`, which is hand-editable and supports wildcards and `deny` entries (e.g. deny `git push *`). Web search/fetch also requires permission. Renaming the file to `settings.json` shares the rules with the team.
- Key claims: `settings.local.json` is personal and git-ignored, while `settings.json` is committed/shared and read by any Claude Code instance on the repo; permissions syntax uses exact commands or wildcards and a `deny` list; granting "don't ask again" writes a project rule that auto-allows future matches; denying access to a tool removes it from the system prompt.
- Learner-relevant: Understand and hand-edit the permission JSON to pre-authorize common commands and permanently deny dangerous ones (e.g. git push), and know the difference between personal and team-shared settings files.

### Auto Mode (LLM Classifier)
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ae:239-326]]`
- Summary: A guest note about auto mode, now the default in Claude Code (cycled with Shift+Tab through manual/accept-edits/plan/auto). Instead of hard rules, auto mode runs each command through an LLM classifier (probably Haiku) that judges safety from the conversation, so things run with almost no intervention.
- Key claims: Auto mode spends tokens and time per command on the safety check, so it's a bit slower; the classifier is imperfect (allows some unwanted actions like database migrations, freezes on some wanted ones like creating GitHub issues) but blocks most "always bad" things (e.g. rm -rf the filesystem) — "on the right side of OK"; the harness still checks `settings.json` before the classifier, so pre-allowing common commands bypasses it; set as default via config → "default permission mode".
- Learner-relevant: Decide whether auto mode's trade-off (token/time cost for hands-off operation) fits your workflow, and speed it up by keeping an allow-list in settings.json.

### Context Paranoia & Resetting Your Harness
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ae:327-486]]`
- Summary: Matt explains why the course insists on a clean harness: leftover bloat in the context window degrades every result, so he renames `.claude/settings.json` and the skills to `settings-backup.json` to restore defaults. Running `/context` shows ~23k tokens of built-in skills, project stuff, and claude.ai MCP tools before any real message; after the reset it's only 6.6k — 17k tokens recovered.
- Key claims: Context hygiene is about maximizing quality and the "smart zone," not min-maxing cost; token usage varies by harness — yours may differ; instructions exist for other harnesses and learners with stubborn bloat can ask in Discord; the course will not use your default config, so rename settings and skills to backups before continuing.
- Learner-relevant: Back up and reset `.claude` settings/skills, then use `/context` to see your baseline token usage and spot bloat.

### Removing Bloat From Your System Prompt
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ae:487-663]]`
- Summary: A step-by-step token-hygiene walkthrough in `.claude/settings.json`, restarting and re-checking `/context` after each change: disable claude.ai connectors (68.3k → 47k), disable workflows (→ 39k), disable bundled skills (→ 37k), disable artifacts (→ 33k), deny unused tools (notebook edit, design system sync, cron, plan-mode toggle, push notifications/remote trigger, report findings, wake-up scheduling → 21.6k), and remove the long `ask user question` tool (→ under 20k).
- Key claims: Every setting that stays in the system prompt affects every subsequent request, so anything you won't use is pure waste; denying tool access removes the tool definition from the prompt entirely; the demonstration is Claude Code-specific but the attitude — audit your system prompt for unused, token-eating entries — transfers to any harness; he invites learners to share harness-specific hacks on Discord.
- Learner-relevant: Audit your own agent config and strip unused MCP connectors, workflows, skills, artifacts, and tools, measuring the token savings with `/context` at each step.

### Showing Context Usage in the Status Line
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ae:664-733]]`
- Summary: Matt replaces the clunky copy-the-log loop with a live context counter: he pastes a copy-as-markdown setup article into the agent, grants permissions, and it adds a `status_line` command in `settings.json` that permanently shows the token count in the bottom status line (~11.7k tokens; a simple "summarize this" request bumps it to ~12k, ~300 tokens spent).
- Key claims: A status-line token counter makes context paranoia continuous rather than manual; the setup is quick and the counter updates live as the conversation grows; the status line is customizable but kept simple for the course.
- Learner-relevant: Set up an always-visible context counter in your agent's status line so you can watch token drain during every session.

### Statelessness & Exploration
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ae:734-857]]`
- Summary: Statelessness — the model remembering nothing — is the hardest constraint from the concept section, so every fresh session must explore, and exploration quality defines everything after. Using the request logger, Matt inspects what a fresh session is passed: platform (Linux/WSL), primary working directory, git-repo status, shell, assistant knowledge cutoff, current/main branch, git user, and recent commits — but crucially no listing of the filesystem, so the agent only knows the directory name and recent commit names.
- Key claims: The agent receives zero file-system information at session start, only environment and git metadata, so it must explore to learn the codebase; a good prompt exercise is asking the agent "what is the tech stack and intended purpose of this project?" and observing whether it spawns a sub-agent or reads files itself, then drilling in with follow-ups.
- Learner-relevant: Run the exploration exercise on the course repo and inspect request logs to see exactly what a fresh session does and doesn't know, learning how your harness explores.

### Exploration Demo: The Teach Skill
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ae:858-1044]]`
- Summary: Matt demos exploration on the actual course playground: the agent reads the readme and package.json (no sub-agent spawned) and then runs the "teach" skill. Teach builds a mission.md (goal: judge changes in a full-stack mini-Udemy app), learner notes.md, primary-source resources.md (React Router v7 docs), a shared asset library (styles.css, quiz components), a glossary, and the first HTML lesson explaining the app's routing — in the exact idiomatic React Router language, with callouts (the same component runs twice: server then browser), self-check quizzes, and an exercise ("Reading is not learning. Run the app and prove the boundary.").
- Key claims: The teach skill is stateful — it saves learning records/mission.md so you can clear context at any time and it resumes where you left off; it positions the agent as your teacher that knows your level and can take follow-up questions; the technique generalizes to any new repo: create a teaching workspace, tell it what you understand, and let it teach you (Matt used it to learn the Rubik's cube and nutrition); the skill will later serve as the example for the skills lesson.
- Learner-relevant: Become an "absolute expert" in the course playground via the teach skill before implementing features, and adopt the teach-skill approach for learning any new repository.

### Build: Course Review System (baseline)
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ae:1045-1128]]`
- Summary: The first real build starts: a course review system where students leave reviews on courses — log in as Emma Wilson, view her dashboard courses, and place a star rating (no written review for v1) that displays as a global per-course star rating for everyone. Matt deliberately withholds planning/technique for now so this acts as a baseline to improve on through the rest of the course.
- Key claims: The feature is meaty but well-scoped — it touches several codebase areas with a simple UI, so it makes a good baseline; the demo prompts the agent directly from what you want built; learners should observe with context paranoia (watch tokens tick up, note what drains context) and observe how their setup explores (sub-agent vs main window).
- Learner-relevant: Prompt your agent to build the star-rating feature, then watch context usage and exploration behavior to establish your personal baseline before techniques are taught.


### Plan mode: a buffer that still rushes
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_af:1-212]]`
- Summary: After a run where the agent explored, then immediately implemented with no verification or alignment, Matt shows Claude Code's plan mode — shift-tab to it, it explores, writes a `/plan` document, and the human reviews before continuing. But the plan reads exactly like the implementation: the agent still rushes to create an asset rather than align.
- Key claims: The rush to produce an asset (premature completion) is a sycophantic trait of agents — tell it to build and it builds, without stopping to confirm alignment; on simple features the failure mode ("built the wrong thing") is tolerable, on complex ones it matters a lot; the missing piece is the "design concept" from Frederick P. Brooks' *The Design of Design* — not an asset but a shared understanding that sharpens through conversation (the book itself "just okay," the idea excellent).
- Learner-relevant: The learner can recognize plan mode as a step forward but still just an asset-producing buffer, and understand why an alignment phase is needed before implementation.

### Grilling: eliciting alignment before work begins
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_af:213-693]]`
- Summary: Matt builds a lesson-comments feature using the grilling skill. The agent explores the codebase in the background (non-blocking) and returns rounds of questions (~40 total) covering both the what and the why; Matt dictates answers, agreeing with most recommendations but overriding several (comments confidential to the course, gating to enrolled students, one comments table with an instructor badge).
- Key claims: Decisions agreed for V1 — comments for Q&A/support with a bit of community; nice empty state that encourages commenting; one-level replies (with soft delete) rather than a flat list, after the agent surfaced a contradiction between flat-list and the unanswered-question queue; instructor/admin queue page listing unanswered threads, newest first; soft delete with editing allowed indefinitely; markdown renderer found to have no sanitization (raw HTML passes through), so student comments are sanitized with a restricted renderer; context stays cheap during grilling (only ~20k-33k tokens), leaving ~120k+ tokens of smart zone for the implementation, which churned 14m 28s and hit ~155k tokens.
- Key claims (cont.): QA on the result — posting/replying/editing/deleting comments, soft-deleted parent keeps its replies visible, instructor questions queue shows unanswered questions with inline reply — worked well, with minor visual bugs (both nav links active on the questions page, rough empty state); the author feels aligned, not cheated; grilling demands a lot of the user deliberately — it is an alignment technique that puts control back in the human's hands rather than disempowering them, and answers vary because agent behavior is non-deterministic.
- Learner-relevant: The learner can run a grilling session to elicit requirements (what + why), push back on the agent's recommendations, and enter implementation with a shared design concept that makes building feel trivial.

### Compaction: squeezing a session into a new one
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_af:694-970]]`
- Summary: At ~155k tokens (edge of the smart zone), continuing means slowly degraded results and more cost (every request resends history, cheap only because cached, and much of it is noise from file reads/writes). Clearing context is lossy — the agent loses the "why" behind the build and must re-explore. Compaction summarizes the current session (primary source) into a condensed summary (secondary source) that seeds a fresh session — like a sub-agent in reverse, done across sessions the user controls.
- Key claims: In Claude Code, `/compact` takes an optional summarization instruction (the summarizer is an LLM, so give it context on what matters); you can queue a message so work resumes the moment compaction finishes; compaction is harness-agnostic (also in claude.ai and ChatGPT); the compacted summary compresses ~150k tokens down to ~30k, retaining key files verbatim in context and storing others as file pointers; the historian analogy — primary source (the session record) vs secondary source (the lossy historical summary) — means compaction trades information for efficiency, and losing nuance is the price; a cast-iron use case is QA on a finished piece of work.
- Learner-relevant: The learner can use compaction to keep working inside the smart zone across long sessions and understand the information-versus-efficiency trade-off behind it.

### Handoff: a portable summary for other agents and directories
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_af:971-1128]]`
- Summary: Compaction can only work within the same directory and same agent — you can't use it to hand Claude Code work to Codex. Matt's handoff skill instead writes a portable `handoff.md` markdown file summarizing the conversation; because it's a file, you can feed it to Codex, another agent in another directory, send it to a colleague, or park an unrelated bug found mid-feature to fix later.
- Key claims: Handoff documents are saved to the OS temp directory by design — ephemeral, deleted when the OS clears it, not stored in memory; usage is `/handoff <purpose>` (e.g. "pass to codex to review") and the output reads like a detailed compacted document with file references; to use it, seed a fresh cleared session by referencing the temp file with `@temp/...` so it is read into context; handoff is more flexible but more fiddly than compaction — compaction remains better for staying in the same directory and for queuing messages after the compact, while handoff pays off when crossing agents, repos, or people.
- Learner-relevant: The learner can create a portable handoff artifact to move a session's context across harnesses, directories, or to colleagues, and choose between compaction and handoff by situation. (Chunk ends mid-lesson — a follow-up comparison continues in the next part.)


### Phase Boundaries: The Five Options and the Decision Tree
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ag:1-277]]`
- Summary: Coding sessions decompose into loosely defined phases (grilling → implementation → QA) separated by boundaries that are decision points. Matt presents five choices at a boundary — continue in the current session, clear the context, compact and seed a new session, hand off to a markdown file, or spawn a subagent — and walks through his decision tree: can you continue (enough smart-zone budget / rich primary source)? is the context disposable (then clear)? do you need a handoff (only to pass to another agent/directory/colleague)? can the task run AFK (then subagent)? Otherwise, compact as the default.
- Key claims: Clearing is the most efficient path (zero time, full smart zone) but only if the context is truly disposable — clearing loses both the implementation details and the reasoning behind earlier decisions; the handoff skill is narrow and only needed to pass work elsewhere; automated review is a canonical AFK-subagent pattern; the questions are partly subjective and involve taste.
- Learner-relevant: Given a session at a phase boundary, pick one of the five actions by walking the decision tree, and use this shared vocabulary when discussing decisions.

### Auto Compaction: Why the Harness Shouldn't Decide for You
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ag:277-480]]`
- Summary: Exceeding the model's context window (e.g. Opus 4.8's 1M tokens) yields an error, so every harness auto-compacts when you hit a buffer (Claude Code: settings → auto compact, default true; customizable in `~/.claw/settings.json`, e.g. compact after 250k tokens). While auto-compaction sounds like it removes the need to think about phase boundaries, compacting at a random point mid-phase is dangerous: agents lose their way, forget recent discussion, and split coding style across the compact.
- Key claims: Compacting in the middle of a phase is worse than at a phase boundary — especially in implementation, where the agent can forget features and change coding style mid-task; auto-compact gives you no chance to specify what to compact or the next session's intention, so the summarization note you pass to compact/handoff is critical; Matt prefers raising the human's skill over raising harness demands — hitting auto-compact usually means something is going wrong.
- Learner-relevant: Recognize the auto-compact buffer and why to avoid relying on it; consciously place compacts at phase boundaries and write an explicit summarization note for the next session.

### Steering Agents: Context Load and Push vs Point
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ag:481-714]]`
- Summary: Because every session starts stateless, steering is how you encode your conventions and gotchas across sessions. Any instruction loaded upfront is paid on every model provider request (tokens plus attention — "context load"), so steering means choosing which rules are worth the cost. There are two delivery modes: push (the instruction sits in context every session, always on — e.g. an agents.md file loaded at session start) and point (a one-line context pointer in context that pulls in the full instruction only when needed).
- Key claims: Push is always on and costly whether needed or not; agents often can't tell when pushed rules apply, producing absurd results (a PCI-DSS agent flagging security implications of a chocolate cake recipe); there is currently an "epidemic of pushing" huge claude.md/agents.md files that wastes tokens; pointing is cheaper — most turns a context pointer costs almost nothing — and Matt's default is to point and let the agent decide when to pull instructions in.
- Learner-relevant: Distinguish context load, push, and point; know that agents.md (claw.md in Claude Code) is the canonical pushed-steering mechanism, and understand why minimal pushed rules beat maximal ones.

### Practice: From Pushed agents.md to Doc + Pointer (seed/schema gotcha)
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ag:715-940]]`
- Summary: A hands-on lesson on the Crash Course project's non-obvious convention: every database schema change must also update `seed.ts` and reseed, or reseeding leaves data that mismatches the schema — knowledge not derivable from code, like onboarding a new teammate. Matt resets the branch to a state where agents.md (symlinked to claw.md) pushes a big migration checklist (edit schema → `npm run db generate` → update seed.ts → reseed → type-check → failure-mode checks), verifies in the request logger that it's injected into every request inside a system reminder, then refactors it: the detailed steps move to a file in `docs/`, and agents.md keeps only a context pointer to it, using the "writing for agents" skill.
- Key claims: Pushing the full migration checklist costs tokens on every request even for features/QA that never touch the database; the system reminder notes the context "may or may not be relevant" — Anthropic's guard against the chocolate-cake problem, and a reason pushed instructions aren't always followed; the doc + pointer pattern keeps the information reachable while cutting steady-state context load.
- Learner-relevant: Refactor a large pushed instructions file into a docs file plus a context pointer in agents.md, and confirm the agent actually pulls in the doc to perform a migration.

### Skills: A Portable Doc + Pointer
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ag:941-1125]]`
- Summary: Skills solve the portability wall of the repo-local doc + pointer pattern. A skill is the same pointer-to-document setup, packaged and standardized into a self-contained folder: a `skill.md` document whose name and description act as the context pointer (only description + name sit in the parent context by default), with the rest pulled in on invocation. Skills are an open standard (agentskills.io), portable across harnesses, and can bundle many files — e.g. writing-for-agents points to a `skill mechanics` reference from within its skill.md.
- Key claims: Skills invoke two ways — model-invoked (description visible in context, adding context load) or user-invoked (e.g. handoff with `disable model invocation: true`, zero context load but higher cognitive load on the user); more model-invoked skills raise context load, more user-invoked skills raise what you must remember; `skills` lists what's in your context window; Matt keeps many skills user-invoked because free (no context load) is appealing.
- Learner-relevant: Explain what a skill is (packaged doc + pointer), distinguish model-invoked from user-invoked skills and their trade-offs, and see why portability makes skills valuable to share.

### Building Your First Skill (opening)
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ag:1126-1128]]`
- Summary: Lesson begins — "Let's make our first skill," the same as the doc + pointer pattern built earlier; it is cut off at the start of the build and continues in the next chunk.
- Key claims: The upcoming skill reuses the doc + pointer pattern from earlier in the chunk.
- Learner-relevant: Set up for the next lesson's hands-on skill construction.


### Turning a doc into a portable skill
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ah:1-37]]`
- Summary: Exercise briefing — take an existing doc that sits behind a pointer and convert it into a portable skill that can be sent to colleagues. The known skill name is "database migrations"; the pointer's text becomes the skill's description.
- Key claims: The conversion can be done by hand or via the writing-for-agents skill; send a dummy request to establish a baseline before the skill is added, then make another schema change to verify the skill is invoked at the right time.
- Learner-relevant: After this lesson, the learner can package a reusable procedure as a portable skill and test when the agent actually invokes it.

### User-level vs project-level skills
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ah:38-101]]`
- Summary: Skills live at two levels. User-level skills sit in a `.claude`/`.agents` skills folder, are personal and follow you across every project on the machine. Project-level skills are checked into the repo, scoped to one project, and automatically shared with everyone who clones it.
- Key claims: Personal quality-of-life rules and shortcuts belong in the user directory; anything the team relies on or that encodes how the project is meant to be worked belongs in the project; project is the stronger default — if you work solo, user level is more convenient, but with a team, project level wins because everyone contributes and the skill grows with the project.
- Learner-relevant: The learner can decide where to store a skill based on whether it is personal or team-shared.

### Navigation pointers: helping agents explore your codebase
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ah:102-308]]`
- Summary: Without pointers, an agent explores your repo like local roads — scanning directories, opening files one at a time, searching — and every exploration step adds files/tool calls to context. Navigation pointers are like highways: short pointers inside `agents.md` that route the agent straight to important files. Demonstrated by adding a pointer to the database seed script, which the agent kept ignoring.
- Key claims: Use pointers only where the agent finds discovery hard (e.g. a skills repo requiring entries in a manifest, a top-level README, and a bucket list); pointers go stale, so fewer pointers means less maintenance — a stale highway is worse than none because the agent trusts it, wastes tokens on bad info, and gets confused; `@file` mentions are just one-off navigation pointers pushed directly into the context window.
- Learner-relevant: The learner can add navigation pointers to `agents.md` for files with non-obvious dependencies, and keep them pruned as the structure changes.

### Pruning steering files: duplication, sediment, no-ops
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ah:309-490]]`
- Summary: Steering files only grow — every rule goes in for a reason and none leave, because adding feels cheap/safe while removing feels like stamping on someone's work. The fix is three pruning tests: single source of truth (no duplication), sediment (rules once true but not now), and no-ops (instructions that change nothing).
- Key claims: Duplication costs in three ways — maintenance (change in multiple places), context load, and weighting (duplicated info drowns out important non-duplicated info); sediment is a psychological problem that makes `agents.md` irrelevant to more tasks and is dangerous because it was once correct; a no-op is removed by deleting it and checking whether behaviour changed — instructions can be perfectly relevant yet still no-ops; anything failing the three tests isn't earning its place in the context window.
- Learner-relevant: The learner can run the three tests over any steering file and prune it to reduce context load and improve steering quality.

### Exercise: pruning an auto-generated steering file
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ah:491-573]]`
- Summary: Shows one of the worst ways to generate a steering doc — `claude init`, which scans the repo and writes a huge `CLAUDE.md` (~172 lines, ~4,000 tokens) by having the agent steer itself. The exercise is to prune it: read through, find the no-ops and duplication (both within the file and to easily-reachable content), then use the writing-for-agents skill to slim it down.
- Key claims: No sediment is expected since no time has passed; for anything to remove you can delete it, put it behind a pointer, or put it behind a skill; the goal is a very small file that is really just a set of pointers.
- Learner-relevant: The learner can audit an auto-generated steering file and reduce its token footprint using the delete/pointer/skill choices.

### Auto-memory: when the agent steers itself
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ah:574-664]]`
- Summary: The final source of steering is the one the agent writes for itself — most harnesses ship a memory system that records corrections, preferences, and facts into local files read back into later context windows. In Claude Code this is viewable via `memory`, with auto-memory storing a `memory.md`.
- Key claims: Auto-memory is "auto-sediment" — stale layers the agent rarely removes, building useless sediment in the context window; the author recommends turning auto-memory off (likely also reducing context load since the memory tool disappears); the user, not the agent, should be in control of how memories and steering are created.
- Learner-relevant: The learner can decide whether to disable auto-memory to keep the context window lean and keep steering human-controlled.

### Shipping large work: specs and tickets across context windows
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ah:665-750]]`
- Summary: Tasks that outgrow the "smart zone" (the early, reliable part of the context window) — refactors touching every layer, or work obviously too big for one window — are shipped by breaking the big task into small chunks, each fitting in the smart zone. The approach relies on two documents: a spec (the destination) and tickets (one per piece of work per session).
- Key claims: One ticket per piece of work you want to fit into a smart zone, forming an implementation plan for the spec; this approach scales to ambitious work — enormous specs with 30 tickets have succeeded; the section aims to teach using specs and tickets to ship larger projects than previously conceivable.
- Learner-relevant: The learner can plan multi-session agent work by writing a destination spec plus per-session tickets.

### Storing specs and tickets in an issue tracker
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ah:751-949]]`
- Summary: Both specs and tickets live outside the repo in an issue tracker — recommended because it coordinates work across teams and an agent can read from the same tracker you contribute to. The course uses GitHub (via GitHub CLI) but the concepts apply to Jira, Linear, Todoist, etc.
- Key claims: The author schedules all agent work via GitHub issues (1,200 closed, 28 open on his main repo); learners fork the repo with `npx aihero cli fork` to get a private repo with their own issues; running `npm run reset` + the setup-matpocock-skills skill adds issue-tracker config locally (built-in GitHub and GitLab support) and writes a navigation pointer into `agents.md` pointing to where issues/PRDs live.
- Learner-relevant: The learner can set up GitHub as an issue tracker for specs/tickets and verify the agent reads and writes issues through the GitHub CLI.

### Creating a spec with the to-spec skill
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ah:950-1128]]`
- Summary: The `to-spec` skill takes the current conversation and codebase understanding and produces a spec — it expects a grilling session has already happened, not that it should grill you. The process: grilling session → spec → tickets → implement each ticket → review against the spec.
- Key claims: The spec template includes a problem statement, solution, and user stories — meaty enough that the implementer agent gets a strong information injection; the generated 10 tickets were judged too many (budgeting ~1.5M tokens vs. a ~450k maximum, roughly three tickets) — a human judgment call because agents persistently do horizontal slicing; tickets can declare blocking relationships (e.g. ticket 4 blocked by 2) enabling parallel fan-out in separate context windows; tickets are intentionally light because the parent spec carries the detail, and explicit acceptance criteria give the agent a place to stop.
- Learner-relevant: The learner can generate a spec from a grilled conversation, right-size the ticket breakdown, and read tickets that reference a parent spec with clear acceptance criteria.


### Tickets exercise wrap-up
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ai:1-12]]`
- Summary: Brief closing of the previous lesson on splitting a spec into tickets — the point of splitting is to enable working on pieces. The instructor invites learners to report whether they created the same tickets, spotted vertical slices, or hit horizontal slicing.
- Key claims: Tickets are the vehicle that lets a spec be worked on piece by piece; vertical slicing (tickets building on each other) is the goal, horizontal slicing is a problem worth surfacing.
- Learner-relevant: The learner knows what to compare against when validating their own ticket breakdown.

### Implementing the tickets: the full loop
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ai:13-672]]`
- Summary: A long, live demonstration of running `implement` on each issue in sequence — the agent reads the issue, explores the codebase, writes code, runs tests/type checks, and then automatically chains a model-invokable code-review skill (standards + spec review in fresh sub-agent context windows) before the next ticket. Includes demo detail: seed scripts, database migrations, red-green test loops, review findings, and a final QA pass in the dev UI.
- Key claims: Auto mode lets the agent run with a classifier checking permission requests, so you can leave it and check back; code review runs in its own "smart zone" sub-agents, so it isn't degraded by a 113k-token context window; clear vs compact — the author mostly clears (cheaper, faster; compact spends output tokens writing a summary and gives little benefit), and when it's 50/50 you should clear; the reviews catch real deviations from spec (e.g. client-side filtering instead of server-side, a suppressed "never enrolled" case, tautological tests); feedback loops matter — type checking and tests give deterministic feedback, but a running UI needs something like Chrome's DevTools MCP or agent-browser, and what lacks a feedback loop (e.g. visual UI polish) tends to come out rougher; navigation pointers pay off by cutting exploration tokens, making clearing viable.
- Key claims (cont.): Token counts are large (each implementation ~100k–140k output tokens; the seed script alone ~20k+); verification loops "absolutely eat tokens," which is why tasks must be right-sized; tasks that blow up to 300k tokens are chalked up as learning experiences and fed back into skills; a large context window is a safety net even when a task is mis-sized.
- Learner-relevant: The learner can run a multi-ticket implementation with auto mode, chain an automatic code review, choose clear over compact, and QA the result — while using the time to do other work.

### What to do with your specs after implementation
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ai:673-808]]`
- Summary: The answer to "what do I do with my spec once it's in code?" — close and archive it. A spec is a condensed, secondary-source projection of how the code works, and codebases drift away from specs, so leaving specs in the repo is dangerous: the agent will trust the smaller, easier-to-explore stale secondary source over the primary source.
- Key claims: Keep specs in the issue tracker (closed/archived issues) rather than local markdown — archived issues are reviewable, commentable, findable by the team, durable across work trees/laptops, and still explorable by the agent if it needs implementation intent; the executable parts of the codebase don't lie about themselves; spec-driven development (specs as source of truth) is rejected because of the drift risk.
- Learner-relevant: The learner can decide to archive finished specs in the tracker and keep the repo free of stale spec files.

### Changing direction mid-flow
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ai:809-898]]`
- Summary: What to do when, halfway through implementing tickets, you realize the approach is wrong. Because tickets are disposable and the spec is editable, the recipe is: delete the not-yet-implemented tickets, re-grill (edit) the spec — probably in a new grilling session — then regenerate tickets from the new destination.
- Key claims: The spec is the destination and you are changing the destination; tickets are totally disposable, so you keep the spec and throw away/replace the tickets; this two-document design (spec + tickets) is exactly why the flow stays simple; you don't throw away your work unless it's really bad, you continue from where you are.
- Learner-relevant: The learner knows how to recover cleanly from a mid-project direction change without losing progress.

### Code review and coding standards
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ai:899-1094]]`
- Summary: Explains the code-review step of the implement skill: three levels of checks before shipping — deterministic automated checks (lint, type checking, unit tests) that cost no tokens, automated agent review for qualitative feedback (which doesn't replace, but eases, human review), and the human sanity check on top. Also covers the customizable `coding-standards.md` the review skill reads.
- Key claims: Code review is less constrained than implement (no exploration, few changes, tests already written), so it has plenty of context-window space to load coding standards — that's the right place to steer the agent rather than making the implementer get it right first time; the skill ships default code smells from Martin Fowler's Refactoring (feature envy, shotgun surgery, divergent change), so it catches things even without a standards file; when you notice the agent doing something you dislike, add it to `coding-standards.md` and the reviewer catches it next time (e.g. context-menu items needing a leading icon, test files not in app routes).
- Learner-relevant: The learner can maintain a per-repo coding-standards file that encodes their team's rules and have the automated reviewer enforce them.

### Course wrap-up and next steps
- Locator: `[[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ai:1095-1198]]`
- Summary: Final recap of the course's core five-step process — grilling the idea, creating a spec, creating tickets, implementing the tickets, and reviewing — framed as the essential way the instructor builds software. The author argues this shape will persist even as workflows (e.g. AFK loops) evolve.
- Key claims: Grill aligns you with the AI before the spec; tickets split work to parallelize or fit the smart zone; the final review catches things impossible during implementation; next steps include delegating implementation to an AFK (away-from-keyboard) loop, using prototyping/research in ideation, the AI coding dictionary, the open-source Sandcastle project (AFK agents in isolated sandboxes), and Wayfinder for skills development.
- Learner-relevant: The learner has a complete mental model of the five-step agentic workflow and knows where to go next (Discord community, AI Hero cohorts, deeper skills) to practice and extend it.

