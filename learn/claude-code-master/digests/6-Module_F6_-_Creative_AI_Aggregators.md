---
source: sources/claude-code-master/20261031/7-Volume F - Taste and Design/6-Module F6 - Creative AI Aggregators/6-Module_F6_-_Creative_AI_Aggregators.en.vtt
source_type: text
source_lines: 442
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- The `/generate` skill — connects Claude Code to image and video generative models so Claude produces the assets itself; every image and video in the design system the author handed out came from it, without hand prompting and without Higgsfield.
- Aggregator over a wrapper — the skill points at fal.ai (transcribed "file.ai"), a long-running service that exposes Seedance, Veo, Nano Banana and other models on pay-as-you-go terms; Higgsfield is described as just a wrapper with a monthly subscription whose unused credits do not roll over.
- Cost shape — minimum top-up around $5, the author keeps roughly $4 in credits with automatic top-up every $10, and the skill quotes the cost before generating.
- Alternative aggregators — kie.ai (transcribed "key.ai") is the cheapest but attracts heavy demand, so reliability suffers; WaveSpeed is the fallback when fal.ai is down and carries a few more niche models. Together the three cover images, videos, music and sound effects.
- Repeatable workflow — name the section, state the desired look and the design-system constraint (grayscale plus the brand red as highlight), invoke `/align` so Claude asks a few questions and confirms the prompt, approve the quoted cost, pick the model, then judge the result by eye and regenerate.
- Model choice on the demo — GPT Image 2 for the first attempt, Nano Banana for a regeneration after the initial wireframes read too small in the frame.
- Judgment rule — generated images can only be evaluated by looking at them; the author's own follow-up was a taste call (make each image larger in frame), not a correctness fix.

# L2 detail

- `#L1-L46` — Opening: images and videos are a large part of making software visually stunning; the `/generate` skill generates them inside Claude, and the design-system site shown is full of assets it made.
- `#L47-L110` — Why the skill exists: it connects Claude to fal.ai (transcribed "file.ai"), and the argument against wiring Claude into Higgsfield's CLI or MCP — a monthly subscription whose unused credits do not roll over.
- `#L111-L188` — fal.ai as an aggregator rather than a wrapper: pay-as-you-go in small increments ($5 minimum, ~$4 of credits held, auto top-up every $10), cheaper overall, and access to more underlying models.
- `#L189-L244` — Alternatives: kie.ai (transcribed "key.ai") is cheapest but swamped by demand and less reliable; WaveSpeed is the fallback if fal.ai is down and offers some niche models fal.ai does not. Three platforms cover nearly all generative models.
- `#L245-L316` — What the platforms expose (images, video, music, sound effects) and the first live task on the Agency X site: a text-heavy section titled "four things done improperly," with a prompt for four grayscale images using the design system's red as a highlight; `/align` invoked first.
- `#L317-L382` — Aligning intent: `/align` asks about image style (B, technical blueprint illustrations) and layout (beside the text), the skill reports the generation cost, the user approves it and chooses GPT Image 2.
- `#L383-L442` — Result and revision: images land on the page, the author notes he would enlarge them in frame as a taste preference, recalls that the first pass produced wireframes that were too small, and regenerated with option A using Nano Banana — you have to see images to pick between them.
