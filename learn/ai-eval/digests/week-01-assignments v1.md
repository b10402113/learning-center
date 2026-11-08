---
source: sources/ai-eval/20261108/supplement/code/week-01-assignments v1.txt
source_type: text
source_lines: 64
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- Project 1 brief — Week 1 assignment sheet for the Pronto support agent: clone the course repo (`github.com/coachmanjeet/AI-Agent-Evals-Course`), run `make setup` and `make agent-demo`, then either wire LangSmith `@traceable` tracing into `agent/agent.py` or use the zero-key browser Trace Viewer. Deliverables are 30 annotated traces and a `taxonomy.md` with five-plus binary failure codes; acceptance criteria, a worked example, and logistics (4–7 hours, White belt) are spelled out.

# L2 detail

- `#L1-L10` — Title (Week 1 / Project 1: Instrument, Trace, and Analyze the Pronto Agent), course and instructor (Manjeet Singh), repo URL, ordered setup commands (`git clone`, `make setup` ~3–5 min and creates `.env`, `make agent-demo`), the three LangSmith env lines (`LANGSMITH_TRACING`, `LANGSMITH_API_KEY`, `LANGSMITH_PROJECT=ai-evals-course`), and Path A (LangSmith) vs Path B (Trace Viewer, no keys); commands run from repo root, assignment files under `week-01-eval-foundations-and-error-analysis/assignments/01-instrument-and-trace/`.
- `#L11-L19` — Assignment 1 goal (every run leaves an inspectable trace) and Path A steps: add `from langsmith import traceable` and `@traceable` above `run()` and each tool (`get_order_status`, `issue_refund`, `lookup_policy`, `escalate_to_human`), confirm runs in the `ai-evals-course` project, run the 30 `inputs.json` cases through `starter.py` (10 order/refund incl. over-$50 and late delivery, 10 policy/warranty traps, 10 multi-turn incl. prompt injection, PII extraction, legal threats), and fill `annotations.csv` (`pass_fail` = pass/fail lowercase, one-line `note`).
- `#L20-L24` — Path B steps: run `export_otel.py` to replay the 30 inputs into `pronto-traces.json` with no keys, upload to the hosted Trace Viewer, annotate all 30 there, and export the annotations as the deliverable.
- `#L25-L31` — Worked annotation example: the moldy-strawberries input `PRN-10421` gets verdict FAIL because the agent returned order status instead of starting a refund flow and never asked for the 24h photo, coded `MISSED_REFUND_INTENT`; contrast with a PASS where an $85.40 partial-miss refund is correctly escalated for over-$50 approval.
- `#L32-L35` — Assignment 1 acceptance criteria: all 30 runs produce inspectable traces, 30 annotated rows with pass/fail and note, aim for 5+ genuine fails; if the deliberately policy-correct demo yields fewer, document that finding and build codes from near-misses flagged as such.
- `#L36-L44` — Assignment 2 goal and steps: re-read every failing trace, cluster into 5+ binary yes/no codes (examples `WRONG_TOOL`, `REFUND_POLICY_MISQUOTE`), count how many of the 30 hit each code (non-exclusive), map each code to one of the six quality dimensions, and write `taxonomy.md` with top 3 failure modes plus 1 unexplained anomaly.
- `#L45-L52` — Assignment 2 acceptance criteria (5+ defined binary codes, frequency counts summing above 30 allowed, a quality-dimension mapping, top 3 plus anomaly, codes another person could apply consistently), the `starter.md` template to copy into `taxonomy.md`, and the stretch of repeating source → annotate → cluster on a work agent.
- `#L53-L59` — Project 1 definition of done: every run traced with inputs, tool calls and timing; all 30 annotated; 5+ named binary codes; frequency counts for ranking; write-up naming 3 findings and 1 anomaly with trace IDs; each code mapped to a quality dimension.
- `#L60-L64` — Logistics: 4–7 hours (~2–3h Assignment 1, ~2–4h Assignment 2), due before the Week 2 live session, White belt on completion (first step to the Green belt book bonus), submit to "Show Your Work" titled "Name — top failure mode" with `taxonomy.md` or the viewer export, and keep the unexplained anomaly for a later week.
