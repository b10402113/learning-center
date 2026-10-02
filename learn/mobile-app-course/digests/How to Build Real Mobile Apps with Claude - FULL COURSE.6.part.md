---
source: How to Build Real Mobile Apps with Claude - FULL COURSE
source_type: text
source_lines: 11194
part: 6
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to Build Real Mobile Apps with Claude - FULL COURSE (part 6)

## Overview (L1)

- Profile screen completion & account deletion — Adds personal details, preferences, language, and upgrade buttons for UI purposes; wires the delete-account button to a confirmation dialog and an API endpoint that removes the user from Clerk, the database, and the ImageKit meals folder; adds bottom padding so text clears the tab bar, trims welcome-screen text, and commits.
- Feature optimizations: image downscaling & scrollable calendar — Downscales the scanned meal photo before sending it to the vision model via ImageKit transforms to save credits, makes the home calendar scrollable back up to two weeks, and removes an unused button.
- Sentry test bench, error triage & user feedback — Creates a test screen whose buttons throw simulated real-world errors, confirms Sentry captures them in the dashboard, connects the repo so Sentry can analyze the codebase and propose a fix plan, and adds a Sentry feedback widget under the profile screen with spam filtering and linked errors.
- Legal pages: privacy policy, terms of service & landing page — Builds a `legal` folder (index/privacy/terms HTML plus `style.css`), uses shots.so to produce device mockup screenshots, generates production-ready terms of service and privacy policy with placeholders for legal name/address, and deploys the landing page free with Cloudflare Pages via Wrangler.
- Course wrap-up & test-data seed script — Recaps the full workflow as reusable for any app, adds a script file to seed test data without scanning food, commits, and closes the course with the source code offered for free.

## Sections (L2)

### Profile screen completion and account deletion

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Finishes the profile screen with personal details, preferences, language, and an upgrade-to-family-plan button (non-functional, UI only); makes the delete-account button ask for confirmation and call an API endpoint that deletes the user from both Clerk and the database; then follows up so all related data — the user's meals and their ImageKit images — is removed too, and verifies manually (cancel does nothing, delete logs out and clears DB, Clerk, and ImageKit). Adds bottom padding so the last text does not overlap the tab bar and removes redundant welcome-screen text.
- Key claims: Account deletion must cascade beyond the auth user to database rows and uploaded media or it wastes storage; the delete flow is verified by checking Clerk, the database, and the ImageKit meals folder after signing up again; deleting an account should force re-onboarding on the next sign-up.
- Learner-relevant: A concrete account-deletion/cascade pattern and the simulator-based verification habit that closes a feature section.

### Feature optimizations: image downscaling and scrollable calendar

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Adds two optimizations: downscale the scanned meal photo before sending it to the vision model (pasting ImageKit documentation as reference and using its transform arguments under `analyze meal` to reduce credits), and make the home calendar scrollable back about one to two weeks (it should not go into the future). Removes an unnecessary "scan a meal" button. Two parallel Claude instances implement both features at once; a week-map warning is resolved, both are verified in the simulator.
- Key claims: Vision-model calls are billed by image size, so downscaling first saves credits; ImageKit can downscale in real time via transform arguments rather than custom code; parallel agent instances can implement independent features concurrently.
- Learner-relevant: Teaches cost optimization for AI features and the pattern of feeding vendor docs to the agent.

### Sentry test bench, error triage, and user feedback widget

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Creates a test screen with buttons that deliberately throw errors simulating real-world failures; Sentry catches them and they appear in the dashboard Issues/Feed. Explains connecting the repository so Sentry can analyze the codebase, explain the root cause, and produce a step-by-step plan (showing only what real users would see). Adds a Sentry feedback widget to the profile screen (not nested under the test bench), notes test feedback is auto-classified as spam while real reports land in the inbox, and that each report shows who sent it, why, and the linked error.
- Key claims: A test bench that throws intentional errors validates the Sentry pipeline before real users hit it; connecting the repo lets Sentry turn a stack trace into a diagnosis and plan; Sentry feedback is user intelligence that links back to the underlying error and is spam-filtered.
- Learner-relevant: Shows the error-observability and user-feedback loop that makes production issues actionable.

### Legal pages: privacy policy, terms of service, and landing page

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Creates a `legal` folder with an `index` landing page, `privacy.html`, `terms of service` HTML, shared `style.css`, and copied logo/mockup assets. Uses deployed-URL links to replace the example.com placeholders, noting Apple rejects apps without privacy policy and terms of service links. Pastes dedicated prompts for each document (analyze the codebase, generate production-ready content) plus follow-ups requiring the app's theme, navbar, and footer. Builds demo mockup screenshots with shots.so (free plan, iPhone 17 frame, transparent background, zoomed in, shadow set to none) as an alternative to placeholder art, using Cali as a design reference and the "Go Full Page" extension for full-page captures. Updates placeholder legal name/address values and deploys free on Cloudflare Pages using the Wrangler CLI; fixes footer link text contrast to white.
- Key claims: Apple requires privacy policy and terms of service links or the app is rejected; AI does not know your legal name or registered address, so it emits placeholders you must replace; the whole legal site can be deployed from a single prompt via Wrangler at no cost; clean mockup screenshots are made by screenshotting the simulator and composing in shots.so.
- Learner-relevant: A complete, free path from prompting to deployed legal pages and promotional screenshots.

### Course wrap-up and test-data seed script

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Closes the course by summarizing that the same workflow (plan → UI design → feature breakdown → build → self-check) can build any app. Notes a script file was added so test data can be seeded into the database without scanning real food, warns not to be confused by it in the source code, then stages, commits, and syncs all changes and offers the source code for free via the description.
- Key claims: The demonstrated workflow generalizes to any app idea; a seed script is a useful development convenience for populating test data.
- Learner-relevant: The reusable end-to-end development loop and a final commit/ship habit.

## Sources

- `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]` — lines 9501–11194, timestamps ~02:44:51–03:11:53.
