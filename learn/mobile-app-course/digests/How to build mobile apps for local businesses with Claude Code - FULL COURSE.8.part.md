---
source: How to build mobile apps for local businesses with Claude Code - FULL COURSE
source_type: text
source_lines: 17078
part: 8
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to build mobile apps for local businesses with Claude Code - FULL COURSE (part 8)

## Overview (L1)

- GetStream setup & app initialization — Logging into GetStream via CLI (`stream login`), selecting/creating an app, generating the `stream/` folder and `.gitignore` entries, and installing the Stream agent skills.
- Stream agent skills & skill-vs-MCP — Installing the React Native skill and using the builder/docs skills; explains why agent skills beat guessing and contrasts skills with MCP.
- Building chat + video calling with Stream — Prompting Claude to scan the codebase and plan file, then implement real-time messaging and video calling for patient↔clinic-staff, and iterating on errors.
- Rebuild, EAS build & Stream app config — Rebuilding after native modules, getting a new EAS dev build onto a physical iPhone, committing changes so the build is current, and creating a fresh Stream app (US East) with new env vars.
- Testing real-time chat & video — Live demos of notifications, typing indicators, image/camera attachments, read receipts, threads, reactions, edit/pin/delete, and a working video call with mute/camera toggles.
- Plan-file audit & Sentry test page — Using Claude to scan `plan.md` for remaining features and building a test Sentry page that simulates real-world errors, with session replay and mask removal.
- Sentry logs & tracing — Integrating React Native Sentry logs and tracing for production debugging, and performance insights (what's slow vs fast).
- Sentry agent tracing (AI monitoring) — Setting up Sentry's Next.js SDK for agent tracing to track token usage, latency, tool usage, error rates, and user inputs; wiring the DSN via a new Sentry project.
- AI assistant image attachments with ImageKit — Adding image attachments to the AI assistant screen, storing them in ImageKit, and using its URL-based transformation API to blur images until tapped.

## Sections (L2)

### GetStream setup & app initialization

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Walks through logging in to GetStream from the CLI, choosing or creating an application, and letting the CLI scaffold the Stream integration (creating the `stream/` folder and updating `.gitignore`) so no dashboard visit is needed.
- Key claims: `stream login` authenticates via the dashboard (Google account used); selecting "Dental app tutorial" pulls app details and generates the stream folder; the CLI can install three skills (stream builder, stream documentation, stream docs).
- Learner-relevant: Anchors the initial GetStream provisioning step before any chat/calling code is written.

### Stream agent skills & skill-vs-MCP

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Shows installing the Stream React Native skill, invoking skills via `/stream` in Claude, and explains that skills are markdown files (or folders) that teach AI coding agents how to perform a specific task. A less technical user can just use the core Stream skill and let it figure out and install the right skill automatically.
- Key claims: Stream has skills for Swift, Unity, Unreal, Flutter, React, React Native, and Android; without skills an agent must guess how to work with Stream, but skills provide all required details automatically; the transcript includes a skills-vs-MCP comparison worth pausing on.
- Learner-relevant: Builds the mental model for how agent skills work — reusable across any third-party integration, not just Stream.

### Building chat + video calling with Stream

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The instructor prompts Claude to scan the mobile folder, API routes under the web folder, and the plan file for context, then implement a fully functional video calling feature and messaging under the messages screen, initially scoped to patient↔clinic-staff communication.
- Key claims: The initial version keeps it simple — users can call and message clinic staff; Claude produced the app but threw errors that were fixed by screenshotting and asking Claude to fix them; the plan file drives remaining-feature discovery.
- Learner-relevant: Demonstrates the prompt-scan-implement-fix loop for adding a major real-time feature via agent skills.

### Rebuild, EAS build & Stream app config

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Covers the operational steps after installing a native module: rebuilding the app with `npx expo run:ios`, rerunning the web server after env-var changes, pulling the Stream API key/secret from the dashboard into the web `.env`, and producing a new EAS dev build to install on a real iPhone.
- Key claims: Any installed native module requires an app rebuild; a stale EAS build failed because changes weren't committed — committing to master and rebuilding fixed it; the previous Stream app failed (region-related), so a new app was created with US East and new env vars swapped in.
- Learner-relevant: Anchors the deploy/rebuild workflow and the common pitfall of forgetting to commit before an EAS build.

### Testing real-time chat & video

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Live end-to-end demo of messaging between simulator and phone — send/receive, push notifications, typing indicators, read/seen state, image uploads, camera capture, message threads, reactions, edit, pin, and delete — followed by a working video call with mute and camera on/off toggles.
- Key claims: Real-time behavior (typing indicator appears/disappears instantly, notifications arrive live, "user left" updates) works like WhatsApp; Stream provides all these features built-in so only usage learning is needed; staff accounts hide patient-only features like booking appointments (controlled via Clerk dashboard roles).
- Learner-relevant: Confirms the feature set works and shows how Stream's defaults cover production-grade chat UX.

### Plan-file audit & Sentry test page

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The instructor asks Claude to scan `plan.md` to list remaining features, then builds a test Sentry page that simulates real-world errors on button press. Errors are captured by Sentry even when they don't crash the app, and session replay records a screen video on error.
- Key claims: Asking Claude to scan the plan file is a reliable way to check leftover features; session replay captures what's happening and how users use the app; masking is disabled in development to see actual UI text/icons and should be re-enforced in production.
- Learner-relevant: Anchors how to introspect project scope and set up error observability early.

### Sentry logs & tracing

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Adds Sentry logs and tracing to the already-integrated React Native app by pasting the official docs into Claude and asking for a simple, working step-by-step implementation that logs where it helps in production.
- Key claims: Sentry docs pages can be handed to Claude wholesale rather than manually followed; tracing supports performance insights (what's slow/fast); with AI you mainly need to understand concepts rather than hand-execute setup.
- Learner-relevant: Demonstrates the "paste docs → implement" pattern for observability instrumentation.

### Sentry agent tracing (AI monitoring)

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Implements Sentry agent tracing via the Next.js SDK because the API routes live under the Next.js web project, creating a separate Sentry project and wiring the DSN to monitor AI systems with full-stack context.
- Key claims: Agent tracing tracks token usage, latency, tool usage, error rates, and users' AI inputs to guide app improvements; a new Sentry project (Next.js platform) is created under the same org; DSN from the project settings is pasted into Claude to finish config; the AI agents overview dashboard then shows runs, cost, duration, LLM calls by model, and token counts.
- Learner-relevant: Anchors cost/latency observability for AI features and the multi-project Sentry structure (mobile + web).

### AI assistant image attachments with ImageKit

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Extends the AI assistant screen from text-only to image attachments, storing images in ImageKit and using its URL-based image transformation API to blur images (for sensitive content) until the user taps to reveal.
- Key claims: ImageKit's URL-based transformation API can apply effects like blur by appending parameters (e.g. blur 80 or blur 10) without pre-processing; the blur is used so sensitive info isn't shown by default; the first implementation attempt failed, so a screenshot and a "test in the simulator and make sure it works" prompt were used to fix it.
- Learner-relevant: Anchors on-the-fly media transformation and shows the screenshot-driven debugging loop for new integrations.
