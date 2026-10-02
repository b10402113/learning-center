---
source: How to Build Real Mobile Apps with Codex - FULL COURSE 2026
source_type: text
source_lines: 9270
part: 1
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to Build Real Mobile Apps with Codex - FULL COURSE 2026 (part 1)

## Overview (L1)

- Course intro & demo walkthrough — The instructor promises a full idea-to-App-Store workflow using Codex, then tours the Codexgram demo: an Instagram-style social app with Google/Apple auth, four liquid-glass tabs (home, messages, explore, profile), stories, posts, likes, comments, bookmarks, realtime DMs, follow/unfollow, search, profile editing, and settings, plus a marketing landing page.
- Publish-readiness requirements — Apple requires a privacy policy, terms of service, and in-app account deletion; missing any of these causes App Store rejection, so the course builds them in from the start (feedback collection and real policy URLs included).
- Community/school plug — An optional paid learning community documents the instructor's own 14-day build-to-publish journey (payments, push notifications, submission), with live student examples; not required for the course.
- Environment setup (VS Code, Node.js, Expo) — Install VS Code and Node.js, create an empty project folder, and scaffold a mobile app with `create-expo-app` (SDK 57 at recording time); run it in an iOS/Android simulator via `expo start`, understanding Expo Go vs a real development build.
- AI assistant setup (Codex vs Claude) — Install the verified IDE extension, pick a model and reasoning effort (medium/high normally, extra-high/ultra for critical work), and grant full permissions; Codex with GPT-6 Astra is chosen for the course.
- Expo boilerplate reset — Run `npm run reset-project` to strip the default Expo demo screens down to a single-text screen, giving a clean base before planning.
- Project planning workflow & planning prompt — Planning (idea, goals, features, pages, user flow, tech stack) is the most-skipped step and must come before coding; a "plan mode" interview prompt makes the AI ask questions instead of guessing; stack chosen is Expo + Clerk (auth) + Convex (backend/database) + native tabs + NativeWind (Tailwind for React Native).
- Planning interview Q&A (V1 scoping) — The AI asks batched questions; answers scope a minimal MVP: iOS-first, working demo, Google/Apple sign-in, single-image uploads, flat comments with own deletion, 10 MB images / 30 s & 50 MB videos, no push or payments, light mode only with a later design reference, and online-first Convex with retries.

## Sections (L2)

### Course intro, demo app & workflow promise

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 1–119)
- Summary: Introduces the course goal — build a real, publishable mobile app from an idea using Codex — and demonstrates the finished Codexgram social app end to end (auth, four tabs, stories, posts, comments, realtime messages, explore, profile, settings, feedback, landing page).
- Key claims: the same workflow published the instructor's own app on the first App Store submission; AI cannot reliably build anything yet, so knowing how to ask and supply context matters more than the coding; all tools are free to start and the full source is provided.
- Learner-relevant: Frames the end goal and the app feature inventory the rest of the course implements; the "idea → plan → UI design → implement" pipeline is the course's organizing spine.

### Publish-readiness requirements

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 62–119)
- Summary: Explains which features Apple mandates for approval — privacy policy, terms of service, and an in-app delete-account option — and shows them linked to real URLs, plus a user feedback collector.
- Key claims: omitting any required policy or delete-account feature gets an app rejected; cover these up front rather than learning "the hard way"; the landing page must also link the policies.
- Learner-relevant: A concrete pre-submission checklist to avoid the most common novice rejection reasons.

### Community/school plug

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 120–141)
- Summary: Optional promotion of the instructor's paid community, which documents the full ~14-day journey from build to submission plus topics left out of the free course (payments/subscriptions, push notifications, marketing).
- Key claims: the instructor's own submission took about 14 days; a student published an app within the community in the same timeframe.
- Learner-relevant: Signals which advanced topics (payments, push notifications, marketing) are out of scope for this free course.

### Environment setup: VS Code, Node.js & folder

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 142–172)
- Summary: From scratch: install VS Code (from code.visualstudio.com) and Node.js (from nodejs.org), create an empty desktop folder (e.g. `CodexGram`), and open it in VS Code. Mac is used but Windows works the same.
- Key claims: any editor works, but use VS Code for an identical environment; Node.js is required.
- Learner-relevant: The reproducible starting state every later step assumes.

### Scaffolding the Expo app

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 173–214)
- Summary: Introduces Expo as the best way to start a mobile app in 2026 (free to start; ~$20/mo for serious App Store publishing), copies the `create-expo-app` command from the docs, appends `.` to scaffold into the current folder, accepts the SDK prompt (57 at recording time), and runs it in a simulator.
- Key claims: Expo handles building and publishing to App Store and Play Store; Windows users can even run an iOS simulator now; the SDK version will increment over time but that's fine.
- Learner-relevant: The canonical bootstrapping command and the Expo workflow anchor for all later implementation.

### Running the app & choosing an AI assistant (Codex vs Claude)

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 215–291)
- Summary: Start the dev server (`npx expo start`), open the simulator with `i`, then install the verified Claude Code or Codex VS Code extension; configure model (Codex GPT-6 Astra), reasoning effort (medium/high by default, extra-high/ultra for critical features at the cost of time), and full permissions so the agent doesn't pause for approvals.
- Key claims: the recommended default is a ~$20/mo plan on Codex, Claude, or Cursor; Codex is the instructor's current pick and is cheaper; full access is fine but be careful; the goal is learning the workflow, not matching the exact end result since AI output varies.
- Learner-relevant: Configures the AI pair-programmer and sets realistic expectations about determinism and effort/latency trade-offs.

### Expo boilerplate reset

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 292–314)
- Summary: Stop the server, run `npm run reset-project` to delete the default components/constants/hooks and move them into an `example` folder, delete that folder too, and reload to get a single simple screen.
- Key claims: a clean base is preferable to letting the AI work around the Expo starter template.
- Learner-relevant: Establishes the blank slate the planning and implementation stages build on.

### Project planning workflow & the planning prompt

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 315–393)
- Summary: The first workflow step is planning, which beginners skip and which "almost always fails" when omitted because the AI then guesses. A reusable interview prompt (given in the description) makes the AI interrogate the learner about idea, goals, features, pages, and user flow; select "plan mode"; and describe the project in detail.
- Key claims: define the tech stack explicitly — Clerk for auth, Convex for backend/database, Expo native tabs for the iOS liquid-glass tab bar, and NativeWind (Tailwind for React Native) for styling; the AI must be given full context so it never guesses; the prompt triggers several batches of clarifying questions.
- Learner-relevant: The single most important anchor of the course — a defensible, context-first planning method before any code exists.

### Planning interview Q&A & scoping V1 (MVP) with the development build

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 396–475)
- Summary: The instructor answers the AI's batched planning questions, deliberately scoping a minimal V1/MVP (working demo, iOS-only, Google/Apple sign-in, single-image posts, flat comments with own-deletion, image ≤10 MB, video ≤30 s/50 MB, no push/payments, light mode with a later design reference, online-first Convex with retries, custom native auth screen instead of Clerk UI), and explains development builds versus Expo Go.
- Key claims: most answers use the recommended option but some should be overridden; start with a simple MVP and add features later (as the instructor did with a calorie-tracking app); Expo Go is for testing/learning while native modules require a standalone development build.
- Learner-relevant: Concrete MVP-scoping decisions and the Expo Go vs development-build distinction that shape the implementation and later publishing steps.
