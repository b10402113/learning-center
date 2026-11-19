---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.12.part.txt
source_type: text
source_lines: 1516
part: 12
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Lesson 34, Introduction: RAG & Retrieval — an LLM has three gaps on a refund question (private facts, fresh facts, permissions) and retrieval is the usual fix. Defines the three-part RAG system (ingestion path, five-stage request path of query processing → retrieval → context assembly → generation → post-checks, and the feedback loop) linked by an index; retrieval sets the ceiling and generation decides how close the answer gets, measured by retrieval recall and faithfulness. Follows the "50 minutes late, do I get money back?" question at 7:15 PM through rewrite (~150 ms), hybrid retrieval (~300 ms), dedupe down to 4 labeled chunks inside a 2,000-token budget, and a checked answer at ~3 s, plus seven common mistakes.
- Lesson 35, Embeddings and Vector Databases — embeddings encode meaning (1,024 dimensions) so "locked out of my account" matches "How do I reset my password?" (cosine 0.82 versus 0.55 and 0.08). Covers the three frozen-meaning rules (same model version, re-embed on edit, new model = full migration with a second index), exact search versus ANN, HNSW layered-graph search (95–99% recall, single-digit ms), memory math for 10M and 120M chunks, filtered search, tombstoned deletes, and choosing pgvector versus a dedicated engine.
- Lesson 36, Chunking and Indexing — ingestion is six background stages (connectors, parse and clean, chunk, enrich metadata, embed, index) built around a document store as source of truth so the index is rebuildable. Covers why parsing is the hardest stage (PDF tables, boilerplate, OCR, images), chunk-size trade-offs measured by a golden set (300–500 tokens as a starting point), structure-aware chunking with breadcrumbs and small-to-big retrieval, per-field metadata jobs, and the five-point sync contract (incremental sync, idempotent re-indexing, atomic replacement, ordered deletes, freshness-lag SLOs of 15 min edits / 5 min deletes).

# L2 detail

- `#L1-L18` — Lesson 34 header and vocabulary: corpus, metadata, ingestion, vector database, top-k retrieval, reranker, citation.
- `#L19-L50` — Part 1: the model's three gaps on the refund question, hallucinations, three ways to close the gap (paste, fine-tune, retrieve), and the three questions interviewers ask about a vector-database-only drawing.
- `#L51-L170` — Part 2: the RAG system definition — ingestion path, five-stage request path, feedback loop, semantic versus lexical search, and the split of retrieval ceiling from generation quality under recall and faithfulness.
- `#L171-L261` — Part 3: one refund question traced through all seven steps with example timings, plus the missed-Tuesday-edit and check-latency lessons.
- `#L262-L303` — Part 4: the six module lessons mapped to the part of the map each builds (embeddings, chunking, pipeline, hybrid search, grounding, capstone).
- `#L304-L364` — Part 5: how the module fills framework steps 2–7 (success metrics, corpus map, embedding and search baseline, five stages with a latency budget, golden set and freshness, index memory and token cost).
- `#L365-L384` — Part 6: what this module reuses from Modules 2–4 (ANN indexes, two search engines, the ranking funnel, token costs, golden set) and the later lessons that build on it.
- `#L385-L426` — Part 7: seven mistakes (only a vector DB, index once, trust meaning search with exact codes, fill the context, retrieved means correct, check permissions after the answer, measure only the final answer) and key takeaways.
- `#L427-L441` — Lesson 35 header and vocabulary: dimension, cosine similarity, exact search, HNSW, sharding.
- `#L442-L467` — Part 1: vocabulary mismatch on "I'm locked out of my account," the shared retrieval service over 10M chunks, and the lesson's ordering.
- `#L468-L537` — Part 2: what an embedding is — vectors, cosine similarity with scored examples where word overlap does not decide the score, cheap embedding models, what an embedding is not, and the two-tower geometry reused from recommendations.
- `#L538-L627` — Part 3: embeddings as frozen meaning and the three rules, including the four-step embedding-model migration and version skew, plus the ahead-of-time index path versus the per-question path.
- `#L628-L667` — Part 4: exact search cost tables (100M multiplications and 400 GB read at 100M chunks) versus ANN's trade of a little recall for large speed.
- `#L668-L727` — Part 5: HNSW layered graph search (big hops on sparse top layers, small hops below), typical 95–99% recall at single-digit ms, and a four-step procedure for measuring recall against exact search.
- `#L728-L745` — Part 6: memory sizing — 4 KB per 1,024-dim vector, ~40 GB for 10M chunks, graph and copies, plus quantization (40→10 GB) and sharding for a 120M-chunk corpus (~490 GB of vectors).
- `#L746-L837` — Part 7: what a vector database adds (metadata filtering, live updates, database virtues); post-filtering failing on selective filters versus filtered HNSW; and the tombstone → propagate → verify delete order including caches.
- `#L838-L865` — Part 8: choosing a vector extension (pgvector) versus a dedicated engine by scale, filter complexity, and sharding needs.
- `#L866-L878` — Part 9: the locked-out question end to end — embed in ~10 ms, filtered HNSW in ~5 ms, 20 permitted chunks onward.
- `#L879-L927` — Part 10: the 30-second interview answer, three follow-ups, five mistakes, and key takeaways.
- `#L928-L947` — Lesson 36 header and vocabulary: connector, parsing, boilerplate, breadcrumb, document store, tombstone, freshness lag, SLO.
- `#L948-L968` — Part 1: two ingestion failures — the missing answer (a PDF table scattered into numbers) and the retired answer (old 30-day chunks still indexed).
- `#L969-L1061` — Part 2: the six-stage ingestion pipeline, what ingestion is not, and the document store as source of truth that makes the index rebuildable.
- `#L1062-L1126` — Part 3: parsing as the hardest stage — per-format breakage, why boilerplate shifts embeddings, monitoring parsing quality with three checks, and handling images, diagrams and code.
- `#L1127-L1197` — Part 4: chunk size — why not one vector per document, the small-chunk context loss ("The limit is $50") versus big-chunk blur, and choosing the size by a sweep on a golden set.
- `#L1198-L1280` — Part 5: structure-aware chunking rules (headings, whole tables and lists, overlap), contextual enrichment via breadcrumbs, and small-to-big retrieval that matches small chunks and answers from the full section.
- `#L1281-L1343` — Part 6: every metadata field's job — document ID, source URL, breadcrumb, timestamps, author, and ACL identifiers that power the permission filter.
- `#L1344-L1462` — Part 7: the five-point sync contract — incremental sync via webhooks/change feeds, idempotent re-indexing keyed by document ID, atomic delete-then-insert, ordered deletes through store → index → caches, and freshness lag as an SLO (15 min edits, 5 min deletes).
- `#L1463-L1479` — Part 8: the 30→14-day refund change traced with a 3-minute lag, plus a duplicate webhook handled idempotently.
- `#L1480-L1516` — Part 9: the 30-second ingestion answer, two follow-ups (old and new answers together; legal deletion speed), five mistakes, and key takeaways.
