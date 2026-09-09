---
source: 09-type-hints.md
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 09-type-hints.md

## Overview (L1)

- Type hints use `:` after parameter name and `->` for return type: `def slugify(name: str, separator: str) -> str`
- Type hints are NOT enforced at runtime — only with external tooling (mypy, Pydantic)
- Error from wrong type is not a type error; it's an attribute error (e.g., `int has no attribute strip`)
- `*` in parameter list forces keyword-only arguments after it
- f-strings: `f"Hello, {name!r}"` uses `repr()` formatting
- Comments: single `#` hash per line (no multi-line comment syntax)

## Sections (L2)

### Type Hints Syntax
- Locator: [[sources/pro-python/completed/20260903_09-type-hints.md#type-hints-syntax]]
- Summary: Adding type annotations to function parameters and return types
- Key claims: `name: str` annotates parameters; `-> str` annotates return type; not enforced at runtime
- Learner-relevant: Type hints improve code readability and enable static analysis with mypy

### Keyword-Only Arguments
- Locator: [[sources/pro-python/completed/20260903_09-type-hints.md#keyword-only-arguments]]
- Summary: `*` separator in parameter list forces keyword-only arguments after it
- Key claims: Prevents positional argument mistakes; improves API clarity; widely used in frameworks
- Learner-relevant: Essential for understanding FastAPI and other framework function signatures
