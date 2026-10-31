---
source: sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/5-Module A5 - Models/5-Module_A5_-_Models.en.vtt
source_type: text
source_lines: 307
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Four tiers — Anthropic used to have Haiku, Sonnet, and Opus and has added a fourth tier, Fable; the model can be switched freely from the command menu, which cycles through all four.
- Capability ladder — Haiku is the least token-intensive and cheapest but least powerful; moving up the tiers increases both capability and cost.
- Defaults — on Pro, default to Sonnet because Opus or Fable as a daily driver burns through 5-hour and weekly rate limits quickly; on Max, Opus is reasonable. The author runs Opus as default and is testing Fable, and almost never uses Haiku except for very simple tasks when hitting limits.
- API pricing — per million tokens, Fable costs $10 per million input tokens; output tokens (messages, thinking, tool calls) cost more than input tokens. Fable is about 2x Opus, Opus about 60% more than Sonnet, and Sonnet about 3x Haiku.
- Subscription vs API — monthly plans are heavily subsidized, so subscribers do not pay these token prices directly; the API prices apply when using the models outside Claude Code, or when enabling usage credits after hitting a limit, which is much more expensive than the subscription.

# L2 detail

- `#L1-L60` — Haiku, Sonnet, Opus plus the new Fable tier; switching models in the command menu; capability and cost both rise across the tiers.
- `#L61-L140` — Model recommendations: Sonnet default on Pro to avoid rate limits, Opus on Max, the author's own Opus-plus-Fable testing, Haiku for simple tasks, and "no right or wrong answer" caveat.
- `#L141-L215` — Cost table per million tokens: input tokens (prompts) vs output tokens (messages, thinking, tool calls); Fable ~2x Opus, Opus ~60% over Sonnet, Sonnet ~3x Haiku.
- `#L216-L307` — Subscription plans being far cheaper than API prices, API prices applying outside Claude Code or after limits, account settings → usage limits, and enabling usage credits (billed at API prices).
