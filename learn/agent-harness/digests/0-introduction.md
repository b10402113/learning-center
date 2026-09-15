---
source: 0-introduction
source_type: pdf
source_lines: 407
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 0-introduction

## Overview (L1)

- Course framing and motivation — Introduces "harness engineering" as the next progression after courses focused on the agent itself; the harness is the agent-agnostic environment that lets any agent thrive, drawing on backend, database, and distributed-computing concepts.
- What the harness inspector demonstrates — A walkthrough of the target app: a chat agent pane plus an event-stream inspector showing tool calls, handoffs between sub-agents, a sandboxed "Run Code" tool, durability, and a supervised swarming-plan mode.
- Build vs. buy: Claude Code and programmatic agents — Q&A on when to use an existing coding harness (Claude Code/Codex) versus writing a programmatic agent with an SDK, especially for enterprise/production and non-coding use cases.
- Repo setup and course logistics — Cloning the `Hendrixer/harness-engineering` repo, the lesson-branch convention (solution lives on the next branch), Node and LLM-provider requirements, and the `npm run docs` markdown lessons for human/AI follow-along.

## Sections (L2)

### course-framing-and-motivation

- Locator: `[[sources/agent-harness/20260915/0-introduction.txt#course-framing-and-motivation]]`
- Summary: Scott Moss frames this course as a shift from teaching how to build an agent to teaching how to build the environment an agent runs in. He defines the harness as agent-agnostic and often meaningless in isolation, but decisive when wrapped around an agent.
- Key claims: The harness is the thing that makes an agent reliable and dependable, and it is agent-agnostic; previous courses focused on the agent, this one focuses on the environment; the course spans backend, database interaction, and distributed computing; the agent used here is intentionally boring with mocked tools.
- Learner-relevant: Establishes the course's core thesis and positions the learner to separate agent design from harness design before any code is written.

### harness-inspector-demo

- Locator: `[[sources/agent-harness/20260915/0-introduction.txt#harness-inspector-demo]]`
- Summary: A live demo of the finished app — the "harness inspector" — with an agent chat pane on the left and a real-time event-stream inspector on the right. It shows a triage agent completing customer tasks by planning, escalating, and using tools.
- Key claims: The demo shows tool calls, a handoff to a specialized (e.g. billing) agent with a recorded reason, a sandboxed Run Code tool for accurate arithmetic, and supervision mode where a swarm of persona sub-agents collaboratively builds a plan; the harness provides sandboxing, handoffs, sub-agents, approvals, planning, and durability; stopping the agent mid-thought lets it resume where it left off even if the server restarted; every event is inspectable; no UI work is required in this course.
- Learner-relevant: Gives learners a concrete end-state and the vocabulary (tool calls, handoff, approval, durability, event stream) they will implement piece by piece.

### claude-code-vs-programmatic-agents

- Locator: `[[sources/agent-harness/20260915/0-introduction.txt#claude-code-vs-programmatic-agents]]`
- Summary: In response to an enterprise/Jira-triaging question, Scott contrasts prebuilt coding harnesses like Claude Code with programmatic agents built on an SDK/API. Coding-agent harnesses win when the task needs a computer (Bash, filesystem, terminal, repo); programmatic agents win for production, non-coding, multi-user products.
- Key claims: If the work is code-related and needs machine access, use a coding agent rather than building one; Claude Code's harness is fixed, so the only levers are prompts, skills, and MCP servers (all just context); Claude Code is best for writing code, data analysis, and prototyping; for production you likely need a programmatic agent because prebuilt harnesses are too generic, their prompts are hard to eval, and you cannot enforce deterministic workflows; if a product with many users, build a programmatic agent.
- Learner-relevant: A reusable decision framework for choosing between an off-the-shelf harness and a custom one, anchoring the "why build this ourselves" motivation.

### repo-setup-and-dependencies

- Locator: `[[sources/agent-harness/20260915/0-introduction.txt#repo-setup-and-dependencies]]`
- Summary: Instructions to clone the course repo and understand its branch convention and environment requirements. The instructor explains how lessons map to branches and how to catch up with the material.
- Key claims: Repo is `Hendrixer/harness-engineering`; each lesson has its own branch that is the lesson's starting point, and the solution to lesson N is on the lesson N+1 branch; `main` or `complete` holds the final solution; seven lessons total; use Node over 20 (instructor uses 24.3); an OpenAI-API-compatible LLM provider is required; a remote database is provided with no setup needed; run `npm install`, then `npm run docs` to serve the lesson notes; lessons are markdown files in the repo so an AI can read them, including per-lesson diffs.
- Learner-relevant: Equips learners to set up the environment correctly and know all the fallback ways to catch up if they fall behind.
