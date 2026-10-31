---
source: sources/claude-code-master/20261031/5-Volume D - Routines/4-Tip - Model use to save tokens/4-Tip_-_Model_use_to_save_tokens.en.vtt
source_type: text
source_lines: 53
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Because routines run on a recurring schedule, the model chosen for each scheduled task has a large effect on token spend.
- Edit the routine and change its model from the default — usually Opus, the most expensive option at the time — to Haiku, Anthropic's cheapest model.
- Save the change; doing this across routines saves tokens and helps avoid hitting usage limits early.
- Applies even to simple routines such as a daily reminder of things to keep in mind.

# L2 detail

- `#L1-L27` — Scheduled routines repeat, so be mindful of the model assigned to them; example of a simple daily-reminder routine; edit the routine to reach the model setting.
- `#L28-L53` — Switch from the default model, usually Opus and the most expensive, to Haiku, the cheapest Anthropic model, and click save; this matters more as more routines are added, saving tokens and delaying usage limits.
