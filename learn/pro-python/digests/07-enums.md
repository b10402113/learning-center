---
source: 07-enums.md
source_hash: e743fc0835a9e5eaa84bd609372f6871dfb64b7a49e6ba5efcec31d626eb0e77
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 07-enums.md

## Overview (L1)

- Enums solve the "magic string" problem: fixed sets of values with auto-complete support
- `StrEnum` (or `str, Enum`) for string-based enums; `IntEnum` for numeric statuses
- `auto()` from the `enum` module generates sequential values automatically
- Enums provide type safety, prevent typos, and make invalid states easier to reject
- Enums work well with `match`/`case` syntax (structural pattern matching)
- Printing an enum gives a readable name like `TaskStatus.PLANNED`

## Sections (L2)

### String Enums
- Locator: [[sources/pro-python/completed/20260903_07-enums.md#string-enums]]
- Summary: Define fixed sets of string values using `StrEnum` to avoid magic strings
- Key claims: Enums provide auto-complete in editors, prevent typos, and make invalid states easier to reject; `auto()` generates values automatically
- Learner-relevant: Replacing hardcoded strings with enums improves code reliability and readability

### Enums in Practice
- Locator: [[sources/pro-python/completed/20260903_07-enums.md#enums-in-practice]]
- Summary: Using enums with `match`/`case` and the REPL for inspection
- Key claims: `match`/`case` provides clean branching on enum values; `auto()` avoids manual value assignment
- Learner-relevant: Enums are used extensively in the Release Tracker project for task statuses and priorities
