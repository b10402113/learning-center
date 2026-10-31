---
source: sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/3-Module A3 - Pricing and Usage/3-Module_A3_-_Pricing_and_Usage.en.vtt
source_type: text
source_lines: 382
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Plan tiers — Anthropic's free plan only covers the claude.ai chat app, not Claude Code; Claude Code requires at least Pro at $20/month monthly ($17/month annual), which the author recommends as the starting point.
- Max tiers — Max includes all Pro features and comes as Max 5x at $100/month or Max 20x at $200/month, meaning 5x or 20x the Pro token budget rather than a published absolute.
- Tokens — a token is roughly four letters; "Build your operating system" is five tokens; tokens are the base unit of AI work, analogous to kilobytes/megabytes for the internet, and plans are like telco data plans except Anthropic, OpenAI, and Google publish only relative multipliers, not absolute token counts.
- `/usage` — shows remaining usage. Claude Code tracks three limits: a 5-hour session limit (the demo shows 89% remaining with a reset in three hours), a weekly limit (demo: 98% remaining, resets in six days), and a separate weekly Sonnet limit if Sonnet is the default.
- Usage insights — Anthropic now shows what contributes to usage, filterable by day or week, to help manage consumption.

# L2 detail

- `#L1-L70` — Why pricing matters (rate limits), the free plan being claude.ai chat only, Pro at $20/month ($17 annual) as the minimum for Claude Code, and starting on Pro.
- `#L71-L145` — Max 5x ($100/month) and Max 20x ($200/month), both including all Pro benefits, defined as 5x/20x Pro token budgets; begins defining "token".
- `#L146-L230` — Token definition: ~4 letters per token, "Build your operating system" = 5 tokens, tokens as the basic unit of AI agents, and the telco data-plan analogy (Optus example, $60/month plans).
- `#L231-L310` — AI labs publish only relative multipliers (5x/20x Pro) not absolute millions of tokens; entering `/usage` in Claude Code shows remaining budget.
- `#L311-L382` — The three limits in `/usage`: 5-hour session (demo 89% left, resets in 3 hours), weekly (demo 98% left, resets in 6 days), and weekly Sonnet usage; filtering Anthropic's usage insights by day or week.
