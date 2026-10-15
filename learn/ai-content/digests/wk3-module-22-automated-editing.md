---
source: Module 22 - Automated Editing
source_type: text
source_lines: 917
status: absorbed
absorbed_at: 2026-10-15
created: 2026-10-15
updated: 2026-10-15
---

# Digest — Module 22 - Automated Editing

## Overview (L1)

- This lesson covers **automated editing** with agents and introduces **RUBRIC Editor**, the piece of software that lets you edit videos at scale with a `/cut` skill.
- Its through-line: edit a few pieces by hand first so you can tell when your agent gets a cut wrong, then hand the cutting to `/cut` and review it in RUBRIC Editor, in a loop the instructor calls **Reinforcement Learning**.
- Teaches how `/cut` works under the hood: your agent transcribes the recording with a timestamp for every word, so it knows what you said and when; by default it keeps the last clean take of every line.
- Teaches the review loop: play clips, extend or trim them, split with C, comment, then "Teach my /cut" and "Copy comments for all clips" and send them back so the agent fixes every clip and increasingly learns your preferences.
- Teaches that you can use your own editor instead: connect Adobe Premiere Pro via an MCP connector, or run `/search-connectors` for DaVinci Resolve, Final Cut Pro or anything else; CapCut is suggested for the by-hand round.
- Also notes the optional `/animate` step (adds animations on top of a cut) and links the bonus page with the instructor's own lessons on it.
- Learner outcome: set up RUBRIC Editor + `/cut`, edit a first round by hand, then run the comment→fix→render loop and export an approved cut (default 1080p).

## Sections (L2)

### overview

- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/11-Module 22 - Automated Editing/index.html#overview]]`
- Summary: The lesson's stance on when to automate editing.
- Key claims: Edit a few pieces by hand first, so you can tell when your agent gets a cut wrong; then hand the cutting to /cut and review it in RUBRIC Editor, in a loop called Reinforcement Learning.
- Learner-relevant: Frames automated editing as a trained loop, not a one-shot; sets the by-hand prerequisite.

### what-youll-learn

- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/11-Module 22 - Automated Editing/index.html#what-youll-learn]]`
- Summary: The written page's learning objectives.
- Key claims: How /cut works — a transcript with the time of every word, then the last clean take of every line; review in RUBRIC Editor, trim and comment, Teach my /cut, then Export and your agent renders it; if you prefer your own editor, connect Premiere Pro with an MCP or run /search-connectors.
- Learner-relevant: Lays out the three tracks: the /cut mechanism, the review loop, and using your own editor.

### edit-a-few-by-hand-first

- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/11-Module 22 - Automated Editing/11-Module_22_-_Automated_Editing.en.vtt#edit-a-few-by-hand-first]]`
- Summary: Why beginners should edit manually before automating.
- Key claims: It is always good practice to try editing a few videos yourself first, to get a feel for the cuts and the editing experience; you don't need to do it 10 or 20 times — the first or second video is enough; using TikTok's and Instagram's editors gives you the experience and also warms up your account (a topic reserved for the next module); the written page suggests the app you post to or CapCut for this by-hand round.
- Learner-relevant: Grounds the learner in manual editing and links it to account warm-up.

### get-rubric-editor

- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/11-Module 22 - Automated Editing/index.html#get-rubric-editor]]`
- Summary: Installation of RUBRIC Editor and its /cut skill.
- Key claims: Download RUBRIC Editor and copy its install prompt, then send it to your agent; like RUBRIC Scripts it runs on your own computer and opens in your browser (a local host URL); it ships with the /cut skill — give it your raw recording and your agent cuts it and puts it on RUBRIC Editor for you to review.
- Learner-relevant: Concrete setup; clarifies it's local and browser-based, driven by /cut.

### how-cut-works

- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/11-Module 22 - Automated Editing/11-Module_22_-_Automated_Editing.en.vtt#how-cut-works]]`
- Summary: The mechanism behind /cut, explained for the purpose of teaching it your preferences.
- Key claims: You give your raw recording (MKV or MP4) via a file path; the agent transcribes the video and, beyond grabbing the words, puts a timestamp on each word — that's how Claude knows what to keep, cut and where; the tool used by default is AssemblyAI; the default rule is that the last take is kept (like when someone has a false start at the beginning); this rule can be amended so /cut slowly learns which takes to cut and which pauses to keep; after that the agent reads the final cut and uploads it to RUBRIC Editor for review. The example: a ~14-minute single-take MKV of the instructor reading from the teleprompter was turned into 8 reels.
- Learner-relevant: Explains why commenting in RUBRIC Editor improves future cuts — the learner is training the agent.

### transcription-services

- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/11-Module 22 - Automated Editing/11-Module_22_-_Automated_Editing.en.vtt#transcription-services]]`
- Summary: Comparison of the transcription options /cut can use.
- Key claims: AssemblyAI is the default (fast, paid per hour) — an hour of video transcribes in ~33 seconds; OpenAI Whisper is free and runs on your own computer, so it is much slower (a one-hour video took roughly 15 minutes, depending on CPU) — you can configure /cut to use it instead; ElevenLabs Scribe is roughly as fast as AssemblyAI but a bit pricier, good if you already pay for ElevenLabs; for AssemblyAI or ElevenLabs you open the site, make an API key and ask Claude how to connect it safely (never paste the key into a chat log or a shared file); by the end your videos have word-level timestamps.
- Learner-relevant: Lets the learner pick a transcription service on cost/speed/privacy trade-offs.

### reviewing-in-rubric-editor

- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/11-Module 22 - Automated Editing/11-Module_22_-_Automated_Editing.en.vtt#reviewing-in-rubric-editor]]`
- Summary: How to review and correct cuts inside RUBRIC Editor.
- Key claims: The interface familiar to Premiere users (Ctrl to zoom the timeline, Shift to scrub, R for raw footage, S/D for speed, C to split a clip); the instructor reviews clips in one go, usually at 2x speed, listening for false starts that were wrongly included; extending a clip automatically adds a comment to that exact clip; dragging deletes unwanted parts; there are toggles at the top to teach your /cut skill and your /animate skill; "Copy comments for all clips" copies all open items across all clips so you can paste them to Claude, which is more precise and faster than typing; in the beginning you may be disappointed, but as you train Claude it gets to where cutting is correct almost every time.
- Learner-relevant: The hands-on editing/review loop that produces clean clips and trains the agent.

### reinforcement-learning-loop

- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/11-Module 22 - Automated Editing/index.html#reinforcement-learning-loop]]`
- Summary: Names and explains the improvement loop.
- Key claims: Review in RUBRIC Editor, trim and comment, Teach my /cut, then Export and your agent renders it; the instructor says that in its essence is what reinforcement learning is about — in RUBRIC Editor you're doing a mini version of it.
- Learner-relevant: Gives the loop a memorable name so the learner keeps running it.

### render-and-export

- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/11-Module 22 - Automated Editing/index.html#render-and-export]]`
- Summary: Turning an approved cut into files.
- Key claims: Once clips are edited and the agent resolved your comments, ask Claude to render them; there is an expert button to choose resolutions; the export prompt asks the agent to export at 1080p, ask which project/clip(s), render from the approved cut with every trim, and confirm the file location and full audio playback.
- Learner-relevant: The completion step that yields distributable reels.

### own-editor-connectors

- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/11-Module 22 - Automated Editing/11-Module_22_-_Automated_Editing.en.vtt#own-editor-connectors]]`
- Summary: Using a familiar editor instead of rendering directly.
- Key claims: Users of Adobe Premiere or Final Cut Pro can let Claude Code use those tools through MCP connectors (a kind of plugin for Claude Code); the instructor uses Premiere Pro mainly for long-form videos and renders short-form directly; the prompt links the Adobe Premiere Pro MCP (github.com/hetpatel-11/adobe_premiere_pro_mcp) and asks the agent to read the README, install step by step, test by opening a project and listing sequences, and wait before changing anything; for DaVinci Resolve, Final Cut Pro or others, use /search-connectors (look for official connectors first, then community ones, check they're maintained, and wait before installing); a lot of open-source connectors have become available because of AI agents.
- Learner-relevant: Lets learners with existing editor skills keep them while still automating.

### animate-optional

- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/11-Module 22 - Automated Editing/index.html#animate-optional]]`
- Summary: Pointer to the optional animations step.
- Key claims: If you want animations, /animate adds them on top of your cut — it's optional and more advanced, so you can skip it for now; the bonus page after this lesson links the instructor's own lessons on it.
- Learner-relevant: Clarifies animations are a separate, later skill, not required to finish this module.

### prompts-to-send-your-agent

- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/11-Module 22 - Automated Editing/index.html#prompts-to-send-your-agent]]`
- Summary: Copy-paste prompts for every automated-editing action.
- Key claims: "Cut a recording with /cut" (give the path to your raw recording plus a line of context — e.g. one long take of N short videos read from a teleprompter, cut each into its own clean vertical clip on one RUBRIC Editor); "let /cut ask you everything" (step by step: where's the recording and what is it, transcribe and keep the last clean take, cut pauses/false starts, dry run showing kept text before rendering, then put it on RUBRIC Editor, and when notes come back fix the cut and record what you liked/disliked so the next cut starts closer); "Pick your transcription service" (choose AssemblyAI / Whisper / ElevenLabs Scribe, connect the API key safely, amend /cut, run a quick test, and report time and rough cost per hour); "Export your cut" (1080p, ask project/clip(s), render from the approved cut with every trim, report location and check audio); "Connect Premiere Pro" (read the README, install step by step, test, wait before changes); "Find a connector for your editor" (/search-connectors for Premiere/DaVinci/Final Cut, official first then community, tell the best one, wait before installing).
- Learner-relevant: Ready-to-run commands across the whole automated-editing workflow.

### resources

- Locator: `[[sources/ai-content/20261015/4-Wk3 - Content Creation/11-Module 22 - Automated Editing/index.html#resources]]`
- Summary: Linked tools, tutorials and worked examples.
- Key claims: RUBRIC Editor download + install prompt (RUBRIC course, Micro Apps; ships /cut); "What MCP connectors are" (Module E2 in The Claude Code Masterclass); /search-connectors (j1, Jay's More Agentic Skills); /animate in Jay's Resources plus the bonus lessons page; the instructor's 3 shorts on YouTube (3 SEO plugins, 4 ChatGPT words, 4 GPT-6 prompts) cut by the agent and reviewed in RUBRIC Editor, the same 3 on TikTok, and a long video ("9 NEW Claude Mods that can truly change how you work"); transcription comparison (AssemblyAI, ElevenLabs Scribe, OpenAI Whisper, Artificial Analysis leaderboard); Adobe Premiere Pro MCP; "What is the Model Context Protocol"; DaVinci Resolve (built-in MCP in Resolve 21.1 and a community MCP on GitHub); Final Cut Pro (fcp-mcp-server and fcp-mcp); CapCut.
- Learner-relevant: Everything needed to replicate and go deeper, with real cut examples to compare against.
