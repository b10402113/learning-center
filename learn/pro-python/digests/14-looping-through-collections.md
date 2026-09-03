---
source: 14-looping-through-collections.md
source_hash: cf65d34666184efc12a9dc3121219f4e9fc2fc60f30db6e98d5944c071de1e6c
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
---

# Digest — 14-looping-through-collections.md

## Overview (L1)

- `for` loops: `for item in collection:` — works for lists, tuples, sets
- Dict iteration: `.items()` returns key-value pairs; `for key, value in dict.items()` unpacks tuples
- Loop variable persists after loop (holds last value) — be mindful of scope
- List comprehensions: `[expr for item in collection]` — concise alternative to for loops
- Comprehensions can include conditions: `[expr for item in collection if condition]`
- Dict comprehensions: `{key: value for item in collection}`

## Sections (L2)

### For Loops
- Locator: [[sources/pro-python/completed/20260903_14-looping-through-collections.md#for-loops]]
- Summary: `for` loop syntax for lists, tuples, sets; dict iteration with `.items()`
- Key claims: Loop variable persists after loop ends; `.items()` returns iterable of (key, value) tuples; tuple unpacking in for loop header
- Learner-relevant: For loops are the primary iteration mechanism; understanding scope of loop variable prevents bugs

### List Comprehensions
- Locator: [[sources/pro-python/completed/20260903_14-looping-through-collections.md#list-comprehensions]]
- Summary: Concise syntax for transforming and filtering collections
- Key claims: `[expr for item in collection if condition]` combines mapping and filtering; more Pythonic than explicit for loops for simple transformations
- Learner-relevant: Comprehensions are idiomatic Python; used extensively in data processing and API code

### Collection Summary
- Locator: [[sources/pro-python/completed/20260903_14-looping-through-collections.md#collection-summary]]
- Summary: When to use each collection type
- Key claims: Lists preserve order and are mutable; tuples are immutable; sets remove duplicates; dicts map names to values (JSON-like)
- Learner-relevant: Choosing the right collection type is a fundamental Python skill
