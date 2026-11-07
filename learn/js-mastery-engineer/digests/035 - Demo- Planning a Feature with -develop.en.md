---
source: sources/js-mastery-engineer/20261107/course/035 - Demo- Planning a Feature with -develop.en.txt
source_type: text
source_lines: 193
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Demonstrates the `develop` skill on a greenfield project, where the first "feature" is really the architectural foundation rather than a product feature.
- Shows develop reading the scope and the accepted spec index, then using the framework's official initializer to scaffold a Next.js 16 project with pnpm and TypeScript strict mode.
- Explains deliberate just-in-time installation: only baseline and first-slice dependencies are installed, with email, monitoring, analytics, and specialized tools arriving when needed.
- Covers the two ways to direct develop: follow the scope in order, or point it at unplanned work (here a spoken-homepage build from a reference image) and have scope reconcile afterward.
- Shows how develop recognizes interface work, asks whether to architect first or build now, and can write a minimal "assumed" spec recording who proceeded without an architecture decision.
- Details how a single screenshot becomes a full design system: `design.md` captures the visual reading, while colors, spacing, and type live in `globals.css` as one source of truth.
- Notes develop verifies its own result by type-checking, building, and visually checking rendered pages, including contrast and color pairings.
- Explains the operational limit: develop is the heaviest skill in the suite and is appropriate for shippable screens, but excessive for a one-line or spacing tweak.

# L2 detail

- `#L1-L9` — Introduces develop as the step after architecture and frames the greenfield first build as creating the foundation.
- `#L10-L24` — Develop reads the scope and spec index, scaffolds a Next.js 16 project, and uses the framework's official initializer rather than inventing structure.
- `#L25-L43` — Just-in-time dependency installation, preserving existing docs/agents/claude/skills folders, and marking the scaffold subtask complete.
- `#L44-L53` — Proves the generated project runs (dev server, clean build, initial checks) so the audit skill has real scripts and config to track.
- `#L54-L71` — Presents the two ways to direct develop and demonstrates going off-plan by requesting a homepage from a reference image.
- `#L72-L99` — Develop recognizes the interface work, flags feature 10 as needing a decision, offers architect-vs-build-now, and can create an assumed spec.
- `#L100-L127` — Builds the design system from the reference image, writes `design.md`, keeps values in `globals.css`, and offers to save verify steps.
- `#L128-L159` — Build completes, `pnpm dev` shows the homepage matching the reference, and scope can reconcile the unplanned work without arguments.
- `#L160-L193` — Recap of the disciplined vs flexible routes, that a skill is a tool not a track, and that develop's weight suits real screens only.
