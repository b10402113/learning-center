---
source: sources/js-mastery-engineer/20261107/course/039 - Walkthrough Prove it Runs.en.txt
source_type: text
source_lines: 87
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Opens the verification module by showing the demo app after the instructor ran the architect/develop loop four more times (data model, design system, live preview, comment pinning).
- Walks the working app: sign up, confirm email, log in, create a project with a URL, and get a share link for a client.
- Demonstrates a real constraint: many sites refuse framing via `X-Frame-Options` / `CSP frame-ancestors`, so the live-preview iframe fails.
- Explains two workarounds: server-side screenshots via a headless browser, or a client-installed embed script (like Markup.io or UserSnap) running same-origin.
- Shows using `localhost:3000` as a test URL after removing the absolute-URL constraint, then pinning a comment and seeing it appear on the dashboard.
- Sets up the next skills (check, test) by confirming the learner should have a few features built, possibly uncommitted files, and a stale AGENTS.md.

# L2 detail

- `#L1-L19` — Recap of the loop run four more times and a tour of the app running on localhost.
- `#L20-L41` — Dashboard sign-in flow, project creation, and the iframe refusal constraint with its two realistic workarounds.
- `#L42-L63` — Tests the iframe with localhost by removing the absolute-URL constraint and confirms the full share-link flow.
- `#L64-L87` — Pins a comment, sees it on the dashboard, restates the course goal, and prepares for check and test.
