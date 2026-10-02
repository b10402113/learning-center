---
source: How to build mobile apps for local businesses with Claude Code - FULL COURSE
source_type: text
source_lines: 17078
part: 6
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to build mobile apps for local businesses with Claude Code - FULL COURSE (part 6)

## Overview (L1)

- Clerk webhook setup and user-sync test — configuring a Clerk webhook endpoint with a signing secret, wiring it into the `.env`, restarting the web server, and verifying the `user.created` event creates a matching row in the local users table.
- Staff role and dashboard access — adding `role = staff` to a user's public metadata in Clerk so the protected `/dashboard` route resolves and displays real patient data.
- Generated backend tour — a walkthrough of the files Claude produced: the `proxy` (formerly middleware) file for route protection, `lib/ai` with a cheap-model system prompt for the dental assistant, and the `app/api` route group (AI chat, appointments, availability, dentists, current user, patients, services, webhooks).
- Web UI redesign and cross-platform parity — using a design folder plus the Higfield MCP (or GPT/Gemini) to generate a dashboard matching the mobile design system, then adding dentist profile images so both UIs show the same data.
- Readiness assessment and slot validation — asking Claude whether the existing codebase is enough to replace hard-coded mobile data with live data, and fixing the one missing piece: time-slot validation.
- Pull request and CodeRabbit review with security fixes — branching, committing ~15,000 changed lines, running CodeRabbit's AI review and security scan (injection, auth bypass, XSS, SSRF, CSRF, broken auth, misconfiguration), applying the suggested fixes, and merging.
- Expo EAS, TestFlight, and developer-program basics — the workflow after writing code: Apple's $99/year (or lower by country) developer program, Expo Application Services cloud builds, TestFlight as a testing sandbox, and free/starter/production plan trade-offs.
- Cloud dev build to a physical iPhone — generating `eas.json`, registering the device, running the iOS build command, scanning the QR code, running the Metro dev server with the tunnel flag, and manually entering the tunnel URL to launch the app on a real phone.

## Sections (L2)

### Clerk webhook setup and user-sync test

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Configuring a Clerk webhook in the dashboard (leave URL, add description, select events), copying the generated signing secret into the `.env` webhook-signing-secret field, restarting the `npm run web` terminal, then testing by signing in with Google and confirming the user appears in both the Clerk users table and the local database (with logs showing the `user.created` event received and handled).
- Key claims: Webhook secret goes into `.env` as the signing secret; restart the web server after editing `.env`; successful sync is verifiable in the users table and terminal event logs.
- Learner-relevant: Anchors auth integration debugging — a learner can set up event-driven user sync and verify it end to end.

### Staff role and dashboard access

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Visiting `/dashboard` shows a "role required" gate; in the Clerk dashboard, editing the user's public metadata to `role = staff` (colon, not equals) grants access, after which the staff dashboard lists patients and clicking a patient name opens a detail screen.
- Key claims: Route access is role-based via Clerk public metadata; the correct syntax is `role: staff`; the current dashboard UI is functional but visually plain and slated for redesign.
- Learner-relevant: Supports implementing role-gated admin areas and metadata-driven authorization.

### Generated backend tour (proxy, lib/ai, API routes)

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Claude walks through what it generated: the `proxy` file (renamed from middleware in newer Next.js) that protects routes, the `lib` folder containing `ai` with the cheapest model plus a system prompt describing the assistant as a dental assistant for a single local practice, and the `app/api` folder holding the entire backend — AI chat POST handler, appointments, availability, dentists, current user/auth, patients, services, and webhooks.
- Key claims: Proxy/middleware is the route-protection layer and is rarely hand-edited; the `lib/ai` system prompt drives assistant output; all backend endpoints live under `app/api`.
- Learner-relevant: Gives a mental map of a Claude-generated full-stack app so a learner can request changes at the right layer.

### Web UI redesign and cross-platform parity

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Prompting Claude to read the mobile design folder and the plan file, generate a web design image in the same design system (colors, typography, style) via Higfield MCP (or GPT/Gemini), save it under the web folder, and build the same UI — followed by fixes for a floating sidebar, non-working buttons, and missing dentist profile pictures that existed on mobile but not web.
- Key claims: Design images can be produced by an MCP or a generic image model; iterating with follow-up prompts (sticky sidebar, working buttons, profile images) converges the UI; ensure both UIs expose the same data.
- Learner-relevant: Demonstrates a repeatable design-to-code workflow and cross-platform feature parity checks.

### Readiness assessment and slot validation

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Asking Claude to inspect the whole codebase for readiness to replace hard-coded mobile values with real data reveals the only gap is time-slot validation, which Claude fixes; other outstanding items (messages via Stream, notifications, simple pages) are deferred; Claude also recommends Sentry, to be set up later.
- Key claims: Slot validation was the sole blocker to wiring real data; Stream handles messaging and Sentry is recommended for monitoring; most screens are ready.
- Learner-relevant: Models a "readiness audit" prompt pattern that surfaces gaps before building on top of generated code.

### Pull request and CodeRabbit review with security fixes

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Creating a `web-and-api` branch, committing ~11k additions and ~4k deletions (~15k lines changed), opening a PR, and letting CodeRabbit review it: a walkthrough plus a categorized "change stack" with major security findings (injection, authorization bypass, XSS, SSRF, CSRF, broken auth, security misconfiguration). Fix prompts are copied from CodeRabbit, run in parallel Claude sessions, committed to the same branch, and the PR is merged.
- Key claims: ~54 files / ~15k lines is not human-reviewable in 10 minutes; run an AI review on real projects; CodeRabbit security combines review and security scanning and supplies ready-to-paste fix prompts; parallel sessions avoid serial waiting.
- Learner-relevant: Establishes an AI-assisted code-review and security-hardening habit for AI-generated codebases.

### Expo EAS, TestFlight, and developer-program basics

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The post-coding mobile workflow: apply for Apple's developer program ($99/yr, less in lower-purchasing-power countries) to ship to the App Store; Expo makes one codebase run on Android and iOS; EAS (Expo Application Services) handles cloud builds, distribution, and submissions; TestFlight is a sandbox for inviting testers; plan tiers run free (15 builds, low-priority queue) → starter → production for thousands of monthly active users.
- Key claims: Developer program membership is mandatory and not optional for App Store publishing; EAS builds happen entirely in the cloud; TestFlight lets tests install on real phones; over-the-air updates are mentioned as a later topic.
- Learner-relevant: Provides the conceptual map from local code to distributable/testable app so a learner knows the terms and costs before building.

### Cloud dev build to a physical iPhone

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Asking Claude for concise iPhone-only EAS steps: `cd` into `apps/mobile`, generate `eas.json`, register the device (skipped since already done), run the iOS build command with Android as the only variable difference, and note the public API URL should later be replaced with the LAN address. The cloud build finishes with a QR code; scanning it installs the dev build; then `npx expo start --tunnel` yields a URL pasted manually into the dev client to launch the app, where Google sign-in works and screens run as expected.
- Key claims: `eas.json` is required for EAS cloud builds; scanning the build QR installs the dev build on the phone; the Metro tunnel URL must be entered manually if the app isn't auto-detected; LAN API URL replacement is deferred while data is still hard-coded; the same steps apply to Android with one variable changed.
- Learner-relevant: A concrete, repeatable procedure to get an app onto a real device for testing before wiring live data.
