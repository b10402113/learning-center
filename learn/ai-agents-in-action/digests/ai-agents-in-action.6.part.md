# Chapter 6 — Working with memory and knowledge (RAG)

## Overview (L1)
- Chapter 6 teaches retrieval-augmented generation (RAG): how agents move beyond their static training data by retrieving external knowledge and memory into context. It covers retrieval fundamentals and RAG basics (6.1), vector databases and semantic similarity search with TF-IDF and embeddings (6.2), building practical vector and hybrid-search RAG agents with grounding and references (6.3), and adding memory to agents via MCP with graph stores, hybrid memory, augmentation, and compression (6.4). A short 6.5 Exercises section (TF-IDF, embeddings, Chroma persistence, and vector/hybrid RAG agent builds) plus a chapter summary close the chapter — it is noted here rather than as a section entry.

## Sections (L2)
### 6.1 Understanding retrieval in AI applications
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.1]]`
- Summary: Defines retrieval as the mechanism for pulling knowledge or memories from external, long-lived storage into a bounded per-call context window, and distinguishes knowledge (static documents, DB tables) from memory (conversation threads, user facts, agent experiences) with their storage formats and retrieval mechanisms.
- Key claims: retrieval is the bridge between unbounded external storage and bounded per-call context (context windows ~200K to 1M+ tokens); knowledge and memory are both external sources that rely on retrieval; augmentation is feeding retrieved info into the prompt; combined retrieval + augmentation = RAG.
- Learner-relevant: anchors the "why agents need knowledge" story — training cutoffs, stateless reasoning — that motivates all later RAG and memory nodes.

### 6.1.1 The basics of RAG
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.1.1]]`
- Summary: Explains the two-phase RAG pipeline (ingestion and retrieval) and the vector database concept. The embedder and the LLM are two different models doing two different jobs: encoding text into vectors for similarity search vs. generating the final response.
- Key claims: RAG = two phases (ingest: load → chunk → embed → store; retrieve: embed query → find similar chunks → augment prompt); vector databases answer "most similar vectors" not "exact row lookups"; dense vectors (384–3,072 floats) pack semantic meaning; popular vector DBs (2026) include Pinecone, Qdrant, Weaviate, Turbopuffer, pgvector; agents with a training cutoff need RAG to answer anything current (prices, weather, recent policy).
- Learner-relevant: establishes the canonical RAG pipeline and vocabulary used throughout the chapter and the subject's later nodes.

### 6.1.2 Delving into semantic search and document indexing
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.1.2]]`
- Summary: Explains how document indexing makes content semantically recoverable and how semantic search matches by meaning rather than surface keywords, plus three named pitfalls of semantic search.
- Key claims: semantic search eliminates keyword construction and synonym lists; pitfalls: (1) semantic similarity ≠ semantic correctness (retrieval has no view into truth), (2) fixed top-K (typically 5–10) drops rank-11+ relevant content, (3) vector search is approximate (ANN trades accuracy for speed).
- Learner-relevant: supplies the caveats needed to reason about retrieval quality and later justify hybrid search.

### 6.1.3 Applying vector similarity search
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.1.3]]`
- Summary: Walks through TF-IDF vectorization (with worked TF/IDF/TF-IDF calculations), cosine similarity for comparing document vectors, and a first similarity demo with a pairwise cosine-similarity matrix.
- Key claims: TF-IDF measures term importance, not meaning ("vehicles" won't match "cars"); cosine similarity = cosine of the angle between vectors, ignores magnitude, returns –1 to 1 (distance 0–2); cosine works on TF-IDF in practice but suffers false matches on extremely sparse vectors; TF-IDF gives human-readable dimensions vs. learned embedding dimensions.
- Learner-relevant: the concrete, worked math foundation for understanding what embeddings and vector search improve on.

### 6.2 Vector databases and similarity search
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.2]]`
- Summary: Shows how vectorized documents are stored and searched: an in-memory vector database replica in Python (TF-IDF vectors + cosine similarity search returning top-n matches), transitioning into the need for embeddings that preserve semantic meaning.
- Key claims: vectorization dictates the measure of semantic similarity; storing document vectors in an array enables ranked cosine search; TF-IDF search matches words/phrases but misses context and meaning, motivating embeddings.
- Learner-relevant: bridges the TF-IDF demo to the embedding-based stores used by all real RAG agents.

### 6.2.1 Demystifying document embeddings
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.2.1]]`
- Summary: Explains what embedding networks are, why TF-IDF is still a useful signal, and demonstrates generating and visualizing OpenAI embeddings (1536-dim vectors reduced via PCA to 3D to show semantic grouping).
- Key claims: TF-IDF is fast/predictable for exact terms but can't match by meaning; strongest production retrieval combines TF-IDF/BM25 with semantic embeddings (hybrid); embedding nets learn to encode meaning into geometry by predicting context; embedding dimensions have learned meanings (interpretable via relationships, not individual values); OpenAI embeddings are standard for general semantic similarity; for domain accuracy, evaluate multiple embedding models against your data.
- Learner-relevant: explains the mechanism behind semantic similarity and motivates evaluating embedding choices.

### 6.2.2 Querying document embeddings from Chroma DB
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.2.2]]`
- Summary: A complete local example using Chroma DB: embedding documents, adding them to a collection, and querying with cosine distance scores instead of similarity.
- Key claims: Chroma DB is an excellent local vector store for dev/small-scale projects; Cosine Distance = 1 − Cosine Similarity (0 = most similar, 2 = semantically opposite); querying returns top-n documents ranked by distance; semantic meaning beats keyword matching for retrieval.
- Learner-relevant: first end-to-end vector store workflow the learner can run locally; foundation for the RAG agents in 6.3.

### 6.3 Building practical RAG knowledge agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.3]]`
- Summary: Argues that vector search alone is insufficient for practical RAG and introduces combining multiple search techniques; agents add agency by mixing search tools (vector, keyword, hybrid, SQL, graph) per use case.
- Key claims: vector-only retrieval has documented deficiencies (misses exact words/numbers, jargon confusion, near-duplicate crowding, stale facts, restricted-content leaks, ambiguity); practical RAG almost always combines search techniques; choose supplementary techniques by data type and use case; don't rely on search alone to determine RAG context.
- Learner-relevant: the decision framework for choosing retrieval strategies in agent design.

### 6.3.1 Everything begins with search and relevance
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.3.1]]`
- Summary: Details the deficiencies of vector-only search (Table 6.2) and surveys alternative retrieval methods — keyword, vector, hybrid, relational DB (SQL), and graph — with pros, cons, and typical use cases (Table 6.3).
- Key claims: vector search misses exact tokens/numbers, confuses jargon, lets near-duplicates crowd top-k, returns "feels related but doesn't answer" hits, can't follow relationships, goes stale, mis-handles ambiguous words, and can leak restricted content; fixes range from keyword/hybrid search and MMR/dedup to reranking, SQL/relational filters, graph search, and ACLs; agents can compose these search tools into complex RAG workflows.
- Learner-relevant: the main reference for why and when to use each retrieval method.

### 6.3.2 Building a vector search RAG agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.3.2]]`
- Summary: Builds a complete RAG agent (Back to the Future script) that chunks a document by token count, embeds chunks into Chroma DB, exposes a search_script tool, and grounds answers with grounding instructions; also covers grounding degrees and verification.
- Key claims: pipeline = load → simple_chunk by token count → embed → populate persistent Chroma collection if empty → tool-backed agent; grounding constrains the model to retrieved context rather than training data, preventing hallucinations; prompt patterns: "answer only from provided context", citation requirements, "quote passages then answer"; grounding spans the whole stack (chunk quality, retrieval relevance, evaluation), not just the prompt; vector search is not granular enough to find exact key terms like "1:15 AM", so it fails the time question.
- Learner-relevant: the canonical minimal RAG agent recipe and the grounding concept that recurs across the subject.

### 6.3.3 Building a hybrid search RAG agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.3.3]]`
- Summary: Extends the RAG agent with both keyword and vector search tools, explains Reciprocal Rank Fusion (RRF) for merging ranked lists, and adds reference/citation requirements to the agent instructions.
- Key claims: keyword and vector scores aren't comparable (BM25 vs. cosine), so a fusion function merges ranked lists; RRF (sum of 1/(k + rank), k ≈ 60) ignores raw scores and uses rank position only — robust across backends and the default in most production hybrid systems; agents can also decide themselves when to call each search tool; enforcing references ([Reference X] markers) plus grounding forces diligence and verifiable answers; hybrid agents can be extended to relational/graph search, and MCP eases this.
- Learner-relevant: the hybrid-search pattern and RRF mechanism the learner can apply in later agent-building nodes.

### 6.4 Adding memory to agents with MCP
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4]]`
- Summary: Introduces agent memory built from databases, vector stores, and context windows, and shows how MCP servers provide out-of-the-box tools to power agent knowledge and memory without custom tool-building complexity.
- Key claims: RAG is powerful but complex beyond simple cases; MCP shines by exposing ready-made memory/knowledge tools to agents; cognitive memory vocabulary (short-term, long-term, episodic, semantic) is a useful shorthand, not a model of agent memory.
- Learner-relevant: frames the memory mechanics that MCP implementations in 6.4.2–6.4.5 depend on.

### 6.4.1 Understanding memory form and agent function
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4.1]]`
- Summary: Maps cognitive memory categories onto architectural pieces: context window, external storage, state management, and retrieval mechanisms; covers sensory (multimodal), short-term/working, and long-term (semantic, episodic, procedural) memory and how memories are captured, stored, and augmented.
- Key claims: memory vocabulary is a tool, not a model — labels like "short-term/long-term" obscure the real distinction (bounded by per-call context vs. outside it); agents need to store across sessions, retrieve relevant pieces, and integrate them into the prompt; sensory memory = same embed-and-search mechanics applied to images/audio (multimodal retrieval, e.g., CLIP/OpenCLIP) but less mature; memory differs from knowledge in how it is updated/appended; memories may skip chunking; store form should match what you want to remember (facts/statistics → keyword/relational; social relationships → graph).
- Learner-relevant: the conceptual model of memory that lets learners reason about which store/retrieval pattern fits a need.

### 6.4.2 Attaching a graph database for memory using MCP
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4.2]]`
- Summary: Uses the MCP reference memory (graph) server to give an agent long-term memory of entities, relationships, and observations, demonstrated on the Back to the Future script's knowledge graph; covers what the memory server exposes and its limits.
- Key claims: graph DBs model entities as nodes and relationships as edges ("Micheal lives in Calgary" → two nodes + a lives_in edge); the MCP memory server exposes a small toolset (add_observation, add_relationship, query_facts, ...) that the agent decides when to call; graph retrieval is efficient for relationship traversal but struggles with fuzzy matching, requires clean structured-fact extraction, and scales differently than vector stores; the "Doc vs. Doc Brown" example shows why a single store mis-fails to link aliases — motivating hybrid memory.
- Learner-relevant: first MCP-backed memory agent pattern; foundation for hybrid memory.

### 6.4.3 Creating hybrid memory systems with MCP
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4.3]]`
- Summary: Combines ChromaDB semantic memory with a knowledge-graph memory via two MCP servers, driving everything through agent instructions that enforce a mandatory hybrid retrieval and dual-storage workflow.
- Key claims: all the hybrid logic lives in agent instructions (semantic search → graph search → hybrid synthesis → dual capture → monitor → respond); the memory agent uses both memory forms for every interaction, unlike the hybrid knowledge agent which lets the agent choose; workflow: user input → semantic search → interpret entities/observations → graph search → update both stores → respond; honest caveats: local stores are ephemeral, MCP is a thin wrapper, production memory needs persistence, access control, observability, eviction, and retrieval-quality evaluation.
- Learner-relevant: the pattern for multi-store memory agents and realistic expectations for production memory.

### 6.4.4 Semantic augmented memory and applications to semantic, episodic, and procedural memory
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4.4]]`
- Summary: Explains how semantic, episodic (events), and procedural (steps/processes) memories differ and how episodic/procedural memories fit the relational pattern while also benefiting from semantic augmentation.
- Key claims: episodic memories are about events, procedural about processes/steps, semantic about meaning (can include feelings/emotions); episodic and procedural memories fit relational search but may also be stored in semantic/vector storage for general retrieval; memory augmentation feeds previous experiences into an LLM that generates the questions a user may ask to activate each memory — reverse-engineering meaning for future retrieval.
- Learner-relevant: the augmentation technique that makes memories retrievable by future, paraphrased queries.

### 6.4.5 Uncluttering memory with compression and forgetting
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4.5]]`
- Summary: Covers memory compression (cluster similar memories with k-means, then summarize each cluster into a single memory stored in a fresh vector DB) and forgetting/eviction, with use-case guidance and production/compliance caveats.
- Key claims: compression = semantic augmentation plus a clustering/summarization layer; recommended when clusters are large/unbalanced or stores show repetitive duplicates; verbose prose knowledge benefits more than code; memory benefits from periodic compression, knowledge typically only on first load; multiple compression passes create different levels of expertise; advanced systems blend knowledge and memory or use multiple per-user stores; forgetting suits repetitive memories, compression suits many similar-but-different ones; production memory needs eviction policies, and in regulated industries (healthcare, finance, law) eviction is a compliance question.
- Learner-relevant: the maintenance techniques that keep growing memory/knowledge stores lean and retrieval quality high.