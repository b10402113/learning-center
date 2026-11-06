---
id: rag-context-memory
title: "RAG、context 與 agent memory"
subject: ai-agent-workflows
tier: 2
order: 3
status: written
goal: "設計在有限 context 內取用外部知識與記憶的 agent，並說出 RAG、compaction、長期記憶的取捨。"
digests:
  - 4-rag.md
  - 5-context.md
  - 6-agent-memory.md
prerequisites:
  - learn/ai-agent-workflows/nodes/reasoning-llm-vs-agent.md
steps:
  - id: rag-retrieval-pipeline
    author: "google/gemini-3.8-flash"
    title: "RAG 六步：ingest、chunk、embed、store、retrieve、augment"
    purpose: "能說明 RAG 六步管線，並解釋為何要把文件切塊、embedding 後只取相關片段。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/4-rag.txt#L1-L15]]"
      - "[[sources/ai-agent-workflows/20261105/course/4-rag.txt#L16-L94]]"
      - "[[sources/ai-agent-workflows/20261105/course/4-rag.txt#L95-L126]]"
      - "[[sources/ai-agent-workflows/20261105/course/4-rag.txt#L161-L215]]"
      - "[[sources/ai-agent-workflows/20261105/course/4-rag.txt#L256-L389]]"
    blocks:
      - retrieval-augmented-generation
      - chunking
      - embedding
      - vector-similarity
      - rag-vs-fine-tuning
  - id: context-budget-and-compaction
    author: "google/gemini-3.8-flash"
    title: "Context 有限：re-ranker、compaction 與 MMR"
    purpose: "能規劃 context 預算，並用 re-ranker、compaction 與 MMR 在有限視窗內保住關鍵資訊。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/5-context.txt#L1-L85]]"
      - "[[sources/ai-agent-workflows/20261105/course/5-context.txt#L86-L146]]"
      - "[[sources/ai-agent-workflows/20261105/course/5-context.txt#L147-L235]]"
      - "[[sources/ai-agent-workflows/20261105/course/5-context.txt#L236-L323]]"
      - "[[sources/ai-agent-workflows/20261105/course/5-context.txt#L324-L400]]"
    blocks:
      - context-budget
      - reranker
      - compaction
      - maximal-marginal-relevance
      - lost-in-the-middle
  - id: agent-memory
    author: "google/gemini-3.8-flash"
    title: "Agent 沒有記憶：working、semantic、episodic、procedural"
    purpose: "能區分 working、semantic、episodic、procedural 記憶，並選出跨 session 的保存與檢索方式。"
    sources:
      - "[[sources/ai-agent-workflows/20261105/course/6-agent-memory.txt#L1-L63]]"
      - "[[sources/ai-agent-workflows/20261105/course/6-agent-memory.txt#L64-L139]]"
      - "[[sources/ai-agent-workflows/20261105/course/6-agent-memory.txt#L140-L218]]"
      - "[[sources/ai-agent-workflows/20261105/course/6-agent-memory.txt#L219-L262]]"
      - "[[sources/ai-agent-workflows/20261105/course/6-agent-memory.txt#L263-L302]]"
    blocks:
      - working-memory
      - semantic-memory
      - episodic-memory
      - procedural-memory
      - memory-retrieval
created: 2026-11-05
updated: 2026-11-05
---

# RAG、context 與 agent memory

## Lesson

Agent 的知識不是塞進權重，而是在每一輪重新組進 context；context 有限，所以檢索、壓縮與記憶策略決定它能撐多久。這三個 step 從 RAG 的檢索管線，走到 context 的預算與 lost-in-the-middle，再走到短期與長期記憶的分工。

## Steps

1. [RAG 六步：ingest、chunk、embed、store、retrieve、augment](rag-context-memory/rag-retrieval-pipeline.md)
2. [Context 有限：re-ranker、compaction 與 MMR](rag-context-memory/context-budget-and-compaction.md)
3. [Agent 沒有記憶：working、semantic、episodic、procedural](rag-context-memory/agent-memory.md)
