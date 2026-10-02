---
source: How to Build Real Mobile Apps with Claude - FULL COURSE
source_type: text
source_lines: 11194
part: 2
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to Build Real Mobile Apps with Claude - FULL COURSE (part 2)

## Overview (L1)

- V1 scope decisions — trims the MVP by choosing one auto-retry on AI failure and explicitly skipping payments/paywalls, push notifications, weight/water/exercise tracking, and test suites, so version one is a simple working app.
- Tech stack & development build — locks Drizzle ORM, TanStack Query, and NativeWind (Tailwind for React Native), and decides to use a real Expo development build rather than Expo Go because real apps need native modules.
- Clerk identity → Neon row via webhooks — explains that Clerk owns identity while Neon owns application data, and that Clerk webhooks routed through trigger.dev background jobs create the matching user row.
- Plan file review & AGENTS.md convention — Claude generates `plan.md`; the author explains AGENTS.md/CLAUDE.md as auto-loaded markdown instruction files, and reviews the plan before auto-accepting it with a checklist of to-dos.
- GitHub repo & first push — creates a repository, wires the local repo to the remote, generates a commit message with AI, and pushes the initial code.
- UI design workflow — turns the plan into a UI-generation prompt, renders screen mockups in an AI image tool (GPT), and iterates with reference images and a generated logo/asset set.
- Build-and-verify loop & environment — a named loop where Claude screenshots the running simulator and compares it to the target design until identical; covers running the app and installing `expo-dev-client` to get a standalone development build.
- NativeWind setup — pastes the NativeWind docs into Claude and asks it to follow them exactly, installing packages and wiring config/CSS/babel.
- Welcome screen implementation — implements the welcome screen via the verify loop, attaching the design image, logo, and assets, with manual follow-ups on font weight and line count.
- Onboarding screens — batches the ten onboarding screens into groups of five, removes the "skip for now" buttons, and has Claude self-drive through the flow and implement every page.

## Sections (L2)

### V1 scope decisions

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: While answering the plan questionnaire, the author narrows the MVP: on AI photo-identification failure, retake the photo and auto-retry at least once; skip payments/paywalls, push notifications, weight/water/exercise tracking, and tests for V1.
- Key claims: An all-wall photo has no food so identification correctly fails and the user should retake it; users who photograph real food should get one automatic retry; payments/push/native tracking features are deliberately deferred to keep V1 a working MVP.
- Learner-relevant: Gives a concrete example of scoping a first release and encoding AI-failure UX policy before implementation.

### Tech stack and development build decision

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: The stack is fixed as Drizzle ORM, TanStack Query, and NativeWind (Tailwind for React Native); the author explains why a real app uses an Expo development build instead of Expo Go.
- Key claims: Expo Go is fine for learning/demo projects but not for real apps because real apps need complex features and native modules; a development build is created and referenced throughout the course.
- Learner-relevant: Anchors the framework/tooling choices and the Expo Go vs development-build distinction.

### Clerk identity, Neon data, and webhooks

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Explains the identity/data split — Clerk owns identity, Neon owns application data — and how a Clerk user becomes a row in the users table via Clerk webhooks running background functions on trigger.dev.
- Key claims: Webhooks are the production-grade way to sync Clerk sign-ups into the app database; the background job runs in trigger.dev; meal data should carry name, calories, protein, carbs, and fat.
- Learner-relevant: Introduces the auth-vs-app-data boundary and the webhook/background-job sync pattern used throughout the project.

### Plan file review and AGENTS.md / CLAUDE.md convention

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Covers the auto-generated `plan.md` (reviewed start to finish before auto-accept, then tracked as checkable to-dos) and explains AGENTS.md vs CLAUDE.md — both plain markdown instruction files auto-loaded at the start of every session.
- Key claims: These files act like a README for AI agents and hold project conventions and "always/never" rules; CLAUDE.md is Claude-specific while AGENTS.md is agent-agnostic; the author puts all instructions in AGENTS.md and adds a one-line import from CLAUDE.md; the plan should be read for 10–15 minutes before accepting.
- Learner-relevant: Practical convention for persistent, tool-agnostic project instructions and a disciplined plan-review workflow.

### GitHub repository creation and first push

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Creates a new GitHub repo (github.com/new), stages and commits the code with an AI-generated commit message, then pastes the remote-push command to upload everything.
- Key claims: The repo is initially private but the source code will be public/free at recording time; the provided remote command pushes the existing local repo to the new origin.
- Learner-relevant: Standard initial git/GitHub workflow for starting a course project and keeping source available.

### UI design workflow: plan to prompt to mockups

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: The author feeds `plan.md` to Claude and asks it to produce a UI-generation prompt like the provided calorie-tracker example, then pastes that prompt into an AI image tool (GPT; Gemini also fine) to render screens.
- Key claims: The prompt is derived from the actual plan (screens, features) rather than random; the first result was too colorful, so a reference image (the Gelly screenshot) and light-mode/minimal instructions were used to steer it; screens are requested individually after the overall system design.
- Learner-relevant: Shows how to convert a product plan into visual mockups and how to steer image generation with references and constraints.

### Logo generation and design assets

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: The logo is iterated through multiple image-generation rounds — inspired by a grid of reference logos, then refined to black-and-white/transparent dark and light variants — and the final design and assets are placed in a `design/` folder and `assets/images/`.
- Key claims: Reference-image inspiration must be adjusted when results are too literal (e.g., "get inspired by Apple" yielding only apples); request transparent background for usable assets; store UI design screenshots in `design/` and app images/logos under `assets/images/`.
- Learner-relevant: Demonstrates iterative asset prompting and a clean repo layout for design vs runtime assets.

### Build-and-verify loop and running the app

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Introduces the "build and verify loop": Claude takes a screenshot of the running simulator, compares it to the target UI design, and repeats until the two are as identical as possible; also covers starting the app with `npx expo start` and pressing `I` (iOS) or `A` (Android).
- Key claims: AI cannot be trusted to be 100% identical, but the loop gets very close; the loop is taught to Claude in simple terms as a self-verification instruction; the app runs first in Expo Go before migrating to a development build.
- Learner-relevant: Core reusable technique for implementing UI from a design with AI, plus the basic run/simulator workflow.

### Development build with expo-dev-client

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: To move beyond Expo Go, install the `expo-dev-client` package and rebuild, producing a standalone app (with a native iOS folder) that no longer runs inside Expo Go.
- Key claims: Real-world apps require native modules, which Expo Go cannot support; the first native build is slow but later iterations are faster; the resulting app is named after the project folder by default.
- Learner-relevant: Concrete migration path from Expo Go to a proper development build for production-bound apps.

### NativeWind setup by pasting documentation

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Copies the NativeWind v4 documentation page and asks Claude to follow it step by step, doing nothing extra or less, to install NativeWind and wire it into the project.
- Key claims: In the AI era you can paste docs instead of reading everything; Claude installs packages and updates config/global CSS/babel; the author prefers one task at a time rather than running parallel instances.
- Learner-relevant: A transferable "paste the docs" pattern for reliable library integration, and a note on serial vs parallel agent work.

### Welcome screen implementation

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Implements the welcome screen by attaching the UI design image and logo, asking Claude to run the verify loop, then giving manual feedback (line count, font weight) until it matches the reference.
- Key claims: The first iteration was not identical but the loop corrected three lines down to two; font weight was too heavy (~700) versus the reference (~500); bypass/auto permissions let Claude work uninterrupted; the author considers the end result essentially identical.
- Learner-relevant: A full worked example of implementing one screen from a design and refining typography through iteration.

### Onboarding screens: generation and implementation

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: The ten onboarding screens are generated in batches (upscale the first five, then the next five), edited to remove "skip for now" buttons, saved into `design/`, and handed to Claude with the instruction to implement them via the verify loop while asking the questions defined in `plan.md`.
- Key claims: Ten screens at once is too much information for one Claude pass; mockups are references only — the actual questions must come from `plan.md`; Claude can self-drive through every screen (selecting options, reaching the target screen) without manual clicks, though the pass takes longer.
- Learner-relevant: Shows batching large UI work, separating design reference from product requirements, and leveraging Claude's autonomous screen-by-screen testing.
