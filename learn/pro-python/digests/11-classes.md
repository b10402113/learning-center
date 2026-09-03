---
source: 11-classes.md
source_hash: 8a0940bb0d4c460bc0970ef1bc7829778099d4d1c3a7d6a6b3c5c89d7d10a764
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
---

# Digest — 11-classes.md

## Overview (L1)

- Two shapes for grouping data and behavior: dataclasses and full classes
- `@dataclass` eliminates boilerplate: auto-generates `__init__`, `__repr__`, `__eq__`
- Dataclasses: `@dataclass class Project: name: str; slug: str; archived: bool = False`
- Full classes needed when you require custom logic, methods, or complex initialization
- `__post_init__` for validation after dataclass initialization
- `field(default_factory=list)` for mutable default values (avoid bare `= []`)
- `frozen=True` on dataclass makes instances immutable

## Sections (L2)

### Dataclasses
- Locator: [[sources/pro-python/completed/20260903_11-classes.md#dataclasses]]
- Summary: `@dataclass` decorator auto-generates `__init__`, `__repr__`, `__eq__` from field definitions
- Key claims: Dataclasses solve the "yucky print" problem; equality checks work for free; `frozen=True` makes instances immutable
- Learner-relevant: Dataclasses are the modern Python way to define simple data containers; used extensively in the course project

### Full Classes and Post-Init
- Locator: [[sources/pro-python/completed/20260903_11-classes.md#full-classes-and-post-init]]
- Summary: When to use full classes vs. dataclasses; `__post_init__` for validation; `field(default_factory=...)` for mutable defaults
- Key claims: Full classes needed for complex logic; `__post_init__` runs after `__init__`; mutable defaults must use `default_factory`
- Learner-relevant: Knowing when to choose dataclass vs. full class prevents over-engineering
