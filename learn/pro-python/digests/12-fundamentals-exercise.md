---
source: 12-fundamentals-exercise.md
source_hash: defb1d487f2f71d0c9c3c9fa53f64b977fe5fac10f7119945c6163868e64b1ec
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 12-fundamentals-exercise.md

## Overview (L1)

- First exercise: basic Python with enums, logic, and functions
- `is_overdue()` method using `if not due_date` (truthiness), status checks, and date comparison
- `match`/`case` syntax for enum-based branching (cleaner than if/elif chains)
- Time zone warning: always standardize on UTC in production; naive date comparisons can be wrong across time zones
- Exercise covers: type conversion, enums, conditionals, date handling

## Sections (L2)

### Fundamentals Exercise
- Locator: [[sources/pro-python/completed/20260903_12-fundamentals-exercise.md#fundamentals-exercise]]
- Summary: Exercise implementing `is_overdue()` with enums, conditionals, and date comparison
- Key claims: `match`/`case` provides cleaner branching on enums; time zones must be standardized (UTC) in production; `if not due_date` leverages truthiness
- Learner-relevant: Hands-on practice combining variables, types, enums, and conditionals learned so far

### Time Zone Considerations
- Locator: [[sources/pro-python/completed/20260903_12-fundamentals-exercise.md#time-zone-considerations]]
- Summary: Naive date comparisons break across time zones; standardize on UTC
- Key claims: UTC is the standard for production systems; time zones are complex and outside course scope
- Learner-relevant: Important production consideration that often causes subtle bugs
