---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.13.part.txt
source_type: text
source_lines: 1678
part: 13
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Lesson 37, The RAG Pipeline — the five-stage request path from question to checked answer: query processing (rewrite "Does that cover my spouse too?" to a standalone question, plus scope classification, expansion and HyDE), retrieval (10–20 candidates, reranked to 3–5), context assembly (budget set by cost/latency not the window, dedupe, per-source caps, strongest evidence first and last because of lost-in-the-middle, labeled framing), generation (small model for lookups, frontier for synthesis), and post-checks (citations resolve, groundedness) with a retry-once-then-refuse fallback ladder. Traces the spouse question to ~1.5 s end to end, gives a stage latency budget, and teaches the debugging matrix: most RAG problems are retrieval problems, so measure recall first.
- Lesson 38, Hybrid Search and Reranking — semantic search misses exact tokens like error E4022 because identifiers have no meaning to place; BM25 over an inverted index matches exact words and favors rare ones. Hybrid retrieval runs both in parallel and merges with reciprocal rank fusion, RRF score = 1/(60+rank) summed per list, because BM25 and cosine scores are not comparable. Reranking adds a cross-encoder that reads query and chunk together — unlike the fast bi-encoder — turning rank 14 into rank 1 for ~50–100 ms; this is Module 3's recall-then-precision funnel inside RAG. Metadata filters handle status and dates, and counts route to SQL.
- Lesson 39, Keeping Answers Grounded — the right chunk is not enough: the model can contradict, embellish, or blend evidence (the card-refund sentence). Grounding is four stacked layers over a retrieval-quality floor: instructions and framing (cheap, where most demos stop), citations as claim-source pairs resolved by code, per-claim entailment checks with an NLI model or calibrated judge, and a designed refusal. High-stakes claims (money, refund rules, allergies) get synchronous checks and must pass or not ship; low-stakes answers stream and are sampled asynchronously. Refusal is measured in both directions, and faithfulness tracks groundedness rate.

# L2 detail

- `#L1-L10` — Lesson 37 header and vocabulary: groundedness check, retrieval recall, faithfulness.
- `#L11-L93` — Part 1: the multi-turn spouse question failing a naive design, the five-stage pipeline definition, and the stage time ranges showing generation is the slow stage.
- `#L94-L160` — Part 2: query processing — conversation dependence and query rewriting, the query-document vocabulary gap with expansion and HyDE, and classifying answerability plus filter extraction.
- `#L161-L247` — Part 3: retrieval — scored, permission-filtered top-k, choosing k (retrieve 10–20, rerank to 3–5, sweep on the golden set), and sending 50–100 candidates when warranted.
- `#L248-L288` — Part 4: context assembly — budgeting by cost and latency (60¢ for a full 200K window versus under a cent at 3,000 tokens), lost in the middle, selection and dedupe with per-source caps, and ordering plus source/date labels that make citations possible.
- `#L289-L343` — Part 5: generation model choice (lookups versus synthesis, router driven by the classifier) and the two post-checks (citations resolve, groundedness) plus the retry-once-then-degrade-honestly fallback ladder.
- `#L344-L359` — Part 6: the spouse question end to end at ~1.5 s with a per-stage latency table, noting that streaming cannot protect text the user already read.
- `#L360-L465` — Part 7: evaluating and debugging — recall versus faithfulness pointing at different faults, the four-row debugging matrix (generation, retrieval, corpus gap, product), and a worked corpus-gap diagnosis on a road-closure refund.
- `#L466-L479` — Part 8: what changes at 10× the corpus — lower retrieval precision, 40→400 GB of index memory needing quantization or sharding, and more duplicates.
- `#L480-L518` — Part 9: the 30-second answer, three follow-ups, four mistakes, and key takeaways.
- `#L519-L538` — Lesson 38 header and vocabulary: exact token, BM25, hybrid retrieval, reciprocal rank fusion, bi-encoder, cross-encoder, metadata filter.
- `#L539-L563` — Part 1: where semantic search fails — the E4022 payment-error question, why error codes have no meaningful place in embedding space, and the list of exact tokens (tickets, order numbers, promo codes).
- `#L564-L641` — Part 2: lexical search and BM25 — the inverted index, the three scoring ideas (matches count, rare words weigh more, repeats and length are damped), and the vocabulary-mismatch table showing each search failing where the other succeeds.
- `#L642-L817` — Part 3: hybrid retrieval — parallel searches bounded by the slower one, why raw scores cannot be added (unbounded BM25 versus 0–1 cosine), the RRF formula with the worked E4022 ranking, and when weighted RRF is justified.
- `#L818-L1005` — Part 4: reranking — the precision problem (policy at rank 14), bi-encoder speed versus cross-encoder care, the reranking stage numbers (50–100 candidates in 10–50 ms, ~50–100 ms to rerank, keep 3–8), the Module 3 funnel parallel, and when to add a reranker.
- `#L1006-L1033` — Part 5: metadata filters for status and dates and routing counts to structured SQL sources under the user's permissions.
- `#L1034-L1117` — Part 6: the E4022 question end to end — parallel BM25 and ANN at ~20 ms, RRF over ~80 candidates at ~1 ms, cross-encoder to best 5 at ~70 ms.
- `#L1118-L1155` — Part 7: choosing the right shape — matching each tool to a golden-set failure, when vector-only or keyword-only retrieval is enough, and whether the reranker earns its 50–100 ms.
- `#L1156-L1198` — Part 8: the 30-second answer, three follow-ups, four mistakes, and key takeaways.
- `#L1199-L1217` — Lesson 39 header and vocabulary: context, claim, entailment, NLI model, post-check, synchronous versus asynchronous check, refusal.
- `#L1218-L1262` — Part 1: the late-order card-refund answer contradicting good evidence, the three ways a model misuses evidence, what groundedness means, and why grounding is neither correctness nor a prompt promise.
- `#L1263-L1316` — Part 2: the four stacked layers over a retrieval-quality floor, illustrated by the missed-Tuesday-edit case where every layer passes and the answer is still wrong.
- `#L1317-L1346` — Part 3: Layer 1 baseline instructions and framing, why most demos stop there, and why fine-tuning cannot fix hallucination.
- `#L1347-L1388` — Part 4: Layer 2 citations as a contract — three jobs, enforcement through structured claim-source pairs, and the card claim passing Layer 2 because chunk 1 really existed.
- `#L1389-L1526` — Part 5: Layer 3 per-claim entailment — the check question, NLI model versus judge, why per-claim rather than per-answer, the six-step refund walkthrough with ~1 ms citations and ~200 ms verification, the strip/hedge → retry → refuse ladder, and synchronous versus sampled checks.
- `#L1527-L1590` — Part 5 continued: the high-stakes synchronous versus low-stakes asynchronous diagram and the routing-by-stakes argument.
- `#L1591-L1626` — Part 6: Layer 4 designed refusal — three triggers (empty retrieval, failed check, out-of-scope), useful refusal wording, measuring refusal in both directions, and the deepest failure of answering when a refusal was available.
- `#L1627-L1638` — Part 7: knowing your groundedness rate through faithfulness on the golden set and on production samples, tracked next to retrieval recall.
- `#L1639-L1678` — Part 8: the 30-second answer, the well-cited wrong-dollar-figure follow-up, three mistakes, and key takeaways.
