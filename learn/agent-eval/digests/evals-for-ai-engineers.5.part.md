---
source: sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt
source_type: text
source_lines: 2972
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
part: 5
---

# L1 overview

- Chapter 6 defines the vocabulary of multi-turn evaluation: a turn is one user message plus the agent's response, and a session is a full conversation from start to finish.
- Laban et al. (2025) ran 200,000+ simulated conversations against GPT-4 and Llama on six tasks (coding, math word problems, summarization) and found accuracy dropped 39% on average in the multi-turn setup, mostly from unreliability rather than raw capability loss.
- The book names the dominant failure as anchoring: the model makes an early guess after the first user message, commits to it, and fails to revise when new information arrives.
- Multi-turn evaluation has three levels that form a drill-down workflow: session level (binary pass/fail on whether the user's goal was met), turn level (diagnostic only, used on already-failing sessions), and conversational coherence/memory (properties that emerge across turns or across sessions).
- Coherence failures split into forgetting stated preferences, contradicting earlier responses, and losing track of the task; their causes split into anchoring failure, context truncation, and instruction drift, each with a different fix (prompting, architectural summarization/memory, periodic instruction repetition).
- Memory systems (facts stored as summaries or KV pairs, injected at session start) are evaluated on four questions: storage, retrieval, update, and staleness.
- Practical techniques: collect 100+ traces from teammates doing 10–15 tasks each, isolate failures by condensing the failing turn into a single-turn prompt, operationalize session success as a rubric, use LLM user simulators, stratify test sets into 2–4, 5–9, and 10+ turn buckets, and run perturbation testing with a median brittleness score.
- User simulator tooling: AgentInstruct (Mitra et al. 2024) pipelines persona-goal generation, user role-play, and conversation evaluation; LMSYS Chatbot Arena (Chiang et al. 2024) supplies real human conversations to calibrate realism. Simulators skew cooperative, short, and goal-directed.
- Perturbation testing mutates passing traces in three ways — changing the user's goal midconversation, adding ambiguity, contradicting the agent — and is distinguished from adversarial robustness testing because perturbations are naturalistic.
- Chapter 7 turns to RAG, whose pipeline stages (query construction, retrieval, reranking, generation) fail independently but interdependently; evaluation focuses on the Analyze and Measure parts of the lifecycle.
- RAG uses two-stage retrieval: stage 1 (FAISS/HNSW, Pinecone/Weaviate, BM25 with text-embedding-3 or embed-v3) optimizes recall, stage 2 reranking (Cohere Rerank, BGE reranker, fine-tuned MiniLM cross-encoders, LLM-as-reranker) optimizes precision. Hybrid retrieval with BM25 + dense via RRF and late-interaction ColBERT are named as production developments.
- Retrieval datasets come from synthetic (question, answer, context) triples generated per chunk, hardened with discriminative questions against similar distractor chunks, then filtered by LLM-scored 1–5 realism ratings; the 1–5 scale is justified here because it filters data, not system outputs.
- Retrieval metrics: Precision@k, Recall@k, MRR@k, hit rate@k/Success@k, and NDCG@k, with the rule of thumb "Recall@k for the first stage, NDCG@k for reranking"; the lost in the middle effect (N. F. Liu et al. 2024) shows accuracy dropping 30+ points when the answer sits at position 10 of 20.
- Chunking is a tunable variable: fixed-size chunking with overlap, tuned by grid search over chunk size and overlap (Table 7-1 shows 256 tokens / 128 overlap best), plus semantic/structural chunking and contextual augmentation.
- Generation is judged on faithfulness (hallucinations, omissions, misinterpretations versus the retrieved context, not parametric knowledge) and relevance (does it answer the question); context swapping is the debugging test for whether the LLM uses retrieval at all.

# L2 detail

- `#L1706-L1708` — Chapter 6 file marker, title "Evaluating Multi-Turn Conversations".
- `#L1709-L1717` — Single-turn versus multi-turn definitions (turn, session); chapter objectives; Laban et al. (2025) 39% multi-turn accuracy drop traced to early commitment and unreliability.
- `#L1718-L1720` — Three levels of multi-turn evaluation as lenses, forming a session → turn → coherence drill-down (Figure 6-1).
- `#L1721-L1725` — Session Level: binary pass/fail on whether the full conversation achieved the user's goal; recommended starting point, resist scoring every turn.
- `#L1726-L1728` — Turn Level: diagnostic tool used only on flagged failing sessions to locate the turn where the conversation went off track.
- `#L1729-L1756` — Conversational Coherence and Memory: forgetting preferences, contradicting earlier responses, losing the task; causes are anchoring failure, context truncation, instruction drift, each with its fix; memory evaluation via storage, retrieval, update, staleness.
- `#L1757-L1758` — Practical Strategies roadmap: traces, failure isolation, session success definition, simulators, length stratification, perturbation.
- `#L1759-L1761` — Collecting Traces: lightweight chat interface, 10–15 tasks per team member, 100+ diverse traces, manual review of successes and failures.
- `#L1762-L1770` — Isolating Failures and Example 6-1: condense a failing turn into a single-turn prompt; the X1000 return-window error is a retrieval/grounding issue, not multi-turn.
- `#L1771-L1780` — Example 6-2: movie assistant forgets the "sci-fi" constraint; inherently multi-turn; study by truncating before the failing turn and sampling "N-1 turn" prefixes.
- `#L1781-L1783` — Operationalizing Session-Level Success: concrete definitions per application (support, coding assistant, peer feedback) written as a rubric and validated with collaborative annotation.
- `#L1784-L1794` — User Simulators: persona-plus-goal system prompt with [DONE] signal, varied budgets/personalities/communication styles; AgentInstruct and Chatbot Arena cited; simulators are too cooperative and short.
- `#L1795-L1796` — Stratifying by Conversation Length: 2–4, 5–9, 10+ turn buckets with per-bucket success rates to expose position-dependent failures.
- `#L1797-L1809` — Perturbation Testing: mutate passing traces (goal change, added ambiguity, contradiction), contrast with adversarial testing, track median brittleness score across releases.
- `#L1810-L1817` — Automated Evaluation of Multi-Turn Traces: session-level LLM-as-judge first; turn-level checks for contradiction, unjustified tool calls, and violated user constraints.
- `#L1818-L1825` — Common Pitfalls: length-correlated failures, overinvesting in turn-level evaluation, mistaking single-turn failures for multi-turn ones.
- `#L1826-L1834` — Putting It Together: seven-step multi-turn workflow from defining success to adding turn-level evaluators.
- `#L1835-L1838` — Chapter 7 handoff and Chapter 6 footnotes on binary labels and nonfrontier models.
- `#L1839-L1841` — Chapter 7 file marker, title "Evaluating Retrieval-Augmented Generation".
- `#L1842-L1853` — Chapter intro: RAG stages fail independently yet interdependently; learning objectives (synthetic queries, Recall@k/MRR/NDCG@k, chunking grid search, faithfulness and relevance); scope limited to Analyze and Measure.
- `#L1854-L1864` — Overview: the LLM as context consumer makes recall critical; token cost and context limits motivate two-stage retrieval; agentic RAG deferred to Chapter 8; hybrid retrieval with RRF, ColBERT, long-context caveats; stage 1 high recall, stage 2 reranking for precision; evaluate retrieval before generation.
- `#L1865-L1869` — Synthetically Generating Query-Answer Pairs: chunk-level (question, answer, context) triples with a known retrieval target by construction (Figure 7-2).
- `#L1870-L1883` — The synthetic QA generation prompt returning JSON with "fact" and "question" from a text chunk.
- `#L1884-L1898` — Creating Harder Synthetic Queries: pick target chunk A, find similar non-answering chunks B/C, generate a discriminative question; worked financial-news example with 2020 revenue drop versus 2008 crisis.
- `#L1899-L1933` — Filtering Synthetic Questions: manual subset ratings fed into a few-shot realism prompt; real-estate realistic/unrealistic examples with 1–5 ratings; justification that 1–5 is for data filtering, not output evaluation.
- `#L1934-L1935` — Metrics for Retrieval Quality: metric choice depends on the downstream application.
- `#L1936-L1945` — Precision@k and Recall@k: formulas, k varies by query type, binary relevance with binarization threshold; recall prioritized in early stages; tip to use Recall@k first stage and NDCG@k for reranking.
- `#L1946-L1950` — Mean Reciprocal Rank: 1/rank of first relevant document averaged over queries; hit rate@k/Success@k alternative; lost in the middle U-shaped curve from N. F. Liu et al. (2024); multi-hop questions favor Recall@k or NDCG@k.
- `#L1951-L1970` — NDCG@k: graded relevance 0–3, DCG with log2 position discount, IDCG normalization, score of 1.0 as perfect ranking; finite context windows; caveat that perfect ordering of mediocre documents can inflate the score, so read alongside recall.
- `#L1971-L1974` — Evaluating and Optimizing Chunking Strategies: chunk as retrieval unit; too small splits ideas, too large dilutes; fixed-size chunking with overlap (256/128 example, Figure 7-4).
- `#L1975-L2008` — Tuning Chunk Size and Overlap: per-corpus grid search over chunk size and overlap reindexing each combination; Table 7-1 hypothetical results where 256 tokens / 128 overlap wins on Recall@5 0.89 and NDCG@5 0.77; overlap consistently helps, 512-token chunks underperform.
- `#L2009-L2014` — Other Chunking Approaches: semantic or structural chunking on headings and topic shifts, and contextual augmentation prepending title and section headings.
- `#L2015-L2028` — Evaluating Generation Quality: faithfulness (hallucinations, omissions, misinterpretations; grounding over parametric knowledge) and relevance (answering the actual question); LLM-as-judge for faithfulness, programmatic entity checks for relevance; context swapping as a grounding debug tool; prompt-level fix note.
- `#L2029-L2044` — Common Pitfalls: end-to-end-only metrics, overfitting to synthetic data (20–30 real queries recommended), wrong metric for the question type, ignoring chunking, ungrounded generation, and conflating retrieval correctness with answer correctness.
- `#L2045-L2051` — Putting It Together: five-step RAG workflow from gold-chunk dataset to chunking experiments.
- `#L2052-L2054` — Chapter 8 handoff on agentic systems and a footnote on agentic execution of retrieval stages.
