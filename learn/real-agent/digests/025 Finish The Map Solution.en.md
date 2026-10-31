---
source: sources/real-agent/20261030/Planning/025 Finish The Map Solution.en.srt
source_type: text
source_lines: 1091
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- The final grilling narrows scope to version one: feed-only, no email or web push, with out-of-scope items parked on the map for later.
- Old maps can be reopened to scope in what was previously out of scope, which makes the tracker a useful historical record.
- The prototype ticket uses the prototype skill to generate competing UI variants, then iterates on the winner through explicit visual feedback.
- Prototyping works as high-fidelity grilling: it can drop back to low fidelity when a question does not need a build.
- After all nine sub-issues close, a mop-up grilling clears the remaining fog and records the last decisions.
- The finished map is a complete index of every grilling and prototype, ready to become a spec.

# L2 detail

- `#L1-L42` — Framing: the author drives the remaining tickets, more like a coding walkthrough; the first grilling asks which channels each notification uses.
- `#L43-L114` — Version-one scope: everything lands in the feed, email and web push are deferred to keep scope small; the third-party service stays the hub for future channels.
- `#L115-L180` — Refund emails: reject minting a separate "transactional email" concept, keep refunds as notifications and extend later; the refund-requested receipt should be a notification.
- `#L181-L242` — The map is bounded to version one; email sits out of scope; implementation questions are agreed quickly; no glossary or ADR changes.
- `#L243-L306` — Resolve the ticket, move to the feed prototype, and note that independent tickets could be grilled in parallel, with overlap reducing context-switch cost.
- `#L307-L458` — Prototype at roughly 73k tokens: variants A (bell popover) and B (seed the feed), then C (inbox plus toasts); reject an oversized drawer; prototyping is where taste gets imposed.
- `#L459-L598` — Seen vs read distinction noticed; worry about 100 notifications; ask for pagination variants; the agent probes badge counts and deleted comments; prototype equals high-fidelity grilling.
- `#L599-L718` — Pagination variants: 9+ badge, load-more, infinite scroll, latest-at-top with see-all; multiple variants teach different things and are cheap to produce.
- `#L719-L814` — Feedback round: drop totals and unread buttons, prefer explicit mark-all-read, shrink icons; question when read items disappear; pick A2 as canonical; keep all history.
- `#L815-L930` — Close the prototype by dropping to low fidelity for the empty-state question; then the last decision ticket on notification preferences, including a provider-agnostic interface; all nine sub-issues closed.
- `#L931-L1091` — Map still has fog: a final mop-up grilling resolves the not-yet-specified items, a plumbing ticket records the decisions, and the fog clears, leaving a detailed index ready to turn into a spec.
