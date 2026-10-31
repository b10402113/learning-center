---
source: sources/claude-code-master/20261031/3-Volume B - Skills/5-Module B5 - How many Skills is too many-/5-Module_B5_-_How_many_Skills_is_too_many-.en.vtt
source_type: text
source_lines: 289
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- The answer — as many as does not confuse you or Claude is most likely fine; there is no hard skill cap.
- Auditing is easy — skills are just text files and assets Claude can parse quickly, so an audit prompt can list overlapping skills, suggest merges, and recommend keep / cut / combine; cleanup can take under 30 minutes.
- Token cost on limited plans — on the Pro plan with fewer tokens, cleaning up skills may be worth it for token economy.
- Measuring preload — `/context` in a fresh session shows exactly how many tokens are preloaded; any chat message immediately consumes about 27,000 tokens in the demo.
- Skill description cost — the `/context` view reports how much the skill descriptions consume: about 180 skills cost ~13,700 tokens, small against Opus 4.8's 1M-token context window.
- Checking usage impact — `/usage` (or account and usage) shows the weekly rate limit (6% in the demo); sending a test message loads the prompt plus the 27,000 pre-injected tokens, totaling ~28,000; if the ticker does not move, skills are not materially affecting limits.
- Closing challenge — save a skill today and build a few yourself; many workflows can be automated just by talking to Claude Code and having it save the skill at the end of the session.

# L2 detail

- `#L1-L51` — Common community question: how many skills is too many. Answer: as long as it does not confuse you or Claude, it is most likely fine. Building a skill library stays manageable because Claude Code can audit on its own.
- `#L52-L85` — Skills are just text files, code, and assets Claude can parse at speed. Copy an audit prompt to have Claude list overlapping or mergeable skills and suggest which to keep, cut, or combine; cleanup can take less than 30 minutes.
- `#L86-L129` — Token consideration on the Pro plan, which has more limited tokens than Max: cleaning skills may be worth it to maximize token usage. Type `/context` in a fresh Claude Code session to see exactly how many tokens are preloaded; a chat message immediately consumes around 27,000 tokens.
- `#L130-L164` — The `/context` view shows how many tokens skill descriptions consume: roughly 180 skills consume about 13,700 tokens, minuscule against Opus 4.8's 1 million token context window.
- `#L165-L263` — Measuring pre-injected system prompt share: go to account and usage or type `/usage`; check the weekly rate limit (most people hit it) — 6% on the Max plan in the demo. Sending a test message loads the prompt plus the 27,000 pre-injected tokens, about 28,000 total; if the ticker does not move, skills are not materially affecting plan limits. 27,000 tokens looks large but is not that big.
- `#L264-L289` — Wrap-up of skills from A to Z, with a challenge: save a skill today, make a few yourself, automate workflows by talking to Claude Code and having it save the skill for next time.
