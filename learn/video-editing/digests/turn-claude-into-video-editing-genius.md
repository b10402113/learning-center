---
source: turn-claude-into-video-editing-genius
source_lines: 1214
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — turn-claude-into-video-editing-genius

## Overview (L1)

- Context · Why Sonnet 5.5 — Sonnet 5.5 shipped a few days before the recording and is the cheaper sibling of Anthropic's Opus 5.5 (half the token cost); the presenter shows that it can produce edited talking-head video plus motion graphics on its own, without any separate AI video-generation model.
- Code-based animation and re-usable design systems — every graphic is authored as JavaScript + HTML (not a black-box video model), so layers can be isolated, a dialed-in style can be codified into a design system, and that system can be packaged into a skill (e.g. `/animate`) for reuse.
- Step 1 · Transcribe and cut — transcribe raw footage with AssemblyAI (or Whisper / ElevenLabs), then have Claude read the transcript to drop pauses and false takes, keeping the best/latest take and outputting an MP4; a Rubric editor adds notes that are fed back to calibrate the skill.
- Step 2 · Pick a design system and animate — generic prompts yield Claude's defaults ("AI vibe-coded slop"); instead source a design system from styles.refrl.design, skillery.dev or watchshups.com, or have Sonnet watch a video via FFmpeg screenshots and reverse-engineer a design system from it.
- Step 3 · Direct and codify — reach the last 10–20% of quality by reviewing beats/animations, leaving timestamped comments (in the Rubric editor), and sending all feedback at once; then ask Claude to bake the session's learnings into the `/animate` skill.

## Sections (L2)

### context-sonnet-5-5-and-code-based-motion

- Locator: `[[sources/video-editing/20261003/Turn Claude Into a Video Editing GENIUS (in 3 simple steps).srt#Sonnet 5.5 context]]`
- Summary: The presenter frames the tutorial: Sonnet 5.5 just released as the cheaper version of Anthropic's Opus 5.5 (half the token cost), and it is strong at video editing and motion-graphic animation. The demo asks Sonnet, via a workspace skill called `/animate`, to turn raw talking-head footage into an animated video. All cuts and animations are generated as JavaScript and HTML, so individual layers can be isolated and toggled. Unlike AI video-generation models ("black boxes… hard or costly to replicate"), a dialed-in style can be turned into a design system and made part of a reusable skill. Style families shown include flat vector animation, isometric graphics, 3D render animations, liquid motion, glassmorphism, and Vox-style cutout/collage animation; the style examples are credited to Vincent Wei on X, originally made with Opus 5.5.
- Key claims: Sonnet 5.5 is roughly half the token cost of Opus 5.5; animations are code (HTML + JavaScript), not a video model, and are therefore editable and re-usable; a style can be codified into a design system and packaged as a skill; designs shown span flat, isometric, 3D, liquid, glassmorphism and cutout styles.
- Learner-relevant: Anchors the core thesis — Claude's motion graphics are code you own, and a design system + skill is the reusable asset — and motivates the whole three-step workflow.

### ask-for-svgs

- Locator: `[[sources/video-editing/20261003/Turn Claude Into a Video Editing GENIUS (in 3 simple steps).srt#Ask for SVGs]]`
- Summary: When requesting icons, illustrations or diagrams from Claude, ask for them as SVG (Scalable Vector Graphics). An SVG scales to any size without going blurry, can be opened and recolored by hand, and can be animated by Claude — so every graphic returned is editable and animatable. Because Sonnet understands the video's transcript, it fits the selected design system and style to what is being said while keeping the core message.
- Key claims: SVG = Scalable Vector Graphics, scales without blurring; SVG color is hand-editable and SVGs are animatable; the same message can be re-skinned across different design systems (isometric, flat vector, 3D) while staying on-message.
- Learner-relevant: Supports a lesson on why SVG is the right asset format for AI-generated motion graphics — resolution-independent, editable, and animation-ready.

### step-1-transcribe-and-cut

- Locator: `[[sources/video-editing/20261003/Turn Claude Into a Video Editing GENIUS (in 3 simple steps).srt#Step 1 Transcribe and cut]]`
- Summary: For spoken/talking-head footage you need transcription so Sonnet can cut out pauses and false takes. The starter prompt gives Claude the path to the raw footage and asks it to transcribe with AssemblyAI; Claude then guides sign-up and where to find the API key (AssemblyAI settings). AssemblyAI is not the only option: Whisper is free and open source but runs on your own CPU (an hour of audio takes ~15–50 minutes depending on CPU), while AssemblyAI transcribes an hour of audio in ~42 seconds — the fastest the presenter has tried; ElevenLabs Scribe is also usable if you already have a subscription (reasonable per-hour cost, faster than Whisper, a bit slower than AssemblyAI). Claude reads the resulting script and identifies which takes to keep (e.g. it detected a false take, or keeps the latest take), then returns an MP4. A Rubric editor lets you adjust cuts "the same way that you would in Premiere," which attaches notes; copying all comments and sending them to Claude calibrates the skill so future cuts are more personalized to how you speak.
- Key claims: Use a prompt with the raw-footage path to trigger AssemblyAI transcription; AssemblyAI API key lives in settings and new sign-ups get free credits; Whisper = free/local/CPU-bound, ~15–50 min per hour of audio; AssemblyAI ≈42 seconds per hour of audio; ElevenLabs is an alternative for existing subscribers; the cut output is an MP4; false takes are detected from the transcript; feeding editor comments back to Claude refines the skill over time.
- Learner-relevant: Supports lessons on transcription-tool selection, API-key setup, transcript-driven cutting (pause/false-take removal, best/latest take), and the feedback loop that calibrates cutting rules.

### step-2-design-system-and-animate

- Locator: `[[sources/video-editing/20261003/Turn Claude Into a Video Editing GENIUS (in 3 simple steps).srt#Step 2 Design system and animate]]`
- Summary: Animating with a generic prompt (no skills, no design system) gives Sonnet's defaults, which quickly become generic "AI vibe-coded slop." To differentiate, create your own design system and declare/invoke it when animating. Sources for design systems: styles.refrl.design offers design markdown files (mainly website systems) you can copy and ask Claude to turn into a design system and skill (e.g. `/slush design`); skillery.dev is a browsable collection of motion-graphic videos made with Claude/Opus 5.5, with attribution and a starter prompt; watchshups.com has many app launch videos but no starter prompts. To replicate a style whose prompt is unavailable (e.g. a Vincent Wei X post), give Claude the X post link and have it use the open-source tool FFmpeg to take screenshots, build a contact sheet, analyze the frames, and recreate the design system with Sonnet 5.5. One-shot animation with a design system still only reaches ~80% of the desired result.
- Key claims: Generic prompting yields interchangeable defaults ("AI slop"); a real design system tuned to your use case is the differentiator; styles.refrl.design provides copyable design markdown; skillery.dev provides starter prompts plus attribution; watchshups.com provides launch-video references but no prompts; FFmpeg (open source, 20+ years old) can screenshot a video into a contact sheet for frame analysis and style replication; a design-system one-shot typically lands ~80% of the way.
- Learner-relevant: Anchors lessons on design systems as the "look," on sourcing/extracting them (markdown libraries or video reverse-engineering), on FFmpeg as an agent-friendly video tool, and on setting realistic expectations (~80%) before the directing pass.

### step-3-direct-feedback-and-codify-the-skill

- Locator: `[[sources/video-editing/20261003/Turn Claude Into a Video Editing GENIUS (in 3 simple steps).srt#Step 3 Direct and codify]]`
- Summary: Because a design-system one-shot lands around 80%, the last 10–20% ("production-level quality") comes from directing: watch the beats and animations, then give feedback. A worked example is a clip about Claude Designs where v1 used generic line-art animations and v2 replaced them with the actual Claude Design UI after feedback. Feedback can be sent through the chat, but a review interface is easier: in the Rubric editor you click any part of the video and a comment attaches the timestamp and the exact point in the clip; you then copy all comments and send them to Claude in one go. Step 1 and Step 2 are largely automatable and can sometimes be one-shot to 80–90%; Step 3 is where iteration happens. In that same session — after the design system and all feedback have been communicated — ask Claude to build/update the `/animate` skill so the learnings are codified, and have it follow skill-creation best practices so the skill keeps improving to your taste.
- Key claims: A design-system one-shot reaches ~80%; production quality requires a directed feedback pass; the Rubric editor captures comments with timestamps and clip location; batch all comments and send at once; the session's design system and feedback should be codified into the `/animate` skill; updating the skill per skill-creation best practices polishes it over time; one person can produce quality animations this way.
- Learner-relevant: Anchors lessons on iterative directing, timestamped comment feedback, scoping batches of changes, and converting accumulated corrections into a durable skill — the end-state payoff of the three-step workflow.
