---
source: 第4节：选型力：看懂 AI 编程工具的七层架构
source_type: pdf
source_lines: 346
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第4节：选型力：看懂 AI 编程工具的七层架构

## Overview (L1)

- Tool overload — The problem isn't too many tools (Cursor, Claude Code, Codex, MCP, CLAUDE.md…), it is having no clear cognitive map (认知地图) to anchor them.
- Attitude — "Using AI well" ≠ "knowing more AI tricks"; go result-oriented (problem first) not means-oriented (tool coolness).
- Core — The seven-layer architecture (七层架构) from model at the bottom to methodology at the top; every tool can be located on it.
- Selection triage — Three questions for any new tool: which layer, what problem, do you need it now — filters ~95% of noise.
- Practice — Use the seven layers together within one task; the bootcamp's tool stack and how it maps into four projects.

## Sections (L2)

### 工具太多，越学越焦虑
- Locator: `[[sources/geek-ai-agent/20260922/第4节：选型力：看懂 AI 编程工具的七层架构.pdf#工具太多越学越焦虑]]`
- Summary: Lists the flood of tools and configs, then diagnoses the real problem as a missing cognitive map.
- Key claims: Cursor/Claude Code/Codex/Copilot/Windsurf/Cline/Devin/Aider/Trae/通义灵码, plus Spec-Kit/OpenSpec/MCP/CLAUDE.md/AGENTS.md/Skills/Subagents/Hooks/Plan Mode/Agent SDK; without anchors, more learning means more chaos and anxiety.
- Learner-relevant: Names the learner's pain point and creates demand for a classification framework.

### 态度：本质不是工具，是怎么用好工具
- Locator: `[[sources/geek-ai-agent/20260922/第4节：选型力：看懂 AI 编程工具的七层架构.pdf#态度-本质不是工具]]`
- Summary: Contrasts means-oriented tool collecting with result-oriented purpose+tool selection.
- Key claims: "high-end usages" are endless and mostly irrelevant to your scenario; polishing a basic workflow beats chasing novelty; novelty gives attention, fundamentals give capability and assets.
- Learner-relevant: Establishes the anti-FOMO stance needed before learning any tool.

### 核心：七层架构
- Locator: `[[sources/geek-ai-agent/20260922/第4节：选型力：看懂 AI 编程工具的七层架构.pdf#核心-七层架构]]`
- Summary: Seven layers, bottom-up: 1 model (Claude/GPT/Gemini/open models), 2 tool (Claude Code/Cursor/SDK), 3 config & constraint (CLAUDE.md/Skills/Permission/Hooks), 4 collaboration (Subagents/Worktrees/Plan Mode), 5 protocol & ecosystem (MCP, gh CLI), 6 workflow (Headless/CI-CD/event-triggered), 7 methodology (SDD/Harness/Vibe Coding).
- Key claims: layers are not used in sequence but invoked simultaneously within one task; that simultaneous-invocation ability is "engineering sense" (工程感).
- Learner-relevant: The central classification anchor reused by the market-observation material.

### 工具总览·下三层与上四层
- Locator: `[[sources/geek-ai-agent/20260922/第4节：选型力：看懂 AI 编程工具的七层架构.pdf#工具总览]]`
- Summary: Lower three layers are daily, highest-noise, most surface-level; upper four separate serious engineers and carry bigger leverage.
- Key claims: "I use Claude" is model layer while "I use Cursor" is tool layer — different dimensions; tool layer's three forms are IDE-embedded, terminal CLI, SDK, complementary not substitutes; config layer determines whether you are an "AI programming user" or an "AI programming engineer"; upper layers scale from "one AI" to "an automated system."
- Learner-relevant: Teaches the learner to locate their current level and where leverage increases.

### 新工具来了，只问三件事
- Locator: `[[sources/geek-ai-agent/20260922/第4节：选型力：看懂 AI 编程工具的七层架构.pdf#新工具三问]]`
- Summary: Triage questions: which layer, what problem does it solve, do you need it now.
- Key claims: most "new tools" are just another tool-layer plugin or config-layer constraint; if you can't state a concrete difference from existing tools, it's likely marketing; if your scenario doesn't need it, it has negative value; stay alert only to structural changes like MCP and SDD.
- Learner-relevant: A reusable, teachable decision filter for the learner's own tool evaluations.

### 训练营的工具栈 & 四项目用法
- Locator: `[[sources/geek-ai-agent/20260922/第4节：选型力：看懂 AI 编程工具的七层架构.pdf#训练营工具栈]]`
- Summary: The bootcamp picks one mature tool per layer and embeds usage in problems across four projects.
- Key claims: model layer Claude; tool layer Claude Code + Cursor; config layer CLAUDE.md/Skills/Hooks; collaboration Subagents/Plan Mode; protocol MCP; methodology SDD (Spec-Kit) + Harness; When uses SDD for spec alignment, DifyPro uses Subagents to parallel-read 100k unfamiliar lines, OryxOS uses Skills to codify team conventions, mq9 uses AI to reverse-engineer a Rust project.
- Learner-relevant: Shows concretely how each layer maps to a real project scenario; a model for practice design.
