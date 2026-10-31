---
source: sources/real-agent/20261030/Planning/023 Prototype Ticket Solution.en.srt
source_type: text
source_lines: 1059
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- The prototype ticket builds a throwaway route in the real app on a Knock-spike branch to test four vendor checks.
- Wayfinder makes this token efficient: decisions and research already live on the map, so fresh sessions pull only what they need.
- The wizard skill is reused to configure the vendor dashboard, and when the wizard gets unclear the human reports back with full screen context.
- Prototype code is allowed to take shortcuts: caught-and-ignored errors are fine here but would fail real code review.
- QA is the work: click through user-switching scenarios, report each bug, and iterate until the behavior is right.
- Closing the ticket records the main finding plus gotchas for the implementing agent, making the prototype an agile spike.

# L2 detail

- `#L1-L42` — Prototyping begins; the prototype skill builds a throwaway route in the real app to test all four checks, consults Knock docs, and installs the Node SDK.
- `#L43-L94` — Why Wayfinder suits prototyping: decisions return to the map, so new sessions pull in what they need and stay token efficient.
- `#L95-L134` — Spike runs on the Knock-spike branch at localhost; check one (signed user tokens) passes, checks two through four need manual vendor setup.
- `#L135-L234` — Ask for a wizard; model-invoked skill fires; create a discussion-reply workflow, a category, and the app-feed channel step.
- `#L235-L294` — Set the markdown template and commit to development; the wizard validates each stage; create the new-enrollment workflow too.
- `#L295-L430` — Preferences confusion: the Knock UI is unclear, the author gets lost, then pastes the full screen to the agent; tension between computer-use bots and keeping control of paid resources.
- `#L431-L578` — Defaults puzzle resolved: Cadence sets enrollment off/on when syncing users, so the vendor's default step can be skipped; the friction itself is valid product-fit evidence.
- `#L579-L630` — Prototype shortcuts explained: catch-null and ignored errors are acceptable in a spike and are what code review normally catches.
- `#L631-L702` — The does-it-behave prototype: user switcher, trigger buttons, and a checklist of specific scenarios to run.
- `#L703-L930` — QA loop: reply to the wrong user, report the missing buttons, follow the corrected sequence, then catch the mark-all-seen bug and the seen-vs-read distinction; enrollment opt-in verified; UI messiness is deliberate.
- `#L931-L1010` — Close the ticket at roughly 107k tokens; the resolution records the off-by-default finding and lists gotchas for later tickets.
- `#L1011-L1059` — The prototype is a traditional agile spike: hard yards now make the real implementation easy.
