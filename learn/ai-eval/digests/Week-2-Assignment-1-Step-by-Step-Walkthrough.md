---
source: sources/ai-eval/20261108/supplement/code/Week-2-Assignment-1-Step-by-Step-Walkthrough.txt
source_type: text
source_lines: 162
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- Week 2 judge walkthrough — eleven numbered steps (Step 0–11) for building and validating three LLM judges on 40 Pronto agent outputs in Braintrust: set up `BRAINTRUST_API_KEY`, smoke-test the tooling, calibrate on a 24-response game, write one-criterion binary rubrics (policy adherence, escalation correctness, tool-call accuracy), hand-label 120 verdicts, run judges, build agreement matrices and Cohen's kappa, adjudicate every disagreement, package `rubrics.md`, `labels.jsonl`, `results.md`, `diagnosis.md`; budget 4–6 hours with labeling as the bulk.

# L2 detail

- `#L1-L6` — Title (AI Evals in Practice — Week 2, Assignment 1) and framing: follow top to bottom, each step states the action, expected output, and done-check; budget 4–6 hours, Step 5 labeling dominates.
- `#L7-L16` — Step 0 prereqs (5 min): clone the repo, create `.env` with `BRAINTRUST_API_KEY=...` from braintrust.dev (free course access), no other keys needed; checkpoint and common failure (extra spaces/quotes cause "Set BRAINTRUST_API_KEY" errors).
- `#L17-L26` — Step 1 install and smoke-test (10 min): `pip install braintrust openai`, run `braintrust_smoke_test.py`; expect three `[OK]` checks (API key, proxy judge via gpt-4o-mini, eval/scorer writing 3 scored rows to the `smoke-test` project); confirm in the UI; a 401 means wrong key or account.
- `#L27-L38` — Step 2 warm-up (15 min, in class): open the hosted judge-calibration game, connect Braintrust, label 24 responses pass/fail by gut, write one judge prompt, run it, compare to the answer key; checkpoint is explaining accuracy, precision/recall, and Cohen's κ in one sentence each.
- `#L39-L50` — Step 3 collect 40 agent outputs (20 min): reuse the 30 Week 1 traces plus 10 fresh, or run adversarial inputs; include real failures (aim ~a third fails) and edge cases ($50 boundary, substitution opt-in wording, non-Pronto warranty claims, multi-turn context); checkpoint is 40 readable outputs saved.
- `#L51-L69` — Step 4 rubric 1, policy adherence (30 min): replace the TODO in `starter.py` using the five elements — auditor role, one binary question, concrete standard (24h photo for perishables, 30-day non-perishable returns, >$50 refunds need human approval, substitution only with checkout opt-in, 1-year warranty on Pronto-branded appliances), a boundary example (a $50.00 solo refund is FAIL, $49.99 is PASS), and strict `PASS`/`FAIL` first line plus `Reason:` under 20 words; checkpoint is a human could apply it unaided; trap is adding a second criterion.
- `#L70-L80` — Step 5 rubrics 2 and 3 (30 min): `escalation_correctness` (escalate on legal threats, safety/health, another customer's data, refunds over $50, and not on routine requests) and `tool_call_accuracy` (right tool with right arguments); boundary examples given (legal threat answered with a refund offer is FAIL; `issue_refund` for an $85 order instead of `escalate_to_human` is FAIL); all three live in `RUBRICS`.
- `#L81-L95` — Step 6 label all 40 outputs (2–3 hours): 40 outputs × 3 rubrics = 120 labels in `labels.jsonl`, one JSON object per line with `input`, `output`, and `human` verdicts; labeling discipline (judge against the rubric as written, note ambiguity as a rubric bug, batch in tens to avoid fatigue, defer uncertain cases to Step 10); checkpoint 40 complete lines and roughly 10+ FAILs or toughen the inputs.
- `#L96-L109` — Step 7 wire up the judge (30 min): implement `_judge_client()` with the Braintrust OpenAI-compatible base URL `https://api.braintrust.dev/v1` and `run_judge()` sending rubric as system prompt and output as user message, returning PASS if the reply starts with PASS; test on 3 known cases (e.g. `$85` refund without approval must be FAIL); failure modes: weak output-format instruction, or 401 from the key.
- `#L110-L119` — Step 8 run judges and build matrices (30 min): loop the 40 labels through `run_judge()` per rubric, print `agreement_matrix()` and `cohens_kappa()`; sample output `{'JP_HP': 22, 'JP_HF': 3, 'JF_HP': 5, 'JF_HF': 10}`, κ 0.58; interpret 3 false passes as the dangerous cell and 5 false fails; record three matrices and kappas without interpreting yet.
- `#L120-L136` — Step 9 investigate every disagreement (45 min): for each disagreement decide whether the judge is wrong (rubric loophole or misread, e.g. passing anything containing "escalated") or the human label is wrong (adjudicate and record why); checkpoint names the worst judge's dominant mode "It false-passes when ___" in `diagnosis.md`; trap is editing the rubric now, which tunes on the test set and makes agreement dishonest.
- `#L137-L146` — Step 10 run it in Braintrust (20 min): fill `run_braintrust_eval()` and run over the 40 cases; expect one experiment per rubric, per-row verdicts beside hand labels, average scores equal to agreement rates, and drill-down on disagreeing rows; screenshot the comparison view.
- `#L147-L154` — Step 11 package four deliverables in the assignment folder: `rubrics.md` (three prompts verbatim), `labels.jsonl` (40 post-adjudication rows), `results.md` (per judge: matrix, agreement %, κ, false-pass/false-fail counts), `diagnosis.md` (worst failure mode, shared loophole, every changed label and reason).
- `#L155-L160` — Final acceptance criteria: three one-criterion prompts with strict PASS/FAIL plus reason; 120 hand labels; matrix and κ per judge with κ ≥ 0.6 to call a judge trusted; worst judge's failure mode named; adjudication notes recording changed labels or why none changed.
- `#L161-L162` — Optional stretch: `judge_stats.py` reports a bias-corrected pass rate with a 95% CI and a one-line read on the direction of bias.
