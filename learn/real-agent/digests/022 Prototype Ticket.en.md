---
source: sources/real-agent/20261030/Planning/022 Prototype Ticket.en.srt
source_type: text
source_lines: 139
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- A prototype ticket raises fidelity to answer whether a chosen vendor actually holds up against the app.
- Feedback at high fidelity is much better, so expect token-expensive iteration and deliberate vibe coding.
- The ticket closes only when the decisions are integrated into the prototype, not when it merely runs.
- Start from a cleared context and invoke Wayfinder with the ticket number.
- Prototypes are stored like research: artifacts in a throwaway branch outside the main checkout, so agents can reference them without mistaking them for production code.

# L2 detail

- `#L1-L38` — Prototype ticket setup: keys are provisioned, and the point is to see the thing at higher fidelity so the feedback is high quality.
- `#L39-L68` — Definition of done and working style: iterate until decisions show up in the code, accept heavy token churn, then clear context and run Wayfinder on the ticket.
- `#L69-L139` — Storage model: like research, the prototype lives in a random branch outside the main checkout so the agent can read it while treating it as non-production.
