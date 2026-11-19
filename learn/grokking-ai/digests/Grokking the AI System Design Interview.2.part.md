---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.2.part.txt
source_type: text
source_lines: 1071
part: 2
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Lesson 5, A Framework for AI Design Answers — The classic design skeleton breaks in two places (quality must be pinned down first as a number; the answer must end in a loop), so the course uses seven fixed steps; details each step with the delivery-time ETA, a generative assistant, and a refund agent; gives the 45-minute clock split (Step 5 the serving path gets ~12 minutes) and how it shifts by family; runs the ETA example end to end.
- Lesson 6, Capstone: Scoping an AI Design Question — Turns "leadership wants to use AI" at a 25M-user, 500k-order/day delivery company into one scoped design in eight minutes via five moves: show a menu of options by family, pick for impact plus tractability, name the family and its three design centers, cut scope out loud, and put numbers on scale/quality/latency/cost (ends at 40k conversations, 24k tier-1, 50% resolved, ~$0.13/conversation).

# L2 detail

- `#L1-L27` — Lesson 5 header and vocabulary: framework, known system, quality bar, latency budget, label delay, freshness, baseline, retrieval, serving path, shadow deployment, the failure and cost ledgers.
- `#L28-L133` — Part 1: Why AI answers need their own order — the classic skeleton stops at the user and cannot say how quality is measured or what happens next month; Break 1 is quality as a number agreed up front, Break 2 is ending in a loop that carries outcomes back to the data.
- `#L134-L155` — Part 2: The seven steps — frame the problem, define success, map the data, pick the model, design the serving path, keep it working, count the costs; Steps 2 and 6 fix the two breaks; the framework is an order for thinking, not a script.
- `#L156-L279` — Part 3: Steps 1 to 4 before the diagram — Step 1 names the family and known system then scopes with a checkpoint question; Step 2 puts numbers on quality (MAE under 5 min plus a guardrail metric), latency (~100 ms), scale/cost; Step 3 maps labels and their delay (delivery ~1 hour, chargebacks weeks); Step 4 starts from a baseline with a stated upgrade condition per family.
- `#L280-L343` — Part 4: Steps 5 to 7 — Step 5 asks what can be precomputed, which requests take a cheap path, and what happens when a model is slow/down (timeout and fallback on every arrow); Step 6 logs inputs/outputs, captures outcomes, computes metrics, and releases every change offline → shadow → gradual rollout; Step 7 gives the failure ledger and cost ledger (10M requests × 20% to an LLM at a cent = $20k/day ≈ $600k/month).
- `#L344-L456` — Part 5: The 45-minute clock — 0–3, 3–8, 8–13, 13–18, 18–30, 30–38, 38–43 minutes with 2 minutes held for questions; how the split shifts for predictive/generative/agentic; what goes wrong when Step 1 runs long, the interview is short, or you are redirected.
- `#L457-L477` — Part 6: Follow one answer — the ETA design run through all seven steps, showing how one sentence of recognition in Step 1 shaped precompute, fallback, and drift watching.
- `#L478-L514` — Part 7: Where the course goes deeper — maps each of the seven steps to the later lessons that teach it at full depth.
- `#L515-L556` — Part 8: Using this in an interview — the 30-second structure answer, why metrics come before the diagram, and why the baseline comes first.
- `#L557-L606` — Lesson 6 header, vocabulary (scoping, underspecified question, impact, tractability, tier-1 ticket, escalation, resolution rate, human baseline, scope cut, design center, prompt, model routing) and the exercise: 25M monthly users, 500k orders/day, "what would you build?" in about 8 minutes.
- `#L607-L637` — Part 1: What the question leaves out — no feature, no metric, no family, all on purpose; interviewers listen for range and decision; scoping is minutes, not a requirements list.
- `#L638-L743` — Part 2: Move 1, show the menu — seven options grouped into predictive (ETA, restaurant recommendations, promotion-abuse detection), generative (support assistant, dish descriptions, review summaries), and agentic (ordering assistant); ~30 seconds, then order.
- `#L744-L792` — Part 3: Move 2, pick one and say why — impact plus tractability judged by whether labels exist, whether the knowledge is reachable, and what a mistake costs; ETA is the strongest predictive pick (every order is a label), the support assistant is the strongest generative pick, the ordering agent is the weakest opening pick.
- `#L793-L813` — Part 4: Move 3, name the family and the design centers — "generative with retrieval, pushed slightly toward agentic by one refund action"; the three design centers are retrieval/context assembly, cost control through model routing, and guardrails around the refund action.
- `#L814-L841` — Part 5: Move 4, cut the scope — in scope: English text chat, tier-1 tickets, refunds up to a $10 limit; out: voice, other languages, refunds above $10; why each cut was made, and closing with "should I go ahead on that scope?"
- `#L842-L1015` — Part 6: Move 5, put numbers on it — 500k orders × 8% contact = 40k conversations/day (one every 2 s), 60% tier-1 = 24k/day; quality is resolution rate plus satisfaction guardrail (50% target ≈ 12k resolved); latency is ~1 s to first token and ~5 s to finish; cost is ~$0.13 per 10-turn conversation vs ~$4 per human ticket (≈$5k/day model vs ≈$48k/day avoided).
- `#L1016-L1032` — Part 7: What each level sounds like — mid-level ("I'd build a chatbot") has no menu, reason, family, or cut; senior makes all five moves unasked; staff also questions whether a live order-status screen removes the need, and sees that ETA quality underpins the assistant.
- `#L1033-L1056` — Part 8: Follow-ups to practice — where the 8% comes from (an assumption read from the support system), and why 70% resolution is not yet a success without satisfaction and repeat-contact checks.
- `#L1057-L1071` — Part 9 and takeaways — practice on a job board and a retail bank with the same five moves; chapter 3 begins.
