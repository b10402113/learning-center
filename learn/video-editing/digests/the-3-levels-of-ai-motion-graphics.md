---
source: the-3-levels-of-ai-motion-graphics
source_type: pdf
source_lines: 561
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — the-3-levels-of-ai-motion-graphics

## Overview (L1)

- README & The 3 Levels — intro to a RoboNuggets guide of 12 copy-paste starter prompts for making motion graphics with Claude Opus 5.5 in Claude Code; defines the three ascending levels of steering (one-shot prompting → storyboarding → directing) and the base requirements for every level.
- Level 1 · One-shot Prompting — a single prompt line produces a full motion-graphics reel; covers the exact one-shot prompt, the tools Opus 5.5 picks itself (HTML/CSS/JS, Canvas, WebGL/three.js, Web Audio, MP4 export), image/3D/brand variants, and reusable elements.
- Level 2 · Storyboarding — Claude renders each scene as static HTML stills with descriptions and timecodes before animating, so the learner comments on frames and steers before the build.
- Level 3 · Directing — feedback pinned to the finished video (picture, sound, cuts) with a review page, then final render; covers scrubbing, 2x review, trim-dragging, and 1080p MP4 output.
- Where this goes next / Recap & Appendix — closing thesis that taste and the AI operating system are the paid skill, plus the one-page recap, comment anatomy, full prompt index, and every link referenced.

## Sections (L2)

### readme-and-requirements

- Locator: `[[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#README]]`
- Summary: Explains the guide is starter prompts for the video on making motion graphics with Claude Opus 5.5, 12 prompts across 3 levels. Lists the shared setup needed for every level and the expected runtime.
- Key claims: Requires Claude Code (app or terminal) with Opus 5.5 selected via `/model`; effort set to max via `claude --effort max` or `"effortLevel": "max"` in `settings.json`; Claude Code must be opened in a folder holding images, icons and logos; `ffmpeg` is optional but helps turn the built page into an MP4; demo reels took 63–88 minutes each at max effort.
- Learner-relevant: Establishes the exact toolchain, model, and CLI/config settings a lesson must reproduce before any prompt is run.

### the-3-levels

- Locator: `[[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#The 3 levels]]`
- Summary: Defines the three levels of steering (rising left to right, each keeping everything from the prior level): Level 1 one-shot prompting, Level 2 storyboarding, Level 3 directing. Each level has a "best for" and a "you see it" moment.
- Key claims: Level 1 sends one prompt for a good result, best for testing each new model, portfolio showreels, and reusable elements, seen only when finished; Level 2 has Claude storyboard it, you comment, then it builds, best when you already know the video you want, seen before the build as stills; Level 3 gives feedback on the video it made, best for the last 10–20% of polish (picture, sound, cuts), seen second by second.
- Learner-relevant: Provides the mental model / spine for sequencing the whole subject into three progressive nodes.

### level-1-one-shot-prompting

- Locator: `[[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#LEVEL 1]]`
- Summary: The one-shot level. Every demo reel started from one line naming no tools, style or scenes; under the hood everything is code. Includes prompts 01 and 02.
- Key claims: The exact one-shot prompt is "make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's your showreel for a résumé. go all out."; no AI video model was used; pictures are image files in the workspace that Claude positions with JavaScript; Opus 5.5 chose HTML/CSS/JavaScript (video as a web page), Canvas and WebGL (three.js) for shapes/particles/3D, Web Audio for music and SFX in code, and its own MP4 export via a recorder or an ffmpeg script; output is a playable web page plus a 1080p MP4 with sound; HyperFrames, Remotion, After Effects and Premiere were NOT used. Prompt 02 asks Opus to illustrate the architecture in Excalidraw (my prompt, every tool/library chosen and what each did, how they lead to the final MP4, plus a row for unused tools) and save a `.excalidraw` file openable at excalidraw.com.
- Learner-relevant: Teaches the minimal prompt and the code-based architecture (web page + JS timing + Canvas/WebGL/Web Audio + MP4 export) that all later levels build on.

### level-1-reels-and-variants

- Locator: `[[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#The reels in the video]]`
- Summary: Each reel is the one-shot line plus one short paragraph. Gives prompts 03 (images), 04 (3D), 05 (brand template).
- Key claims: Prompt 03 images version adds "generate_image" (makes images with GPT Image 2.5, budget $10 total) and lets you use photos/icons in the assets folder (e.g. Claude and Claude Code icons); it generated seven 3D renders for $0.34 of the $10 budget and placed Jay's own files beside them. Prompt 04 3D version draws elements from the project `pdoom-video` (https://github.com/mexicat/pdoom-video, copied into a `pdoom-video` folder with its music left out), specifically the gravity, black hole, laptop and effects; the project is MIT licensed and the guide warns to check the licence before borrowing. Prompt 05 brand version is a fill-in template using "my [name] design system" with explicit fields: Product facts (Product, Made by, Website, Offer, Main CTA, Features 3–10 one line each, By the numbers 2–3 real numbers, How it works in order) and the design system location to read first.
- Learner-relevant: Concrete parameterized prompts and cost/asset facts a lesson can reproduce; introduces `generate_image`, `pdoom-video`, and the brand-facts template structure.

### level-1-why-and-element-reuse

- Locator: `[[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#Why it's still worth it]]`
- Summary: Three reasons to still run one-shot reels, plus the element-picker workflow (prompts 06 and 07) and an optional prompt-enhancer step.
- Key claims: Three reasons — (1) test each new model by keeping one ceiling-pushing prompt and re-running it on new models, (2) build a portfolio (fast, easy showreel; small group of Claude Code users look like a top agency to most customers), (3) get reusable elements. Prompt 06 asks for a page that plays `[your-reel].html` and outlines the hovered element with its name when paused, letting you save elements to a list with a why-note plus a "copy the whole list" button; prompt 07 pastes that list back via "add to element library: [paste the list from the picker]". The picker workflow is demonstrated by saving the logo animation and Claude Code mascot, "like adding it to a cart"; no library yet → ask Claude to start one in an `elements` folder with a reuse note. Optional: paste the one-shot line into an enhancer site to turn it into a detailed brief, fix errors, then paste into Claude Code. Bottom line: one shot gets a good reel, not a production-level video.
- Learner-relevant: Frames the value of Level 1 and gives the concrete reusable-element library workflow that bridges to higher levels.

### level-2-storyboarding

- Locator: `[[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#LEVEL 2]]`
- Summary: The storyboard level. Claude storyboards for you; you comment, then it builds. Explains why a first prompt is usually not detailed enough and how a storyboard steers about a third of the way in. Includes prompts 08, 09, 10.
- Key claims: A storyboard = stills of each scene before anything moves, with a description of what happens in each; comment in chat but comments pinned to the frame work better because each carries the exact time and exact spot. Prompt 08: "Don't make the video yet. Storyboard it first: build each scene as HTML in the final look, without the animation, and take a screenshot of each one. Put the screenshots in order on one page, each with its start time and a short description… Then stop and wait for my comments." Prompt 09 makes the storyboard clickable to pin comments (each keeps shot, time, clicked spot) with a "Copy all comments" button. Prompt 10 pastes all comments, applies every comment and changes nothing else, then either shows a new storyboard or builds from it. Example pinned comment: "Shot 07, 5.90s, pin at 52% across, 46% down: less text heavy". Full beta toolkits (RUBRIC Storyboards beta, RUBRIC Editor beta) live in the RoboNuggets community at skool.com/robonuggets.
- Learner-relevant: The lesson-critical storyboarding technique, exact prompt text, and the "good comment carries shot/time/spot" standard.

### level-3-directing

- Locator: `[[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#LEVEL 3]]`
- Summary: The directing level. After storyboard comments and the build you're usually 80–90% done; directing is giving feedback on the final video (including sound) to finish. Includes prompts 11 and 12 and three directing tips.
- Key claims: Real pinned comments — "9.67s, on the stats scene: remove this scene" (Rubric reel); "4.55s, top of the frame: when i say comprehensive guide just show the page and focus on the title of the page: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5"; "29.29s, centre: when highlighting please zoom in to the text" (both from Jay's Opus 5.5 tips video, 300,000+ views). With Opus 5.5 you need fewer comments each round. Prompt 11 builds a review page: play/pause, 1x and 2x speed, a scrub timeline, click-to-pin comments at a time and spot, comment on the sound at the moment you hear it, drag a clip's start/end to fix a cut, and a "Copy all comments" button capturing every comment and trim with time. Prompt 12 pastes comments, applies every comment, changes nothing else, updates the review page, and does not render until told; final render as 1080p MP4. Tips: (1) review at 2x speed to check every animation faster; (2) fix bad cuts by dragging (Opus 5.5 sometimes cuts in the wrong place, e.g. a clip kept a false take at its end, hard to describe in words); (3) starting from raw footage, Claude can pick the takes to keep first (covered in a separate lesson).
- Learner-relevant: The complete directing workflow and exact review-page feature set, plus concrete feedback-comment and trim examples a lesson can use verbatim.

### closing-and-recap

- Locator: `[[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#Where this goes next]]`
- Summary: Closing thesis plus the one-page recap, the anatomy of a good comment, the full 12-prompt index, and every link in the guide.
- Key claims: The easy part is now the one-shot prompt (anyone can get a showreel from one line); the skill that pays is your own taste plus the operating system you work in and give feedback to your AI models with; lead time has shrunk so one person plus Opus 5.5 can make a whole motion-graphics video alone. Recap: 1 One-shot prompting (Claude Code, Opus 5.5, max effort, your workspace; add a paragraph for images/3D/brand and pick elements) pages 3–5; 2 Storyboarding (stills of every scene, comment on frames, paste back, get new board or video) page 6; 3 Directing (comments pinned to the moment: picture, sound, cuts; paste back, check, render) page 7. Comment anatomy: Level 2 on a still "Shot 07, 5.90s, pin at 52% across, 46% down: less text heavy"; Level 3 on the video "9.67s, on the stats scene: remove this scene". Prompt index maps 01–12 to pages (01 p3, 02 p3, 03 p4, 04 p4, 05 p4, 06 p5, 07 p5, 08 p6, 09 p6, 10 p6, 11 p7, 12 p7). Links: code.claude.com/docs, ffmpeg.org, excalidraw.com, github.com/mexicat/pdoom-video (MIT), [ENHANCER SITE - Jay to confirm], skool.com/robonuggets.
- Learner-relevant: The summary node and glossary of the guide's standards, prompt index, and external references for further reading.
