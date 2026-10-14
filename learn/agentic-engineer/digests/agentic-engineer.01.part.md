---
source: agentic-engineer.01
source_type: text
source_lines: 1091
part: 1
status: absorbed
absorbed_at: 2026-10-14
created: 2026-10-14
updated: 2026-10-14
---

# Digest — agentic-engineer (part 1) — Setup & Orientation

## Overview (L1)
- What This Course Will and Wont Make You — Frames the course thesis: writing code is now a commodity, so the differentiator is judgment, not prompt wizardry. The agent becomes the fastest junior/mid developer; your job is to direct it. This course teaches that judgment.
- Prerequisites Who is this course for — A gut check for the intended learner: someone who already writes code and has used AI in a chat window (paste question, copy answer, tweak, repeat). Requires only basic terminal and editor skills, a paid coding-agent plan, and a willingness to change how they work.
- The Two Scenarios Youll Build In — Sets up the practical structure: first feel the pain of hand-coding or vibe coding, then receive the workflow, then run it through greenfield (client work or own idea) and brownfield (existing/legacy) projects.
- Install the CLI in Your IDE — The single setup lesson: install the CLI and the editor extension, using Claude Code in VS Code as the concrete tool. Notes the workflow is tool-agnostic and ports to Cursor/Codex, and that real agentic work needs a paid plan.
- How to Take This Course Use the Cheat Sheet — Meta-lesson on how to consume the course: build along, go in order, don't skip the comparison module, and fill in the provided (initially empty) cheat sheet yourself as you go.

## Sections (L2)
### 1-what-this-course-will-and-wont-make-you
- Locator: `[[sources/agentic-engineer/20261014/1. Setup & Orientation/1. What This Course Will and Wont Make You.srt#1-what-this-course-will-and-wont-make-you]]`
- Summary: The instructor (Adrian, who runs the JS Mastery channel) argues that AI has commoditized code generation, so the real question is what makes a developer worth hiring. The answer is not better prompts — AI can write those too — but judgment: knowing what to build, pointing the agent at it, and reading what comes back the way a senior reviews a junior's PR.
- Key claims: Writing code is no longer the hard part — describing a feature in plain English yields working code; the developers succeeding are those with judgment, not prompt wizards; the agent does not give you judgment but raises the price of not having any; judgment can be taught, which is the whole course; AI job data shows roles are changing shape, not disappearing, and those who adapt move to the front.
- Learner-relevant: Sets the course's purpose and mindset — you remain the engineer and the AI is a fast junior/mid developer you direct. Explicitly states this course will NOT teach you to prompt your way to code you don't understand.

### 2-prerequisites-who-is-this-course-for
- Locator: `[[sources/agentic-engineer/20261014/1. Setup & Orientation/2. Prerequisites Who is this course for.srt#2-prerequisites-who-is-this-course-for]]`
- Summary: Defines the target learner: developers who already write code and are comfortable building a component, API route, or small app without hand-holding. It is not for people who have never written a line of code. The core audience has used AI only in a chat window and hits a wall as projects grow.
- Key claims: You must write code and build things unaided; pasting into ChatGPT or Claude and copying answers back works until the project gets big enough to break; adding a single `CLAUDE.md` file helps for about a week before the agent forgets mid-session, eats tokens, and contradicts the file — you're missing a workflow, not a better file; you need basic terminal and editor skills only, no specific framework, AI tool, or agent knowledge; a paid plan for the coding agent is required (smallest tier is enough to start, upgrade only when you hit limits); the key mindset prerequisite is willingness to change how you work — the developers who win are the most open, not the most senior.
- Learner-relevant: Calibrates expectations and prerequisites. Concrete mention of `CLAUDE.md` as the common first attempt that fails; guidance for seniors already running agents daily to move fast through early modules but slow down at legacy codebases and recovery.

### 3-the-two-scenarios-youll-build-in
- Locator: `[[sources/agentic-engineer/20261014/1. Setup & Orientation/3. The Two Scenarios Youll Build In.srt#3-the-two-scenarios-youll-build-in]]`
- Summary: Lays out the course's practical arc: first show how not to code (by hand or by vibe coding) so you feel the problem, then give the workflow, then run it through the real situations developers face. The two scenarios are greenfield and brownfield projects.
- Key claims: Hand-coding and vibe coding seem easy but are actually the harder way; scenario one (brand new project) splits into client work — turning a vague, half-formed requirements set into a real technical spec agents can build against — and your own idea (e.g., a SaaS), pressure-tested with a special skill before writing code; scenario two (existing project) is the most common day-to-day reality, adding the next feature, and includes legacy codebases you didn't write, that are old, partially broken, and undocumented; the workflow has a path that skips upfront planning for existing projects; almost every other course pretends legacy work doesn't exist, this one does.
- Learner-relevant: Frames the two headline scenarios and their workflows. Supports freelancing/agency (client-work path) and solo product building (own-idea path); establishes that by the end you'll know exactly when and how to reach for each skill, not just collect them.

### 4-install-the-cli-in-your-ide
- Locator: `[[sources/agentic-engineer/20261014/1. Setup & Orientation/4. Install the CLI in Your IDE.srt#4-install-the-cli-in-your-ide]]`
- Summary: The one setup lesson. It installs the CLI and, on VS Code, the Claude Code extension. The instructor teaches concretely in Claude Code while stressing the workflow, skills, and context thinking are tool-agnostic.
- Key claims: Everything taught is tool-agnostic and ports to Cursor and Codex, but it is shown concretely in one tool (Claude Code) with mappings to the others so you're never locked in; a poll showed the majority wanted Claude Code; real agentic work runs on a paid plan — free tiers are fine for poking around but not for building; start on the smallest paid tier and upgrade when you consistently hit the wall; the instructor recommends and personally uses the Max plan; step one is to install the CLI and (on VS Code) the Claude Code extension.
- Learner-relevant: Concrete setup actions — install the CLI, install the Claude Code extension in VS Code (the instructor's editor), use the Max plan. Named tools: Claude Code, VS Code, Cursor, Codex. Pricing link left below the lesson since prices change often.

### 5-how-to-take-this-course-use-the-cheat-sheet
- Locator: `[[sources/agentic-engineer/20261014/1. Setup & Orientation/5. How to Take This Course Use the Cheat Sheet.srt#5-how-to-take-this-course-use-the-cheat-sheet]]`
- Summary: Teaches how to consume the course for maximum retention. The core instruction is to build along in your editor, because this is a workflow course and a workflow only becomes yours when you've run it yourself.
- Key claims: Watching is worth about a tenth of doing; keep your editor open the whole time; the course order is fundamentals (how agents work under the hood and how to think about context, tool-agnostic) → a painful hand-vibe-coded comparison with no skills → the JSM workflow, where each skill lands as the fix to a pain you just felt → running the workflow through real scenarios (scratch project, legacy codebase, and recovery when everything breaks); don't skip the comparison module — it makes everything after it click; there is a cheat sheet that starts empty on purpose and you fill in yourself (each skill: what it does, when you reach for it, in your own words) — the instructor signals each time to add a line, and you unlock the official one-pager at the end; go in order because every module leans on the previous one, and attempt challenges before watching solutions.
- Learner-relevant: Course navigation guidance and the named "JSM workflow." Emphasizes self-written notes over downloading; legacy modules "half-work" without the context layers underneath, reinforcing sequential study.
