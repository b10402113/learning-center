# Adaptive Learning OS

This repository is the design and knowledge base for an Adaptive Learning OS: a learning agent that turns sources into adaptive learning paths and explanations grounded in the learner's experience.

The architecture and domain operations below are the target design. A directory, schema, or operation described here may be planned rather than implemented. Inspect the repository before assuming it exists. `CLAUDE.md` delegates to this file, so this is the agent contract for the repository.

## Product Direction

The system is more than static note storage. It uses the learner's `MEMORY`, current feedback, and cognitive state to generate and continuously adjust a `ROADMAP` and its knowledge `NODE`s.

The differentiator is **experience-grounded explanation**: extract the learner's existing domain knowledge, such as system design, hardware packaging, or PDN analysis, and use it to build accurate, useful analogies for new concepts.

The design uses:

- **Layering**: keep raw data, learner context, learning structure, explanations, and relationships separate.
- **Lazy materialization**: store abstract knowledge nodes independently from user-specific prose; render an explanation only when needed.
- **Feedback loops**: treat learning as an evolving state machine, not a one-way generation pipeline.

## Target Architecture

| Layer | Name | Responsibility |
|---|---|---|
| L0 | `RAW` | Ingest and preprocess unstructured sources such as PDFs, videos, and Markdown. Produce chunks, entities, difficulty signals, embeddings, and metadata. |
| L1 | `MEMORY` | Maintain the learner model: goals, time budget, background skill tree, patience, depth preference, and other context parameters. Keep an agent-readable JSON representation and a user-readable Markdown representation when implemented. |
| L2 | `ROADMAP` | Represent a topic as a tiered learning graph. Use abstraction tiers rather than a single difficulty score: `T1` mental models, `T2` mechanisms, `T3` implementation details, and `T4` edge cases. Choose an entry point such as recommended, fast-track, or skip from `MEMORY`. |
| L3 | `NODE` | Represent an abstract concept as a user-dependent explanation function. Materialize core intuition, an experience-grounded analogy, anti-patterns, and a quiz from the learner context. |
| L4 | `EDGE` | Represent explicit relationships between nodes for interleaving: `prerequisite`, `analogy`, `vs`, and `abstraction_of`. |

Keep data and presentation decoupled. A rendered explanation is an output of a node plus learner context, not the definition of the node itself.

## Execution Loop

Run the learning loop in order. Record the evidence needed to decide the next transition.

1. **Learn**: select the best current `NODE` from `ROADMAP` and render it with `MEMORY`. Complete when the learner has a concrete explanation to study.
2. **Quiz**: use or generate the node's validation questions. Complete when answers or observable learner feedback are recorded.
3. **Evaluate**: classify the result as pass, fail, or blocked, with evidence. Complete when the outcome and uncertainty are explicit.
4. **Adapt**: on failure or blockage, update `ROADMAP`, which may insert prerequisite or bridging nodes. Complete when the next learning action is selected.
5. **Regenerate**: when the explanation method failed, update the `NODE` rendering strategy by changing the analogy, reducing technical depth, or using a different representation. Complete when a revised explanation is available for the next loop.

Do not treat a failed quiz as proof that the roadmap is wrong. First distinguish a missing prerequisite, a poor explanation, insufficient practice, and an unclear evaluation signal.

## Domain Operations

These names are planned domain operations and API concepts. They are not claims that matching CLI commands or `.opencode` skills already exist.

| Operation | Purpose | Completion criterion |
|---|---|---|
| `/init` | Create or update the learner persona vector in `MEMORY`. | Goals, constraints, background, and relevant preferences are recorded with their source or confidence. |
| `/ingest` | Run the L0 pipeline: chunk, embed, tag, and extract entities. | The source is frozen, its derived metadata is available, and wiki updates are complete. |
| `/roadmap` | Generate, evaluate, or adapt a tiered path from a topic and `MEMORY`. | Tiers, relationships, entry point, and open assumptions are explicit. |
| `/expand_node` | Materialize a personalized L3 explanation from an abstract node. | The explanation includes the required intuition, analogy, caveats, and quiz or a stated reason for omission. |
| `/link` | Create L4 relationships, including cross-domain analogies. | Each proposed edge has a relationship type and evidence. |
| `/quiz` | Generate and evaluate questions for a node. | The questions test the intended concept and the result is recorded with evidence. |
| `/adapt` | Act as the controller after feedback and choose the next operation. | The feedback, decision, and resulting state transition are recorded. |

## Repository Knowledge Base

The wiki is the target materialization of L0 source processing and L3 concept knowledge:

```text
AGENTS.md          Agent contract and workflows
CLAUDE.md          Pointer to AGENTS.md
sources/           Raw, immutable source materials
wiki/
  index.md         Catalog of pages and summaries
  log.md           Append-only change record
  pages/           Concept and source pages
  entities/        People, organizations, and tools
```

The current repository may contain standalone notes and may not yet contain every target wiki directory. Preserve existing notes and establish missing wiki directories only when a wiki operation requires them or the user asks for initialization.

### Source Rules

- Normalize a newly added source filename before its first ingest when needed: use `YYYY-MM-DD` plus a descriptive title and place it under the appropriate `sources/` subdirectory.
- After normalization and ingestion begins, treat the source as immutable. Put corrections or new versions in a new source file.
- Link wiki pages to sources with Obsidian-style paths such as `[[sources/articles/2026-04-24_article-title.md]]`.
- Keep derived summaries, metadata, and interpretations in `wiki/`, never inside the raw source.
- Use the environment and existing repository files as the source of truth for paths and available commands; do not invent implementation details to make the target architecture appear complete.

### Ingest Workflow

When the user asks to ingest a source:

1. **Locate and freeze**: identify the source, normalize its filename once if necessary, and confirm its final path before deriving content. Complete when the raw file is in its final immutable location.
2. **Read appropriately**: read text and Markdown directly. For PDFs, convert with `pdftotext` first and analyze the extracted text; do not read PDF content directly. Inspect other media with the available project tools and record limitations. Complete when the source's usable content and limitations are known.
3. **Extract**: identify claims, concepts, entities, relationships, learner-relevant difficulty, and useful metadata. Preserve uncertainty and distinguish source claims from agent interpretation. Complete when every major section has been accounted for.
4. **Materialize**: create or update the relevant page in `wiki/pages/`, including title, date, source link, key insights, and at least two useful cross-references. Update related concept or entity pages when the source changes their meaning. Complete when all affected pages are identified and updated.
5. **Catalog and log**: add or update the one-line entry in `wiki/index.md` and append an entry to `wiki/log.md` describing created pages, updated pages, and cross-references. Complete when a reader can discover the source and reconstruct the ingest.
6. **Verify**: check source links, frontmatter, cross-references, and the absence of edits to the raw source. Complete when the ingest has no unresolved broken links or unrecorded changes.

### Large-Source Workflow

Use this branch for PDFs of roughly 50 or more pages, or any source that cannot fit in the working context.

1. Convert PDFs to plain text with `pdftotext` before chunking.
2. Chunk on chapters or semantic sections, with small overlaps where a boundary could lose context.
3. Dispatch one analysis-only subagent per chunk. Give each subagent access only to source material and require key insights, candidate page titles, proposed wikilinks, and cross-reference suggestions.
4. Merge chunk reports in the main context. Deduplicate claims, reconcile boundary context, and preserve disagreements as uncertainty rather than silently choosing one account.
5. Run the standard ingest workflow after the merge. The main agent owns all wiki writes; subagents return analysis only.

The large-source branch is complete only when every chunk is represented in the merged synthesis and the final wiki updates pass verification.

### Query Workflow

When answering a knowledge-base question:

1. Search relevant wiki pages first when they exist; otherwise search the repository's notes and source-derived material.
2. Synthesize the answer from the strongest available evidence, separating sourced claims, interpretations, and unknowns.
3. Cite supporting pages with Obsidian links such as `[[Page Title]]`.
4. Offer to file a durable answer as a new page only when it adds reusable knowledge.

Complete the query when the answer is evidence-backed, citations resolve to existing material where possible, and gaps are explicit.

### Lint Workflow

Periodically inspect the knowledge base for:

- Contradictory claims between pages.
- Stale claims, marked `[needs update]` rather than deleted.
- Orphan pages with no incoming links.
- Missing or broken cross-references.
- Claims that lack a traceable source.

Lint is complete when each finding is fixed, marked with its status, or recorded as an explicit unresolved issue.

## Wiki Formats

### Page

Use this template for `wiki/pages/*.md`:

```markdown
---
title: Page Title
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [concept]
sources: ["[[sources/articles/filename.md]]"]
---

# Page Title

Brief summary in one or two sentences.

## Key Points

- Point 1
- Point 2

## Connections

- Related to: [[Other Page]]
- See also: [[Another Page]]
```

### Index

Organize `wiki/index.md` by category. Each entry is one line:

```markdown
- [[Page Title]] - One-line summary
```

### Log

Append to `wiki/log.md`; do not rewrite prior entries:

```markdown
## [YYYY-MM-DD HH:MM] ingest | Source Title

- Created [[Page Title]]
- Updated [[Related Page]]
- Added 3 cross-references
```

## Linking and Tags

Use Obsidian links consistently:

- `[[Page Name]]` links to a page.
- `[[Page Name#Section]]` links to a section.
- `[[Page Name|Display text]]` links with an alias.

Use these tags unless the repository establishes a more specific convention:

- `#concept` for ideas, mental models, and frameworks.
- `#person` for people.
- `#tool` for software and services.
- `#paper` for academic papers.
- `#article` for blog posts and articles.
- `#book` for books and chapters.

## Quality Bar

Every wiki change should be:

- **Concise**: skimmable without losing the main claim.
- **Connected**: linked to at least two relevant concepts when such concepts exist.
- **Current**: stale claims are marked, not silently erased.
- **Cited**: factual claims can be traced to a source.
- **Layer-safe**: raw sources remain unchanged and personalized explanations remain separate from abstract nodes.
