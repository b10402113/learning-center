---
source: 05-variables.md
source_hash: b191e46361906d01df7f89313746d04ded4958d6b44a61e457a2a88965586cb7
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
---

# Digest — 05-variables.md

## Overview (L1)

- Variables give names to values; Python is dynamically typed (type is inferred, not declared)
- Running Python from files (`uv run main.py`) and from the REPL (`uv run python`)
- VS Code Python extension may interfere with the modern REPL; disable shell integration if needed
- Variable naming: snake_case convention; avoid naming variables `list` or other built-in names
- `None` is Python's null value; checking `if x is None` is idiomatic (not `if x == None`)
- f-strings for string interpolation: `f"Hello, {name}!"`

## Sections (L2)

### Variables and Running Python
- Locator: [[sources/pro-python/completed/20260903_05-variables.md#variables-and-running-python]]
- Summary: How to create variables and run Python from files and the REPL
- Key claims: Python is dynamically typed; variables are untyped references to values; f-strings are the preferred interpolation method
- Learner-relevant: Foundation for writing and running any Python code

### Naming Conventions and None
- Locator: [[sources/pro-python/completed/20260903_05-variables.md#naming-conventions-and-none]]
- Summary: snake_case for variables; `None` as the null value; identity checks with `is`
- Key claims: Never name a variable `list`, `dict`, or other built-in; `is None` is idiomatic, not `== None`
- Learner-relevant: Avoids common beginner mistakes and establishes Pythonic conventions
