---
source: sources/ai-eval/20261108/course/code/AI_Evals_Week4_Deck.txt
source_type: text
source_lines: 633
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- Week 4 deck agenda — "Build reliable eval data and measure RAG quality" with five segments: build a trustworthy eval dataset (20 min), evaluate retrieval and generation separately (20 min), decide whether an improvement is real (20 min), turn one-off evals into a repeatable harness (10 min), and live build plus Project 4 (20 min).
- Three flavors of AI lies — hallucination (confidently generating nonexistent information), sycophancy (prioritizing what the user wants to hear), and task fabrication (reporting work as done when it wasn't). Only the third requires verification; good metrics cannot rescue a bad dataset.
- Four dataset qualities — representative of real production traffic including hard and rare cases, diverse across intents/phrasings/edge cases, correctly labeled by a domain expert (not the model under test), and versioned as frozen snapshots that a run can pin to.
- Golden-set record schema — question, contexts, criteria-based ground truth (must_include / must_not rather than one exact string), source, difficulty, intent, and segment; blend real, synthetic, and hand-crafted cases for fidelity, volume, and risk coverage.
- RAG is scored in two places — a Braintrust `Eval` run over pinned golden v1 with four scorers: faithfulness, answer_relevancy, context_precision, and context_recall, illustrated as 0.91 / 0.88 / 0.62 / 0.95 in one per-case experiment.
- Statistical rigor — a 3-point gap needs roughly 1,000-2,600 paired cases (about 3,500 unpaired); test paired versions on the same cases; report the score with its n and a 95% interval, and treat many prompt variations as multiple comparisons.
- Bootstrap confidence intervals — resample 100 scored results with replacement 10,000 times and read the middle 95%; a numpy snippet turns 71/100 into an interval of about 62% to 80% with no distribution assumptions.
- Harness and Project 4 — one config, one command, reproducible report; deliverables are golden_set.jsonl, dataset.md, groundedness_failure.md, report.md, and config.yaml, with a 150+ case golden set, 30+ hand-checked synthetic cases, one groundedness failure root-caused, and one paired test reporting delta plus 95% CI.

# L2 detail

- `#L1-L40` — Title slide and 90-minute agenda: five numbered segments with durations, from trustworthy eval data through live build and Project 4.
- `#L41-L90` — The three flavors of AI lies with definitions and examples; where week 4 fits in the course; the warning that a perfect metric on biased data gives a perfectly wrong answer.
- `#L91-L123` — Part 1 opening and the four qualities of a trustworthy eval dataset: representative, diverse, correctly labeled, and versioned, each with a one-line rationale.
- `#L124-L160` — Where to find realistic cases (a target blend, not a rule) and the golden-set record example with question, contexts, ground_truth, source, difficulty, intent, and segment, plus why each field matters.
- `#L161-L189` — Ground truth that holds up: exact-string matching versus `must_include` / `must_not` criteria checked by an LLM judge, so correct answers pass regardless of phrasing.
- `#L190-L210` — Safely generating synthetic eval cases and why every dataset needs a version: an unversioned Monday 71% / Friday 74% story where added easy cases make improvement unknowable.
- `#L211-L235` — Part 2: a RAG system can retrieve wrong or generate wrong, one final score cannot separate the two, so retrieval and generation are measured separately.
- `#L236-L286` — What each RAG scorer checks (faithfulness, answer relevancy, context precision, context recall), a correct answer still hiding a retrieval failure, the Braintrust `run_eval.py` example with four scorers and illustrative scores, and the "highest-ROI agent engineering habit".
- `#L287-L320` — Part 3: why a 3-point improvement may not be real, the sample-size curve and backward planning, the ~1,000-2,600 paired / ~3,500 unpaired case counts, paired testing, and reporting the score with a 95% interval and n.
- `#L321-L377` — Bootstrap confidence interval procedure in five steps with the numpy implementation (71 ones, 29 zeros, 10,000 resamples, 2.5/97.5 percentiles giving about 62% to 80%).
- `#L378-L430` — The Project 4 paired test walkthrough: golden v1 n=200, top_k 3 vs 5, context recall, B winning 42 of 60 disagreements, +5 to +19 point CI, ship verdict; then the false-wins risk from testing many prompts.
- `#L431-L466` — Part 4 on the repeatable eval harness, Part 5 live-build checkpoints 1-3 (build/version the golden set, evaluate retrieval and answer quality, test whether the improvement is real), and Part 6's Project 4 definition.
- `#L467-L550` — Project 4 six tasks (build the golden set, version and pin v1 in LangSmith, add four Braintrust scorers, find a hidden groundedness failure, run a paired test, ship the harness), required submissions, and the definition of done.
- `#L551-L605` — Practice scenario: a 5-point gain on 40 cases after a dozen prompt variations, and the answer naming both problems (about ±11 point margin at n=40, multiple comparisons) with the paired-bootstrap and fresh held-out retest remedy.
- `#L606-L633` — Week 4 takeaways (data before metric, measure retrieval and generation separately, blend sources, right answer is not right eval, validate synthetic cases, report intervals) and the Project 4 / week 5 next steps.
