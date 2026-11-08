---
source: sources/ai-eval/20261108/supplement/lesson8.en.txt
source_type: text
source_lines: 535
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- Office-hours format — an open Q&A and screen-sharing session for anything blocking progress on the lectures or assignments, with small talk about whether AI makes people do less or more work.
- CLI vs Braintrust discrepancy — a learner's assignment 2 fix showed about +10% locally but only about 5% in the UI, with tool accuracy dropping; Manjeet distinguishes run-to-run drift from a setup mismatch and checks same cases/agent/prompt, one variable at a time, plus the eval traces and logs.
- Build vs optimize — get the pipeline running first (roughly an hour), leave tuning and consistency for iterative work; the API/CLI exposes more than the no-code UI, and evals should graduate into CI/CD rather than live only in a dashboard.
- Tooling — enabling the GEM (Typeface) judge model in Braintrust requires the Settings > Models toggle plus a separate Typeface API key, a typical pattern for onboarding a new model provider.
- Eval as a function — not a separate centralized center of excellence; extend existing functional regression QA, with engineers and PMs owning metric thresholds and go/no-go decisions.
- Catch-up playbook for late joiners — read the GitHub README and week exercises, spend about 30 minutes per week (an hour on week 1 foundations like session and trace), use a chatbot to explain and quiz concepts, and take pen-and-paper notes.
- Staying current — follow 5-10 curated people on X instead of the feed (X is faster than LinkedIn), maintain topic lists (eval, observability, security), use newsletters, and protect 3-4 hours a week on Friday-Sunday with a bookmark backlog.
- Security and domain benchmarks — AI security and guardrails (OWASP risks, indirect prompt injection, agent identity, multi-agent trust) extend eval work, and domain benchmarks across chip design, biotech, legal, and healthcare show the best model passing only about 12%, leaving a long human-in-the-loop road. Next class covers voice agents (latency) and multi-agent testing.

# L2 detail

- `#L1-L30` — Office-hours opening: purpose and format, the instructor's lingering cold, a light question on whether AI reduces or increases workload, and the plan to take questions before extra demos.
- `#L31-L130` — Priyanka's assignment 2 debugging: a keyword-based escalation fix gains about 10% on CLI/PowerShell but about 5% in Braintrust and tool accuracy falls; Manjeet rules out drift versus setup, asks for identical cases/agent/prompt, advises changing one variable, and points to the eval traces and logs.
- `#L131-L180` — Progress check with other learners, the two phases of the work (understanding the flow vs optimizing it), the recommendation to at least get the pipeline running, and no-code UI vs API/CLI and CI-CD automation.
- `#L181-L213` — Enabling the GEM model in Braintrust: Settings > Models toggle, then obtaining a separate Typeface API key before the model appears in scorers, framed as onboarding any new LLM provider.
- `#L214-L246` — Nikhil's question on whether eval should sit with the QA team or become a separate function: eval as an extension of functional regression testing, not a siloed CoE, with engineers and PMs owning thresholds and ship decisions; review of show-your-work submissions.
- `#L247-L300` — Advice for a late joiner: go to the GitHub repo, read the README, spend half an hour per week (an hour on week 1), learn session/trace fundamentals, and use the trace viewer exercises rather than only watching recordings.
- `#L301-L363` — Continued catch-up coaching: describe the material to a chatbot and ask it to explain, keep pen-and-paper notes to avoid dependence, then ask the chatbot to quiz you; a sample week-1 quiz item contrasts public benchmarks with product-level evidence.
- `#L364-L431` — Learning design and staying current: each module's deliverable is its assignment; X beats LinkedIn for currency, follow 5-10 active people via lists, and use newsletters and Substacks; the instructor's own eval/observability/fitness themes.
- `#L432-L495` — Discipline and schedule: combine reading, building, and practicing; protect 3-4 hours across Friday afternoon and the weekend using bookmarks; a new focus on AI security and guardrails; OWASP risks, indirect prompt injection, agent identity, and multi-agent trust.
- `#L496-L535` — Domain benchmark discussion (economy/GDP-style benchmarks, chip design, biotech, finance, legal, healthcare, best model only ~12%), the contrast with 98% coding/math scores, next class on voice agents and multi-agent testing with a guest, and the wrap-up.
