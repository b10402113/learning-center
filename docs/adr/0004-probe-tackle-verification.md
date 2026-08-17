# Verification is adaptive and runtime: probe + tackle

Status: accepted (amended by ADR-0006: probe is now node-scoped, per-node mastery)

We replace the authored-question verification model with a two-stage adaptive MCQ system. **`/probe`** runs after `/learn-init` and before `/roadmap`: it quizzes the whole source scope from shallow to deep, binary-searching each strand, and writes a per-area **mastery** report (`unknown | partial | solid`) persisted per subject. **`/tackle <step-id>`** runs at learning time: it generates 5–10 MCQ on the fly from the step's elements, anchors starting difficulty to MEMORY, and adapts to live answers (correct → harder, wrong → easier). A step passes when the system estimates its concepts at `solid`; passing marks the step complete and writes mastery back. The `question` element type is deprecated; elements keep a no-grade `Questions` self-check section.

## Considered Options

- **Pre-written per-step question banks (rejected).** Questions are verifiable and citeable, but cannot adapt to the learner's live level and add a heavy authoring burden per step.
- **Runtime adaptive generation (kept).** Aligns with the learner's stated need for a challenge at the edge of understanding; MEMORY provides the starting level; live feedback drives difficulty. Trade-off accepted: questions are not pre-verified, so the skill must ground them in the step's elements and cited sources.

## Consequences

- Pipeline becomes `/learn-init → /probe → /roadmap → /nodes → /edges`, plus runtime `/tackle`.
- Probe does **not** propose pruning — mastery only calibrates depth; all content stays complete and readable.
- Mastery is persisted (measurement for calibration); step completion stays client-side (UI state).
- `/tackle` needs MEMORY and the step's elements to author questions; it must stay deterministic enough that passing means real understanding, not luck.
