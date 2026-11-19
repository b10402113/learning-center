---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.1.part.txt
source_type: text
source_lines: 1724
part: 1
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Front matter — Cover and full table of contents: 9 chapters, 70 lessons, from "The AI Interview Landscape" through "Rapid Review."
- Lesson 1, The AI Interview Landscape — Defines model, AI system, LLM, predictive/generative/agentic, label, latency, fallback, feedback loop; argues the hard part is the system around the model, using one food-delivery company (delivery-time ETA + LLM support assistant) as the running example, and previews the seven-step framework.
- Lesson 2, How AI System Design Shows Up in Interviews — Five question forms (known ML product, GenAI product, add AI to an existing system, agent, critique/scale), the role-set "lane" (SWE keeps the model a box, ML engineer opens it, AI platform engineer owns inference infra, EM does build-vs-buy), and four areas worth covering in every answer.
- Lesson 3, What Changes When the System Learns — Four classic assumptions break: quality is a spectrum (adds quality measurement), behavior drifts without a deploy (adds a feedback loop), requests cost real money (adds caching/precompute/routing), failures are silent behind HTTP 200 (adds guardrails and a blast-radius question); also covers hosted API vs open weights vs fine-tuning.
- Lesson 4, The Three Question Families — The family test ("what does the model output?") sorts predictive (number/label), generative (content), and agentic (actions); covers where each family is won, its classic failure mode (chatbot for ranking, train-your-own-model, unbounded agent), and how settled each family's practice is; shows one support ticket crossing all three with seams.

# L2 detail

- `#L1-L89` — Cover page and full table of contents: 9 chapters and 70 lessons, grouped as method, predictive, generative, agentic, practice, and review.
- `#L90-L124` — Lesson 1 header and vocabulary: model, AI system, LLM, predictive/generative/agentic system, label, latency, fallback, feedback loop, scope, seven-step framework.
- `#L125-L153` — Part 1: Why these interviews exist — models are reused or bought, so the interview grades the system that collects data, answers on time, checks quality, controls cost, and handles wrongness; contrasts with a classic design interview.
- `#L154-L221` — Part 2: One evening, three kinds of AI — 6:02 PM ETA in ~100 ms (predictive), 7:30 PM policy answer in seconds (generative), $6.40 credit checked against a $10 code limit (agentic); introduces the three question families and the idea that seams carry risk.
- `#L222-L245` — Part 3: What makes an AI design different — quality is a range not right/wrong, quality can drift with no code change, each request can cost real money, the model can be wrong or prompt-injected; rules must live in code.
- `#L246-L264` — Part 4: The seven steps — frame the problem, define success, map the data, pick the model (baseline first), design the serving path, keep it working, count the costs.
- `#L265-L369` — Part 5: The course map — modules ordered predictive → generative → agentic → practice/review, with the question each module answers and why predictive comes first.
- `#L370-L401` — Part 6: Lessons in module 1 — what lessons 2–6 each answer, and that the capstone scopes the support assistant on the food-delivery company.
- `#L402-L412` — Part 7: How to use the course — lessons follow vocabulary → idea → example → 30-second answer → quiz; say answers out loud and time capstones.
- `#L413-L439` — Part 8: Common mistakes — starting with the newest model, using one family's tools for another (LLM for a ranking question), trusting the model's output.
- `#L440-L464` — Lesson 2 header and vocabulary: interview loop, ML, GenAI, inference, agent, tool, RAG, vector index, fine-tuning, form, lane.
- `#L465-L481` — Part 1: Same topic asked five ways — a delivery prediction question and an "add AI to the ticket system" question need very different answers; introduces the three first-minute tools.
- `#L482-L575` — Part 2: The five forms — known ML product + feature pipeline; GenAI content product; add AI to an existing system; agent acting for a user; critique or scale an existing design; a form can be in disguise, and forms are not the families.
- `#L576-L651` — Part 3: The lane your role sets — SWE/senior keeps the model a box (inputs, outputs, limits), ML engineer opens it, AI/platform engineer owns GPU utilization/batching/caching, EM/staff does build-vs-buy and phased rollout; the classic mistake is 15 minutes on fine-tuning in a SWE loop.
- `#L652-L716` — Part 4: Four areas to cover in every form — requirements with concrete numbers (resolve ≥50%, first token ~1 s, ≤13 cents/conversation), the complete loop, cost/latency realism (LLM ~10,000× a KV read and 1,000× slower), and failure honesty; what is not graded.
- `#L717-L773` — Part 5: Follow one question — the first 30 seconds: classify the form (Form 3), confirm the lane ("assume the model already exists"), state the plan, before drawing any box.
- `#L774-L812` — Part 6: Using this in an interview — the 30-second answer, answering "which model?" with roles not names, following a lane change immediately.
- `#L813-L845` — Lesson 3 header and vocabulary: distributed system, p99, uptime, drift, hosted API, open weights, self-hosting, prompt injection, guardrail, graceful degradation, blast radius, precision/recall.
- `#L846-L901` — Part 1: Most of what you know still applies — an AI system is still a distributed system; four classic assumptions break, each demanding one new piece (quality measurement, feedback loop, cost controls, safety layer).
- `#L902-L956` — Part 2: Assumption 1 breaks (quality is a spectrum) — a 32 vs 38 minute miss is a degree of wrongness, so quality is a per-system metric (MAE, precision/recall at a threshold, CTR, resolution rate) measured continuously in production.
- `#L957-L1048` — Part 3: Assumption 2 breaks (behavior changes without a deploy) — drift from a new city, a stadium, summer heat; the feedback loop runs collect → retrain → evaluate → promote, turning a one-way path into a cycle.
- `#L1049-L1098` — Part 4: Assumption 3 breaks (requests are not cheap) — a cent per call × 10M page views ≈ $3M/30 days vs $500/day for a nightly precompute (200× cheaper); cost controls are caching, precomputing, routing.
- `#L1099-L1144` — Part 5: Assumption 4 breaks (failures can be silent) — invented policy citations, a missed fraud, a 25-minute estimate for a 50-minute delivery; prompt injection arrives through retrieved text; guardrails on input, output, and actions plus graceful degradation; ask about blast radius.
- `#L1145-L1181` — Part 6: Where the model comes from — hosted API (rate limits, data terms), self-hosted open weights (pay per GPU hour, cheaper at high steady volume), fine-tuning (tone/format/narrow skill, not facts); four variables that justify fine-tuning.
- `#L1182-L1250` — Part 7: The full picture — the classic request path keeps its gateway/services/queues, with cost controls and safety checks on it, while logs feed quality measurement and the feedback loop.
- `#L1251-L1291` — Part 8: Using this in an interview — the 30-second "four things change" answer, follow-ups on quality metrics, fine-tuning, and hosting breakeven.
- `#L1292-L1312` — Lesson 4 header and vocabulary: family test, pretrained/foundation model, token, streaming, tool interface, budget, approval gate, seam.
- `#L1313-L1423` — Part 1: One company, three kinds of question — delivery estimate, answering assistant, acting assistant; the family test on "what does the model output?"; each family's usual shape (funnel, gather-generate-check, bounded loop); families are not model types or problem families.
- `#L1424-L1467` — Part 2: Family 1, predictive — outputs a number, a label, or a ranked list; won or lost on labels and their delay, candidate selection/ranking, offline (AUC) vs online (CTR) evaluation, and the feedback loop; the classic failure is reaching for an LLM to rank 500 candidates per request.
- `#L1468-L1509` — Part 3: Family 2, generative — feed context (RAG), control token cost, catch hallucinations; evaluation is designed by hand (golden set, LLM judge, human review) because there is no free label; the classic failure is "first we collect a trillion tokens."
- `#L1510-L1551` — Part 4: Family 3, agentic — outputs actions in a loop and contains Family 2; the "new intern with your passwords" analogy; three controls (task-shaped tool interface, budgets on steps/time/money, approval gates) live in code; two opposite failures (too much vs too little freedom).
- `#L1552-L1589` — Part 5: How settled each family is — Family 1 settled, Family 2 emerging, Family 3 young, and what interviewers expect in each.
- `#L1590-L1688` — Part 6: When one product spans several families — one ticket: routing classifier (0.94 "late delivery"), reply drafter held until the credit succeeds, credit agent gated in code; two seams; three moves for a mixed question (name families, name seams, confirm depth).
- `#L1689-L1724` — Part 7: Using this in an interview — the three-family 30-second answer, why one large model for all three jobs still needs labels, thresholds, and code controls.
