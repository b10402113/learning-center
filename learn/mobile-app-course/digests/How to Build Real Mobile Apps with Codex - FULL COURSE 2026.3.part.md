---
source: How to Build Real Mobile Apps with Codex - FULL COURSE 2026
source_type: text
source_lines: 9270
part: 3
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to Build Real Mobile Apps with Codex - FULL COURSE 2026 (part 3)

## Overview (L1)

- Polishing native tabs & the screenshot-feedback loop — After the native tabs render in ~5 minutes, the instructor removes an unwanted gray background by screenshotting the app and prompting Codex ("native tabs looks as I wanted, but remove the gray background"); the loop — run, screenshot, prompt an adjustment, verify — is the reusable UI-iteration method for the rest of the build.
- Building the remaining V1 UI screens — The same loop produces the profile, edit-profile, explore, and chat screens; sign-out is removed from edit-profile and re-homed under a settings icon; the whole UI is built with fake/empty-state data first so real data can be swapped in later.
- Version control & AI code review with CodeRabbit — Explains branches and pull requests with a timeline analogy, then runs the real flow in VS Code (create branch, stage, commit, publish, open PR) and uses free CodeRabbit to AI-review every changed line before merging; review fixes are fed back to Codex as a single "all review comments" prompt.
- Merging to master & moving to the backend — The PR is merged, master is synced (noting a secret-key change Codex made behind the scenes), and the course pivots from UI to real functionality: create posts, like, comment, message — all requiring a backend/database, for which Convex is chosen (free to start).
- Setting up the Convex backend — Run two terminals (Expo app + Convex), `npm install convex` then `npx convex dev`, log in, create/deploy a project, let Convex generate AI helper files (agents.md, skills), and learn the `convex/` layout: schema, queries (read) versus mutations (create/update/delete).
- Generating the app logo with a GPT grid-of-nine — Off-camera branding pass: ask GPT for a grid of nine icon options instead of nine separate requests, iterate style/vibe, upscale the chosen one in a blue theme, remove its background, and drop it into `assets/images`.
- Wiring core features + Clerk↔Convex integration — Prompt Codex to read plan.md and implement post creation, likes, comments, and follows; it flags that Convex integration must be toggled on in the Clerk dashboard; username onboarding, post upload, likes, comments, and delete all work, verified in the Convex dashboard and with automatic real-time updates.
- Seeding test data & realtime updates — Codex generates seeded data (~24 fictional profiles with posts, likes, comments) so the explorer, home, and profile screens can be judged with realistic volume; follow/unfollow works but unfollow is slow because it runs in the background.
- Implementing chat messaging & design-reference iteration — Real chat is implemented on top of hardcoded demo data, with a fresh GPT-generated messages-tab reference and a redesigned post-detail screen (update only the bottom section, keep the better header); Convex real-time behavior carries the messaging.

## Sections (L2)

### Polishing native tabs & the screenshot-feedback loop

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 3801–3860)
- Summary: Codex builds the native tab bar in about 5 minutes and it looks much cleaner than the previous version, but a gray background remains behind it; the instructor screenshots the screen, tells Codex the tabs look right but to remove the gray background so the rest of the app shows through, and it is fixed in under a minute.
- Key claims: showing the AI the current state via a screenshot plus a precise, narrow correction is faster than describing the problem; small visual regressions are normal and expected in the loop; the same run→screenshot→prompt→verify cycle will be reused for every remaining screen.
- Learner-relevant: The canonical UI-iteration workflow of the course — a transferable method rather than a one-off fix.

### Building the remaining V1 UI screens

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 3861–4105)
- Summary: Using the same loop, the instructor builds the profile screen (~6 min), then edit-profile, explore, and chat screens, each by attaching a reference image and saying "build the exact same thing." Sign-out is deleted from edit-profile and moved conceptually into settings; the three-dots menu is replaced with a settings icon; explore and chat get their own references.
- Key claims: build the entire UI first with placeholder/empty-state data, then swap in real data later — replacing data is easy once the design exists; don't blame Codex for sign-out placement that came from the provided design; off-camera screens and images were added without touching the rest of the codebase.
- Learner-relevant: Reinforces the "UI-first, data-later" sequencing and shows how reference images drive screen generation.

### Version control & AI code review with CodeRabbit

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 4096–4560)
- Summary: After UI work passes manual testing, the instructor runs an AI code review because working code can still hide security and convention issues. CodeRabbit (free signup, ~2-week trial) is connected via GitHub and reviews pull requests. A timeline analogy explains branches (isolated feature work), commits, pull requests, merge, and discard. In VS Code the flow is: command-shift-P → create branch (`auth-ui-design`), stage all, accept the AI commit message, commit, publish branch, create the PR, then let CodeRabbit scan every line (~10 min). Two minor suggestions come back; the "prompt for all review comments for AI agents" is copied into Codex, which fixes everything in ~1 minute; a second commit is synced and the PR merged.
- Key claims: run an AI code review as a standard workflow step per feature, not just manual testing; creating separate branches keeps risky work off main/master; copying one aggregated review prompt avoids pasting suggestions one by one; you don't need to wait for CodeRabbit's re-review of your own fixes.
- Learner-relevant: A complete, beginner-friendly git/GitHub loop plus an AI code-review gate that generalizes to any project.

### Merging to master & moving to the backend

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 4561–4726)
- Summary: The merge is confirmed so changes land on master; switching back to master reveals a diff (a secret key Codex added behind the scenes) which is simply synced. With the UI essentially done, the course pivots to real functionality — creating posts, liking, commenting, and messaging — which requires a backend and database; Convex is introduced as free to start with a generous free plan.
- Key claims: review and sync unexpected background changes rather than ignoring them; the backend is the prerequisite for any real social feature; Convex is set up deliberately by hand (not blindly vibe-coded) so the process is visible.
- Learner-relevant: Marks the transition point from static UI to a functioning app and the reason a backend/database is needed.

### Setting up the Convex backend

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 4727–4769, 4863–4989)
- Summary: The instructor keeps two terminals open from here on — one running the Expo app, one running Convex. Run `npm install convex`, then `npx convex dev` (prompting a login the first time), choose "create a new project," accept the folder-derived name (codexgram), deploy to the cloud, and opt in to having Convex generate AI files (agents.md and skills) that teach the assistant to use Convex well. The generated backend lives under `convex/` with a schema plus queries and mutations; terminals are renamed to keep them straight.
- Key claims: always keep the Convex dev terminal running alongside Expo; queries read data (e.g. get posts) while mutations write (create/delete/update a post, comment, like, follow); the AI helper files improve how Codex works with Convex; the backend is plain JavaScript files you can inspect.
- Learner-relevant: The concrete backend setup and the query/mutation mental model underlying every later data feature.

### Generating the app logo with a GPT grid-of-nine

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 4771–4862)
- Summary: While Convex installs, the instructor replaces a logo he dislikes. He asks GPT for a "grid of nine" icon options for the app, rejects them, asks for a completely different style/vibe (another grid of nine), picks option six, upscales it in the blue theme, and removes the background. The result, though not identical to the original, is saved into `assets/images` to use as the brand logo.
- Key claims: ask for one grid of nine variations instead of nine separate requests; then say "upscale this one" to get a usable asset; a blue theme and background removal finish the asset.
- Learner-relevant: A cheap, reusable technique for producing app branding/icons during development.

### Wiring core features + Clerk↔Convex integration

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 4990–5350)
- Summary: Codex is told to read plan.md and implement post creation, likes, comments, and follows, and to report any manual dashboard work. It asks whether the Convex integration is enabled in Clerk; the instructor enables it under Configure → Integrations → Developers. After ~20 minutes the features are in. A username must be set on first use, profile creation then triggers, and empty states show until data exists. Creating a post with a gallery image and caption publishes successfully and the upload is verified in the Convex dashboard (Files, plus uploads/profiles tables — the profile appeared automatically thanks to the Clerk↔Convex integration). Like, comment, and delete all work; a comment-section spacing glitch is fixed from a screenshot prompt; post-detail UI is redesigned via GPT (three variations) then Codex.
- Key claims: some integrations must be toggled in the Clerk dashboard, so ask the AI what manual steps are needed; Convex updates are real-time out of the box — another simulator viewing the same post sees new comments without reloading; user records sync automatically from Clerk into Convex.
- Learner-relevant: The end-to-end proof that the UI now drives a live backend, and the Clerk/Convex wiring every authenticated feature depends on.

### Seeding test data & realtime updates

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 5351–5456)
- Summary: To judge the app with realistic volume, the instructor asks Codex to add seeded (hardcoded test) data. After ~10 minutes there are 24 fictional profiles with photos, likes, and comments; the explorer lists them, the home and profile screens populate, and you can open, like, and comment on each. Follow/unfollow works, though unfollow is slow because it runs in the background.
- Key claims: seeded data is optional polish but invaluable for seeing how screens look at scale; the follow list shows 12 of the generated accounts; background operations like unfollow can later be optimized, and UI quality can be improved by looping Codex.
- Learner-relevant: A practical testing technique for validating UI at volume before real users exist.

### Implementing chat messaging & design-reference iteration

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]` (lines 5457–5700)
- Summary: Chat currently shows hardcoded demo data, so the instructor says "implement the chat messaging" with a chat-screen reference and a messages-tab reference generated from a GPT grid of three matched to the design system (he upscaled variation three). Codex runs it (~17 minutes including testing); messages remain fake for the demo accounts but should work for a newly signed-up account (to be tested later). He then reworks the post-detail screen: GPT three variations (with the design system attached), upscale the second, save as post-detail ref, and tell Codex to update only the bottom portion while keeping the existing header.
- Key claims: pass a design-system-aware reference so generated UI variations match the existing look; demo/seed accounts intentionally show fake messages while real accounts use the backend; small surgical instructions ("only update this part") preserve parts of the UI you already like; Convex's real-time behavior underpins messaging.
- Learner-relevant: Closes out the section with a functioning-but-to-be-verified messaging flow and demonstrates precise, scoped UI edits.
