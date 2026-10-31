---
source: sources/claude-code-master/20261031/5-Volume D - Routines/5-Module D4 - Deterministic Routines/5-Module_D4_-_Deterministic_Routines.en.vtt
source_type: text
source_lines: 445
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Third routine method: modal.com (Modal); usable without Claude or Claude Code and with no token spend per run because the automation is deterministic code.
- Workflow: Claude designs and codes an automation template in Python, uploads/deploys it to Modal, and Modal handles the schedule inside its service.
- Example "auto clipper": every day at 9 p.m. it checks the YouTube channel for a long-form upload, creates Shorts, and posts them to YouTube Shorts; set up four months earlier and never touched; Shorts reached half of the 1.5 million long-form views in 90 days.
- Modal apps appear as functions in the dashboard, comparable to n8n or Make.com but written in Python; the Python is prompted from Claude, which also handles testing and deployment.
- Modal offers substantial free-tier credits; light automations cost nothing, and the demo account paid nothing for the Shorts automation.
- Demo prompt: browse a subreddit, take the top posts, and email a summary on a regular schedule; it checks for Python and the modal package, opens a browser for login, creates an API token, and connects email via Resend.com.
- The Resend API key is stored in a Modal secret vault; the automation lives in `digest.py` and is deployed to Modal.
- Rule of thumb: if the automation needs an LLM ("a brain"), use local or cloud Claude routines and accept token cost; if it needs no thinking, Modal is nearly free.

# L2 detail

- `#L1-L50` — Introduction to the third routine method via modal.com: no Claude/Claude Code requirement and no per-run tokens. Claude designs and codes the automation, uploads the template to Modal, and Modal schedules it.
- `#L51-L100` — Dashboard "apps" are automations. The auto clipper runs daily at 9 p.m., checks for new long-form YouTube uploads, creates Shorts, and posts them. Analytics: 1.5 million long-form views in 90 days with Shorts at about half, driven by this automation.
- `#L101-L150` — The automation was set up four months earlier and untouched since; it costs no tokens per run, and a separate lesson walks through its setup. Opening the app shows functions, the automation templates, similar to n8n/Make.com but written in Python.
- `#L151-L200` — The Python was not hand-written: Claude was prompted to write it, test it, and deploy it live. Sign up at modal.com; the free tier includes many credits, and the Shorts automation account shows no cost.
- `#L201-L250` — A deployable demo prompt: browse a subreddit, fetch top posts, and email a summary regularly. It checks whether Python and the modal package are installed, connects to the account via browser login, and sets up the email connection.
- `#L251-L300` — It builds the digest, deploys it to Modal on the desired daily schedule, and explains possible next steps. A live run asks which email to use, checks packages, opens browser authorization, and reports that an API token was created.
- `#L301-L350` — Email delivery uses the free service Resend.com; create one API key and Claude stores it in a Modal secret vault so it is not exposed. The template lives in `digest.py`, contains the end-to-end automation code, and is then deployed.
- `#L351-L400` — After deployment the dashboard shows the automation live. It costs no tokens because it is a deterministic code function with no LLM calls; the lesson notes Anthropic is incentivized to sell more tokens, so deterministic automations belong on Modal.
- `#L401-L445` — If an LLM is still wanted inside a Modal automation (e.g. summarizing the Reddit digest), Claude can point to Claude API keys or OpenRouter. Rule of thumb: needs a brain → local or cloud Claude routine (tokens); no LLM → Modal is practically free. Closing: routines while you sleep.
