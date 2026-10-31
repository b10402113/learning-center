---
source: sources/claude-code-master/20261031/5-Volume D - Routines/2-Module D2 - Local Routines/2-Module_D2_-_Local_Routines.en.vtt
source_type: text
source_lines: 385
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Local routines are scheduled tasks that run on your own computer; they require the Claude Desktop app and live under the "Routines" tab in the left sidebar.
- A routine is literally a prompt Claude sends to itself on the cadence you set — for example, every day at 8 a.m. — and each run is a normal Claude Code session recorded in history.
- Easiest setup: start a new session and ask Claude to build the routine in chat; for the demo, a daily AI trends PDF report using the "last 30 days" skill and the "/robo" design-system skill.
- The report prompt specifies sources, cover text, a dedicated output folder, tight plain English, and no made-up numbers; Claude asks for the delivery time, runs it once for review, then offers to create the scheduled task.
- Check the first run before scheduling, and ask for visual tweaks until the output is acceptable.
- To optimize later, open the latest history session and give feedback; memory lets Claude find details such as a Telegram chat ID and add that step to the routine.
- Key limitation: local routines run only while the computer is awake, but they are the easiest type to set up.

# L2 detail

- `#L1-L50` — Definition of local routines as scheduled tasks on your own computer; Claude Desktop requirement; Routines tab; a routine is a prompt sent to itself, e.g. a daily YouTube-to-Substack routine at 8 a.m.; run history is visible.
- `#L51-L100` — Each run opens like a normal Claude Code session; Desktop app supplies the scheduling feature. Recommended build path: start a new session and ask Claude to create the routine; demo prompt for a customized PDF report on a chosen topic.
- `#L101-L150` — Prompt details: pull latest news/trends/chatter (AI trends and news from the last 30 days via the "last 30 days" skill), turn it into a short report with the "/robo" PDF design-system skill, specify cover text, a dedicated folder, tight plain English, and no invented numbers.
- `#L151-L200` — Sending the request: Claude asks what time to deliver the report, prefers a test run first, then asks whether to create the scheduled task; review the generated report's date window and headline takeaways before accepting.
- `#L201-L250` — Request visual tweaks until the output is acceptable (taste/design principles covered later); approve the schedule, which goes live daily (demo mentions 9 a.m. and then 7 a.m. as the chosen time) with stored instructions.
- `#L251-L300` — Optimizing an existing routine: open the routine's latest history session, which behaves like any Claude Code session, and ask for changes based on feedback; YouTube-check-to-Substack example with a Telegram ping request.
- `#L301-L350` — Because the memory layer exists, Claude can find account details in the workspace; it edits the routine, finds the Telegram chat ID, and the configuration now includes that command. Telegram setup is deferred to a future module.
- `#L351-L385` — Key limitation: local routines run only while the computer is awake, making them less effective than cloud routines, but they remain the easiest to set up.
