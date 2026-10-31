---
source: sources/claude-code-master/20261031/5-Volume D - Routines/3-Module D3 - Cloud Routines/3-Module_D3_-_Cloud_Routines.en.vtt
source_type: text
source_lines: 325
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Cloud routines keep running even when your device is off; you start from the Routines tab, type what to automate, and click "draft routine" to have Claude build it as a cloud routine.
- A cloud routine can mirror the local example (daily AI trends/news report from the last 30 days) but the skills it invokes, such as "/last 30 days" and "/robo", live on the local device.
- In a test run the cloud session sent itself the prompt but could not use the local skills, so the PDF fell back to the default purple AI design.
- Cause: the cloud session runs in an Anthropic-hosted container on Anthropic's servers, which has no access to the skills on your computer.
- Fix: edit the routine and select a GitHub repository; a private repo dedicated to cloud routines can hold the skills (e.g. a newsletter skill) so cloud runs can use them.
- If no GitHub repo option appears, go to Customize → Connectors → GitHub and complete single sign-on to connect Claude to the GitHub account.
- Trade-off: local is easy and uses device skills but needs the machine awake; cloud runs anytime but needs skills uploaded to GitHub and configured.
- Preview of a third type: deterministic pipelines that require no tokens.

# L2 detail

- `#L1-L50` — Cloud routines run even when the device is off, with caveats. Setup starts in the Routines tab: type the desired automation, paste the provided prompt, and click "draft routine" because the request states it should be a cloud routine.
- `#L51-L100` — The cloud build mirrors the previous module: a daily report on AI trends and news from the last 30 days. The demo still invokes skills such as "/last 30 days" and "/robo", but those skills are installed on the local device.
- `#L101-L150` — A manual "run now" test sends the prompt to itself, but the run cannot use the last 30 days or "/robo" skills. The resulting PDF shows the default purple AI design instead of the custom design-skill output.
- `#L151-L200` — Explanation: the cloud session runs on a computer Anthropic hosts and sets up a private cloud container on Anthropic's servers. Anthropic cannot access skills stored on your local computer.
- `#L201-L250` — Trade-off summary: cloud routines run while the computer is off but require more setup if local skills are needed. To grant access, edit the routine and select a GitHub repository from the repository picker.
- `#L251-L300` — A dedicated private GitHub repo for cloud routines holds the skills; the example shows a newsletter skill uploaded so a cloud routine can use it. A provided prompt can have Claude create that repo for you.
- `#L301-L325` — If GitHub options are missing, use Customize → Connectors → GitHub and complete the single sign-on flow. Recap of local vs cloud, then a preview of the third routine type: deterministic pipelines that consume no tokens.
