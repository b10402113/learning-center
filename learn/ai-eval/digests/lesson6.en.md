---
source: sources/ai-eval/20261108/supplement/lesson6.en.txt
source_type: text
source_lines: 545
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- Office-hours format — learners walk through spreadsheets of traces scored pass/fail with columns for policy escalation and tool-call accuracy; they export from tracing tools, then group failures into themes and feed them back into the eval dataset.
- Policy values belong in a system of record — putting the $50 refund threshold only in the prompt causes drift as prompts grow; move thresholds and IDs into a CRM/table that the agent and the judge both read, so policy changes do not desynchronize three places.
- Judge iteration is normal — a learner iterates three judge versions using hand-scored examples as few-shot context and tool-calling improvements; different providers and model sizes need their own tuned prompts, and small versus large models disagree.
- Deterministic versus subjective evals — code checks win for high-volume format validation, classification, tool choice, and routing (e.g., L1/L2/L3 escalation); LLM judges are for summaries and open text, and the rubric must match the user's actual preference (short versus detailed).
- Eval cadence — offline evals deliver most value early; add online judges and monitoring when the cost of being wrong is high; run regression evals as GitHub Actions on every PR, full suite on model changes, small targeted sets on prompt or single-tool changes.
- Sandboxes and the eval-data market — agents built on Salesforce/Workday need simulation or digital-twin environments to verify scenarios, a growing vendor market; dataset vendors (ScaleAI, Mercor) and expert human-eval gigs (Micro1, roughly $70–$1,000/hour) supply domain data, and physical/humanoid robotics is the next complex eval frontier.
- Closing Q&A — an agent exploited an addition tool to perform multiplication, prompting advice to add an "explain why" field to the rubric and inspect tool-choice reasoning rather than assume the model's behavior.

# L2 detail

- `#L1-L60` — Office-hours opening: a learner's week-2 spreadsheet (overall pass/fail, policy escalation, tool-call accuracy) built from exported traces; the agent shifts from rule-based to real tool calls at row 30; next steps are grouping failures into themes and folding them back into the dataset.
- `#L61-L137` — Where policy numbers live: keeping thresholds in prompts works initially but drifts as prompts grow; move dollar limits and customer/case IDs to a CRM or table as the source of truth, have the agent and judge read from it, and update in one place when business rules change.
- `#L138-L243` — Iterating judges and choosing eval type: a learner improves judge accuracy over three versions with hand-labeled few-shots; judge prompts need per-provider tuning; summarization quality is preference-dependent while format, choices, tool calls, and escalation routing should be deterministic code or classifiers.
- `#L244-L340` — More learner check-ins: a non-coder completes the assignment with Claude/Gemini help and hits a script path issue; book eligibility; one learner's GPT-4o mini, Haiku, and Sonnet judges disagree, with policy-adherence agreement at 65%/85%/85%; prompts must be tuned per model family and re-validated with extra examples.
- `#L341-L460` — Offline versus online evals for a nascent agentic search product: add online monitoring when the cost of being wrong (money, dissatisfaction, jailbreak/data risk) rises; use GitHub Actions regression checks on PRs; run the full suite on model swaps and small targeted sets on prompt or tool changes; sandbox or digital-twin simulation is needed when the agent depends on Salesforce/Workday and cannot hit production.
- `#L461-L545` — The eval-data economy and closing: ScaleAI, Mercor, and Micro1 sell domain datasets and expert human evaluation (about $70–$1,000/hour for annotation plus scenario creation); humanoid/physical-AI evaluation is framed as the hardest simulation problem; final question on an agent abusing an addition tool to multiply, answered by adding an explanation field to the rubric and inspecting tool-choice reasoning.
