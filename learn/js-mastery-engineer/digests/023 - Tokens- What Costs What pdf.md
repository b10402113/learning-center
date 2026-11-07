---
source: sources/js-mastery-engineer/20261107/supplement/023 - Tokens- What Costs What pdf.txt
source_type: text
source_lines: 175
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Everything the agent reads, writes, and reasons through is measured in tokens, small chunks of roughly four characters.
- The point is not precise counting but learning which activities burn a lot and which barely register.
- A quick decision and a precise question are light; a small file read is noticeable; a broad search and reading a big file are heavy.
- Every exchange stays in the window, so conversation history accumulates and keeps counting even after many exchanges.
- An interactive panel tracks exchanges, tokens, and the percentage of the window filled up to a 60-token demo window.
- Scope drives reading cost: the vague "refactor the payment module" is broad, while "update calculateTax in payment/tax.ts for the new rate" is targeted.
- The slide ends with an exploration-cost readout as a percentage of the window.

# L2 detail

- `#L1-L6` — The token framing and why rough cost instincts beat precise counting.
- `#L7-L41` — The "text becomes tokens" illustration, including the ~4-characters-per-token approximation.
- `#L42-L87` — Which activities burn tokens: quick decision, precise question, small file read, broad search, and reading a big file.
- `#L88-L141` — The "every message stays in the window" panel tracking exchanges, tokens, and window fill.
- `#L142-L169` — Broad versus targeted scope, contrasting "refactor the payment module" with the exact calculateTax update.
- `#L170-L175` — The exploration-cost readout as a percentage of the window.
