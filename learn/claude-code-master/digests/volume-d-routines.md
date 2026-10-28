---
source: sources/claude-code-master/20261028/5-Volume D - Routines
source_type: text
source_lines: 397
status: absorbed
absorbed_at: 2026-10-28
created: 2026-10-28
updated: 2026-10-28
---

# L1 overview

**Volume D — Routines** (7 lessons with full transcripts; line numbers below are real `.txt` lines). Routines are the R of ARMS: Claude working on its own on a schedule. The volume teaches three kinds of routine plus two tips and a bonus agent.

- **D1 Intro to Routines** — routines = Claude Code running without you. Comes third in ARMS because it only pays off once skills and memory are set (otherwise you automate work that misses the mark). Automating more burns more tokens; the three types are local, cloud, and token-free. Big win: recurring PDF reports / presentations generated without lifting a finger.
- **D2 Local Routines** — a local routine is literally a prompt Claude sends itself on a schedule, run by the Claude Desktop app (needs it). Build it by describing what you want in chat; fold in skills (/last30days, /robo) to produce a polished PDF report; check the first run; then set the schedule. Optimize later by opening the routine's latest session and asking in plain English. Limitation: only runs while your computer is awake.
- **D3 Cloud Routines** — runs even when your device is off, but runs on Anthropic's servers, so it cannot see skills living on your local machine (the demo shows /robo silently failing). Fix: put skills in a private GitHub repo and attach it to the routine; connect GitHub via the connectors menu first.
- **D4 Deterministic Routines** — the third kind, via modal.com: Claude designs and codes the automation, then deploys it to Modal which handles scheduling. Because it's deterministic code with no LLM in the loop, it costs **zero tokens**. Rule of thumb: if the automation needs a "brain," use a Claude routine (local/cloud, costs tokens); if it's pure deterministic work, use Modal (free). Demo builds a Reddit/HN digest that emails you a summary (Resend for email, Modal secret vault for the API key).
- **Tip: Model use to save tokens** — scheduled routines should use a cheaper model (switch from default Opus down to Haiku) for simple jobs like daily reminders.
- **Tip: Voice Dictation** — voice prompting is ~3x faster than typing; free options (app record button, Windows key + H), paid tool = Aqua Voice (custom dictionary auto-corrects AI terms), alternative Wispr Flow.
- **Bonus: The Hermes Agent Masterclass** — the presenter's preferred 24/7 setup: a Hermes agent with its own VPS computer, messaged on Telegram, with skill files synced from the laptop, so it can run routines with /last30days and /robo.

# L2 detail

- `#L1-L39` — sources/claude-code-master/20261028/5-Volume D - Routines/1-Module D1 - Intro to Routines/1-Module_D1_-_Intro_to_Routines.txt — what routines are, why third in ARMS, token trade-off, preview of local/cloud/token-free.
- `#L1-L96` — sources/claude-code-master/20261028/5-Volume D - Routines/2-Module D2 - Local Routines/2-Module_D2_-_Local_Routines.txt — local routine = scheduled self-prompt; Desktop app; build via chat; fold in skills; check first run; schedule; optimize via session; runs only while awake.
- `#L1-L81` — sources/claude-code-master/20261028/5-Volume D - Routines/3-Module D3 - Cloud Routines/3-Module_D3_-_Cloud_Routines.txt — cloud routines run when device off; local skills missing (demo failure); fix with private GitHub repo; connect GitHub connector.
- `#L1-L13` — sources/claude-code-master/20261028/5-Volume D - Routines/4-Tip - Model use to save tokens/4-Tip_-_Model_use_to_save_tokens.txt — switch routine model from Opus to Haiku to save tokens.
- `#L1-L111` — sources/claude-code-master/20261028/5-Volume D - Routines/5-Module D4 - Deterministic Routines/5-Module_D4_-_Deterministic_Routines.txt — Modal.com automations; Claude codes+deploys; zero tokens; brain vs no-brain rule; digest.py; Resend + secret vault.
- `#L1-L36` — sources/claude-code-master/20261028/5-Volume D - Routines/6-Tip - Voice Dictation App I Use/6-Tip_-_Voice_Dictation_App_I_Use.txt — voice prompting 3x faster; built-in options; Aqua Voice / Wispr Flow.
- `#L1-L21` — sources/claude-code-master/20261028/5-Volume D - Routines/7-🎁 The Hermes Agent Masterclass/7-🎁_The_Hermes_Agent_Masterclass.txt — Hermes agent on a VPS, Telegram, synced skills, 24/7 routines.
