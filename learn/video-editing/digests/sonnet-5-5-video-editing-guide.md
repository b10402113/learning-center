---
source: sonnet-5-5-video-editing-guide
source_type: pdf
source_lines: 387
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — sonnet-5-5-video-editing-guide

## Overview (L1)

- README — frames the guide as a set of copy-paste Claude Code prompts that automate a three-step video edit: Cut (transcribe raw footage, keep the best take of every line), Animate (apply a real design system as motion graphics), Direct (fix mistakes by pinning notes to timestamps). The prompts build on each other and are finally saved as one reusable skill.
- Why Sonnet 5.5 — a cost/speed comparison table of Sonnet 5.5 against Opus 5.5 and Fable 5.1, arguing that video editing has a clear finish line and is therefore a good fit for a cheaper, faster model.
- Step 1 · Cut — transcribe raw footage and cut a clean video keeping only the best take of each line, using AssemblyAI or Whisper plus ffmpeg, with a full-transcript approval gate and join checks.
- Step 2 · Animate — grab a ready-made design system (DESIGN.md) from Refero Styles, then build the animated cut with HyperFrames so graphics match the transcript and the video stays in sync.
- Step 3 · Direct — fix what's wrong by sending timestamped notes (hand-typed or via the RUBRIC Editor) and re-rendering only the listed changes.
- Make it a skill — turn the whole workflow into one reusable `/animate` skill that takes only the path to a raw video.
- Where this goes next — the one-line version of the whole edit and the five-step recap that shows the design system and accumulated fixes are the real assets.

## Sections (L2)

### readme

- Locator: `[[sources/video-editing/20261003/Sonnet 5.5 Video Editing Guide.pdf#README]]`
- Summary: Introduces the guide as "the prompts behind the video on editing video with Claude Sonnet 5.5," listing five prompts — cut, grab a design system, animate the cut, send fixes, and turn it into a reusable skill. Instructs the reader to go in order (page 3 model numbers, page 4 Step 1, pages 5–6 Step 2, page 7 Step 3 plus skill) and to swap orange placeholders (video path, design system link) for their own details.
- Key claims: One prompt per step; the cut feeds the animation and the animation feeds the fixes; once all three steps work they are saved as one skill so a single line does the whole edit; the RUBRIC Editor mentioned in Step 3 is in the RoboNuggets community (skool.com/robonuggets).
- Learner-relevant: Gives the overall workflow map and the "build on each other" dependency between steps — the anchor for sequencing any video-editing lesson.

### why-sonnet-5-5

- Locator: `[[sources/video-editing/20261003/Sonnet 5.5 Video Editing Guide.pdf#Why Sonnet 5.5]]`
- Summary: A pricing/speed/intelligence comparison across Sonnet 5.5, Opus 5.5, and Fable 5.1, sourced from Artificial Analysis Intelligence Index v4.3.2, max effort, 30 Sep 2026 (artificialanalysis.ai). Explains that per-token cost differs from per-task cost depending on effort level.
- Key claims: Sonnet 5.5 costs $2/1M input and $10/1M output tokens (half of Opus 5.5's $4/$20) and runs 139 tokens/sec vs Opus's 92; intelligence score 56 vs Opus's 58; at max effort, cost per test task is $7.60 for Sonnet 5.5 vs $5.98 for Opus 5.5 because Sonnet uses more tokens; Fable 5.1 is $10/$50, 70 tokens/sec, intelligence 53, $7.63/task.
- Learner-relevant: Anchors the model-selection tradeoff (price vs speed vs intelligence vs per-task cost) and the idea that well-specified jobs with a clear finish line suit cheaper models.

### step-1-cut

- Locator: `[[sources/video-editing/20261003/Sonnet 5.5 Video Editing Guide.pdf#STEP 1 Cut]]`
- Summary: Provides a comparison of three transcription tools (Whisper, AssemblyAI, ElevenLabs Scribe v2) and the full copy-paste Step 1 prompt: transcribe the raw recording, keep the last clean take when a line is repeated, drop stumbles/restarts/coughs/long pauses, show the intended kept transcript for approval, then cut with ffmpeg to `cut.mp4` plus a transcript, and check every join.
- Key claims: Whisper is free and local (about 15–50 min per hour of audio on a normal processor); AssemblyAI is ~$0.21/hour and ~42 seconds per hour of audio (the one Jay uses, with exact time of every word); ElevenLabs Scribe v2 is ~$0.22/hour and ~1 min 11 sec per hour, with a free plan covering 4h30m/month; the prompt must create a `.env` file with an empty `ASSEMBLYAI_API_KEY=` line and never ask for the key in chat; prompt rule "only remove things, never reorder or rewrite what I said."
- Learner-relevant: Supports lessons on transcription tool choice, the approval-before-cut gate, API-key hygiene via .env, and ffmpeg-based cutting with join verification.

### step-2-design-system

- Locator: `[[sources/video-editing/20261003/Sonnet 5.5 Video Editing Guide.pdf#STEP 2 Grab a Design System]]`
- Summary: Explains why animating with no design system yields a generic look, and introduces Refero Styles (styles.refero.design) as a free library of 2,000+ brand design systems written for AI agents. Gives the Step 2 prompt to fetch a chosen style's DESIGN.md (colours, fonts, spacing, shapes, components, do's and don'ts) and save it word-for-word in the project folder.
- Key claims: A design system is a file of colours, fonts, spacing and shapes the agent must use; DESIGN.md must be saved verbatim and the brand's rules not changed; the prompt should show the main colours and fonts to confirm the right style, and fall back to telling the user to use the page's "Copy.md" if the page can't be opened.
- Learner-relevant: Anchors lessons on design systems as a reusable "look," and on the extraction/save step that makes animation consistent across videos.

### step-2-animate-the-cut

- Locator: `[[sources/video-editing/20261003/Sonnet 5.5 Video Editing Guide.pdf#STEP 2 Animate your cut]]`
- Summary: A four-step procedure (pick a style, copy its link, paste into page-5 prompt, run the animate prompt once DESIGN.md exists) plus the full "Animate the cut" prompt: build with HyperFrames, keep the speaker on screen, add transcript-timed motion graphics (titles, key words, numbers, simple diagrams, real tool logos), use only DESIGN.md tokens, leave voice/footage untouched, render 1920x1080 mp4 and check start/middle/end frames.
- Key claims: HyperFrames (github.com/heygen-com/hyperframes) is a free, open-source tool that turns a web page into an mp4 and its guide must be read first; graphics must be timed to the transcript; output must stay exactly as long as the cut to remain in sync; render at 1920x1080 and fix anything covering the face or running off screen; goal is "a real edited youtube video, not a slideshow."
- Learner-relevant: Supports lessons on AI animation workflow, transcript-timed motion graphics, layout (full-screen vs right-panel speaker with left graphics), and render resolution/frame-check QA.

### step-3-direct

- Locator: `[[sources/video-editing/20261003/Sonnet 5.5 Video Editing Guide.pdf#STEP 3 Direct]]`
- Summary: Explains that Sonnet 5.5 won't get a longer video perfect in one pass, so fixes are sent as notes. The RUBRIC Editor lets you pin a note to the exact moment and copy all notes as one message; notes can also be typed by hand. Gives the Step 3 prompt with timed examples.
- Key claims: Example notes — `0:42` title covers face, move left; `1:15` show the AssemblyAI logo when I say AssemblyAI; `2:30` graphic stays on too long, remove at end of sentence; the prompt instructs "change only what I listed and keep everything else exactly as it is" then re-render.
- Learner-relevant: Anchors lessons on iterative/timestamped feedback (directing), and on the discipline of scoped edits that avoid regressing the rest of the render.

### make-it-a-skill

- Locator: `[[sources/video-editing/20261003/Sonnet 5.5 Video Editing Guide.pdf#Make it a skill]]`
- Summary: The "Make it a skill" prompt turns the completed workflow into one reusable skill named `/animate` that takes only the path to a raw video. It runs the steps in order (transcribe and cut, animate with the design system, render, check frames), keeps DESIGN.md inside the skill, reads the AssemblyAI key from .env, and adds every session fix as a rule with its reason.
- Key claims: Skill should be "saved as a skill, or whatever your setup calls a saved instruction"; it must test once on a short clip and show the result; the standing instruction is to add every future correction to the skill so it improves over time.
- Learner-relevant: Supports lessons on skill/reusability design, packaging a design system with a skill, and turning corrections into persistent rules.

### where-this-goes-next

- Locator: `[[sources/video-editing/20261003/Sonnet 5.5 Video Editing Guide.pdf#Where this goes next]]`
- Summary: Closes with the claim that the prompt is the easy part and the design system is the asset that pays, then gives the one-line version (`/animate animate this video C:/path/to/your-video.mp4`) and a five-step recap (Cut, Grab a design system, Animate, Direct, Make it a skill).
- Key claims: The one-line command works only after Step 2 and the page-7 skill are done; what makes every video look like yours is the chosen design system plus the fixes kept as rules, which grows with each correction.
- Learner-relevant: Anchors the end-state lesson — a one-command pipeline — and the principle that a durable design system and accumulated fixes are the lasting value, not the prompts.
