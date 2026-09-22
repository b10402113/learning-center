---
source: 第7节：工作流设计力：用 AI 跑通企业级大项目
source_type: pdf
source_lines: 350
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第7节：工作流设计力：用 AI 跑通企业级大项目

## Overview (L1)

- Theme: workflow design as the moat — Tools will go stale; your workflow is yours. Defines a workflow as the entire pipeline from fuzzy requirement to production, and argues it — not tool choice — determines productivity.
- What a workflow is — Six things must be clear: stage outputs, human responsibilities, AI responsibilities, feedback loops, exception handling, and experience accumulation.
- Six-stage large-project workflow — Requirements → Design → Development → Testing → Deployment → Operations, every stage "human + AI jointly running", AI executes and the human gates.
- Three enablers — Outputs readable by AI (specs, CLAUDE.md, Skills, Hooks), human+AI division of labor, and automated feedback (Hooks intercept errors in seconds).
- Real sample & leverage — Bun's 6-day / 960k-line Zig→Rust migration by Sumner; same tool (Claude Code) can differ 10x based on workflow.
- Building your own workflow — A transferable bottom pattern (understand → constrain → verify → accumulate) plus personal assets; earned through four real projects, not taught.
- How to cultivate it — Four prerequisites (cognition, methodology, tools, practice) and three actions per project (run the full workflow, ask "why" at each decision, ask "what did I accumulate").

## Sections (L2)

### what-is-workflow

- Locator: `[[sources/geek-ai-agent/20260922/第7节：工作流设计力：用 AI 跑通企业级大项目.pdf#what-is-workflow]]`
- Summary: Defines workflow as the full process from fuzzy requirement to production, decomposable into six components (stage outputs, human duties, AI duties, feedback loop, exception handling, experience accumulation).
- Key claims: A workflow is a system, not a set of scattered actions; it stabilizes only when all six components are explicit.
- Learner-relevant: Provides the six-part checklist to make a workflow runnable.

### six-stage-pipeline

- Locator: `[[sources/geek-ai-agent/20260922/第7节：工作流设计力：用 AI 跑通企业级大项目.pdf#six-stage-pipeline]]`
- Summary: Lays out the six-stage end-to-end pipeline (requirements, design, development, testing, deployment, operations) with AI's and the human's roles per stage.
- Key claims: No stage is fully AI-automated nor purely manual — human and AI are always both present; AI expands dimensions / draws architecture / writes code / builds cases / writes scripts / reads logs, while the human sets boundaries, decides architecture, reviews key code, sets acceptance criteria, controls release pace, and makes final judgments.
- Learner-relevant: The reference map for structuring any large AI-assisted project.

### three-enablers

- Locator: `[[sources/geek-ai-agent/20260922/第7节：工作流设计力：用 AI 跑通企业级大项目.pdf#three-enablers]]`
- Summary: Names three "transmission devices" that make a workflow run: artifacts with two readers, human+AI division, and automated feedback.
- Key claims: Outputs go from "only for humans" to "also for AI" (Spec, CLAUDE.md, Skills, Hooks); you no longer do everything but decide what to delegate, what to decide, and what to double-check; feedback moves from "human finds problems" to "machine intercepts" via Hooks.
- Learner-relevant: Explains the mechanism that converts solo hard work into a self-running system.

### bun-case-study

- Locator: `[[sources/geek-ai-agent/20260922/第7节：工作流设计力：用 AI 跑通企业级大项目.pdf#bun-case-study]]`
- Summary: Bun's 6-day, 960k-line Zig→Rust migration succeeded because Sumner designed a collaboration workflow, not because AI wrote autonomously.
- Key claims: Not from scratch but a migration with full source and tests as verification; deep engineering prep (300 translation rules + smart-pointer abstraction); the human always in the loop for start/stop and merges; a passing test loop per segment with return-to-AI on failure.
- Learner-relevant: Evidence that a well-designed workflow lets large projects reach previously unthinkable efficiency.

### workflow-leverage

- Locator: `[[sources/geek-ai-agent/20260922/第7节：工作流设计力：用 AI 跑通企业级大项目.pdf#workflow-leverage]]`
- Summary: Contrasts poor vs. good workflow design on identical tooling to show a 10x output gap.
- Key claims: Poor design = 2 days of tug-of-war (requirements not thought through, AI guesses, prompt-rewrite loop, copying others' workflows that break on scenario change); good design = requirements clarified first, spec written, boundaries set, AI gets it in one shot, time saved goes to deeper thinking.
- Learner-relevant: Justifies investing in personal workflow as the real differentiator.

### personal-workflow

- Locator: `[[sources/geek-ai-agent/20260922/第7节：工作流设计力：用 AI 跑通企业级大项目.pdf#personal-workflow]]`
- Summary: Describes a personal workflow as a stable transferable pattern (understand → constrain → verify → accumulate) under a personal layer of accumulated assets.
- Key claims: The bottom pattern is cross-language and cross-project transferable; the upper layer (prompts, Skills, CLAUDE.md templates, checklists) is yours.
- Learner-relevant: Blueprint for constructing a portable personal workflow.

### cultivating-workflow

- Locator: `[[sources/geek-ai-agent/20260922/第7节：工作流设计力：用 AI 跑通企业级大项目.pdf#cultivating-workflow]]`
- Summary: Argues workflows are practiced, not studied, with four prerequisites and three concrete per-project actions.
- Key claims: Four prerequisites are cognition, methodology (SDD + Harness), tools (the seven-layer map), and continuous practice; three actions are run the full workflow without cutting corners, ask "why" at each key decision, and ask "what reusable asset did I accumulate"; each pass leaves local, capability, experience, and identity assets that compound.
- Learner-relevant: Gives the concrete practice regimen for growing workflow skill across projects.

## Sources

- `[[sources/geek-ai-agent/20260922/第7节：工作流设计力：用 AI 跑通企业级大项目.pdf]]`
