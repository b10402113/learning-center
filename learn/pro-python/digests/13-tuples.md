---
source: 13-tuples.md
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 13-tuples.md

## Overview (L1)

- Section 2 goals: collections (lists, tuples, sets, dicts), for loops, comprehensions, exceptions, context managers, decorators
- Lists: mutable, ordered, square brackets `[]`; `list()` constructor; common methods: `append()`, `extend()`, `pop()`, `index()`
- Tuples: immutable, ordered, parentheses `()`; single-element needs trailing comma `(1,)`; unpacking: `a, b = (1, 2)`
- Sets: unordered, unique values, curly braces `{}` or `set()`; set operations: union, intersection, difference
- Dicts: key-value pairs, curly braces `{}`; `dict()` constructor; `.get()` for safe access with defaults; `.items()`, `.keys()`, `.values()`
- Don't name variables `list`, `dict`, or `set` (shadows built-ins)

## Sections (L2)

### Lists
- Locator: [[sources/pro-python/completed/20260903_13-tuples.md#lists]]
- Summary: Mutable ordered collections; square bracket syntax; common mutation methods
- Key claims: Lists are the most common collection; `.append()` adds one item, `.extend()` adds multiple; `.pop()` removes by index
- Learner-relevant: Lists are used everywhere; understanding mutability is critical

### Tuples and Sets
- Locator: [[sources/pro-python/completed/20260903_13-tuples.md#tuples-and-sets]]
- Summary: Immutable ordered tuples; unordered unique sets; set operations
- Key claims: Tuples need trailing comma for single elements; sets auto-deduplicate; set operations (union, intersection) are built-in
- Learner-relevant: Tuples for fixed data, sets for uniqueness — choosing the right type prevents bugs

### Dictionaries
- Locator: [[sources/pro-python/completed/20260903_13-tuples.md#dictionaries]]
- Summary: Key-value mapping; maps directly to JSON structure; `.get()` for safe access
- Key claims: Dicts mirror JSON structure; `.get(key, default)` avoids KeyError; `.items()` returns key-value pairs
- Learner-relevant: Dicts are the primary data structure for API request/response bodies
