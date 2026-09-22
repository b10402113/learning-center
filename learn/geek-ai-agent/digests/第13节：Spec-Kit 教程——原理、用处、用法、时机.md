---
source: 第13节：Spec-Kit 教程——原理、用处、用法、时机
source_type: pdf
source_lines: 381
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第13节：Spec-Kit 教程——原理、用处、用法、时机

## Overview (L1)

- 教程 framing — Spec-Kit is not an AI agent but a workflow layer wrapped over an agent; one CLI + one slash-command set supporting 20+ agents (Claude Code, Copilot, Cursor). The lecture explains four things: principle, value, usage, timing.
- Background: why SDD — "vibe coding" (给 AI 模糊需求、直接生成代码) breaks on large projects via requirement drift (需求漂移), architecture loss of control (架构失控), hard rollback (回退困难), and poor collaboration; prompt alone is insufficient, a structured requirement layer (SDD) is needed.
- Principle — spec-as-source: spec.md is the single source; plan.md → tasks.md → code all derive from it, and any spec change regenerates everything downstream. Three pillars: constitution (project constitution), a 4-phase closed loop, and analyze (anti-drift). Artifacts: constitution.md, spec.md, plan.md, tasks.md.
- What it is good for — turns "thinking clearly" into a formal artifact: controls vibe coding, forms a contract between human and AI, gives traceability/auditability, and supports long-term evolution. No SDD = the same problem as no version control.
- How to use — `specify init` plus a `/speckit.` command family: 6 core commands (constitution, specify, plan, tasks, taskstoissues, implement) and 3 optional ones (clarify, analyze, checklist); a no-shortcut pipeline ending in human review + commit.
- When to use — it is a "heavy weapon": great for medium/large greenfield projects with clear requirements and agent-led development, poor for small features, fast prototypes, large brownfield rewrites (context limits), exploratory work, and personal experiments.
- Hands-on — install Spec-Kit, write a constitution, and run specify → plan → tasks before class; next lecture demos what the decomposed task list looks like.

## Sections (L2)

### 教程：这节讲清楚四件事

- Locator: `[[sources/geek-ai-agent/20260922/第13节：Spec-Kit 教程——原理、用处、用法、时机.pdf#教程]]`
- Summary: Frames the tool as a workflow layer over an AI agent (not an agent itself) and states the lesson's four-part agenda.
- Key claims: Spec-Kit is a workflow layer, not an AI agent; one install works across Claude Code, Copilot, and Cursor; 20+ agents supported.
- Learner-relevant: Establishes the mental model — SDD tools constrain an agent's process rather than add model capability.

### 背景：为什么需要 SDD

- Locator: `[[sources/geek-ai-agent/20260922/第13节：Spec-Kit 教程——原理、用处、用法、时机.pdf#背景]]`
- Summary: Explains why vague prompting fails at scale and motivates a structured requirement layer.
- Key claims: Four failure modes — requirement drift, architecture loss of control, hard rollback, uncoordinated collaboration; prompt engineering alone is not enough; SDD is the structured requirement layer.
- Learner-relevant: Gives the "why" anchor for SDD before any tool mechanics.

### 原理：spec-as-source 与三大支柱

- Locator: `[[sources/geek-ai-agent/20260922/第13节：Spec-Kit 教程——原理、用处、用法、时机.pdf#原理]]`
- Summary: Explains spec-as-source derivation (spec → plan → tasks → code) and the three design pillars, then shows the four generated artifacts.
- Key claims: The spec is the single source of truth, versioned with code, not chat history; pillar one is the constitution, pillar two is the 4-phase closed loop, pillar three is analyze anti-drift; artifacts are constitution.md, spec.md, plan.md, tasks.md.
- Learner-relevant: Core SDD concepts — spec-as-source, constitution, phase gating, and cross-artifact consistency checking.

### 有什么用：从作坊到工程

- Locator: `[[sources/geek-ai-agent/20260922/第13节：Spec-Kit 教程——原理、用处、用法、时机.pdf#有什么用]]`
- Summary: Lists the four business values of turning "thinking clearly" into formal artifacts.
- Key claims: Controls unrestrained vibe coding; forms a contract between human and AI; persists decisions for audit; keeps long-term projects from losing context; no-SDD AI coding equals no-version-control programming.
- Learner-relevant: Value framing for judging when a formal spec artifact pays off.

### 怎么用：安装、命令体系、工作流

- Locator: `[[sources/geek-ai-agent/20260922/第13节：Spec-Kit 教程——原理、用处、用法、时机.pdf#怎么用]]`
- Summary: Covers `specify init`, the `/speckit.` command set, the typical no-shortcut workflow, and real input/output of the two key commands.
- Key claims: 6 core commands + 3 optional commands; workflow is init/constitution → specify → (clarify) → plan → tasks → (analyze) → implement → review & commit; `/speckit.specify` turns a rough request into an ~800-line spec.md with user stories, acceptance criteria, and non-goals.
- Learner-relevant: Practical command literacy and the review-at-each-task discipline.

### 什么时候用：重武器与适用边界

- Locator: `[[sources/geek-ai-agent/20260922/第13节：Spec-Kit 教程——原理、用处、用法、时机.pdf#什么时候用]]`
- Summary: Positions Spec-Kit as a heavy weapon and lists fit vs. unfit scenarios.
- Key claims: Fits medium/large greenfield projects with clear requirements, agent-led development, and teams learning SDD; unfit for small features, single-file changes, large brownfield rewrites, exploratory research, and personal experiments.
- Learner-relevant: Tool-selection judgment — match the tool to the nature of the work.

### 上手：课前动手跑一遍

- Locator: `[[sources/geek-ai-agent/20260922/第13节：Spec-Kit 教程——原理、用处、用法、时机.pdf#上手]]`
- Summary: Three-step hands-on: install Spec-Kit, write a constitution, run specify → plan → tasks.
- Key claims: No need to memorize commands — install once and run once to internalize the concepts; next lecture demos the decomposed tasks.
- Learner-relevant: Concrete pre-class exercise to make the SDD concepts concrete.
