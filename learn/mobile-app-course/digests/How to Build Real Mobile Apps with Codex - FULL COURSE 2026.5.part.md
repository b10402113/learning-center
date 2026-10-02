---
source: How to Build Real Mobile Apps with Codex - FULL COURSE 2026
source_type: text
source_lines: 9270
part: 5
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to Build Real Mobile Apps with Codex - FULL COURSE 2026 (part 5)

## Overview (L1)

- Legal pages & landing page — Codex reads the whole codebase and generates terms of service, privacy policy, and a landing page under a `legal/` folder; placeholders still need human editing.
- App store mockup images — use shots.so (free) to place simulator screenshots into transparent, shadow-free iPhone frames and export demo images used by the landing page.
- Cloudflare Pages deployment — deploy the `legal/` folder to Cloudflare Pages via Wrangler CLI (~1m20s), producing live privacy-policy, terms, and support URLs for App Store Connect.
- Error tracking & monitoring — real apps always hit edge cases in the wild; users silently delete and leave 1-star reviews, so the app must auto-report errors with user/device context.
- Sentry integration — free-tier monitoring as the "watch tower": catches errors, structured searchable logs, session replay, performance traces, and real-time alerts (email/Slack/Discord/Teams).
- Sentry Logs — cloud-persisted, searchable, tagged logs that beat `console.log`; levels debug/info/warning/error/fatal.
- Sentry verification & feedback — a generated test page simulates errors/replays, and a user-feedback widget collects name/email/feature requests from inside the app.
- Linking legal pages in-app — wire privacy/terms buttons to the deployed URLs and open them in an in-app sheet instead of Safari; final commit and end of course.

## Sections (L2)

### Automated legal pages & landing page

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: A Codex prompt tells the agent to read the entire codebase and create a terms-of-service page (and later privacy policy) under a `legal/` folder, plus a landing page that matches the existing app theme.
- Key claims: the generated app adopted the existing blue mobile-app theme without a reference because Codex read the codebase; legal pages contain placeholder fields (legal business name, privacy-policy URL) the developer must fill before publishing; the same approach was used in the author's own production app.
- Learner-relevant: a reusable pattern for shipping store-required legal pages fast; anchors "AI generates scaffolding, human fills jurisdiction-specific content."

### App store mockup images via shots.so

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: Use the free shots.so site to select an iPhone 17 mockup with a transparent, no-shadow background, paste simulator screenshots (login, explore, messages), zoom in to remove extra space, and export three demo images.
- Key claims: shots.so is free to start (paid plan unnecessary); transparent background + no shadow makes mockups composable on the landing page; the exported `demo1/2/3` images are then referenced directly in the Codex landing-page prompt.
- Learner-relevant: a <5-minute, no-cost workflow any learner can reuse for every future project's marketing/landing imagery.

### Cloudflare Pages deployment with Wrangler

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: Sign up for Cloudflare (free, GitHub login), tell Codex to deploy the `legal/` folder to Cloudflare Pages using the Wrangler CLI, and verify the live landing page in ~1m20s.
- Key claims: Wrangler publishes from the terminal without touching the browser; the resulting URLs (`/privacy`, `/terms`, `/support`) map to the fields App Store Connect requires; only placeholder content needs manual updating afterward.
- Learner-relevant: closes the loop from generated legal content to live URLs required for app-store submission.

### Error tracking & monitoring (the problem)

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: Frames why monitoring matters: an app that works locally can still fail for real users, and 99% of users won't email — they delete the app and post a 1-star review without detail.
- Key claims: edge cases are inevitable in real applications; without telemetry the developer is blind to production failures; the goal is an automatic email showing the error, the user, and how to fix it.
- Learner-relevant: motivation for observability as a first-class production concern, not an afterthought.

### Sentry setup (project, wizard, DSN)

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: Create a free Sentry project (React Native platform), let it auto-detect the repo, then copy the Sentry Wizard instructions into Codex to install and configure the SDK; the wizard provides the DSN connection string.
- Key claims: Sentry is free to start (plus extra credits via a referral link); each new project gets a different DSN; because Sentry is a native module, the app must be rebuilt (`npx expo run:ios`) after install; alerts default to email with optional Slack/Discord/Teams.
- Learner-relevant: end-to-end integration recipe for crash/error reporting in a React Native/Expo app.

### Sentry Logs vs console.log

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: A comparison shows `console.log` lives only on the user's device and vanishes on close, while Sentry Logs are sent to and persisted on the cloud, searchable via tags, and linked to traces/errors/replays.
- Key claims: log levels span debug, info, warning, error, and fatal (e.g. a failed database connection is fatal); setup was a one-line change applied in under a minute; logs become far more valuable with hundreds/thousands of users.
- Learner-relevant: practical observability upgrade path — structured, queryable logging instead of transient local logs.

### Sentry test page & error/replay verification

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: Codex generates a "Sentry test" screen under settings with buttons that throw simulated real-world errors; pressing them produces issues visible in the Sentry dashboard and real-time alert emails.
- Key claims: errors appear in the Issues feed within seconds with full user/OS/device details; `captureException` catches thrown errors; the exercise lets the learner explore how production issues surface.
- Learner-relevant: a safe sandbox for understanding how failures are captured and triaged before shipping.

### Sentry tracing (challenge)

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: Tracing is introduced as the performance-focused Sentry feature (traces, bottlenecks) set up the same way — copy the docs page and paste into the AI agent — but left as a learner challenge.
- Key claims: tracing targets performance rather than errors; the same "copy docs page → ask the agent" workflow applies; the author enabled it in his real app.
- Learner-relevant: optional extension connecting monitoring to performance/observability.

### Sentry user feedback widget

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: Add Sentry's React Native feedback component so users can submit name, email, and feature requests; submissions land under Issues → User Feedback in the dashboard.
- Key claims: the feedback button was added to the settings screen in ~2 minutes; feedback is searchable in the dashboard; complements error reports with direct user voice.
- Learner-relevant: a lightweight in-app feedback loop that pairs with error monitoring.

### Linking legal pages in-app & course wrap-up

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: Wire the privacy-policy and terms buttons to the deployed URLs, then improve them to open in an in-app sheet (from the bottom) rather than Safari; commit/stage changes and close the section.
- Key claims: opening URLs inside the app is a simple follow-up prompt; the app itself is now effectively complete; remaining work is iterating on UI design with AI agents and generating more design references.
- Learner-relevant: capstone checklist — legal links, commits, and the "keep iterating with the agent until you like it" mindset that closes the course.
