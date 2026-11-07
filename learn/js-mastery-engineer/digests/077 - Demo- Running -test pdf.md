---
source: sources/js-mastery-engineer/20261107/supplement/077 - Demo- Running -test pdf.txt
source_type: text
source_lines: 84
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Test type follows the code: logic and helpers get unit tests, API endpoints get integration tests, components are rendered and used the way a person would, and full flows get browser end-to-end tests.
- /test reads your uncommitted changes and picks per file; with nothing uncommitted it asks what to test rather than guessing.
- Setup is a remembered decision: the first run sets up what fits the stack and saves the choice, and if you prefer type checking plus real verification without a suite it records that and stops asking (a legitimate call on a small project).
- Tests are labelled with the acceptance criterion they protect (e.g. `// Covers AC 3`), so a requirement stays traceable from decision → build → proof → test.
- A failing test stays failing: the issue goes into BUGS_FOUND at the top of the report; /test will not edit the app to make its own test pass and will not weaken an assertion if asked.
- "Make the tests pass" is called the most dangerous instruction you can give an agent, because the fastest route to green is to measure less.
- It also covers boundaries, failure cases and security you did not ask about, and always checks anything controlling access to other people's data.
- Run it after /check verify, before a merge, and whenever you touch something with existing coverage; a green suite proves only that the behaviours you tested still hold, not that the feature is right.

# L2 detail

- `#L1-L25` — which code gets which test type (unit, integration, rendered components, browser end-to-end)
- `#L26-L31` — reading uncommitted changes and asking rather than guessing
- `#L32-L35` — setup as a remembered decision, including the no-suite option
- `#L36-L57` — labelling tests with the criterion they protect and the traceability it enables
- `#L58-L64` — a failing test stays failing; BUGS_FOUND and refusing to weaken assertions
- `#L65-L71` — finding trouble you did not ask about: boundaries, failures, security and access control
- `#L72-L77` — when to run it
- `#L78-L84` — the honest limit: coverage is not correctness
