---
source: sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt
source_type: text
source_lines: 908
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- Mental model — "an eval is just your taste, written down as checks a machine can run," and every check exists because something failed once; the five-step pattern is list failure modes, split into machine-checkable (code grader) vs needs-judgment (LLM rubric), set the PASS bar, calibrate on known-good/known-bad cases, then gate shipping.
- Week 2 agenda — choose the right evaluation method, design an LLM judge, validate it against humans, go beyond single answers (multi-turn, tool calls, A/B), then a live build and Project 2; Braintrust is the default tool and LangSmith transfers the method.
- Four evaluator types — a rule exists → code, needs judgment → LLM judge, ground truth available → human labels, outcome → user feedback; traditional metrics (exact match, F1/precision/recall, BLEU/ROUGE, BERTScore) each fail on phrasing variation, ignored meaning, or missed factual errors.
- Judge design — five elements: auditor role, one binary question, concrete PASS and FAIL definitions, a boundary example, and a fixed output format (reasoning then PASS/FAIL); one judge per criterion, never one prompt scoring helpfulness, accuracy and tone together; four judge types are tone/style, factual correctness, instruction following, task completion.
- Validation gates — ≥85% agreement, Cohen's κ ≥ 0.6, few false passes with each one read, and explainable disagreements; the worked faithfulness example fails three gates (78% agreement, κ 0.44, 47% false-pass rate) and the single explainable root cause (5 of 7 false passes cite the wrong doc section) points to the fix.
- Multi-turn and tool calls — conversation-level checks for context retention, state accuracy and coherence; tool calls evaluated in three layers (schema, arguments, semantics), where a valid JSON with the wrong intent only fails layer 3; offline A/B changes one variable, runs the full suite, and reads per-metric deltas.
- Hands-on and project — a browser Judge Calibration Game (label 24 Pronto responses, live accuracy/precision/recall/F1/κ, optional real API key) and Project 2: three binary judges (policy adherence, escalation correctness, tool-call accuracy) run against 40 labels, diagnose-and-fix false passes, A/B two variants, make a ship/no-ship call.
- The false pass is the headline danger — a 94%-agreement example has κ 0.24 because 93/100 cases pass and the judge passes 6 of 7 real failures; always-pass scores 93% for free, so check κ and the false-pass quadrant rather than raw agreement.

# L2 detail

- `#L1-L46` — Title and instructor; week 1 recap and announcements (Q&A, show your work, Braintrust sign-up, office hours, feedback); the written mental model of evals as machine-runnable taste; week 2 learning goals and the five-part agenda.
- `#L47-L120` — Session timings; Braintrust free course access and LangSmith alternative; real-world demos (Braintrust, CrewAI, LangSmith, Agentforce); "how evaluations can mislead you"; where week 2 sits in the course; part 1 opener.
- `#L121-L230` — Part 1 evaluator selection; human labels as the ground truth for validating a judge; table of traditional metrics with what each measures, when it works, and when it fails; part 2 opener, components of a reliable judge, why pass/fail beats 1–5, the five prompt elements, and the tool-call-or-prose judge prompt.
- `#L231-L340` — One judge, one binary criterion vs the three-criteria anti-pattern; four judge types mapped to failure codes (stale knowledge → factual correctness, incorrect action → task completion); part 3 validation targets (85% agreement, κ 0.6, directional vs random errors, held-out set); how to read a 78% agreement matrix and the seven false passes.
- `#L341-L460` — Requirements before trusting a judge: agreement on 30–50 diverse labeled cases, chance-corrected κ, few read false passes, explainable failures; worked gate table for the faithfulness judge (78%, κ 0.44, 47% false passes, explainable); false passes as the most dangerous error.
- `#L461-L583` — Part 4: conversations that fail despite every turn passing; conversation-level checks (context retention, state accuracy, coherence); tool-call layers (schema, arguments, semantics); offline A/B rules (one change, full suite, per-metric deltas); part 5 naive 1–5 faithfulness judge scoring 4.2 and why Likert, dual criteria, no standard and no boundaries mislead; rewriting as binary rubric v2.
- `#L584-L700` — Fixing the rubric from judge errors (one boundary rule adds 12 points, removes 5 of 6 false passes); per-metric A/B table where faithfulness +9 but completeness −3 and the blended score hides it; hands-on Judge Calibration Game instructions (24 labels, live κ, gold key, no installs); part 6 project opener.
- `#L701-L820` — Project 2 tasks and definition of done (three binary judges, 40 labels, 85%/κ 0.6 on the worst judge, named loophole, per-metric A/B, reasoned ship call); practice scenario where 94% agreement hides κ 0.24; the 2×2 matrix and false-pass quadrant explanation.
- `#L821-L908` — Week 2 takeaways (four evaluator types, binary single-question judges, humans agree first, validate every judge, false pass is the danger, per-metric A/B); thank-you and week 3 next steps; additional learning by read/listen, do, and shadow.
