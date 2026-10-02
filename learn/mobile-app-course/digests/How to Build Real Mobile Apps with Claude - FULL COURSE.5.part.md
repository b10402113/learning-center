---
source: How to Build Real Mobile Apps with Claude - FULL COURSE
source_type: text
source_lines: 11194
part: 5
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to Build Real Mobile Apps with Claude - FULL COURSE (part 5)

## Overview (L1)

- Gallery-based meal analysis and Trigger.dev debugging — adding expo-image-picker so users can pick food images from the gallery, and using Trigger.dev runs/logs to inspect a failed `analyze-meal` task and observe automatic retries.
- Image optimization with ImageKit and Context7 — serving resized ImageKit variants instead of the full-size upload, and using Context7 to pull current ImageKit docs into Claude.
- Home screen meals list and UI polish — fetching meals from the database to render on the home screen, image-kit optimized delivery, hiding "not food" entries, and fixing tab-overlap spacing.
- Sentry setup for error monitoring — installing the Sentry SDK into the React Native app, creating the project, rebuilding the dev client, and using session replay plus issue details.
- Sentry logs and tracing — replacing console logs with persistent, queryable Sentry logs at six use sites, then enabling Sentry tracing to capture request timing and performance.
- Profile screen build from a design reference — using a Cali screenshot to guide a redesigned profile screen with account/goals sections, privacy/terms links, log out, and delete-account.

## Sections (L2)

### Debugging the analyze-meal trigger with Trigger.dev

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: The presenter tests the `analyze-meal` task live, hits a "could not connect to server" issue, reruns the app, then inspects the Trigger.dev Runs view to see the `analyze meal` run, its info message ("this photo is not food"), and where that logger output maps to code.
- Key claims: Trigger.dev lets you jump from a run to debug what happened; the logger is essential — without it you cannot see what failed; runs show payload and output matching the UI.
- Learner-relevant: Supports reading a background-job dashboard and tracing a log line back to source; anchors debugging of async task pipelines.

### Gallery access with expo-image-picker

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Adds a gallery-access button on the scan screen so users can select food images instead of only capturing from the camera; installs `expo-image-picker`, grants the matching permission in `app.json`, reloads, picks an image, and gets analysis results (sliced chicken breast, ~750 calories, macros).
- Key claims: The camera need not be the only input path — gallery selection is a valid alternative; any picker package needs its permission declared in `app.json`; results propagate to Trigger.dev output and the UI.
- Learner-relevant: Anchor for device-permission handling and media input patterns; supports adding optional input channels without breaking the existing flow.

### Retry behavior and database verification

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: The presenter deliberately makes the first scan fail to show Trigger.dev automatically retrying attempt one, then reverting to the non-failing version; checks the meals table to confirm one failed row and completed rows with all values stored.
- Key claims: You cannot expect a task to succeed every time; the infrastructure retries without manual intervention; persisted meal rows show the full analyzed values.
- Learner-relevant: Motivates designing for failure and verifying persistence; anchors the difference between task success and stored state.

### Image optimization with ImageKit and Context7

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Explains that camera photos are large but the display does not need full size, so ImageKit should deliver a smaller variant to reduce transferred data; prompts Claude to use ImageKit optimizations and appends "use context 7" so the model pulls current ImageKit docs; installs Context7 machine-wide with a one-line request to Claude.
- Key claims: Resizing for display is better for network access; Context7 fetches up-to-date library documentation and is a tool you should have; a global install request lets Claude set it up.
- Learner-relevant: Anchors media-optimization reasoning and AI-assisted library-doc retrieval; supports reducing bandwidth without degrading visible quality.

### Home screen meals list and UI fixes

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Adds a database query to fetch meals and display them on the home screen, then removes "not food" entries from today's meals and adds bottom padding so native tabs do not overlap the list; asks Claude to stop storing/displaying non-food scans.
- Key claims: A simple fetch-and-render query is enough to surface stored meals; non-food results should be filtered out; tab bars can overlap content without extra bottom spacing.
- Learner-relevant: Anchors list rendering from a datastore and layout safe-area fixes; supports polishing real-world screens beyond the happy path.

### Sentry setup for error monitoring

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Introduces why error monitoring matters (users silently delete the app and leave one-star reviews), walks through creating a React Native project in Sentry, running the Sentry wizard via pasted LLM instructions, rebuilding the dev client for the new native module, configuring the DSN, session replay, and unmasking options, and creating an org auth token for source-map uploads.
- Key claims: Without Sentry you have no idea what broke, for whom, or why; Sentry provides session replays, performance traces, structured logs, and real-time alerts (Slack/Gmail/Teams); installing a native module requires rebuilding the dev client with `npx expo run iOS`; Sentry masks everything by default for privacy and can be unmasked in development.
- Learner-relevant: Core production-readiness lesson; anchors error observability, native-module rebuilds, and secret/token handling.

### Sentry test, session replay, and Seer

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Adds a temporary test button that throws an error to verify Sentry, then inspects the issue in the Sentry dashboard — device, OS, trace ID, the offending code block, and the session replay video of the exact button press — before removing the test button; notes the Seer code-reviewing/autofixing tool that connects to the repository.
- Key claims: A deliberate throw confirms the SDK end-to-end; the issue page exposes device, OS, trace ID, code location, and a replay; Sentry Seer can review error context and propose a fix.
- Learner-relevant: Anchors verifying instrumentation and reading an observability dashboard; introduces AI-assisted error triage.

### Sentry logs versus console logs

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Compares `console.log` (device-local, disappears on close, plain text, no connection to errors) with Sentry logs (persistent, searchable, sent to servers, structured/taggable, linked to traces, errors, and session replay); walks a real-world scenario of filtering failing checkouts by user location and time window; implements Sentry logs at six use sites (onboarding plan generated/completed, profile save failure, meal upload failure, camera outcomes).
- Key claims: Console logs vanish and are unqueryable; Sentry logs are persistent and tag-queryable and link to replays/traces; know what the feature is rather than memorizing the syntax; tags make logs searchable from the dashboard.
- Learner-relevant: Directly supports moving from local print debugging to production-grade structured logging.

### Sentry tracing

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Defines tracing as capturing the timing and flow of requests and operations to find which link in a sequence causes slow performance; copies the React Native tracing docs to Claude, enables the tracing option, and wraps the app with Sentry so metrics like throughput and latency and error impact across systems appear on the dashboard.
- Key claims: Tracing identifies slow links in an event sequence; implementation is enabling an option plus wrapping the app; more app usage yields more dashboard data.
- Learner-relevant: Anchors performance observability and the concept of request traces.

### Profile screen build from a design reference

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Rebuilds the profile screen using an attached design screenshot for inspiration, requiring privacy policy and terms of service links, log out, and a delete-your-account button (mandatory for Apple review when storing user data); iterates with Claude to move the sign-up button to the bottom, drop the goals/tracking section already shown on home, and add placeholder personal-detail fields.
- Key claims: Apps storing user data must offer account deletion or risk Apple rejection; app-store submission requires a hosted privacy policy link (a Vercel/Netlify URL suffices); iterative follow-ups refine an AI-generated UI.
- Learner-relevant: Anchors app-store compliance requirements and design-reference-driven UI iteration; supports shipping a publishable settings/profile screen.

## Sources

- `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
