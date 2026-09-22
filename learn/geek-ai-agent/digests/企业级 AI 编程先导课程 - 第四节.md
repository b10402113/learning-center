---
source: 企业级 AI 编程先导课程 - 第四节
source_type: pdf
source_lines: 618
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 企业级 AI 编程先导课程 - 第四节

## Overview (L1)

- First mile of OryxOS — The first hands-on lesson: use Spec-Kit to convert requirements + technical design into AI-executable tasks, use Subagents to initialize the OryxOS skeleton in parallel, and build the open-source website.
- Spec-Kit — What it is, why it drives OryxOS (greenfield + clear requirements + AI-agent collaboration + methodology fit), and when not to use it (too heavy for small increments).
- Constitution and four-step flow — /constitution → /specify → /plan → /tasks, producing constitution.md, spec.md, plan.md, tasks.md.
- Constitution in practice — Six non-negotiable principles and what AI output looks like with vs without a constitution.
- Subagents parallel initialization — Four subagents initialize 11 Maven modules in parallel; each has a clean context, giving quality and ~4x speed.
- Open-source website — Why a project needs a public face and how VitePress + GitHub Pages gets one online in 30 minutes with AI.
- Deliverables and recap — constitution + full work package + compileable skeleton + live website; the four pre-course lessons recapped.

## Sections (L2)

### first-mile
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#first-mile]]`
- Summary: The session is OryxOS Day 1: Spec-Kit start (constitution + spec + plan + tasks), parallel subagent initialization of 11 modules in under 30 minutes, constitution.md practice, and building/deploying the open-source website.
- Key claims: by the end you hold something real and runnable; the Spec-Kit work package is "done once, governs three weeks."
- Learner-relevant: Sets concrete deliverables and expectation for the first hands-on session.

### spec-kit-intro
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#spec-kit-intro]]`
- Summary: Spec-Kit is GitHub's 2026 open-source spec-driven development toolchain (90,000+ stars) that converts requirements into a task format AI agents can directly consume, enforcing spec-first to prevent vibe-coding drift.
- Key claims: OryxOS already has complete requirements and technical design, so Spec-Kit's job is conversion, not rewriting; it suits medium-to-large greenfield projects (OryxOS = 11 Maven modules); it's too heavy for small increments, so use manual prompting there; requirements → specify input, technical design → plan input, requirements ch.3 + technical design §1.1 → constitution source.
- Learner-relevant: Explains when and why to use a spec-driven toolchain.

### four-step-flow
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#four-step-flow]]`
- Summary: The four commands and their outputs: /speckit.constitution → constitution.md (6 principles), /speckit.specify → spec.md (5 user stories US-1..US-5 with priorities), /speckit.plan → plan.md (11 Maven modules, key decisions, data flow, 3-week milestones), /speckit.tasks → tasks.md (1–2 files per task, parallelizable tasks marked, dependency-ordered, each task yields runnable code).
- Key claims: after these four steps the OryxOS 1.0 work package is ready; each subsequent AI-agent step sees only one task, so it won't drift.
- Learner-relevant: The exact mechanics of turning docs into tasks.

### constitution-concept
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#constitution-concept]]`
- Summary: constitution.md is an engineering charter AI actively references during implement — not a design doc for humans but a behavioral constraint. The lesson contrasts outputs without vs with a constitution.
- Key claims: without it, AI picks JDK 17, uses Spring AI's Agent abstraction, uses H2, implements only @Tool, and crams capabilities together, causing 2–3 hours of rework; with it, AI reads the charter first and gets it right the first time.
- Learner-relevant: Demonstrates why explicit hard constraints pay off immediately.

### constitution-principles
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#constitution-principles]]`
- Summary: Six non-negotiable principles, written once for the main build: (1) tech stack lock — JDK 21 + Spring Boot 3.x monolith, Maven multi-module, single binary, GraalVM deferred; (2) five core capabilities first; (3) ReAct loop self-implemented (<100 lines, no Spring AI Agent abstraction); (4) Plugin Tool three tiers mandatory, zero-code preferred; (5) storage fixed — SQLite + Spring Data JPA + MEMORY.md keyword retrieval, vectors deferred; (6) runnable over perfect.
- Key claims: if a principle is wrong, stop and discuss — the AI agent may not modify it unilaterally.
- Learner-relevant: The concrete constraint set governing the three-week build.

### subagents
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#subagents]]`
- Summary: Contrasts serial module initialization (growing main context, diluted attention, degrading quality) with 4 parallel subagents (clean independent contexts, stable quality, ~4x speed).
- Key claims: subagents prevent context pollution; the main agent aggregates results.
- Learner-relevant: Teaches the concrete value of context isolation when delegating to AI.

### subagent-division
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#subagent-division]]`
- Summary: The four-way module split: Subagent A → core + provider (ReActLoop/PromptBuilder/ToolExecutor/OryxTool/Session/Profile; ProviderService + function-calling adapter); B → memory + tool-builtin (MemoryService/MemoryTools; FileTools/ShellTools/HttpTools/SandboxChecker); C → tool-skill + tool-mcp (SkillLoader; McpClientService/McpToolAdapter); D → web + storage + cli + boot (WebServer + 6 controllers; SessionRepository; Picocli + Spring Boot fat JAR).
- Key claims: each subagent delivers module directory + pom.xml + core class skeletons + basic tests, with mvn compile passing.
- Learner-relevant: Shows a role-based parallelization strategy for large codebases.

### subagent-output
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#subagent-output]]`
- Summary: The actual results: all 11 modules compile with no dependency conflicts, core interfaces (OryxTool/Session/Profile/ReActLoop) defined, oryxos-boot produces a runnable fat JAR, and /speckit.analyze reports 0 constitution drift.
- Key claims: it's a real compileable Maven multi-module skeleton, not demo or toy code; this is the starting point for US-1..US-5.
- Learner-relevant: Defines the "definition of done" for parallel initialization.

### website-why
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#website-why]]`
- Summary: Why a project needs a public face: first impression (the first action is opening the Website link), documentation entry (What is / Quick Start / API Reference / deployment, Google-indexable), community trust (comparable sites: hermes-agent.nousresearch.com, openclaw.ai, docs.spring.io/spring-ai), and contributor entry (contribution guides, CONTRIBUTING.md, student PRs).
- Key claims: the website is the first public proof that "this project is serious."
- Learner-relevant: Connects engineering artifacts to open-source credibility.

### website-path
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#website-path]]`
- Summary: The technical path — VitePress + GitHub Pages, same as mq9.robustmq.com: write markdown, configure VitePress, local preview, GitHub Actions deploy, go live with a custom domain.
- Key claims: project structure includes website/index.md, .vitepress/config.mts, public SVG diagrams, docs/, and .github/workflows/deploy.yml; deployment takes ~2 minutes.
- Learner-relevant: A reusable template for any open-source project.

### website-structure
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#website-structure]]`
- Summary: The concrete site: nav (Home/Docs/Blogs/GitHub), a hero with the tagline "Enterprise Agent OS for Java Developers", three highlight cards (Java Native, Private, Extensible), a tech-stack logo row, and a Docs sidebar.
- Key claims: AI writes index.md + config.mts + three SVG architecture diagrams in 30 minutes.
- Learner-relevant: Shows the concrete output of an AI-generated website.

### website-ai-build
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#website-ai-build]]`
- Summary: The five-step AI build: let AI read the project, generate index.md, generate config.mts, generate architecture SVG, and deploy via GitHub Actions.
- Key claims: it isn't hand-writing markdown but AI generating content with humans reviewing and adjusting structure; the template replicates to any open-source project in 30 minutes.
- Learner-relevant: Demonstrates a fast, repeatable AI-assisted deliverable end to end.

### deliverables
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#deliverables]]`
- Summary: The four deliverables at session end: constitution.md (governs three weeks), spec.md + plan.md + tasks.md (ready-to-implement work package), the OryxOS Maven skeleton (11 modules compiling), and the live OryxOS website.
- Key claims: follow the constitution and the code won't drift; tasks are at 1–2 file granularity; you can share the website link at any time.
- Learner-relevant: A checklist of tangible outputs.

### recap
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#recap]]`
- Summary: Recaps all four pre-course lessons: lesson 1 (essence/tools/methodology, seven-layer architecture, SDD+Harness), lesson 2 (three-layer competitiveness, open source, Oryx community four projects), lesson 3 (Agent five components, OpenClaw vs Hermes, OryxOS positioning), lesson 4 (Spec-Kit work package, Subagents 11 modules, website live).
- Key claims: cognition map set, competitiveness direction clear, technical essence seen, code skeleton running, website face up — this is the high-value pre-investment before the ten real weeks.
- Learner-relevant: Closes the pre-course cognition groundwork and hands off to the main program.
