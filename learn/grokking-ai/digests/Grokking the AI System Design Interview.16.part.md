---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.16.part.txt
source_type: text
source_lines: 1916
part: 16
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Lesson 44, Design AI-Powered Search — frames "add AI answers" as an integration problem, not a greenfield RAG build: a **spine** (classic search, ~300 ms, 10K QPS) and a separate **lane** (async cited answer). Names the two governing decisions (when to trigger, how to ground), the two ledgers (lane gains vs spine losses), a small in-house trigger classifier against a bought mid-tier synthesizer, an adversarial open-web corpus behind quality and injection filters, a semantic answer cache with category TTLs, fail-closed behavior, and the $8.6M/day cost of answering every query.
- Lesson 45, Design a Text-to-Image Service — breaks the synchronous assumption because one image costs ~10 GPU-seconds: API validates, moderates, enqueues a job and returns a job ID, and long-lived workers on a warm pool do the work. Covers per-tier priority queues (queue depth as autoscaler, wait display, and revenue lever), a model portfolio from prompt enhancer to upscaler, three safety gates (prompt, image, provenance), and the fleet math — 2M images/day → ~250 busy GPUs, ~500 at peak, roughly $20K–$45K/day, with steps and resolution as tiered cost dials.
- Lesson 46, Safety and Guardrails — the root cause is that an LLM reads instructions and data through **one channel**, so prompt injection is a risk to reduce, not a bug to remove. Distinguishes direct injection (user is attacker) from indirect injection (user is victim), argues the model cannot guard itself, and lays out the four-layer guardrail sandwich (input gate, hardened assembly, output gate, action gate with hold-and-kill streaming). Ends with operating discipline: versioned thresholds, misses and false positives measured together, red teaming in CI, and a 2 AM config flip.

# L2 detail

- `#L1-L30` — Lesson 44 vocabulary: spine, lane, trigger classifier, synthesizer, passage, extraction cache, TTL, Zipfian traffic, indirect prompt injection, session success.
- `#L31-L76` — Part 1 frames the problem: an integration task on an existing 300 ms / 10K QPS engine; names the spine vs lane split, the two governing decisions, and the scope (English text answers only).
- `#L77-L162` — Part 2 defines success with two ledgers (groundedness, citation accuracy, session success vs results latency, clicks, reformulations, ad revenue); introduces good abandonment and the 300 ms / 1–2 s latency posture.
- `#L163-L198` — Part 3 maps the data: reuse the crawled corpus, pre-extract passages into an extraction cache at crawl time, learn trigger labels from search logs plus human raters, and keep a golden set; covers freshness differences.
- `#L199-L322` — Part 4 picks the models: an in-house gradient-boosted trigger on CPUs and a bought mid-tier synthesizer; the query-type table (navigational, transactional, exact lookup, medical/legal, breaking news) and the two RAG twists (retrieval exists, corpus is adversarial).
- `#L323-L488` — Part 5 designs the serving path: the UX contract (results first, async answer, fail closed), a nine-step walkthrough of the heat pump query, per-claim grounding, source-quality gating, sandboxing indirect injection, and the semantic answer cache.
- `#L489-L584` — Part 6 keeps it working: session success feeds the trigger, cache TTLs, and the golden set; offline groundedness audits sample ~1 in 1,000 answers, freshness monitoring tracks source churn, and a session-level A/B test plus shadow/canary rollout gates changes.
- `#L585-L655` — Part 7 counts the costs: 864M queries/day, the trigger × cache-miss × cost-per-answer ledger (20% × 50% → 86.4M answers, ~$864K/day), a fail-closed failure table, and the publisher-cannibalization strategic tension.
- `#L656-L674` — Part 8 gives the 30-second interview answer and three follow-ups (why not answer every query, customer-support help center, e-commerce product questions).
- `#L675-L700` — Part 9 common mistakes (building a new system, putting the answer on the results clock, trusting every top result, measuring the lane alone) and key takeaways.
- `#L701-L729` — Lesson 45 vocabulary: diffusion model, denoising step, seed, GPU-second, job, worker, warm pool, idempotency key, dead-letter queue, provenance.
- `#L730-L759` — Part 1 frames the image service: 2M images/day, four per prompt, ~500K jobs, ~10 GPU-seconds per image; explains why the request must be asynchronous with polling or progress events.
- `#L760-L787` — Part 2 defines success on both sides: fleet utilization as the business, plus wait time by tier, pick-or-upscale share, and safety incident rate; splits the wait into acceptance, queue, and generation.
- `#L788-L829` — Part 3 maps the data: a one-line prompt in (hence a prompt enhancer), a rich job record out (prompts, model version, seed, settings, gate scores), and the four-image grid as an implicit preference test.
- `#L830-L880` — Part 4 picks the model: diffusion in two sentences, a baseline model, then a portfolio of flagship, fast variant, upscaler, and prompt enhancer chosen by tier and surface.
- `#L881-L1012` — Part 5 designs the serving path: validate/moderate/enqueue/return a job ID, an eight-step lighthouse job walkthrough, priority queues per tier, long-lived workers with trend-based autoscaling and a warm pool, and idempotency plus dead-letter handling.
- `#L1013-L1132` — Part 6 keeps it working: the three gates (prompt, image, provenance with watermark/content credentials/takedown hash), selection data tuning the enhancer, ratcheting thresholds, the three-part incident response, and the fleet dashboard.
- `#L1133-L1246` — Part 7 counts the costs: from 23 images/sec to 250 busy GPUs to ~500 at peak, a $20K–$45K daily bill, steps and resolution as the image-specific cost lever, plus the failure ledger and graceful degradation when the queue backs up.
- `#L1247-L1272` — Part 8 gives the 30-second answer and follow-ups on video generation, avatar/product-image generators, and a model that triples GPU-seconds.
- `#L1273-L1303` — Part 9 common mistakes (holding the request open, checking only the prompt, treating GPUs like web servers, one model for everyone) and key takeaways.
- `#L1304-L1325` — Lesson 46 vocabulary: system prompt, input gate, hardened assembly, least privilege, output gate, action gate, RLHF, red teaming, false positive/over-refusal.
- `#L1326-L1410` — Part 1 establishes the root cause with the support assistant: four context sources (system prompt, customer message, order notes, help articles) arrive as one token stream; compares to SQL injection and concludes prompt injection is reducible, not removable.
- `#L1411-L1450` — Part 2 separates direct injection (jailbreaking, user attacks the company) from indirect injection (planted content, user is the victim), shows how tools turn a bad reply into a real action, and argues the system prompt should be treated as public.
- `#L1451-L1509` — Part 3 explains why alignment training only nudges probabilities, why smarter models are not automatically safer, and gives the "intern with no security training" one-liner with its line-by-line comparison.
- `#L1510-L1590` — Part 4 lays out the guardrail sandwich: input gate (10–50 ms), hardened assembly, model (~2 s), output gate with hold-and-kill, and the action gate; every layer except the model is ordinary code.
- `#L1591-L1615` — Part 5 details the input gate: a moderation classifier for policy and cost defense, plus rate and reputation checks that run in parallel; it cannot see content that enters later.
- `#L1616-L1650` — Part 6 covers hardened assembly: wrap and tag untrusted text as data, filter injection patterns at ingestion time, and apply least privilege so absent data cannot be stolen.
- `#L1651-L1698` — Part 7 covers the output and action gates: moderation, data-leak and policy checks, incremental hold-and-kill streaming, and the three action-gate questions (allowlist, limits, human approval).
- `#L1699-L1843` — Part 8 runs safety as a system: versioned thresholds, blocklists and refusal templates as config; misses and false positives measured per category; continuous red teaming in CI; and the 2 AM config-flip response with cause-specific lasting fixes.
- `#L1844-L1858` — Part 9 prices the sandwich: ~30 ms input gate, a few ms for assembly, output checks overlapping streaming, roughly 50–100 ms on a 2-second reply, and blocked requests saving money.
- `#L1859-L1916` — Part 10 gives the 30-second safety answer and follow-ups, then common mistakes (trusting the system prompt, guarding only input, skipping hardened assembly, secrets in the prompt, measuring only misses, red teaming once) and key takeaways.
