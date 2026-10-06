---
source: 6-1.6 Let AI Build the Scene
source_type: text
source_lines: 306
status: absorbed
absorbed_at: 2026-10-06
created: 2026-10-06
updated: 2026-10-06
---

# Digest — 1.6 Let AI Build the Scene

## Overview (L1)

- Sixth lesson of Module 1 ("Your First Animation"); picks up the voice, checked word timings and reviewed storyboard from 1.5 and asks the AI to turn that plan into the scene — the learner does not write the code.
- The running example is the fictional meeting note "Sam will send the draft on Friday.", which becomes an action card with three fields: Action (Send the draft), Owner (Sam) and Due day (Friday), with the original wording kept visible so the viewer can verify the mapping.
- The learner's job is judgment, not coding: decide whether the picture helps someone follow the explanation, pause on the busiest beat, and keep the essential words accurate and readable.
- Corrections are located by knowing which file owns what: `04_scene/scene.js` controls drawing/layout, while `03_cues/cues.md` supplies the beat plan used to compile timings.
- Visuals should fit the teaching purpose — a simple drawn note/card for the fictional exercise, a real screen capture when teaching a specific control in an app.
- The lesson ends by keeping the clearest narrated preview and noting that a different visual style can be applied while preserving content and timing; the next lesson (1.7) does a final correction and export.

## Sections (L2)

### setup-from-plan-to-scene

- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/video.en.vtt#setup-from-plan-to-scene]]`
- Summary: Recaps that voice, word timings and a readable storyboard are ready, so the AI has what it needs to build the scene; the learner keeps the same project open and asks the AI to use that plan, keep the original note accurate, and show a preview with the approved voice playing.
- Key claims: the AI writes the scene — in the prepared workspace using reusable drawing tools, or, in a self-built workspace, scene code for the agreed setup; either way the learner can have it do the coding; the thing to learn to judge is whether the picture helps someone follow the explanation.
- Learner-relevant: frames the whole lesson's stance — witness/judge the AI's output rather than author code, with the source note kept traceable.

### scene-location-and-correction

- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/video.en.vtt#scene-location-and-correction]]`
- Summary: Teaches where the scene lives and which part controls what, so a request can name the right file: `04_scene/scene.js` controls the drawing/layout and `03_cues/cues.md` supplies the beat plan used to compile timings.
- Key claims: if text is covered, change the layout; if a highlight arrives before the voice gets there, point back to the cue timing; you do not need to memorize the JavaScript; ask the assistant to show you the relevant part and state the specific moment plus what the viewer needs to see.
- Learner-relevant: gives a durable mental model (layout file vs cue file) for phrasing precise corrections instead of vague ones.

### review-the-explanation

- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/video.en.vtt#review-the-explanation]]`
- Summary: Walks the first change from the plan — the note appears, the card comes in beside it, and the highlight follows the detail the voice is naming — then says to pause on the busiest beat and read what is on screen.
- Key claims: Sam, "send the draft" and Friday must remain accurate and visible, and the viewer should see which piece of the note became which card field; use one clear emphasis at a time; the matching picture should arrive with the phrase and stay long enough to read.
- Learner-relevant: a concrete review checklist (accuracy, one emphasis, sync with voice, readable duration) for this and later steps.

### visuals-fit-the-teaching

- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/video.en.vtt#visuals-fit-the-teaching]]`
- Summary: Matches the visual to the learner's next action: a simple drawn note or card with large enough wording suits this fictional example, whereas teaching where to click in an actual app requires a real capture of that control.
- Key claims: a clean drawn interface can explain an idea and it should be clear when that is what is being shown; use the visuals that help the lesson.
- Learner-relevant: a decision rule for choosing illustrative vs authentic captures, anchoring later design work.

### stills-preview-and-small-size-check

- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/video.en.vtt#stills-preview-and-small-size-check]]`
- Summary: Has the assistant capture stills from the important beats and inspect them for overlap, then play the scene with the voice; leave space for captions and any character before filling the frame.
- Key claims: try a smaller viewing size, because text comfortable on the monitor may be too small on a phone; check that the source and the three fields are still readable, and check captions and the character too.
- Learner-relevant: a concrete verification workflow (stills → overlap check → narrated playback → downscale test) reusable for any scene.

### restyle-and-finalize

- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/video.en.vtt#restyle-and-finalize]]`
- Summary: Once the explanation works, ask for a different style while keeping content and timing the same — this is how the reusable workspace becomes useful: the AI changes the look while the learner keeps the teaching decisions already made.
- Key claims: keep the clearest version now; the reviewed meaning and timing are preserved when trying another look; the preview then goes through a final correction and export in the next lesson (1.7).
- Learner-relevant: establishes separation of teaching content from visual style, and sets up lesson 1.7.

### images

- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/images/frame-001.jpg]]` — Title slide "The assistant does the coding" with a five-stage pipeline strip (1 VOICE · 2 WORDS · 3 STORYBOARD · 4 SCENE · 5 EXPORT) active at SCENE, and the source note "Sam will send the draft on Friday." beside its action card (Action: Send the draft; Owner: Sam; Due day: Friday), captioned "You decide whether the explanation is clear".
- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/images/frame-002.jpg]]` — Slide "Find the thing you want to change" showing a code-editor excerpt labelled "04_scene/scene.js • actual layout excerpt" (numbered JavaScript lines such as `const rows=[...]`, `rows.forEach(...)`, `text(c, Label, ...)`, `const key=currentField(T)`, `if(key) {spot(c, rowRects[key]);}`), captioned "You do not need to memorize the JavaScript".
- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/images/frame-003.jpg]]` — Slide "Name the moment and the correction" repeating the source-note/action-card diagram with "Original wording retained", captioned "Specific moment + what the viewer needs to see" and the transcript line "point it back to the cue timing"; "Open the changed preview and check the result."
- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/images/frame-004.jpg]]` — Slide "A real control needs a real capture" contrasting a browser video player showing "The real Play control" and timeline `00:00.00 / 00:27.90` ("Open the preview and press Play.") with an "Actual browser preview" panel ("Give each detail a place", SOURCE NOTE), captioned "Match the visual to the learner's next action".
- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/images/frame-005.jpg]]` — Slide "Check important beats" laying out successive storyboard stills of the SOURCE NOTE ("Sam will send the draft on Friday.", "Original wording retained"), a "CARD ENTERS" panel, ACTION and OWNER fields ("Send the draft", "Sam"), captioned "Inspect stills, then watch the scene with the voice".
- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/images/frame-006.jpg]]` — Slide "Check important beats" showing one complete frame labelled "Actual complete frame • keep the lower caption area clear" and "FICTIONAL PRACTICE / MEETING NOTE — Compare the card with the note": SOURCE NOTE beside the full ACTION CARD (Action/Owner/Due day), with the "DOUG" character line at the bottom.
- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/images/frame-007.jpg]]` — Slide "Check important beats" on "Check the same animation at a smaller size": a small browser panel with the narrated preview (timeline `18.31 / 00:27.90`, cue id `compare.recap`) and notes "Can you still read the source and the three fields? Check the captions and the character too" and "A smaller browser panel helps reveal small text. It is not a test on a physical phone."
- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/images/frame-008.jpg]]` — Slide "Keep the explanation; change the look" showing the unchanged source note and action card, captioned "Modern treatment • identical source and timing" / "The content, timings and teaching decisions stay in place".
- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/images/frame-009.jpg]]` — Slide "Keep the explanation; change the look" showing the same source note and action card under a second styling, captioned "Blueprint treatment • identical source and timing" / "The content, timings and teaching decisions stay in place".
- Locator: `[[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/images/frame-010.jpg]]` — Closing slide "Keep the clearest version" with the source note and action card, captioned "NEXT: 1.7 • one useful correction, then export" and "Continue with meeting-note-explainer".
