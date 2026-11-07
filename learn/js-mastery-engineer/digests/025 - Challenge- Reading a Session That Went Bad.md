---
source: sources/js-mastery-engineer/20261107/supplement/025 - Challenge- Reading a Session That Went Bad.txt
source_type: text
source_lines: 168
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The challenge condenses a real session in which a notification feature drifts into an untrustworthy result without a crash or error, and the task is to find the exact turn where the mistake started, not where the symptoms appeared.
- In Turn 1 the agent greps for "notification," finds nothing, reads orders/complete.ts, and proposes a new notifications table and helper.
- Turns 2-7 add order notifications, subscription-renewal notifications, email sending, a sendEmail flag, comment notifications, and email for comments.
- Turn 8 reports duplicate order emails; the agent re-reads only the two files it already knew and finds nothing.
- Turn 9 reads lib/email/sendEmail.ts and discovers it already sends a confirmation email on order events, so the new path duplicates it.
- The solution locates the mistake in Turn 1: the first read never searched for or opened anything related to email, so the agent did not know existing email logic existed.
- The lesson ties this to the read-decide-act-observe loop, the context-gap lesson, and the codebase-reading lesson, and notes context rot and tokens do not explain this failure.
- The takeaway is a wider first read: search adjacent concepts such as email alongside notification, auth with sessions, payments with refunds.

# L2 detail

- `#L1-L16` — Challenge setup, the notification feature, and the instruction to find the origin turn before the symptoms.
- `#L17-L31` — Turns 1-2: the first grep and read, the proposal for a new notification system, and the build.
- `#L32-L47` — Turns 3-4: subscription notifications, then adding email and discovering sendEmail.ts.
- `#L48-L72` — Turns 5-6: making email conditional with a sendEmail flag, then adding comment notifications.
- `#L73-L90` — Turns 7-9: email for comments, duplicate order emails, the narrow re-read, and the eventual discovery in sendEmail.ts.
- `#L91-L100` — Warning to write an answer before scrolling and the start of the solution section.
- `#L101-L137` — Solution: Turn 1's incomplete read, the delayed symptom and diagnosis, Turn 8's narrow search, and why rot and tokens do not apply.
- `#L138-L148` — Takeaway: a wider first read and checking adjacent things the agent did not consider.
- `#L149-L168` — Module 2 closeout, recap of the machinery, and a preview of Tools, MCP, and Subagents in Module 3.
