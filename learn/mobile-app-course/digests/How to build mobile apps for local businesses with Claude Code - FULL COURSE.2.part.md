---
source: How to build mobile apps for local businesses with Claude Code - FULL COURSE
source_type: text
source_lines: 17078
part: 2
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to build mobile apps for local businesses with Claude Code - FULL COURSE (part 2)

## Overview (L1)

- AI code review with CodeRabbit — Since Claude Code can generate hundreds of thousands of lines in under 10 minutes, automated review becomes essential; CodeRabbit scans every pull request for security issues and priorities, is free to start (14-day trial), and is a core workflow step.
- UI design generation workflow — Copy an appealing mobile-screen reference from Pinterest into ChatGPT/GPT as an inspiration image, have Claude produce a tailored design prompt from the plan, generate the UI image, then generate a matching design system (typography, icons, spacing, components) stored in the project's `design/` folder.
- Third-party service setup — Configure the app's backend stack up front: Stream (chat/video/feeds), Sentry (error tracking/monitoring), Neon (Postgres database + connection string), and ImageKit (image optimization/storage), capturing each service's keys into `.env` files.
- Authentication with Clerk — Add multi-provider auth by toggling options (Google, Apple, email) with no code; a key App Store rule is that offering any third-party auth provider requires also offering Apple Sign-In or the app will be rejected.
- Committing setup changes — Stage, generate a commit message, commit, and sync in the source-control UI; code/logic changes should go on a separate branch with a PR, but config-only changes can be committed directly.
- Screen-by-screen UI build loop — Upscale one screen at a time, implement it, screenshot it from the simulator, compare against the design, and repeat until the screenshot matches the reference closely.
- Running the app: Expo Go vs development build — Expo Go is an isolated sandbox for learning/simple projects and cannot support features like video calling; real projects need an Expo development build.
- NativeWind styling and first run — Install NativeWind (Tailwind CSS for React Native), scaffold the Tailwind/global-CSS config via Claude, and run the app in the iOS/Android simulator using `npm run mobile`.

## Sections (L2)

### AI code review with CodeRabbit

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Explains why AI code review is needed once Claude Code can generate huge volumes of code fast, and walks through signing into CodeRabbit with Git provider access.
- Key claims: Reviewing all generated code for correctness/security is impractical manually; CodeRabbit reviews the entire codebase on every pull request, flags security issues, and prioritizes PRs; it is free to start (14-day trial, no credit card) with a two-click setup; supports GitHub, GitLab, Bitbucket, Azure; repo access is granted from the repositories tab.
- Learner-relevant: Establishes "self-check plus AI review" as an important workflow step before trusting AI-generated code.

### UI design generation and design system

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Demonstrates a repeatable UI-design workflow: find a mobile-app design on Pinterest, attach it to GPT as visual inspiration, have Claude turn the plan into a design prompt, generate the UI image, then generate and save a matching design system.
- Key claims: Workflow used daily: search "<app type> mobile app design" on Pinterest → copy the reference image into GPT → first ask Claude to produce a plan-specific prompt (covering presentation, design style, 3D visual assets, color palette) → paste into the image model → optionally request variations; missing headings/fonts motivate asking for a "design system" (typography, icons, spacing, core components); save the reference image and design system into `mobile/design/` (`UI reference design.png`, design system) to reference from Claude when the generated UI drifts; keep the section simple rather than over-engineering.
- Learner-relevant: A concrete, reusable prompt-chaining technique for producing consistent, on-brand UI from a product plan.

### Backend service setup: Stream, Sentry, Neon, ImageKit

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Sets up four third-party services and wires their credentials into environment files so later lessons can implement chat/video, error monitoring, database, and images.
- Key claims: Stream provides SDKs for chat messaging, feeds, video, and moderation, used by Bumble/Strava/Adobe/Walmart; create an application (dev mode, region choice) and obtain app ID, API key, and secret. Sentry is for error tracking/monitoring — an agent scans the app and notifies on errors, free to start with extra credits via referral; create a project selecting React Native platform and choose notifications. Neon provides the Postgres database (free tier); copy the connection string from the connect panel and place it as `DATABASE_URL` in `apps/web/.env`. ImageKit handles image optimization/storage (free tier); grab the public key, private key, and URL endpoint from developer options, using the Next.js SDK, and fill them into `.env` from `.env.example`. Emphasizes that Claude-generated `.env.example` files should be copied to real `.env` and values substituted (quotes/comments can be removed).
- Learner-relevant: Names the concrete stack and the exact credentials each service needs, giving a checklist for standing up a real backend.

### Authentication with Clerk

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Adds Clerk as the authentication solution for the app, configuring social providers and extracting the publishable key into the mobile `.env`.
- Key claims: Clerk adds authentication options without writing code; create a project and toggle providers (Google, Apple, email); critical App Store rule — if any third-party auth provider is offered, Apple Sign-In must also be offered or Apple rejects the app; offering a provider in Clerk does not force implementing it; as of 2026 setup is delivered as a prompt to paste into the LLM rather than step-by-step docs; copy the publishable key into the env file using the pre-generated variable name.
- Learner-relevant: Combines a practical auth setup with a hard, easily-missed App Store compliance requirement.

### Committing the setup changes

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Commits the config/env changes, distinguishing config-only commits from code changes that warrant a branch and pull request.
- Key claims: For tiny, logic-free files a direct commit is fine; workflow is stage → generate commit message → commit → sync; any change involving code or logic should go on a separate branch with a pull request (covered later); confirming the push on github.com proves the sync.
- Learner-relevant: A lightweight Git hygiene rule: branch/PR only when logic is involved.

### Screen-by-screen UI build loop

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Describes the iterative per-screen implementation loop used to turn each design screen into working UI.
- Key claims: Upscale and build one screen at a time (e.g. authentication first); loop used with Cursor/Claude: screenshot from the simulator → compare to the design → if identical move on, otherwise keep rebuilding and re-screenshotting until it matches; AI will not reach 100% accuracy, but "pretty decent or similar" is acceptable; run the app via the `mobile` script to enable screenshots.
- Learner-relevant: A concrete verification loop that makes AI-generated UI converge on a target design.

### Running the app: Expo Go vs development build

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Explains how to run the app in the simulator and why real projects need an Expo development build instead of Expo Go.
- Key claims: Run with `npm run mobile`, press `I` for iOS simulator or `A` for Android on Windows; Expo Go runs the app in an isolated environment that does not include every feature (e.g. video calling is unsupported); a development build compiles the app in its own environment separate from Expo Go and is recommended for real projects (though Expo is still used underneath); this distinction is confusing for beginners.
- Learner-relevant: Prevents a common beginner pitfall — assuming Expo Go is sufficient for production-feature apps.

### NativeWind styling and running the app

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Installs NativeWind (Tailwind CSS for React Native) by feeding its docs to Claude, then runs the app and demonstrates hot reload.
- Key claims: NativeWind is Tailwind CSS for React Native and, as of 2026, the modern styling convention; paste the NativeWind/Expo setup documentation into Claude and instruct it to follow the steps without extras, installing packages and creating `tailwind.config.js`, `global.css`, etc.; after install, Expo loads the app ("dental app"); editing `app/index.tsx` updates the UI in real time on save; describes installing `expo-dev-client` for a development build.
- Learner-relevant: Establishes the styling foundation and the live-reload development loop used for the rest of the build.
