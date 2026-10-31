---
source: sources/claude-code-master/20261031/8-Volume G - Agentic OS/3-Module G3 - Routines- 3 New Levels/3-Module_G3_-_Routines-_3_New_Levels.en.vtt
source_type: text
source_lines: 313
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Level 1 — active vs passive routines: active routines always hand back an output to review (daily email digest to Telegram), passive ones stay quiet and only ping when something is worth flagging (weekly brand-watch scan).
- Output discipline — running many active routines means dozens of reviews per day; passive routines (domain/TLD scouting, machine cleanup) keep the queue empty unless action is needed.
- Level 2 — capped routines: every scheduled task costs plan usage or API credits, so a routines tab sorted by tokens per week exposes expensive ones that can be optimized or given a weekly spend cap.
- Level 3 — a routine that suggests routines: a Friday job scans recent sessions for work you repeat by hand and proposes automations through a localhost micro app (Rubric Recos) reviewed before usage resets.
- Weekly loop — cart-style review of recommendations sent back to Claude closes the self-improvement cycle, so the OS improves with use.

# L2 detail

- `#L1-L40` — Routines are tasks Claude runs on a schedule; level 1 is knowing active versus passive routines. Active routines do a job and hand back an output to review, such as a daily inbox digest that reads email and sends a Telegram summary; passive routines run in the background and only ping when they find something worth flagging.
- `#L41-L80` — Passive example: a weekly "brand watch" routine checks the internet for sites or domains using the RoboNuggets brand without approval and alerts only when one exists. This matters because if every routine were active, 50 routines would produce 50 things to review each week, or each day, which is not sustainable.
- `#L81-L120` — Once passive routines are understood, routines get more creative: one can scout relevant domain names or TLDs and ping when a good one frees up, or look after the machine by clearing old files or flagging slowing applications. Level 2 is then about capped routines, since every scheduled task costs plan usage or API credits.
- `#L121-L160` — With many routines it is easy to lose track of expensive ones, so the OS has a routines tab showing scheduled tasks across the week and sorting them by weekly token use, revealing routines that drain usage without business value.
- `#L161-L200` — The same view shows which routines run at which times. When one costs a lot, the fix is to ask Claude to optimize the scheduled task and bring token usage down, for example capping a routine that costs about 18 million tokens or $10 in API credits per week at $4 per week; Claude can often trim most of the fat.
- `#L201-L240` — Level 3 is a routine that suggests routines, because the best routines are jobs already done by hand but not noticed as repetitive. Every Friday morning a scheduled task looks back through sessions and spots repeated jobs, suggesting routines inside a micro app called Rubric Recos.
- `#L241-L280` — Rubric Recos is a community toolkit used at the end of the week before usage resets: improvements worth automating are reviewed, added to a cart if reasonable, checked out, and copied to Claude to apply to the setup. It runs as a browser app on localhost, i.e. on the user's own computer, and its routines tab lists ideas for tasks worth automating.
- `#L281-L313` — The design lets Claude surface ways to automate the setup, so the weekly self-improvement cycle makes the operating system better the more it is used; a shown prompt is enough to start.
