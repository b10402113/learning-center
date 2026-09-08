---
source: 08-functions.md
source_hash: 8f7d74e7eb0488c6ed993404e1ad0b76a45a43b491f303292fc8aa0ea40eb9dc
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 08-functions.md

## Overview (L1)

- Functions defined with `def`, parameters, colon, and indentation (no curly braces)
- Functions should return values rather than print — keeps them composable and testable
- Default parameter values: `def slugify(name, separator="-")`
- Keyword-only arguments enforced with `*` in parameter list: forces callers to name arguments explicitly
- Python uses indentation to define code blocks; editors auto-indent after a colon
- `return` statement is optional; functions without `return` return `None`

## Sections (L2)

### Function Basics
- Locator: [[sources/pro-python/completed/20260903_08-functions.md#function-basics]]
- Summary: `def` keyword, parameters, colon, indentation; return values vs. printing
- Key claims: Functions should return values, not print; editors auto-indent after colon; `return` is optional
- Learner-relevant: Core building block for all Python code; returning values is more testable than printing

### Default Parameters and Keyword-Only Args
- Locator: [[sources/pro-python/completed/20260903_08-functions.md#default-parameters-and-keyword-only-args]]
- Summary: Default parameter values; `*` separator enforces keyword-only arguments
- Key claims: `*` after positional args forces callers to name remaining arguments; defaults make APIs more ergonomic
- Learner-relevant: These patterns appear in virtually every Python API and framework
