---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.25.part.txt
source_type: text
source_lines: 2386
part: 25
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Lesson 66 · Introduction: Rapid Review — No new material. The module trains recall instead of recognition, and gives three tools that each find a different weakness: rapid-fire questions (can you explain it without help?), red flags (does your wording hide what you know?), and decision cheat sheets (do you know the fact that decides between options?). A drill has five steps — cover the answer, answer out loud on about a 30-second timer, check and mark misses, go back to the lesson for one sentence of your own, then drill the miss again on a later day until two correct answers on two different days. The miss list is the real study plan; a two-week schedule runs rapid-fire first, then the cheat sheets, then the red flags, with the miss list and at least one recorded case study throughout.

- Lesson 67 · Rapid-Fire Questions — Twenty-five short questions grouped by module, each with a hidden answer linked to its lesson. A pass requires naming the deciding variable without a hint; a keyword without its reason is a miss. The bar is 20 or more out of 25, and the loop returns only to missed questions on a later day. The questions cover the family test, feature stores and training-serving skew, batch versus online, drift, funnels and position bias, calibration, fraud feedback loops, prefill/decode and the three shelves of optimizations, RAG versus fine-tuning, RAG failure triage, permission enforcement, agents, tool calls as requests, autonomy, and the 45-minute split.

- Lesson 68 · Red Flags That Sound Junior — Twelve sentences that make a candidate sound less experienced, each with the problem and a stronger sentence, placed on the clock where its fix belongs. The set covers ranking with an LLM, pretraining your own model, "fast and accurate", a diagram that ends at the response arrow, model calls treated as free, fine-tuning hallucination away, permissions in the prompt, "the model will just know", an unbounded agent with admin access, a team of agents, brand names as the architecture, and expecting wrong answers to raise errors. Three meta-flags (depth only on demand, fighting follow-ups, the invisible user) and a self-audit drill that counts Flags 3, 4, and 5 first finish the lesson.

- Lesson 69 · Decision Cheat Sheets — Seventeen-plus decisions, each as a compact table that leads with its deciding variable, the options it picks, and a default: question family, offline metric, where a feature is computed, build versus API, prompting/RAG/fine-tuning, workflow versus agent, one agent or several, batch/online/streaming, synchronous versus asynchronous, vector/lexical/hybrid retrieval, vector store choice, how much grounding, fail open or fail closed, evaluation layer, how a change ships, retraining cadence, where savings come from, router versus cascade, and hosted API versus self-host. Part 9 adds the one rule with no variable — permissions live in code, never in the prompt, after generation, or in the weights — and Part 10 puts every sheet on one page for reflex practice.

# L2 detail

- `#L1-L15` — Lesson 66 vocabulary: drill, miss, miss list, spaced review, red flag.
- `#L16-L29` — Part 1: the module teaches no new material; it trains recall, illustrated by two candidates answering "Why not fine-tune the model?".
- `#L30-L43` — Part 2: what a strong answer to a follow-up does — choice then reason, the number labelled as an example, and the failure case or fallback.
- `#L44-L81` — Part 3: the three review tools, what a miss in each one tells you, why to use all three, and three wrong ways to use them.
- `#L82-L152` — Part 4: the five-step drill, why a correct answer costs only about 30 seconds, and why step 5 uses spaced review.
- `#L153-L250` — Part 5: an example two-week schedule (rapid-fire, then cheat sheets, then red flags, then the miss list only), keeping recorded case studies in the plan, and what to do with less time.
- `#L251-L335` — Part 6: the module-by-module table of where to go back when you miss, and why to restart from a module's overview.
- `#L336-L373` — Part 7 plus takeaways: the four lessons of the module, the order to use them, and the module summary.
- `#L374-L471` — Lesson 67 how the drill works: the four steps, spoken recall versus recognition, the 20-of-25 bar, and the module-to-question map.
- `#L472-L543` — The 25 rapid-fire questions by module (family test, training versus serving, feature stores, batch/online, drift, funnels, position bias, calibration, fraud, prefill/decode, GPU limits, optimization shelves, RAG versus fine-tuning, LLM evaluation, RAG triage, hybrid search, permissions, hallucination, async image service, prompt injection, workflow versus agent, second agent, tool call as request, autonomy, the 45-minute split).
- `#L544-L564` — Lesson 67 mistakes and takeaways: reading instead of speaking, passing on a keyword, rereading every answer; pass names the deciding variable.
- `#L565-L604` — Lesson 68 vocabulary, Part 1: flags, borderline decisions, pattern matching, why one sentence can cost an interview, and the "negative space" framing.
- `#L605-L722` — Part 2: the four-part layout of each flag, how to practise it, and the diagram placing all twelve flags on the 45-minute clock.
- `#L723-L764` — Part 3: Flag 1 (an LLM ranks the feed) and Flag 2 (first, we train our own model), with the stronger sentences.
- `#L765-L826` — Part 4: Flags 3–5 ("fast and accurate", the diagram ends at the response arrow, every call is free), the three axes of a success statement, the loop with labels, and unit cost times volume with the three shelves.
- `#L827-L885` — Part 5: Flags 6–8 (fine-tuning hallucination away, permissions in the prompt, the model will just know), and the grounding layers and golden set that replace them.
- `#L886-L967` — Part 6: Flags 9–12 (unbounded agent with admin access, a team of agents, brand names as the architecture, expecting errors to catch wrong answers), with budgets, the three justifications for a second agent, and wrong-but-200-OK as the default AI failure.
- `#L968-L1005` — Part 7: three meta-flags — depth only on demand, fighting the follow-up, the invisible user.
- `#L1006-L1036` — Part 8 plus takeaways: the five-step self-audit from a recording, why Flags 3, 4, and 5 come first (one rubric row each), and the summary.
- `#L1037-L1080` — Lesson 69 vocabulary and Part 1: why decisions need a sheet, the three parts of a sheet, what a sheet is not, and why "it depends" needs three more things.
- `#L1081-L1197` — Part 2, Sheet 1: which family — the output picks the family, and the family picks the starting shape and four design centers.
- `#L1198-L1270` — Part 3, Sheet 2: which offline metric — problem family plus base rate, mapping rare positives to precision/recall/PR-AUC, funnel head to recall@k, final order to NDCG, single answers to MRR, numbers to MAE/RMSE plus p90, and generated content to the pyramid.
- `#L1271-L1310` — Part 4, Sheet 3: where each feature is computed — batch, streaming, or request time by freshness need.
- `#L1311-L1502` — Part 5, Sheets 4–7: build versus call an API (whether quality lives in your own logs), prompting/RAG/fine-tuning (what is actually failing), workflow versus agent (can the flowchart be written at design time), and one agent or several (what a second agent adds).
- `#L1503-L1755` — Part 6, Sheets 8–13: batch/online/streaming, synchronous versus asynchronous, vector/lexical/hybrid retrieval with RRF, which vector store, how much grounding by stakes, and fail open or fail closed by which error costs more.
- `#L1756-L1987` — Part 7, Sheets 14–16: the three-layer evaluation pyramid, the shipping ladder (offline, shadow, canary or A/B, ramp) plus the agent autonomy ladder, and retraining cadence from measured decay.
- `#L1988-L2112` — Part 8, Sheets 17–19: the three shelves of savings (avoid, tune the engine, change the model), router versus cascade by when difficulty is visible, and hosted API versus self-host by sustained volume against fleet cost.
- `#L2113-L2126` — Part 9: the one rule with no variable — permissions live in retrieval and the tool runtime, never in the prompt, never after generation, never in the weights, and fail closed.
- `#L2127-L2386` — Part 10 plus takeaways: the full summary table of all decisions with their deciding variable, default, and lesson; the five-step reflex practice on the table; and the lesson summary.
