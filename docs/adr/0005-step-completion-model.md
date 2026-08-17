# Completion is step-based; supersedes ADR-0002

Status: accepted (supersedes ADR-0002)

Completion is redefined around steps. A **step** is the only completion unit: it is complete when `/tackle` passes (mastery reaches `solid`). A **node** is complete automatically once every step in its DAG is complete. **Elements** are keywords and are not marked complete. `prepares/` is removed.

This replaces the ADR-0002 checklist model (manual element checkmarks with derived node completion).

## Considered Options

- **Manual element completion with derived node completion (ADR-0002, rejected).** Relies on the learner marking things done, which invites the self-deception the system exists to prevent ("easy to gaslight yourself into thinking you understood something").
- **Step-based completion gated by adaptive tackle (kept).** Verification is machine-graded and mastery-based; passing is the system's judgment, not the learner's.

## Consequences

- Progress state splits: mastery persists in a per-subject file (calibration data); step completion lives client-side (UI state).
- `question` element type is no longer the graded unit; element `Questions` sections become no-grade preview self-checks.
- The site's progress tracking must shift from element checkboxes to per-step tackled state and derived node completion (see `docs/site-migration-memo.md`).
