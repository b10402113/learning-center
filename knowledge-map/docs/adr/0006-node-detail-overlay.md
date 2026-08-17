# ADR-0006: Roadmap node click opens a node detail overlay (reversing card expansion)

ADR-0004 made roadmap node cards expand in place to show their step-DAG (step
cards + dependency arrows) plus the node's lesson description. In practice the
in-place expansion felt cramped and pushed the rows below it around; learners
preferred the previous "click a node → a list of its steps opens" flow. This
ADR restores that flow as a **node detail overlay** and retires the card
expansion. It reverses only the **roadmap** decision of ADR-0004 — the nebula
decision there is untouched.

## Decisions

- **Roadmap**: node cards are fixed-size again. Clicking a card opens the node
  detail overlay. The overlay lists the node's steps in reading order (title,
  completion status, dependencies as small text — no dependency arrows), a
  `step x / y` counter, and the node's prerequisite cards. A step click opens
  that step's reader modal on top, leaving the overlay underneath; Esc belongs
  to the reader modal while it is open.
- **Closing**: overlay click / Esc / close button dismiss it, keeping the card
  selected and the map hash retaining the node, so shared deep-links still
  resolve.
- **Deep-links**: a map hash targeting a node auto-opens its overlay (previously
  it auto-expanded the card).
- **Retired**: in-place card expansion — `expandedCardHeight` and tier reflow,
  the dependency-arrow SVG, the ▾ affordance, the lesson excerpt, and the
  element-marker labels on step rows.

## Considered Options

- **Restore the pre-ADR-0004 `NodeDetailView` verbatim (rejected).** Its step
  rows were read-only. The model has since made steps the reading unit (ADR-0004
  / 0005), so a popup that shows steps but cannot open them regresses navigation.
- **Keep both expansion and overlay (rejected).** Two affordances for the same
  data; the cards would carry the expansion machinery as dead weight.
- **Render the dependency arrows inside the overlay (rejected).** Arrows belong
  on the node page's step-DAG; a compact overlay list expresses dependencies as
  small text.

## Consequences

- `RoadMap` / `RoadNode` drop the expansion machinery (layout reflow, arrow SVG,
  ▾/lesson/teaches on cards). `App.tsx` swaps `expandedNodeId` /
  `toggleExpandNode` / `selectRoadStep` for `nodeDetailOpen` / `openNodeDetail`
  / `closeNodeDetail` / `selectNodeDetailStep`. `NodeDetailView` returns as a
  step-based component with clickable rows, reusing the `path-detail-*` CSS.
- `CONTEXT.md` gains the "Node detail overlay" term, and the Roadmap entry no
  longer describes cards as expanding.