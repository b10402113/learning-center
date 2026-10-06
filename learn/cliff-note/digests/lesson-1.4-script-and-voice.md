---
source: 4-1.4 Ask for a Script, Then Make the Voice
source_type: text
source_lines: 430
status: absorbed
absorbed_at: 2026-10-06
created: 2026-10-06
updated: 2026-10-06
---

# Digest — 1.4 Ask for a Script, Then Make the Voice

## Overview (L1)

- Lesson 1.4 of Module 1 ("Your First Animation"); keeps the meeting-note-explainer project from 1.3 open, with its reviewed brief and source note "Sam will send the draft on Friday."
- The AI writes the script file and can make or import the voice; the learner's job is to check meaning (does every detail come from the source?) and delivery (can a listener follow it in time?).
- The script is authored and saved first (to the voice stage), then a voice take is produced — by recording yourself or by a speech service with a permitted voice — and the take is listened to with the script in front of you before anything else.
- Every later picture is timed to this actual recording, so the voice leads timing; fixing a rushed passage means regenerating a chunk or re-recording that passage and re-listening in context.
- Done when: a reviewed script, a listened-to voice take, and a saved note identifying the selected version, ready for the next lesson to derive timings.
- Pipeline stages shown throughout the UI: 1 VOICE · 2 WORDS · 3 CUES · 4 SCENE · 5 RENDER.

## Sections (L2)

### ask-for-the-script

- Locator: `[[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/video.en.vtt#ask-for-the-script]]`
- Summary: Recap that the project now has a brief and the original note, so the AI has something specific to write from; the learner asks the AI to read both and draft a short spoken explanation.
- Key claims: tell the AI who will watch and what they should understand; state that you want to see the script before it makes the audio; the AI can write the script file.
- Learner-relevant: establishes that the prompt must name audience + goal + a "script before audio" checkpoint — this is the anchor for the whole lesson.

### review-the-script

- Locator: `[[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/video.en.vtt#review-the-script]]`
- Summary: The learner reads what the AI actually said and confirms it is the explanation wanted; the example starts at the source node, walks through the three details (action, owner, due day), and ends by comparing the card with the note.
- Key claims: if the AI adds a calendar date or invents another job for Sam, remove it because that information was not supplied; choosing meaning is cheap while it is still one sentence; read it aloud once and ask for a simpler way to say any awkward line; save the chosen version as the script in the voice stage, where the recording will also go.
- Learner-relevant: source-fidelity check on the generated script and the save-to-voice-stage step that the audio comparison depends on.

### choose-the-voice-route

- Locator: `[[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/video.en.vtt#choose-the-voice-route]]`
- Summary: Two routes to a voice take — record yourself (assistant places a copy in this existing project's voice folder, keeping the original) or use a speech service with a voice you have permission to use.
- Key claims: the creator's own setup uses a cloned voice via 11 Labs, but the project uses your own recording or service settings; ask the assistant to explain the setup and any cost before it sends a speech request; in the prepared workspace have it follow the voice instructions and check configuration before running the speech command; no second project-creation step is needed.
- Learner-relevant: decision point (record vs TTS) plus the consent/cost/config checks that gate a paid speech request.

### generate-and-listen

- Locator: `[[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/video.en.vtt#generate-and-listen]]`
- Summary: The assistant generates the take and saves it in the right place; the learner plays the whole take with the script in front of them.
- Key claims: listen all the way through because every subsequent picture is timed to this actual recording; check that it said "Sam" clearly, kept "Friday," and gave enough time to follow the idea; the example re-reads the note against the action card so the details match.
- Learner-relevant: the core verification loop — full playback against the script, watching names/facts and pacing.

### fix-and-select

- Locator: `[[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/video.en.vtt#fix-and-select]]`
- Summary: If a sentence is rushed, point to that sentence and ask for a correction; a workspace that generates separate chunks can remake that chunk, and with your own recording you can re-record the passage, then listen to the corrected version in context.
- Key claims: keep the script and take you chose; keep the earlier version available for comparison; have the AI record which version is ready for the next stage; we let it do the writing and file work while we make the decisions about meaning and delivery.
- Learner-relevant: targeted repair rather than full regeneration, and the version-selection record that closes the lesson ("Done when...").

### images

- Locator: `[[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/images/frame-001.jpg]]` — Title card for 1.4 ("KEEP THE MEANING"): a diagram around the source ("Friday / A due day") labelling "NOT SUPPLIED" items — a calendar date and an extra task — with the instruction "If added, remove it," establishing the meaning-fidelity rule.
- Locator: `[[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/images/frame-002.jpg]]` — Split "Before / After" editor view: the "Actual first draft" `script-v1.md` beside the "agent-reviewed script" `script-reviewed.md`, both showing the action-card explanation (send the draft / Sam / Friday), with the 1 VOICE–5 RENDER stage tabs and presenter "Doug."
- Locator: `[[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/images/frame-003.jpg]]` — Decision diagram "CHOOSE YOUR VOICE": Route A "Record yourself — keep original, import a copy" vs Route B "Speech service — permissioned voice, check setup and cost."
- Locator: `[[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/images/frame-004.jpg]]` — `voice-setup.md` screenshot ("Before a paid speech request"): documents `python anim.py speak my-lesson --dry-run` vs `--check` vs `speak` (which can use paid credits), that the first fenced block in `script.md` is narration chunked ~250–700 characters, and provider-dependent adapter presets (creative=0, natural=0.5, robust=1).
- Locator: `[[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/images/frame-005.jpg]]` — "STAGE 1 / VOICE" player view: "Play the actual voice file" at `meeting-note-explainer / 01_voice / voice.mp3`, showing `0:00 / 0:27`, with the saved `script.md` kept open alongside for listening.
- Locator: `[[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/images/frame-006.jpg]]` — Concept diagram "VOICE LEADS TIMING": column 01/VOICE = "Chosen take / this exact recording" feeding 02–03/PLAN = "Words → cues / pictures follow the words."
- Locator: `[[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/images/frame-007.jpg]]` — "Listen to our example": the working voice player (`0:00 / 0:27`, 27.9 s) beside the actual saved `script.md` excerpt, explicitly labelled "Actual example audio" and "Actual saved script excerpt."
- Locator: `[[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/images/frame-008.jpg]]` — Scrolled `script.md` view for "Listen with the script open," showing the paragraph that compares the note to the card ("Sam, send the draft, Friday…") and the claim that no calendar date or extra task was added.
- Locator: `[[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/images/frame-009.jpg]]` — Another "STAGE 1 / VOICE" playback view ("Open the saved take and press Play"): the `voice.mp3` player at `0:00 / 0:27` with "Keep the saved script open while listening" and the script excerpt shown.
- Locator: `[[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/images/frame-010.jpg]]` — `voice-review.md` selection record ("Save the selected version"): input `01_voice/script.md` (83 authored words), selected output `01_voice/voice.mp3` (27.900 seconds), notes that the take came through the existing host voice workflow, and an agent review confirming the checked transcript matches the script after punctuation normalization with one trailing ASR token removed.
