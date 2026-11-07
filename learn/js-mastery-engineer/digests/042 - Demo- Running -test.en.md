---
source: sources/js-mastery-engineer/20261107/course/042 - Demo- Running -test.en.txt
source_type: text
source_lines: 49
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Explains that `check verify` proved the feature works today, but future changes could break it silently, so `test` turns the one-time proof into lasting protection.
- Shows running `/test` alone: it inspects the codebase (about 40 files) and asks how to focus — logic/API first, test everything in batches, or narrow by files.
- Demonstrates narrowing to a specific feature (`test data model`) and choosing to run the suite and fix it to green after writing.
- Details the generated tests targeting untested data-model parts (odds invariant, client edit, share token creation/resolution) while smoke tests already cover pins against the database.
- Notes the skill chooses sensible test types without asking: unit tests for comment logic, integration tests for endpoints, rendered component tests for the thread UI.
- Reports the result (15 passed, zero failed), completion marking, and a test preferences file that lets future runs skip straight to writing.
- Summarizes the flexibility of the test skill: with no arguments, a spec, or a feature.

# L2 detail

- `#L1-L19` — Frames test as protection for future changes, shows `/test` inspecting the suite, and the focus question.
- `#L20-L32` — Narrows to the data model, selects run-and-fix-to-green, and writes three unit tests; explains automatic test-type choices.
- `#L33-L49` — Completion, the still-unchecked verify box, the 15-passed result, the preferences file, and the skill's flexible invocation.
