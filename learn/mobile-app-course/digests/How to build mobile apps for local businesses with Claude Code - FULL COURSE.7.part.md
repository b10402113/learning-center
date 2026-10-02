---
source: How to build mobile apps for local businesses with Claude Code - FULL COURSE
source_type: text
source_lines: 17078
part: 7
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to build mobile apps for local businesses with Claude Code - FULL COURSE (part 7)

## Overview (L1)

- Debugging EAS development builds and over-the-air updates — When an EAS build fails, the fix loop is to copy the entire build log into Claude and ask it to repair the configuration, then rebuild; OTA updates let you ship JS/UI changes without resubmitting to the App Store, but not native-module changes.
- Committing without a branch for tiny changes — For only one or two small edits, the instructor stages, commits, and pushes directly on master rather than opening a branch.
- Wiring the mobile app to the real backend/API — A single prompt replaces hard-coded mobile data with data from the web/API backend, then the onboarding flow, home screen, appointments, and AI assistant are tested end to end.
- UI polish and AI assistant streaming — Iterative screenshot-driven UI fixes (image centering, input overflow/placeholder) and making assistant replies stream in word-by-word like ChatGPT instead of showing a loading spinner.
- Profile image from Clerk and chat history persistence — The profile image is pulled from Clerk (Google account) instead of hard-coded, and AI assistant messages are displayed from the database with a trash icon that deletes history after an Alert confirmation.
- Sentry integration: concept and rationale — Sentry is described as the application's watchtower: real-time error capture, structured/searchable logs, session replay, performance traces, and alerts, contrasted with console.log which is device-only, ephemeral, and unlinked to errors.
- Setting up Sentry in the codebase — Add the Sentry SDK, obtain the DSN and an organization auth token, store the DSN in the mobile env, run EAS to add the auth secret, and rebuild because a native module was added.
- Sentry dashboard walkthrough — Reviewing issues, error details, the code block that caused the error, session replay, breadcrumbs, logs, performance traces, and the SEER AI review tool.
- PR review with CodeRabbit and merge — Two commits (mobile integration + review fixes) across ~2,000 lines/500 deletions, CodeRabbit's critical/major/minor categorization, applying its suggested all-review prompt in Claude, and merging to master.
- Introducing Stream video calling and agent skills — Video calling and chat will use Stream, whose markdown agent skills teach the AI agent to build with Stream; setup begins with installing the Stream CLI and setting up the quick start.

## Sections (L2)

### Debugging EAS builds and over-the-air (OTA) updates

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Closing out the Expo dashboard lesson: build failures are usually caused by misconfiguration and typically happen at the "install pods" step; the fix is to copy the whole log into Claude, tell it what happened, and ask it to fix it, then create a new development build. OTA updates are then explained: after an app is live, changing only JavaScript/UI (e.g., "continue with Apple" to "login with Apple") does not require a new App Store submission or a 48-hour review — you ask Claude or EAS to push an over-the-air update. This project will not use OTA because the app is not live, but the concept matters for real shipped apps.
- Key claims: EAS build failures are recoverable by pasting the log into Claude and rebuilding; OTA updates only work for JS/UI changes and break if a new native module is added; OTA updates skip App Store re-review; the instructor uses OTA almost daily on his own live app for UI changes.
- Learner-relevant: Anchors the EAS build troubleshooting loop and the important distinction between OTA-shippable JS/UI changes and native changes that require a full rebuild/resubmission.

### Committing small changes directly to master

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Because there are only two tiny changes, the instructor does not create a new branch. He toggles the status bar, confirms he is on master, stages everything, writes a commit message, and pushes to GitHub's master branch (sync).
- Key claims: Branching is not mandatory for trivial changes; a quick commit-and-push on master is acceptable when the change set is tiny.
- Learner-relevant: Supports judgment about when a branch/PR workflow is worth the overhead versus committing directly.

### Wiring the mobile app to the backend/API

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Off camera the instructor runs one prompt: "we already have our web application and API routes ready, now wire everything up with my mobile application" (currently hard-coded data). It produces 24 changes in ~5–10 minutes. Testing reveals the onboarding flow now gates login (you are authenticated but must complete onboarding), and the home screen shows real "book your next appointment" content instead of hard-coded data. A failure occurs because the web application was not running; starting it with `npm run web` resolves it. Appointments show empty (correct) and a newly booked appointment persists to the database and appears under upcoming appointments.
- Key claims: One well-scoped prompt can wire an entire mobile app to an existing backend (24 file changes); the onboarding form must be completed before the app is usable; the web app and its API routes must be running for the mobile app to fetch data; appointments persist to the backend database across reloads.
- Learner-relevant: Anchors the hard-coded-to-real-data transition and the dependency between running backend services and a working mobile client.

### UI polish and AI assistant streaming

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Using screenshot-plus-prompt sessions, the instructor fixes a home-card image (center it, make it smaller, bolder text, "don't over complicate it") and an AI assistant input overflow (text then placeholder overflowing). He confirms the assistant is limited to dentistry ("I am not able to help with questions outside of dentistry") and that replies come from OpenAI. He then requests streamed replies like ChatGPT instead of a loading spinner, demonstrating streaming live in ChatGPT. Claude explains that the short two-paragraph reply appears at once because there is little to stream, but longer messages stream.
- Key claims: Screenshot-driven prompts are an effective way to fix specific UI glitches; the assistant is scoped to dentistry via its system prompt/setup; AI responses are configured to max two short paragraphs; streaming is most visible on long responses.
- Learner-relevant: Anchors iterative visual UI fixing and the UX difference between blocking spinners and token streaming in an AI chat interface.

### Profile image from Clerk and chat history persistence

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The profile screen image is changed to come from Clerk (the actual Google account image) instead of hard-coded data. For the AI assistant, the instructor asks that messages be saved to the database so history survives reloads and that the three-dot menu be replaced with a trash icon that deletes history after an Alert confirmation (title "are you sure?" plus options). It turns out messages were already being stored in the database but never displayed; Claude fixes the display, and delete-with-confirmation works. Messages persist across reloads.
- Key claims: User avatar data is available from Clerk identity; AI chat messages were already persisted server-side but not surfaced in the UI; React Native's Alert component provides the confirmation dialog for destructive actions; the only remaining features at this point are messages and video calls.
- Learner-relevant: Anchors identity-provider data reuse, chat-history persistence, and destructive-action confirmation patterns.

### Sentry integration: concept and rationale

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Before coding, the instructor explains why Sentry matters: a shipped app will always hit device/network errors users won't report — 99% delete the app and leave a one-star review instead. Sentry acts as the app's watchtower, catching errors in real time and alerting you (Gmail by default; Slack/Discord/Microsoft Teams optional). Its roles: real-time error capture, structured/searchable persistent logs, session replay (screen recordings at error time), performance traces/bottlenecks, and real-time alerts. Sentry logs are contrasted with console.log — the latter lives on the user's device only, disappears when the app closes, is plain text, and has no connection to errors, whereas Sentry logs persist, are structured/queryable, and link to traces, errors, and replays. A 50,000-user e-commerce example (500 checkouts/day) shows querying payment-failed errors by level, message, last 24 hours, and city. Big companies (Cursor, GitHub, Vercel, Convex, Supabase) use it.
- Key claims: Unreported user errors lead to churn and bad reviews, making error monitoring essential; structured logging beats console.log by persisting, being queryable, and linking to errors; Sentry scales from few users to many and is already used before you need it; session replay shows exactly how/when an error occurred.
- Learner-relevant: Anchors production observability, the case for structured logging over console.log, and the "watchtower" mental model for error monitoring.

### Setting up Sentry in the codebase

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: With a Sentry project already created, the instructor copies the dashboard setup instructions into Claude and asks it to install Sentry under the mobile folder, prompting for any dashboard actions. Required secrets: the Sentry DSN (connection string) from Settings → Projects → Client Keys (DSN), pasted into the mobile `.env`; and an Organization Auth Token created under Organization Tokens, used with an EAS command to store the secret (configured for the existing EAS project, secret type string, added to EAS config). Because a new native module was added, the app must be rebuilt via `npx expo run:ios` / `npm run iOS`; after the rebuild the app runs and works as expected.
- Key claims: The DSN connects the app to the Sentry project and goes in the mobile env; an organization auth token is needed for source-map/upload tooling via EAS; adding a native module requires a full rebuild; the Sentry project can pre-exist and be configured for the existing EAS project.
- Learner-relevant: Anchors the concrete steps to wire an observability SDK into a mobile app and the native-module rebuild consequence.

### Sentry dashboard walkthrough

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The instructor shows Sentry's Issues view: each error shows the message and when it happened, and opening one reveals full detail — OS/browser, the code block that caused the error, session replay (the user's screen recording at the moment of error), breadcrumbs, a complete list of logs, and performance traces. He also notes Sentry's built-in AI code-review tool called SEER.
- Key claims: Sentry issues surface error message, timestamp, environment, and the offending code block; session replay and breadcrumbs reconstruct user context; logs and traces are available per issue; SEER is Sentry's integrated AI review tool.
- Learner-relevant: Anchors how to read an observability dashboard and triage a production error.

### PR review with CodeRabbit and merge

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The instructor creates a new branch named mobile integration, stages/commits, publishes, and opens a PR (~2,000 lines added, 500 deletions). CodeRabbit reviews it, categorizing issues as critical, major, and minor; the instructor copies CodeRabbit's suggested all-review prompt into an empty Claude session, applies the ~14 changes, commits again (now two commits), and — optionally waiting for another CodeRabbit pass — merges the PR. He then switches to master and pulls the latest changes.
- Key claims: CodeRabbit can generate a consolidated prompt to fix all review issues at once; review fixes become a second commit on the PR; the PR is merged into master and the local master is synced.
- Learner-relevant: Anchors the AI-assisted code-review-to-fix loop and the branch/PR/merge workflow for a large integration change.

### Introducing Stream video calling and agent skills

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The next feature is video calling (and chat messaging), built with Stream. Stream provides agent skills — a markdown skill pack that teaches AI coding agents how to build with Stream chat, video, feeds, and moderation, giving correct up-to-date context the moment the agent starts writing Stream code. The quick start begins by installing the Stream CLI (already done), which is where the range ends.
- Key claims: Stream agent skills are a markdown pack that informs the AI agent about Stream APIs; video calling and chat messaging will both be built on Stream; setup starts with the CLI quick start.
- Learner-relevant: Anchors the pattern of using vendor-provided agent skill packs to bootstrap third-party integrations, and sets up the video-calling work of the following section.
