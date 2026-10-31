---
source: sources/claude-code-master/20261031/7-Volume F - Taste and Design/9-Module F8 - Backend Rig and Audit/9-Module_F8_-_Backend_Rig_and_Audit.en.vtt
source_type: text
source_lines: 529
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Phase two of the Craft framework — "rigging" the back end: the core functionality that makes a site work, explained by the restaurant analogy where front of house is the design you see and the kitchen is the back end.
- Core functionality for the Agency X landing page — a visitor fills the contact form, the message is emailed to the address the owner declares, and the button reports success instead of doing nothing.
- Research step — ask Claude for three options for sending form email, let it plan, and it recommends Resend; sign up at resend.com, create an API key (named for Agency X with full permissions), and hand the key to Claude with "set up for me."
- Verification — submitting the form shows "Thanks, your message is in. We'll be in touch," and the email arrives from onboarding@resend.dev.
- Audit step — third phase: tell Claude to audit and test the site, click every interactive element and submit the form; Playwright (free, installed via CLI or MCP server) drives the browser and Claude returns a summary of findings and anything to correct.
- Repeatable rule — identify what the app must do, wire the service that accomplishes it, then run an agent-handled self-audit before shipping.

# L2 detail

- `#L1-L52` — Moving from a local front-end design to the web: phase two of the Craft framework, and the restaurant metaphor splitting front of house (design) from the kitchen (back end, the core functionality).
- `#L53-L110` — Scope of this build: the Agency X landing page's only real function is that a prospect clicks book a call, fills the form, and reaches the owner — but with no back end the button currently does nothing.
- `#L111-L193` — The planning prompt: set up the contact form so messages go to j@robonuggets.com, research options, and return three ways to do it — offloading solution selection to Claude the same way the front-end plan was offloaded.
- `#L194-L262` — Claude recommends Resend and the setup begins: create an account at resend.com, since the app connects through an API key rather than a dashboard integration.
- `#L263-L340` — Creating the key: name it for Agency X, grant full permission, add it, paste it into the session with "set up for me," and the form is linked to the declared address.
- `#L341-L400` — Live test: fill the form, click let's talk, get "Thanks, your message is in. We'll be in touch," and confirm the delivered email came from onboarding@resend.dev.
- `#L401-L460` — Step three, auditing agent work: prompt Claude to test that all buttons and interactive elements are clickable and that the email function works, asking for a live browser view so the audience can follow along.
- `#L461-L529` — Playwright as the mechanism (free, connected via CLI or MCP server), the run that walks the site and verifies the buttons, the findings summary, and the three-part recap: identify core functionality, wire the needed service, self-audit before deploying.
