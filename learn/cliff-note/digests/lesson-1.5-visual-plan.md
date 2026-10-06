---
source: 5-1.5 Turn the Voice into a Visual Plan
source_type: text
source_lines: 390
status: absorbed
absorbed_at: 2026-10-06
created: 2026-10-06
updated: 2026-10-06
---

# Digest — 1.5 Turn the Voice into a Visual Plan

## Overview (L1)

- After the voice take is chosen (lesson 1.4), this stage uses it to decide **when each picture changes** — the "words and storyboard" part of the process first shown in 1.2.
- The AI produces the timings and drafts the visual plan; the learner's job is to **inspect a small piece** of what those files actually do rather than trust them blindly.
- The stage has two artifacts: a **readable transcript + timed-word file** (from the approved audio) and a **storyboard/cues plan** that connects each spoken phrase to a picture.
- Two risks to check: a **wrong word** in the transcript becomes a wrong caption, and a **misplaced timing** makes a highlight arrive early.
- The lesson's quality test is simple: **follow the voice while reading the plan and ask whether the picture answers what is being heard**.
- A take change invalidates the timings, because **different pauses move the pictures** — so timings must be rechecked.

## Sections (L2)

### stage-overview

- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/video.en.vtt#stage-overview]]`
- Summary: Frames the lesson — with the voice take chosen, use it to decide when each picture changes; this is the words-and-storyboard step seen in 1.2, where the AI makes the timings and draft plan and the learner inspects a sample.
- Key claims: The AI can produce the timings and draft the visual plan; you inspect a small piece to see what the files actually do; the check is whether each picture helps explain the phrase.
- Learner-relevant: Sets the mental model that the visual plan is a reviewable text artifact, not a black box — the anchor for all later checks.

### transcription-setup

- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/video.en.vtt#transcription-setup]]`
- Summary: Have the AI check the project's transcription tool first. The prepared workspace's silent setup does not install that optional part, so ask it to follow the transcription instructions and explain any additional installation or model download, including a model that fits the learner's computer.
- Key claims: Transcription tools are separate from the base workspace setup; the assistant should explain extra requirements before running them; a fitting model depends on the machine.
- Learner-relevant: Prevents a silent failure later — the learner knows to surface optional installs/models before transcribing.

### transcribe-and-verify

- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/video.en.vtt#transcribe-and-verify]]`
- Summary: Run the transcribe command on the approved audio to make a readable transcript alongside a file of times. Play the phrase that names Sam and Friday and compare what is heard with the transcript; check other parts the tool flags as uncertain. Listen to the actual recording to judge whether the AI's correction is right.
- Key claims: A wrong name becomes a wrong caption; a phrase placed at the wrong time makes a highlight arrive early; you play the audio to decide if the correction is right.
- Learner-relevant: Defines the two failure modes (text accuracy vs. time accuracy) and the verification move for each.

### storyboard-plan

- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/video.en.vtt#storyboard-plan]]`
- Summary: Ask for a storyboard using that transcript and the brief, giving each spoken phrase a visual job: show the note when the voice introduces it; bring in the card and highlight the matching detail as it names the action, owner and due day; keep source and card visible together for the comparison. Have the assistant write the plan before it builds the scene.
- Key claims: The plan is a text file (cues) where each beat names spoken words, what should appear, and what the viewer should notice; the proposed video can be read as a short list and it is still cheap to move or remove a beat.
- Learner-relevant: Shows the concrete beat structure (words → what appears → what to notice) and why front-loading the plan is cheap.

### storyboard-check

- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/video.en.vtt#storyboard-check]]`
- Summary: Follow the voice while reading the plan and ask whether the picture answers the thing being heard. If the narrator names Friday while the plan shows a decorative folder animation, change that beat — tell the AI to show the due day at that phrase and give the viewer enough time to read it.
- Key claims: A decorative beat that misses the spoken point needs a clearer job; important text needs enough time to be read.
- Learner-relevant: Gives a concrete review heuristic (picture answers the phrase) plus a worked mismatch to recognize.

### compile-and-save-cues

- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/video.en.vtt#compile-and-save-cues]]`
- Summary: Have the assistant match the approved phrases to the word timings and check the resulting cue times (the cues command does this in the prepared workspace). Those times come from the actual recording, so no guessing where a sentence lands. Save the checked timings and visual plan beside the voice; if the take later changes, recheck the timings because a different pause can move the pictures. Next lesson turns the plan into the animation.
- Key claims: Cue times are derived from the actual recording rather than typed by hand; changed takes require rechecking; the plan is the direct input to the next lesson's scene build.
- Learner-relevant: Closes the loop from script → timings → plan, and flags the rework trigger (take change) that must be defended.

### images

- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/images/frame-001.jpg]]` — Diagram of the two pipeline stages this lesson produces: stage "02 / WORDS" turns the actual recording into times (`transcript.md`, `words.json`) and stage "03 / CUES" maps phrase → visual job and holds compiled cue times (`cues.md`).
- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/images/frame-002.jpg]]` — Browser view on "STAGE 1 / VOICE": plays the actual local take `01_voice/voice.mp3` (player 0:00/0:27) beside `transcript.md`, with the instruction "Compare the saved transcript with what you hear"; the transcript reads "Here's our meeting note: Sam will send the draft on Friday…".
- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/images/frame-003.jpg]]` — Shows `timing-review.md`, "One actual transcription correction": a concrete ASR flag where an extra token ("Her") was appended after the final "check" and a token was removed as a transcription artifact; notes it is an agent/model-assisted review, not human listening, and that checked word timings are ready.
- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/images/frame-004.jpg]]` — "TWO THINGS TO CHECK" card split into TEXT (names and facts — "a wrong word can become a caption") and TIME (when the word lands — "a misplaced interval moves the highlight").
- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/images/frame-005.jpg]]` — `timings-excerpt.json` excerpt showing measured word objects (`{"text":"Sam","start":1.6,"end":1.74}`, `{"text":"will",…}`) paired with a readable table (Sam/Friday with START 1.60s/2.66s, END 1.74s/3.00s); captioned as word timings from the actual recording, example-audio seconds.
- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/images/frame-006.jpg]]` — "Hear the source phrase": the voice player on `01_voice/voice.mp3` (0:00/0:27) next to the saved transcript, demonstrating playing the actual take to hear the phrase before trusting the text.
- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/images/frame-007.jpg]]` — `storyboard-request.md`, an authored request the agent applies (not chat): read the brief/source/checked transcript, give each spoken phrase a visual job, show the source note, build the three-field card, leave both visible for the final comparison, write the storyboard first, then compile phrases against measured word timings, and do not invent timing or a calendar date.
- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/images/frame-008.jpg]]` — "HYPOTHETICAL MISMATCH" card contrasting VOICE SAYS ("Friday" → show the due day) against PLAN SHOULD ANSWER ("What is due when?", keep Friday readable, skip unrelated decoration).
- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/images/frame-009.jpg]]` — Side-by-side `cues-before.md` vs the corrected `cues.md`: both carry the cue `## due "the due day is"` → "Reveal Due day: Friday. Highlight that field. Do not invent a date"; the clarification makes the visual job explicit so the highlight stays available for the final source comparison, with same audio and cue times.
- Locator: `[[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/images/frame-010.jpg]]` — Closing card: "IF THE VOICE CHANGES / TAKE CHANGES" → a new voice brings different pauses, so recheck word timing; NEXT STEP is to recompile cues and then inspect the scene.
