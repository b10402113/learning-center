---
source: Module 28 - Automated Scheduling
source_type: text
source_lines: 833
status: absorbed
absorbed_at: 2026-10-15
created: 2026-10-15
updated: 2026-10-15
---

# Digest — Module 28 - Automated Scheduling

## Overview (L1)

- Teaches automated scheduling and cross-posting: a scheduler removes the manual work of uploading each piece and pasting captions app-by-app.
- Primary tool: **Blotato** (built by Sabrina, a longtime friend of the community) — one video posts to 9 platforms at chosen times: Instagram, Facebook, TikTok, YouTube, LinkedIn, X, Threads, Pinterest, Bluesky.
- Alternatives: **Postiz** (free, open source, but requires Docker/Postgres self-hosting and weeks-long platform audit approval to auto-post); or posting by hand.
- Introduces the `/post` skill (baseline from Jay's Resources) that codifies posting times, accounts, and destinations, connects to Blotato by default, and lets the agent do the scheduling.
- Includes a one-time setup process (Blotato account, API key in a private secrets file, connect each account to get an account ID) and copy-paste prompts to send your agent (setup, schedule a week of clips, pick posting times).
- Advises not to stress over posting times: content usefulness matters most, and posting when you're awake lets you quickly fix mistakes; also notes TikTok serves content first to your own country (region-specific reach).

## Sections (L2)

### why-schedule

- Locator: `[[sources/ai-content/20261015/6-Module 28 - Automated Scheduling/6-Module_28_-_Automated_Scheduling.en.vtt#why-schedule]]`
- Summary: Explains the pain a scheduler solves.
- Key claims: posting manually means uploading every piece and copy-pasting captions for every platform one by one, even when the content is identical; a scheduler takes that job off you — one video goes to all accounts at times you pick.
- Learner-relevant: motivates why automation is worth the one-time setup.

### blotato-overview

- Locator: `[[sources/ai-content/20261015/6-Module 28 - Automated Scheduling/6-Module_28_-_Automated_Scheduling.en.vtt#blotato-overview]]`
- Summary: Introduces Blotato and its capabilities.
- Key claims: RoboNuggets uses Blotato, built by Sabrina, a longtime community friend; members get a significant discount; it takes one video and posts it across nine social platforms at times you pick; it can be driven by your agent (Codex or Claude Code); supported platforms are Instagram, Facebook, TikTok, YouTube, LinkedIn, Twitter/X, Threads, Pinterest, and Bluesky.
- Learner-relevant: names the recommended tool and the platforms it covers.

### postiz-open-source-alternative

- Locator: `[[sources/ai-content/20261015/6-Module 28 - Automated Scheduling/6-Module_28_-_Automated_Scheduling.en.vtt#postiz-open-source-alternative]]`
- Summary: Explains the free open-source alternative.
- Key claims: Postiz is well-known because it's open source and free, but setup is longer and more complex — you need to be technical, run your own Docker server and a database like Postgres; more importantly, self-hosting creates your own app that must pass each platform's audit process, which has requirements and can take weeks to approve; only worth it if you lack spending power.
- Learner-relevant: helps the learner decide between paid Blotato and time-costly Postiz.

### post-skill-setup

- Locator: `[[sources/ai-content/20261015/6-Module 28 - Automated Scheduling/index.html#post-skill-setup]]`
- Summary: Describes the `/post` skill and its one-time setup.
- Key claims: `/post` is the skill used to schedule, with a baseline version from Jay's Resources; it saves preferences — posting times, accounts, and where each post should go; by default it connects to Blotato and your agent does the scheduling; setup needs a Blotato account, your API key (in Blotato settings), and each account connected once; connecting an account goes through the app's sign-in and yields an account ID you give to your agent; with the account IDs and API key, the agent posts and you barely need Blotato's screens again.
- Learner-relevant: outlines exactly what must be configured once.

### prompts-to-send-your-agent

- Locator: `[[sources/ai-content/20261015/6-Module 28 - Automated Scheduling/index.html#prompts-to-send-your-agent]]`
- Summary: Provides ready-to-paste agent prompts.
- Key claims: get `/post` from Jay's Resources and send the install prompt; the "Set up Blotato and /post" prompt has 6 steps — (1) ask which accounts to post to and whether a Blotato account exists (send to blotato.com/?ref=robonuggets for 30% off, confirm the plan includes API access), (2) show where the API key is, make a private secrets file and have the user paste the key themselves (never in chat or the skill; keep the file out of anything shared), (3) walk through connecting each account one at a time, save each account ID, and remind to warm up brand-new accounts and leave them out, (4) verify the key works, list Blotato's accounts and confirm which are yours, only ever posting to those, (5) ask for time zone and posting times (default 9am, 1pm, 5pm) and save them, (6) do a dry run with one video showing exactly what would go to each app with nothing going live; the "Schedule a week of clips" prompt pastes the Render all instructions from RUBRIC Editor and asks `/post` to post clips one per day for 7 days across usual shorts channels (Instagram, YouTube Shorts, TikTok); the "Pick your posting times" prompt asks for time zone/awake hours/posts-per-day, suggests times while awake with one line of reasoning each, and saves them as defaults.
- Learner-relevant: gives copy-paste prompts that implement the setup and scheduling flow.

### schedule-a-week-demo

- Locator: `[[sources/ai-content/20261015/6-Module 28 - Automated Scheduling/6-Module_28_-_Automated_Scheduling.en.vtt#schedule-a-week-demo]]`
- Summary: Walks through an end-to-end scheduling workflow and calendar check.
- Key claims: export from RUBRIC Editor with "render all" which copies instructions to the clipboard; give that to your agent, then send `/post` with guidance (e.g. post these clips one per day for 7 days across IG, YouTube Shorts, TikTok); this renders and schedules the seven clips via Blotato; the calendar tab shows three posts per day (TikTok, YouTube Shorts, Instagram); clicking a post inspects its caption; for more granular control, view them first in RUBRIC Scripts to inspect the video, transcript, and caption, and enable/disable platforms before scheduling; this copies a command to transmit to your agent.
- Learner-relevant: shows the exact automation flow from finished video to a full scheduled calendar.

### scheduling-times

- Locator: `[[sources/ai-content/20261015/6-Module 28 - Automated Scheduling/6-Module_28_-_Automated_Scheduling.en.vtt#scheduling-times]]`
- Summary: Argues posting times matter far less than content quality; choose times you're awake.
- Key claims: the time of day or week of posting is not as important as many think — the usefulness of the content matters most, and you should post as much as possible to iterate quickly; the author's 9am/1pm/5pm times exist mainly because he's awake then, so mistakes can be reverted by deleting the post; don't stress about times — the North Star is quality/usefulness, reached by shipping a lot and improving hooks, delivery, and on-camera confidence.
- Learner-relevant: removes anxiety about "optimal" posting times.

### tiktok-region-reach

- Locator: `[[sources/ai-content/20261015/6-Module 28 - Automated Scheduling/6-Module_28_-_Automated_Scheduling.en.vtt#tiktok-region-reach]]`
- Summary: Notes TikTok's region-first distribution.
- Key claims: on TikTok, content is served first to your own country (region-specific); the author observed that new-account viewers were mostly from Australia; this is a bigger reason to schedule posts for times when you're awake.
- Learner-relevant: explains an early-reach quirk and reinforces the awake-hours scheduling strategy.

### member-discount-and-platforms

- Locator: `[[sources/ai-content/20261015/6-Module 28 - Automated Scheduling/index.html#member-discount-and-platforms]]`
- Summary: Notes the RoboNuggets discount and Blotato's platform list.
- Key claims: RoboNuggets members get 30% off all Blotato plans (member discounts page); Blotato posts to 9 apps at the times you pick — Instagram, Facebook, TikTok, YouTube, LinkedIn, X, Threads, Pinterest, Bluesky.
- Learner-relevant: concrete benefit and capability summary.

### resources

- Locator: `[[sources/ai-content/20261015/6-Module 28 - Automated Scheduling/index.html#resources]]`
- Summary: Links supporting material.
- Key claims: Blotato (30% off for members); `/post` baseline skill in Jay's Resources; Blotato Help (API keys, account connection, calendar); Postiz (open-source GitHub option and self-hosting requirements); RUBRIC Editor (download and install prompt — Export then Render all); RUBRIC Scripts (download and install prompt — check captions and channels before posting); Sabrina Ramonov (YouTube — creator who built Blotato).
- Learner-relevant: all the setup links in one place.
