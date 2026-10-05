---
source: build-your-own-animate-guide
source_type: pdf
source_lines: 656
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — build-your-own-animate-guide

## Overview (L1)

- README — states what the guide is: the exact starter prompt that creates a `/animate` skill (HyperFrames + AssemblyAI, run by Claude Code or Codex), plus the three-step loop that refines a rough first version into a shippable one; points to skool.com/robonuggets for the fully refined skill.
- 01 Same input, different output — a skill is a markdown file an agent reads before doing a job; same raw video input plus a refined skill (carrying your rules and references) gives a "wow" output while an unrefined skill gives "meh".
- 02 The skill refinement process — the three-step loop: know the tools, give feedback as patterns, update the skill (absorb, keep it short); repeated rounds turn an unrefined skill into a refined one.
- 03 Step 1 · Know the tools, then paste one prompt — the three prerequisites (HyperFrames, AssemblyAI, Claude Code or Codex) and the full copy-paste starter prompt that builds a first `/animate` skill and a 10-second 9:16 test video.
- 04 Step 2 · Give structured feedback — how to write feedback as reusable patterns (reference designs, new rules, element library), with real examples mapping observations to rules.
- 05 Build the component library yourself — six starter prompts (graphics, icons, infographics, 3D objects, backgrounds, hero text) for generating library pieces with AI.
- 06 Five more categories — five additional prompt categories (motion, layouts, music, sound effects, b-roll) plus the "register it" step that turns files into a library via an element catalog.
- 07 Step 3 · Update the skill, then loop — the "calibrate my /animate skill with this feedback" prompt, what a good update looks like, and the four-step render/compare/calibrate loop.
- 08 Where this goes next — the starter prompt is easy; the paid value is the taste fed back round after round; community and fully refined `/animate` at skool.com/robonuggets.
- 09 The one-page recap — five-step summary of the whole process plus a list of every link in the guide.

## Sections (L2)

### readme

- Locator: `[[sources/video-editing/20261003/build-your-own-animate-guide.pdf#readme]]`
- Summary: Framing page. Defines the deliverable as the exact starter prompt that creates a first `/animate` skill using HyperFrames and AssemblyAI run by Claude Code or Codex, plus the three-step refinement loop. Explains how to use the guide: paste the prompt on page 4 into a fresh agent task, watch the 10-second test video, then run the loop on pages 5–8.
- Key claims: A skill is a markdown file the agent reads before it does a job; one starter prompt creates the skill and one loop makes it good; the fully refined `/animate` (locked motion rules, element library, reel templates) lives at skool.com/robonuggets.
- Learner-relevant: Gives the entry point and mental model (skill = markdown file) before any tool or code detail.

### same-input-different-output

- Locator: `[[sources/video-editing/20261003/build-your-own-animate-guide.pdf#01]]`
- Summary: Contrasts two skills fed the same raw video. An unrefined skill (a rough first version) outputs "meh"; a refined skill (your rules, your references) outputs "wow". The difference is not the model but how much of the author's taste the markdown file carries.
- Key claims: The first version is always rough and fast to make (one prompt, a few minutes, a test video); refinement happens by watching output and feeding liked/disliked changes back for the agent to fold into the file; the shipped version went through several rounds over two days, each round taking minutes because feedback was written as portable patterns, not one-off fixes.
- Learner-relevant: Sets the expectation that iteration, not first-pass quality, is what makes a skill good.

### skill-refinement-process

- Locator: `[[sources/video-editing/20261003/build-your-own-animate-guide.pdf#02]]`
- Summary: The core three-step loop diagrammed and spelled out. Step 1 "Know the tools / create the first version" (you only need to know what each tool does, not how to code it). Step 2 "Give feedback as patterns, not fixes" (reinforce the good, fix the rest, always as patterns). Step 3 "Update the skill / absorb, keep it short" (one line makes the agent fold feedback into the file).
- Key claims: HyperFrames turns HTML into video; AssemblyAI transcribes the recording; Codex or Claude Code is the agent that runs the skill. In step 2, give reference designs, give structured feedback, add new rules (what to always or never do), create an element library (reusable pieces, registered once). In step 3, render the same brief again, compare, then loop.
- Learner-relevant: The canonical overview a lesson can anchor the entire workflow to before drilling into each step.

### step-1-know-the-tools

- Locator: `[[sources/video-editing/20261003/build-your-own-animate-guide.pdf#03]]`
- Summary: Lists the three things to set up before the prompt: the agent and accounts for the two tools. Then presents the full starter prompt verbatim.
- Key claims: HyperFrames "turns an HTML page into an MP4" (your agent writes scenes as web pages, previews them, then renders) at hyperframes.heygen.com/introduction. AssemblyAI transcribes recordings and returns word timings so captions land on words (assemblyai.com, needs an API key). Claude Code or Codex is the agent that reads the skill and does the work (code.claude.com/docs, developers.openai.com/codex). The starter prompt instructs: create a skill called `/animate` that turns a script or recording into a short video using HyperFrames + AssemblyAI; use HyperFrames to build an editable video composition, preview it, render an mp4; use AssemblyAI to transcribe speech and get word timings when a recording is provided, else use the script for captions; read basic official guidance for both tools and report what needs setup; cover the flow take input → plan scenes → add visuals and captions → preview → export → verify playback; test with one 10-second 9:16 video using a given script (the prompts.chat promo); choose visuals/type/colours/layouts/transitions from basic guidance; save editable source, final mp4, a poster, and a short note of what was used; keep style open for later improvement.
- Learner-relevant: The exact setup checklist and the copy-paste prompt — the first hands-on artifact of the whole workflow.

### step-2-structured-feedback

- Locator: `[[sources/video-editing/20261003/build-your-own-animate-guide.pdf#04]]`
- Summary: Teaches writing feedback as patterns the agent can apply to every video, not one-off fixes. Three ways to feed the skill: reference designs (drop in a design system or screenshots and say "match this" — the author used Duolingo, Apple and Linear style files to pull colours, type and spacing); new rules (one sentence each: what to always do, what to never do, and why); an element library (any liked piece — count-up number, browser frame, icon set — registered once for reuse).
- Key claims: Real observation→pattern examples: floaty/slow transitions → "Every transition is 0.4 seconds, sharp in and sharp out, with motion blur while it moves, then a clean hold"; whole-sentence subtitles → "Subtitles show at most two words at once, timed to the actual audio, with the current word in orange"; spoken-but-unshown numbers → "Every number the narration says gets its own big orange count-up on screen, over half a second, then holds. Approximate numbers stay honest: 'thousands', never a made-up total"; dragging/repeated visuals → "A scene lasts as long as its script line needs, never more than six seconds. Never reuse a visual inside one video"; 3D hogging the screen → "A 3D object is on screen for three seconds at most, then hands off to a simple infographic. Comment keywords always sit in quotes, like Comment "PLUGINS"". A pattern has a what, a when, and an always or never (weak: "make the subtitles better"; strong: "Subtitles show at most two words at a time, timed to the audio, current word in orange. Apply this to every video from now on.").
- Learner-relevant: Provides concrete, reusable motion/caption/typography rules and the pattern-writing discipline that makes feedback effective.

### component-library-graphics-icons-infographics-3d-backgrounds-hero

- Locator: `[[sources/video-editing/20261003/build-your-own-animate-guide.pdf#05]]`
- Summary: Six starter prompts, one per category, for generating library pieces with an AI model (not drawn by hand) inside the same agent that holds the skill.
- Key claims: GRAPHICS — generate a transparent PNG of a subject for video overlay: square canvas, subject centred, nothing cropped, real alpha channel, no drop shadow, no background colour, no text, lit from top left, three variations, then pick which holds up at small sizes on dark. ICONS — six pixel-style SVG icons, one file each, 48×48 viewBox, stroke paths only with no fills (recolourable in CSS), same stroke weight, readable at 24px, one folder with an index page on light and dark. INFOGRAPHICS — editable HTML infographic using plain SVG shapes (no images), reveal parts in script order then animate the connection, every element gets its own id for retiming, deliver source + preview page and list every changeable value at top. 3D OBJECTS — build an object as real Three.js geometry (not an image), believable material with named finish (e.g. brushed aluminium with satin clearcoat), lit to read from any angle, export editable source + GLB model + ten-second turntable MP4 + transparent WebM for overlays. BACKGROUNDS — quiet animated background behind titles: dots on a fixed grid where only dot size changes over time, driven from a timeline value (never a random seed) for identical renders, one HTML file with colour and spacing as variables at top. HERO TEXT — a hero number counting up to a value in half a second then holding, big and centred in the accent colour with a short label; a second version pairing one large icon with a centred title entering separately; editable HTML, timing in variables, portrait and landscape.
- Learner-relevant: Concrete generation prompts and output-format expectations for building a reusable asset library (PNG, SVG, HTML/SVG, Three.js/GLB/MP4/WebM).

### five-more-categories

- Locator: `[[sources/video-editing/20261003/build-your-own-animate-guide.pdf#06]]`
- Summary: Five more prompt categories that make separate videos look like one show, plus the registration step that converts files into a library.
- Key claims: MOTION — six reusable entrance animations (from the left, from the right, rise and settle, drop into place, scale up, fade through), each 0.4 seconds with sharp start/finish and holding still on landing, one file of named recipes plus a replay/copy page. LAYOUTS — three reusable HTML layouts (browser-window mockup showing a site address in the tab; split screen with presenter on one half and animation on the other; grid of portrait videos with one enlarged in the centre), portrait and landscape each, spacing and corner radius in variables. MUSIC — a background music bed for a given length/topic, plus two paste-ready music-generator prompts naming genre, instruments, tempo and mood, both saying instrumental with no vocals, short intro; then what to listen for when picking. SOUND EFFECTS — free commercially usable SFX (dry click, soft click, short swish, light whoosh), only sources with a clear commercial licence, record licence and link for each, measure and list every file length, build an audition page to mark keep/maybe/skip. B-ROLL — a b-roll clip for a given length/scene under narration: no text, no logos, no faces, nothing dating it, slow camera move, loopable, matching the palette, two takes with different moves, save prompt and settings beside the file. THEN REGISTER IT — add each new piece to an element catalog with one entry (name, category, file path, one line on when to use it), create the catalog if missing and add to it whenever something new is made, then build an index page that reads the catalog and previews every element.
- Learner-relevant: Extends the library into motion/music/SFX/b-roll and establishes the catalog as the mechanism that makes a library reusable ("a component you cannot find again is not a library, it is a folder").

### step-3-update-and-loop

- Locator: `[[sources/video-editing/20261003/build-your-own-animate-guide.pdf#07]]`
- Summary: The one-line calibrate prompt and how to judge a good skill update, followed by the four-step loop.
- Key claims: The calibrate prompt is "calibrate my /animate skill with this feedback:" followed by the round's patterns (example rules: 0.4-second sharp transitions with motion blur then clean hold; subtitles at most two words, current word in orange; every spoken number gets an orange count-up over half a second), then: "Fold each one into the rule it belongs to instead of adding a new section at the bottom. Keep the skill short. Write the reason next to each rule, not the date. Then tell me exactly what changed." A good update: (1) the rule is absorbed, not appended — push back if the skill grows a dated "round 4 fixes" block; (2) the reason travels with the rule ("two words at once, because a phone viewer reads one glance at a time" survives; "Locked on Tuesday" does not); (3) the file stays short — a refined skill is usually shorter than the version before it, and length signals layering instead of absorbing. The loop: render the same test brief again; watch it next to the last version and note what improved and what still bugs; write the next round of patterns, keeping wins as "always" and misses as "never"; calibrate again; stop when the output stops surprising you, then point the skill at a real recording.
- Learner-relevant: The exact prompt and quality bar for iterating on a skill file, plus a stopping condition.

### where-this-goes-next

- Locator: `[[sources/video-editing/20261003/build-your-own-animate-guide.pdf#08]]`
- Summary: Closing pitch. The starter prompt is the easy part; the value is the taste fed back round after round until the file carries how you want videos to look without being told again. The fully refined `/animate` (locked motion rules, element library, reel templates) is installable at skool.com/robonuggets.
- Key claims: Anyone can paste the starter prompt and get a rough `/animate` in minutes; the paying skill is the accumulated feedback; the community practices building AI systems and mastering Claude Code + Claude Design weekly.
- Learner-relevant: Frames why sustained refinement matters and where the advanced assets live.

### one-page-recap

- Locator: `[[sources/video-editing/20261003/build-your-own-animate-guide.pdf#09]]`
- Summary: Five-step summary of the method plus the complete link list.
- Key claims: (1) Know the tools — HyperFrames turns HTML into video, AssemblyAI transcribes, Claude Code or Codex runs the skill; paste the starter prompt. (2) Give structured feedback — reference designs, new rules, element library, always as patterns (what, when, always/never). (3) Build the library — eleven starter prompts across the categories; register every keep in a catalog or it is a folder not a library. (4) Update the skill — "calibrate my /animate skill with this feedback"; absorbed not appended, reason not date, shorter not longer. (5) Loop — same brief, new render, compare, next round; stop when it stops surprising you. Links: hyperframes.heygen.com/introduction, github.com/heygen-com/hyperframes, assemblyai.com, code.claude.com/docs, developers.openai.com/codex, skool.com/robonuggets.
- Learner-relevant: A compact reference a lesson or checklist can be built from.
