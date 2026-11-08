---
source: sources/ai-eval/20261108/course/lesson5.en.txt
source_type: text
source_lines: 1729
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- Safety framing and the lethal trifecta — an LLM treats everything in its context window as equally authoritative, so an agent becomes dangerous when it combines access to your data, the ability to act or communicate externally, and ingestion of untrusted content. That combination lets an attacker leak data, change permissions, or redirect the agent.
- OWASP agent top-10 — a course-made video walks through goal hijack, tool misuse, identity/privilege abuse, agentic supply chain, unexpected code execution, memory/context poisoning, insecure inter-agent communication, cascading failures, human-agent trust exploitation, and rogue agents, plus a discussion of silent model-version drift.
- Pronto live demo — attacking the course's customer-support agent: a normal order lookup, a benign "wife's order" request blocked by keyword escalation (over-block), a $12 refund allowed under the $50 cap, an $85 refund escalated, and system-prompt extraction with guardrails off then on. Tracing spans show the missing ownership authorization.
- Guardrail layers and detectors — deterministic input filters before the model, keyword escalation lists, small classifier/Jev decision models, Presidio for PII, and output-side checks; the tradeoff is catch rate versus over-block rate, since over-blocking genuine users costs adoption.
- Adversarial dataset construction — every test needs an input, expected behavior, category, and the agent's tools/permissions (CRUD scope); generate ~100 cases per category with an LLM, add mutations (tone, politeness, social engineering, multi-turn), review with SMEs in a brown-bag session, then feed failures back into the suite.
- Tracing and eval operations — Braintrust, Neatlog, and LangFuse traces are the persistent audit source of truth; LLM-as-judge versus agent-as-judge (whole multi-turn session); agents that read traces, find root causes, and open fix PRs form a self-healing/recursive self-improvement loop, with token-cost and PII caution.
- Metrics and ship decisions — present both catch rate and over-block rate (2x2 confusion matrix), normalize percentages to call volume, and triage by severity/blast radius rather than raw failure count; illustrative target of ~95% catch with a low over-block ceiling.
- Layered defense and evaluator funnel — apply guardrails at platform, model, harness, and app layers; closed models are hardening while open-source models are unverified; use code checks for high volume, classifiers/Jev for binary decisions, and full LLM reasoning only for subjective or complex checks; zero trust and sandboxing (CaMeL paper) as injection defenses.

# L2 detail

- `#L1-L115` — Class logistics: week-2 recap on aligning LLM judges with human annotation; GitHub becomes the single source of truth for assignments; AI eval book distribution; a wrong Zoom link fragments attendance.
- `#L116-L255` — Why agent security is a wild west: LLM takes all context at face value; lethal trifecta of data access, external communication, and untrusted content; OWASP agent top-10 video (goal hijack through rogue agents); drift as silent model-version change; plan to demo attacks on the Pronto agent.
- `#L256-L360` — Demo setup: rule-based skeleton agent versus the full agentic-loop agent; tracing via Braintrust and Neatlog/LangFuse; a Gradio chat UI wrapper; a guardrail on/off switch; where controls sit across input, loop, model provider, and output.
- `#L361-L475` — Demo part 1: normal order-status request traced span by span; the missing check is "who is asking"; wife's-order request triggers a keyword escalation list (lawsuit/legal/hospital); $12 refund auto-approved under the $50 cap; audience raises ownership and abuse validation.
- `#L476-L570` — Demo part 2: $50 threshold is a business trust decision; $85 refund escalates correctly; validation gaps (duplicate refunds, wrong recipient); product-security datasets and hacker programs as sources; system-prompt extraction blocked; guardrail-on response blocked before the model; catch versus over-block, since blocking genuine users hurts adoption.
- `#L571-L690` — Observability and detectors: why persistent traces matter for offline eval and dataset growth; wiring LangFuse/Braintrust; classifier confidence scores for toxicity/bias; Jev decision model as a cheap binary classifier; Presidio open-source PII scanning.
- `#L691-L810` — Attack taxonomy: prompt injection via white-text hidden email instructions, jailbreak versus injection, data leakage; cheap-detector funnel; regulated-industry compliance; emotional and multi-turn jailbreaks; dedicated red-team function; OpenAI–HuggingFace long-running agent incident; break.
- `#L811-L920` — Building the adversarial dataset: required input/expected-output/category columns; map agent tools and CRUD permissions; generate 100 tests per category with a detailed prompt; mutation across tone/politeness/social engineering; SME brown-bag review and internal hacker interest group; three-part strategy and failure-to-test loop.
- `#L921-L1000` — Red/blue team logistics: outsourcing or third-party certification for critical platforms; preview launches; emerging forward-deployed red-team roles; trigger evals on any agent-stack change; full suite on model swaps, small regression set on prompt or single-tool changes.
- `#L1001-L1140` — Eval operations: traces as immutable audit record; synthetic data and scheduled/sampled runs in the tool; assigning human annotation to colleagues; LLM judge versus agent judge for whole sessions; decision/classifier models for binary routing and tool choice.
- `#L1141-L1270` — Agent-as-judge demo: asking Neatlog about recent trace errors; root-cause clustering (timeouts, simulated CRM/payment failures); recommendation quality; the loop that writes a fix and opens a PR; token cost is unavoidable; PII/PHI risk in raw transcripts.
- `#L1271-L1420` — Metrics and ship decisions: visualizing error mix; PII redaction gaps in startup tools; catch rate has a known denominator only in red teaming, production does not; 2x2 caught/missed/allowed/over-blocked matrix; V1 versus V2 ship choice; severity and blast radius; normalize "10%" by volume; Promptfoo and assignments.
- `#L1421-L1521` — Recap and defense in depth: adversarial testing is not quality testing; indirect injection is hardest and grows with tools; always both metrics; guardrails at platform, model, harness, and app layers; open-source model risk; evaluator funnel from code checks to classifiers to small models to full LLM reasoning.
- `#L1522-L1729` — Q&A: the self-healing/recursive self-improvement loop (40% to 80% auto-resolution goal); evaluate multi-agent systems both as a black box and per-agent handoffs; incident priority and P0 criteria; guest/authenticated/agent identities; authorization versus injection; zero trust context, sandboxing, and the CaMeL "defeating prompt injection by design" paper.
