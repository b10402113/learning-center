---
source: sources/claude-code-master/20261031/8-Volume G - Agentic OS/2-Module G2 - Skills- 3 New Levels/2-Module_G2_-_Skills-_3_New_Levels.en.vtt
source_type: text
source_lines: 765
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Level 1 — know your skill types: database skills (e.g. `/tone` for voice, `/thumb` for thumbnail references), artifact skills (HTML-first outputs such as PDFs and decks), and self-triggered skills run outside chat.
- Overfitting fix — database skills overfit to their reference corpus, so wild cards (e.g. 8 of 10 titles from references, 2 free) keep ideas fresh; a tiny `/wildcard` skill defines the behavior.
- Level 2 — model routing: send each skill to the cheapest sufficient model (`/grammar` on Haiku), and let the decision model Jeff classify which model a prompt needs.
- Level 3 — self-improving skills: feedback UIs and injected prompts teach skills automatically, so repeated use polishes them like lightweight reinforcement learning.
- Cost dashboards — top-used and token-heavy skills (e.g. `/animate`) are visible in one view so expensive, forgotten skills can be optimized or cut.

# L2 detail

- `#L1-L90` — Skills are saved instructions Claude follows when called; level 1 is knowing the skill types, which vary by work, with three observed examples. The first is database skills: not only standard operating procedures but holders of knowledge, such as `/tone`, which stores writing principles, examples, and guidelines so agents can draft in the author's voice, and `/thumb`, which holds references and file paths for shipped and inspirational thumbnails.
- `#L91-L180` — Database skills suit any repeated output type, but they risk overfitting: the agent sticks only to the given references and stops producing fresh ideas. The remedy is wild cards by default — e.g. of 10 proposed titles, eight follow the reference database and two ignore it — so good wild cards can be folded back into the database. The same applies to video animation styles, where wild-card styles produced interesting experiments.
- `#L181-L270` — Wild cards are reused so often that a short `/wildcard` skill defines what "generate wildcards" means for the agent and other skills. The second type is artifact skills, used because chat is not the best presentation surface for infographics, slide decks, or PDFs; HTML is the one format agents handle well, so a `/robo` artifact skill doubles as the design system that produces PDF guides (HTML first, then export) and links to an HTML brand book of colors and fonts.
- `#L271-L360` — The brand book avoids the sloppy "vibe coded" default look. A pro tip is an artifacts inbox: a ring at the top of the OS where Claude parks every artifact so older ones can be searched directly instead of paying tokens to have Claude find them.
- `#L361-L450` — The artifacts inbox shows recent items by date, then the third type: self-triggered skills, which make sense to trigger outside the chat, such as `/cleanup` run when the computer slows from temporary files Claude left. These can expose model and effort selection, and they rely on a little-known Claude feature, Claude-P, which activates Claude in the background by sending it a prompt without opening chat; a simple report of what was fixed is returned. Level 1 recap: being conscious of skill types improves output; level 2 is optimizing skills for money and time via model routing.
- `#L451-L540` — Model routing means sending each skill to the right model; beginners often forget which skills they use and run simple, clearly scripted skills on bigger, costlier models. `/grammar`, which only checks spelling, runs on Haiku and answers faster and cheaper. Jeff, a classification-style decision model, is about 200x faster and 400x cheaper than frontier models and can decide which model to route a prompt to.
- `#L541-L630` — Routing data: 4,451 routing decisions in recent weeks, each taking 0.6 seconds, costing 18 cents in total, with about 4 in 10 routed to a cheaper model instead of a bigger one; the author never felt the downgrade, which is the test for whether Jeff routing suits you. A dashboard showing top-used skills helps spot which skills drain usage.
- `#L631-L720` — The most-used skill is `/animate` (token-intensive video work), so a ranked list lets you eyeball skills costing money that you forgot using. Level 3 is designing skills to be self-improving: a custom community app, the rubric editor, lets comments be pinned on clips with voice transcription plus timestamp and pin location, and all comments are copied and sent to Claude.
- `#L721-L765` — The rubric editor has a toggle that teaches the `/cut` and `/animate` skills whenever feedback is given; with it on, pasted comments automatically attach a prompt asking the agent to update those skills. This creates self-improvement on every feedback round — a simple version of the reinforcement learning top AI labs use — and a view of heavily used skills shows where to automate that polishing.
