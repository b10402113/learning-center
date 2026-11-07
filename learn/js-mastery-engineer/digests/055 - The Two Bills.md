---
source: sources/js-mastery-engineer/20261107/supplement/055 - The Two Bills.txt
source_type: text
source_lines: 353
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Two bills came out of the experiment: the running cost everyone forgets, and the build cost people expect to be hidden.
- In the vibe build, opening the feed costs about 35 cents in AI spend every time (the model call sits in the request path with nothing cached), and a vibe search costs about 30 cents more.
- The workflow build opens the feed effectively for free as a cached table read, and a vibe search costs about 1.5 cents because the model only picks from what a database query already found.
- One vibe feed open took 40.0 s and cost $0.35 charged again every open, while the workflow build served the same rows 222 times for nothing in the same window.
- That works out to about $5 per user per month in the vibe build versus under a dime in the workflow build, roughly 60 times apart; at 1M users the vibe build spends about $5M/month (3.2x revenue) against about $70K (roughly 4%), a 71x gap.
- The core point: the vibe build is architecturally unfundable, because its costs scale with page views and its revenue never can; at $1.50/month you lose $3.50 per user since serving one costs $5.00, and break-even sits above Letterboxd's $1.58 Pro and $4.08 Patron prices.
- Bill two: the workflow build used meaningfully more tokens for real scoping, specs and verification, but most of the extra tokens were waste — uncleared context re-reading stale history at premium prices and premium models doing grunt work.
- Both apps were built in one day on a single Claude Max subscription, the only real cost being hitting the five-hour limit a couple of times; the installed workflow later fixes this with session hygiene, model routing and subagents drafting long documents.

# L2 detail

- `#L1-L5` — the two bills introduced: running cost vs build cost
- `#L6-L24` — bill one, per-action costs in the vibe vs workflow builds
- `#L25-L68` — one feed open: 40.0 s and $0.35 vs 222 free cached serves, and the monthly per-user gap
- `#L69-L102` — scaling the running cost from 100 to 1,000,000 users
- `#L103-L170` — revenue vs cost at 1M users and the 71x gap between builds
- `#L171-L177` — why the vibe build is architecturally unfundable
- `#L178-L226` — the token-waste diagram and the decision made by a code generator optimizing for a demo
- `#L227-L290` — the decision made by a person, and break-even sitting above Letterboxd's prices
- `#L291-L316` — bill two: the workflow build's higher token use and where it actually went
- `#L317-L343` — what changed after the receipt: session hygiene, model routing, subagents, and the ADR-to-spec rename
- `#L344-L353` — the takeaway: cheap to run, and the workflow polices its own build cost
