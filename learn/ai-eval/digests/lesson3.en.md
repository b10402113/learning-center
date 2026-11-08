---
source: sources/ai-eval/20261108/course/lesson3.en.txt
source_type: text
source_lines: 1971
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- Week 2 framing — a five-minute recap of week 1's Pronto traces and annotation exercise, a walkthrough of the two demo agents (a deterministic regex/table agent with no API-key dependency vs an OpenAI + Braintrust agent), and the claim that untrustworthy evals come from two causes: a bad rubric and an unaligned LLM judge.
- Agent mental model — an agent is a model plus a harness with five attributes (role, data/context, action/tools, guardrails, channel); single-turn vs multi-turn evaluation; and the session → turn → span trace hierarchy where follow-up turns join a root session ID into a "staircase" view.
- Eval tooling landscape — Braintrust, DeepEval, Ragas, LangSmith, Langfuse, Neatlogs and the consolidation wave (Galileo→Cisco, TraceLoop→ServiceNow); table-stakes features (dashboards, playground, datasets, scorers, SDK/API) vs real differentiation (finding failure clusters, incidents, auto-fixes). UI is for exploring results; CLI and CI/CD are for running eval suites.
- Four evaluation methods — code-based checks (valid JSON, Salesforce/Workday record actually updated), LLM-as-judge for subjective text, human review on real traces, and explicit (thumbs up/down) plus implicit user feedback (Cursor's rejected suggestions, users re-asking the same question); a three-level metric hierarchy of business outcome/risk, agent quality/execution, and low-level retrieval metrics (F1, precision, recall, BLEU).
- Judge design and cost — use a different, ideally smaller model than the generator; judge prompts are an auditor role with a single question, PASS/FAIL definitions, boundary examples, score scale and rationale; fine-tuned ~7B judges served 70–80% of the author's evals, and system-1/classifier models (the "Jev" model) suit tool-call and routing checks. LLM councils are overkill except high-stakes domains like legal.
- Judge validation — compare judge labels with human labels on the same set, target ~85% agreement (90% for agents) and Cohen's κ ≥ 0.6; read false passes together, add boundary rules, retest on the same set, then check a held-out set; the author needed six or seven alignment rounds over about a month.
- Multi-turn and production — conversation-level checks (task completion, escalation rate, context retention) vs per-turn checks, trajectory/tool-call eval, retrieval quality, instrumentation via project ID + API key, importing traces across platforms, and agent-on-traces tools that cluster incidents and can push a fix PR.
- Sampling and A/B — human-label about 50 sampled traces per round even when the judge scores 100k; offline golden sets of ~100–400 cases, online eval at a 5–10% sample rate; A/B prompt or model changes one variable at a time, read per-metric deltas, and write explicit ship/no-ship gates into the one-page spec; the judge calibration game demonstrates agreement, κ, and mismatches with no code.

# L2 detail

- `#L1-L120` — Welcome and week 2 logistics; week 1 recap of 20–40 trace annotation and office-hour questions; why two demo agents exist (rule-based, no API key vs OpenAI + Braintrust); untrusted evals traced to bad rubrics and unaligned judges.
- `#L121-L280` — Model vs agent (harness) and the five harness attributes; role-specific agents; single-turn vs multi-turn evaluation with customer-support examples; session/turn/span trace hierarchy; the Hugging Face OpenAI-agent guardrail bypass and the case for third-party certifications.
- `#L281-L440` — Week 2 plan and time budget; vendor landscape and M&A consolidation; table-stakes vs differentiated eval tooling; demos of LangSmith, Braintrust and Neatlogs; detectors are just metrics; 1,000–3,000 span lines per conversation; UI for exploration, CLI/CI-CD for running jobs.
- `#L441-L610` — From annotated taxonomy to an automated judge; choosing code-based checks vs LLM judge vs human review vs user feedback; explicit and implicit feedback (Cursor); verifying agent actions against source-of-truth systems; the system-1 classifier model and eval cost blowup; the three-level metric hierarchy.
- `#L611-L730` — Q&A on code-based checks (JSON validity vs 95%-accurate LLM check), runtime vs offline checks (PII masking, guardrails), and implicit signals such as a user repeating a question; the build-test-deploy loop, cost, and where human review is genuinely needed.
- `#L731-L850` — Rubrics built from real traces; do not use the generating LLM as the judge; big vs small judge models by pipeline step (identity/permissions, reasoning, retrieval, generation); hybrid routing; fine-tuned 7B judges at 70–80% of eval volume; LLM councils and Harvey-style high-stakes exceptions.
- `#L851-L1010` — Pass/fail vs Likert scales, rationale, and pass thresholds; anatomy of a judge prompt (auditor role, criteria, few-shot good/bad examples, output format); Braintrust scorer template for factuality/faithfulness; Langfuse LLM-judge vs code-evaluator builders; then cost and 10–30% LLM drift.
- `#L1011-L1160` — Break and eye-strain exercise; why a judge must be proven reliable before shipping; agreement with human labels; Cohen's κ formula, 0.6 benchmark, 85% agreement target; reading false passes; gates written into the one-page spec; risk-based and staggered launches.
- `#L1161-L1330` — Multi-turn conversation evaluation with the Alexa shopping agent demo; context-retention failures across turns; instrumenting Pronto into Braintrust via project ID/API key; importing traces; session/span browsing; agent-on-traces "loop" that clusters failure modes and connects to GitHub to propose fixes.
- `#L1331-L1500` — Q&A on improving a judge (prompt/context fixes, iterate on the disagreement set then held-out data, 6–7 rounds to 85–90%); how many human labels (about 50 sampled from 100k); local Ollama judge on a laptop; model routing between SLMs and big models; preferred judge models (Gemini, GPT-4o/mini).
- `#L1501-L1680` — Startup adoption advice: jobs-to-be-done, positive/negative scenarios, generated variations, metrics and gates, trace→regression-test promotion; per-component agent eval (tool call/trajectory, retrieval) and small classifier judges; A/B testing, the AI sandwich stack, and drift from prompt/model/data changes.
- `#L1681-L1830` — Binary rubrics; the correct-but-ungrounded answer as a fail case (retrieval/faithfulness problem); side-by-side metric tables; the no-code judge calibration game (human labels, judge prompt, κ 0.5, three mismatches); assignment 2 instructions and 90% agreement goal.
- `#L1831-L1971` — Recap of evaluator types, judge prompts and alignment; offline golden sets of 300–400 (100+ is the sweet spot) vs online sampling at 5–10%; ML metrics vs agent eval differences; learning styles (listen, watch, do, read, shadow); closing logistics.
