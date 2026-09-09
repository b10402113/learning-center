---
source: 10-boolean.md
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 10-boolean.md

## Overview (L1)

- Conditionals: `if`/`elif`/`else` with indentation; whitespace matters (mismatched indent = error)
- Truthiness: `False`, `None`, `0`, `""`, `[]`, `{}`, `set()` are all falsy; everything else is truthy
- `bool()` built-in can test truthiness of any value
- Practical example: `is_overdue()` function checking due date and status
- Chained comparisons: `if a < b < c` is valid Python syntax
- `match`/`case` (structural pattern matching) for clean branching on enum values

## Sections (L2)

### Conditionals
- Locator: [[sources/pro-python/completed/20260903_10-boolean.md#conditionals]]
- Summary: `if`/`elif`/`else` syntax; indentation defines code blocks; whitespace errors are common
- Key claims: Indentation mismatch causes errors; `elif` can be chained; all alternatives except `if` are optional
- Learner-relevant: Fundamental control flow used in every Python program

### Truthiness
- Locator: [[sources/pro-python/completed/20260903_10-boolean.md#truthiness]]
- Summary: Falsy values in Python; `bool()` for testing; practical `is_overdue()` example
- Key claims: `None`, `0`, `""`, `[]`, `{}`, `set()` are falsy; `bool()` tests any value; `if not due_date` is equivalent to `if due_date is None`
- Learner-relevant: Truthiness is used extensively in Pythonic conditional patterns
