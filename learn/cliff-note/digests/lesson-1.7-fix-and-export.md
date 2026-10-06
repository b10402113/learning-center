---
source: 7-1.7 Fix What You See, Then Export
source_type: text
source_lines: 302
status: absorbed
absorbed_at: 2026-10-06
created: 2026-10-06
updated: 2026-10-06
---

# Digest — 1.7 Fix What You See, Then Export

## Overview (L1)

- Closes the first project by treating the narrated preview as a learner-facing review: watch it through once, find the first moment the viewer loses the thread, and give the AI one concrete correction.
- Models the correction loop on the fictional Sam/meeting-note example: pair the source note with its matching action-card field during the spoken recap and keep the footer text clear of the character.
- Verifies the fix twice — a still reveals overlap/readability, playback reveals whether the picture arrives with the words and lasts long enough, and it must be checked from the previous beat into the changed one.
- Explains the export machinery: a prepared workspace draws the browser scene at each video time and combines those frames with the audio, so the scene must reproduce the same picture at the same time every run.
- Insists on a small test export before the full render, then checking the actual MP4 in a player (picture + voice together, correction present, no missing sentence end), and reconciling any preview/export divergence at the first differing moment.
- Closes the five-stage loop (Voice → Words → Storyboard → Scene → Export): the AI did most of the production while the learner directed a correction and checked the result; keep the reviewed export plus a short change note for the next project.

## Sections (L2)

### watch-the-preview

- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/video.en.vtt#watch-the-preview]]`
- Summary: With the narrated preview built, the learner reviews it as a viewer before exporting — playing it end to end and noting the first place comprehension breaks.
- Key claims: Let the preview play all the way through once; write down where you lose the explanation or cannot read something the voice asks you to notice; that first break gives the AI one clear correction; the HTML frames this as "open the narrated preview from 1.6 and watch it all the way through."
- Learner-relevant: The core review habit of the course — judge the artifact as the audience would, and convert the felt problem into one actionable correction.

### give-one-correction

- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/video.en.vtt#give-one-correction]]`
- Summary: Shows what a useful correction looks like using the fictional Sam example, and the HTML blockquote gives the exact prompt skeleton for requesting it.
- Key claims: A useful request names the beat and the viewer's need; the example fix is keeping the note beside the card longer during the comparison, because that is the moment someone needs both; in the Sam example the scene review led to paired highlights on source and card plus moving footer text clear of the character; point to the beat, explain what the viewer needs, and have the AI change the relevant file and reopen the preview; keep the approved voice and source facts.
- Learner-relevant: Teaches the correction request format (beat + viewer need + specific change + preserve approved elements) that transfers to any project.

### check-fix-in-context

- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/video.en.vtt#check-fix-in-context]]`
- Summary: The two-part verification of a correction: read the changed still, then play from the previous beat into the changed one, using the actual preview (not a verbal claim) to decide whether the fix helped.
- Key claims: A still helps you read the text and spot overlap; the moving preview tells you whether the picture arrives with the words and stays long enough; check the changed moment, then play into it from the previous beat; check action, Sam and Friday against the note; ask the assistant to make those checks too and use the real preview to judge.
- Learner-relevant: Establishes still-vs-playback as complementary checks and grounds "did the fix work?" in the rendered artifact.

### export-explained-and-test

- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/video.en.vtt#export-explained-and-test]]`
- Summary: Once happy with the preview, ask the AI to explain this workspace's export step and run a small test before the full export; the segment explains how the prepared exporter works.
- Key claims: The prepared workspace draws the browser scene at each point in the video and combines those frames with the audio; that is why the scene must reproduce the same picture at the same time every run; the assistant can write or run the exporter; on Windows the render command runs from the workspace root via the Python environment checked in 1.3 (macOS/Linux use that environment's Python with the same anim.py render arguments); this produces the main MP4 and a smaller copy; a folder structure alone does not supply an exporter — it must demonstrate a playable result; if a feature depends on a live click or wall-clock timer, ask how it will behave during export; use its tested export method if you built your own setup.
- Learner-relevant: Gives the learner a mental model of frame-by-frame deterministic export and the review gate (small test first), plus the portability caveat for custom setups.

### save-the-command

- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/video.en.vtt#save-the-command]]`
- Summary: The working export invocation must be recorded; the prepared package follows a render command already in the project, and a self-built setup must prove it produces a playable file.
- Key claims: With the prepared package the assistant follows the render command already in the project; if building your own version, it must show the exporter actually produces a playable file; have it save the command and any settings needed to reproduce the render; the saved recipe is `python anim.py render meeting-note-explainer --phone --workers 1` (this production used a local wrapper around the unchanged package command to limit FFmpeg threads to two, with the full command and output saved in `learner-workspace/evidence/18-render.txt`); the sample test came out at 27.900 s, 1920×1080 at 30 fps, 837 frames rendered, settings `--phone --workers 1`.
- Learner-relevant: Makes the export reproducible: record the exact command + resource settings, not just the output.

### check-exported-file

- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/video.en.vtt#check-exported-file]]`
- Summary: Open the exported test file in a video player and check it, because that file is what another person will watch; then, if it differs from the browser preview, report the first divergence and investigate before the full export.
- Key claims: Open the exported test file in a player and check it — that is the file another person watches; you want picture and voice together, the correction still in place, and no missing end to the sentence; if it differs from the browser preview, tell the AI the first point where they diverge and let it investigate that specific difference; check a short corrected test before another full render; the exported filenames are `05_render/meeting-note-explainer.mp4` (audio peak -1.0 dB) and `05_render/meeting-note-explainer-720p.mp4` (1 MiB).
- Learner-relevant: Establishes the exported MP4 (not the browser preview) as the source of truth and a divergence-triage habit.

### final-review-and-recap

- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/video.en.vtt#final-review-and-recap]]`
- Summary: Make the full export and watch the whole MP4, then keep it with a short change note; the lesson recaps the five stages and points to the next project.
- Key claims: Watch the entire MP4 including the end; for the meeting-note example check the source stays accurate, each detail is explained, and the final comparison has time to land; keep the reviewed export in the project's render folder (`05_render`) with a short note about the fix; the saved note records: connect source and card during the spoken recap, move small footer labels clear of the character, preserve source/narration/measured timings, both main and 720p exports decoded without errors, and the main MP4 played to 27.900 s without a media error; you have followed one idea through the same five stages as the overview — the AI did most of the production and you directed a correction and checked the result; next, keep the useful parts of the workspace and use it for an idea of your own (1.8).
- Learner-relevant: Defines "done" for the first project (the actual file plays correctly and you can explain what your review improved) and hands off to applying the workflow to the learner's own idea.

### images

- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-001.jpg]]` — Title frame: stage-progress strip (1 Voice, 2 Words, 3 Storyboard, 4 Scene, 5 Export) over the "actual browser preview" caption; the fictional meeting-note scene shows a SOURCE NOTE reading "Sam will send the draft on Friday. / Original wording retained" and a Doug character bubble "Here's our meeting note"; bottom cue "Review the full preview; name the moment that needs work".
- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-002.jpg]]` — "Give AI one useful correction" BEFORE state: SOURCE NOTE on the left (Sam will / send the draft / on Friday) beside an ACTION CARD on the right (Action: Send the draft; Owner: Sam; Due day: Friday); caption "Actual BEFORE • the card field is highlighted alone"; cue "A useful request names the beat and the viewer's need".
- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-003.jpg]]` — Correction spec, two columns: "OUR ACTUAL CORRECTION — Connect each field to its source / During the recap, mark the source phrase and its matching card field" and "KEEP IN PLACE — The same information and timing / Keep Sam, send the draft and Friday. Reopen the comparison beat."
- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-004.jpg]]` — "Check the correction in context" side-by-side at "the same 18.6-second moment": BEFORE • card only vs AFTER • source and field linked (source note shown with the action card in both), demonstrating that a still exposes overlap and readability.
- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-005.jpg]]` — "Actual reopened browser preview at the comparison beat": fictional meeting-note frame with SOURCE NOTE "Sam will ..... send the draft on Friday. / Original wording retained", a Doug subtitle "Sam, send the draft", a player timeline "00:18.31 / 08:27.90", and the ACTION CARD fields on the right; cue "Check the changed moment, then play into it".
- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-006.jpg]]` — "Make a small export first": saved export-notes panel for "our 27.9-second test" — Project: meeting-note-explainer; Main output: 05_render/meeting-note-explainer.mp4; Smaller copy: 05_render/meeting-note-explainer-720p.mp4; Actual duration: 27.900 seconds; Main picture: 1920 x 1080, 30 frames per second; Frames rendered: 837; Render settings: --phone --workers 1.
- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-007.jpg]]` — "Make a small export first": SOURCE NOTE and ACTION CARD shown again with caption "Same scene + same time → same picture", illustrating the deterministic-render requirement that both preview and export reproduce identical frames.
- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-008.jpg]]` — "Save the command that works": saved-recipe panel showing the package command `python anim.py render meeting-note-explainer --phone --workers 1`, a note that a local wrapper limited FFmpeg threads to two, and that the full command/output are saved in `learner-workspace/evidence/18-render.txt`.
- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-009.jpg]]` — "Save the command that works": "Actual exported MP4 in a browser video player" — a player panel titled STAGES / EXPORTED MP4, "Play the exported file", with the meeting-note scene and a timecode around 00:00:27; caption "This player opens the saved MP4. It is separate from the browser scene preview."
- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-010.jpg]]` — "Save the command that works": actual completed-render output filenames — `./05_render/meeting-note-explainer.mp4` (41s, audio peak -1.0 dB) and `./05_render/meeting-note-explainer-720p.mp4` (1 MiB).
- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-011.jpg]]` — "Check the file someone will watch": "Actual exported MP4" with instruction "Open the saved file and press Play"; the exported-MP4 player shows the meeting-note scene and a part-way timecode; cue "Check the picture, the voice and the complete ending".
- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-012.jpg]]` — "Check the file someone will watch": an MP4 excerpt with SOURCE NOTE and ACTION CARD side by side; caption "Actual MP4 excerpt • the correction remains visible", confirming the fix survived the export.
- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-013.jpg]]` — "Check the file someone will watch" decision card: "IF PREVIEW AND EXPORT DIFFER — Name the first different moment" then "THEN — Investigate that specific difference"; example request to compare the exported frame with the browser at that time and let the AI inspect the exporter and settings and open the new test file.
- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-014.jpg]]` — "Review the full exported result": "Actual player reached the end • 27.900 seconds" — a STAGE 5 / EXPORTED MP4 player showing the source-vs-card comparison, caption "No calendar date or extra task added"; cue "Keep the MP4 and a short note about the correction".
- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-015.jpg]]` — "Review the full exported result": SOURCE NOTE and ACTION CARD with caption "Accurate source • each field explained • time to compare", restating the final quality checks before storing the reviewed export.
- Locator: `[[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/images/frame-016.jpg]]` — "Review the full exported result": saved correction-note panel — "connect source and card during the spoken recap; move small footer labels clear of the character; preserve the source, narration and measured timings; both main and 720p exports decoded without errors; the main MP4 played to 27.900 seconds in the browser without a media error."
