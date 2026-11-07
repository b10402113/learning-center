---
source: sources/js-mastery-engineer/20261107/supplement/082 - Demo - Running -check review.txt
source_type: text
source_lines: 24
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The final check after developing and testing is a code review by someone who did not write the code.
- The review skill runs in Claude Code and can be pointed at a specific area, such as the data model.
- It verifies the active model and confirms it is not the original author before proceeding.
- It checks the entire codebase rather than only the diffs, which is essential for safety.
- Evaluation includes major issues, minor fixes, nitpicks, and a summary of strengths and test coverage.
- Findings include critical fixes such as dependency issues and compliance with expiration requirements.
- The review document can direct the agent to implement fixes and use /debug or /test to resolve issues.

# L2 detail

- `#L1-L4` — title block and lecture summary header
- `#L5-L11` — the review stage after develop and test, and pointing the skill at an area
- `#L12-L17` — author verification and whole-codebase checking
- `#L18-L24` — severity categories, example findings, and using the report to fix issues
