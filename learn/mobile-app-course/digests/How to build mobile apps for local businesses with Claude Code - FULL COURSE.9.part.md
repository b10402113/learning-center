---
source: How to build mobile apps for local businesses with Claude Code - FULL COURSE
source_type: text
source_lines: 17078
part: 9
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to build mobile apps for local businesses with Claude Code - FULL COURSE (part 9)

## Overview (L1)

- Advanced ImageKit media features — Extends the earlier ImageKit integration with a tap-to-reveal blur toggle, a scrollable roster of all dentists (replacing a random pick), AI background removal (white background), and an on-image overlay of the clinic/brand name for appointment documents.
- Media library, to-dos, and the ImageKit branch pull request — Reviews the ImageKit media-library folder structure, assigns self-practice tasks, then branches, commits, opens a PR, and runs CodeRabbit's AI review, fixing every flagged issue via the suggested agent prompt while cautioning against blind acceptance.
- Sentry logs deep dive — Builds a profile-tab Sentry log screen with varied and batch (100-at-a-time) scenarios, then explores the Sentry dashboard: log detail, severity levels, property-based and multi-search queries, timeline spikes, saved queries, data export (CSV/JSON), and the `beforeSendLog` hook for scrubbing PII.
- Legal pages: terms of service and privacy policy — Explains that legal pages plus delete-account are mandatory for App Store approval; has Claude scan the codebase to generate terms of service and privacy policy under a `legal` folder, wires them into the landing page navbar/footer, and creates device mockups via Shots/Shots.so with transparent backgrounds and no shadow.
- Support page, delete account, and project wrap-up — Adds a support page/URL, implements delete-account with confirmation, sign-out, and deletion from both Clerk and the database (including cascading child records), then closes the project, commits to master, and lists remaining plan.md features as challenges.

## Sections (L2)

### Advanced ImageKit features: blur toggle, dentist roster, background removal, overlay

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Continuing the ImageKit work, the instructor demonstrates a photo-gallery image that is blurred by default and becomes visible on tap (and blurred again on a second tap), all handled by ImageKit URL transformations. Using a screenshot plus an explanation of the issue, Claude replaces the single random dentist with all dentists from the database and enlarges the profile image on press ("one-shot," single try). Next, ImageKit's AI transformations (beta but working) power background removal so the pressed dentist profile shows a white background, and the overlay feature stamps the brand/clinic name (e.g. "Identify") onto appointment document images.
- Key claims: ImageKit URL transformations handle blur/reveal and background replacement declaratively; AI transformation features are in beta but functional; overlay is the mechanism for adding brand names onto images; attaching a screenshot plus a plain-language description of the issue is enough for Claude to implement UI fixes in one try.
- Learner-relevant: Anchors CDN-level image manipulation (blur, background removal, overlays) as a way to add rich media features without writing image-processing code.

### ImageKit media library, next-feature to-dos, and the branch PR + CodeRabbit review

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The ImageKit dashboard's media library shows folders auto-created by the app (`dentists` for uploaded dentist images, `patient uploads` organized by appointment/user ID). The instructor assigns to-dos (family members, medical history, UI polish) and points to plan.md as the source of truth for what remains, then notes delete-account, privacy policy, and terms of service are still pending and required for store submission. To ship the ImageKit work he creates a branch, stages/commits with an AI-generated message, publishes it, opens a PR (~6,000 additions, ~200 deletions), and uses CodeRabbit to review within ~10 minutes. He copies CodeRabbit's "prompt for AI agents and all review comments" into Claude to fix every issue, then commits, merges the PR, and syncs master.
- Key claims: Uploaded assets land in ImageKit folders keyed by user/appointment; plan.md is the canonical task list the AI can analyze; CodeRabbit's review is itself AI-generated so its findings should be skimmed rather than accepted blindly (e.g., a deliberate `masks: false` setting should be kept); review-fix prompts can be delegated back to the coding agent.
- Learner-relevant: Supports the branch/PR/review-fix loop as a repeatable shipping pattern and the judgment to curate AI review findings rather than auto-apply them.

### Sentry logs deep dive

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: A "from the future" section where Claude builds a Sentry log screen under the profile tab with individual scenarios plus batch-log buttons that fire ~100 logs at once to simulate a real-world app with thousands of users. After sending logs, the instructor opens the Sentry dashboard, goes to Explore Logs, selects the project, and waits for logs to appear. Each log exposes custom data plus Sentry-added context (OS, version, environment, model) and links to traces and session replays. He filters by property queries (e.g., `severity contains error`, showing 22 results), reviews warnings vs errors, drags on the chart to inspect spike timelines, performs multi-condition searches (severity = info AND severity = error, plus numeric/date conditions), saves common queries and monitors/widgets, and exports data as CSV or JSON. Finally he shows the root layout's `Sentry.init` `beforeSendLog` hook, used to delete user email and username from logs before sending.
- Key claims: Property-based and multi-condition search beats manual scrolling for finding errors at scale; logs link to traces and session replays; queries can be saved, monitored, and exported; `beforeSendLog` runs arbitrary logic (e.g., PII scrubbing) before a log leaves the app, which matters for legal/privacy reasons.
- Learner-relevant: Anchors production observability practice — structured logging, filtering/searching, and privacy-conscious log handling — as debugging scales beyond a single user.

### Legal pages: terms of service and privacy policy

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The legal pages are mandatory (non-optional) for app-store approval. The instructor pastes a battle-tested terms-of-service prompt into Claude along with the instruction to scan the entire codebase and generate the terms, placing the output under a `legal` folder. While it builds, he creates app-store-style device mockups: screenshot the app in different states, drop them into a mockup tool, set the frame to a transparent background (choosing an iPhone frame), swap in the screenshots, zoom in to remove extra whitespace without cropping the phone, remove any drop shadow, and export. Claude generates the landing page with the terms of service; placeholders for the legal entity name and address remain to be filled in. The first attempt produced markdown instead of a web page, so a follow-up prompt requested it as a linked web page. The privacy policy is then generated the same way and linked in both footer and navbar. Three clean (shadow-free) mockup images are attached and Claude is told to keep everything else and just swap the images; a caching issue caused stale images until Claude was asked to clear the cache.
- Key claims: Privacy policy, terms of service, and delete-account are required for Apple approval; AI can draft legal pages from a codebase scan, but the legal entity name/address placeholders must be filled manually; mockups need a transparent background and no shadow; a website landing page is the natural home for these pages so the mobile app can link to them; cached images may require an explicit cache-clear instruction.
- Learner-relevant: Anchors the pre-submission compliance checklist and the workflow of generating publishable legal/support pages and marketing assets, including the real-world failure-and-retry loop.

### Support page, delete account with cascade, and project wrap-up

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Optionally add a `/<domain>/support` page with a short support message and contact email, since the Apple dashboard requires a support URL. Then, switching back to the mobile app, the profile screen's non-functional delete-account button is implemented: on press, ask for confirmation; if confirmed, sign the user out and delete the account from both Clerk and the database. Testing shows cancel does nothing and confirm removes the user (verified gone in the Clerk users table). The instructor explains cascading deletion — when the account is removed, its medical histories and appointments should be deleted too — and advises confirming with Claude that cascade behavior is implemented. He commits this section to master directly (skipping a PR to save time), then declares the project finished with its core features (appointments, onboarding, authentication, video calling, AI assistant, plus privacy policy, terms of service, landing page, and dashboard). Remaining plan.md features are left as practice challenges, and he mentions an optional paid community covering payments, free trials, weekly/monthly/yearly plans, and App Store deployment.
- Key claims: A support URL is required by the Apple dashboard; delete-account must remove the user from both the auth provider (Clerk) and the app database; cascade deletion ensures dependent records (medical history, appointments) are removed with the account; leaving remaining features as challenges is a deliberate scoping choice since the project already has all core features.
- Learner-relevant: Anchors the final store-readiness requirements (support URL, delete account, cascade) and models scoping discipline — shipping a complete MVP and treating extra features as optional practice.
