---
source: sources/js-mastery-engineer/20261107/supplement/022 - Exercise- Clear or Compact.txt
source_type: text
source_lines: 160
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The exercise presents an excerpt from a real session building an e-commerce checkout.
- At Turn 4 the developer sets a durable rule: store all prices as integer cents, never floating-point dollars, and the agent creates the schema with price_cents.
- Turns 5 to 19 add cart logic, discounts, tax calculation, an order summary page, and UI adjustments.
- At Turn 20 the developer asks for partial refunds down to the cent.
- The first question asks which detail you would fear losing if you compacted now; the intended detail is the integer-cents rule from Turn 4.
- The second question asks clear or compact, and the reasoning favors clearing then restating the pricing rule before touching refunds.
- The lesson states there is a real cost either way: fifteen turns of work are either trusted to a summary or dropped.
- The decision rule: if the next step depends on an exact detail, clear; if details matter less than momentum, compact.

# L2 detail

- `#L1-L18` — Exercise setup and the transcript excerpt: the Turn 4 integer-cents rule, Turns 5-19 of work, and the Turn 20 refunds request.
- `#L19-L78` — First question and options about which detail would be risky to lose when compacting.
- `#L79-L135` — Second question and options about whether to clear or compact before the refunds work.
- `#L136-L141` — The honest cost: either the fifteen turns are trusted to a summary or dropped, and judgment decides which cost to pay.
- `#L142-L156` — The learning rule: clear when the next step needs an exact detail, compact when momentum matters more.
- `#L157-L160` — Transition to the token-cost lesson.
