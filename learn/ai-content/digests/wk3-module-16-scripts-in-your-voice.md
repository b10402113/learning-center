---
source: Module 16 - Scripts in Your Voice
source_type: text
source_lines: 457
status: absorbed
absorbed_at: 2026-10-15
created: 2026-10-15
updated: 2026-10-15
---

# Digest — Module 16 - Scripts in Your Voice

## Overview (L1)

- Goal: keep scripts from sounding AI-written, since audiences increasingly spot ChatGPT-style patterns and scroll on.
- Core fix: build a reusable "tone of voice" skill (/tone) that records how the learner actually speaks — their words, sentence length, openings/closings, jokes, quirks, and things they never say — so any model writes in their voice.
- /tone can be built from existing chats with the agent, by interviewing the learner, or by modeling a creator they admire (example: Two Minute Papers) using video transcripts.
- Refine /tone with a humanizer skill that detects AI tells, then add the tells the learner would never say to /tone as banned phrases.
- Two skills (/hooks and /tone) turn an idea into a script the learner reads aloud; later, RUBRIC Scripts centralizes scripts and sends them to a teleprompter.

## Sections (L2)

### ai-slop-problem
- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/4-Module 16 - Scripts in Your Voice/4-Module_16_-_Scripts_in_Your_Voice.en.vtt#ai-slop-problem]]`
- Summary: The last thing the creator wants is to be identified as someone whose scripts are written by AI; as AI spreads, people spot ChatGPT patterns more easily.
- Key claims: AI-written copy/scripts have recognizable patterns; the module teaches how to prevent sounding like AI with a repeatable skill/workflow.
- Learner-relevant: motivates building a personal tone skill.

### build-tone-skill
- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/4-Module 16 - Scripts in Your Voice/4-Module_16_-_Scripts_in_Your_Voice.en.vtt#build-tone-skill]]`
- Summary: Create a /tone skill from how the learner already talks to the agent; if they are new to agents, the prompt interviews them about their normal speaking style to build a baseline skill.
- Key claims: the simple command is "based on everything that you know about me, create a tone of voice skill based on how I talk to you"; the skill is model-agnostic and refined over time; the humanizer refinement removes prevailing AI/slop words.
- Learner-relevant: the primary method to make any model write in the learner's voice.

### model-a-creator
- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/4-Module 16 - Scripts in Your Voice/4-Module_16_-_Scripts_in_Your_Voice.en.vtt#model-a-creator]]`
- Summary: If not naturally a talker or wanting to emulate a creator, have the agent study that creator's YouTube transcripts. It recommends using the YouTube transcript button or the open-source tool yt-dlp to pull subtitles.
- Key claims: study the last few videos of one creator, or mix two creators; treat their style as inspiration, not a copy, since being a clear copy is undesirable; the prompt tells you plainly if a transcript fails so you can paste it.
- Learner-relevant: a technique to bootstrap a voice when starting, then make it your own.

### humanizer-refinement
- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/4-Module 16 - Scripts in Your Voice/4-Module_16_-_Scripts_in_Your_Voice.en.vtt#humanizer-refinement]]`
- Summary: Use the humanizer skill (from a popular GitHub repo, built on Wikipedia's "Signs of AI writing") to detect AI tells in recent writing; the learner decides which tells they would never say and adds them to /tone.
- Key claims: the humanizer keeps up with current AI vocabulary; run it over recent output, ask "would I ever say this?" one at a time, and add the rejects to /tone as "things I never say"; rerun whenever a draft still sounds like AI.
- Learner-relevant: a feedback loop that continuously removes AI-sounding language.

### write-a-script
- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/4-Module 16 - Scripts in Your Voice/4-Module_16_-_Scripts_in_Your_Voice.en.vtt#write-a-script]]`
- Summary: Getting a polished script is grabbing an idea, telling the agent to invoke /hooks (hook options) and /tone (voice), and reading it aloud; the learner still applies their own taste for their industry.
- Key claims: /hooks supplies hook examples and /tone refines voice; the improvement over last week's posts comes from running ideas through these skills; the learner must apply personal taste.
- Learner-relevant: the end-to-end idea→script workflow.

### improve-skills-every-session
- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/4-Module 16 - Scripts in Your Voice/4-Module_16_-_Scripts_in_Your_Voice.en.vtt#improve-skills-every-session]]`
- Summary: The downloaded skills are baselines; update them by telling the agent to update skills based on the feedback given in the session.
- Key claims: refine and polish /hooks and /tone to the learner's needs; the update prompt lists each change, asks which to keep, and shows what changed.
- Learner-relevant: a maintenance habit that makes the skills better over time.

### rubricscripts-centralize
- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/4-Module 16 - Scripts in Your Voice/4-Module_16_-_Scripts_in_Your_Voice.en.vtt#rubricscripts-centralize]]`
- Summary: Managing scripts only through a chat window is a poor experience; RUBRIC Scripts centralizes scripts, sends them to a teleprompter, and lets the learner record shorts in one go.
- Key claims: RUBRIC Scripts centralizes scripts and supports a teleprompter and batch recording; covered in a later module.
- Learner-relevant: points to the software that operationalizes the skills.

### written-page-and-prompts
- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/4-Module 16 - Scripts in Your Voice/index.html#written-page-and-prompts]]`
- Summary: The written page states "AI slop is writing that sounds like every other AI" and gives five copy-paste agent prompts (build /tone, model a creator, refine with humanizer, write an Instagram short script, and update skills from session feedback), plus resources.
- Key claims: /tone is read by the agent every time it writes; the Instagram-short prompt asks who it's for, the real result/proof (never invent one), writes 3 hooks via /hooks, drafts with /tone, and cuts anything the learner would stumble on; resources include the humanizer (github.com/blader/humanizer), /hooks, Wikipedia's "Signs of AI writing", Two Minute Papers, YouTube transcript help, and yt-dlp.
- Learner-relevant: ready-to-run prompts and links to build and refine the voice workflow.
