---
source: sources/ai-eval/20261108/course/code/AI_Evals_Week3_Deck.txt
source_type: text
source_lines: 906
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- Week 3 agenda — a 90-minute session on red-teaming an agent and measuring its guardrails: why safety needs a different mindset (10 min), attack categories (20), building an adversarial suite (15), measuring block-versus-over-block (10), and a live build plus Project 3 (35).
- Attack catalogue — five attack categories (injection, jailbreak, leakage, harmful content, bias) partly mapped to OWASP LLM01/LLM02/LLM07, with excessive agency (LLM06) handled in the HITL assignment; direct versus indirect injection, a hidden HTML-comment policy-doc injection, four jailbreak techniques (role-play, hypothetical, emotional, encoding), four sensitive data types, and separate bias/harmful-content tests.
- Promptfoo red teaming — scan first for a baseline, read failures, hand-craft what the scanner misses, rerun on deploy; a `promptfooconfig.yaml` with `indirect-prompt-injection`, `prompt-extraction`, and `pii:direct` plugins plus jailbreak/encoding strategies, graded by an LLM judge that itself needs week-2-style validation.
- Dataset construction — a generator prompt for 100 Pronto-specific cases across five categories, seeded attacks expanded into three mutations and two benign twins each, with benign twins required to be answered normally; SME review and failure-to-suite loop.
- Guardrail scorecard — every guardrail gets a confusion matrix of catch rate and over-block rate; illustrative 95% catch target and 2% over-block ceiling; a PII guardrail v2 drops leaks from 33% to 5% for one point of over-block; over-blocking drives churn and loss of trust.
- Baseline scan numbers — 300 tests in 12 minutes for $7.42, 56 failures (19%): PII/secrets 22, prompt injection 18, jailbreak 8, bias 5, harmful 3; triage into five risks to build.
- Five guardrails and composition — PII output scanner (regex + LLM judge), indirect injection filter, system-prompt protector, jailbreak reframe boost, multilingual refusal check; together catch 47 of 52 targeted failures, but stacked over-block reaches 15 (5%) and indirect injection remains the biggest gap.
- Assignments and principles — Assignment 1 scan/triage into a frequency×severity 2x2 plus five hand-crafted attacks; Assignment 2 build regex/judge/hybrid guardrails scored on 40 inputs with a ship/no-ship verdict and HITL flow; Assignment 3 build a Jev judge with reliability diagram and review band.

# L2 detail

- `#L1-L49` — Title, instructor, today's five-part agenda and timings, how to receive the eval book, and the three skills to show: tracing, a Gradio multi-turn chat UI, and the Jev decision model.
- `#L50-L96` — Pointer to the OWASP top-10 explainer and the eight-step live-demo outline (normal request, over-block, in-authority refund, over-authority refund, undefended injection, guarded injection, data leakage, traces), plus the Fortune headline slide and where week 3 fits in the course.
- `#L97-L131` — Part 1: safety evaluation assumes an attacker; carrying quality-eval habits over tests the wrong thing; where agents can be attacked across a workflow; a definition of safe behavior (reliability, transparency, accountability, safety/privacy, human handoffs) written down before testing.
- `#L132-L225` — Part 2: five attack categories and OWASP mapping; direct versus indirect injection; three cost scenarios (HIPAA leak, lending-law breach, pricing leak); a hidden policy-doc HTML-comment injection that overrides the refund rule; four jailbreak techniques with example phrasings.
- `#L226-L300` — Jailbreak example where 50 direct asks are refused but one fiction reframe leaks the system prompt; the four sensitive data types (system prompt, env/secrets, training-adjacent data, cross-user data) with test methods; multi-turn extraction chains; testing bias and harmful content separately.
- `#L301-L397` — Part 3: manual plus automated red teaming in order (scan baseline, read failures, hand-craft, rerun on deploy); Promptfoo generates/runs/grades tests; the red-team grader is an LLM judge needing week-2 checks; a first `promptfooconfig.yaml` for the real Pronto loop with three plugins and strategies; structure the suite by attack category.
- `#L398-L511` — Part 4: the dataset-generator prompt and Pronto capability spec (sequential IDs, $50 refund cap, escalation, no prompt/cross-user disclosure); 100 cases across five categories; three seed attacks expanded into mutations and benign twins; the five-step dataset workflow; two rates and the confusion matrix at 95% catch / 2% over-block; PII guardrail v2 improvements; over-blocking costs.
- `#L512-L590` — Part 5 baseline scan: terminal output with 300 tests, 56 failures (19%) and per-category counts, cost/latency, the "read failing traces first" rule, and triage into the five risks the class will build guardrails for.
- `#L591-L670` — Guardrail build table: each guardrail's approach, caught, missed, and over-block counts; whole-stack measurement showing 291 of 300 attacks stopped (97%), 9 missed, and 15 over-blocked as stacked costs accumulate.
- `#L671-L730` — What results reveal: indirect injection is the biggest gap, the composition tax needs a precedence policy, refusal is brittle by shape rather than topic; project principles (read failures first, one category/guardrail/matrix, both metrics or no ship, test composition); Part 6 assignment intro.
- `#L731-L808` — Assignments 1–3 in detail: baseline Promptfoo scan and 2x2 triage with five hand-crafted attacks; three guardrails (regex, LLM judge, hybrid) scored on 20 adversarial plus 20 legitimate inputs plus a HITL approval flow; a Jev scorer with catch/over-block/review/latency comparison and a 3-bin reliability diagram.
- `#L809-L872` — Definition of done for all three assignments; practice question on how a 100% catch rate can still hurt users; answer that the missing metric is over-block, measured on benign production traffic rather than the adversarial suite.
- `#L873-L906` — Week 3 takeaways (adversarial ≠ quality, indirect injection sneakiest, five categories, two metrics per guardrail, five attack surfaces, composition compounds cost), next class on eval data/RAG/statistical rigor, and closing slides.
