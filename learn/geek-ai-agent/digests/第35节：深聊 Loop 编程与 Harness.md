---
source: 第35节：深聊 Loop 编程与 Harness
source_type: pdf
source_lines: 433
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第35节：深聊 Loop 编程与 Harness

## Overview (L1)

- Theme: Loop Engineering — execution goes to the loop, judgment stays with the human. A 2026 practitioner concept: make something complete itself autonomously in a loop with minimal human attention and maximum endurance. Loop programming means shifting effort from writing prompts to designing the environment and rules — the Harness.
- Why the loop — The human keeps retreating in AI usage (2023 Prompt Engineering → 2024 Agent orchestration → 2026 Loop Engineering), but always retreats from "execution"; defining goals, setting rules, and judging results never retreats — work is upgraded, not eliminated.
- Five elements of a loop — Judgeable goal, verifiable feedback loop, isolated workspace, boundaries/stop, and human checkpoints; the first two decide whether it turns, the middle two whether it's safe, the last whether output is trustworthy.
- Harness is the core — Without a judge (tests/types/compile/lint/CI), the loop just spins fast blindly; Loop binds naturally to TDD; the loop amplifies the quality of verification you designed beforehand.
- Judge cannot be bribed — A loop's cheating patterns (modifying/deleting/disabling tests, bypassing acceptance) must be forbidden as iron rules; the stronger pattern is implementer/verifier separation with failure feedback into the rules.
- One full cycle — Read task card → write tests (TDD) → implement → run tests → read failures, locate, fix → repeat until all green; stop on four conditions (all acceptance tests pass / iteration cap like 15 / ambiguous card / touching out-of-scope code).
- Three-layer relation — Loop sits atop SDD (think clearly) and Harness (build the environment); projects without automated tests cannot run a loop at all.
- Industry convergence — Ralph (a while loop + same prompt + fresh instance), Boris Cherny (hundreds of parallel loops, implementer/verifier split, failure feedback into rules), Andrew Ng (three nested loops: agent coding / human review / real users), all independently converge on the same five-element structure.
- Practice — Fossilize loop rules into a `/loop` Agent Skill; each invocation takes one task card with six required blocks; the human does only three things (write card, run one line, final review).
- Key judgment & advancement — What goes to the loop (cheaply, deterministically verifiable tasks) vs. what the human must own (high-cost, hard-to-verify correctness like distributed consistency); advancement = batch pipeline, escalating judges (local → CI → dual-agent), externalized STATUS.md; scale to one module per human review.

## Sections (L2)

### loop-definition

- Locator: `[[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#loop-definition]]`
- Summary: Defines Loop programming as making an autonomous loop complete work with minimal human attention, breaking tasks into small pieces with fixed input/output/verification, looping do-test-fix until verification passes.
- Key claims: Autonomy depends on "verification" — an automatic correctness check (usually tests); tasks that can be auto-verified go to the loop while hard-to-verify ones (distributed consistency) stay with humans.
- Learner-relevant: The one-sentence framing of the whole lesson.

### from-instructions-to-loop

- Locator: `[[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#from-instructions-to-loop]]`
- Summary: Contrasts traditional one-command-at-a-time usage with Loop programming where you design a loop and intervene only at key points.
- Key claims: The definition moves your energy from writing prompts to designing the environment/rules in which AI loops autonomously — that environment/rules is the Harness.
- Learner-relevant: Establishes the core mindset shift.

### human-retreat-pattern

- Locator: `[[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#human-retreat-pattern]]`
- Summary: Traces 2023 Prompt Engineering → 2024 Agent orchestration → 2026 Loop Engineering, arguing the human retreats only from execution, never from defining goals, setting rules, and judging results.
- Key claims: Loop doesn't make people idle — it upgrades them from executor to loop designer and checkpoint judge.
- Learner-relevant: The historical framing justifying Loop Engineering as a discipline.

### five-elements

- Locator: `[[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#five-elements]]`
- Summary: Enumerates the five required elements: judgeable goal, verifiable feedback loop, isolated workspace, boundaries/stop, human checkpoints.
- Key claims: Goal + judge decide whether the loop can turn; isolation + boundary decide safety; human checkpoint decides trustworthiness; all five are indispensable.
- Learner-relevant: The checklist for designing any usable loop.

### harness-is-core

- Locator: `[[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#harness-is-core]]`
- Summary: Argues Harness — especially the verifiable feedback loop (the judge) — decides loop success; without a judge the loop runs blind.
- Key claims: Every turn needs something to say "right or wrong": automated tests / type checks / compile / lint / CI; Loop is naturally bound to TDD; the loop amplifies your pre-designed verification quality.
- Learner-relevant: The decisive insight that Harness design, not prompting, determines loop usability.

### judge-integrity

- Locator: `[[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#judge-integrity]]`
- Summary: Details how loops cheat and the iron rules to prevent it, plus the stronger implementer/verifier separation pattern.
- Key claims: Forbid modifying/deleting/disabling tests; forbid bypassing hard acceptance requirements; when concurrency/boundaries are uncertain, stop and ask rather than silently simplify; implementer/verifier separation uses different instructions or even a stronger model to verify, with failures fed back into the rules.
- Learner-relevant: The anti-cheating discipline essential to trustworthy loops.

### one-cycle

- Locator: `[[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#one-cycle]]`
- Summary: Walks one loop cycle and its four stop conditions.
- Key claims: Read card → write tests first → implement → run → read failure, locate, fix → return to run; stop when all acceptance tests pass, iteration exceeds cap (e.g. 15), the card is ambiguous, or out-of-boundary code is needed.
- Learner-relevant: The concrete operational loop to implement in `/loop`.

### three-layer-relation

- Locator: `[[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#three-layer-relation]]`
- Summary: Positions Loop above SDD (think clearly) and Harness (build the environment: CLAUDE.md context, tools, hooks/permissions, tests/isolation).
- Key claims: A project without automated tests cannot run a loop — Loop is for people with solid engineering fundamentals; infrastructure is the base and Loop grows on it.
- Learner-relevant: Connects Loop Engineering back to SDD and Harness pillars.

### industry-practice

- Locator: `[[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#industry-practice]]`
- Summary: Rallies three practitioners — Ralph (a while loop, same prompt, fresh instance per round), Boris Cherny (hundreds of parallel loops, reads GitHub/Slack to decide work, implementer/verifier separation, failure feedback), Andrew Ng (three nested loops: agent coding / human review / real users).
- Key claims: Different wording but the same five-element structure, showing independent convergence by frontline practitioners.
- Learner-relevant: Validates the framework through real-world convergence.

### practice-loop-skill

- Locator: `[[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#practice-loop-skill]]`
- Summary: Shows fossilizing loop rules into a `/loop` Agent Skill (`.claude/skills/loop/SKILL.md`) with three skeleton blocks: input validation, stop conditions, absolute prohibitions.
- Key claims: `/loop` is not a built-in tool switch but a self-assembled skill; declare "only use when explicitly invoked" so the human decides whether to loop; keep the three skeleton blocks and extend per project.
- Learner-relevant: The reusable artifact for operationalizing loops.

### task-card

- Locator: `[[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#task-card]]`
- Summary: Defines the task card as `/loop`'s per-invocation input with six required blocks: module, goal, acceptance criteria, required tests, boundaries, execution mode.
- Key claims: Acceptance criteria and tests must be decidable — they decide convergence; a card is not a mini-spec — architecture/selection live in the tech plan and CLAUDE.md, and the card is only the task increment (writable in 20 minutes).
- Learner-relevant: The input contract that makes loops converge.

### full-demo

- Locator: `[[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#full-demo]]`
- Summary: A complete demo where the human does only three things: write the card, run one line (`/loop TASK-001.md`, auto-isolated branch), and final review; loop self-spins and stops with completion status, key judgments, and pending decisions.
- Key claims: The whole middle execution happens without you; editing the card and re-running beats arguing with AI for ten turns because it fixes the loop's input and restarts from a clean state.
- Learner-relevant: Shows the intended ergonomics of loop-driven development.

### task-triage

- Locator: `[[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#task-triage]]`
- Summary: Draws the line between what goes to the loop (cheaply, deterministically verifiable) and what humans must own (high-cost, hard-to-verify).
- Key claims: Loop-suitable: data structures, boundary-clear modules, format conversion, boilerplate, well-tested refactors; human-led: distributed consistency, failover correctness, money/security matters, long-evolving architecture decisions; the divider is verifiability, decided by the card's "execution mode" field at task-splitting time.
- Learner-relevant: The decision rule for delegating work to loops.

### advancement-when

- Locator: `[[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#advancement-when]]`
- Summary: Describes advancement (batch pipeline like Ralph's full form, escalating judges local → PR/CI → dual agent, externalized STATUS.md) and how the When project applies it.
- Key claims: One module per string with one human review, not the whole project at once; When splits into module task cards each with auto-runnable acceptance, loops run them, while failover correctness stays human-led; the summary: principle = move leverage from prompts to loop design; practice = one `/loop` skill + one card per task; judgment = verifiable tasks to the loop, high-cost hard-to-verify stays human.
- Learner-relevant: The scaling path and concrete application to a real project.

## Sources

- `[[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf]]`
