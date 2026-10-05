---
source: opus-5-5-video-editing-guide
source_lines: 906
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — opus-5-5-video-editing-guide

## Overview (L1)

- Under the hood: code-based AI video — Opus 5.5 (Claude) produces motion graphics by writing HTML/CSS/JavaScript (plus three.js and FFmpeg), not by using a generative AI video model; assets are workspace images placed at exact positions/timestamps by code.
- Config & output format: a single `agents.md` replaces keeping `Claude.md` and `agents.md` in sync; ask for assets in SVG (scalable vector graphics) so icons stay crisp and remain editable/animatable.
- Level 1 — one-shot prompting: a single prompt yields a decent showreel; useful for probing a model's ceiling and building a portfolio, but rarely production quality.
- Level 2 — storyboarding: have Claude generate screenshots plus animation descriptions first, then give per-frame comments (with timestamp + click point) before spending tokens on the full render.
- Level 3 — directing the final video: review the rendered video (including audio) in a rubric editor at up to 2x speed, attach timestamped comments back to Claude, iterate, then render.
- Differentiation: with one-shot showreels commoditized, the edge is your own taste plus the operating system/toolkit you use to feed feedback to the model; one person plus Opus 5.5 can now ship a whole motion-graphics video.

## Sections (L2)

### under-the-hood-code-based-video

- Locator: `[[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#under-the-hood-code-based-video]]`
- Summary: Explains that the demo motion-graphics videos were made by giving Opus 5.5 access to the presenter's workspace and sending a single prompt ("make a dynamic motion graphics video that showcases its capabilities"), with no generative AI video model involved. Every movement, text element, and graphic is created using code; individual on-screen elements are just images in the workspace that Claude points to and positions with JavaScript at an exact position and timestamp.
- Key claims: All motion, text, and transitions are code-generated, not generative-video-model output; Opus 5.5 used its native knowledge of HTML, CSS, and JavaScript plus libraries `three.js` (transcribed "3.js") and `FFmpeg`; the test deliberately did NOT use `Hyperframes` or `Remotion` (popular open-source Claude video-editing libraries), showing how capable native Opus 5.5 has become; a ~300,000-view real launch video was also edited with Opus 5.5.
- Learner-relevant: Anchors the whole subject — "AI video editing" here means agent-writes-code, so lessons build on HTML/CSS/JS/three.js/FFmpeg as the render stack rather than text-to-video models.

### agents-md-single-instructions-file

- Locator: `[[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#agents-md-single-instructions-file]]`
- Summary: Notes an Anthropic-published official comprehensive guide on how to prompt Opus 5.5, and highlights that you can now keep one `agents.md` as your single instructions file instead of keeping `Claude.md` and `agents.md` in sync.
- Key claims: `agents.md` is the single source of instructions; the older pattern required syncing `Claude.md` and `agents.md`.
- Learner-relevant: Supports any lesson on configuring an agent workspace/instructions file for repeatable video-editing runs.

### svg-output-format

- Locator: `[[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#svg-output-format]]`
- Summary: Recommends asking the model for graphics in SVG format (scalable vector graphics) so they scale to any size without going blurry. SVG files can be opened and recolored by hand, and Claude can animate them, so every graphic returned is editable and animatable.
- Key claims: Request SVG for icons/graphics; SVG is resolution-independent (no blur when scaled); SVGs are hand-editable (change color) and animatable by Claude.
- Learner-relevant: A concrete prompt/format parameter for lessons on producing reusable, editable motion-graphics assets.

### level-one-one-shot-prompting

- Locator: `[[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#level-one-one-shot-prompting]]`
- Summary: Level one is sending a single prompt and getting a good result — the most basic level. The presenter argues it is still worth doing because it reveals a model's capability ceiling (a "ceiling prompt" can be repeated when a new model releases) and quickly produces showcase reels for a portfolio. However, production-level quality generally will not come from one shot. A free nine-page PDF of starter prompts (including the one-shot demo-reel prompts) is offered.
- Key claims: One-shot prompting defines Level 1; use a fixed high-ceiling prompt to benchmark new model releases; one-shot reels are good for portfolios but not production quality; knowing Claude Code puts you in a very small fraction of the population able to exploit this.
- Learner-relevant: Establishes the baseline technique and the benchmarking habit; gives a prompt-library concept a lesson can reuse.

### level-two-storyboarding

- Locator: `[[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#level-two-storyboarding]]`
- Summary: Level two moves from one-shot prompting to storyboarding. Claude generates a first pass of the HTML elements and, instead of animating/rendering immediately, produces screenshots of the scenes plus written descriptions of the animations it intends to perform (e.g. "the camera whips to the first panel, it then continues across the panels"). Because the storyboard is cheap and fast, you can preview and steer before the model burns tokens on the wrong full render.
- Key claims: Two requirements for effective storyboarding — (1) request screenshots/images of the planned animations plus scene descriptions, (2) a feedback mechanism; feedback in the visual context of the frame is more effective than chat; per-frame comments carry the exact timestamp and the exact point clicked in the frame, which Claude receives and can act on; workflow: review the whole storyboard, add comments, copy all comments, paste to Claude, then request another storyboard or go straight to video depending on how close it is.
- Learner-relevant: The core iterative-preview technique for production quality; teaches a concrete comment-with-timestamp workflow and why storyboards reduce wasted render spend.

### level-three-directing-final-video

- Locator: `[[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#level-three-directing-final-video]]`
- Summary: Level three is directing based on the already-rendered video. Feedback on a storyboard typically gets you ~80–90% to the final polished output; directing on the actual video closes the gap. Directing is fundamentally giving feedback to the final video — via chat in natural language or, preferably, an interface/operating system for reviewing. A "rubric editor" lets you play the video, comment per frame, and also give feedback on the audio/sound effects (which the storyboard stage cannot show), all with timestamps that identify the exact graphic referenced.
- Key claims: Storyboard-to-video usually reaches ~80–90% of desired quality; Level 3 requires reviewing and directing the final video; the rubric editor supports per-frame comments + audio/sound-effect feedback + timestamped comments; workflow: make many comments across all clips, copy them, send to Claude, wait for the rubric editor to update, then ask it to render the final video; on a real video the presenter asked Claude to identify the takes to keep from raw footage and gave a comment (with the Claude platform documentation link) to focus on a page title, which produced the desired animation; Opus needs progressively fewer comments because its one-shot animations are so good.
- Learner-relevant: The highest-leverage skill — a concrete review/direct/render loop, including audio review and timestamped visual feedback, that a lesson can formalize as a checklist.

### taste-and-workflow-differentiator

- Locator: `[[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#taste-and-workflow-differentiator]]`
- Summary: Concludes that a lot of human review remains, which is appropriate: once everyone can one-cut showreels, the real differentiators are your own taste and the operating system you use to give feedback to your AI models. Even with storyboarding and directing done by one person, lead time has shrunk so much that a single person plus Opus 5.5 can produce an entire motion-graphics video.
- Key claims: Taste + feedback operating system are the durable edge; human review remains essential; one person + Opus 5.5 can now ship full motion-graphics videos; starter prompts are collected in a nine-page PDF sent to the agent.
- Learner-relevant: Motivates the subject's direction — invest in taste and tooling/feedback loops, not just prompt wording.
