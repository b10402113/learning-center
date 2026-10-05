---
source: gpt6-astra-motion-graphics
source_lines: 986
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — gpt6-astra-motion-graphics

## Overview (L1)

- **GPT6 Astra /animate demo** — A raw single-take recording of eight Instagram Reel scripts is fed to GPT6 Astra with an `/animate` skill, which cuts clips from the long raw video, generates 3D assets, records the tool being discussed, and produces vertical videos with browser mockups and infographics.
- **Refined vs. unrefined skills** — The core argument: a skill made from a single prompt gives Astra's default aesthetic ("vibecoded slop"); refinement via reference designs, added rules, and an element library produces unique, consistently good output.
- **Three-step refinement loop** — (1) be aware of the tools, (2) review output and give structured feedback, (3) ask the agent to calibrate the skill; repeat continuously.
- **The tool stack** — AssemblyAI (transcription), Hyperframes (HTML-to-video engine), and Codex / GPT6 Astra (agent), with Whisper, ElevenLabs Scribe, and Claude Code named as alternatives.
- **Concrete feedback techniques** — Seed reference design systems from styles.refero.design, write editor-style bullet rules (hero number count-ups, shortened URLs, mobile-browser screen recordings), and build a reusable element library.

## Sections (L2)

### intro-demo-reels

- Locator: `[[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#intro-demo-reels]]`
- Summary: Opens with a raw recording of the presenter reading a script for eight Instagram reels; he asks GPT6 Astra (in the ChatGPT app) to use a new `/animate` skill to create eight vertical videos from that raw footage. Demo clips show motion graphics cutting clips out of the source video, 3D assets animating in, and a screen recording of the tool being discussed. He states the goal: teach viewers to build a customized skill that automates video production for social content, video explainers, or brand assets.
- Key claims: GPT6 Astra plus the `/animate` skill handled clipping, 3D asset creation, and screen-recording insertion automatically; the output was eight vertical reels from one raw recording.
- Learner-relevant: Concrete before/after anchor for what an agentic video pipeline can output end-to-end, and the stated use cases (reels, explainers, brand assets).

### refined-vs-unrefined-skills

- Locator: `[[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#refined-vs-unrefined-skills]]`
- Summary: Defines both skill types as taking raw footage in and producing an edited video out; the difference is output quality. An unrefined skill is created in a single prompt (the prompt asks Astra to use Hyperframes and AssemblyAI), but because it inherits Astra's defaults, everyone who uses it gets the same design aesthetic — described as "vibecoded slop." The refined path is a repeatable method to get higher-quality, fine-tuned output.
- Key claims: A single-prompt skill works immediately but looks generic; the same defaults are shared by every user who skips refinement; refinement is what produced the browser mockups, animating 3D assets, and infographics in the polished reels.
- Learner-relevant: Frames the central mental model — start from a working default skill, then improve output quality through structured refinement rather than accepting defaults.

### three-step-refinement-process

- Locator: `[[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#three-step-refinement-process]]`
- Summary: Introduces the three-step loop used every time a skill needs refining: (1) be aware of the tools, (2) review the agent's output and give structured feedback, (3) ask the agent to update/calibrate the skill. The presenter notes that with modern models like GPT6 Astra you do not need to understand the tools under the hood or know how to code — you only need to be aware of them to invoke them in the prompt.
- Key claims: Refinement is only three steps; tool awareness (not tool mastery) is sufficient for the first step; step two (feedback) is described as the most important part of the whole process.
- Learner-relevant: The skeleton workflow any later lesson can expand — awareness → feedback → calibration, repeated.

### tools-assemblyai

- Locator: `[[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#tools-assemblyai]]`
- Summary: Transcription is the first required tool so the model can understand what is happening in the raw video; for educational content "the meat of the video is really what is being said." AssemblyAI is the presenter's choice for its speed-to-cost ratio. Alternatives: Whisper (free, runs locally, but slow — estimated 15–50 minutes per hour of audio depending on CPU, versus AssemblyAI at roughly 42 seconds per hour of audio and about $0.21 per hour) and ElevenLabs' Scribe model (available if you already subscribe, but roughly 40% slower than AssemblyAI).
- Key claims: AssemblyAI transcribes an hour of audio in ~42 seconds for ~$0.21; Whisper is free but 15–50 min/hour; ElevenLabs Scribe is ~40% slower than AssemblyAI; transcription can run through AssemblyAI, Whisper, or ElevenLabs Scribe.
- Learner-relevant: Concrete provider choices, cost/latency numbers, and the rationale (transcript is the model's window into spoken content) for the first stage of the pipeline.

### tools-hyperframes

- Locator: `[[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#tools-hyperframes]]`
- Summary: Hyperframes is the animation/video engine — free and open source, described as having ~49,000 GitHub stars. It turns HTML elements (the same elements seen on websites) into video, effectively screen-recording the websites it creates. It is built specifically with agents in mind, so it supports overlaying HTML elements on top of video, running animations, color grading, and other effects.
- Key claims: Hyperframes converts HTML → video; it is agent-oriented and supports overlay, animation, and color grading; free/open-source with ~49k GitHub stars.
- Learner-relevant: The rendering engine that later lessons would target for motion output, plus the key capability list to cite when designing `/animate` skills.

### tools-agent-platforms

- Locator: `[[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#tools-agent-platforms]]`
- Summary: The third required piece is the agent/agent platform. The tutorial uses Codex because it features GPT6 Astra, which the presenter found strong for these videos; Claude Code and Fable are named as powerful alternatives. Asking the agent to create an initial `/animate` skill using the three tools gives a base to improve on.
- Key claims: Agent platform is the third tool; Codex + GPT6 Astra is the featured combo; Claude Code and Fable are viable substitutes; the first `/animate` skill is meant to be a base, not the final product.
- Learner-relevant: Portable across agent platforms — the skill is defined by tools and prompt, not locked to one vendor.

### feedback-reference-designs

- Locator: `[[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#feedback-reference-designs]]`
- Summary: Step two feedback begins with reference designs — described as the single biggest lever to move output from "vibecoded" to unique. styles.refero.design hosts 2,000+ design systems (e.g. Apple's, Figma's) that can each be copied as a Markdown file and pasted to the agent to reference. The presenter's Duolingo-style demo reel came from a design MD off styles.refero.design, and a Figma-based motion graphic demo used its animations and fonts. For real client/brand work he advises taking inspiration (fonts, color palettes) rather than replicating outright; his RoboNuggets design system (light mode) is what he ported into the reels.
- Key claims: Reference design MD files are the highest-impact feedback input; styles.refero.design has 2,000+ design systems; a Figma/Apple design MD controls animations and fonts; porting your own design system (e.g. light-mode palette) makes output on-brand.
- Learner-relevant: A directly actionable technique plus a named source of ready-to-paste design tokens for steering motion aesthetics.

### feedback-adding-rules

- Locator: `[[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#feedback-adding-rules]]`
- Summary: The second feedback technique is adding rules. In the same session where he made the first videos, the presenter wrote bullet-point feedback "as if talking to a video editor," then fed those as additional skill rules. Specific examples: when a number is mentioned always show a big hero number counting up (e.g. "four free plugins" becomes hero text); shorten the URL text in the browser mockup element (it was being truncated); and take screen recordings using a mobile browser because small text is not ideal for vertical videos viewed on phones. The general pattern: make one or two videos with the unrefined skill, review them, write editor-style feedback, then add those rules in the same session.
- Key claims: Feedback should read like notes to a human video editor; rules accumulate and change behavior (hero number count-up, URL shortening, mobile-browser capture); reviewing a small number of outputs before writing rules is the recommended pattern.
- Learner-relevant: A template for writing persistent skill rules and concrete example rules (hero count-up, URL length, mobile capture) that a lesson can reuse or adapt.

### element-library

- Locator: `[[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#element-library]]`
- Summary: The third feedback technique is building an element library — a reusable store of assets the `/animate` skill can pull from. Contents include 3D elements/graphics (made with Astra), layouts such as the browser mockup, motion elements defining how objects animate in, infographics and diagrams (useful for explainers), stored generated images, icons/logos by industry, video backgrounds, and sound effects/music. Usage is like "adding to cart": select elements, and the selection adds the specific asset path that can be included in the Hyperframes prompt. The library compounds — the more the skill is used, the more reusable assets accumulate. Starter prompts for creating these elements are included in the PDF guide.
- Key claims: An element library of reusable assets is key to consistent video production; assets are referenced by path in the prompt/command; categories are 3D graphics, layouts, motion elements, infographics/diagrams, images, icons/logos, backgrounds, SFX and music; all example elements were made with GPT6 Astra.
- Learner-relevant: The reuse/asset-management layer of the workflow, with a concrete selection-to-path mechanism a lesson can describe.

### step-three-calibrate-and-iterate

- Locator: `[[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#step-three-calibrate-and-iterate]]`
- Summary: Step three is the simplest: ask the agent to update the skill, e.g. "calibrate my /animate skill with this feedback that we just talked about in the session." A model like Astra then fixes and cleans up the skill so the next invocation is better. The presenter stresses not stopping at step three — for a skill important to you or your business, you continuously improve it by giving structured feedback every time you use it, so each review cycle raises quality and a raw video input is almost instantly assured of good output.
- Key claims: A short calibration prompt updates the skill; refinement is a continuous loop, not a one-time fix; repeated structured feedback compounds into consistently good output.
- Learner-relevant: The closing step and the habit to teach — calibration prompt phrasing plus the expectation of ongoing iteration.

### resources-recap

- Locator: `[[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#resources-recap]]`
- Summary: Recap of what was taught and available resources: a free PDF guide containing everything taught plus starter prompts for building elements, which can be read or sent to your agent; community members can grab the presenter's already-refined personal `/animate` skill including all files and components.
- Key claims: A PDF guide with starter element-creation prompts is offered; a pre-refined `/animate` skill with files/components is available to community members.
- Learner-relevant: Points to reference artifacts (guide, ready-made skill) that complement the three-step refinement process.
