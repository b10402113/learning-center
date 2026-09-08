---
source: 06-types.md
source_hash: 3a0d06f1956cdce840364a412de1705f276681396e696ca4db41df5497ee2793
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 06-types.md

## Overview (L1)

- Python is dynamically typed; variables can be reassigned to different types (`priority = 13; priority = "urgent"`)
- Type hints are hints, not enforced at runtime — a layer of tooling (mypy) is needed for enforcement
- Built-in constructors for explicit type conversion: `int()`, `float()`, `bool()`, `list()`, `dict()`, `set()`
- Standard comparisons: `==`, `!=`, `<`, `>`, `<=`, `>=` — all return booleans
- f-strings support expressions: `f"Total: {price * quantity:.2f}"`
- `print()` can take multiple arguments separated by commas

## Sections (L2)

### Dynamic Typing and Type Conversion
- Locator: [[sources/pro-python/completed/20260903_06-types.md#dynamic-typing-and-type-conversion]]
- Summary: Variables have no fixed type; reassignment to different types is valid; explicit type conversion via constructors
- Key claims: `bool(0)` is False, `bool(1)` is True; `int("42")` converts strings; built-in types don't need imports
- Learner-relevant: Understanding dynamic typing is essential to avoid type-related bugs

### Comparisons and String Formatting
- Locator: [[sources/pro-python/completed/20260903_06-types.md#comparisons-and-string-formatting]]
- Summary: Standard comparison operators; f-strings with format specifiers; print() multi-argument support
- Key claims: f-strings support `.2f` for floats, `{name!r}` for repr; comparisons always return booleans
- Learner-relevant: Common patterns used in every Python program
