---
source: How to Build Real Mobile Apps with Codex - FULL COURSE 2026
source_type: text
source_lines: 9270
part: 2
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to Build Real Mobile Apps with Codex - FULL COURSE 2026 (part 2)

## Overview (L1)

- Finishing the planning interview & generating plan.md — The instructor answers the remaining AI planning questions (empty-state behavior, unread indicators, Clerk public-key auth), has the agent ask questions rather than guess, and gets it to write the full implementation plan into `plan.md`; plan mode must be deactivated before a file can be created.
- Committing and publishing to GitHub — Create a free GitHub repo, copy the generated remote-push command, stage/commit with an AI-generated message, and push local changes to GitHub; this becomes the version-control rhythm reused after each lesson.
- Generating UI designs with AI image models — Use a saved prompt plus the plan to have GPT/Gemini produce a full app UI image, then upscale the design system and each screen as separate images; iterate with follow-up prompts (icon/logo changes, variations) because first-shot AI output is rarely good, and export the auth screen's demo image with a transparent background.
- The build loop, Expo app setup & Clerk configuration — The core workflow is a screenshot-and-compare loop: build a screen, take a simulator screenshot, compare to the design, and repeat until identical; run the app in the simulator, create a Clerk app (Google + Apple sign-in, no email), and store the publishable key in `.env`.
- Implementing Clerk authentication & creating the development build — Paste the Expo SDK setup, prompt Codex to implement auth, install `expo-dev-client`, and run `expo run ios` to produce a native development build; test Google sign-in and use the Ctrl+D developer tools.
- Building the home screen with fake data & native tabs — Apply the same loop to the home screen using a design reference image, seed hard-coded test data (no database yet), fix overflow and image issues one at a time, and convert custom tabs to Expo native tabs for the iOS liquid-glass effect.

## Sections (L2)

### Finalizing the planning interview & writing plan.md

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 1901–2108)
- Summary: The last planning answers are filled in — new-user empty state (seeded demo content for the tutorial), bare chat list without unread indicators, and Clerk auth via a public key/environment variable — after which the instructor asks the agent to create a `plan.md` containing the whole plan so it can be implemented step by step.
- Key claims: plan mode must be turned off before the agent can create `plan.md`; the agent generates the entire plan in about two minutes depending on the context given; the planning phase should take a lot of time and conversation before any coding.
- Learner-relevant: Shows the concrete end of the planning workflow and produces the `plan.md` artifact that seeds later UI-design and feature implementation; anchors the "plan first, don't jump to code" lesson.

### Committing and publishing to GitHub

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 2109–2264)
- Summary: Walkthrough of creating a GitHub account and private repository, then committing local changes in VS Code (stage all, AI-generated commit message) and pasting the repo's push command into the terminal to publish everything to GitHub.
- Key claims: you can ask AI to do the git work, but the instructor does it manually the first time; GitHub is free to start; pushing makes local changes visible remotely, and the lesson ends by reiterating that planning is one of the most important build steps.
- Learner-relevant: Establishes the recurring commit-and-push ritual used after every lesson and anchors version control as part of the build workflow.

### Generating UI designs with AI image models

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 2265–2884)
- Summary: A reusable design prompt (shared in the description, demonstrated on trip-planner, recipe, dating, and dental apps) is adapted to the learner's plan, pasted into GPT/Gemini to produce a full app UI image, then followed by requests to change the logo/icon, upscale the design system, and upscale each screen as a separate image; the auth demo image is regenerated with a transparent background via a screenshot reference.
- Key claims: first-shot AI output is rarely what you want — follow up with references and multiple iterations rather than giving up; the exported design system and per-screen images are references the AI agent can read for colors, fonts, and components; at some point you won't need every screen designed because the agent can infer the rest from existing references.
- Learner-relevant: Teaches an iterative prompt-refinement method and produces the `design/` reference assets (design system, screen references, demo image) that the build loop consumes.

### The screenshot-and-compare build loop, Expo setup & Clerk configuration

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 2885–3209)
- Summary: Introduces the instructor's core loop — ask the agent to build a screen, take a screenshot from the simulator, compare it to the design, and keep iterating until identical — then builds the authentication screen, runs the app in the simulator (`npx expo start`, press `i`), creates a Clerk application (disable email, enable Google and Apple), and pastes the publishable key into `.env`.
- Key claims: the loop stops only when the screenshot matches the design; Apple requires Apple sign-in whenever any other social login is offered or the app is rejected; Clerk is free to start with no credit card; the Expo SDK setup prompt can be handed to the agent rather than configured manually.
- Learner-relevant: The central reusable technique of the whole course and the starting concrete feature (authentication) that later screens copy.

### Implementing Clerk authentication & the development build

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 3210–3477)
- Summary: The agent implements Clerk authentication and self-tests in the simulator; to move beyond Expo Go the instructor installs `expo-dev-client` and runs `npx expo run ios`, producing native `ios`/`android` folders and a real development build, then tests Google sign-in and explores the Ctrl+D developer menu.
- Key claims: the development build is a full standalone app and is the way to run apps with native modules, replacing Expo Go; Codex even tested sign-in in the background, leaving a user account; the developer tools button (fast refresh, reload, go home) is dev-only and won't appear in a published app; since Google works, Apple works too.
- Learner-relevant: Defines the development-build workflow every subsequent feature relies on and proves the auth feature end to end.

### Building the home screen with fake data & native tabs

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 3478–3800)
- Summary: Off-camera the instructor upscales the home, profile, chat, explore, edit-profile, and comment screens into reference images, then runs the same build loop on the home screen using a hard-coded test dataset (no database yet); remaining issues are fixed one at a time — overflow, the image's black background — and the tabs are converted to Expo native tabs for the iOS liquid-glass look.
- Key claims: reference a design image in the prompt by adding the file name; fix one issue per prompt rather than bundling several; screenshots are the feedback mechanism; native tabs are an Expo feature that yields the liquid-glass effect, and you can paste the docs page (as markdown) for the agent to follow.
- Learner-relevant: Demonstrates the loop on a data-driven screen and the native-tabs technique that shapes the app's navigation; anchors fake-data-first development before the backend exists.
