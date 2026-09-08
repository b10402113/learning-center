---
source: 019 Bloom Filters
source_hash: 4642f075ea57ce63f225944c8dafb74cd275f34d05b6bf87e1c92d0611a7ea3c
source_lines: 55
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 019 Bloom Filters

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- Imagine needing to check if something is in a huge collection without storing the entire collection in memory. Bloom filters offer a clever solution to this problem. A Bloom filter is a space-efficien
- Bloom filters were invented by Burton Bloom in 1970, but they’re more relevant than ever in today’s data-intensive applications. They shine in scenarios where maintaining a full list or hash set of al
- At its core, a Bloom filter is like a magical checklist that can answer questions of the form, “Have we seen this item before?” It consists of two main components:

## Sections (L2)

### What Exactly Is a Bloom Filter?

- Locator: `[[sources/system-design/completed/20260825_019 Bloom Filters.html#h2-what-exactly-is-a-bloom-filter]]`
- Summary: At its core, a Bloom filter is like a magical checklist that can answer questions of the form, “Have we seen this item before?” It consists of two main components: Bit Array: An array of bits (0s and 1s), initially all set to 0. Hash Functions: Several independent hash functions that each take an input item and produce an index (a position in the bit array). When you add an item to a Bloom filter,
- Key claims: See summary
- Learner-relevant: Core system design concept

### How Bloom Filters Work (Step by Step)

- Locator: `[[sources/system-design/completed/20260825_019 Bloom Filters.html#h2-how-bloom-filters-work-step-by-step]]`
- Summary: Below diagram shows an example Bloom filter for a set containing three items (P, Q, R). Each item is hashed by three hash functions (indicated by different colored arrows) to specific positions in the bit array, which are then set to 1. For instance, item “P” sets three bits (the red arrows). To query a new item, you hash it and check the corresponding bit positions; if any required bit is 0, the 
- Key claims: See summary
- Learner-relevant: Core system design concept

### Understanding False Positives (Why “Probably?”)

- Locator: `[[sources/system-design/completed/20260825_019 Bloom Filters.html#h2-understanding-false-positives-why-probably]]`
- Summary: Bloom filters trade perfect accuracy for efficiency. Let’s unpack the idea of a false positive with a simple analogy: Analogy – Fingerprints on a Shared Paper: Imagine you maintain a guest log using a single large sheet of paper. Every time a new person comes in, instead of writing their name, you ask them to press their thumb on the paper in a few different places, leaving distinct fingerprints. 
- Key claims: See summary
- Learner-relevant: Core system design concept

