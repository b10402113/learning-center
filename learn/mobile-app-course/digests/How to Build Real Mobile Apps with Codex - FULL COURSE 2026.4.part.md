---
source: How to Build Real Mobile Apps with Codex - FULL COURSE 2026
source_type: text
source_lines: 9270
part: 4
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to Build Real Mobile Apps with Codex - FULL COURSE 2026 (part 4)

## Overview (L1)

- Installing a dev build on a real phone — two routes (USB `--device` vs Expo EAS cloud build), the EAS build/troubleshoot loop, and running the installed app through the Metro dev server or tunnel.
- Apple Developer Program cost — the $99/year fee (region-discounted) required to publish to the App Store.
- Live on-device verification — testing auth, follows, likes, comments, and messages against Convex to confirm real-time sync works outside the simulator.
- Reusable AI instructions — creating a repo skill for the reference-image "self-loop" and using `agents.md`/`claude.md` to persist project conventions.
- Off-camera UI polish — explore/home/profile screens, an Instagram-like stories feature, and a settings screen.
- App Store compliance essentials — mandatory delete-account, sign in with Apple, privacy policy, terms of service, and support URL.

## Sections (L2)

### Finishing the duplicate-screen build and installing a dev build on phone

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: The previously cloned screen is judged close enough to the reference and the author stops refining it, then shifts to installing a development build on a physical iPhone instead of only the simulator.
- Key claims: within ~10 minutes the AI's actions/comments came out nearly identical to the reference; two ways to get a dev build are (1) USB-connect the iPhone and run `npx expo run iOS --device`, or (2) use Expo EAS (Expo Application Services).
- Learner-relevant: anchors the transition from simulator-only to real-device workflow and gives the concrete device-flag command.

### Apple Developer Program cost (publishing prerequisite)

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: Explains the Apple Developer Program enrollment required to publish, including its annual fee and regional discounts.
- Key claims: Apple charges $99/year; users outside the US in lower-purchase-power countries pay a discounted rate (~$20–$25, author from Turkey); it must be applied for and paid.
- Learner-relevant: sets cost/eligibility expectations before attempting App Store publishing.

### Generating EAS build steps with Codex and troubleshooting failures

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: The author asks Codex for step-by-step EAS instructions (pretending to be a beginner), runs the generated commands, and resolves build errors by feeding logs back to the AI.
- Key claims: first-time flow needs login + device connection setup; EAS creates an `eas.json` config file; "invalid version" / failed builds are fixed by clearing cache and rerunning; pasting build logs to Codex yields the fix; the Expo dashboard (expo.dev) shows builds and a QR code when done.
- Learner-relevant: a repeatable AI-assisted build-and-debug loop for cloud dev builds; shows logs as the key input for the AI.

### Running the installed app on your phone via dev server or tunnel

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: After EAS finishes and a QR code appears, the author scans it to install the app, then starts Metro and enters the dev-server URL (pasting it into the phone app) so the build connects to the local JS bundle.
- Key claims: scanning the QR installs the build; developer mode may be needed under Settings ▸ Privacy & Security; run the terminal command to start the server, and if the result is unchanged use the `--tunnel` flag; copy the dev-server URL (starting with `http`) up to `/direct` into the app.
- Learner-relevant: closes the loop from cloud build to a running app on the device; gives the tunnel fallback for network issues.

### Live on-device verification against Convex (real-time)

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: The author signs in with Google, sets a username, and exercises the app on the phone — follows, likes, comments, and messages all update in real time.
- Key claims: auth screen, explore feed, follow/unfollow, likes, comments, and messages all work on-device like in the simulator; updates propagate instantly, credited to the beauty of Convex.
- Learner-relevant: demonstrates that the backend real-time layer makes multi-client updates automatic; a verification anchor for "real app, not mock."

### Committing changes and code-review tooling

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: The lesson is wrapped by staging all changes, generating a commit message, and committing to master (skipping a PR for speed); mentions the free CodeRabbit VS Code extension for code review.
- Key claims: in a real project the author would open a PR for code review, but here commits to master to save time; the CodeRabbit extension is free and works out of the box in VS Code.
- Learner-relevant: models the commit discipline and a low-friction automated review option.

### Off-camera UI polish: explore, home, profile, and stories

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: Reviewing background work, the author shows the explore screen redesigned from images-only to a full UI, the home screen updated, a working stories feature (library or camera, viewer with back/forward navigation), and a new profile screen.
- Key claims: explore UI was one-shotted in ~13 minutes using the reference-image loop; stories support posting from camera or library and navigate like Instagram; caption was removed from stories but kept (with camera added) for post creation; profile was built without re-typing the loop prompt.
- Learner-relevant: shows the AI reference-image loop producing multiple complete screens quickly and iterating on feature scope via prompts.

### Creating a reusable skill for the reference-image loop

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: To avoid retyping the "screenshot-and-compare-until-identical" instruction, the author has Codex generate a skill placed under both Claude and agents skill folders.
- Key claims: skills live under `.claude/skills` (Claude-only) and `.agents/skills` (works for Codex, Cursor, etc.); the skill is auto-loaded at the start of a session so a plain "make profile screen look like this" suffices; the recommendation is to have Codex generate the equivalent skill yourself.
- Learner-relevant: a reusable-prompt pattern that automates a repeated design-matching workflow.

### Settings screen, delete account, and agents.md/claude.md conventions

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: Builds a settings screen (privacy policy, terms, delete account, sign out) and uses the moment to explain `agents.md`/`claude.md` as auto-loaded project instruction files.
- Key claims: a delete-account button is mandatory when the app has auth and stores user data, or Apple rejects it; `agents.md`/`claude.md` are plain-markdown instructions auto-loaded at session start (conventions, always/never rules); convention is to put instructions in `agents.md` and have `claude.md` import it; native-tabs regression was fixed by adding "always use native tabs" to `agents.md`; clerk secret key is added via project env vars to enable account deletion.
- Learner-relevant: teaches the durable way to make the AI honor project conventions instead of re-prompting each session; also compliance-critical delete-account implementation.

### Legal pages and App Store-required features

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]`
- Summary: Opener of the legal-pages lesson listing must-have features before generating privacy policy, terms of service, and a support URL.
- Key claims: must-haves include delete account (done) and sign in with Apple if any other social login (Google) exists; privacy policy and terms must be linked or the app is rejected, and Apple asks for them plus a support URL during submission; they must be generated and deployed to a live URL.
- Learner-relevant: a pre-submission compliance checklist that can anchor a publishing/prep node.
