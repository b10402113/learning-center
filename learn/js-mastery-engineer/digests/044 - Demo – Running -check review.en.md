---
source: sources/js-mastery-engineer/20261107/course/044 - Demo – Running -check review.en.txt
source_type: text
source_lines: 59
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Demonstrates `check review`, the GA-tier step where a different model reads code it did not write.
- Shows running `check review data model`, with the check skill asking verify vs review and which part of the app.
- Explains the skill identifies the author model from project settings rather than asking the current model to self-report (which can be stale).
- Confirms the author, then picks a different model in a separate read-only helper so the diff and file reading stay out of the session and it cannot edit the judged code.
- Covers the review approach: check the diff, then read every affected file completely, because surrounding code decides whether a change is safe.
- Reports the findings: Supabase.js wrongly in devDependencies breaks production auth, client JWT has no expiry despite a required 90-day expiry, unguarded transactions, and a skipped test that never ran; plus 10 minor, 8 nitpicks, and strengths.
- Shows the review written to `docs/review`, and how fixes can be implemented, with debug for bugs and test for test-related fixes.

# L2 detail

- `#L1-L18` — Frames independent review, runs check, and selects review on the data model.
- `#L19-L31` — Identifies the author via project settings, confirms, and runs the review in a separate read-only helper that reads whole files, not just the diff.
- `#L32-L59` — Reports five major fixes (dependency placement, JWT expiry, transactions, gated test), minor/nitpick sections, the `docs/review` output, and follow-up via debug/test.
