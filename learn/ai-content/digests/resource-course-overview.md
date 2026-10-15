---
source: AI Content Accelerator Program (robonuggets)
source_type: text
source_lines: 244
file_count: 0
language: en
status: absorbed
absorbed_at: 2026-10-15
created: 2026-10-15
updated: 2026-10-15
---

# Digest — AI Content Accelerator Program

## Overview (L1)

- A scraped video-course backup from the robonuggets community: "AI Content Accelerator Program," indexed by the top-level `index.html` course map (community: robonuggets; updated 2026/10/15).
- The course is 46 lessons across 5 modules, organized as a 4-week program: an opening week of framing, then Wk1 Identity, Wk2 Ideation, Wk3 Creation, Wk4 Distribution.
- Each lesson is a scraped HTML page with its own folder (`index.html`), and some modules bundle downloadable agent "skills" toolkits under a lesson's `resources/` folder.
- The through-line is turning a creator's niche into a repeatable content system: pick an identity, source and pressure-test ideas, write in your own voice, then distribute everywhere with scheduling.
- The course is tool-led: bonuses walk through named agent skills (`/latest`, `/outliers`, `/inspo`, RUBRIC Scripts, RUBRIC Editor, `/animate`, `/post`) that automate each stage.
- Learner outcome: a working content operating system — ranked idea pipeline, scripts in the learner's voice, automated editing, and cross-channel distribution.
- Note: this digest is built from the course-map `index.html`. The cover image `assets/course-cover.png` could not be read (the model has no image input), so it is not described.

## Structure (L2)

### index.html (course map)

- Locator: `[[sources/ai-content/20261015/index.html]]`
- Purpose: The course catalog page. Renders the hero (title, community, 46 lessons / 5 modules / updated date, cover image) and a module-by-module list of lesson links, each pointing to `<lesson-folder>/index.html`.
- Key exports: Module → lesson navigation; lesson folder names; the `assets/course-cover.png` cover reference.
- Dependencies: None (static HTML/CSS).
- Learner-relevant: The authoritative index of what the course contains and the order to take it in.

### Module 1 — Lessons (framing)

- Locator: `[[sources/ai-content/20261015/1-Welcome to AI Content Accelerator/index.html]]`
- Purpose: Two opening lessons: "Welcome to AI Content Accelerator" and "ℹ️ Want to learn the technology side?". Sets expectations and points at the technical material.
- Key exports: 2 lessons.
- Dependencies: None.
- Learner-relevant: Orients the learner before the weekly program starts.

### Module 2 — Wk1 | Your Content Identity

- Locator: `[[sources/ai-content/20261015/2-Wk1 - Your Content Identity/index.html]]`
- Purpose: Nine lessons on identity: This Week's Focus: Identity; Module 1 What to Expect; Module 2 1000 True Fans; Module 3 Interest Media; Module 4 Content as Business; Module 5 Entertain or Educate; Module 6 Small Pond, Big Ocean; Module 7 Selfless Content; Wk1 Milestone.
- Key exports: 9 lessons.
- Dependencies: None.
- Learner-relevant: Niche, audience and business model decisions that every later stage depends on.

### Module 3 — Wk2 | Content Ideation

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/index.html]]`
- Purpose: Ten lessons on ideation: This Week's Focus: Ideation; Module 8 Welcome to Ideation; Module 9 Rethinking Quality; Module 10 Rethinking Volume; Module 11 Idea Sources; 🎁 Bonus: How to use /latest; Module 12 Finding Outliers; 🎁 Bonus: How to use /outliers; Module 13 A Note on Ideas; Wk2 Milestone.
- Key exports: 10 lessons. Bundles the `/latest` toolkit under Module 11's `resources/latest/` and the `/outliers` and `/inspo` toolkits under Module 12's `resources/`.
- Dependencies: Node.js 18+/22.13+, Python 3.12+, YouTube Data API key (for /outliers), optional yt-dlp and paid scraper keys.
- Learner-relevant: Where the course's idea engine lives — /latest rides the news, /outliers finds proven formats, /inspo saves the references worth studying.

### Module 4 — Wk3 | Content Creation

- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/index.html]]`
- Purpose: Fifteen lessons on creation: This Week's Focus: Creation; Module 14 Welcome to Creation; Module 15 Hooks; Module 16 Scripts in Your Voice; Module 17 Captions; Module 18 Trust and Truth; Module 19 Operating System; Module 20 RUBRIC Scripts; 🎁 Bonus: Using RUBRIC Scripts; Module 21 Camera and Setup; Module 22 Automated Editing; 🎁 Bonus: Using RUBRIC Editor; 🎁 Bonus: Auto Animations with /animate; Module 23 Which Account to Use; Wk3 Milestone.
- Key exports: 15 lessons. References the RUBRIC Scripts, RUBRIC Editor and `/animate` skills in its bonus lessons; no skill toolkits are bundled under this module (only Modules 11 and 12 ship code).
- Dependencies: None shipped (the referenced tools are external to the backup).
- Learner-relevant: Turns chosen ideas into scripts in the learner's voice and finished, edited video.

### Module 5 — Wk4 | Content Distribution

- Locator: `[[sources/ai-content/20261015/5-Wk4 - Content Distribution/index.html]]`
- Purpose: Ten lessons on distribution: This Week's Focus: Distribution; Module 24 Welcome to Distribution; Module 25 Master the Channels; Module 26 Why Post Everywhere; Module 27 Reminder; Module 28 Automated Scheduling; 🎁 Bonus: How to use /post; Module 29 Your Content OS; Wk4 Milestone; Module 30 The Secret to Success.
- Key exports: 10 lessons. Module 29 (Your Content OS) ships one resource, `RoboNuggets-Content-OS.pdf`; the `/post` scheduling skill is referenced in its bonus lesson but not bundled.
- Dependencies: None shipped (the `/post` tool is external to the backup).
- Learner-relevant: Closes the loop — shipping everywhere on a schedule and assembling the pieces into one content operating system.
