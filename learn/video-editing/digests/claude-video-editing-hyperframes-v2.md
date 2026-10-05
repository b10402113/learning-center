---
source: claude-video-editing-hyperframes-v2
source_lines: 1406
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — claude-video-editing-hyperframes-v2

## Overview (L1)

- **Intro & what HyperFrames is** — HyperFrames is an open-source, free video editing tool by HeyGen that generates videos entirely from HTML code. Recent updates add subtitles, floating card animations, smooth animations, 3D assets, and motion graphics; an agent (Claude Code, Hermes, OpenClaude) does the heavy lifting so you never read the code. Shipped integrations include a Hermes agent build and the hyperframes.dev community site. Common use cases: podcast intros and one-shot promotional announcement videos.
- **HyperFrames Helper skill** — A downloadable `SKILL.md` text file (a long system prompt) given to the agent. It teaches the agent how to install HyperFrames, create storyboards, compose videos, and render them, producing good quality from the start. Install it once and the agent understands the underlying tools.
- **Three levels of video automation** — Level 1: website-to-video (easiest, one-shot). Level 2: use storyboards to control and align output before rendering. Level 3: the BIT framework (Build, Integrate, Tune) to automate quality and continuously train the agent's taste.
- **Level 1 — website-to-video** — Give HyperFrames a website URL and a target duration; the agent scrapes text, images, and screenshots, extracts brand/design palettes, downloads assets, and renders a video. Great as a draft, but one-shot output has layout flaws (squeezed text, wrong sizing).
- **HTML component inspiration (21st.dev)** — Because HyperFrames renders HTML, components originally built for websites can be borrowed as animation styles. Copy a component's prompt from 21st.dev, paste it to the agent, and it adapts the animation into a customized video segment.
- **Level 2 — storyboards** — Before rendering, the agent produces a one-page HTML storyboard: video description, scene count, total duration, per-scene breakdown by seconds, mock-ups, and copy. Reviewing it costs no render and few tokens, and lets you give feedback so the agent aligns with your intent.
- **BIT framework** — Build (ship v1 while guiding toward "what good looks like"), Integrate (turn the session's guidance into a reusable skill), Tune (keep refining each run to train the agent toward desired quality).
- **Level 3 — the full cut→storyboard→graphics workflow** — A three-step pipeline demonstrated on raw talking-head footage: (1) have Claude Code cut silences/pauses/mistakes with FFmpeg and transcribe word-level timestamps with Fast Whisper, producing a side-by-side script audit page; (2) storyboard the title cards; (3) apply slide-card motion graphics in HyperFrames Studio.
- **Storyboarding title cards** — A precise prompt describing a two-part layout (full-bleed part one with subtitles and sample cards at 80% opacity; part two collapsing to a vertical rounded rectangle bottom-right with placeholder boxes) using the RoboLabs design system, then iterated with beat-by-beat card rules.
- **HyperFrames Studio & motion graphics** — Studio is a localhost timeline UI from Claude Code for previewing/editing clips before final render. Motion graphics (shader globe, wireframe globe) are borrowed from 21st.dev; a 3D Claude logo is made via green-screen image generation (NanoBanana2) plus animation (Kling3.0) and HyperFrames color keying.
- **Integrate & Tune — capturing learnings** — Turn a finished session into an updated skill so the agent remembers "what good looks like." The author uses a `Calibrate` skill that runs end-of-session self-analysis and returns bullet-point recommendations (e.g. six) to refine the skill and memory.

## Sections (L2)

### intro-what-is-hyperframes

- Locator: `[[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#intro-what-is-hyperframes]]`
- Summary: Frames HyperFrames as an open-source video editing tool by HeyGen whose "V2" updates add subtitles, floating card animations, auto smooth animations, 3D assets, and motion graphics. Positions agentic coding tools (Claude Code and others) as the interface, so the user never edits code.
- Key claims: HyperFrames is free and open source; it generates videos from code; recent updates include Hermes agent support and the hyperframes.dev community website; high-value use cases are podcast intros and one-shot promotional announcement videos; text, copy, and animation speed are all controlled by talking to Claude Code.
- Learner-relevant: Establishes the tool's identity, its ownership (HeyGen), the fact it renders HTML, and the agent-driven interaction model that every later section depends on.

### hyperframes-helper-skill

- Locator: `[[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#hyperframes-helper-skill]]`
- Summary: Introduces the downloadable "HyperFrames Helper" skill — a `SKILL.md` markdown file acting as a long system prompt — that equips an agent (Claude Code, Hermes, OpenClaude) with the knowledge to install HyperFrames and use it well.
- Key claims: The skill file is essentially a long system prompt; it tells the agent how to create storyboards, compose videos, and render them; it also teaches the agent to use the underlying tools (FFmpeg, Fast Whisper) without the user mastering them; the goal is good quality "right from the onset."
- Learner-relevant: This is the one-time setup artifact a learner needs before any demo — installing the skill is the prerequisite for every prompt shown.

### three-levels-of-video-automation

- Locator: `[[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#three-levels-of-video-automation]]`
- Summary: Defines a three-level ladder for automating video: Level 1 website-to-video (easiest, one-shot), Level 2 storyboard-guided control, Level 3 the BIT framework for automating quality.
- Key claims: Level 1 takes a website and returns a video with minimal effort; Level 2 introduces storyboards because one-shot is "not the best method" when pushing quality; Level 3 (BIT) is needed for complex motion-graphics work that is hard to get from one prompt.
- Learner-relevant: Gives the learner the course's overall scaffolding — later sections are the levels in order, and each level trades effort for output quality.

### level1-website-to-video

- Locator: `[[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#level1-website-to-video]]`
- Summary: Demonstrates the newly released website-to-video feature using a member's portfolio site (boovendren.com). A single prompt — "use HyperFrame's website to video to turn this into a 10-second video" — produces a 10-second video.
- Key claims: The catalog in the docs contains pre-built cards and animations (e.g. a TikTok follow animation) that can be copied as prompts to the agent; website-to-video scrapes text, details, and photos, takes a screenshot, extracts brand/design palettes, and downloads assets to assemble the video; the resulting one-shot output rendered appropriate text and the logo but had squeezed text and sizing the user would normally guide (centering, larger text); it is best treated as a draft or basis for a final product.
- Learner-relevant: Provides a concrete, citable one-shot workflow and prompt, plus an honest list of its failure modes — the motivation for Level 2.

### html-component-inspiration-21st-dev

- Locator: `[[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#html-component-inspiration-21st-dev]]`
- Summary: A trick to raise HyperFrames output quality: borrow animation styles from existing HTML components on 21st.dev, since HyperFrames renders HTML written by the agent.
- Key claims: HyperFrames "just operates from within HTML code" and renders code the agent writes into video; 21st.dev hosts many components originally meant for websites (e.g. an iPhone mobile-app view with smooth scroll animations); the workflow is to open a component, copy its prompt, paste it into the Claude Code session with a request like "can you do something like this," and get a customized version.
- Learner-relevant: Teaches a reusable sourcing method (21st.dev → prompt → agent) that recurs for the wireframe globe and shader later, directly linking web component libraries to video motion.

### level2-storyboards

- Locator: `[[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#level2-storyboards]]`
- Summary: Introduces storyboards as the Level 2 control mechanism. Using the more complex wireframe dotted globe task, the agent (following the helper skill) recommends a storyboard before rendering.
- Key claims: The agent rendered a webpage storyboard describing what the video is about, the number of scenes, total seconds, and a per-part breakdown by seconds across a 12-second count; it includes globe mock-ups and the actual copy so the learner can request wording or font changes per scene (e.g. scene 1 wording, scene 2 moves globe right with "one agent for every region" on the left, scene 3 closes with a translucent rectangle reading "the world is the workspace"); storyboarding costs no render and few tokens and aligns the agent to intent; the final render matched the storyboard, including the wireframe globe.
- Learner-relevant: Gives the learner a concrete approval checkpoint and the exact storyboard contents to review (scenes, timing, copy, mock-ups) before any render spend.

### bit-framework

- Locator: `[[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#bit-framework]]`
- Summary: Presents the BIT framework — Build, Integrate, Tune — the internal framework for producing complex motion-graphics videos that are hard to one-shot.
- Key claims: Build = "build with your agent and ship the first version of that video by guiding it towards what good looks like"; Integrate = "making everything you did in that session to guide it into a skill" so the next run already knows good and has the aligned taste; Tune = continuously refine the same workflow/video so the agent is slowly trained toward desired quality.
- Learner-relevant: This is the course's core mental model — a three-phase loop the learner applies to any recurring video task, not just the demo.

### level3-cut-raw-footage-ffmpeg-whisper

- Locator: `[[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#level3-cut-raw-footage-ffmpeg-whisper]]`
- Summary: Step 1 of the Level 3 demo: cutting 76 seconds of raw talking-head footage (with pauses, mistakes, silences) down to a ~30-second clean cut ready for HyperFrames.
- Key claims: The prompt gives the raw file path and says "edit my raw recording into a clean final cut ready for hyperframes," instructs "cut all the silences and the dead air out," transcribes the audio to word-level timestamps, applies a "last take rule" (if a phrase is said twice, keep the second), and builds an HTML page showing the current script vs the proposed clean script side-by-side (with mistakes crossed out and kept parts marked); the underlying tooling is FFmpeg (free, open source, auto-cuts video) and Fast Whisper (free transcription); the side-by-side page is a valuable double-check for long (e.g. hour-long) footage before final render.
- Learner-relevant: Supplies a concrete editing prompt, the exact rules (silence removal, last-take), the audit-page deliverable, and the underlying tools (FFmpeg + Fast Whisper) that a lesson can name and cite.

### level3-storyboard-title-cards

- Locator: `[[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#level3-storyboard-title-cards]]`
- Summary: Step 2 of the Level 3 demo: storyboarding the title cards and floating-card layout before animating the final media. Shows the initial prompt, the first storyboard, and iterative feedback.
- Key claims: The prompt asks for a one-page HTML storyboard visually showing the plan; part one keeps the video full-bleed (full screen) with subtitles and sample cards on the right at ~80% opacity; part two transitions the video into a vertical rounded rectangle at the bottom right while the center stage is filled with placeholder boxes to be added later; fonts/colors use the RoboLabs design system (understood from the agent's memory of the author); follow-up feedback specified "only one card animating per beat" where each card enters, holds while the line is spoken, then exits before the next enters; cards should be "more liquid glassy" in style, include relevant logos, and card text repeats the spoken words word-for-word in two-to-six-ish-word phrases; the agent failed to grab the Claude Code logo until given the local file path, and was told to "up the ante" on animations (it added an agent-logo animation unprompted).
- Learner-relevant: Preserves exact layout parameters (full-bleed, 80% opacity, vertical rounded rectangle bottom-right, placeholders), the beat-based card rule, the liquid-glassy style, the 2–6 word copy rule, and the design-system hook — all directly teachable parameters.

### hyperframes-studio-applying-motion-graphics

- Locator: `[[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#hyperframes-studio-applying-motion-graphics]]`
- Summary: Step 3 of the Level 3 demo: opening HyperFrames Studio and applying the slide-card motion graphics (and subtitles) to the cut video for preview before final render.
- Key claims: HyperFrames Studio is a built-in interface that Claude Code serves on localhost; it presents a timeline view where the user can edit the video or clips directly; it lets you preview card animations and subtitles to confirm they applied correctly before rendering; the prompt was to "open the hyperframes studio and apply those slide card motion graphics to our cut video"; the part-two transition into the motion-graphics section blended well.
- Learner-relevant: Names HyperFrames Studio, its localhost timeline UI, and its role as the review/edit surface — the human checkpoint between storyboard and final render.

### motion-graphics-from-21st-dev-and-3d-logo

- Locator: `[[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#motion-graphics-from-21st-dev-and-3d-logo]]`
- Summary: How the part-two motion graphics were sourced and inserted: shader and wireframe globe borrowed from 21st.dev, plus a rotating 3D Claude Code logo created with image generation and animation.
- Key claims: The shader and the world wireframe globe are assets from 21st.dev — find the component, copy the prompt, send it to Claude Code, and name which part of the timeline it applies to (here part 1 → part 2); the wireframe globe was told to move left with text added; HyperFrames can apply color keying (removing a video's green-screen background); the 3D logo was made by generating an image of the Claude logo on a green-screen background with NanoBanana2 and animating it into a rotating 3D logo with Kling3.0 (transcribed "Cling3.0"), then placed with color keying; agent icons and other assets were supplied locally (SVG icons).
- Learner-relevant: Captures concrete model/tool names (NanoBanana2, Kling3.0) and the color-keying capability, plus the repeatable "find → copy prompt → paste with target section" asset workflow.

### iteration-and-final-render-choice

- Locator: `[[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#iteration-and-final-render-choice]]`
- Summary: Pushes the composition further with a varied card arrangement, then simplifies to the final chosen intro, illustrating cheap iteration on the HyperFrames timeline.
- Key claims: An iteration placed two cards on the left and one on the right across three beats; the final version asked Claude to remove the cards, go from full screen to slightly zoomed in, and render the text without cards; the author chose the cleaner no-card version as the intro; this shows the agent produces usable structure but needs heavy guidance, and that "you can't really get quality output from just one-shot prompts," though it is still faster than manual cutting in After Effects.
- Learner-relevant: Teaches iteration economics — targeted small changes (remove cards, zoom, re-render text) are cheap and how the final creative call is made.

### integrate-tune-calibrate-skill

- Locator: `[[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#integrate-tune-calibrate-skill]]`
- Summary: The Integrate and Tune phases in practice: capture the session's learnings into the helper skill so the agent remembers quality, and use a `Calibrate` skill for repeatable end-of-session self-improvement.
- Key claims: In the same editing session you can prompt "capture all of the learnings in this session and update the HyperFrames helper skill based on my feedback to you and all the best practices that you captured based on our conversation"; the author instead invokes a dedicated `Calibrate` skill that runs self-analysis and returns bullet-point recommendations on how to calibrate skills and memory; the example returned six recommendations for review or automatic application, fine-tuning the skill to your needs over time.
- Learner-relevant: Closes the BIT loop with a concrete prompt and a reusable `Calibrate` skill pattern, showing how one session's taste becomes the next session's default.
