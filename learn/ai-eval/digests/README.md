---
source: sources/ai-eval/20261108/supplement/code/README.html
source_type: text
source_lines: 116
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- Course outline — official four-week ByteByteGo "AI Evals in Practice" structure: each week pairs one live session (Wed, Oct 7/14/21/28, 5 PM PT) with an assignment brief, moving from tracing and failure taxonomies (Week 1) through LLM-as-judge design and validation (Week 2), red-teaming and guardrails (Week 3), to golden datasets and statistical/RAG evaluation (Week 4).

# L2 detail

- `#L1-L10` — HTML shell: doctype, head, title "README — AI Evals Course (ByteByteGo)", and inline CSS for the single-page document.
- `#L11-L22` — Body opens with the H1 and a table of contents linking the eight sections: a live session and an assignment block for each of the four weeks.
- `#L23-L31` — Week 1 live session (Oct 7): non-determinism means quality must be measured as a rate, failures of skipping evals (deleted production DB, invented refund policy), why benchmarks do not guarantee product quality, the Pronto grocery support agent, six quality dimensions (model quality, product behavior, safety, reliability, cost, latency), eval harness anatomy, hands-on tracing, plus learning objectives (explain why exact match fails, assess six dimensions, read traces, build a failure taxonomy, trace 30 runs for Project 1 / White belt).
- `#L32-L45` — Week 1 assignments: (1) instrument the Pronto agent with LangSmith or the browser Trace Viewer, run the 30 provided inputs and annotate pass/fail; (2) cluster failures into at least five binary trace codes with frequency counts, map each to a quality dimension, and report top three failure modes plus one unexplained anomaly; submission format and White belt award.
- `#L46-L54` — Week 2 live session (Oct 14): evaluator options (code checks, metrics, LLM-as-judge, human review), where exact match/F1/BLEU break, choosing by accuracy/cost/speed, binary judges over 1–5 ratings, the five elements of a reliable judge prompt, validation via agreement matrix and Cohen's kappa (≥85% agreement, κ ≥ 0.6), per-metric A/B comparison, built in Braintrust; corresponding learning objectives.
- `#L55-L70` — Week 2 assignments: (1) write three binary rubrics (policy adherence, escalation correctness, tool-call accuracy) as Braintrust scorers, run against a 40-label set, compute agreement and kappa; (2) diagnose the weakest judge via false passes, tighten the rubric, re-validate, then A/B two prompt variants and write a ship/no-ship decision; learning outcomes listed for both.
- `#L71-L78` — Week 3 live session (Oct 21): quality vs safety assumptions, agent attack surface (input, retrieved context, tools, memory, output), five threat categories (prompt injection, jailbreaks, data leakage, harmful content, bias), direct/indirect injection, jailbreak shapes, four kinds of sensitive data, automated red-team scan with Promptfoo, guardrails scored on catch rate and over-block rate, guardrail stacking; learning objectives.
- `#L79-L90` — Week 3 assignments: (1) run a Promptfoo baseline scan, triage failing traces by severity/frequency, author five domain-specific attacks; (2) build three guardrails (regex, LLM judge, or hybrid), score catch rate and over-block rate, add human-in-the-loop approval, ship/no-ship verdict tied to numeric thresholds; learning outcomes.
- `#L91-L102` — Week 4 live session (Oct 28): trustworthy golden sets (representative, diverse, correctly labeled, versioned; criteria not exact strings; metadata for slicing), safe synthetic generation, RAG measured in two halves via four Braintrust scorers (context precision/recall for retrieval; faithfulness/answer relevance for generation), statistical rigor via paired testing and bootstrap confidence intervals, multiple-comparison trap, reproducible harness; learning objectives.
- `#L103-L114` — Week 4 assignments: (1) build a golden set of at least 150 cases blending real and validated synthetic examples, pin as v1 in LangSmith; (2) wire four RAGAS metrics into the harness, surface one groundedness failure (correct answer on wrong evidence), run a paired bootstrap test on a prompt change, ship a one-command reproducible harness; learning outcomes.
- `#L115-L116` — Closing body and html tags.
