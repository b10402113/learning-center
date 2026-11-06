---
source: sources/ai-agent-workflows/20261105/course/4-rag.txt
source_type: text
source_lines: 389
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- RAG supplies outside knowledge without keeping it all in context; its pipeline is ingest, chunk, embed, store, retrieve, augment.
- Documents are split into phrase-to-few-sentence chunks, then embedded into vectors because keyword search over raw text misses paraphrases and is inefficient.
- Embedding models are purpose-built, often transformer-based, and place semantically similar text (sofa, couch, chair) near each other while unrelated text (horse, pizza) stays far away.
- Relevance is the distance or similarity between the query vector and document vectors; the top chunks join the query in context.
- RAG reduces hallucination and avoids the "Lost in the Middle" effect where relevant text buried in a long context performs worse than no documents.
- The scholarship/loan example shows the payoff: thousands of eligibility documents are embedded once, and a profile query retrieves only about 20 relevant pieces.
- Chunk size is empirical, usually a phrase to a few sentences; larger chunks quickly degrade retrieval relevance.
- RAG can also retrieve a few relevant tools from an embedded catalog instead of keeping every tool's metadata in context.
- RAG operates at query time, while fine-tuning happens before deployment; the two are often combined, and RAG is the practical default for agents.
- A useful analogy is a book index, except retrieval can point to multiple relevant passages rather than one.

# L2 detail

- `#L1-L15` — RAG as outside memory that does not consume context; six steps: ingest, chunk, embed, store, retrieve, augment.
- `#L16-L53` — Ingest and chunk documents into sentences/phrases; text search is inefficient and bad at finding relevant-but-not-identical wording; embedding models are trained for vector representation, not text generation, though they may share transformer architecture.
- `#L54-L94` — Semantic vectors: sofa/couch/chair cluster, horse/pizza do not; avoids manually enumerating keyword synonyms, which becomes impossible for full sentences.
- `#L95-L126` — Store embeddings, embed the query with the same model, compare against the database, and add the best pieces plus the query to context; scales to huge corpora such as research papers and lowers hallucination.
- `#L127-L160` — "Lost in the Middle": stuffing a million tokens can make mid-context information worse than providing no documents; RAG deliberately supplies only what is needed; relevance is vector distance/similarity.
- `#L161-L199` — Career product example: thousands of scholarships and loans with eligibility criteria cannot fit in context; embed once, then a query like "first-generation software engineering student in Texas" retrieves roughly 20 relevant items cheaply via one embedding and one database call.
- `#L200-L215` — Chunk-size question: phrase to a few sentences, rarely more, because relevance search degrades beyond that; size is use-case dependent and research-driven.
- `#L216-L255` — Applying RAG to tools: embed a large tool catalog, retrieve only tools relevant to the current query, and keep hundreds of tools available without loading all metadata into context.
- `#L256-L285` — RAG at query time vs fine-tuning during or after pre-training; fine-tuning is often combined with RAG, but RAG is the option available at query time.
- `#L286-L332` — How RAG interacts with the base model: the LLM outputs a query, code sends it to the embedding model, retrieved text is fed back; execution looks like a tool call, with no separate RAG mode inside the LLM.
- `#L333-L389` — Book-index analogy, with the difference that retrieval can point to multiple relevant places; RAG is just a model plus a database plus relevance, and factual retrieved data makes correct answers more likely (garbage database caveat).
