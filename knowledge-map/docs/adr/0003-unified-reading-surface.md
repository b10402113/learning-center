# ADR-0003: Unified reading surface — shared docs-page component with modal + standalone pages

Node lessons and element concept pages now share one three-column docs-page
component (left course nav, center article, right TOC → progress → related-content
list). The DetailPane side panel is retired. Reading is entered in two ways:

- **Reader modal** — from the map (Roadmap or Nebula), the checklist modal's
  element/main/prerequisite rows, chips, wikilinks, or ⌘K search, the same
  docs-page component renders inside a transient overlay with an "expand"
  affordance. The checklist modal stays open underneath (nested stacking).
- **Standalone page** — "expand" (or a pasted deep-link) navigates to the
  standalone route `#/nodes/<subject>/<node-id>` or
  `#/elements/<subject>/<element-id>?from=<node-id>`. Inside a standalone page,
  links navigate directly to their target page — no modal.

The `?from=<node-id>` query param on element routes records the teaching lesson
the learner came from, so the element page's breadcrumb can always jump back to
that lesson. Without an origin it falls back to the element's first taught-by
node, then to a bare `subject / 元素 / title`.

Rationale: long articles need a full-width, shareable, addressable reading
surface — a 26rem sidebar compresses them; but map-originated clicks should not
yank the learner away from the survey context, hence the transient modal with an
explicit expand.

Considered but rejected: keeping the DetailPane for inline reading (narrow panel,
no per-content URL, full-read mode as a poor man's expand); standalone routes only
without a modal (every map click navigates away, losing the survey); and an
in-memory navigation stack for breadcrumb origins (not shareable and breaks the
browser back button — the `?from=` param is deterministic and testable).
