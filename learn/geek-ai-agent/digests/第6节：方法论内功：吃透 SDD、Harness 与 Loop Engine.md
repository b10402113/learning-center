---
source: 第6节：方法论内功：吃透 SDD、Harness 与 Loop Engine
source_type: pdf
source_lines: 409
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第6节：方法论内功：吃透 SDD、Harness 与 Loop Engine

## Overview (L1)

- Theme: three methodology pillars — Distinguishes real methodology from a sea of buzzwords (SDD, Harness, Vibe Coding, Context Engineering, ReAct/TAO, TDD, Plan-then-Execute, AI-First Arch), reducing them to three pillars: SDD (spec-driven development) governs "thinking", Harness governs "doing", Loop Engine governs "looping".
- SDD — Turns fuzzy requirements into executable specs (`spec.md` → `plan.md` → `tasks.md` → code) via Spec-Kit's `/specify`, `/plan`, `/tasks`, `/implement`; the human only writes the first spec, checks the plan, and reviews code. Three adoption modes: automated (Spec-Kit), manual control (OpenSpec), lightweight manual (CLAUDE.md + Skill).
- Harness — Wears a harness ("挽具") on an AI that is powerful but lacks judgment boundaries; six tools form three defense lines: project rules (CLAUDE.md), capability levers (Skills/Slash, Subagents), and front/mid/rear defenses (Plan Mode, Permission, Hooks).
- Loop Engine — Manages the ReAct execution loop (Reason → Act → Observe) at scale with three control levers: control granularity, checkpoints, rollback. The youngest of the three pillars; tools still forming.
- Integration — A worked example (new auth module) shows all seven layers (SDD thinking, Spec-Kit, CLAUDE.md, Plan Mode, Claude Code, Hooks) invoked simultaneously within a single task.

## Sections (L2)

### methodology-pillars

- Locator: `[[sources/geek-ai-agent/20260922/第6节：方法论内功：吃透 SDD、Harness 与 Loop Engine.pdf#methodology-pillars]]`
- Summary: Cuts through methodology buzzwords, asserting AI programming rests on three pillars: SDD ("want clearly"), Harness ("do right"), Loop Engine ("keep the loop controllable").
- Key claims: SDD gives the goal, Harness gives the boundary, Loop gives controlled execution — together they form a complete closed loop.
- Learner-relevant: Gives the lightweight mental map of the methodology landscape that anchors later detailed lessons.

### sdd

- Locator: `[[sources/geek-ai-agent/20260922/第6节：方法论内功：吃透 SDD、Harness 与 Loop Engine.pdf#sdd]]`
- Summary: Defines SDD as turning fuzzy requirements into structured, acceptance-bearing, bounded executable specs; details the four-step Spec-Kit pipeline and the human's three jobs.
- Key claims: A spec is not a requirements doc — it is an executable spec; Spec-Kit's automated mode's task-splitting quality ceiling equals your spec quality; three modes (automated / manual / lightweight) are complementary, not replacements.
- Learner-relevant: Teaches when to use which SDD style based on project familiarity and engineer seniority.

### harness

- Locator: `[[sources/geek-ai-agent/20260922/第6节：方法论内功：吃透 SDD、Harness 与 Loop Engine.pdf#harness]]`
- Summary: Explains Harness as putting reins on AI to counter four failure modes (drifting off, losing control, context pollution, irreversible actions) via six tools in three defense lines.
- Key claims: CLAUDE.md provides project context from step one; Skills/Slash are capability levers; Subagents isolate context; Plan Mode is the front defense, Permission the mid defense, Hooks the rear defense (auto lint/test).
- Learner-relevant: The concrete tool-to-defense-line mapping used to make AI a controllable collaborator.

### loop-engine

- Locator: `[[sources/geek-ai-agent/20260922/第6节：方法论内功：吃透 SDD、Harness 与 Loop Engine.pdf#loop-engine]]`
- Summary: Explains why the loop itself needs managing once agents run dozens of steps autonomously, using the ReAct structure plus three control levers.
- Key claims: ReAct (Reason → Act → Observe) is the de facto standard loop; three levers are control granularity, checkpoints, and rollback; value is running long tasks, being able to stop/inspect, and roll back errors; it is the youngest pillar with tools still forming.
- Learner-relevant: Frames the loop as the object of control, setting up the deep Loop/Harness lesson.

### integration-example

- Locator: `[[sources/geek-ai-agent/20260922/第6节：方法论内功：吃透 SDD、Harness 与 Loop Engine.pdf#integration-example]]`
- Summary: Walks a new auth-module task through methodology-led, tool-grounded collaboration across all seven layers simultaneously.
- Key claims: The seven layers are not used sequentially but invoked within one task; methodology is the thought, tools are the implementation.
- Learner-relevant: Demonstrates methodology-plus-tool integration in a concrete end-to-end task.

## Sources

- `[[sources/geek-ai-agent/20260922/第6节：方法论内功：吃透 SDD、Harness 与 Loop Engine.pdf]]`
