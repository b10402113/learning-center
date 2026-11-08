---
source: sources/ai-eval/20261108/course/lesson7.en.txt
source_type: text
source_lines: 1469
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- Week 4 agenda and the ship-decision frame — past the midpoint of the series; two deep buckets: creating datasets synthetically and evaluating retrieval (RAG). Opens with a live judgment call: a score moved 71% to 74%, should you ship? The discussion stresses same dataset, same cases, judge drift, and watching other metrics.
- RAG is not dead, and AI lies come in three flavors — retrieval survives across classic RAG, agentic RAG, and hybrid keyword-plus-vector search. The three lie types are hallucination, sycophancy, and task fabrication (claiming a $20-30 refund was saved when the ledger was never updated). Citations are the main trust lever.
- Neatlogs observability demo with guest Ajay — traces, collaborative comments, incidents, and "detections" (cheap evals for objective or subjective events). A scheduled open-analysis harness samples traces, finds new failures, auto-creates detections, and backfills; incidents include root-cause investigation and one-click handoff to a coding agent or auto-PR.
- Agent-as-judge vs LLM-as-judge — evals are created like a Google form: trace vs session scope, sampling rules, assignee, and an agentic evaluator that can reason, call tools, and read knowledge bases or CRM data. AI can draft the questions from spans, and insights flow into incidents.
- Trustworthy datasets and cold start — four qualities: representative, diverse, correctly labeled ground truth, versioned. The playbook starts from five or six real traces, expands synthetically, then human spot-checks (about 15%, at least 30-40 of 200-500) before freezing a golden set.
- Synthetic data generation — use the agent's metadata and policies as the coverage map, generate with a small model (GPT-5 nano), tag difficulty/intent/segment, review for diversity, and scale only after quality is confirmed. Teacher/student distillation and small open models are offered as alternatives to a big model.
- RAG evaluation mechanics — offline "make data AI ready" (chunk then embed) and online query -> retrieve -> augmented prompt -> generate, with eight or nine failure touchpoints collapsed into retrieval and generation. Needs question, retrieved context, and answer to compute context precision, context recall, faithfulness, and answer relevance.
- Timing, statistics, and homework — design time, then playground unit tests, batch experiments, and sampled production monitoring (start near 20%). Start around 30 cases, plan backward from the effect, report n with a 95% interval, use paired tests and held-out/regression splits; assignment is 50-100 cases scored with AutoEval.

# L2 detail

- `#L1-L60` — Week 4 level set: midpoint of the series, the two big buckets (synthetic datasets and RAG/retrieval evaluation), guest speaker Ajay from Neatlogs, and the opening "71% to 74%, should you ship?" scenario.
- `#L61-L150` — Ship/no-ship reasoning: three-legged stool of data, judge, and metrics; judge drift and narrowed case counts; "RAG is dead" debate and why retrieval persists; the three flavors of AI lies (hallucination, sycophancy, task fabrication); building trust with citations; session plan.
- `#L151-L236` — Extended Zoom hosting glitch: Ajay cannot share or see chat, co-host promotion fails, the group moves to a Google Meet and returns to the class Zoom afterward.
- `#L237-L330` — Neatlogs walkthrough begins: trace view with images/attachments and collaborative comments; incidents defined as anomalies; detections as cheap evals for objective events (order ID not found) and subjective ones (policy violation); PII/security question; language-mismatch and skill-bloat examples.
- `#L331-L443` — How detections differ from the autonomous monitoring harness: sampled open investigation on a cron, auto-created detections plus backfill, human-in-the-loop chat analysis, incident investigation with fix guidance, and the upcoming automatic-PR feature.
- `#L444-L516` — Evals built like a Google form: trace-vs-session scope, daily rules, sampling percentage, human assignee, agentic evaluator vs single-call LLM judge, AI-generated questions from spans, and how agentic judges can read knowledge bases and Salesforce.
- `#L517-L585` — Ajay's closing advice: free month, Discord channel, eval consultations, the enterprise that took six months for observability, iterate from 70-80% to the last 10-20%, the agent-judge model-routing question, and the break handoff.
- `#L586-L625` — Manjeet's reflections on the demo: traces and sessions are table stakes, root-cause analysis is the real value, chat precedes proactive RCA, and planning steps generate many spans.
- `#L626-L700` — Agent failure causes (wrong tool, bad retrieved context, memory compaction), "a good metric cannot fix a bad dataset", the golden/silver naming, the four qualities of a trustworthy dataset, and a cold-start playbook from a handful of real traces.
- `#L701-L815` — Live synthetic-data demo for the Pronto agent: policy-driven coverage (full refund if spoiled/damaged within 24 hours), output format choice, GPT-5 nano, teacher/student distillation, reviewing easy/medium/hard cases, and generating five before scaling to 50-100.
- `#L816-L900` — Q&A on dataset minimums (five jobs-to-be-done times ten equals about 50), refresh triggers, SDG demo from agent metadata, turn-level vs conversation-level validation, and using Q&A pairs from the knowledge corpus.
- `#L901-L990` — Dataset versioning in Braintrust: upload/import JSON, descriptive names, playground vs experiment (unit test vs batch job), human spot-checking about 15%, and the brown-bag method for sourcing expert examples.
- `#L991-L1063` — Retrieval pipeline theory: offline file chunking and embedding ("make data AI ready"), online retrieve-augment-generate flow, eight or nine failure touchpoints, and the three inputs plus core metrics context precision, faithfulness, and answer relevance.
- `#L1064-L1166` — Q&A on trend charts and alerts, chunk-size tradeoffs and embedding models, printing retrieved chunks into traces, top-k ranking (top 10 typical), and diagnostics: low context precision means a knowledge gap, faithfulness below 0.8 means hallucination, low answer relevance means a generation problem.
- `#L1167-L1290` — When to evaluate: design time, playground unit tests, batch experiments, then sampled production monitoring with a slider (start about 20%); agentic vs structured RAG; recall; Ragas scoring 0-1 with a below-0.7 threshold; precision vs recall; and span/trace/session scope with resolution-rate agent judging.
- `#L1291-L1375` — How many cases to trust a result: start near 30 (10-15% rule), plan backward from the effect, lower sampling as confidence grows, stop after 10-20 clean traces, report n and intervals with overlapping datasets, and split regression vs held-out tests because agents behave differently when tested.
- `#L1376-L1469` — Homework and wrap-up: 50-100 cases built in small iterations, the AutoEval script and reading low context precision/recall/faithfulness scores, book bonuses for show-your-work submissions, next week's voice-agent and multi-agent topics, the fresh-graduate hiring discussion, and the session-length request.
