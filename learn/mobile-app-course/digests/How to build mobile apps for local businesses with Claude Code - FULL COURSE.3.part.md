---
source: How to build mobile apps for local businesses with Claude Code - FULL COURSE
source_type: text
source_lines: 17078
part: 3
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to build mobile apps for local businesses with Claude Code - FULL COURSE (part 3)

## Overview (L1)

- Development build vs Expo Go (~01:05:17–01:09:30) — explains what a development build is and why it is needed over Expo Go; runs `npx expo run ios` (or `android`) from the `apps/mobile` folder so native-only features like video calling and error monitoring can later be added.
- Upscaling screens and generating demo images (~01:07:00–01:15:10) — upscales auth and onboarding screens, stores them under the `design` folder, and covers two ways to create demo/hero images: a screenshot to GPT/Nano Banana, or the Hickfield MCP inside VS Code.
- Building the authentication UI with a screenshot-compare loop (~01:15:10–01:19:52) — prompts Claude to iterate (screenshot the simulator, compare to the attached design, repeat until identical); polishes empty space, box shadows, larger social logos, and renames the app "Dentify".
- Wiring up Clerk authentication (~01:19:52–01:24:43) — pastes the Clerk Expo SDK agent setup into a second Claude instance, enables native applications in the Clerk dashboard, and connects functional sign-up/sign-out.
- Testing auth and the Apple sign-in bug (~01:22:30–01:25:00) — Google sign-up/sign-out works and the user appears in the Clerk dashboard; Apple sign-in errors in the simulator and is fixed after running the required terminal command.
- Claude Skills concept and installing Clerk skills (~01:24:43–01:29:00) — defines a Claude skill as a reusable instruction set (a "playbook/recipe card") and installs Clerk skills into `.claude/skills` and `.agents` folders.
- Onboarding UI build and background image (~01:29:00–01:36:11) — attaches all onboarding design references, reuses the screenshot-compare loop, generates a matching background via Hickfield MCP, and makes the hardcoded flow testable (typing, keyboard toggle, continue).

## Sections (L2)

### Development build setup with Expo

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Explains why a development build is created instead of running in Expo Go, then installs the package and runs `npx expo run ios`/`android` from the `apps/mobile` folder.
- Key claims: Expo Go cannot support production-only libraries such as video calling or error monitoring; a development build produces the same end result as Expo Go but unlocks those features; Claude can run the build and reports when it finishes.
- Learner-relevant: Teaches the concrete command and folder context for producing a runnable native app build.

### Upscaling screens and producing demo/hero images

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Walks through upscaling the auth and four onboarding screens, saving the designs into a `design` folder, then generating demo images either by screenshotting into GPT/Nano Banana or by using the Hickfield MCP.
- Key claims: Mac screenshot shortcut is `control shift alt 4`; the transparent-background attempt failed so the image was copied as-is; Hickfield is paid/expensive but comfortable and exposes an MCP that can generate and save images without leaving VS Code; the generated image was close but not identical to the reference.
- Learner-relevant: Shows how to source and generate the visual assets an app UI depends on, and how to attach image files to a Claude prompt.

### Building the authentication UI with the screenshot-compare loop

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Prompts Claude to build only the auth UI (no functionality) and to loop—screenshot the simulator, compare against the attached design, repeat until they match—then iterates on polish issues.
- Key claims: The loop took roughly 5–10 minutes and produced an almost identical result; attaching a screenshot makes fixes easier; the black empty space should expand under the status bar; buttons need box shadows; social logos and "Continue with Apple/Google" text should be larger; the app is renamed from "Dentare" to "Dentify".
- Learner-relevant: Establishes the repeatable "design-reference + self-comparing loop" technique reused later for onboarding.

### Wiring up Clerk authentication

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Copies the Clerk Expo SDK agent-setup prompt into a second Claude instance to configure authentication under the mobile folder, and enables native applications in the Clerk dashboard.
- Key claims: Running a second Claude instance in parallel avoids wasting time while one build runs; native applications should be enabled by default in Clerk's configure settings; the terminal session was logged into a different Clerk account, so Claude created the app there.
- Learner-relevant: Demonstrates a parallel-instance workflow and the exact Clerk setup path for an Expo app.

### Testing auth and fixing Apple sign-in

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Tests Google sign-up/sign-out (working, with the user appearing in the Clerk dashboard) and the Apple button (error in the simulator), then has Claude fix the Apple sign-in.
- Key claims: Google auth sign-up, sign-out, and user listing all work as expected; Apple sign-in in the simulator does not work without extra setup and is fine to defer until testing on a physical device; the fix required running a command in the terminal.
- Learner-relevant: Sets realistic expectations about simulator limitations and the debugging handoff to Claude.

### Claude Skills concept and installing Clerk skills

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Defines a Claude skill as a reusable set of instructions for a specific repeatable task, then installs the relevant Clerk skills and lets Claude choose which ones the project needs.
- Key claims: A skill is like an employee playbook or recipe card—write the brand voice, formatting, or coding standards once instead of repeating them every chat; skills live in `.claude/skills` (Claude-specific) or `.agents` (all agents); the installer asks which skills to add and can select backend API, custom UI, CLI, webhooks, Next.js, and Expo variants.
- Learner-relevant: Gives the mental model and install procedure for reusable Claude skills, a foundational workflow for the rest of the course.

### Onboarding UI build and background image

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Builds the onboarding screens from attached design references using the same screenshot-compare loop, generates a matching background image via the Hickfield MCP, and makes the flow testable with hardcoded data.
- Key claims: The background image should be generated at 1K quality and 9:16 aspect ratio to save credits; onboarding data stays hardcoded (no database/real logic) at this stage; `command shift K` toggles the simulator keyboard; the date-picker button does not work so values are typed in; remaining input/UX glitches are acceptable for the prototype.
- Learner-relevant: Extends the design-loop technique to a multi-step flow and introduces the practice of stubbing logic for UI testing.
